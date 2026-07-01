import re

def normalize_text(text: str) -> str:
    """
    Normalizes the extracted text from PDF by:
    - Removing duplicate spaces
    - Normalizing line breaks
    - Cleaning text
    """
    if not text:
        return ""
    
    # Replace non-breaking spaces and similar characters with normal space
    text = re.sub(r'\xa0', ' ', text)
    
    # Normalize carriage returns
    text = text.replace('\r\n', '\n').replace('\r', '\n')
    
    # Remove multiple spaces (but preserve newlines)
    text = re.sub(r'[ \t]+', ' ', text)
    
    # Remove multiple newlines
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    return text.strip()
