import re
from typing import Tuple

class JobDescriptionValidator:
    """Validates the job description and generates a confidence score."""
    
    @staticmethod
    def validate(text: str) -> Tuple[bool, int]:
        if not text or len(text.strip()) < 50:
            return False, 0
            
        confidence = 0
        text_lower = text.lower()
        
        # 1. Length check (max 20 points)
        length = len(text)
        if length > 500:
            confidence += 20
        elif length > 200:
            confidence += 10
            
        # 2. Contains Job Role indicators (max 20 points)
        roles = ['developer', 'engineer', 'manager', 'scientist', 'analyst', 'designer', 'lead']
        if any(role in text_lower for role in roles):
            confidence += 20
            
        # 3. Contains Technical Words (max 20 points)
        tech_words = ['software', 'data', 'api', 'system', 'cloud', 'database', 'code', 'application', 'design']
        tech_count = sum(1 for word in tech_words if word in text_lower)
        if tech_count >= 3:
            confidence += 20
        elif tech_count >= 1:
            confidence += 10
            
        # 4. Contains Responsibility indicators (max 20 points)
        resp_words = ['responsible for', 'you will', 'responsibilities', 'duties', 'what you\'ll do']
        if any(resp in text_lower for resp in resp_words):
            confidence += 20
            
        # 5. Contains Requirement indicators (max 20 points)
        req_words = ['requirements', 'required', 'qualifications', 'what you bring', 'experience with', 'skills']
        if any(req in text_lower for req in req_words):
            confidence += 20
            
        # Threshold is 70%
        return confidence >= 70, confidence
