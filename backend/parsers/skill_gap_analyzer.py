# Internal Industry Skill Database
INDUSTRY_SKILLS = {
    "AI/ML": [
        "python", "tensorflow", "pytorch", "numpy", "pandas", 
        "sql", "machine learning", "deep learning", "scikit-learn"
    ],
    "Data Science": [
        "python", "sql", "pandas", "numpy", "tableau", 
        "power bi", "statistics", "data visualization"
    ],
    "Web Development": [
        "html", "css", "javascript", "react", "nodejs", 
        "mongodb", "git", "rest api"
    ],
    "App Development": [
        "flutter", "kotlin", "android", "firebase", "dart"
    ],
    "Cyber Security": [
        "network security", "ethical hacking", "wireshark", 
        "burp suite", "linux", "owasp"
    ],
    "Cloud Computing": [
        "aws", "docker", "kubernetes", "terraform", "linux", "devops"
    ],
    "Software Engineering": [
        "java", "python", "data structures", "algorithms", 
        "oop", "sql", "git"
    ]
}

def get_required_skills(category: str) -> list:
    """
    Returns the required skills for a given category.
    """
    return INDUSTRY_SKILLS.get(category, [])

def find_missing_skills(resume_skills: list, required_skills: list) -> tuple:
    """
    Compares extracted resume skills with category requirements.
    Returns matched skills and missing skills.
    """
    # Normalize skills to lowercase and remove duplicates
    resume_skills_lower = {skill.lower().strip() for skill in resume_skills}
    required_skills_lower = {skill.lower().strip() for skill in required_skills}
    
    matched_skills = list(resume_skills_lower.intersection(required_skills_lower))
    missing_skills = list(required_skills_lower.difference(resume_skills_lower))
    
    return matched_skills, missing_skills

def calculate_skill_match_percentage(matched_skills: list, required_skills: list) -> int:
    """
    Calculates the skill match percentage based on matched and required skills.
    """
    if not required_skills:
        return 0
        
    percentage = (len(matched_skills) / len(required_skills)) * 100
    return round(percentage)

def generate_learning_recommendations(missing_skills: list) -> list:
    """
    Generates dynamic learning recommendations based on missing skills.
    """
    recommendations = []
    
    # Custom mapping for better sentence flow, otherwise default to a generic template
    custom_recs = {
        "tensorflow": "Learn TensorFlow for deep learning projects.",
        "sql": "Learn SQL for database querying.",
        "numpy": "Learn NumPy for numerical computing.",
        "pandas": "Learn Pandas for data manipulation and analysis.",
        "python": "Learn Python, as it is a core language for this role.",
        "react": "Learn React to build modern frontend interfaces.",
        "nodejs": "Learn Node.js for backend JavaScript development.",
        "aws": "Learn AWS to deploy and manage scalable cloud infrastructure."
    }
    
    for skill in missing_skills:
        if skill in custom_recs:
            recommendations.append(custom_recs[skill])
        else:
            # Capitalize the skill nicely if it's not in the custom dictionary
            recommendations.append(f"Learn {skill.title()} to improve your profile for this domain.")
            
    return recommendations
