import logging
import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from sqlalchemy.orm.attributes import flag_modified  # pyright: ignore

from backend.database import get_db
from backend.ai.services.ai_service import AIService
from backend.parsers.pdf_extractor import resolve_resume_path, extract_text_from_file
from backend.validators.improve_resume_validator import ImproveResumeValidator
from backend import crud

router = APIRouter(prefix="/ai", tags=["AI Features"])

# Set up logging
logger = logging.getLogger(__name__)

# AI Service Instance
ai_service = AIService()

# Request Pydantic Models
class ResumeDataRequest(BaseModel):
    resume_id: int

class CoverLetterRequest(BaseModel):
    resume_id: int
    job_role: Optional[str] = "Software Engineer"
    company: Optional[str] = "Hiring Company"

class InterviewRequest(BaseModel):
    category: str
    skills: List[str]
    experience: List[str]

class RoadmapRequest(BaseModel):
    category: str
    missing_skills: List[str]

class ImproveSectionRequest(BaseModel):
    section_text: str
    section_type: str
    target_role: Optional[str] = None
    level: Optional[str] = None
    resume_context: Optional[str] = None

class SkillGapRequest(BaseModel):
    resume_id: int
    target_role: str

class EvaluateAnswerRequest(BaseModel):
    question: str
    answer: str
    role: str

class RoleProfileRequest(BaseModel):
    target_role: str

class InsightsRequest(BaseModel):
    resume_id: int
    refresh: Optional[bool] = False
    target_role: Optional[str] = None
    job_description: Optional[str] = None
    difficulty: Optional[str] = "Medium"

def get_resume_db_obj(db: Session, resume_id: int):
    db_resume = crud.get_resume(db, resume_id=resume_id)
    if not db_resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return db_resume

def extract_resume_data(db_resume) -> dict:
    experiences = [e.experience_detail for e in db_resume.experience]
    projects = [p.project_name for p in db_resume.projects]
    ad = db_resume.analysis_data or {}
    
    file_path = getattr(db_resume, 'file_path', None)
    if file_path and not os.path.exists(file_path):
        resolved_path = resolve_resume_path(file_path)
        if resolved_path and os.path.exists(resolved_path):
            file_path = resolved_path

    parsed_text = None
    if file_path and os.path.exists(file_path):
        try:
            parsed_text = extract_text_from_file(file_path)
        except Exception:
            parsed_text = None

    if not parsed_text:
        parsed_text = " ".join(
            filter(None, [
                " ".join(experiences),
                " ".join(projects),
                " ".join([e.degree_name for e in db_resume.education]) if hasattr(db_resume, 'education') else "",
                " ".join([s.skill_name for s in db_resume.skills])
            ])
        )

    job_titles = []
    if experiences:
        import re
        for exp in experiences:
            match = re.split(r'\s+at\s+|\s+for\s+|\s*[-|]\s*', exp, 1, flags=re.IGNORECASE)
            if match and len(match[0]) < 50:
                job_titles.append(match[0].strip())
                
    exp_years = len(experiences) * 2.0
    
    if "resume_xray" in ad and "years_of_experience" in ad["resume_xray"]:
        try:
            exp_years = float(ad["resume_xray"]["years_of_experience"])
        except:
            pass
            
    if "career_intelligence" in ad and "detected_role" in ad["career_intelligence"]:
        job_titles.insert(0, ad["career_intelligence"]["detected_role"])

    return {
        "id": db_resume.id,
        "name": db_resume.name,
        "filename": getattr(db_resume, 'filename', None),
        "file_path": file_path,
        "resume_score": db_resume.resume_score,
        "skills": [s.skill_name for s in db_resume.skills],
        "experience_details": experiences,
        "experience": exp_years,
        "projects": projects,
        "education": [e.degree_name for e in db_resume.education] if hasattr(db_resume, 'education') else [],
        "analysis_data": ad,
        "job_titles": job_titles,
        "parsed_text": parsed_text
    }

