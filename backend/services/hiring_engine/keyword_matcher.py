import re
from .models import JobDescriptionData, ResumeData

class KeywordMatcher:
    """Calculates overall ATS keyword coverage."""
    
    @staticmethod
    def match(jd: JobDescriptionData, resume: ResumeData) -> int:
        jd_text = (
            jd.role + " " +
            " ".join(jd.required_skills) + " " +
            " ".join(jd.preferred_skills) + " " +
            " ".join(jd.technologies) + " " +
            " ".join(jd.soft_skills) + " " +
            " ".join(jd.responsibilities)
        )
        
        # Extract unique 4+ letter keywords
        words = re.findall(r'[A-Za-z]{4,}', jd_text.lower())
        important_words = {w for w in words if w not in ['with', 'from', 'that', 'this', 'have', 'will', 'your', 'about', 'they', 'what']}
        
        if not important_words:
            return 100
            
        resume_text = resume.parsed_text.lower()
        
        found = sum(1 for kw in important_words if kw in resume_text)
        
        return min(100, int((found / len(important_words)) * 100))
