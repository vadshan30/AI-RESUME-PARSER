from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from backend.models import Resume, Skill

def get_total_resumes(db: Session) -> int:
    return db.query(func.count(Resume.id)).scalar()

def get_average_ats_score(db: Session) -> int:
    avg = db.query(func.avg(Resume.resume_score)).scalar()
    return int(avg) if avg else 0

def get_top_skills(db: Session, limit: int = 5) -> list:
    results = (
        db.query(Skill.skill_name, func.count(Skill.id).label('count'))
        .group_by(Skill.skill_name)
        .order_by(desc('count'))
        .limit(limit)
        .all()
    )
    return [{"skill": r[0], "count": r[1]} for r in results]

def get_top_categories(db: Session, limit: int = 5) -> list:
    # Right now, we don't store category in the DB explicitly per resume.
    # We will mock the category distribution for the admin dashboard or calculate it 
    # based on skills. For Phase 11, we will return a static dummy distribution.
    return [
        {"category": "Software Engineering", "count": 120},
        {"category": "Data Science", "count": 85},
        {"category": "Web Development", "count": 60},
        {"category": "Product Management", "count": 30},
        {"category": "Cyber Security", "count": 15}
    ]
