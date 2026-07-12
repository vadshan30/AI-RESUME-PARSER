import logging
from typing import Dict, Any, List, Tuple
from pydantic import BaseModel, Field
from backend.services.gemini_service import GeminiService
from backend.utils.json_helper import parse_llm_json, JSONParsingError
import json

logger = logging.getLogger(__name__)

# Predefined canonical list of roles as requested
CANONICAL_ROLES = [
    "Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Scientist",
    "Machine Learning Engineer", "DevOps Engineer", "Cloud Engineer", "Cybersecurity Analyst",
    "Android Developer", "iOS Developer", "QA Engineer", "UI/UX Designer", "Game Developer",
    "Embedded Systems Engineer", "Python Developer", "Java Developer", ".NET Developer",
    "PHP Developer", "Ruby Developer", "Go Developer", "Rust Developer", "Node.js Developer",
    "React Developer", "Angular Developer", "Vue Developer", "AI Engineer", "Business Analyst",
    "Product Manager", "Data Analyst", "System Administrator", "Network Engineer",
    "Site Reliability Engineer", "Database Administrator", "Blockchain Developer"
]

class RoleClassification(BaseModel):
    resume_canonical_role: str = Field(default="Unknown")
    job_canonical_role: str = Field(default="Unknown")
    role_similarity_score: float = Field(default=0.0) # 0 to 100
    explanation: str = Field(default="")

def classify_roles(resume_data: Dict[str, Any], job_data: Dict[str, Any], target_role: str = None) -> Dict[str, Any]:
    """Classifies both the resume and the JD into canonical roles and calculates similarity."""
    logger.info("Classifying roles...")
    
    # Fast path if we don't have JD (Role Only Mode)
    if target_role and not job_data.get('job_title'):
        # Only classify resume
        ai = GeminiService()
        prompt = f"""
        Classify the following resume into exactly ONE of these canonical roles:
        {', '.join(CANONICAL_ROLES)}
        
        Resume Details:
        Name: {resume_data.get('name')}
        Experience: {resume_data.get('experience')}
        Skills: {', '.join(resume_data.get('skills', []))}
        
        Compare this to the user's selected Target Role: {target_role}
        Calculate a similarity score (0-100) between the resume's canonical role and the target role.
        """
        
        response = ai.generate_content(prompt)
        if '"fallback":' in response:
            res_dict = RoleClassification().model_dump()
        else:
            try:
                res_dict = parse_llm_json(response) if isinstance(response, str) else response
            except JSONParsingError:
                res_dict = RoleClassification().model_dump()
            
        if target_role:
            res_dict['job_canonical_role'] = target_role
        return res_dict

    ai = GeminiService()
    prompt = f"""
    You are an ATS Role Classifier. 
    Classify the Resume and the Job Description into exactly ONE of these canonical roles:
    {', '.join(CANONICAL_ROLES)}
    
    Resume Details:
    Skills: {', '.join(resume_data.get('skills', []))}
    Experience: {resume_data.get('experience')}
    
    Job Description Details:
    Title: {job_data.get('job_title')}
    Required Skills: {', '.join(job_data.get('required_skills', []))}
    
    Calculate a similarity score (0-100) between the two canonical roles based on how interchangeable they are in the industry.
    """
    
    response = ai.generate_content(prompt)
    if isinstance(response, str):
        if '"fallback":' in response:
            return RoleClassification().model_dump()
        try:
            return parse_llm_json(response)
        except JSONParsingError:
            return RoleClassification().model_dump()
    return response
