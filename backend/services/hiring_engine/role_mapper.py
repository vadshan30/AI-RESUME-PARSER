class RoleMapper:
    """Maps raw role titles into canonical categories."""
    
    ROLE_CATEGORIES = {
        "Frontend": ["frontend", "front-end", "ui", "user interface", "react developer", "angular developer"],
        "Backend": ["backend", "back-end", "python developer", "java developer", "node developer"],
        "Data Science": ["data scientist", "machine learning", "ml engineer", "ai engineer", "data engineer"],
        "DevOps": ["devops", "sre", "cloud engineer", "aws engineer", "platform engineer"],
        "Cyber Security": ["security", "soc", "penetration tester", "cyber"],
        "Mobile": ["mobile", "ios", "android", "flutter", "react native"],
        "Fullstack": ["full stack", "fullstack", "software engineer", "software developer"]
    }

    @classmethod
    def map_role(cls, role_title: str) -> str:
        if not role_title:
            return "Unknown"
            
        title_lower = role_title.lower()
        for category, keywords in cls.ROLE_CATEGORIES.items():
            if any(keyword in title_lower for keyword in keywords):
                return category
                
        return "Software Engineering" # Default fallback
