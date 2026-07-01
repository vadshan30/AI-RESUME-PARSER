import re

# Existing generic extraction
EDUCATION_KEYWORDS = [
    "b.e", "b.tech", "bachelor", "m.e", "m.tech", "master", "phd", 
    "artificial intelligence and data science", "computer science", 
    "information technology"
]

def extract_education(text: str) -> list:
    """
    Fallback generic extraction returning a list of keywords found.
    """
    text_lower = text.lower()
    education = []
    for item in EDUCATION_KEYWORDS:
        if item in text_lower:
            education.append(item.title())
    return list(set(education))


def extract_education_intelligence(education_section_text: str, full_text: str) -> dict:
    """
    Extracts structured education information:
    College Name, Degree, CGPA, Graduation Year
    
    Takes education_section_text if available, otherwise falls back to full_text.
    """
    text_to_search = education_section_text if education_section_text else full_text
    
    result = {
        "college": "",
        "degree": "",
        "cgpa": "",
        "graduation_year": ""
    }
    
    if not text_to_search:
        return result

    # 1. Degree Extraction
    degree_patterns = [
        r"(B\.?Tech|Bachelor of Technology)",
        r"(B\.?E\.?|Bachelor of Engineering)",
        r"(M\.?Tech|Master of Technology)",
        r"(B\.?S\.?C|Bachelor of Science)",
        r"(M\.?S\.?C|Master of Science)",
        r"(Ph\.?D\.?)",
        r"(B\.?A\.?|Bachelor of Arts)"
    ]
    for pattern in degree_patterns:
        match = re.search(pattern, text_to_search, re.IGNORECASE)
        if match:
            result["degree"] = match.group(1).title()
            break

    # 2. CGPA Extraction
    cgpa_pattern = r"(?:CGPA|GPA|Percentage)[\s:]*([0-9]{1,2}(?:\.[0-9]{1,2})?(?:%|\b))"
    cgpa_match = re.search(cgpa_pattern, text_to_search, re.IGNORECASE)
    if cgpa_match:
        result["cgpa"] = cgpa_match.group(1)
    else:
        # Fallback: look for typical CGPA format (e.g. 8.5/10, 8.5)
        # We need to be careful to not grab random numbers
        cgpa_fallback = r"\b([1-9]\.[0-9]{1,2})\s*(?:/|out of)\s*10\b"
        cgpa_match_fb = re.search(cgpa_fallback, text_to_search)
        if cgpa_match_fb:
            result["cgpa"] = cgpa_match_fb.group(1)

    # 3. Graduation Year Extraction
    # Look for patterns like 2020-2024, or standalone years in the future (e.g., 2025)
    year_pattern = r"(?:20\d{2})\s*(?:-|to|–)\s*(20\d{2})|Graduat(?:ion|ed)?:?\s*(20\d{2})"
    year_match = re.search(year_pattern, text_to_search, re.IGNORECASE)
    if year_match:
        result["graduation_year"] = year_match.group(1) or year_match.group(2)
    else:
        # Fallback to finding typical college years (2020 to 2030)
        years = re.findall(r"\b(20[1-3][0-9])\b", text_to_search)
        if years:
            result["graduation_year"] = max(years) # Assume latest year is graduation year

    # 4. College Name Extraction
    # Usually contains keywords like "University", "College", "Institute", "Academy"
    lines = text_to_search.split('\n')
    for line in lines:
        if any(kw in line.lower() for kw in ["university", "college", "institute", "academy"]):
            # Clean up the line a bit
            college_name = re.sub(r'[^a-zA-Z\s,-]', '', line).strip()
            if len(college_name) > 5:
                result["college"] = college_name
                break

    return result
