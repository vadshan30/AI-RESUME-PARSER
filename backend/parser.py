import re
import os
import math
from collections import Counter
from backend.parsers.pdf_extractor import extract_text_from_file

# -------------------------------
# PDF TEXT EXTRACTION
# -------------------------------

def extract_text_from_pdf(pdf_path):
    return extract_text_from_file(pdf_path)


# -------------------------------
# HIGH-LEVEL RESUME ANALYSIS PIPELINE
# -------------------------------
def _safe_lower_words(text: str):
    return [w.strip('.,:;()[]') for w in re.split(r"\s+", (text or '').lower()) if w.strip()]


def validate_resume_text(text: str):
    if not text or len(text.strip()) == 0:
        return False, "No text extracted from the file"
    if len(text.strip()) < 80:
        return False, "Insufficient readable text in resume"
    low = text.lower()
    if 'lorem ipsum' in low or 'sample text' in low or 'placeholder' in low:
        return False, "Detected placeholder/sample text"
    return True, "OK"


SECTION_KEYWORDS = {
    'summary': ['summary', 'professional summary', 'profile', 'about me'],
    'skills': ['skills', 'technical skills', 'skills & abilities'],
    'experience': ['experience', 'work experience', 'employment'],
    'education': ['education', 'academic', 'qualifications'],
    'projects': ['projects', 'personal projects', 'selected projects'],
    'certifications': ['certifications', 'licenses'],
    'achievements': ['achievements', 'awards', 'honors', 'publications']
}


def detect_sections(text: str) -> dict:
    lower = text.lower()
    found = {}
    for sec, keys in SECTION_KEYWORDS.items():
        for k in keys:
            if k in lower:
                found[sec] = True
                break
        if sec not in found:
            found[sec] = False
    return found


def completeness_score(sections: dict):
    total = len(sections)
    present = sum(1 for v in sections.values() if v)
    missing = [k.title() for k, v in sections.items() if not v]
    score = int((present / total) * 100)
    return score, missing


