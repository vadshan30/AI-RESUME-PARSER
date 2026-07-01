import re

PROJECT_KEYWORDS = [
    "project", "resume parser", "chatbot", "portfolio", 
    "attendance system", "management system", "e-commerce", "web application"
]

def extract_projects(projects_section_text: str, full_text: str) -> list:
    """
    Extracts projects using the detected section first, falling back to full text.
    """
    projects = []
    
    if projects_section_text:
        lines = [line.strip() for line in projects_section_text.split('\n') if line.strip()]
        return lines

    # Fallback to keyword search
    text_lower = full_text.lower()
    for project in PROJECT_KEYWORDS:
        if project in text_lower:
            projects.append(project.title())

    return list(set(projects))
