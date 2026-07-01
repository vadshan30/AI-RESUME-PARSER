# Internal Job Database mapping categories to their roles and required skills
JOB_DATABASE = [
    # AI/ML
    {"title": "Machine Learning Intern", "category": "AI/ML", "required_skills": ["python", "machine learning", "pandas", "numpy"]},
    {"title": "Machine Learning Engineer", "category": "AI/ML", "required_skills": ["python", "machine learning", "scikit-learn", "sql"]},
    {"title": "AI Engineer", "category": "AI/ML", "required_skills": ["python", "tensorflow", "pytorch", "deep learning"]},
    {"title": "Deep Learning Engineer", "category": "AI/ML", "required_skills": ["python", "tensorflow", "pytorch", "deep learning", "neural network"]},
    {"title": "Computer Vision Engineer", "category": "AI/ML", "required_skills": ["python", "opencv", "deep learning", "computer vision"]},
    {"title": "NLP Engineer", "category": "AI/ML", "required_skills": ["python", "nlp", "llm", "transformer", "pytorch"]},
    {"title": "MLOps Engineer", "category": "AI/ML", "required_skills": ["python", "machine learning", "docker", "kubernetes", "cloud"]},
    {"title": "Data Scientist", "category": "AI/ML", "required_skills": ["python", "sql", "machine learning", "statistics", "pandas"]},

    # Data Science
    {"title": "Data Analyst", "category": "Data Science", "required_skills": ["sql", "python", "pandas", "data analysis", "tableau"]},
    {"title": "Data Scientist", "category": "Data Science", "required_skills": ["python", "sql", "machine learning", "statistics", "pandas"]},
    {"title": "Business Analyst", "category": "Data Science", "required_skills": ["sql", "data analysis", "tableau", "power bi"]},
    {"title": "BI Analyst", "category": "Data Science", "required_skills": ["sql", "tableau", "power bi", "data visualization"]},
    {"title": "Research Analyst", "category": "Data Science", "required_skills": ["python", "statistics", "data analysis", "pandas"]},

    # Web Development
    {"title": "Frontend Developer", "category": "Web Development", "required_skills": ["html", "css", "javascript", "react", "frontend"]},
    {"title": "Backend Developer", "category": "Web Development", "required_skills": ["javascript", "nodejs", "express", "mongodb", "backend", "rest api"]},
    {"title": "Full Stack Developer", "category": "Web Development", "required_skills": ["html", "css", "javascript", "react", "nodejs", "mongodb", "full stack"]},
    {"title": "React Developer", "category": "Web Development", "required_skills": ["html", "css", "javascript", "react"]},
    {"title": "Node.js Developer", "category": "Web Development", "required_skills": ["javascript", "nodejs", "express", "mongodb", "backend"]},

    # App Development
    {"title": "Android Developer", "category": "App Development", "required_skills": ["android", "kotlin", "java"]},
    {"title": "Flutter Developer", "category": "App Development", "required_skills": ["flutter", "dart", "mobile app"]},
    {"title": "Mobile App Developer", "category": "App Development", "required_skills": ["android", "ios", "react native", "flutter"]},
    {"title": "iOS Developer", "category": "App Development", "required_skills": ["ios", "swift"]},

    # Cyber Security
    {"title": "Security Analyst", "category": "Cyber Security", "required_skills": ["network security", "linux", "vulnerability assessment"]},
    {"title": "SOC Analyst", "category": "Cyber Security", "required_skills": ["network security", "wireshark", "linux"]},
    {"title": "Cyber Security Intern", "category": "Cyber Security", "required_skills": ["network security", "linux", "ethical hacking"]},
    {"title": "Penetration Tester", "category": "Cyber Security", "required_skills": ["penetration testing", "ethical hacking", "burp suite", "kali linux", "owasp"]},

    # Cloud Computing
    {"title": "Cloud Engineer", "category": "Cloud Computing", "required_skills": ["aws", "azure", "gcp", "cloud", "linux"]},
    {"title": "AWS Engineer", "category": "Cloud Computing", "required_skills": ["aws", "ec2", "s3", "cloud", "linux"]},
    {"title": "DevOps Engineer", "category": "Cloud Computing", "required_skills": ["aws", "docker", "kubernetes", "terraform", "devops", "linux"]},
    {"title": "Cloud Administrator", "category": "Cloud Computing", "required_skills": ["aws", "azure", "linux", "cloud"]},

    # Software Engineering
    {"title": "Software Engineer", "category": "Software Engineering", "required_skills": ["java", "python", "data structures", "algorithms", "oop", "software engineer"]},
    {"title": "Java Developer", "category": "Software Engineering", "required_skills": ["java", "spring boot", "oop", "sql"]},
    {"title": "Python Developer", "category": "Software Engineering", "required_skills": ["python", "fastapi", "sql", "oop"]},
    {"title": "Backend Engineer", "category": "Software Engineering", "required_skills": ["java", "python", "sql", "data structures", "algorithms", "backend"]}
]

