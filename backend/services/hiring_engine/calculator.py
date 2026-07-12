class WeightedCalculator:
    """Calculates the raw weighted score."""
    
    WEIGHTS = {
        "role": 0.25,
        "mandatory_skills": 0.35,
        "experience": 0.15,
        "responsibilities": 0.10,
        "education": 0.05,
        "preferred_skills": 0.05,
        "keywords": 0.05
    }
    
    @classmethod
    def calculate(
        cls,
        role_score: int,
        mand_skills_score: int,
        exp_score: int,
        resp_score: int,
        edu_score: int,
        pref_skills_score: int,
        kw_score: int
    ) -> int:
        
        raw_score = (
            (role_score * cls.WEIGHTS["role"]) +
            (mand_skills_score * cls.WEIGHTS["mandatory_skills"]) +
            (exp_score * cls.WEIGHTS["experience"]) +
            (resp_score * cls.WEIGHTS["responsibilities"]) +
            (edu_score * cls.WEIGHTS["education"]) +
            (pref_skills_score * cls.WEIGHTS["preferred_skills"]) +
            (kw_score * cls.WEIGHTS["keywords"])
        )
        
        return max(0, min(100, int(raw_score)))
