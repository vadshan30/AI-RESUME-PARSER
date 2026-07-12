import json
import logging
import spacy
from typing import Optional
from backend.ai.providers.gemini_provider import GeminiProvider
from .models import JobDescriptionData
from .utils import extract_years_of_experience, extract_skills_regex

logger = logging.getLogger(__name__)

class JobDescriptionParser:
    """Parses JD text into a structured JSON schema using LLM, with Regex fallback."""
    
    def __init__(self):
        self.provider = GeminiProvider()
        
    def parse(self, job_description: str) -> JobDescriptionData:
        prompt = f"""
        Extract the following information from the Job Description into a structured JSON object.
        Job Description:
        '''{job_description}'''
        
        Expected JSON format EXACTLY:
        {{
            "role": "string",
            "experience": 0,
            "education": "string",
            "critical_skills": ["react", "javascript"],
            "important_skills": ["redux", "tailwind"],
            "optional_skills": ["next.js", "jest"],
            "responsibilities": ["responsibility 1"],
            "technologies": ["tech1"],
            "soft_skills": ["soft1"]
        }}
        
        Guidelines:
        - critical_skills: The absolute core technologies required (e.g. language, primary framework).
        - important_skills: Secondary tools, libraries, or methodologies mentioned as requirements.
        - optional_skills: "Nice to have" or "Bonus" skills.
        - If an exact number of years is not found, infer 0.
        
        Return ONLY valid JSON. No markdown tags.
        """
        try:
            resp = self.provider.generate_text(prompt).strip()
            if resp.startswith("```json"): resp = resp[7:]
            if resp.endswith("```"): resp = resp[:-3]
            data = json.loads(resp.strip())
            
            critical = data.get("critical_skills", [])
            important = data.get("important_skills", [])
            optional = data.get("optional_skills", [])
            
            # For fallback/backward compat
            required = critical + important
            
            return JobDescriptionData(
                role=data.get("role", "Unknown"),
                experience=data.get("experience", data.get("experience_required", 0)),
                education=data.get("education", "Unknown"),
                critical_skills=critical,
                important_skills=important,
                optional_skills=optional,
                required_skills=required,
                preferred_skills=optional,
                responsibilities=data.get("responsibilities", []),
                technologies=data.get("technologies", []),
                soft_skills=data.get("soft_skills", [])
            )
        except Exception as e:
            logger.error(f"Error parsing JD via LLM, falling back to Regex. Error: {e}")
            return self._fallback_parse(job_description)

    def _fallback_parse(self, text: str) -> JobDescriptionData:
        """Regex fallback when LLM fails."""
        skills = extract_skills_regex(text)
        exp = extract_years_of_experience(text)
        
        # Roughly split skills
        critical = skills[:3]
        important = skills[3:]
        
        return JobDescriptionData(
            role="Unknown Role (Fallback)",
            critical_skills=critical,
            important_skills=important,
            required_skills=skills,
            experience=exp,
            responsibilities=["Analyzed from raw text"] if len(text) > 50 else []
        )
