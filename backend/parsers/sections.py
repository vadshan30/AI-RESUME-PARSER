import re

def detect_sections(text: str) -> dict:
    """
    Detects standard resume sections and returns a structured dictionary
    mapping section names to their textual content.
    """
    sections = {
        "education": "",
        "experience": "",
        "projects": "",
        "certifications": "",
        "achievements": "",
        "languages": "",
        "skills": ""
    }
    
    # Define keywords for sections. They are often uppercase or capitalized, 
    # standing alone on a line, or followed by a colon.
    section_patterns = {
        "education": r"^(?:EDUCATION|ACADEMICS|ACADEMIC BACKGROUND|SCHOLASTIC RECORD)[\s:]*$",
        "experience": r"^(?:EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT HISTORY|PROFESSIONAL EXPERIENCE)[\s:]*$",
        "projects": r"^(?:PROJECTS|ACADEMIC PROJECTS|PERSONAL PROJECTS)[\s:]*$",
        "certifications": r"^(?:CERTIFICATIONS|CERTIFICATES|COURSES)[\s:]*$",
        "achievements": r"^(?:ACHIEVEMENTS|AWARDS|HONORS)[\s:]*$",
        "languages": r"^(?:LANGUAGES|KNOWN LANGUAGES)[\s:]*$",
        "skills": r"^(?:SKILLS|TECHNICAL SKILLS|IT SKILLS|CORE COMPETENCIES)[\s:]*$"
    }
    
    lines = text.split('\n')
    current_section = None
    
    for line in lines:
        cleaned_line = line.strip().upper()
        
        # Check if line matches any section header
        found_section = False
        for section_name, pattern in section_patterns.items():
            if re.match(pattern, cleaned_line):
                current_section = section_name
                found_section = True
                break
        
        # If it's a section header, we just move to the next line
        if found_section:
            continue
            
        # Append line to the current active section
        if current_section and line.strip():
            sections[current_section] += line + "\n"
            
    # Clean up trailing newlines
    for k in sections:
        sections[k] = sections[k].strip()
        
    return sections
