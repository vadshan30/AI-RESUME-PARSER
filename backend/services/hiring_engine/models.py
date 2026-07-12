from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class JobDescriptionData(BaseModel):
    role: str = ""
    critical_skills: List[str] = Field(default_factory=list)
    important_skills: List[str] = Field(default_factory=list)
    optional_skills: List[str] = Field(default_factory=list)
    experience: int = 0
    education: str = "Unknown"
    responsibilities: List[str] = Field(default_factory=list)
    technologies: List[str] = Field(default_factory=list)
    soft_skills: List[str] = Field(default_factory=list)
    
    # Keep these for backward compatibility during transitions, but map to tri-tier where possible
    required_skills: List[str] = Field(default_factory=list)
    preferred_skills: List[str] = Field(default_factory=list)

class ResumeData(BaseModel):
    # Flexible container for resume JSON structure
    skills: List[str] = Field(default_factory=list)
    experience: List[str] = Field(default_factory=list)
    education: List[str] = Field(default_factory=list)
    projects: List[str] = Field(default_factory=list)
    job_titles: List[str] = Field(default_factory=list)
    experience_years: float = 0.0
    parsed_text: str = ""

class DebugLog(BaseModel):
    validator_result: str = ""
    validator_confidence: int = 0
    extracted_role: str = ""
    extracted_skills: List[str] = Field(default_factory=list)
    resume_role: str = ""
    resume_skills: List[str] = Field(default_factory=list)
    matched_skills: List[str] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)
    role_score: int = 0
    skill_score: int = 0
    experience_score: int = 0
    education_score: int = 0
    responsibilities_score: int = 0
    keyword_score: int = 0
    raw_score: int = 0
    hard_rule_applied: str = "No"
    normalized_score: int = 0
    reason: str = ""