@router.post("/review")
def review_resume(req: ResumeDataRequest, db: Session = Depends(get_db)):
    db_resume = get_resume_db_obj(db, req.resume_id)
    resume_data = extract_resume_data(db_resume)
    return ai_service.review_resume(resume_data)

@router.post("/summary")
def generate_summary(req: ResumeDataRequest, db: Session = Depends(get_db)):
    db_resume = get_resume_db_obj(db, req.resume_id)
    resume_data = extract_resume_data(db_resume)
    summary = ai_service.generate_summary(resume_data)
    return {"summary": summary}

@router.post("/cover-letter")
def generate_cover_letter(req: CoverLetterRequest, db: Session = Depends(get_db)):
    db_resume = get_resume_db_obj(db, req.resume_id)
    resume_data = extract_resume_data(db_resume)
    cover_letter = ai_service.generate_cover_letter(resume_data, req.job_role, req.company)
    return {"cover_letter": cover_letter}

@router.post("/interview-questions")
def generate_interview_questions(req: InterviewRequest):
    return ai_service.generate_interview_questions(req.category, req.skills, req.experience)

@router.post("/career-roadmap")
def generate_career_roadmap(req: RoadmapRequest):
    return ai_service.generate_career_roadmap(req.category, req.missing_skills)

@router.post("/improve-resume")
def improve_resume_section(req: ImproveSectionRequest):
    logger.info(f"Resume Improvement Started. Section Type: {req.section_type}")
    try:
        result = ai_service.improve_resume_section_hybrid(
            req.section_text, 
            req.section_type,
            req.target_role,
            req.level,
            req.resume_context,
        )
        
        if not result.get('success'):
            raise HTTPException(status_code=400, detail=result.get('error', 'Validation failed'))
        
        # Safety net: validate improved_text is real text, not leaked error JSON
        improved = result.get('improved_text', '')
        if improved:
            stripped = improved.strip()
            is_corrupt = False
            try:
                if stripped.startswith('{') or stripped.startswith('['):
                    import json as _json
                    parsed = _json.loads(stripped)
                    if isinstance(parsed, dict) and ('success' in parsed or 'fallback' in parsed or 'message' in parsed):
                        is_corrupt = True
            except Exception:
                pass
            if 'quota' in stripped.lower() or 'api key' in stripped.lower():
                is_corrupt = True
            if is_corrupt:
                logger.error("🚨 Result contained leaked error JSON in improved_text. Falling back to deterministic engine.")
                from backend.services.resume_improver_service import fallback_improvement, analyze_resume_context
                ctx = None
                if req.resume_context and len(req.resume_context.strip()) > 50:
                    try:
                        ctx = analyze_resume_context(req.resume_context)
                    except Exception:
                        pass
                fallback_result = fallback_improvement(
                    req.section_text, req.section_type, req.target_role, ctx,
                )
                fallback_result['ai_enhanced'] = False
                fallback_result['fallback_used'] = True
                return fallback_result
        
        logger.info("Resume Improvement completed successfully.")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Resume Improvement Failed: {str(e)}", exc_info=True)
        # Use deterministic fallback with context
        from backend.services.resume_improver_service import fallback_improvement, analyze_resume_context
        ctx = None
        if req.resume_context and len(req.resume_context.strip()) > 50:
            try:
                ctx = analyze_resume_context(req.resume_context)
            except Exception:
                pass
        fallback_result = fallback_improvement(
            req.section_text, req.section_type, req.target_role, ctx,
        )
        return fallback_result

@router.post("/skill-gap")
def analyze_skill_gap(req: SkillGapRequest, db: Session = Depends(get_db)):
    db_resume = get_resume_db_obj(db, req.resume_id)
    resume_data = extract_resume_data(db_resume)
    return ai_service.analyze_skill_gap(resume_data["skills"], req.target_role)

