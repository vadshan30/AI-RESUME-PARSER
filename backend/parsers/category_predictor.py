import re

# Predefined domain dictionaries
CATEGORY_KEYWORDS = {
    "AI/ML": [
        "machine learning", "deep learning", "tensorflow", "keras", 
        "pytorch", "nlp", "llm", "transformer", "computer vision", 
        "neural network", "opencv", "scikit-learn"
    ],
    "Data Science": [
        "pandas", "numpy", "statistics", "tableau", "power bi", 
        "sql", "data analysis", "data visualization", "matplotlib", "seaborn"
    ],
    "Web Development": [
        "html", "css", "javascript", "react", "nextjs", "angular", 
        "vue", "nodejs", "express", "mongodb", "frontend", "backend", "full stack"
    ],
    "App Development": [
        "android", "kotlin", "flutter", "react native", "swift", 
        "ios", "mobile app", "firebase"
    ],
    "Cyber Security": [
        "penetration testing", "ethical hacking", "kali linux", 
        "burp suite", "wireshark", "vulnerability assessment", "owasp", "network security"
    ],
    "Cloud Computing": [
        "aws", "azure", "gcp", "docker", "kubernetes", "terraform", 
        "cloud", "devops", "ec2", "s3"
    ],
    "Software Engineering": [
        "java", "python", "c++", "spring boot", "fastapi", 
        "algorithms", "data structures", "oop", "software engineer"
    ]
}

def calculate_category_scores(text: str) -> dict:
    """
    Calculates the score for every category based on keyword occurrences.
    """
    scores = {category: 0 for category in CATEGORY_KEYWORDS.keys()}
    text_lower = text.lower()
    
    for category, keywords in CATEGORY_KEYWORDS.items():
        for keyword in keywords:
            # Use word boundaries to avoid partial word matches
            # e.g., matching "java" inside "javascript"
            pattern = r'\b' + re.escape(keyword) + r'\b'
            matches = re.findall(pattern, text_lower)
            scores[category] += len(matches)
            
    return scores

def predict_resume_category(category_scores: dict) -> str:
    """
    Chooses the category with the highest score.
    Returns 'Unknown' if all scores are 0.
    """
    max_score = max(category_scores.values())
    if max_score == 0:
        return "Unknown"
        
    # Find the category with the max score.
    # If there's a tie, this returns the first one encountered in dictionary order.
    for category, score in category_scores.items():
        if score == max_score:
            return category

def calculate_confidence(category_scores: dict, category: str) -> int:
    """
    Generates a confidence percentage based on the dominance of the winning category.
    Formula: (winning_score / total_matches) * 100
    """
    if category == "Unknown":
        return 0
        
    total_matches = sum(category_scores.values())
    winning_score = category_scores.get(category, 0)
    
    if total_matches == 0:
        return 0
        
    confidence = (winning_score / total_matches) * 100
    return round(confidence)

def generate_category_recommendations(category: str) -> list:
    """
    Generates category-specific improvement suggestions.
    """
    if category == "Unknown":
        return ["Add industry-specific keywords (e.g., 'React', 'Machine Learning', 'AWS') to clarify your career domain."]
        
    recommendations = {
        "AI/ML": "Consider adding specific projects demonstrating model deployment, MLOps, or advanced transformer fine-tuning.",
        "Data Science": "Ensure you highlight data storytelling, A/B testing, and specific metrics (e.g., 'improved efficiency by 20%').",
        "Web Development": "Include links to live web applications or your GitHub repositories showing full-stack capabilities.",
        "App Development": "Provide links to the App Store or Google Play Store if your apps are published.",
        "Cyber Security": "Highlight any Bug Bounty achievements, CVEs discovered, or specific security clearances/certifications (like OSCP).",
        "Cloud Computing": "Detail specific cloud architecture implementations, CI/CD pipelines, or infrastructure-as-code deployments.",
        "Software Engineering": "Emphasize system design, scalability challenges you've solved, and testing methodologies (e.g., TDD)."
    }
    
    return [recommendations.get(category, "Review industry best practices for your role and add relevant keywords.")]
