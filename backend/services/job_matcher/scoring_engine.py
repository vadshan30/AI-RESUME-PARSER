import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

def calculate_scores(match_data: Dict[str, Any], role_data: Dict[str, Any], resume_data: Dict[str, Any], job_data: Dict[str, Any]) -> Dict[str, Any]:
    """Calculates weighted ATS scores based on strict rules."""
    logger.info("Calculating ATS scores...")
    
    # 1. Base Score Calculations
    # Skills (40%)
    total_mand = match_data.get('total_required_skills', 1)
    miss_mand_count = len(match_data.get('missing_mandatory_skills', []))
    skill_match_ratio = max(0, (total_mand - miss_mand_count) / total_mand) if total_mand > 0 else 1.0
    skills_score = skill_match_ratio * 40.0
    
    # Experience (25%)
    jd_exp = float(job_data.get('experience_required', 0) or 0)
    res_exp_val = resume_data.get('experience', 0) or resume_data.get('experience_years', 0)
    res_exp = float(res_exp_val if str(res_exp_val).replace('.','',1).isdigit() else 0)
    if jd_exp > 0:
        exp_ratio = min(res_exp / jd_exp, 1.0)
    else:
        exp_ratio = 1.0 if res_exp > 0 else 0.5  # Give some credit if experience is not required but they have none, or full if they have some.
    exp_score = exp_ratio * 25.0
    
    # Education (15%)
    education_score = 15.0 if len(resume_data.get('education', [])) > 0 else 0.0
    
    # Projects (10%)
    projects_count = len(resume_data.get('projects', []))
    projects_score = min(projects_count / 2.0, 1.0) * 10.0  # 2 projects for full score
    
    # Tools/Frameworks (5%)
    total_tools = match_data.get('total_tools', 1)
    if total_tools == 1 and not job_data.get('preferred_skills') and not job_data.get('tools'):
        tools_score = 5.0 if len(resume_data.get('tools', [])) > 0 else 2.5
    else:
        miss_tools_count = len(match_data.get('missing_tools', []))
        tools_match_ratio = max(0, (total_tools - miss_tools_count) / total_tools)
        tools_score = tools_match_ratio * 5.0

    # Certifications (5%)
    certifications_score = 5.0 if len(resume_data.get('certifications', [])) > 0 else 0.0

    final_total = skills_score + exp_score + education_score + projects_score + tools_score + certifications_score
    final_total = max(0, min(100, final_total))
    
    overall_score = int(final_total)
    
    # Classification
    if overall_score >= 85:
        classification = {"grade": "Excellent Resume", "color": "Green"}
    elif overall_score >= 70:
        classification = {"grade": "Good Resume", "color": "Light Green"}
    elif overall_score >= 50:
        classification = {"grade": "Average Resume", "color": "Yellow"}
    else:
        classification = {"grade": "Weak Resume", "color": "Orange"}
        
    return {
        "overall_score": overall_score,
        "classification": classification,
        "breakdown": {
            "mandatory_skills": int((skills_score / 40.0) * 100) if skills_score > 0 else 0,
            "experience": int((exp_score / 25.0) * 100) if exp_score > 0 else 0,
            "education": int((education_score / 15.0) * 100) if education_score > 0 else 0,
            "projects": int((projects_score / 10.0) * 100) if projects_score > 0 else 0,
            "tools": int((tools_score / 5.0) * 100) if tools_score > 0 else 0,
            "certifications": int((certifications_score / 5.0) * 100) if certifications_score > 0 else 0
        }
    }