def keyword_density(text: str, keywords: list) -> int:
    if not text:
        return 0
    words = _safe_lower_words(text)
    if not words:
        return 0
    count = 0
    for kw in keywords:
        count += sum(1 for w in words if kw in w)
    density = int((count / max(1, len(words))) * 1000)
    return min(100, density // 10)


def ats_readiness_score(text: str, sections: dict):
    issues = []
    score = 70
    if sections.get('skills'): score += 10
    if sections.get('experience'): score += 10
    if sections.get('education'): score += 5

    if not extract_email(text) or extract_email(text) == 'Not Found':
        issues.append('Missing email address')
        score -= 15
    if not extract_phone(text) or extract_phone(text) == 'Not Found':
        issues.append('Missing phone number')
        score -= 10

    lines = [l for l in text.splitlines() if l.strip()]
    if len(lines) < 10:
        issues.append('Very short resume — may be missing content')
        score -= 10

    score = max(0, min(100, score))
    return score, issues


def extract_skill_list(text: str, skills_db: list = None) -> list:
    if skills_db is None:
        skills_db = SKILLS_DB
    lower = text.lower()
    found = []
    for s in skills_db:
        if s in lower:
            found.append(s.title())
    counts = Counter(re.findall(r"\b[\w\+#\-\.]+\b", lower))
    found_sorted = sorted(set(found), key=lambda x: -sum(counts[w] for w in re.findall(r"\\w+", x.lower())))
    return found_sorted


def analyze_experience(text: str) -> dict:
    years = 0
    companies = 0
    lower = text.lower()
    m = re.search(r'(\d+)\+?\s*(?:years?|yrs?)', lower)
    if m:
        try:
            years = int(m.group(1))
        except:
            years = 0
    else:
        if any(k in lower for k in ['senior', 'lead', 'principal']):
            years = max(years, 7)
        elif any(k in lower for k in ['junior', 'entry', 'fresher']):
            years = max(years, 1)
    companies = len(re.findall(r'\bat\b|\bfor\b|\bworked at\b', lower))
    companies = companies if companies > 0 else len(re.findall(r'\n\s*[^\n]+\s*\n', text)) // 6
    return {
        'years_of_experience': years,
        'company_count': companies
    }


def analyze_education(text: str) -> dict:
    edu = extract_education(text)
    highest = None
    if edu:
        highest = edu[0]
    return {
        'education_items': edu,
        'highest_degree': highest
    }


def analyze_projects(text: str) -> dict:
    projects = extract_projects(text)
    return {
        'projects': projects,
        'project_count': len(projects)
    }


def analyze_achievements(text: str) -> dict:
    lower = text.lower()
    found = []
    for kw in ['award', 'awarded', 'publication', 'published', 'honor', 'hackathon', 'winner', 'open source']:
        if kw in lower:
            found.append(kw)
    return {
        'achievements_found': list(set(found)),
        'achievement_score': min(100, len(found) * 20)
    }


def writing_quality(text: str) -> dict:
    sentences = re.split(r'[.!?]\s+', text)
    long_sentences = [s for s in sentences if len(s.split()) > 30]
    passive_matches = re.findall(r'\b(is|was|were|be|been|being)\b\s+\w+ed\b', text.lower())
    spelling_issues = 0
    score = 90 - (len(long_sentences) * 5) - (len(passive_matches) * 5) - spelling_issues
    score = max(0, min(100, int(score)))
    return {
        'writing_score': score,
        'long_sentences': len(long_sentences),
        'passive_voice_count': len(passive_matches),
        'spelling_issues': spelling_issues
    }


def formatting_analysis(text: str) -> dict:
    issues = []
    lines = [l for l in text.splitlines() if l.strip()]
    avg_line_len = int(sum(len(l) for l in lines) / max(1, len(lines)))
    if avg_line_len > 120:
        issues.append('Long lines suggest poor line breaks or lack of bullet lists')
    if any(len(l) > 200 for l in lines):
        issues.append('Extremely long lines detected')
    short_lines = sum(1 for l in lines if len(l) < 20)
    if short_lines > len(lines) * 0.4:
        issues.append('Many short lines found — possible multi-column layout or contact block')
    return {
        'avg_line_length': avg_line_len,
        'short_line_count': short_lines,
        'formatting_issues': issues
    }


def health_and_recommendations(components: dict) -> dict:
    w = {
        'completeness': 0.25,
        'ats': 0.25,
        'skills': 0.15,
        'experience': 0.15,
        'writing': 0.1,
        'design': 0.1
    }
    completeness = components.get('completeness_score', 0)
    ats = components.get('ats_compatibility', 0)
    skills = min(100, len(components.get('skills', [])) * 8)
    experience = min(100, components.get('experience_analysis', {}).get('years_of_experience', 0) * 10)
    writing = components.get('writing_quality', {}).get('writing_score', 0)
    design = 100 - len(components.get('formatting_analysis', {}).get('formatting_issues', [])) * 10

    health = int((completeness * w['completeness'] + ats * w['ats'] + skills * w['skills'] + experience * w['experience'] + writing * w['writing'] + design * w['design']))

    recs = []
    if components.get('experience_analysis', {}).get('years_of_experience', 0) < 2:
        recs.append('Highlight internships, freelance, or project work to demonstrate experience')
    if len(components.get('skills', [])) < 5:
        recs.append('Add more technical skills and tools with versions (e.g., Python 3.x, React 18)')
    if components.get('writing_quality', {}).get('writing_score', 0) < 75:
        recs.append('Improve sentence clarity and reduce passive voice')
    if components.get('ats_compatibility', 0) < 60:
        recs.append('Use standard section headings and avoid images or tables')

    return {
        'health_score': max(0, min(100, health)),
        'recommendations': recs
    }


def analyze_resume(file_path: str = None, text: str = None) -> dict:
    raw_text = text
    if not raw_text and file_path and os.path.exists(file_path):
        try:
            raw_text = extract_text_from_pdf(file_path)
        except Exception:
            raw_text = None

    valid, reason = validate_resume_text(raw_text)
    if not valid:
        return {
            'success': True,
            'status': 'invalid',
            'reason': reason,
            'health_score': 0,
            'ats_compatibility': 0,
            'keyword_density': 0,
            'completeness_score': 0,
            'section_grades': {},
            'missing_sections': [],
            'formatting_issues': [reason],
            'content_issues': [reason],
            'improvement_suggestions': ["Upload a text-based PDF or DOCX file containing actual resume content."]
        }

    sections = detect_sections(raw_text)
    completeness, missing = completeness_score(sections)
    ats, ats_issues = ats_readiness_score(raw_text, sections)
    keywords = extract_skill_list(raw_text)
    exp = analyze_experience(raw_text)
    edu = analyze_education(raw_text)
    proj = analyze_projects(raw_text)
    ach = analyze_achievements(raw_text)
    writing = writing_quality(raw_text)
    formatting = formatting_analysis(raw_text)

    components = {
        'completeness_score': completeness,
        'ats_compatibility': ats,
        'skills': keywords,
        'experience_analysis': exp,
        'education_analysis': edu,
        'projects_analysis': proj,
        'achievements': ach,
        'writing_quality': writing,
        'formatting_analysis': formatting
    }

    health = health_and_recommendations(components)

    section_grades = {}
    for k, present in sections.items():
        if present:
            section_grades[k] = 'Excellent' if k in ['skills', 'experience'] else 'Strong'
        else:
            section_grades[k] = 'Missing'

    report = {
        'success': True,
        'status': 'ok',
        'completeness_score': completeness,
        'missing_sections': missing,
        'ats_compatibility': ats,
        'ats_issues': ats_issues,
        'keyword_density': keyword_density(raw_text, keywords[:20]),
        'skills': keywords,
        'experience_analysis': exp,
        'education_analysis': edu,
        'projects_analysis': proj,
        'achievements': ach,
        'writing_quality': writing,
        'formatting_analysis': formatting,
        'formatting_issues': formatting.get('formatting_issues', []),
        'content_issues': [
            f"Writing score: {writing.get('writing_score')}",
            *([f"ATS issue: {i}" for i in ats_issues] if ats_issues else [])
        ],
        'section_grades': section_grades,
        'improvement_suggestions': health.get('recommendations', []),
        'health_score': health.get('health_score', 0)
    }

    return report


# -------------------------------
# NAME EXTRACTION (without spacy)
# -------------------------------
def extract_name(text):
    """Extract name using regex pattern (first 2-3 capitalized words from top)"""
    lines = text.split('\n')
    for line in lines[:5]:  # Check first 5 lines
        line = line.strip()
        if line and not any(kw in line.lower() for kw in ['email', 'phone', 'contact', 'resume']):
            words = line.split()
            if len(words) >= 2 and all(w[0].isupper() for w in words[:2] if w):
                return ' '.join(words[:3])
    return "Not Found"


# -------------------------------
# EMAIL EXTRACTION
# -------------------------------
def extract_email(text):
    email_pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
    match = re.search(email_pattern, text)
    if match:
        return match.group()
    return "Not Found"


# -------------------------------
# PHONE EXTRACTION
# -------------------------------
def extract_phone(text):
    phone_pattern = r"(\+?\d[\d\s\-]{8,15}\d)"
    match = re.search(phone_pattern, text)
    if match:
        return match.group()
    return "Not Found"


# -------------------------------
# SKILLS EXTRACTION
# -------------------------------
SKILLS_DB = [
    "python", "java", "c", "c++", "javascript", "html", "css",
    "sql", "mysql", "machine learning", "deep learning", "data science",
    "artificial intelligence", "fastapi", "django", "flask",
    "react", "nodejs", "git", "github", "aws", "azure",
    "excel", "power bi"
]


def extract_skills(text):
    text = text.lower()
    found_skills = []
    for skill in SKILLS_DB:
        if skill in text:
            found_skills.append(skill)
    return list(set(found_skills))


# -------------------------------
# EDUCATION EXTRACTION
# -------------------------------
EDUCATION_KEYWORDS = [
    "b.e", "b.tech", "bachelor", "m.e", "m.tech", "master",
    "phd", "artificial intelligence and data science",
    "computer science", "information technology"
]


def extract_education(text):
    text = text.lower()
    education = []
    for item in EDUCATION_KEYWORDS:
        if item in text:
            education.append(item)
    return list(set(education))


# -------------------------------
# RESUME SCORE
# -------------------------------
def calculate_resume_score(skills, education, projects, experience):
    score = 0
    score += len(skills) * 4
    score += len(education) * 10
    score += len(projects) * 10
    score += len(experience) * 15
    if score > 100:
        score = 100
    return score


PROJECT_KEYWORDS = [
    "project", "resume parser", "chatbot", "portfolio",
    "attendance system", "management system", "e-commerce",
    "web application"
]


def extract_projects(text):
    text = text.lower()
    projects = []
    for project in PROJECT_KEYWORDS:
        if project in text:
            projects.append(project)
    return list(set(projects))


EXPERIENCE_KEYWORDS = [
    "intern", "internship", "software developer", "web developer",
    "data analyst", "machine learning engineer", "experience"
]


def extract_experience(text):
    text = text.lower()
    experience = []
    for item in EXPERIENCE_KEYWORDS:
        if item in text:
            experience.append(item)
    return list(set(experience))


def generate_recommendations(email, phone, skills, education, projects, experience):
    recommendations = []
    if phone == "Not Found":
        recommendations.append("Add a phone number")
    if len(skills) < 5:
        recommendations.append("Add more technical skills")
    if len(projects) == 0:
        recommendations.append("Add projects section")
    if len(experience) == 0:
        recommendations.append("Add internship or experience details")
    if len(education) == 0:
        recommendations.append("Add education details")
    return recommendations