import re
from typing import Tuple, Dict, Any

class ContentValidator:
    """
    Validates text input to prevent garbage data from wasting AI quota.
    """
    
    @staticmethod
    def validate_resume(text: str) -> Tuple[bool, str]:
        """Validate if the provided text looks like a real resume."""
        if not text or not text.strip():
            return False, "Resume text is empty."
            
        if len(text) < 150:
            return False, "Resume is too short to perform a meaningful analysis."
            
        if len(text) > 30000:
            return False, "Resume is excessively long. Please compress it."
            
        # Check for lorem ipsum
        if "lorem ipsum" in text.lower():
            return False, "Placeholder text (Lorem Ipsum) detected. Please provide a real resume."
            
        # Check for JSON/HTML/SQL signatures indicating the user uploaded code
        if text.strip().startswith("{") and text.strip().endswith("}"):
            return False, "Input appears to be JSON data, not a readable resume."
            
        if "SELECT * FROM" in text.upper() or "DROP TABLE" in text.upper():
            return False, "SQL syntax detected. Please upload a standard resume."
            
        # Must contain at least some common resume words
        resume_keywords = ["experience", "education", "skills", "project", "work", "university", "college", "degree", "school"]
        matches = sum(1 for kw in resume_keywords if kw in text.lower())
        if matches < 2:
            return False, "Text does not contain common resume sections (Experience, Education, Skills, etc.). Is this a valid resume?"
            
        return True, ""

    @staticmethod
    def evaluate_resume_quality(text: str) -> Dict[str, Any]:
        """
        Intelligently detects resume sections and calculates validation score.
        """
        if not text or not text.strip():
            return {
                "score": 0,
                "status": "INVALID",
                "reason": "Empty document. No readable text found.",
                "detected_sections": {}
            }
            
        if len(text.strip()) < 100:
            return {
                "score": 0,
                "status": "INVALID",
                "reason": f"Text is too short ({len(text.strip())} chars). Minimum 100 characters required.",
                "detected_sections": {}
            }

        from backend.parsers.basic_info import extract_name, extract_email, extract_phone
        
        name_val = extract_name(text)
        email_val = extract_email(text)
        phone_val = extract_phone(text)
        
        has_name = name_val != "Not Found" and len(name_val) > 2
        has_email = email_val != "Not Found"
        has_phone = phone_val != "Not Found"
        
        section_keywords = {
            "skills": ["skills", "technical skills", "core competencies", "technologies", "expertise", "key skills", "programming languages"],
            "education": ["education", "academic background", "qualification", "university", "college", "academics", "academic profile"],
            "experience": ["work experience", "professional experience", "employment history", "career history", "internship", "experience", "work history", "employment"],
            "projects": ["projects", "personal projects", "academic projects", "key projects", "notable projects"],
            "certifications": ["certifications", "certificates", "courses", "credentials", "licenses"],
            "summary": ["summary", "profile", "professional summary", "career objective", "about me", "professional profile", "objective"]
        }
        
        detected = {}
        for section, keywords in section_keywords.items():
            found = False
            # Check for header-like patterns (beginning of line)
            for kw in keywords:
                pattern = rf"(?im)^\s*{re.escape(kw)}\s*(?:[:\-\b]|$)"
                if re.search(pattern, text):
                    found = True
                    break
            # Fallback: check case-insensitive presence in text
            if not found:
                for kw in keywords:
                    if re.search(rf"(?i)\b{re.escape(kw)}\b", text):
                        found = True
                        break
            detected[section] = found

        score = 0
        if has_name: score += 10
        if has_email: score += 10
        if has_phone: score += 10
        if detected["skills"]: score += 20
        if detected["education"]: score += 15
        if detected["experience"]: score += 20
        if detected["projects"]: score += 10
        if detected["certifications"]: score += 5
        if detected["summary"]: score += 10

        # Define status and details
        status = "INVALID"
        reason = ""
        
        if score >= 70:
            status = "VALID"
        elif score >= 50:
            status = "ACCEPTED"
            # Highlight what is missing
            missing = []
            if not detected["experience"]: missing.append("Experience")
            if not detected["projects"]: missing.append("Projects")
            if not detected["skills"]: missing.append("Skills")
            if missing:
                reason = f"Missing some sections: {', '.join(missing)}."
        elif score >= 30:
            status = "WEAK"
            reason = "Weak resume. Missing critical sections like Experience or Skills."
        else:
            status = "INVALID"
            reasons = []
            if not has_name and not has_email:
                reasons.append("No personal contact info (Name/Email) found")
            if not detected["skills"] and not detected["experience"]:
                reasons.append("No Skills or Experience structure detected")
            if len(reasons) > 0:
                reason = " | ".join(reasons)
            else:
                reason = "No resume structure detected."

        return {
            "score": score,
            "status": status,
            "reason": reason,
            "detected_sections": {
                "Name": has_name,
                "Email": has_email,
                "Phone": has_phone,
                "Skills": detected["skills"],
                "Education": detected["education"],
                "Experience": detected["experience"],
                "Projects": detected["projects"],
                "Certifications": detected["certifications"],
                "Summary": detected["summary"]
            }
        }

# Global validator instance
content_validator = ContentValidator()
