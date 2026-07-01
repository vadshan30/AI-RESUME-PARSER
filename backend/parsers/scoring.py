import re

def check_ats_formatting(text: str) -> dict:
    """
    Analyzes raw text to check for common ATS formatting rules.
    """
    checks = {
        "has_contact_info": False,
        "has_education": False,
        "has_experience": False,
        "has_skills": False,
        "standard_fonts": True, # Hard to detect from plain text, assuming true
        "no_tables_images": True, # Also hard, but we assume true for now, can be overridden if we parsed raw PDF structure
    }
    
    lower_text = text.lower()
    
    # Basic heading detection
    if re.search(r'\b(education|academic)\b', lower_text):
        checks["has_education"] = True
    if re.search(r'\b(experience|employment|work history)\b', lower_text):
        checks["has_experience"] = True
    if re.search(r'\b(skills|technologies|core competencies)\b', lower_text):
        checks["has_skills"] = True
        
    return checks

def calculate_detailed_score(name, email, phone, skills, education, projects, experience, formatting_checks, text_length) -> dict:
    """
    Calculates a detailed 100-point resume score based on exact weights:
    - Contact Info (10)
    - Skills (20)
    - Education (15)
    - Experience (20)
    - Projects (15)
    - ATS Formatting (10)
    - Resume Length (10)
    """
    breakdown = {
        "contact_info": {"score": 0, "max": 10},
        "skills": {"score": 0, "max": 20},
        "education": {"score": 0, "max": 15},
        "experience": {"score": 0, "max": 20},
        "projects": {"score": 0, "max": 15},
        "formatting": {"score": 0, "max": 10},
        "length": {"score": 0, "max": 10}
    }
    
    # 1. Contact Info (10)
    contact_score = 0
    if name and name != "Not Found": contact_score += 3
    if email and email != "Not Found": contact_score += 4
    if phone and phone != "Not Found": contact_score += 3
    breakdown["contact_info"]["score"] = contact_score
    
    # 2. Skills (20)
    # Give 2 points per skill, max 20
    skill_count = len(skills)
    breakdown["skills"]["score"] = min(skill_count * 2, 20)
    
    # 3. Education (15)
    # If they have education, give 15
    if len(education) > 0:
        breakdown["education"]["score"] = 15
    
    # 4. Experience (20)
    # 5 points per experience bullet, max 20
    exp_count = len(experience)
    breakdown["experience"]["score"] = min(exp_count * 5, 20)
    
    # 5. Projects (15)
    # 5 points per project item, max 15
    proj_count = len(projects)
    breakdown["projects"]["score"] = min(proj_count * 5, 15)
    
    # 6. ATS Formatting (10)
    fmt_score = 0
    if formatting_checks.get("has_education"): fmt_score += 2
    if formatting_checks.get("has_experience"): fmt_score += 2
    if formatting_checks.get("has_skills"): fmt_score += 2
    if formatting_checks.get("no_tables_images"): fmt_score += 4
    breakdown["formatting"]["score"] = fmt_score
    
    # 7. Resume Length (10)
    # A standard resume is between 400 and 1500 words.
    word_count = len(text_length.split())
    if 400 <= word_count <= 1500:
        breakdown["length"]["score"] = 10
    elif word_count < 400:
        breakdown["length"]["score"] = 5 # Too short
    else:
        breakdown["length"]["score"] = 7 # Too long, maybe penalized slightly
        
    # Calculate Total Score
    total_score = sum(item["score"] for item in breakdown.values())
    
    return {
        "total_score": total_score,
        "breakdown": breakdown
    }

# Keep the old one just in case other parts of the app import it, but we won't use it in /upload
def calculate_resume_score(skills, education, projects, experience, soft_skills, certifications) -> int:
    return 50 # Deprecated
