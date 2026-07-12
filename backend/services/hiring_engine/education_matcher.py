from .models import JobDescriptionData, ResumeData

class EducationMatcher:
    """Matches candidate education against job requirements."""
    
    @staticmethod
    def _get_education_level(education: str) -> int:
        if not education:
            return 0
        edu_lower = education.lower()
        if 'phd' in edu_lower or 'doctorate' in edu_lower: return 5
        if 'master' in edu_lower or 'ms' in edu_lower: return 4
        if 'bachelor' in edu_lower or 'bs' in edu_lower or 'degree' in edu_lower: return 3
        if 'associate' in edu_lower: return 2
        return 0

    @staticmethod
    def match(jd: JobDescriptionData, resume: ResumeData) -> int:
        jd_level = EducationMatcher._get_education_level(jd.education)
        
        if jd_level <= 0:
            return 100
            
        resume_level = 0
        if resume.education:
            # Check array elements
            for edu in resume.education:
                level = EducationMatcher._get_education_level(edu)
                if level > resume_level:
                    resume_level = level
                    
        # Check raw text just in case parser missed it
        if resume_level == 0 and resume.parsed_text:
            resume_level = EducationMatcher._get_education_level(resume.parsed_text)
            
        if resume_level >= jd_level:
            return 100
        if resume_level == 0:
            return 0
            
        return int((resume_level / jd_level) * 100)
