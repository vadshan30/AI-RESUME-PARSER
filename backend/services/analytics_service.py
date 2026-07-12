import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from sqlalchemy import func
from sqlalchemy.orm import Session
from collections import Counter
import json
import random

from backend.models import Resume, Skill

logger = logging.getLogger(__name__)

class AnalyticsService:
    """Service for platform-wide analytics and insights combining real DB data and simulated trends"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_platform_overview(self) -> Dict[str, Any]:
        try:
            # Real DB Metrics
            total_resumes = self.db.query(func.count(Resume.id)).scalar() or 0
            
            avg_match_score = self.db.query(
                func.avg(Resume.resume_score)
            ).scalar() or 0
            
            # Growth based on last 30 days vs total (Real)
            thirty_days_ago = datetime.utcnow() - timedelta(days=30)
            recent_resumes = self.db.query(func.count(Resume.id)).filter(
                Resume.created_at >= thirty_days_ago
            ).scalar() or 0
            
            growth_rate = int((recent_resumes / total_resumes) * 100) if total_resumes > 0 else 0
            
            return {
                "total_resumes": total_resumes,
                "total_users": 105, # Simulated
                "total_analyses": total_resumes * 3, # Simulated estimation
                "avg_match_score": int(avg_match_score),
                "success_rate": 68, # Simulated
                "growth_rate": growth_rate,
                "active_users": 42, # Simulated
                "platform_health": {
                    "status": "operational",
                    "uptime": 99.9,
                    "response_time": 142,
                    "error_rate": 0.1,
                    "last_incident": None
                }
            }
        except Exception as e:
            logger.error(f"Overview error: {e}")
            return self._get_default_overview()

    def get_market_trends(self, industry: Optional[str] = None) -> Dict[str, Any]:
        # Real Top Skills
        skill_counts = self.db.query(Skill.skill_name, func.count(Skill.id).label('count'))\
            .group_by(Skill.skill_name)\
            .order_by(func.count(Skill.id).desc())\
            .limit(10).all()
        
        top_skills = [[s[0], s[1]] for s in skill_counts]
        if not top_skills:
            top_skills = [["React", 45], ["Python", 38], ["AWS", 30], ["Node.js", 25]]

        return {
            "top_skills": top_skills,
            "emerging_roles": [
                {"role": "AI Engineer", "growth": 85, "demand": "high"},
                {"role": "Data Privacy Officer", "growth": 54, "demand": "medium"},
                {"role": "Cloud Security Architect", "growth": 62, "demand": "high"},
            ],
            "industry_growth": {
                "Technology": 28,
                "Healthcare": 22,
                "Finance": 15,
                "Education": 12,
                "Energy": 18
            },
            "salary_trends": {
                "Software Engineer": {"min": 80000, "max": 150000, "median": 110000},
            },
            "geographic_distribution": {
                "North America": 45,
                "Europe": 30,
                "Asia Pacific": 15,
                "Latin America": 10
            }
        }
    
    def get_ats_distribution(self) -> Dict[str, Any]:
        # Real average and distribution simulation
        avg = self.db.query(func.avg(Resume.resume_score)).scalar() or 65
        
        return {
            "distribution": {
                "0-20": 15,
                "21-40": 45,
                "41-60": 120,
                "61-80": 350,
                "81-100": 80
            },
            "percentiles": {
                "p10": 35,
                "p25": 52,
                "p50": 68,
                "p75": 84,
                "p90": 95
            },
            "common_issues": [
                {"issue": "Missing Action Verbs", "frequency": 65},
                {"issue": "Unquantified Metrics", "frequency": 55},
                {"issue": "Poor ATS Formatting", "frequency": 40},
                {"issue": "Missing Core Keywords", "frequency": 35}
            ],
            "industry_benchmarks": {
                "Technology": 75,
                "Finance": 72,
                "Healthcare": 68,
                "Education": 60,
                "Retail": 55
            },
            "average_score": int(avg),
            "median_score": 68,
            "improvement_over_time": [
                {"date": "2024-01", "score": 60},
                {"date": "2024-02", "score": 62},
                {"date": "2024-03", "score": 65},
                {"date": "2024-04", "score": 68},
                {"date": "2024-05", "score": 71},
                {"date": "2024-06", "score": int(avg)}
            ]
        }
    
    def get_improvement_analytics(self) -> Dict[str, Any]:
        return {
            "skill_gaps": [
                {"skill": "System Design", "gap_percentage": 45},
                {"skill": "Cloud Architecture", "gap_percentage": 38},
                {"skill": "CI/CD", "gap_percentage": 32},
                {"skill": "Testing", "gap_percentage": 28}
            ],
            "section_effectiveness": {
                "Summary": {"avg_score": 75, "impact": "high"},
                "Experience": {"avg_score": 70, "impact": "very_high"},
                "Skills": {"avg_score": 85, "impact": "high"},
                "Education": {"avg_score": 65, "impact": "medium"}
            },
            "length_analysis": {
                "min": 250,
                "max": 1800,
                "optimal": 800,
                "average": 950
            },
            "keyword_density": {
                "skills": {"current": 12, "recommended": 15},
                "experience": {"current": 35, "recommended": 40}
            },
            "top_recommendations": [
                "Quantify your experience section with hard metrics",
                "Move skills section higher for better ATS parsing",
                "Include a stronger, keyword-rich professional summary"
            ]
        }
    
    def get_industry_insights(self) -> Dict[str, Any]:
        return {
            "industries": {
                "Technology": {
                    "avg_match_score": 78,
                    "top_skills": ["React", "Python", "AWS"],
                    "growth_rate": 22,
                    "common_roles": ["Full Stack", "Data Scientist"],
                    "recommended_certifications": ["AWS Solutions Architect"]
                },
                "Finance": {
                    "avg_match_score": 72,
                    "top_skills": ["Excel", "Financial Modeling"],
                    "growth_rate": 12,
                    "common_roles": ["Analyst", "Risk Manager"],
                    "recommended_certifications": ["CFA"]
                }
            },
            "best_practices": [
                "Use standard job titles",
                "Ensure date formats are MM/YYYY"
            ],
            "trending_industries": [
                {"name": "AI/ML", "growth": 45},
                {"name": "Cybersecurity", "growth": 35},
                {"name": "Green Tech", "growth": 28}
            ],
            "skill_demand": [
                {"skill": "Machine Learning", "demand_score": 95},
                {"skill": "Cloud", "demand_score": 88}
            ]
        }

    def _get_default_overview(self) -> Dict[str, Any]:
        return {
            "total_resumes": 0,
            "total_users": 0,
            "total_analyses": 0,
            "avg_match_score": 0,
            "success_rate": 0,
            "growth_rate": 0,
            "active_users": 0,
            "platform_health": {
                "status": "operational",
                "uptime": 100,
                "response_time": 100,
                "error_rate": 0,
                "last_incident": None
            }
        }
