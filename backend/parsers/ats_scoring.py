def calculate_ats_score(parsed_data: dict) -> tuple[int, dict]:
    """
    Calculates the ATS Score based on specific distribution rules.
    Returns the total score and the breakdown dictionary.
    """
    breakdown = {
        "email": 0,
        "phone": 0,
        "skills": 0,
        "projects": 0,
        "experience": 0,
        "education": 0,
        "certifications": 0,
        "github": 0,
        "linkedin": 0
    }

    # 1. Email (10 points)
    email = parsed_data.get("email", "")
    if email and email.lower() != "not found":
        breakdown["email"] = 10

    # 2. Phone (10 points)
    phone = parsed_data.get("phone", "")
    if phone and phone.lower() != "not found":
        breakdown["phone"] = 10

    # 3. Skills (20 points max)
    skills = parsed_data.get("skills", [])
    skills_count = len(skills)
    if skills_count == 0:
        breakdown["skills"] = 0
    elif 1 <= skills_count <= 3:
        breakdown["skills"] = 5
    elif 4 <= skills_count <= 6:
        breakdown["skills"] = 10
    elif 7 <= skills_count <= 10:
        breakdown["skills"] = 15
    else:  # > 10
        breakdown["skills"] = 20

    # 4. Projects (15 points max)
    projects = parsed_data.get("projects", [])
    proj_count = len(projects)
    if proj_count == 0:
        breakdown["projects"] = 0
    elif proj_count == 1:
        breakdown["projects"] = 5
    elif proj_count == 2:
        breakdown["projects"] = 10
    else:  # 3+
        breakdown["projects"] = 15

    # 5. Experience (15 points max)
    experience = parsed_data.get("experience", [])
    exp_count = len(experience)
    if exp_count == 0:
        breakdown["experience"] = 0
    elif exp_count == 1:
        breakdown["experience"] = 10  # Internship/Single Experience
    else:  # 2+
        breakdown["experience"] = 15

    # 6. Education (10 points)
    education = parsed_data.get("education", [])
    degree = parsed_data.get("degree", "")
    if len(education) > 0 or degree:
        breakdown["education"] = 10

    # 7. Certifications (10 points max)
    certifications = parsed_data.get("certifications", [])
    cert_count = len(certifications)
    if cert_count == 0:
        breakdown["certifications"] = 0
    elif cert_count == 1:
        breakdown["certifications"] = 5
    else:  # 2+
        breakdown["certifications"] = 10

    # 8. GitHub (5 points)
    github = parsed_data.get("github", "")
    if github:
        breakdown["github"] = 5

    # 9. LinkedIn (5 points)
    linkedin = parsed_data.get("linkedin", "")
    if linkedin:
        breakdown["linkedin"] = 5

    total_score = sum(breakdown.values())
    
    return total_score, breakdown


def get_resume_grade(score: int) -> str:
    """
    Returns the resume grade based on the ATS score.
    """
    if score >= 90:
        return "Excellent Resume"
    elif 75 <= score <= 89:
        return "Strong Resume"
    elif 60 <= score <= 74:
        return "Good Resume"
    else:
        return "Needs Improvement"


def generate_ats_recommendations(parsed_data: dict) -> list[str]:
    """
    Generates actionable ATS recommendations based on missing or insufficient fields.
    """
    recommendations = []

    email = parsed_data.get("email", "")
    if not email or email.lower() == "not found":
        recommendations.append("Add a valid email address.")

    phone = parsed_data.get("phone", "")
    if not phone or phone.lower() == "not found":
        recommendations.append("Add a valid phone number.")

    skills = parsed_data.get("skills", [])
    if len(skills) < 4:
        recommendations.append("Insufficient skills listed. Add at least 4-6 relevant technical skills.")

    projects = parsed_data.get("projects", [])
    if not projects:
        recommendations.append("No projects found. Add relevant academic or personal projects to boost your score.")

    experience = parsed_data.get("experience", [])
    if not experience:
        recommendations.append("No work experience found. Add internships, volunteer work, or relevant professional experience.")

    certifications = parsed_data.get("certifications", [])
    if not certifications:
        recommendations.append("No certifications found. Consider adding relevant industry certifications.")

    github = parsed_data.get("github", "")
    if not github:
        recommendations.append("GitHub profile missing. Include a valid GitHub URL, especially for technical roles.")

    linkedin = parsed_data.get("linkedin", "")
    if not linkedin:
        recommendations.append("LinkedIn profile missing. Include a valid LinkedIn URL for professional networking.")

    return recommendations