@router.post("/career-intelligence")
def generate_career_intelligence(req: InsightsRequest, db: Session = Depends(get_db)):
    logger.info(f"Generate Career Intelligence Started for Resume ID: {req.resume_id}, Target Role: {req.target_role}")
    try:
        db_resume = get_resume_db_obj(db, req.resume_id)

        # Cache key is resume_id + role — different resume or role always regenerates
        cache_key = f"career_intelligence_{req.target_role.replace(' ', '_').lower()}" if req.target_role else "career_intelligence_general"
        cached = (db_resume.analysis_data or {}).get(cache_key)

        # Serve cache only if not forcing refresh AND the cached entry was generated for this exact resume
        if not req.refresh and isinstance(cached, dict) and cached.get('_resume_id') == req.resume_id and cached.get('career_readiness_score'):
            return cached

        resume_data = extract_resume_data(db_resume)
        result = ai_service.generate_career_intelligence(resume_data, req.target_role)

        if isinstance(result, dict) and result.get('success') is False:
            raise Exception(result.get('message', 'AI generation failed'))
        if 'Error from Gemini' in str(result):
            raise Exception(str(result))

        # Stamp with resume_id so stale cache from a different resume is detected
        result['_resume_id'] = req.resume_id
        result['_target_role'] = req.target_role or 'General'

        if not db_resume.analysis_data:
            db_resume.analysis_data = {}
        db_resume.analysis_data[cache_key] = result
        flag_modified(db_resume, "analysis_data")
        db.commit()
        return result
    except Exception as e:
        logger.error(f"Career Intelligence Failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/resume-xray")
def generate_resume_xray(req: InsightsRequest, db: Session = Depends(get_db)):
    logger.info(f"Generate Resume X-Ray Started for Resume ID: {req.resume_id}")
    try:
        db_resume = get_resume_db_obj(db, req.resume_id)
        if not req.refresh and db_resume.analysis_data and "resume_xray" in db_resume.analysis_data:
            return db_resume.analysis_data["resume_xray"]
            
        resume_data = extract_resume_data(db_resume)
        result = ai_service.generate_resume_xray(resume_data)
        if isinstance(result, dict) and result.get("success") is False:
            return result
        if "Error from Gemini" in str(result):
            raise Exception(str(result))
            
        if not db_resume.analysis_data:
            db_resume.analysis_data = {}
        db_resume.analysis_data["resume_xray"] = result
        flag_modified(db_resume, "analysis_data")  # pyright: ignore
        db.commit()
        return result
    except Exception as e:
        logger.error(f"Resume X-Ray Failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/recruiter-view")
