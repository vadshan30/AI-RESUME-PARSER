import os
import logging
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import asyncio

from backend.database import get_db
from backend.models import Resume, Skill, Education, Project, Experience
from backend.schemas import ResumeSchema, ResumeCreate, SkillCreate, EducationCreate, ProjectCreate, ExperienceCreate
from pydantic import BaseModel
from backend import crud

# Parsers
from backend.parsers.pdf_extractor import extract_text_from_pdf
from backend.parsers.cleaner import normalize_text
from backend.parsers.sections import detect_sections
from backend.parsers.basic_info import extract_name, extract_email, extract_phone
from backend.parsers.skills import extract_categorized_skills, extract_hard_skills
from backend.parsers.education import extract_education, extract_education_intelligence
from backend.parsers.experience import extract_experience
from backend.parsers.projects import extract_projects
from backend.parsers.scoring import calculate_detailed_score, check_ats_formatting

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
    logger.info(f"Upload Started: Received file {file.filename}")
    
    if not file.filename.endswith('.pdf'):
        logger.error("Upload failed: File is not a PDF.")
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    # Create uploads directory if it doesn't exist
    os.makedirs("backend/uploads", exist_ok=True)
    temp_path = f"backend/uploads/{file.filename}"
    
    with open(temp_path, "wb") as buffer:
        buffer.write(await file.read())

    try:
        # Extract Text
        logger.info(f"Extracting text from PDF: {temp_path}")
        text = extract_text_from_pdf(temp_path)
        if not text:
            logger.error("Text extraction failed. File might be corrupted or image-based.")
            raise HTTPException(status_code=400, detail="Resume parsing failed. Could not extract text from PDF.")
        logger.info("PDF Extracted successfully.")

        # Basic processing
        logger.info("Parsing Complete: Normalizing and detecting sections.")
        cleaned_text = normalize_text(text)
        sections = detect_sections(cleaned_text)

        name = extract_name(text)
        email = extract_email(text)
        phone = extract_phone(text)

        # Parse arrays
        skills_text = sections.get("skills", "")
        categorized_skills = extract_categorized_skills(skills_text)
        flat_skills = extract_hard_skills(skills_text)
        
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
        logger.info(f"ATS Score Complete: Score = {detailed_score['total_score']}")

        # AI Insights (Run concurrently in threads to prevent blocking)
        logger.info("Category Prediction & Generating Recommendations Started...")
        resume_data = {
            "resume_score": detailed_score["total_score"],
            "skills": flat_skills,
            "experience": experience_list,
            "projects": projects_list
        }
        
        async def fetch_ai_insights():
            review_task = asyncio.to_thread(ai_service.review_resume, resume_data)
            gap_task = None
            if target_role:
                gap_task = asyncio.to_thread(ai_service.analyze_skill_gap, flat_skills, target_role)
            
            review_res = await review_task
            gap_res = await gap_task if gap_task else {}
            return review_res, gap_res
            
        ai_review, missing_skills_analysis = await fetch_ai_insights()
        logger.info("Generating Recommendations Complete.")

        analysis_data = {
            "score_breakdown": detailed_score["breakdown"],
            "formatting": formatting_checks,
            "categorized_skills": categorized_skills,
            "strengths": ai_review.get("strengths", []),
            "weaknesses": ai_review.get("weaknesses", []),
            "recommendations": ai_review.get("improvement_suggestions", []),
            "target_role": target_role,
            "missing_skills_analysis": missing_skills_analysis
        }

        # Map to Pydantic Schemas for CRUD
        skill_schemas = [SkillCreate(skill_name=s) for s in flat_skills]
        education_schemas = [EducationCreate(degree_name=e) for e in education_list]
        project_schemas = [ProjectCreate(project_name=p) for p in projects_list]
        experience_schemas = [ExperienceCreate(experience_detail=exp) for exp in experience_list]

        resume_data_create = ResumeCreate(
            filename=file.filename,
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

        # Save to DB
        db_resume = crud.create_resume(db=db, resume_data=resume_data_create)
        
        logger.info(f"Response Sent: Resume {db_resume.id} processed successfully.")
        return db_resume

    except HTTPException as http_exc:
        # Re-raise HTTPExceptions explicitly
        raise http_exc
    except Exception as e:
        logger.error(f"Analysis Failed due to unexpected error: {str(e)}", exc_info=True)
        error_str = str(e)
        if "Timeout" in error_str or "timeout" in error_str.lower():
            raise HTTPException(status_code=504, detail="Timeout occurred. Unable to connect to AI service.")
        elif "JSONDecodeError" in error_str:
            raise HTTPException(status_code=502, detail="Invalid response received from AI service.")
        else:
            raise HTTPException(status_code=500, detail=f"Analysis Failed: {error_str}")

    finally:
        # Cleanup temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)

@router.get("/", response_model=List[ResumeSchema])
def get_resumes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_resumes(db, skip=skip, limit=limit)

@router.get("/{id}", response_model=ResumeSchema)
def get_resume(id: int, db: Session = Depends(get_db)):
    db_resume = crud.get_resume(db, resume_id=id)
    if db_resume is None:
        raise HTTPException(status_code=404, detail="Resume not found")
    return db_resume

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
