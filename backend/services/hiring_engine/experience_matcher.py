from .models import JobDescriptionData, ResumeData

class ExperienceMatcher:
    """Matches candidate years of experience against job requirements."""
    
    @staticmethod
    def match(jd: JobDescriptionData, resume: ResumeData) -> int:
        req_exp = jd.experience
        can_exp = resume.experience_years
        
        if req_exp <= 0:
            return 100
        if can_exp <= 0:
            return 0
            
        if can_exp >= req_exp:
            return 100
            
        return int((can_exp / req_exp) * 100)
