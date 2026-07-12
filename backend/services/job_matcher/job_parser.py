import logging
from typing import Dict, Any, List
from pydantic import BaseModel, Field
from backend.services.gemini_service import GeminiService
from backend.utils.json_helper import parse_llm_json, JSONParsingError
import json

logger = logging.getLogger(__name__)

class JobExtraction(BaseModel):
    job_title: str = Field(default="")
    experience_required: float = Field(default=0.0)
    education: List[str] = Field(default_factory=list)
    required_skills: List[str] = Field(default_factory=list)
    preferred_skills: List[str] = Field(default_factory=list)
    responsibilities: List[str] = Field(default_factory=list)
    frameworks: List[str] = Field(default_factory=list)
    languages: List[str] = Field(default_factory=list)
    databases: List[str] = Field(default_factory=list)
    cloud: List[str] = Field(default_factory=list)
    industry: str = Field(default="")
    domain: str = Field(default="")
    soft_skills: List[str] = Field(default_factory=list)

def parse_job_description(jd_text: str) -> Dict[str, Any]:
    """Parse raw job description into structured data."""
    logger.info("Parsing job description...")
    if not jd_text or not jd_text.strip():
        return JobExtraction().dict()
        
    ai = GeminiService()
    prompt = f"""
    You are an expert ATS parser. Extract the following information from the job description below.
    Extract specifically:
    - Job Title
    - Minimum experience required in years (float)
    - Education required
    - Mandatory/Required Skills
    - Preferred/Nice-to-have Skills
    - Core Responsibilities
    - Frameworks
    - Programming Languages
    - Databases
    - Cloud technologies
    - Industry (e.g., Finance, Tech)
    - Domain (e.g., E-commerce, Healthcare)
    - Soft Skills

    Job Description:
    {jd_text}
    """
    
    response = ai.generate_content(prompt)
    if isinstance(response, str):
        # Check for API connection timeout or quota issues returned as JSON error strings
        if '"fallback":' in response:
            try:
                fallback_dict = parse_llm_json(response)
                if fallback_dict.get("fallback") or not fallback_dict.get("success", True):
                    logger.warning(f"Gemini API Error fallback triggered: {fallback_dict.get('message')}")
                    return JobExtraction(
                        job_title="Fallback Job",
                        required_skills=["General Skills", "Communication"]
                    ).model_dump()
            except Exception as e:
                pass
        try:
            return parse_llm_json(response)
        except JSONParsingError:
            return JobExtraction().dict()
    return response
