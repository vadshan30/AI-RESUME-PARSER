import re

CATEGORIZED_SKILLS = {
    "Programming Languages": ["python", "java", "c", "c++", "javascript", "typescript", "ruby", "go", "php"],
    "Frameworks": ["fastapi", "django", "flask", "react", "nodejs", "angular", "vue", "spring", "express"],
    "Databases": ["sql", "mysql", "postgresql", "mongodb", "redis", "oracle", "sql server"],
    "Tools": ["git", "github", "aws", "azure", "docker", "kubernetes", "excel", "power bi", "linux", "jira"]
}

SOFT_SKILLS_DB = [
    "leadership", "communication", "teamwork", "problem solving",
    "adaptability", "critical thinking", "time management", "creativity"
]

def extract_categorized_skills(text: str) -> dict:
    """
    Extracts and categorizes technical skills.
    """
    text_lower = text.lower()
    found_categorized = {
        "Programming Languages": [],
        "Frameworks": [],
        "Databases": [],
        "Tools": []
    }
    
    for category, skills in CATEGORIZED_SKILLS.items():
        for skill in skills:
            if re.search(r'\b' + re.escape(skill) + r'\b', text_lower):
                found_categorized[category].append(skill.title())
                
    return found_categorized

def extract_hard_skills(text: str) -> list:
    """
    Legacy method for backward compatibility, flattens categorized skills.
    """
    categorized = extract_categorized_skills(text)
    all_skills = []
    for skills in categorized.values():
        all_skills.extend(skills)
    return list(set(all_skills))

def extract_soft_skills(text: str) -> list:
    text_lower = text.lower()
    found_skills = []
    
    for skill in SOFT_SKILLS_DB:
        if re.search(r'\b' + re.escape(skill) + r'\b', text_lower):
            found_skills.append(skill.title())
            
    return list(set(found_skills))