def get_jobs_by_category(category: str) -> list:
    """
    Returns all jobs belonging to the predicted category.
    """
    return [job for job in JOB_DATABASE if job["category"] == category]

def calculate_job_match_score(candidate_skills: list, job_required_skills: list) -> float:
    """
    Calculates the skill match percentage for a specific job.
    """
    if not job_required_skills:
        return 0.0
        
    candidate_skills_lower = {skill.lower().strip() for skill in candidate_skills}
    job_skills_lower = {skill.lower().strip() for skill in job_required_skills}
    
    matched = candidate_skills_lower.intersection(job_skills_lower)
    return (len(matched) / len(job_skills_lower)) * 100

def rank_jobs(jobs_scored: list, experience: list) -> list:
    """
    Ranks jobs based on their score and applies experience-based multipliers.
    """
    has_experience = len(experience) > 0
    
    for job in jobs_scored:
        title_lower = job["title"].lower()
        
        # Experience-Based Ranking Multipliers
        if not has_experience:
            if "intern" in title_lower or "junior" in title_lower:
                job["match_score"] *= 1.15  # Boost by 15%
        else:
            if "engineer" in title_lower or "developer" in title_lower or "analyst" in title_lower or "tester" in title_lower:
                job["match_score"] *= 1.10  # Boost by 10%
                
        # Cap at 100
        if job["match_score"] > 100:
            job["match_score"] = 100
            
    # Sort descending
    jobs_scored.sort(key=lambda x: x["match_score"], reverse=True)
    return jobs_scored

def recommend_jobs(candidate_skills: list, category: str, ats_score: int, experience: list) -> list:
    """
    Generates a list of recommended jobs with final match scores.
    """
    if category == "Unknown":
        return []
        
    jobs = get_jobs_by_category(category)
    jobs_scored = []
    
    for job in jobs:
        skill_match = calculate_job_match_score(candidate_skills, job["required_skills"])
        final_score = (skill_match * 0.8) + (ats_score * 0.2)
        
        jobs_scored.append({
            "title": job["title"],
            "match_score": round(final_score)
        })
        
    ranked_jobs = rank_jobs(jobs_scored, experience)
    
    # Return top 5
    return ranked_jobs[:5]

def generate_career_path(category: str) -> list:
    """
    Generates a logical career path based on the predicted category.
    """
    paths = {
        "AI/ML": ["Machine Learning Intern", "Machine Learning Engineer", "Senior AI Engineer", "AI/ML Lead"],
        "Data Science": ["Data Analyst", "Data Scientist", "Senior Data Scientist", "Head of Data"],
        "Web Development": ["Junior Web Developer", "Full Stack Developer", "Senior Developer", "Engineering Manager"],
        "App Development": ["Junior Mobile Developer", "Mobile App Developer", "Senior iOS/Android Engineer", "Mobile Lead"],
        "Cyber Security": ["Cyber Security Intern", "SOC Analyst", "Security Engineer", "CISO"],
        "Cloud Computing": ["Cloud Support Associate", "Cloud Engineer", "Senior DevOps Engineer", "Cloud Architect"],
        "Software Engineering": ["Software Engineering Intern", "Software Engineer", "Senior Software Engineer", "Software Architect"]
    }
    
    return paths.get(category, [])
