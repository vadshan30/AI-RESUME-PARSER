import os
from backend.services.gemini_service import gemini_service
from .base_provider import LLMProvider

class GeminiProvider(LLMProvider):
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "")

    def generate_text(self, prompt: str) -> str:
        if not self.api_key:
            # For demonstration, return a mocked highly intelligent response if key is missing
            return self._get_mock_response(prompt)
            
        # Use our robust, centrally-managed SDK service instead of raw HTTP requests
        response = gemini_service.generate_content(prompt)
        
        if response:
            return response
        else:
            return "Error from Gemini SDK: Failed to generate content."
            
    def _get_mock_response(self, prompt: str) -> str:
        """Fallback mock responses for testing without API keys"""
        if "strengths" in prompt.lower() or "weaknesses" in prompt.lower():
            return '''{
    "strengths": ["Strong foundational skills detected.", "Good layout."],
    "weaknesses": ["Lacks quantified achievements.", "Missing some critical modern frameworks."],
    "improvement_suggestions": ["Add metrics to your experience bullet points.", "Include a link to your GitHub."]
}'''
        elif "summary" in prompt.lower():
            return "Highly motivated and results-oriented professional with a strong track record of success. Proven ability to learn quickly and adapt to new technologies. Seeking to leverage expertise to drive innovation and growth."
        elif "cover letter" in prompt.lower():
            return "Dear Hiring Manager,\n\nI am writing to express my strong interest in the position. With my background and technical skills, I am confident in my ability to make an immediate impact on your team.\n\nThank you for your time and consideration.\n\nSincerely,\n[Your Name]"
        elif "interview" in prompt.lower():
            return '''{
    "technical_questions": ["Explain how you would optimize a slow database query.", "Describe a complex technical challenge you solved."],
    "behavioral_questions": ["Tell me about a time you disagreed with a colleague.", "How do you handle tight deadlines?"],
    "project_questions": ["What was your specific role in your most recent project?", "What technologies did you choose and why?"]
}'''
        elif "roadmap" in prompt.lower():
            return '''{
    "roadmap": ["Complete advanced framework tutorial", "Build 2 full-stack projects", "Contribute to open source", "Apply for mid-level roles"]
}'''
        elif "hiring probability" in prompt.lower() or "talent acquisition prediction" in prompt.lower():
            return '''{
    "shortlisting_probability": 82,
    "interview_probability": 74,
    "hiring_probability": 68,
    "placement_readiness": 80,
    "improvement_suggestions": ["Add more quantifiable achievements", "Highlight leadership experience", "Include certifications"]
}'''
        elif "resume health scanner" in prompt.lower() or "xray" in prompt.lower():
            return '''{
    "health_score": 85,
    "ats_compatibility": 90,
    "keyword_density": 78,
    "completeness_score": 95,
    "section_grades": {
        "education": "Excellent",
        "skills": "Strong",
        "projects": "Strong",
        "experience": "Moderate",
        "certifications": "Missing",
        "achievements": "Weak"
    },
    "missing_sections": ["Certifications", "Publications"],
    "formatting_issues": ["Inconsistent date formats"],
    "content_issues": ["Lacks action verbs", "Passive voice used in experience"],
    "improvement_suggestions": ["Add more quantifiable metrics to experience", "Include certifications"]
}'''
        elif "senior technical recruiter" in prompt.lower() or "recruiter assessment" in prompt.lower():
            return '''{
    "overall_score": 8.7,
    "technical_score": 9.0,
    "projects_score": 8.5,
    "experience_score": 8.0,
    "communication_score": 8.0,
    "leadership_score": 7.5,
    "strengths": ["Strong technical foundation", "Good project portfolio"],
    "concerns": ["Needs more leadership examples", "Short tenure in last role"],
    "recruiter_notes": ["Solid candidate for mid-level roles", "Check communication skills during screening"],
    "decision": "LIKELY SHORTLIST"
}'''
        elif "ai career twin" in prompt.lower():
            return '''{
    "career_identity": "Mid-Level Engineer",
    "career_stage": "Mid-Senior",
    "skill_completion": 72,
    "next_role": "Senior Engineer",
    "future_role": "Staff Engineer / Architect",
    "timeline": "12-18 Months",
    "growth_roadmap": ["Master system design", "Lead a major cross-functional project", "Mentor junior developers", "Speak at a conference"]
}'''
        elif "career architect" in prompt.lower():
            return '''{
    "strengths": ["Clear formatting", "Good technical skills", "Relevant project experience"],
    "weaknesses": ["Lack of quantifiable metrics", "Weak summary", "Missing soft skills keywords"],
    "missing_skills": ["Docker", "Kubernetes", "GraphQL"],
    "learning_recommendations": ["Complete a Docker course", "Build a microservice project", "Get AWS Certified"],
    "recommended_jobs": ["Backend Engineer", "Full Stack Developer", "Cloud Solutions Architect"],
    "career_roadmap": ["Learn containerization", "Master advanced DB concepts", "Apply for senior roles", "Contribute to open source"]
}'''
        elif "expert tech interviewer" in prompt.lower():
            return '''{
    "readiness_score": 75,
    "technical_questions": [
        {"question": "Explain REST vs GraphQL.", "suggested_answer": "Discuss over-fetching vs exact fetching.", "difficulty": "Medium", "topic": "API Design"},
        {"question": "How do you optimize a DB query?", "suggested_answer": "Use indexes and EXPLAIN.", "difficulty": "Hard", "topic": "Databases"}
    ],
    "project_questions": [
        {"question": "What was your role in your largest project?", "suggested_answer": "Focus on specific contributions.", "difficulty": "Medium", "topic": "Experience"}
    ],
    "hr_questions": [
        {"question": "Where do you see yourself in 5 years?", "suggested_answer": "Focus on growth and leadership.", "difficulty": "Easy", "topic": "Career Goals"}
    ],
    "strong_areas": ["API Design", "Database querying"],
    "weak_areas": ["System Design", "Scalability"],
    "preparation_tips": ["Review system design patterns", "Practice behavioral questions"]
}'''
        else:
            return "MOCK_RESPONSE: Gemini API Key not found. Please set GEMINI_API_KEY environment variable."
