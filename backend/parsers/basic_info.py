import re
import spacy

nlp = spacy.load("en_core_web_sm")

def extract_name(text: str) -> str:
    """
    Extracts name from text using NLP.
    Usually name is at the very beginning of the resume.
    """
    # First, let's try just taking the first line if it looks like a name
    lines = text.strip().split('\n')
    for line in lines[:3]:
        # If line is short and has no numbers/special characters, it might be a name
        clean_line = line.strip()
        if 2 <= len(clean_line.split()) <= 4 and re.match(r'^[A-Za-z\s]+$', clean_line):
            return clean_line.title()

    # Fallback to spacy
    doc = nlp(text)
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            return ent.text.title()

    return "Not Found"


def extract_email(text: str) -> str:
    """
    Extracts email address using regex.
    """
    email_pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
    match = re.search(email_pattern, text)
    if match:
        return match.group()
    return "Not Found"


def extract_phone(text: str) -> str:
    """
    Extracts phone number using regex.
    """
    phone_pattern = r"(\+?\d[\d\s\-]{8,15}\d)"
    match = re.search(phone_pattern, text)
    if match:
        return match.group()
    return "Not Found"
