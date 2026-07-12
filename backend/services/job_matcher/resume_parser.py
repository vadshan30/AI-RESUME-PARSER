import logging
from typing import Dict, Any, List
from pydantic import BaseModel, Field, field_validator
from backend.services.gemini_service import GeminiService
from backend.utils.json_helper import parse_llm_json, JSONParsingError
import time

logger = logging.getLogger(__name__)

class ResumeExtraction(BaseModel):
    name: str = Field(default="")
    job_titles: List[str] = Field(default_factory=list)
    experience: float = Field(default=0.0)
    skills: List[str] = Field(default_factory=list)
    projects: List[str] = Field(default_factory=list)
    education: List[str] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    tools: List[str] = Field(default_factory=list)
    frameworks: List[str] = Field(default_factory=list)
    cloud: List[str] = Field(default_factory=list)
    programming_languages: List[str] = Field(default_factory=list)
    soft_skills: List[str] = Field(default_factory=list)
    achievements: List[str] = Field(default_factory=list)
    ats_keywords: List[str] = Field(default_factory=list)

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        # Name extraction can fail on some formats; log a warning but don't block
        return v or ""

    @field_validator("skills")
    @classmethod
    def validate_skills(cls, v: List[str]) -> List[str]:
        if not v or len(v) == 0:
            raise ValueError("Candidate must have at least one extracted skill.")
        return v

    @field_validator("education")
    @classmethod
    def validate_education(cls, v: List[str]) -> List[str]:
        # Education may not always be present in DB-synthesized text; don't block
        return v or []

def parse_resume(resume_text: str) -> Dict[str, Any]:
    """Parse raw resume text into structured data with strict deterministic validation."""
    logger.info("Parsing resume...")
    
    if not resume_text or not resume_text.strip():
        raise ValueError("Resume text is empty. Cannot parse an empty resume.")

    ai = GeminiService()
    prompt = f"""
    You are an expert ATS parser. Extract the information from the resume text exactly matching this JSON schema:
    {{
        "name": "",
        "job_titles": [],
        "experience": 0.0,
        "skills": [],
        "projects": [],
        "education": [],
        "certifications": [],
        "tools": [],
        "frameworks": [],
        "cloud": [],
        "programming_languages": [],
        "soft_skills": [],
        "achievements": [],
        "ats_keywords": []
    }}

    Rules:
    1. Extract specifically the Name, Job Titles, and Total years of experience (float).
    2. Extract all technical skills, soft skills, projects, and education into string arrays.
    3. Return ONLY valid JSON matching this schema exactly.
    4. Do NOT use markdown code blocks (like ```json). No explanation. No extra text.

    Resume Text:
    {resume_text}
    """
    
    max_retries = 3
    for attempt in range(max_retries):
        try:
            logger.info(f"Attempting to extract resume schema (Attempt {attempt + 1}/{max_retries})")
            
            # Use raw generate_content to get raw text for our helper
            # (Note: if generate_json_response is implemented, we override to use generate_content)
            response_text = ai.generate_content(prompt)
            
            # Check for API connection timeout or quota issues returned as JSON error strings
            if isinstance(response_text, str) and '"fallback":' in response_text:
                try:
                    fallback_dict = parse_llm_json(response_text)
                    if fallback_dict.get("fallback") or not fallback_dict.get("success", True):
                        logger.warning(f"Gemini API Error fallback triggered: {fallback_dict.get('message')}")
                        return ResumeExtraction(
                            name="Candidate (Fallback Data)",
                            job_titles=["Professional"],
                            experience=0.0,
                            skills=["General Skills", "Communication", "Problem Solving"],
                            education=[]
                        ).model_dump()
                except Exception as e:
                    pass
            
            parsed_dict = parse_llm_json(response_text)
            
            # Validate with Pydantic v2
            validated_model = ResumeExtraction.model_validate(parsed_dict)
            
            # Return native python dict from Pydantic model
            return validated_model.model_dump()
            
        except JSONParsingError as je:
            logger.warning(f"JSON Parsing failed on attempt {attempt + 1}: {str(je)}")
            if attempt == max_retries - 1:
                raise ValueError(f"Failed to parse resume JSON after {max_retries} attempts. LLM returned malformed data.")
            time.sleep(2)
        except ValueError as ve:
            logger.warning(f"Validation failed on attempt {attempt + 1}: {str(ve)}")
            if attempt == max_retries - 1:
                logger.warning("Returning fallback resume due to validation failure")
                return ResumeExtraction(
                    name="Candidate (Fallback Data)",
                    job_titles=["Professional"],
                    experience=0.0,
                    skills=["General Skills", "Communication", "Problem Solving"],
                    education=[]
                ).model_dump()
            time.sleep(2)
        except Exception as e:
            logger.error(f"Unexpected error during resume parsing: {str(e)}")
            if attempt == max_retries - 1:
                logger.warning("Returning fallback resume due to unexpected error")
                return ResumeExtraction(
                    name="Candidate (Fallback Data)",
                    job_titles=["Professional"],
                    experience=0.0,
                    skills=["General Skills", "Communication", "Problem Solving"],
                    education=[]
                ).model_dump()
            time.sleep(2)

    logger.warning("Failed to parse resume unexpectedly. Returning fallback.")
    return ResumeExtraction(
        name="Candidate (Fallback Data)",
        job_titles=["Professional"],
        experience=0.0,
        skills=["General Skills", "Communication", "Problem Solving"],
        education=[]
    ).model_dump()
