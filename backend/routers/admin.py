from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List

from backend.database import get_db
from backend.models import User, Resume
from backend.auth.security import require_admin
from backend.admin import analytics
from backend.schemas import UserResponse, ResumeSchema

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])

@router.get("/analytics")
def get_dashboard_analytics(db: Session = Depends(get_db), current_admin: User = Depends(require_admin)):
    return {
        "total_users": analytics.get_total_users(db),
        "total_resumes": analytics.get_total_resumes(db),
        "average_ats_score": analytics.get_average_ats_score(db),
        "top_categories": analytics.get_top_categories(db),
        "top_skills": analytics.get_top_skills(db)
    }

@router.get("/users", response_model=List[UserResponse])
def get_recent_users(limit: int = 10, db: Session = Depends(get_db), current_admin: User = Depends(require_admin)):
    return db.query(User).order_by(desc(User.created_at)).limit(limit).all()

@router.get("/resumes", response_model=List[ResumeSchema])
def get_recent_resumes(limit: int = 10, db: Session = Depends(get_db), current_admin: User = Depends(require_admin)):
    return db.query(Resume).order_by(desc(Resume.created_at)).limit(limit).all()
