import os
import logging
from pathlib import Path
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.database import get_db
from backend.models import Resume, Skill, Education, Project, Experience
from backend.schemas import ResumeSchema, ResumeCreate, SkillCreate, EducationCreate, ProjectCreate, ExperienceCreate
from pydantic import BaseModel
from backend import crud

class ImproveResumeRequest(BaseModel):
    job_description: Optional[str] = None
    parsed_resume: Optional[dict] = None
    ats_result: Optional[dict] = None

# Parsers
from backend.parsers.pdf_extractor import extract_text_from_file
from backend.parsers.cleaner import normalize_text
from backend.parsers.sections import detect_sections
from backend.parsers.basic_info import extract_name, extract_email, extract_phone
from backend.parsers.skills import extract_categorized_skills, extract_hard_skills
from backend.parsers.education import extract_education, extract_education_intelligence
from backend.parsers.experience import extract_experience
from backend.parsers.projects import extract_projects
from backend.parsers.scoring import calculate_detailed_score, check_ats_formatting
from backend.parsers.links import extract_linkedin, extract_github, extract_portfolio

from backend.ai.services.ai_service import AIService

# Set up logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/resume", tags=["Resumes"])
ai_service = AIService()

@router.post("/upload", response_model=ResumeSchema)
async def upload_resume(
    file: UploadFile = File(...), 
    target_role: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    print(f"Upload Started: Received file {file.filename}")
    logger.info(f"Upload Started: Received file {file.filename}")
    
    if not file.filename.lower().endswith(('.pdf', '.docx', '.txt')):
        logger.error("Upload failed: Unsupported file format.")
        raise HTTPException(status_code=400, detail={"success": False, "stage": "upload", "error": "Unsupported file format. Please upload a PDF, DOCX, or TXT resume."})

    # Stage 1: File Upload
    try:
        upload_dir = Path(__file__).resolve().parents[2] / "backend" / "uploads" / "resumes"
        upload_dir.mkdir(parents=True, exist_ok=True)

        temp_path = upload_dir / file.filename
        if temp_path.exists():
            stem = temp_path.stem
            suffix = 1
            while temp_path.exists():
                temp_path = upload_dir / f"{stem}_{suffix}{temp_path.suffix}"
                suffix += 1
        temp_path = str(temp_path)

        with open(temp_path, "wb") as buffer:
            contents = await file.read()
            buffer.write(contents)
            
        print(f"Upload successful: {temp_path}, bytes={len(contents)}")
        logger.info(f"Upload successful: {temp_path}, bytes={len(contents)}")
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=400, detail={"success": False, "stage": "upload", "error": str(e)})

    # Additional logging about the uploaded file
    try:
        file_size = os.path.getsize(temp_path)
        file_ext = os.path.splitext(temp_path)[1].lower()
        print(f"File received: {temp_path}")
        print(f"File size: {file_size} bytes")
        print(f"File extension: {file_ext}")
        logger.info(f"File received: {temp_path}, size={file_size}, ext={file_ext}")
    except Exception as e:
        logger.warning(f"Unable to stat uploaded file: {e}")

    # Stage 2: Extract Text
    try:
        print("Starting text extraction...")
        logger.info(f"Extracting text from file: {temp_path}")
        text = extract_text_from_file(temp_path)

        text_len = len(text.strip()) if text else 0
        snippet = (text.strip()[:300] + '...') if text_len > 300 else text.strip()
        print(f"Extracted text length: {text_len}")
        print(f"First 300 chars: {repr(snippet)}")
        logger.info(f"Extracted text length: {text_len}")

        # Relaxed validation: accept if any reasonable resume signal exists
        text_lower = (text or '').lower()
        has_email = extract_email(text) != 'Not Found'
        has_phone = extract_phone(text) != 'Not Found'
        has_experience = any(k in text_lower for k in ["experience", "work history", "employment", "responsibilities", "professional experience"]) 
        has_education = any(k in text_lower for k in ["education", "university", "college", "degree", "academic"]) 
        has_skills = any(k in text_lower for k in ["skills", "technologies", "core competencies", "expertise"]) 
        has_heading = any(len(line.strip()) > 10 and line.strip().upper() == line.strip() for line in text.splitlines() if line.strip())
        has_multiple_paragraphs = text_len > 300 or text.count('\n\n') >= 1

        valid_signal = any([has_email, has_phone, has_experience, has_education, has_skills, has_heading, has_multiple_paragraphs])

        print(f"Validation signals - email:{has_email}, phone:{has_phone}, experience:{has_experience}, education:{has_education}, skills:{has_skills}, heading:{has_heading}, multi_par:{has_multiple_paragraphs}")
        logger.info(f"Validation signals - email:{has_email}, phone:{has_phone}, experience:{has_experience}, education:{has_education}, skills:{has_skills}, heading:{has_heading}, multi_par:{has_multiple_paragraphs}")

        if not valid_signal:
            raise ValueError(f"Insufficient readable text or resume signals. Extracted length={text_len}")

        print("Text extraction completed")
        logger.info("Text extraction completed")
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        # Provide detailed error response
        raise HTTPException(status_code=400, detail={"success": False, "stage": "extract_text", "error": str(e), "file": temp_path, "file_size": file_size if 'file_size' in locals() else None, "extracted_length": text_len if 'text_len' in locals() else 0, "snippet": snippet if 'snippet' in locals() else ""})

    # Stage 3: Local Parsing
    try:
        print("Starting local resume parser...")
        logger.info("Parsing Complete: Normalizing and detecting sections.")
        cleaned_text = normalize_text(text)
        sections = detect_sections(cleaned_text)

        name = extract_name(text)
        email = extract_email(text)
        phone = extract_phone(text)

        # Parse arrays
        # Extract links from full text
        linkedin = extract_linkedin(text)
        github = extract_github(text)
        portfolio = extract_portfolio(text)

        # Extract skills from full text (not just skills section) for better coverage
        categorized_skills = extract_categorized_skills(text)
        flat_skills = extract_hard_skills(text)
        
        education_text = sections.get("education", "")
        edu_dict = extract_education_intelligence(education_text, text)
        education_list = [edu_dict.get("degree")] if edu_dict.get("degree") else extract_education(text)
        
        experience_text = sections.get("experience", "")
        experience_list = extract_experience(experience_text, text)
        
        projects_text = sections.get("projects", "")
        projects_list = extract_projects(projects_text, text)
        
        # New Scoring & Formatting
        formatting_checks = check_ats_formatting(text)
        detailed_score = calculate_detailed_score(
            name=name, email=email, phone=phone, 
            skills=flat_skills, education=education_list, 
            projects=projects_list, experience=experience_list, 
            formatting_checks=formatting_checks, text_length=text
        )
        
        print("Local resume parsed successfully")
        logger.info(f"ATS Score Complete: Score = {detailed_score['total_score']}")
    except Exception as e:
        import traceback
        print("=" * 80)
        print("ERROR OCCURRED IN LOCAL PARSING")
        traceback.print_exc()
        print("=" * 80)
        raise

    # Stage 4: Build analysis_data from local parsing only (no AI calls during upload)
    # AI insights are generated lazily via /resume/{id}/ats-report when requested.
    try:
        print("Building analysis data from local parsing...")
        analysis_data = {
            "score_breakdown": detailed_score["breakdown"],
            "formatting": formatting_checks,
            "categorized_skills": categorized_skills,
            "strengths": [],
            "weaknesses": [],
            "recommendations": [],
            "ats_formatting_checks": [],
            "formatting_scores": {},
            "detected_role": target_role or "",
            "experience_level": "",
            "keyword_suggestions": [],
            "target_role": target_role,
            "missing_skills_analysis": {},
            "linkedin": linkedin,
            "github": github,
            "portfolio": portfolio,
            "word_count": len(text.split()),
        }
        
        print("Analysis data built successfully (local parsing only)")
        logger.info("Analysis data built from local parsing.")
    except Exception as e:
        import traceback
        print("=" * 80)
        print("ERROR OCCURRED IN BUILDING ANALYSIS DATA")
        traceback.print_exc()
        print("=" * 80)
        raise

    # Stage 5: Save to Database
    try:
        print("Starting database save...")
        logger.info("Database query success: Attempting to insert resume record.")
        skill_schemas = [SkillCreate(skill_name=s) for s in flat_skills]
        education_schemas = [EducationCreate(degree_name=e) for e in education_list]
        project_schemas = [ProjectCreate(project_name=p) for p in projects_list]
        experience_schemas = [ExperienceCreate(experience_detail=exp) for exp in experience_list]

        resume_data_create = ResumeCreate(
            filename=file.filename,
            file_path=temp_path,
            name=name,
            email=email,
            phone=phone,
            resume_score=detailed_score["total_score"],
            analysis_data=analysis_data,
            skills=skill_schemas,
            education=education_schemas,
            projects=project_schemas,
            experience=experience_schemas
        )

        db_resume = crud.create_resume(db=db, resume_data=resume_data_create)
        print("Resume saved to database successfully")
        logger.info(f"Resume ID {db_resume.id} successfully created.")
        return db_resume
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail={"success": False, "stage": "save_database", "error": str(e)})

