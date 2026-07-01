# This module contains all the parsers for extracting resume data

from .cleaner import normalize_text
from .sections import detect_sections
from .basic_info import extract_name, extract_email, extract_phone
from .links import extract_linkedin, extract_github, extract_portfolio
from .education import extract_education_intelligence, extract_education
from .skills import extract_hard_skills, extract_soft_skills
from .experience import extract_experience
from .projects import extract_projects
from .certifications import extract_certifications
from .achievements import extract_achievements
from .languages import extract_languages
from .scoring import calculate_resume_score
from .ats_scoring import calculate_ats_score, get_resume_grade, generate_ats_recommendations
from .category_predictor import calculate_category_scores, predict_resume_category, calculate_confidence, generate_category_recommendations
from .skill_gap_analyzer import get_required_skills, find_missing_skills, calculate_skill_match_percentage
from .job_recommender import get_jobs_by_category, calculate_job_match_score, recommend_jobs, rank_jobs, generate_career_path
from .learning_recommender import generate_learning_recommendations, build_learning_path, recommend_certifications
