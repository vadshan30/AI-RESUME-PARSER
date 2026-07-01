def extract_languages(languages_section_text: str) -> list:
    """
    Extracts languages from the detected section.
    """
    if not languages_section_text:
        return []
        
    # Languages section is usually comma separated or one per line
    # Let's handle both
    lines = [line.strip() for line in languages_section_text.split('\n') if line.strip()]
    
    languages = []
    for line in lines:
        parts = [p.strip() for p in line.replace(';', ',').split(',')]
        languages.extend([p for p in parts if p])
        
    return languages
