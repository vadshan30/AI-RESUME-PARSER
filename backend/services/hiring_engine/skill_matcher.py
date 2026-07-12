from typing import List, Tuple, Set
from .utils import clean_skill
from .models import JobDescriptionData, ResumeData

class SkillMatcher:
    """Matches Critical, Important, and Optional skills."""
    
    @staticmethod
    def match(jd: JobDescriptionData, resume: ResumeData) -> Tuple[int, List[str], List[str]]:
        """Returns (score, matched_skills, missing_critical_skills)"""
        
        # If no skills at all, return 100
        if not jd.critical_skills and not jd.important_skills:
            return 100, [], []
            
        resume_skills_raw = resume.skills + resume.projects + resume.technologies if hasattr(resume, 'technologies') else resume.skills
        res_norm = {clean_skill(s) for s in resume_skills_raw}
        
        def check_skills(skill_list: List[str]) -> Tuple[List[str], List[str]]:
            matched = set()
            missing = set()
            for req_skill in skill_list:
                req_clean = clean_skill(req_skill)
                found = False
                for res_clean in res_norm:
                    if req_clean in res_clean or res_clean in req_clean:
                        matched.add(req_skill)
                        found = True
                        break
                if not found:
                    missing.add(req_skill)
            return list(matched), list(missing)

        # 1. Critical Skills (Weight: 70%)
        crit_matched, crit_missing = check_skills(jd.critical_skills)
        crit_score = 0
        if jd.critical_skills:
            crit_score = (len(crit_matched) / len(jd.critical_skills)) * 70
        else:
            crit_score = 70
            
        # 2. Important Skills (Weight: 30%)
        imp_matched, imp_missing = check_skills(jd.important_skills)
        imp_score = 0
        if jd.important_skills:
            imp_score = (len(imp_matched) / len(jd.important_skills)) * 30
        else:
            imp_score = 30
            
        total_score = int(crit_score + imp_score)
        all_matched = crit_matched + imp_matched
        
        return total_score, all_matched, crit_missing
        
    @staticmethod
    def match_preferred(jd: JobDescriptionData, resume: ResumeData) -> int:
        """Returns score (0-100) for optional skills."""
        if not jd.optional_skills:
            return 100
            
        res_norm = {clean_skill(s) for s in resume.skills}
        matched = 0
        for pref in jd.optional_skills:
            pref_clean = clean_skill(pref)
            for res_clean in res_norm:
                if pref_clean in res_clean or res_clean in pref_clean:
                    matched += 1
                    break
                    
        return int((matched / len(jd.optional_skills)) * 100)
