import os
import json
from backend.ai.providers.openai_provider import OpenAIProvider
from backend.ai.providers.gemini_provider import GeminiProvider
from backend.ai.providers.ollama_provider import OllamaProvider

class AIService:
    def __init__(self):
        provider_name = os.getenv("LLM_PROVIDER", "gemini").lower()
        
        if provider_name == "openai":
            self.provider = OpenAIProvider()
        elif provider_name == "ollama":
            self.provider = OllamaProvider()
        else:
            # Default to Gemini
            self.provider = GeminiProvider()

    def review_resume(self, resume_data: dict) -> dict:
        prompt = f"""
        Act as an expert technical recruiter and ATS specialist.
        Review the following resume data:
        ATS Score: {resume_data.get('resume_score')}
        Skills: {resume_data.get('skills')}
        Experience: {resume_data.get('experience')}
        Projects: {resume_data.get('projects')}
        
        Provide a JSON response with the following keys exactly:
        - "strengths": list of 2-3 strings
        - "weaknesses": list of 2-3 strings
        - "improvement_suggestions": list of 2-3 strings
        
        Only output the raw JSON object, no markdown formatting.
        """
        response_text = self.provider.generate_text(prompt)
        return self._parse_json_response(response_text)

    def generate_summary(self, resume_data: dict) -> str:
        prompt = f"""
        Act as an expert resume writer. Generate a highly professional, ATS-friendly 
        3-4 sentence professional summary based on the following resume data:
        Skills: {resume_data.get('skills')}
        Experience: {resume_data.get('experience')}
        Projects: {resume_data.get('projects')}
        
        Return ONLY the summary text. No introductory remarks.
        """
        return self.provider.generate_text(prompt).strip()

    def generate_cover_letter(self, resume_data: dict, job_role: str = "Software Engineer", company: str = "Hiring Company") -> str:
        prompt = f"""
        Act as an expert career coach. Write a professional, modern, and compelling cover letter
        for a {job_role} position at {company}, based on the following candidate data:
        Name: {resume_data.get('name', '[Your Name]')}
        Skills: {resume_data.get('skills')}
        Experience: {resume_data.get('experience')}
        
        Make it personalized, ATS-friendly, and ready to copy. Do not include placeholders other than [Date].
        """
        return self.provider.generate_text(prompt).strip()

    def generate_interview_questions(self, category: str, skills: list, experience: list) -> dict:
        prompt = f"""
        Act as a Senior Technical Interviewer for a {category} role.
        The candidate has these skills: {skills}
        And this experience: {experience}
        
        Generate a JSON object with EXACTLY these keys:
        - "technical_questions": list of 10 strings
        - "behavioral_questions": list of 5 strings
        - "project_questions": list of 5 strings
        
        Only output the raw JSON object, no markdown formatting.
        """
        response_text = self.provider.generate_text(prompt)
        return self._parse_json_response(response_text)

    def generate_career_roadmap(self, category: str, missing_skills: list) -> dict:
        prompt = f"""
        Act as an expert technical career mentor. The candidate is targeting a {category} role
        but is currently missing these critical skills: {missing_skills}.
        
        Generate a comprehensive personalized career growth roadmap in JSON format EXACTLY matching this schema:
        - "phases": list of 4 phase objects, each containing:
          - "id": integer (1 to 4)
          - "title": string
          - "duration_weeks": integer
          - "description": string
          - "modules": list of 2 objects containing "skill" (string), "study_hours" (integer), "why" (string), "practice_tasks" (list of 3 strings)
          - "projects": list of 1-2 objects containing "name" (string), "difficulty" (string), "time" (string), "skills_used" (list of 3 strings)
          - "interview_topics": object mapping string categories (e.g. "technical", "behavioral") to list of 3 strings
          - "certifications": list of 1-2 objects containing "name" (string), "study_time" (string)
          - "topics": list of 4 strings
          - "tasks": list of 4 objects containing "completed" (boolean, default false), "title" (string), "duration" (string)
        
        Only output the raw JSON object, no markdown formatting.
        """
        response_text = self.provider.generate_text(prompt)
        return self._parse_json_response(response_text)

    def analyze_job_match(self, resume_data: dict, job_description: str) -> dict:
        prompt = f"""
        Act as a strict ATS parsing system. Compare this resume against the job description.
        Resume Skills: {resume_data.get('skills')}
        Resume Experience: {resume_data.get('experience')}
        Job Description: {job_description}
        
        Generate a massive and comprehensive JSON object representing the MatchScore. EXACTLY match this schema:
        - "overall": integer from 0 to 100
        - "hiringProbability": integer from 0 to 100
        - "status": string (one of: "Excellent Match", "Good Match", "Needs Improvement")
        - "categoryScores": object with 5 keys ("skills", "experience", "projects", "education", "certifications"), each being an object containing: "name" (string), "score" (integer), "weight" (integer), "strengths" (list of 2 strings), "gaps" (list of 2 strings), "recommendations" (list of 1 string)
        - "matches": list of 3 skill objects containing: "skill" (string), "score" (integer), "level" (string: "Expert", "Advanced", "Proficient"), "importance" (string: "Critical", "Important", "Nice to have")
        - "gaps": list of 3 gap objects containing: "skill" (string), "currentLevel" (string), "requiredLevel" (string), "urgency" (string: "High", "Medium", "Optional"), "action" (string)
        - "projectMatches": object containing "projects" (list of 2 objects with "projectName" (string), "relevanceScore" (integer), "isRelevant" (boolean), "matchedKeywords" (list of 2 strings)), "relevantCount" (integer), "expectedCount" (integer), "missingKeywords" (list of 2 strings)
        - "recruiterNotes": string (a short professional evaluation)
        - "interviewTopics": list of 4 strings
        - "salaryEstimation": object containing "india" (string e.g. "₹15L - ₹25L") and "usa" (string e.g. "$120k - $160k")
        - "recommendations": list of 3 objects containing "title" (string), "description" (string), "priority" (string: "High", "Medium", "Optional")
        
        Only output the raw JSON object, no markdown formatting.
        """
        response_text = self.provider.generate_text(prompt)
        return self._parse_json_response(response_text)

    def improve_resume_section(self, section_text: str, section_type: str) -> str:
        prompt = f"""
        Act as an expert executive resume writer. 
        Rewrite the following {section_type} section to be highly professional, impactful, action-oriented, and ATS-optimized.
        Original {section_type}:
        {section_text}
        
        Return ONLY the rewritten text. No introductory or concluding remarks. Do not use quotes.
        """
        return self.provider.generate_text(prompt).strip()

    def analyze_skill_gap(self, skills: list, target_role: str) -> dict:
        prompt = f"""
        Act as a Senior Tech Recruiter. The candidate has these skills: {skills}.
        They are targeting the role of: {target_role}.
        
        Analyze the gap and provide a massive JSON response EXACTLY matching this schema:
        - "matchScore": integer (0-100)
        - "gapScore": integer (0-100)
        - "coverage": integer (0-100)
        - "skillStrength": integer (0-100)
        - "summary": string
        - "criticalGaps": list of 2 objects with: "skill", "category" (string), "currentLevel" (string), "requiredLevel" (string), "urgency" ("Critical"/"High"/"Medium"/"Low"), "description" (string), "estimatedTime" (string), "priority" (integer), "learningResources" (list of 2 objects with "type" ("Course"/"Book"/"Tutorial"/"Project"/"Certification"), "title", "provider", "timeToComplete", "cost" ("Free"/"Paid"/"Freemium"), "rating" (float))
        - "highPriorityGaps": list of 2 objects (same schema as criticalGaps)
        - "mediumPriorityGaps": list of 2 objects (same schema as criticalGaps)
        - "strongSkills": list of 3 objects with: "skill", "category", "proficiency", "description", "showcaseAdvice"
        - "radarData": list of 5 objects with: "subject" (string), "A" (integer), "B" (integer), "fullMark" (integer, always 100)
        - "learningPlan": object with: "roadmap" (list of 3 objects with "title", "description", "duration"), "totalEstimatedTime" (string), "weeklySchedule" (list of 3 strings)
        - "careerImpact": object with: "salaryIncrease" (string), "timeToHire" (string), "marketDemand" (string), "progressionPath" (list of 3 strings)
        
        Only output the raw JSON object, no markdown formatting.
        """
        response_text = self.provider.generate_text(prompt)
        return self._parse_json_response(response_text)

    def generate_career_insights(self, skills: list, experience: list) -> dict:
        prompt = f"""
        Act as a Career Architect. Based on the candidate's skills: {skills} and experience: {experience}.
        
        Suggest 3-4 alternate or advanced job titles they are highly qualified for.
        Generate a JSON object with exactly this key:
        - "suggested_roles": A list of objects, each containing:
             "title": string,
             "match_reason": string (short 1 sentence why),
             "average_salary": string (e.g. "$100k - $130k")
             
        Only output the raw JSON object, no markdown formatting.
        """
        response_text = self.provider.generate_text(prompt)
        return self._parse_json_response(response_text)

    def generate_hiring_probability(self, resume_data: dict) -> dict:
        prompt = f"""
        Act as an expert AI Talent Acquisition Prediction system. Based on this candidate's profile:
        Skills: {resume_data.get('skills')}
        Experience: {resume_data.get('experience')}
        Projects: {resume_data.get('projects')}
        ATS Score: {resume_data.get('resume_score')}
        
        Analyze their hiring probability for a standard tech role.
        Generate a JSON object with EXACTLY these keys:
        - "shortlisting_probability": integer from 0 to 100
        - "interview_probability": integer from 0 to 100
        - "hiring_probability": integer from 0 to 100
        - "placement_readiness": integer from 0 to 100
        - "improvement_suggestions": list of 3 actionable strings
        
        Only output the raw JSON object, no markdown formatting.
        """
        response_text = self.provider.generate_text(prompt)
        return self._parse_json_response(response_text)

    def generate_resume_xray(self, resume_data: dict) -> dict:
        prompt = f"""
        Act as a strict Resume Health Scanner. Deeply scan the following data:
        Skills: {resume_data.get('skills')}
        Experience: {resume_data.get('experience')}
        Projects: {resume_data.get('projects')}
        ATS Score: {resume_data.get('resume_score')}
        
        Generate a JSON object with EXACTLY these keys:
        - "health_score": integer from 0 to 100
        - "ats_compatibility": integer from 0 to 100
        - "keyword_density": integer from 0 to 100
        - "completeness_score": integer from 0 to 100
        - "section_grades": object mapping section names ("education", "skills", "projects", "experience", "certifications", "achievements") to strings ("Excellent", "Strong", "Moderate", "Weak", "Missing")
        - "missing_sections": list of strings
        - "formatting_issues": list of strings
        - "content_issues": list of strings
        - "improvement_suggestions": list of strings
        
        Only output the raw JSON object, no markdown formatting.
        """
        response_text = self.provider.generate_text(prompt)
        return self._parse_json_response(response_text)

    def generate_recruiter_view(self, resume_data: dict) -> dict:
        prompt = f"""
        Act as a Senior Technical Recruiter screening a candidate.
        Candidate Data:
        Skills: {resume_data.get('skills')}
        Experience: {resume_data.get('experience')}
        Projects: {resume_data.get('projects')}
        
        Provide a blunt recruiter assessment. Generate a JSON object with EXACTLY these keys:
        - "overall_score": float out of 10.0
        - "technical_score": float out of 10.0
        - "projects_score": float out of 10.0
        - "experience_score": float out of 10.0
        - "communication_score": float out of 10.0
        - "leadership_score": float out of 10.0
        - "strengths": list of strings
        - "concerns": list of strings
        - "recruiter_notes": list of strings
        - "decision": string, EXACTLY one of: "LIKELY SHORTLIST", "MAYBE SHORTLIST", "NEEDS IMPROVEMENT", "REJECT RISK"
        
        Only output the raw JSON object, no markdown formatting.
        """
        response_text = self.provider.generate_text(prompt)
        return self._parse_json_response(response_text)

    def generate_career_twin(self, resume_data: dict) -> dict:
        prompt = f"""
        Act as an AI Career Twin Simulator. Analyze the candidate's trajectory:
        Skills: {resume_data.get('skills')}
        Experience: {resume_data.get('experience')}
        
        Generate a massive and comprehensive JSON object that represents a digital career twin. EXACTLY match this schema:
        - "profile": object with "name", "currentRole" (string), "experienceLevel" (one of: Entry, Junior, Mid, Senior, Lead, Executive), "domain" (list of 2 strings), "summary", "uniqueValue", "avatar" (use a generic url like "https://ui-avatars.com/api/?name=Candidate&background=random")
        - "careerHealth": object with 5 integer scores (0-100): "overall", "skillDiversity", "careerProgression", "industryAlignment", "futureReadiness", and "lastUpdated" (string date format)
        - "careerPaths": list of 2 path objects, each with: "id" (string), "title" (string), "roles" (list of 3 role objects containing "title", "timeline" (string), "skills" (list of 2 strings), "salaryRange" (string), "probability" (0-100)), "timeToReach" (integer years), "requiredSkills" (list of 3 strings)
        - "skillGaps": object with: "missing" (list of 3 objects with "skill", "urgency" (High/Medium/Low), "actionPlan", "timeToLearn"), "improvements" (list of 2 objects with "skill", "currentLevel" (0-100), "requiredLevel" (0-100), "gap" (0-100)), "surplus" (list of 2 strings)
        - "recommendations": list of 3 recommendation objects, each with "category" (Learning/Networking/Projects/Jobs/Development), "priority" (High/Medium/Low), "title", "description", "actionItems" (list of 3 strings), "resources" (list of 2 strings), "timeline" (string)
        - "timeline": object with "past" (list of 2 objects with "year" (integer), "title", "achieved" (boolean)), "future" (list of 2 objects with "year" (integer), "title", "status" (Planned/In Progress/Achieved))
        
        Only output the raw JSON object, no markdown formatting.
        """
        response_text = self.provider.generate_text(prompt)
        return self._parse_json_response(response_text)

    def generate_career_intelligence(self, resume_data: dict) -> dict:
        prompt = f"""
        Act as a Master Career Architect. Perform a comprehensive analysis of this resume:
        Skills: {resume_data.get('skills')}
        Experience: {resume_data.get('experience')}
        Projects: {resume_data.get('projects')}
        ATS Score: {resume_data.get('resume_score')}
        
        Generate a JSON object with EXACTLY these keys matching the frontend enterprise dashboard schema:
        - "target_career": object containing:
            - "role_name": string
            - "category": string
            - "industry_demand": object mapping 3 strings (e.g. "growth_rate", "open_positions", "future_outlook") to strings (e.g. "25% YoY", "50k+", "Highly Positive")
            - "salary_range": object mapping 4 regions (e.g. "USA", "Europe", "Asia", "Remote") to strings (e.g. "$120k - $160k")
            - "learning_recommendations": object where keys are 2-3 specific skills (strings), and values are objects containing "priority" ("Critical", "High", or "Medium"), "hours" (integer), "why" (string), and "projects" (list of 2 strings)
        - "analysis": object containing:
            - "readiness": object with 4 integer scores (0-100): "overall", "technical", "industry", "interview"
            - "progress_bars": object mapping 4 skill categories (e.g. "Frontend", "Backend", "Cloud", "System Design") to integer scores (0-100)
            - "missing_critical": list of objects, each with "skill" (string) and "severity" (string: "Critical" or "High")
            - "optional": list of objects, each with "skill" (string)
            - "transitions": list of 2 objects, each with "role" (string) and "added_skills" (list of 2 strings)
        
        Only output the raw JSON object, no markdown formatting.
        """
        response_text = self.provider.generate_text(prompt)
        return self._parse_json_response(response_text)

    def generate_interview_simulator(self, resume_data: dict) -> dict:
        prompt = f"""
        Act as an Expert Tech Interviewer. Review this resume:
        Skills: {resume_data.get('skills')}
        Experience: {resume_data.get('experience')}
        Projects: {resume_data.get('projects')}
        
        Create a customized interview prep guide. Generate a JSON object with EXACTLY these keys:
        - "readiness_score": integer from 0 to 100
        - "technical_questions": list of 10 objects, each with "question" (string), "suggested_answer" (string), "difficulty" (string e.g. "Medium"), "topic" (string), and "expected_keywords" (list of strings)
        - "project_questions": list of 5 objects, each with "question", "suggested_answer", "difficulty", "topic", "expected_keywords"
        - "hr_questions": list of 5 objects, each with "question", "suggested_answer", "difficulty", "topic", "expected_keywords"
        - "strong_areas": list of strings
        - "weak_areas": list of strings
        - "preparation_tips": list of strings
        
        Only output the raw JSON object, no markdown formatting.
        """
        response_text = self.provider.generate_text(prompt)
        return self._parse_json_response(response_text)

    def evaluate_interview_answer(self, question: str, answer: str, role: str) -> dict:
        prompt = f"""
        Act as an expert technical interviewer for a {role} role.
        The candidate was asked this question:
        {question}
        
        The candidate provided this answer:
        {answer}
        
        Evaluate the answer strictly and provide a JSON response with exactly these keys:
        - "score": integer from 0 to 100 (where 100 is a flawless, perfect answer)
        - "feedback": string (constructive feedback on what was good and what was missing or wrong)
        
        Only output the raw JSON object, no markdown formatting.
        """
        response_text = self.provider.generate_text(prompt)
        return self._parse_json_response(response_text)

    def generate_role_profile(self, target_role: str) -> dict:
        prompt = f"""
        Act as an expert technical recruiter and industry analyst.
        Generate a comprehensive, ideal candidate profile for the role: '{target_role}'.
        
        Generate a JSON object EXACTLY matching this schema:
        - "name": string (the exact role name)
        - "idealExperience": integer (number of years)
        - "idealEducation": string (e.g. "Bachelor's", "Master's", "PhD")
        - "requiredSkills": list of 10-15 strings
        - "preferredSkills": list of 5-10 strings
        - "expectedProjects": list of 5-8 strings (typical project types they should have built)
        - "certifications": list of 3-5 strings
        - "topCompanies": list of exactly 6 objects, each with "name" (string), "type" (string, e.g. "Tech", "FAANG", "Fintech"), and "diff" (string: must be "Very High", "High", or "Medium")
        - "salaryRange": object with "entry" (integer), "mid" (integer), "senior" (integer), "lead" (integer)
        - "interviewTopics": list of 8-10 strings
        - "scoringWeights": object with "skills" (integer), "experience" (integer), "ats" (integer), "projects" (integer), "education" (integer) - these must sum to 100
        - "roadmapTemplates": object with "immediate" (list of 3 strings), "shortTerm" (list of 3 strings), "longTerm" (list of 3 strings)
        
        Only output the raw JSON object, no markdown formatting.
        """
        response_text = self.provider.generate_text(prompt)
        return self._parse_json_response(response_text)

    def _parse_json_response(self, text: str) -> dict:
        """Helper to cleanly parse JSON out of LLM responses that might include markdown code blocks"""
        try:
            # Strip markdown block formatting if present
            clean_text = text.strip()
            if clean_text.startswith("```json"):
                clean_text = clean_text[7:]
            if clean_text.startswith("```"):
                clean_text = clean_text[3:]
            if clean_text.endswith("```"):
                clean_text = clean_text[:-3]
            
            return json.loads(clean_text.strip())
        except json.JSONDecodeError:
            # Fallback if the LLM didn't return valid JSON
            return {
                "error": "Failed to parse AI response as JSON",
                "raw_response": text
            }
