from typing import List, Dict

class GapAnalysisGenerator:
    """Generates strengths and recommendations based on gaps."""
    
    @staticmethod
    def generate(
        matched_mand_skills: List[str],
        missing_mand_skills: List[str],
        missing_pref_skills: List[str],
        exp_gap: str,
        edu_score: int,
        final_score: int
    ) -> Dict[str, List[str]]:
        
        strengths = []
        recommendations = []
        
        # Hiring Probability String
        if final_score >= 80:
            hiring_prob = "High"
        elif final_score >= 45:
            hiring_prob = "Medium"
        else:
            hiring_prob = "Low"
        
        # Strengths
        if len(matched_mand_skills) >= 5:
            strengths.append(f"Strong alignment with core technologies ({len(matched_mand_skills)} matching skills)")
        elif len(matched_mand_skills) > 0:
            strengths.append(f"Possesses foundational skills ({len(matched_mand_skills)} matches)")
            
        if exp_gap == "Meets requirement":
            strengths.append("Experience meets or exceeds job requirements")
            
        if edu_score >= 100:
            strengths.append("Education level satisfies requirements")
            
        # Dynamic Recommended Learning Path
        if missing_mand_skills:
            for skill in missing_mand_skills[:3]:
                recommendations.append(f"Learn {skill}")
                
        if exp_gap != "Meets requirement":
            recommendations.append(f"Gain experience to close gap: {exp_gap}")
            
        if missing_pref_skills and len(missing_mand_skills) == 0:
            for pref in missing_pref_skills[:2]:
                recommendations.append(f"Bonus: Consider learning {pref} to stand out")
            
        if not recommendations:
            recommendations.append("Continue building portfolio - Excellent match")
            
        return {
            "strengths": strengths,
            "recommendations": recommendations,
            "hiring_probability": hiring_prob
        }
