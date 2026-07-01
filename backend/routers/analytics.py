from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List

from backend.database import get_db
from backend.models import Resume
from backend.admin import analytics
from backend.schemas import ResumeSchema

router = APIRouter(prefix="/analytics", tags=["Analytics Dashboard"])

@router.get("/")
def get_dashboard_analytics(db: Session = Depends(get_db)):
    return {
        "total_resumes": analytics.get_total_resumes(db),
        "average_ats_score": analytics.get_average_ats_score(db),
        "top_categories": analytics.get_top_categories(db),
        "top_skills": analytics.get_top_skills(db)
    }

@router.get("/resumes", response_model=List[ResumeSchema])
def get_recent_resumes(limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Resume).order_by(desc(Resume.created_at)).limit(limit).all()
