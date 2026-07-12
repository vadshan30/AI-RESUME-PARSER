import logging
from typing import Dict, Any, List
from pydantic import BaseModel
from backend.services.gemini_service import GeminiService
from backend.utils.json_helper import parse_llm_json, JSONParsingError
import json

logger = logging.getLogger(__name__)

class Recommendations(BaseModel):
    priority_learning_plan: List[str]
    salary_estimate: str
    top_companies: List[str]
    interview_readiness: str
    resume_strengths: List[str]
    resume_weaknesses: List[str]
    hiring_probability: str

def generate_recommendations(match_data: Dict[str, Any], role_data: Dict[str, Any], score_data: Dict[str, Any]) -> Dict[str, Any]:
    """Generates qualitative recommendations based on the calculated gaps and scores."""
    logger.info("Generating recommendations...")
    
    missing = match_data.get('missing_mandatory_skills', [])
    role = role_data.get('job_canonical_role', 'Unknown')
    score = score_data.get('overall_score', 0)
    
    ai = GeminiService()
    prompt = f"""
    You are an expert tech recruiter and career coach.
    Based on an ATS Match Score of {score}/100 for the role of '{role}', and these missing mandatory skills: {', '.join(missing)},
    generate the following:
    - Priority Learning Plan (3-4 actionable steps to learn the missing skills)
    - Salary Estimate (range based on the role and current market)
    - Top Companies (3 companies hiring for this profile)
    - Interview Readiness (A short assessment of how ready they are)
    - Resume Strengths (2-3 generic strengths for a {score}% match)
    - Resume Weaknesses (2-3 weaknesses based on the missing skills)
    - Hiring Probability (e.g., 'Low', 'Medium', 'High', 'Very High')
    """
    
    response = ai.generate_content(prompt)
    if isinstance(response, str):
        if '"fallback":' in response:
            return Recommendations(
                priority_learning_plan=["Network Error: Could not generate plan"], 
                salary_estimate="Unknown", 
                top_companies=[],
                interview_readiness="Unknown", 
                resume_strengths=["Network Error: Could not evaluate strengths"], 
                resume_weaknesses=["Network Error: Could not evaluate weaknesses"], 
                hiring_probability="Unknown"
            ).model_dump()
        try:
            return parse_llm_json(response)
        except JSONParsingError:
            return Recommendations(
                priority_learning_plan=[], salary_estimate="Unknown", top_companies=[],
                interview_readiness="Unknown", resume_strengths=[], resume_weaknesses=[], hiring_probability="Unknown"
            ).model_dump()
    return response
