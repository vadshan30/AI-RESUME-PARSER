from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any
from datetime import datetime

# Auth Schemas
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True

# Resume & Analysis Schemas
class ResumeAnalysisResponse(BaseModel):
    id: int
    resume_id: int
    skills: list
    soft_skills: list
    projects: list
    experience: list
    education: list
    missing_skills: list
    recommended_jobs: list
    learning_recommendations: list
    ats_recommendations: list
    created_at: datetime

    class Config:
        from_attributes = True

class ResumeResponse(BaseModel):
    id: int
    user_id: int
    resume_name: str
    ats_score: int
    resume_score: int
    category: str
    confidence: int
    upload_date: datetime
    analysis: Optional[ResumeAnalysisResponse] = None

    class Config:
        from_attributes = True
