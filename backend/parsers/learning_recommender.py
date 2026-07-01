# Course Database for missing skills mapping
COURSE_DATABASE = {
    "tensorflow": {"course": "TensorFlow for Beginners", "level": "Intermediate"},
    "pytorch": {"course": "PyTorch Deep Learning Fundamentals", "level": "Intermediate"},
    "sql": {"course": "SQL for Data Analysis", "level": "Beginner"},
    "numpy": {"course": "NumPy Essentials", "level": "Beginner"},
    "pandas": {"course": "Pandas Data Analysis Masterclass", "level": "Beginner"},
    "react": {"course": "React Complete Developer Guide", "level": "Intermediate"},
    "docker": {"course": "Docker and Containerization", "level": "Intermediate"},
    "aws": {"course": "AWS Cloud Practitioner", "level": "Intermediate"},
    "python": {"course": "Complete Python Bootcamp", "level": "Beginner"},
    "machine learning": {"course": "Machine Learning A-Z", "level": "Beginner"},
    "html": {"course": "HTML & CSS Crash Course", "level": "Beginner"},
    "css": {"course": "Advanced CSS and Sass", "level": "Intermediate"},
    "javascript": {"course": "The Complete JavaScript Course", "level": "Beginner"},
    "nodejs": {"course": "NodeJS - The Complete Guide", "level": "Intermediate"},
    "mongodb": {"course": "MongoDB - The Complete Developer's Guide", "level": "Intermediate"},
    "java": {"course": "Java Programming Masterclass", "level": "Beginner"},
    "algorithms": {"course": "Data Structures and Algorithms", "level": "Intermediate"},
    "data structures": {"course": "Mastering Data Structures", "level": "Intermediate"},
    "oop": {"course": "Object Oriented Programming in Practice", "level": "Intermediate"},
    "linux": {"course": "Linux Mastery", "level": "Beginner"}
}

# Learning paths per category
LEARNING_PATHS = {
    "AI/ML": [
        "Python Fundamentals", "NumPy", "Pandas", "Machine Learning", 
        "TensorFlow", "Deep Learning", "MLOps"
    ],
    "Data Science": [
        "Python Fundamentals", "SQL", "Pandas & NumPy", "Data Visualization (Tableau/PowerBI)", 
        "Statistics", "Machine Learning"
    ],
    "Web Development": [
        "HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB", "Full Stack Development"
    ],
    "App Development": [
        "UI/UX Principles", "Dart/Kotlin/Swift", "Flutter/Android Studio", 
        "State Management", "Firebase Integration", "App Deployment"
    ],
    "Cyber Security": [
        "Networking Fundamentals", "Linux Basics", "Wireshark & Traffic Analysis", 
        "Ethical Hacking", "Penetration Testing", "Security Operations"
    ],
    "Cloud Computing": [
        "Networking & Linux Basics", "Cloud Concepts", "AWS/Azure Fundamentals", 
        "Docker & Containers", "Kubernetes", "Terraform & IaC"
    ],
    "Software Engineering": [
        "Programming Language (Java/Python)", "Object Oriented Programming", 
        "Data Structures", "Algorithms", "System Design", "Version Control (Git)"
    ]
}

# Certification recommendations per category
CERTIFICATIONS = {
    "AI/ML": [
        "TensorFlow Developer Certificate",
        "AWS Machine Learning Specialty"
    ],
    "Data Science": [
        "Google Data Analytics Professional Certificate",
        "IBM Data Science Professional Certificate",
        "Microsoft Certified: Data Analyst Associate"
    ],
    "Web Development": [
        "Meta Front-End Developer Professional Certificate",
        "AWS Certified Developer - Associate"
    ],
    "App Development": [
        "Google Associate Android Developer",
        "Meta iOS Developer Professional Certificate"
    ],
    "Cyber Security": [
        "CompTIA Security+",
        "Certified Ethical Hacker (CEH)",
        "CISSP"
    ],
    "Cloud Computing": [
        "AWS Certified Cloud Practitioner",
        "AWS Certified Solutions Architect",
        "Microsoft Certified: Azure Fundamentals"
    ],
    "Software Engineering": [
        "Oracle Certified Professional: Java SE Programmer",
        "AWS Certified Developer - Associate"
    ]
}

def generate_learning_recommendations(missing_skills: list) -> list:
    """
    Suggests learning resources and courses based on detected missing skills.
    """
    recommendations = []
    
    for skill in missing_skills:
        skill_lower = skill.lower().strip()
        course_data = COURSE_DATABASE.get(skill_lower)
        
        if course_data:
            recommendations.append({
                "skill": skill_lower,
                "course": course_data["course"],
                "level": course_data["level"]
            })
        else:
            # Fallback for unknown skills
            recommendations.append({
                "skill": skill_lower,
                "course": f"{skill.title()} Masterclass",
                "level": "Beginner"
            })
            
    return recommendations

def build_learning_path(category: str) -> list:
    """
    Returns the ideal learning path for the predicted category.
    """
    return LEARNING_PATHS.get(category, [])

def recommend_certifications(category: str) -> list:
    """
    Returns highly recommended certifications for the category.
    """
    return CERTIFICATIONS.get(category, [])
