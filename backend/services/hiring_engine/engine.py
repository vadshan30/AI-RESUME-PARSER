import json
import logging
from datetime import datetime
from typing import Dict, Any

from .models import ResumeData, DebugLog
from .validator import JobDescriptionValidator
from .parser import JobDescriptionParser
from .role_mapper import RoleMapper
from .skill_matcher import SkillMatcher
from .experience_matcher import ExperienceMatcher
from .education_matcher import EducationMatcher
from .responsibility_matcher import ResponsibilityMatcher
from .keyword_matcher import KeywordMatcher
from .calculator import WeightedCalculator
from .normalizer import HardRuleNormalizer
from .gap_analysis import GapAnalysisGenerator

logger = logging.getLogger(__name__)

class HiringProbabilityEngine:
    """The Uncached 3-Layer ATS Orchestrator."""
    
    def __init__(self):
        self.parser = JobDescriptionParser()
        
    def analyze(self, resume_dict: Dict[str, Any], job_description: str) -> Dict[str, Any]:
        debug_log = DebugLog()
        
        # 1. Validation
        is_valid, conf = JobDescriptionValidator.validate(job_description)
        debug_log.validator_confidence = conf
        debug_log.validator_result = "PASS" if is_valid else "FAIL"
        
        if not is_valid:
            return {
                "valid": False,
                "error": True,
                "message": "Job description is too short or doesn't contain job-related context.",
                "debug": debug_log.model_dump()
            }
            
        # 2. Parse Data
        try:
            jd_data = self.parser.parse(job_description)
            resume_data = ResumeData(**resume_dict)
        except Exception as e:
            return {
                "valid": False,
                "error": True,
                "message": f"Failed to parse models: {str(e)}",
                "debug": debug_log.model_dump()
            }
            
        debug_log.extracted_role = jd_data.role
        debug_log.extracted_skills = jd_data.critical_skills + jd_data.important_skills
        debug_log.resume_skills = resume_data.skills
        
        # 3. Role Mapping / Domain Gating
        jd_domain = RoleMapper.map_role(jd_data.role)
        res_domain = "Unknown"
        if resume_data.job_titles:
            res_domain = RoleMapper.map_role(resume_data.job_titles[0])
            debug_log.resume_role = resume_data.job_titles[0]
            
        if jd_domain == res_domain and jd_domain != "Unknown":
            role_score = 95
        else:
            role_score = 30
            if jd_data.role.lower() in " ".join(resume_data.job_titles).lower():
                role_score = 80
                
        debug_log.role_score = role_score
        
        # 4. Tri-Tier Skill Matching
        mand_score, matched_skills, missing_crit = SkillMatcher.match(jd_data, resume_data)
        pref_score = SkillMatcher.match_preferred(jd_data, resume_data)
        debug_log.skill_score = mand_score
        debug_log.matched_skills = matched_skills
        debug_log.missing_skills = missing_crit
        
        # 5. Experience
        exp_score = ExperienceMatcher.match(jd_data, resume_data)
        debug_log.experience_score = exp_score
        
        # 6. Education
        edu_score = EducationMatcher.match(jd_data, resume_data)
        debug_log.education_score = edu_score
        
        # 7. Responsibilities
        resp_score = ResponsibilityMatcher.match(jd_data, resume_data)
        debug_log.responsibilities_score = resp_score
        
        # 8. Keywords
        kw_score = KeywordMatcher.match(jd_data, resume_data)
        debug_log.keyword_score = kw_score
        
        # 9. Calculator
        raw_score = WeightedCalculator.calculate(
            role_score=role_score,
            mand_skills_score=mand_score,
            exp_score=exp_score,
            resp_score=resp_score,
            edu_score=edu_score,
            pref_skills_score=pref_score,
            kw_score=kw_score
        )
        debug_log.raw_score = raw_score
        
        # 10. Normalizer (Hierarchical Domain Gate + Hard Rule Engine)
        final_score, classification, hard_rule, reason_text = HardRuleNormalizer.normalize(
            raw_score=raw_score,
            role_score=role_score,
            mand_skills_score=mand_score,
            jd_domain=jd_domain,
            resume_domain=res_domain,
            exp_score=exp_score,
            missing_critical=missing_crit
        )
        debug_log.normalized_score = final_score
        debug_log.hard_rule_applied = hard_rule
        debug_log.reason = reason_text
        
        # 11. Gap Analysis (Recruiter Insights)
        exp_gap = "Meets requirement" if exp_score == 100 else f"Has {resume_data.experience_years} years, Job requires {jd_data.experience} years"
        gaps = GapAnalysisGenerator.generate(
            matched_mand_skills=matched_skills,
            missing_mand_skills=missing_crit,
            missing_pref_skills=jd_data.optional_skills,
            exp_gap=exp_gap,
            edu_score=edu_score,
            final_score=final_score
        )
        
        # 12. Final 3-Layer Response
        return {
            "valid": True,
            "ats_match": {
                "overall_score": final_score,
                "classification": classification
            },
            "technical_fit": {
                "role_similarity": role_score,
                "mandatory_skills": mand_score,
                "preferred_skills": pref_score,
                "responsibilities": resp_score,
                "experience": exp_score,
                "education": edu_score,
                "keyword_coverage": kw_score
            },
            "recruiter_insights": {
                "top_strengths": gaps["strengths"],
                "critical_missing_skills": missing_crit,
                "matched_skills": matched_skills,
                "hiring_probability": gaps["hiring_probability"],
                "reasoning": reason_text,
                "recommended_learning_path": gaps["recommendations"]
            },
            "debug": debug_log.model_dump(),
            "_timestamp": datetime.utcnow().isoformat()
        }

# Singleton Instance
hiring_engine_app = HiringProbabilityEngine()