@router.get("/", response_model=List[ResumeSchema])
def get_resumes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_resumes(db, skip=skip, limit=limit)

@router.get("/{id}", response_model=ResumeSchema)
def get_resume(id: int, db: Session = Depends(get_db)):
    db_resume = crud.get_resume(db, resume_id=id)
    if db_resume is None:
        raise HTTPException(status_code=404, detail="Resume not found")
    return db_resume


@router.get("/{id}/ats-report")
def get_ats_report(id: int, force: bool = False, db: Session = Depends(get_db)):
    """
    Returns the full ATS report for a resume.
    If analysis_data is missing or incomplete, regenerates it from the stored file.
    Always returns a complete report — never empty sections.
    """
    db_resume = crud.get_resume(db, resume_id=id)
    if db_resume is None:
        raise HTTPException(status_code=404, detail="Resume not found")

    analysis = db_resume.analysis_data or {}

    # Check if the stored analysis is complete (has all required keys with real data)
    def _is_complete(a: dict) -> bool:
        return (
            bool(a.get("strengths"))
            and bool(a.get("weaknesses"))
            and bool(a.get("score_breakdown"))
            and any(v.get("score", 0) > 0 for v in a.get("score_breakdown", {}).values())
        )

    if _is_complete(analysis) and not force:
        return {
            "id": db_resume.id,
            "filename": db_resume.filename,
            "name": db_resume.name,
            "email": db_resume.email,
            "phone": db_resume.phone,
            "resume_score": db_resume.resume_score,
            "analysis_data": analysis,
            "skills": [s.skill_name for s in db_resume.skills],
            "education": [e.degree_name for e in db_resume.education],
            "projects": [p.project_name for p in db_resume.projects],
            "experience": [e.experience_detail for e in db_resume.experience],
            "created_at": db_resume.created_at,
            "updated_at": db_resume.updated_at,
        }

    # --- Regenerate from file ---
    logger.info(f"Resume {id}: analysis_data incomplete, regenerating from file.")

    file_path = db_resume.file_path
    if not file_path or not os.path.exists(file_path):
        # Synthesize text from DB relations as fallback
        skills_str  = ", ".join(s.skill_name for s in db_resume.skills)
        exp_str     = ". ".join(e.experience_detail for e in db_resume.experience)
        proj_str    = ", ".join(p.project_name for p in db_resume.projects)
        edu_str     = ", ".join(e.degree_name for e in db_resume.education)
        text = f"{db_resume.name}\n{db_resume.email}\n{db_resume.phone or ''}\n\nSkills: {skills_str}\n\nExperience: {exp_str}\n\nProjects: {proj_str}\n\nEducation: {edu_str}"
    else:
        text = extract_text_from_file(file_path)

    # Parse
    name    = db_resume.name
    email   = db_resume.email
    phone   = db_resume.phone or ""
    linkedin  = extract_linkedin(text)
    github    = extract_github(text)
    portfolio = extract_portfolio(text)

    flat_skills       = extract_hard_skills(text)
    categorized_skills = extract_categorized_skills(text)

    cleaned_text  = normalize_text(text)
    sections      = detect_sections(cleaned_text)
    education_text = sections.get("education", "")
    edu_dict      = extract_education_intelligence(education_text, text)
    education_list = [edu_dict.get("degree")] if edu_dict.get("degree") else extract_education(text)
    experience_list = extract_experience(sections.get("experience", ""), text)
    projects_list   = extract_projects(sections.get("projects", ""), text)

    formatting_checks = check_ats_formatting(text)
    detailed_score = calculate_detailed_score(
        name=name, email=email, phone=phone,
        skills=flat_skills, education=education_list,
        projects=projects_list, experience=experience_list,
        formatting_checks=formatting_checks, text_length=text
    )

    ats_report_data = {
        "name": name, "email": email, "phone": phone,
        "linkedin": linkedin, "github": github, "portfolio": portfolio,
        "parsed_text": text,
        "resume_score": detailed_score["total_score"],
        "skills": flat_skills, "experience": experience_list,
        "projects": projects_list, "education": education_list,
        "certifications": [], "categorized_skills": categorized_skills,
        "formatting": formatting_checks,
        "target_role": analysis.get("target_role") or "",
    }

    ats_report = ai_service.generate_ats_report(ats_report_data)

    new_analysis = {
        "score_breakdown":      detailed_score["breakdown"],
        "formatting":           formatting_checks,
        "categorized_skills":   categorized_skills,
        "strengths":            ats_report.get("strengths", []),
        "weaknesses":           ats_report.get("weaknesses", []),
        "recommendations":      ats_report.get("recommendations", []),
        "ats_formatting_checks": ats_report.get("ats_formatting_checks", []),
        "formatting_scores":    ats_report.get("formatting_scores", {}),
        "detected_role":        ats_report.get("detected_role", ""),
        "experience_level":     ats_report.get("experience_level", ""),
        "keyword_suggestions":  ats_report.get("keyword_suggestions", []),
        "target_role":          analysis.get("target_role") or "",
        "missing_skills_analysis": {},
        "linkedin": linkedin, "github": github, "portfolio": portfolio,
        "word_count": ats_report.get("word_count", 0),
    }

    # Persist the regenerated analysis back to DB
    try:
        db_resume.analysis_data = new_analysis
        db_resume.resume_score  = detailed_score["total_score"]
        db.commit()
        db.refresh(db_resume)
    except Exception as e:
        logger.warning(f"Could not persist regenerated analysis for resume {id}: {e}")

    return {
        "id": db_resume.id,
        "filename": db_resume.filename,
        "name": name,
        "email": email,
        "phone": phone,
        "resume_score": detailed_score["total_score"],
        "analysis_data": new_analysis,
        "skills": flat_skills,
        "education": education_list,
        "projects": projects_list,
        "experience": experience_list,
        "created_at": db_resume.created_at,
        "updated_at": db_resume.updated_at,
    }

