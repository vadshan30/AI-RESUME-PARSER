from typing import Tuple, List

class HardRuleNormalizer:
    """Applies strict hierarchical domain gating and rules."""
    
    @staticmethod
    def normalize(
        raw_score: int, 
        role_score: int, 
        mand_skills_score: int,
        jd_domain: str,
        resume_domain: str,
        exp_score: int,
        missing_critical: List[str]
    ) -> Tuple[int, str, str, str]:
        """Returns (Final Score, Classification, Hard Rule String, Reason Text)"""
        
        final_score = raw_score
        hard_rule_applied = "No"
        reason = []
        
        domain_mismatch = (jd_domain != resume_domain and jd_domain != "Unknown" and resume_domain != "Unknown")
        
        # 1. Domain Mismatch Gate
        if domain_mismatch:
            if final_score > 20:
                final_score = 20
                hard_rule_applied = "Max 20 (Domain Mismatch)"
            reason.append(f"Major domain mismatch ({resume_domain} vs {jd_domain}).")
        else:
            reason.append(f"Domain alignment matches ({jd_domain}).")
            
        # 2. Complete Unrelated Role and Skills
        if role_score < 20 and mand_skills_score < 20:
            if final_score > 15:
                final_score = 15
                hard_rule_applied = "Max 15 (Role < 20 AND Skills < 20)"
            reason.append("Role and core skills are completely unaligned.")
            
        # 3. No mandatory skills matched at all
        elif mand_skills_score == 0:
            if final_score > 10:
                final_score = 10
                hard_rule_applied = "Max 10 (Mandatory Skills = 0)"
            reason.append("Candidate lacks all required baseline skills.")
            
        # 4. Mandatory Skills weak
        elif mand_skills_score < 20:
            if final_score > 30:
                final_score = 30
                hard_rule_applied = "Max 30 (Mandatory Skills < 20)"
            reason.append("Core technical skills are significantly lacking.")
            
        # 5. Role mismatch (but skills might be okay)
        elif role_score < 20:
            if final_score > 25:
                final_score = 25
                hard_rule_applied = "Max 25 (Role Similarity < 20)"
            reason.append("Previous job titles do not align with target role.")
            
        # 6. Minimum Boost for Perfect Candidates
        if role_score > 90 and mand_skills_score > 90 and exp_score > 70:
            if final_score < 90:
                final_score = 90
                hard_rule_applied = "Min 90 (Perfect Core Alignment)"
            reason.append("Candidate is highly qualified across role, skills, and experience.")
            
        # Add specific missing criticals to reason
        if missing_critical and not domain_mismatch:
            reason.append(f"Missing critical skills: {', '.join(missing_critical[:3])}.")
            
        if exp_score < 100 and not domain_mismatch:
            reason.append("Experience is below the requested requirement.")
            
        # Classification Bands
        if final_score >= 90:
            classification = "Excellent Match"
        elif final_score >= 80:
            classification = "Strong Match"
        elif final_score >= 65:
            classification = "Good Match"
        elif final_score >= 45:
            classification = "Average Match"
        elif final_score >= 25:
            classification = "Weak Match"
        else:
            classification = "Poor Match"
            
        reason_text = " ".join(reason)
        return final_score, classification, hard_rule_applied, reason_text
