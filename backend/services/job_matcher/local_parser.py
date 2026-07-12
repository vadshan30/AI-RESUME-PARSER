import re
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

# Master Skill Database based on the user's plan
SKILL_DB = {
    "programming_languages": [
        "Python", "Java", "JavaScript", "C++", "C#", "Ruby", 
        "Go", "Rust", "Swift", "Kotlin", "PHP", "TypeScript", "SQL", "HTML", "CSS"
    ],
    "frameworks": [
        "React", "Angular", "Vue.js", "Node.js", "Django", 
        "Flask", "Spring Boot", "Ruby on Rails", "Laravel", "Next.js", "Express", "FastAPI"
    ],
    "cloud_platforms": [
        "AWS", "Azure", "Google Cloud", "Oracle Cloud", 
        "IBM Cloud", "Alibaba Cloud", "GCP"
    ],
    "devops_tools": [
        "Docker", "Kubernetes", "Jenkins", "GitLab CI", 
        "Terraform", "Ansible", "Prometheus", "Grafana", "CI/CD"
    ],
    "databases": [
        "MySQL", "PostgreSQL", "MongoDB", "Redis", 
        "Cassandra", "Elasticsearch", "DynamoDB", "SQLite"
    ],
    "soft_skills": [
        "Leadership", "Communication", "Problem Solving", 
        "Team Collaboration", "Project Management", "Agile", "Scrum"
    ],
    "certifications": [
        "AWS Certified", "Google Cloud Professional",
        "PMP", "Scrum Master", "CISSP", "Oracle Certified"
    ]
}

def extract_skills(text: str) -> List[str]:
    """Extract skills found in the text based on the SKILL_DB."""
    found_skills = set()
    # Normalize text to lowercase and remove punctuation for easier matching
    normalized_text = re.sub(r'[^\w\s]', ' ', text.lower())
    
    for category, skills in SKILL_DB.items():
        for skill in skills:
            # We want whole word match for short skills like Go, C#, to prevent partial matches
            skill_lower = skill.lower()
            if skill_lower == "go" or skill_lower == "c#":
                pattern = r'\b' + re.escape(skill_lower) + r'\b'
                if re.search(pattern, normalized_text):
                    found_skills.add(skill)
            else:
                if skill_lower in normalized_text:
                    found_skills.add(skill)
                    
    return list(found_skills)

def extract_experience_years(text: str) -> float:
    """Extract years of experience from text using Regex patterns."""
    # Pattern 1: "X years of experience", "X+ yrs experience", etc
    match = re.search(r'(\d+(?:\.\d+)?)\+?\s*(?:years|yrs|year)\s*(?:of\s*)?experience', text, re.IGNORECASE)
    if match:
        return float(match.group(1))
        
    # Pattern 2: Attempt to find date ranges and calculate
    dates = re.findall(r'\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\s*-\s*(?:Present|Current|\d{4})\b', text, re.IGNORECASE)
    if dates:
        years = len(dates) * 1.5 # Rough approximation if we just count ranges
        return round(years, 1)
        
    return 0.0

def extract_education(text: str) -> List[str]:
    """Extract education levels from text."""
    education_keywords = [
        'B.Tech', 'B.E.', 'B.Sc', 'B.A.', 'Bachelor', 'Bachelors',
        'M.Tech', 'M.E.', 'M.Sc', 'M.A.', 'Master', 'Masters',
        'PhD', 'Ph.D', 'Doctorate', 'MBA', 'PGDM', 'High School', 'Associate'
    ]
    
    found_degrees = []
    normalized_text = text.lower()
    for keyword in education_keywords:
        if keyword.lower() in normalized_text:
            found_degrees.append(keyword)
            
    return list(set(found_degrees))

def extract_projects(text: str) -> List[str]:
    """Extract projects by splitting text around common headers."""
    # Look for "Projects" section
    match = re.search(r'projects?[:\n](.*?)(?=\n[A-Z][a-z]+[:\n]|$)', text, re.IGNORECASE | re.DOTALL)
    if match:
        projects_text = match.group(1)
        lines = [line.strip() for line in projects_text.split('\n') if line.strip() and len(line.strip()) > 10]
        return lines
    return []

def local_parse_resume(text: str) -> Dict[str, Any]:
    """Parses resume text purely locally without external API."""
    logger.info("Local parsing resume...")
    if not text or not text.strip():
        text = "Fallback resume content."
        
    skills = extract_skills(text)
    experience = extract_experience_years(text)
    education = extract_education(text)
    projects = extract_projects(text)
    
    # We map back into the structure expected by downstream matching engine
    return {
        "name": "Candidate",
        "job_titles": ["Professional"],
        "experience": experience,
        "education": education,
        "skills": skills,
        "tools": [s for s in skills if s in SKILL_DB["devops_tools"] or s in SKILL_DB["databases"]],
        "frameworks": [s for s in skills if s in SKILL_DB["frameworks"]],
        "certifications": [s for s in education if "Certified" in s or s in SKILL_DB["certifications"]],
        "projects": projects
    }

def local_parse_job_description(text: str) -> Dict[str, Any]:
    """Parses JD text purely locally without external API."""
    logger.info("Local parsing job description...")
    if not text or not text.strip():
        text = "Fallback JD content."
        
    skills = extract_skills(text)
    experience = extract_experience_years(text)
    education = extract_education(text)
    
    return {
        "job_title": "Target Role",
        "experience_required": experience,
        "education": education,
        "required_skills": skills,
        "preferred_skills": [],
        "responsibilities": [],
        "frameworks": [s for s in skills if s in SKILL_DB["frameworks"]],
        "languages": [s for s in skills if s in SKILL_DB["programming_languages"]],
        "databases": [s for s in skills if s in SKILL_DB["databases"]],
        "cloud": [s for s in skills if s in SKILL_DB["cloud_platforms"]],
        "tools": [s for s in skills if s in SKILL_DB["devops_tools"]],
        "industry": "",
        "domain": "",
        "soft_skills": [s for s in skills if s in SKILL_DB["soft_skills"]]
    }
