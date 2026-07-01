import re


def extract_name(text: str) -> str:
    lines = text.strip().split('\n')

    for line in lines[:5]:
        clean_line = line.strip()

        if (
            2 <= len(clean_line.split()) <= 4
            and re.match(r'^[A-Za-z\s]+$', clean_line)
        ):
            return clean_line.title()

    return "Not Found"


def extract_email(text: str) -> str:
    pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
    match = re.search(pattern, text)
    return match.group() if match else "Not Found"


def extract_phone(text: str) -> str:
    pattern = r"(\+?\d[\d\s\-]{8,15}\d)"
    match = re.search(pattern, text)
    return match.group() if match else "Not Found"