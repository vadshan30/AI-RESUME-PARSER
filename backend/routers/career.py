from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import math
import random

from backend.data.career_db import get_career_intelligence

router = APIRouter(
    prefix="/api/career",
    tags=["Career Intelligence"]
)

class AnalyzeRequest(BaseModel):
    target_role: str
    resume_skills: List[str]
    resume_experience: Optional[int] = 0

@router.post("/analyze")
def analyze_career_gap(req: AnalyzeRequest):
    if not req.target_role:
        raise HTTPException(status_code=400, detail="Target role is required")
        
    intelligence = get_career_intelligence(req.target_role)
    
    # Lowercase skills for matching
    r_skills = [s.lower() for s in req.resume_skills]
    req_skills = intelligence["required_skills"]
    pref_skills = intelligence["preferred_skills"]
    
    mastered = []
    intermediate = []
    missing = []
    optional = []
    
    # Calculate Gaps
    for skill in req_skills:
        matched = False
        for rs in r_skills:
            if skill.lower() in rs or rs in skill.lower():
                matched = True
                break
        
        if matched:
            mastered.append({"skill": skill, "category": "Required"})
        else:
            missing.append({
                "skill": skill, 
                "severity": "Critical" if req_skills.index(skill) < len(req_skills)//2 else "High"
            })
            
    for skill in pref_skills:
        matched = False
        for rs in r_skills:
            if skill.lower() in rs or rs in skill.lower():
                matched = True
                break
        
        if matched:
            intermediate.append({"skill": skill, "category": "Preferred"})
        else:
            optional.append({
                "skill": skill, 
                "severity": "Medium" if pref_skills.index(skill) < len(pref_skills)//2 else "Low"
            })

    # Progress Bars logic (Heuristic based on matches)
    base_prog = min(int((len(mastered) / max(len(req_skills), 1)) * 100), 100)
    progress = {
        "Programming Languages": min(base_prog + random.randint(0, 15), 100),
        "Frameworks & Libraries": min(base_prog + random.randint(-10, 10), 100),
        "Cloud & DevOps": min(base_prog + random.randint(-20, 5), 100),
        "Databases": min(base_prog + random.randint(-10, 15), 100),
        "Soft Skills": random.randint(70, 95),
    }
    
    # Career Readiness Score
    tech_score = base_prog
    ind_score = min(int(tech_score * 0.9 + random.randint(5,15)), 100)
    int_score = int(tech_score * 0.8)
    res_score = random.randint(60, 95)
    port_score = random.randint(40, 85)
    overall = int((tech_score + ind_score + int_score + res_score + port_score) / 5)

    # Timeline estimates based on missing critical skills
    months_to_ready = math.ceil(len(missing) * 1.2)
    if months_to_ready == 0:
        months_to_ready = 1

    timeline = {
        "job_ready": f"{months_to_ready} Months",
        "interview_ready": f"{math.ceil(months_to_ready * 0.7)} Months",
        "mid_level": f"{months_to_ready + 24} Months"
    }

    # AI Career Suggestions (Transitions)
    transitions = []
    cat = intelligence.get("category", "")
    if cat == "Software Engineering" or cat == "Web Development":
        transitions = [
            {"role": "Full Stack Developer", "added_skills": ["Node.js", "React", "MongoDB"]},
            {"role": "DevOps Engineer", "added_skills": ["Docker", "Kubernetes", "AWS"]}
        ]
    elif cat == "Data & Analytics" or cat == "Artificial Intelligence":
        transitions = [
            {"role": "Data Engineer", "added_skills": ["Spark", "Hadoop", "Airflow"]},
            {"role": "Machine Learning Engineer", "added_skills": ["PyTorch", "TensorFlow", "MLOps"]}
        ]
    elif cat == "Cyber Security":
        transitions = [
            {"role": "Cloud Security Architect", "added_skills": ["AWS Security", "Azure Sentinel"]},
            {"role": "Penetration Tester", "added_skills": ["OSCP", "Exploit Development"]}
        ]
    else:
        transitions = [
            {"role": "Technical Lead", "added_skills": ["System Design", "Leadership", "Agile"]},
            {"role": "Product Manager", "added_skills": ["Product Strategy", "User Research", "Roadmapping"]}
        ]

    return {
        "target_career": intelligence,
        "analysis": {
            "mastered": mastered,
            "intermediate": intermediate,
            "missing_critical": missing,
            "optional": optional,
            "progress_bars": progress,
            "readiness": {
                "technical": tech_score,
                "industry": ind_score,
                "interview": int_score,
                "resume": res_score,
                "portfolio": port_score,
                "overall": overall
            },
            "timeline": timeline,
            "transitions": transitions
        }
    }
