import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from backend.database import get_db
from backend.ai.services.ai_service import AIService
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

class JobMatchRequest(BaseModel):
    resume_id: int
    job_description: str

class ImproveSectionRequest(BaseModel):
    section_text: str
    section_type: str

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

def get_resume_db_obj(db: Session, resume_id: int):
    db_resume = crud.get_resume(db, resume_id=resume_id)
    if not db_resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return db_resume

def extract_resume_data(db_resume) -> dict:
    return {
        "name": db_resume.name,
        "resume_score": db_resume.resume_score,
        "skills": [s.skill_name for s in db_resume.skills],
        "experience": [e.experience_detail for e in db_resume.experience],
        "projects": [p.project_name for p in db_resume.projects]
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

@router.post("/match-job")
def analyze_job_match(req: JobMatchRequest, db: Session = Depends(get_db)):
    db_resume = get_resume_db_obj(db, req.resume_id)
    resume_data = extract_resume_data(db_resume)
    return ai_service.analyze_job_match(resume_data, req.job_description)

@router.post("/improve-resume")
def improve_resume_section(req: ImproveSectionRequest):
    logger.info(f"Improve Resume Draft Started. Section Type: {req.section_type}")
    try:
        improved_text = ai_service.improve_resume_section(req.section_text, req.section_type)
        if "Error from Gemini" in improved_text:
            raise Exception(improved_text)
            
        logger.info("AI Draft Analyzer generated suggestions successfully.")
        return {"improved_text": improved_text}
        
    except Exception as e:
        logger.error(f"AI Draft Analyzer Failed: {str(e)}", exc_info=True)
        error_str = str(e)
        if "Timeout" in error_str or "timeout" in error_str.lower():
            raise HTTPException(status_code=504, detail="Timeout occurred. Unable to connect to AI service.")
        elif "JSONDecodeError" in error_str:
            raise HTTPException(status_code=502, detail="Invalid response received from AI service.")
        else:
            raise HTTPException(status_code=500, detail=f"Analysis Failed: {error_str}")

@router.post("/skill-gap")
def analyze_skill_gap(req: SkillGapRequest, db: Session = Depends(get_db)):
    db_resume = get_resume_db_obj(db, req.resume_id)
    resume_data = extract_resume_data(db_resume)
    return ai_service.analyze_skill_gap(resume_data["skills"], req.target_role)

@router.post("/career-intelligence")
def generate_career_intelligence(req: InsightsRequest, db: Session = Depends(get_db)):
    logger.info(f"Generate Career Intelligence Started for Resume ID: {req.resume_id}")
    try:
        db_resume = get_resume_db_obj(db, req.resume_id)
        if not req.refresh and db_resume.analysis_data and "career_intelligence" in db_resume.analysis_data:
            return db_resume.analysis_data["career_intelligence"]
            
        resume_data = extract_resume_data(db_resume)
        result = ai_service.generate_career_intelligence(resume_data)
        if "Error from Gemini" in str(result):
            raise Exception(str(result))
            
        if not db_resume.analysis_data:
            db_resume.analysis_data = {}
        db_resume.analysis_data["career_intelligence"] = result
        flag_modified(db_resume, "analysis_data")
        db.commit()
        return result
    except Exception as e:
        logger.error(f"Career Intelligence Failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

from sqlalchemy.orm.attributes import flag_modified

@router.post("/hiring-probability")
def generate_hiring_probability(req: InsightsRequest, db: Session = Depends(get_db)):
    logger.info(f"Generate Hiring Probability Started for Resume ID: {req.resume_id}")
    try:
        db_resume = get_resume_db_obj(db, req.resume_id)
        if not req.refresh and db_resume.analysis_data and "hiring_probability" in db_resume.analysis_data:
            return db_resume.analysis_data["hiring_probability"]
            
        resume_data = extract_resume_data(db_resume)
        result = ai_service.generate_hiring_probability(resume_data)
        if "Error from Gemini" in str(result):
            raise Exception(str(result))
            
        if not db_resume.analysis_data:
            db_resume.analysis_data = {}
        db_resume.analysis_data["hiring_probability"] = result
        flag_modified(db_resume, "analysis_data")
        db.commit()
        return result
    except Exception as e:
        logger.error(f"Hiring Probability Failed: {str(e)}", exc_info=True)
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
        if "Error from Gemini" in str(result):
            raise Exception(str(result))
            
        if not db_resume.analysis_data:
            db_resume.analysis_data = {}
        db_resume.analysis_data["resume_xray"] = result
        flag_modified(db_resume, "analysis_data")
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
        if not req.refresh and db_resume.analysis_data and "recruiter_view" in db_resume.analysis_data:
            return db_resume.analysis_data["recruiter_view"]
            
        resume_data = extract_resume_data(db_resume)
        result = ai_service.generate_recruiter_view(resume_data)
        if "Error from Gemini" in str(result):
            raise Exception(str(result))
            
        if not db_resume.analysis_data:
            db_resume.analysis_data = {}
        db_resume.analysis_data["recruiter_view"] = result
        flag_modified(db_resume, "analysis_data")
        db.commit()
        return result
    except Exception as e:
        logger.error(f"Recruiter View Failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/career-twin")
def generate_career_twin(req: InsightsRequest, db: Session = Depends(get_db)):
    logger.info(f"Generate AI Career Twin Started for Resume ID: {req.resume_id}")
    try:
        db_resume = get_resume_db_obj(db, req.resume_id)
        if not req.refresh and db_resume.analysis_data and "career_twin" in db_resume.analysis_data:
            return db_resume.analysis_data["career_twin"]
            
        resume_data = extract_resume_data(db_resume)
        result = ai_service.generate_career_twin(resume_data)
        if "Error from Gemini" in str(result):
            raise Exception(str(result))
            
        if not db_resume.analysis_data:
            db_resume.analysis_data = {}
        db_resume.analysis_data["career_twin"] = result
        flag_modified(db_resume, "analysis_data")
        db.commit()
        return result
    except Exception as e:
        logger.error(f"Career Twin Failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/interview-simulator")
def generate_interview_simulator(req: InsightsRequest, db: Session = Depends(get_db)):
    logger.info(f"Generate Interview Simulator Started for Resume ID: {req.resume_id}")
    try:
        db_resume = get_resume_db_obj(db, req.resume_id)
        if not req.refresh and db_resume.analysis_data and "interview_simulator" in db_resume.analysis_data:
            return db_resume.analysis_data["interview_simulator"]
            
        resume_data = extract_resume_data(db_resume)
        result = ai_service.generate_interview_simulator(resume_data)
        if "Error from Gemini" in str(result):
            raise Exception(str(result))
            
        if not db_resume.analysis_data:
            db_resume.analysis_data = {}
        db_resume.analysis_data["interview_simulator"] = result
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
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/role-profile")
def get_role_profile(req: RoleProfileRequest):
    try:
        return ai_service.generate_role_profile(req.target_role)
    except Exception as e:
        logger.error(f"Role Profile Failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
