from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class SkillBase(BaseModel):
    skill_name: str

class SkillCreate(SkillBase):
    pass

class SkillSchema(SkillBase):
    id: int
    resume_id: int

    class Config:
        from_attributes = True

class EducationBase(BaseModel):
    degree_name: str

class EducationCreate(EducationBase):
    pass

class EducationSchema(EducationBase):
    id: int
    resume_id: int

    class Config:
        from_attributes = True

class ProjectBase(BaseModel):
    project_name: str

class ProjectCreate(ProjectBase):
    pass

class ProjectSchema(ProjectBase):
    id: int
    resume_id: int

    class Config:
        from_attributes = True

class ExperienceBase(BaseModel):
    experience_detail: str

class ExperienceCreate(ExperienceBase):
    pass

class ExperienceSchema(ExperienceBase):
    id: int
    resume_id: int

    class Config:
        from_attributes = True

class ResumeBase(BaseModel):
    filename: str
    file_path: Optional[str] = None
    name: str
    email: str
    phone: Optional[str] = None
    resume_score: int
    analysis_data: Optional[Dict[str, Any]] = None

class ResumeCreate(ResumeBase):
    skills: List[SkillCreate] = []
    education: List[EducationCreate] = []
    projects: List[ProjectCreate] = []
    experience: List[ExperienceCreate] = []

class ResumeSchema(ResumeBase):
    id: int
    created_at: datetime
    updated_at: datetime
    skills: List[SkillSchema] = []
    education: List[EducationSchema] = []
    projects: List[ProjectSchema] = []
    experience: List[ExperienceSchema] = []

    class Config:
        from_attributes = True