def generate_recruiter_view(req: InsightsRequest, db: Session = Depends(get_db)):
    logger.info(f"Generate Recruiter View Started for Resume ID: {req.resume_id}")
    try:
        db_resume = get_resume_db_obj(db, req.resume_id)
        cached = db_resume.analysis_data.get("recruiter_view") if db_resume.analysis_data else None
        if not req.refresh and isinstance(cached, dict) and cached.get("resume_id") == req.resume_id:
            return cached
            
        resume_data = extract_resume_data(db_resume)
        result = ai_service.generate_recruiter_view(resume_data)
        result["resume_id"] = req.resume_id
        if isinstance(result, dict) and result.get("success") is False:
            return result
        if "Error from Gemini" in str(result):
            raise Exception(str(result))
            
        if not db_resume.analysis_data:
            db_resume.analysis_data = {}
        db_resume.analysis_data["recruiter_view"] = result
        flag_modified(db_resume, "analysis_data")  # pyright: ignore
        db.commit()
        return result
    except Exception as e:
        logger.error(f"Recruiter View Failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

CAREER_TWIN_REQUIRED_KEYS = {"profile", "careerHealth", "careerPaths", "skillGaps", "recommendations", "timeline"}

def _career_twin_schema_valid(data: dict) -> bool:
    if not isinstance(data, dict):
        return False
    if not CAREER_TWIN_REQUIRED_KEYS.issubset(data.keys()):
        return False
    if not isinstance(data.get("careerPaths"), list) or len(data["careerPaths"]) == 0:
        return False
    if not isinstance(data.get("profile"), dict):
        return False
    if not isinstance(data.get("careerHealth"), dict):
        return False
    return True

@router.post("/career-twin")
def generate_career_twin(req: InsightsRequest, db: Session = Depends(get_db)):
    logger.info(f"Generate AI Career Twin Started for Resume ID: {req.resume_id}")
    try:
        db_resume = get_resume_db_obj(db, req.resume_id)

        # Serve cache only if not refreshing AND schema is valid
        cached = (db_resume.analysis_data or {}).get("career_twin")
        if not req.refresh and cached and _career_twin_schema_valid(cached):
            return cached

        resume_data = extract_resume_data(db_resume)
        result = ai_service.generate_career_twin(resume_data)
        if isinstance(result, dict) and result.get("success") is False:
            raise Exception(result.get("message", "AI generation failed"))
        if "Error from Gemini" in str(result):
            raise Exception(str(result))
        if not _career_twin_schema_valid(result):
            raise Exception(f"AI returned incomplete schema. Keys present: {list(result.keys())}")

        if not db_resume.analysis_data:
            db_resume.analysis_data = {}
        db_resume.analysis_data["career_twin"] = result
        flag_modified(db_resume, "analysis_data")  # pyright: ignore
        db.commit()
        return result
    except Exception as e:
        logger.error(f"Career Twin Failed: {str(e)}", exc_info=True)
        error_str = str(e)
        if "429" in error_str or "Quota" in error_str:
            raise HTTPException(status_code=429, detail="AI Rate Limit Exceeded. Please wait 60 seconds and try again.")
        elif "Timeout" in error_str or "timeout" in error_str.lower():
            raise HTTPException(status_code=504, detail="AI Service Timeout. Please try again.")
        elif "incomplete schema" in error_str:
            raise HTTPException(status_code=422, detail=f"AI returned incomplete data. Please retry. ({error_str})")
        raise HTTPException(status_code=500, detail=f"Career Twin generation failed: {error_str[:200]}")

@router.post("/interview-simulator")
def generate_interview_simulator(req: InsightsRequest, db: Session = Depends(get_db)):
    logger.info(f"Generate Interview Simulator Started for Resume ID: {req.resume_id}, Difficulty: {req.difficulty}, Role: {req.target_role}")
    try:
        db_resume = get_resume_db_obj(db, req.resume_id)
        
        cache_key = f"interview_simulator_{req.target_role}_{req.difficulty}".replace(" ", "_")
        
        if not req.refresh and db_resume.analysis_data and cache_key in db_resume.analysis_data:
            return db_resume.analysis_data[cache_key]
            
        resume_data = extract_resume_data(db_resume)
        result = ai_service.generate_interview_simulator(resume_data, req.target_role, req.difficulty)
        
        if isinstance(result, dict) and result.get("success") is False:
            return result
        if "Error from Gemini" in str(result):
            raise Exception(str(result))
            
        if not db_resume.analysis_data:
            db_resume.analysis_data = {}
        db_resume.analysis_data[cache_key] = result
        flag_modified(db_resume, "analysis_data")
        db.commit()
        return result
    except Exception as e:
        logger.error(f"Interview Simulator Failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/evaluate-answer")
def evaluate_interview_answer(req: EvaluateAnswerRequest):
    try:
        return ai_service.evaluate_interview_answer(req.question, req.answer, req.role)
    except Exception as e:
        logger.error(f"Evaluate Answer Failed: {str(e)}", exc_info=True)
        error_str = str(e)
        if "429" in error_str or "Quota" in error_str:
            raise HTTPException(status_code=429, detail="AI Rate Limit Exceeded (2 requests/minute). Please wait 60 seconds and try again.")
        elif "Timeout" in error_str:
            raise HTTPException(status_code=504, detail="AI Service Timeout. Please try again.")
        raise HTTPException(status_code=500, detail="AI Analysis Failed. Please check backend logs.")

@router.post("/role-profile")
def get_role_profile(req: RoleProfileRequest):
    try:
        return ai_service.generate_role_profile(req.target_role)
    except Exception as e:
        logger.error(f"Role Profile Failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
