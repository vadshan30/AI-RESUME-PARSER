import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

def match_features(resume_data: Dict[str, Any], job_data: Dict[str, Any]) -> Dict[str, Any]:
    """Matches exact and semantic features between Resume and JD."""
    logger.info("Matching features...")
    
    # Simple normalizer for matching
    def normalize(text: str) -> str:
        return str(text).lower().strip()
    
    res_skills = set([normalize(s) for s in resume_data.get('skills', [])])
    job_req_skills = set([normalize(s) for s in job_data.get('required_skills', [])])
    
    matched_mandatory_skills = list(res_skills.intersection(job_req_skills))
    missing_mandatory_skills = list(job_req_skills - res_skills)
    
    # Calculate gap arrays for reporting
    res_fw = set([normalize(s) for s in resume_data.get('frameworks', [])])
    job_fw = set([normalize(s) for s in job_data.get('frameworks', [])])
    matched_frameworks = list(res_fw.intersection(job_fw))
    missing_frameworks = list(job_fw - res_fw)
    
    res_tools = set([normalize(s) for s in resume_data.get('tools', [])])
    # The current engine matched tools against preferred_skills. We should match tools to tools, 
    # but the job parser might not pull tools explicitly. Let's match tools against jd's preferred_skills as a fallback
    job_tools_list = job_data.get('tools', [])
    if not job_tools_list:
        job_tools_list = job_data.get('preferred_skills', [])
    job_tools = set([normalize(s) for s in job_tools_list])
    matched_tools = list(res_tools.intersection(job_tools))
    missing_tools = list(job_tools - res_tools)
    
    exp_gap = 0
    jd_exp = float(job_data.get('experience_required', 0) or 0)
    res_exp = float(resume_data.get('experience', 0) or 0)
    exp_gap = jd_exp - res_exp if jd_exp > res_exp else 0

    return {
        "matched_mandatory_skills": matched_mandatory_skills,
        "missing_mandatory_skills": missing_mandatory_skills,
        "matched_frameworks": matched_frameworks,
        "missing_frameworks": missing_frameworks,
        "matched_tools": matched_tools,
        "missing_tools": missing_tools,
        "experience_gap_years": exp_gap,
        "total_required_skills": len(job_req_skills) if job_req_skills else 1,
        "total_frameworks": len(job_fw) if job_fw else 1,
        "total_tools": len(job_tools) if job_tools else 1
    }
