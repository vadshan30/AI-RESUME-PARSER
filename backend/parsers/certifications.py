def extract_certifications(certifications_section_text: str) -> list:
    """
    Extracts certifications from the detected section.
    """
    if not certifications_section_text:
        return []
        
    lines = [line.strip() for line in certifications_section_text.split('\n') if line.strip()]
    return lines
