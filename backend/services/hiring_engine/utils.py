import re
from typing import List

def clean_skill(skill: str) -> str:
    """Normalize a skill for comparison."""
    if not skill:
        return ""
    s = skill.lower().strip()
    # Handle common aliases
    aliases = {
        "react.js": "react",
        "reactjs": "react",
        "node.js": "node",
        "nodejs": "node",
        "vue.js": "vue",
        "vuejs": "vue",
        "html5": "html",
        "css3": "css",
        "restful api": "rest api",
        "c++": "cpp"
    }
    return aliases.get(s, s)

def extract_years_of_experience(text: str) -> int:
    """Fallback regex to extract experience."""
    match = re.search(r'(\d+)\+?\s*(?:years?|yrs?|yr)\s+of\s+(?:experience|work)', text, re.IGNORECASE)
    if match:
        try:
            return int(match.group(1))
        except:
            pass
    
    if 'senior' in text.lower() or 'lead' in text.lower():
        return 5
    if 'mid' in text.lower() or 'intermediate' in text.lower():
        return 3
    if 'junior' in text.lower() or 'entry' in text.lower():
        return 1
    
    return 0

def extract_skills_regex(text: str) -> List[str]:
    """Fallback regex to extract skills using common keywords."""
    common_skills = [
        "python", "java", "javascript", "react", "node", "sql", "aws", "docker", 
        "kubernetes", "c++", "c#", "ruby", "go", "php", "typescript", "html", "css"
    ]
    found = []
    text_lower = text.lower()
    for skill in common_skills:
        # Match word boundaries for short skills to avoid partial matches inside words
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            found.append(skill.title())
    return found
