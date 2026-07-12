import re
from .models import JobDescriptionData, ResumeData

class ResponsibilityMatcher:
    """Matches JD responsibilities against Resume achievements using NLP keywords (Fallback to Embeddings)."""
    
    @staticmethod
    def match(jd: JobDescriptionData, resume: ResumeData) -> int:
        if not jd.responsibilities:
            return 100
            
        jd_text = " ".join(jd.responsibilities).lower()
        resume_text = " ".join(resume.experience + resume.projects).lower() + " " + resume.parsed_text.lower()
        
        # Extract meaningful keywords from JD responsibilities (noun/action clusters)
        # We will strip stop words
        stop_words = {'with', 'from', 'that', 'this', 'have', 'will', 'your', 'about', 'they', 'what', 'their', 'which', 'when', 'where', 'who'}
        
        job_words = set(re.findall(r'[A-Za-z]{4,}', jd_text)) - stop_words
        
        if not job_words:
            return 100
            
        # Semantic proxy: counting unique word overlaps
        resume_words = set(re.findall(r'[A-Za-z]{4,}', resume_text))
        
        matched_words = job_words & resume_words
        
        score = (len(matched_words) / len(job_words)) * 100
        return min(100, int(score))
