import re

def extract_linkedin(text: str) -> str:
    """
    Detects LinkedIn profile URL.
    """
    pattern = r'(?:https?://)?(?:www\.)?linkedin\.com/in/[A-Za-z0-9_-]+/?'
    match = re.search(pattern, text, re.IGNORECASE)
    if match:
        return match.group().strip()
    return ""


def extract_github(text: str) -> str:
    """
    Detects GitHub profile URL.
    """
    pattern = r'(?:https?://)?(?:www\.)?github\.com/[A-Za-z0-9_-]+/?'
    match = re.search(pattern, text, re.IGNORECASE)
    if match:
        return match.group().strip()
    return ""


def extract_portfolio(text: str) -> str:
    """
    Detects generic personal portfolio websites, excluding LinkedIn and GitHub.
    """
    # Regex to match URLs
    url_pattern = r'https?://[www\.]?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:/[a-zA-Z0-9#_.-]*)*'
    matches = re.findall(url_pattern, text, re.IGNORECASE)
    
    for url in matches:
        lower_url = url.lower()
        if 'linkedin.com' not in lower_url and 'github.com' not in lower_url:
            return url.strip()
    
    # Try finding naked domains without http (more risky but common in resumes)
    naked_pattern = r'(?<!@)[a-zA-Z0-9-]+\.(?:com|io|net|dev|me)(?:/[a-zA-Z0-9#_.-]*)*'
    matches_naked = re.findall(naked_pattern, text, re.IGNORECASE)
    for url in matches_naked:
        lower_url = url.lower()
        # exclude common email domains or non-portfolio sites
        if 'linkedin.com' not in lower_url and 'github.com' not in lower_url and 'gmail' not in lower_url and 'yahoo' not in lower_url:
            return url.strip()
            
    return ""