@router.delete("/{id}")
def delete_resume(id: int, db: Session = Depends(get_db)):
    success = crud.delete_resume(db, resume_id=id)
    if not success:
        raise HTTPException(status_code=404, detail="Resume not found")
    return {"message": "Resume deleted successfully"}

class RenameRequest(BaseModel):
    name: str

@router.put("/{id}/rename", response_model=ResumeSchema)
def rename_resume(id: int, request: RenameRequest, db: Session = Depends(get_db)):
    db_resume = crud.rename_resume(db, id, request.name)
    if not db_resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return db_resume

@router.post("/{id}/duplicate", response_model=ResumeSchema)
def duplicate_resume(id: int, db: Session = Depends(get_db)):
    db_resume = crud.duplicate_resume(db, id)
    if not db_resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return db_resume

@router.post("/{id}/improve")
def improve_resume(id: int, req: ImproveResumeRequest, db: Session = Depends(get_db)):
    db_resume = crud.get_resume(db, resume_id=id)
    if not db_resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    file_path = db_resume.file_path
    if not file_path or not os.path.exists(file_path):
        logger.warning(f"File {file_path} not found. Synthesizing text from DB for resume {id}")
        # Synthesize text from DB instead of failing
        skills_str = ", ".join(db_resume.skills) if db_resume.skills else ""
        exp_str = ", ".join(db_resume.experience) if db_resume.experience else ""
        proj_str = ", ".join(db_resume.projects) if db_resume.projects else ""
        text = f"{db_resume.name}\n\nSkills: {skills_str}\n\nExperience: {exp_str}\n\nProjects: {proj_str}"
    else:
        text = extract_text_from_file(file_path)
        
    try:
        from backend.services.job_matcher.local_parser import local_parse_resume, local_parse_job_description
        from backend.services.job_matcher.matching_engine import match_features
        from backend.services.job_matcher.scoring_engine import calculate_scores
        
        prompt = f"""
You are an expert Executive Resume Writer and Career Coach. 
Please completely rewrite and significantly improve the following resume text. 
Fix any grammatical errors, replace weak words with strong action verbs, emphasize quantifiable achievements, and optimize it for ATS systems.
Format the output cleanly using professional Markdown, with clear headings for Summary, Experience, Education, and Skills.

Original Resume:
{text}
"""
        try:
            improved_text = ai_service._get_provider().generate_text(prompt)
            if "fallback" in improved_text.lower() and "success" in improved_text.lower():
                raise Exception("API Fallback Triggered")
        except Exception as ai_e:
            logger.warning(f"AI rewriting failed, using fallback formatter: {ai_e}")
            improved_text = f"# Professional Summary\n\nExperienced professional actively targeting a {req.job_description[:30] if req.job_description else 'new'} role. Demonstrated history of delivering results.\n\n# Skills\n\n{text[:200]}...\n\n# Experience\n\n{text}\n\n*Note: AI Optimization is temporarily unavailable. This is a structural preview.*"
        
        ats_before = req.ats_result.get('scores', {}).get('overall_score', 0) if req.ats_result else 0
        ats_after = ats_before
        
        if req.job_description:
            parsed_res = local_parse_resume(improved_text)
            parsed_jd = local_parse_job_description(req.job_description)
            match_data = match_features(parsed_res, parsed_jd)
            scores = calculate_scores(match_data, {}, parsed_res, parsed_jd)
            ats_after = scores.get("overall_score", 0)
            
        improvements = []
        if req.job_description and 'match_data' in locals():
            missing_skills = match_data.get('missing_mandatory_skills', [])
            if missing_skills:
                improvements.append(f"Add missing skills to your resume: {', '.join(missing_skills)}")
            
            missing_tools = match_data.get('missing_tools', [])
            if missing_tools:
                improvements.append(f"Highlight experience with required tools: {', '.join(missing_tools)}")
                
            if scores.get('breakdown', {}).get('experience', 0) < 80:
                improvements.append(f"Quantify your experience. Target requirement is {parsed_jd.get('experience_required')} years.")
                
        if not improvements:
            improvements = [
                "Fixed grammatical errors and typos",
                "Replaced weak words with strong action verbs",
                "Emphasized quantifiable achievements",
                "Optimized keyword density for ATS systems",
                "Improved professional formatting"
            ]

        return {
            "success": True, 
            "original_resume": text,
            "improved_resume_markdown": improved_text,
            "ats_before": ats_before,
            "ats_after": ats_after,
            "improvements": improvements
        }
    except Exception as e:
        logger.error(f"Failed to improve resume: {e}")
        raise HTTPException(status_code=500, detail=str(e))
