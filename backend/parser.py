import spacy
import pdfplumber
import re

nlp = spacy.load("en_core_web_sm")


# -------------------------------
# PDF TEXT EXTRACTION
# -------------------------------
def extract_text_from_pdf(pdf_path):
    text = ""

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()

            if page_text:
                text += page_text + "\n"

    return text


# -------------------------------
# NAME EXTRACTION
# -------------------------------
def extract_name(text):
    doc = nlp(text)

    for ent in doc.ents:
        if ent.label_ == "PERSON":
            return ent.text

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
    "python",
    "java",
    "c",
    "c++",
    "javascript",
    "html",
    "css",
    "sql",
    "mysql",
    "machine learning",
    "deep learning",
    "data science",
    "artificial intelligence",
    "fastapi",
    "django",
    "flask",
    "react",
    "nodejs",
    "git",
    "github",
    "aws",
    "azure",
    "excel",
    "power bi"
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
    "b.e",
    "b.tech",
    "bachelor",
    "m.e",
    "m.tech",
    "master",
    "phd",
    "artificial intelligence and data science",
    "computer science",
    "information technology"
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
def calculate_resume_score(
    skills,
    education,
    projects,
    experience
):
    score = 0

    score += len(skills) * 4
    score += len(education) * 10
    score += len(projects) * 10
    score += len(experience) * 15

    if score > 100:
        score = 100

    return score
PROJECT_KEYWORDS = [
    "project",
    "resume parser",
    "chatbot",
    "portfolio",
    "attendance system",
    "management system",
    "e-commerce",
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
    "intern",
    "internship",
    "software developer",
    "web developer",
    "data analyst",
    "machine learning engineer",
    "experience"
]

def extract_experience(text):

    text = text.lower()

    experience = []

    for item in EXPERIENCE_KEYWORDS:
        if item in text:
            experience.append(item)

    return list(set(experience))
def generate_recommendations(
    email,
    phone,
    skills,
    education,
    projects,
    experience
):

    recommendations = []

    if phone == "Not Found":
        recommendations.append(
            "Add a phone number"
        )

    if len(skills) < 5:
        recommendations.append(
            "Add more technical skills"
        )

    if len(projects) == 0:
        recommendations.append(
            "Add projects section"
        )

    if len(experience) == 0:
        recommendations.append(
            "Add internship or experience details"
        )

    if len(education) == 0:
        recommendations.append(
            "Add education details"
        )

    return recommendations
