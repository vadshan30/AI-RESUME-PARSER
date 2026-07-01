import re

EXPERIENCE_KEYWORDS = [
    "intern", "internship", "software developer", "web developer", 
    "data analyst", "machine learning engineer", "experience"
]

def extract_experience(experience_section_text: str, full_text: str) -> list:
    """
    Extracts experience using the detected section first, falling back to full text.
    """
    experience = []
    
    # If we have a dedicated section, we just return non-empty lines or split by bullet points
    if experience_section_text:
        lines = [line.strip() for line in experience_section_text.split('\n') if line.strip()]
        # We can just return the raw lines, but let's try to group them or just return them as a list
        return lines

    # Fallback to keyword search
    text_lower = full_text.lower()
    for item in EXPERIENCE_KEYWORDS:
        if item in text_lower:
            experience.append(item.title())

    return list(set(experience))
