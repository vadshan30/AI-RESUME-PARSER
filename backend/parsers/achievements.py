def extract_achievements(achievements_section_text: str) -> list:
    """
    Extracts achievements from the detected section.
    """
    if not achievements_section_text:
        return []
        
    lines = [line.strip() for line in achievements_section_text.split('\n') if line.strip()]
    return lines
