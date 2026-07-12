import re
from typing import List, Set
from .models import JobDescriptionData, ResumeData, ModuleResult

def normalize_skill(skill: str) -> str:
    s = skill.lower().strip()
    s = s.replace('.js', '')
    if s == 'restful api': return 'rest api'
    if s == 'html5': return 'html'
    if s == 'css3': return 'css'
    return s

def normalize_role(role: str) -> str:
    r = role.lower().strip()
    if any(x in r for x in ['frontend', 'front end', 'front-end', 'ui engineer', 'ui developer', 'react']): return 'frontend'
    if any(x in r for x in ['backend', 'back end', 'back-end', 'python', 'fastapi', 'django', 'node']): return 'backend'
    if any(x in r for x in ['data scientist', 'ml engineer', 'machine learning', 'data science']): return 'data science'
    if any(x in r for x in ['full stack', 'full-stack']): return 'full stack'
    return r


def extract_years_from_text(text_list: List[str]) -> int:
    """Extract total years from a list of experience strings (heuristic)."""
    total_years = 0
    for text in text_list:
        matches = re.findall(r'(\d+)\+?\s*(?:year|years|yr|yrs)', text, re.IGNORECASE)
        if matches:
            total_years += sum(int(m) for m in matches)
        else:
            dates = re.findall(r'(20\d{2})', text)
            if len(dates) >= 2:
                years = max(int(d) for d in dates) - min(int(d) for d in dates)
                total_years += max(1, years)
            elif len(dates) == 1:
                years = 2024 - int(dates[0])
                total_years += max(1, years)
    return total_years if total_years > 0 else 2

class RoleSimilarityService:
    def score(self, jd: JobDescriptionData, resume: ResumeData) -> ModuleResult:
        jd_role = jd.role.lower()
        jd_role_norm = normalize_role(jd.role)
        score = 20
        reason = "Role titles do not closely match."
        
        if jd_role:
            for exp in resume.experience:
                exp_norm = normalize_role(exp)
                if jd_role_norm and jd_role_norm in exp_norm:
                    score = 95
                    reason = f"Candidate has direct experience as {jd.role}."
                    break
            
            if score == 20:
                jd_words = set(jd_role.replace('-', ' ').split())
                for exp in resume.experience:
                    exp_words = set(exp.lower().replace('-', ' ').split())
                    match_count = len(jd_words & exp_words)
                    if match_count >= 2:
                        score = max(score, 70)
                        reason = f"Candidate has experience strongly related to {jd.role}."
                    elif match_count == 1:
                        score = max(score, 40)
                        reason = f"Candidate has some partial alignment with {jd.role}."
                        
        return ModuleResult(score=score, reason=reason)

class SkillMatchingService:
    def score_mandatory(self, jd: JobDescriptionData, resume: ResumeData) -> ModuleResult:
        jd_req_skills = set(normalize_skill(s) for s in jd.required_skills)
        res_skills_lower = set(normalize_skill(s) for s in resume.skills)
        
        matched_skills = list(jd_req_skills & res_skills_lower)
        missing_skills = list(jd_req_skills - res_skills_lower)
        
        score = 100
        if jd_req_skills:
            score = int((len(matched_skills) / len(jd_req_skills)) * 100)
            
        return ModuleResult(
            score=score,
            matched_items=[s for s in jd.required_skills if s.lower() in matched_skills],
            missing_items=[s for s in jd.required_skills if s.lower() in missing_skills],
            reason=f"Matched {len(matched_skills)} out of {len(jd_req_skills)} required skills."
        )
        
    def score_preferred(self, jd: JobDescriptionData, resume: ResumeData) -> ModuleResult:
        jd_pref_skills = set(normalize_skill(s) for s in jd.preferred_skills)
        res_skills_lower = set(normalize_skill(s) for s in resume.skills)
        
        score = 100
        if jd_pref_skills:
            matched_count = len(jd_pref_skills & res_skills_lower)
            score = int((matched_count / len(jd_pref_skills)) * 100)
            
        return ModuleResult(score=score, reason="Preferred skills matching.")

class ExperienceService:
    def score(self, jd: JobDescriptionData, resume: ResumeData) -> ModuleResult:
        resume_years = extract_years_from_text(resume.experience)
        jd_years = jd.experience_required
        
        score = 100
        gap = "None"
        reason = "Candidate meets or exceeds experience requirements."
        
        if jd_years > 0:
            ratio = min(resume_years / jd_years, 1.0)
            score = int(ratio * 100)
            if ratio < 1.0:
                gap = f"Candidate has ~{resume_years} years but job requires {jd_years} years."
                reason = "Candidate falls short of required years of experience."
                
        return ModuleResult(score=score, reason=reason, gap_text=gap)

class EducationService:
    def score(self, jd: JobDescriptionData, resume: ResumeData) -> ModuleResult:
        jd_edu = jd.education.lower()
        res_edu = " ".join(resume.education).lower()
        
        score = 100
        if jd_edu and jd_edu not in ['none', 'not specified', 'na']:
            if jd_edu in res_edu:
                score = 100
            elif 'bachelor' in res_edu and 'master' in jd_edu:
                score = 60
            elif 'master' in res_edu and 'bachelor' in jd_edu:
                score = 100
            else:
                score = 50
                
        return ModuleResult(score=score, reason="Education requirement matching applied.")

class ResponsibilityService:
    def score(self, jd: JobDescriptionData, resume: ResumeData) -> ModuleResult:
        resp_list = jd.responsibilities
        res_full_text = " ".join(resume.experience + resume.projects).lower()
        
        score = 70
        if resp_list:
            match_count = sum(1 for r in resp_list if any(kw in res_full_text for kw in r.lower().split() if len(kw) > 4))
            score = min(100, int((match_count / max(1, len(resp_list))) * 100) + 20)
            
        return ModuleResult(score=score, reason="Semantic comparison of responsibilities.")

class KeywordCoverageService:
    def score(self, jd: JobDescriptionData, resume: ResumeData) -> ModuleResult:
        import json
        all_jd_text = json.dumps(jd.model_dump()).lower()
        jd_keywords = set(re.findall(r'[a-z]{4,}', all_jd_text))
        
        res_full_text = " ".join(resume.experience + resume.education + resume.projects + resume.skills).lower()
        
        found_kws = sum(1 for kw in jd_keywords if kw in res_full_text)
        score = 100
        if jd_keywords:
            score = min(100, int((found_kws / len(jd_keywords)) * 120))
            
        return ModuleResult(score=score, reason=f"Found ATS keyword density coverage of ~{score}%.")
