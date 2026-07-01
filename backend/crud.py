from sqlalchemy.orm import Session
from backend.models import Resume, Skill, Education, Project, Experience
from backend.schemas import ResumeCreate

def create_resume(db: Session, resume_data: ResumeCreate):
    # 1. Create the base Resume
    db_resume = Resume(
        filename=resume_data.filename,
        name=resume_data.name,
        email=resume_data.email,
        phone=resume_data.phone,
        resume_score=resume_data.resume_score
    )
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)

    # 2. Add Skills
    if resume_data.skills:
        for skill in resume_data.skills:
            db_skill = Skill(resume_id=db_resume.id, skill_name=skill.skill_name)
            db.add(db_skill)

    # 3. Add Education
    if resume_data.education:
        for edu in resume_data.education:
            db_edu = Education(resume_id=db_resume.id, degree_name=edu.degree_name)
            db.add(db_edu)

    # 4. Add Projects
    if resume_data.projects:
        for proj in resume_data.projects:
            db_proj = Project(resume_id=db_resume.id, project_name=proj.project_name)
            db.add(db_proj)

    # 5. Add Experience
    if resume_data.experience:
        for exp in resume_data.experience:
            db_exp = Experience(resume_id=db_resume.id, experience_detail=exp.experience_detail)
            db.add(db_exp)

    db.commit()
    db.refresh(db_resume)
    return db_resume

def get_resumes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Resume).offset(skip).limit(limit).all()

def get_resume(db: Session, resume_id: int):
    return db.query(Resume).filter(Resume.id == resume_id).first()

def delete_resume(db: Session, resume_id: int):
    db_resume = get_resume(db, resume_id)
    if db_resume:
        db.delete(db_resume)
        db.commit()
        return True
    return False

def rename_resume(db: Session, resume_id: int, new_name: str):
    db_resume = get_resume(db, resume_id)
    if db_resume:
        db_resume.name = new_name
        db.commit()
        db.refresh(db_resume)
        return db_resume
    return None

def duplicate_resume(db: Session, resume_id: int):
    original = get_resume(db, resume_id)
    if not original:
        return None
    
    db_resume = Resume(
        filename=original.filename,
        name=f"{original.name} (Copy)",
        email=original.email,
        phone=original.phone,
        resume_score=original.resume_score,
        analysis_data=original.analysis_data
    )
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)

    for skill in original.skills:
        db.add(Skill(resume_id=db_resume.id, skill_name=skill.skill_name))
    
    for edu in original.education:
        db.add(Education(resume_id=db_resume.id, degree_name=edu.degree_name))
        
    for proj in original.projects:
        db.add(Project(resume_id=db_resume.id, project_name=proj.project_name))
        
    for exp in original.experience:
        db.add(Experience(resume_id=db_resume.id, experience_detail=exp.experience_detail))
        
    db.commit()
    db.refresh(db_resume)
    return db_resume
