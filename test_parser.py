import os
import json
from backend.parsers.pdf_extractor import extract_text_from_pdf
from backend.parsers.cleaner import normalize_text
from backend.parsers.sections import detect_sections
from backend.parsers.basic_info import extract_name, extract_email, extract_phone
from backend.parsers.links import extract_linkedin, extract_github, extract_portfolio
from backend.parsers.education import extract_education_intelligence, extract_education
from backend.parsers.skills import extract_hard_skills, extract_soft_skills
from backend.parsers.experience import extract_experience
from backend.parsers.projects import extract_projects
from backend.parsers.certifications import extract_certifications
from backend.parsers.achievements import extract_achievements
from backend.parsers.languages import extract_languages
from backend.parsers.scoring import calculate_resume_score, generate_recommendations
from backend.parsers.ats_scoring import calculate_ats_score, get_resume_grade, generate_ats_recommendations
from backend.parsers.category_predictor import calculate_category_scores, predict_resume_category, calculate_confidence, generate_category_recommendations
from backend.parsers.skill_gap_analyzer import get_required_skills, find_missing_skills, calculate_skill_match_percentage
from backend.parsers.job_recommender import recommend_jobs, generate_career_path
from backend.parsers.learning_recommender import generate_learning_recommendations, build_learning_path, recommend_certifications




def test_resume_parser(pdf_path):
    print(f"Testing on {pdf_path}")
    raw_text = extract_text_from_pdf(pdf_path)
    text = normalize_text(raw_text)
    sections = detect_sections(text)

    name = extract_name(text)
    email = extract_email(text)
    phone = extract_phone(text)

    linkedin = extract_linkedin(text)
    github = extract_github(text)
    portfolio = extract_portfolio(text)
    links_dict = {"linkedin": linkedin, "github": github, "portfolio": portfolio}

    edu_intel = extract_education_intelligence(sections["education"], text)
    education_array = extract_education(sections["education"] or text)

    skills = extract_hard_skills(sections["skills"] or text)
    soft_skills = extract_soft_skills(sections["skills"] or text)

    experience = extract_experience(sections["experience"], text)
    projects = extract_projects(sections["projects"], text)
    certifications = extract_certifications(sections["certifications"])
    achievements = extract_achievements(sections["achievements"])
    languages = extract_languages(sections["languages"])

    score = calculate_resume_score(skills, education_array, projects, experience, soft_skills, certifications)
    recommendations = generate_recommendations(email, phone, skills, education_array, projects, experience, soft_skills, links_dict)

    parsed_data = {
        "email": email,
        "phone": phone,
        "skills": skills,
        "projects": projects,
        "experience": experience,
        "education": education_array,
        "degree": edu_intel.get("degree", ""),
        "certifications": certifications,
        "github": github,
        "linkedin": linkedin
    }

    ats_score, ats_breakdown = calculate_ats_score(parsed_data)
    ats_grade = get_resume_grade(ats_score)
    ats_recommendations = generate_ats_recommendations(parsed_data)

    category_scores = calculate_category_scores(text)
    predicted_category = predict_resume_category(category_scores)
    confidence = calculate_confidence(category_scores, predicted_category)
    category_recs = generate_category_recommendations(predicted_category)

    recommendations.extend(category_recs)

    # 12. Missing Skills Analyzer
    required_skills = get_required_skills(predicted_category)
    matched_skills, missing_skills = find_missing_skills(skills, required_skills)
    skill_match_percentage = calculate_skill_match_percentage(matched_skills, required_skills)

    # 13. Job Recommendation Engine
    recommended_jobs = recommend_jobs(skills, predicted_category, ats_score, experience)
    career_path = generate_career_path(predicted_category)

    # 14. Learning Recommendation Engine (Phase 6)
    learning_recommendations = generate_learning_recommendations(missing_skills)
    learning_path = build_learning_path(predicted_category)
    recommended_certifications = recommend_certifications(predicted_category)

    result = {
        "filename": os.path.basename(pdf_path),
        "name": name,
        "email": email,
        "phone": phone,
        "linkedin": linkedin,
        "github": github,
        "portfolio": portfolio,
        "college": edu_intel.get("college", ""),
        "degree": edu_intel.get("degree", ""),
        "cgpa": edu_intel.get("cgpa", ""),
        "graduation_year": edu_intel.get("graduation_year", ""),
        "skills": skills,
        "soft_skills": soft_skills,
        "languages": languages,
        "certifications": certifications,
        "achievements": achievements,
        "education": education_array,
        "projects": projects,
        "experience": experience,
        "resume_score": score,
        "recommendations": recommendations,
        "ats_score": ats_score,
        "ats_grade": ats_grade,
        "ats_breakdown": ats_breakdown,
        "ats_recommendations": ats_recommendations,
        "category": predicted_category,
        "confidence": confidence,
        "category_scores": category_scores,
        "skill_match_percentage": skill_match_percentage,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "learning_recommendations": learning_recommendations,
        "learning_path": learning_path,
        "recommended_certifications": recommended_certifications,
        "recommended_jobs": recommended_jobs,
        "career_path": career_path
    }
    
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    pdf_file = r"c:\Users\vadsh\OneDrive\Documents\AI-RESUME-PARSER\uploads\SRI VADSHAN RESUME3RD SEM.pdf"
    if os.path.exists(pdf_file):
        test_resume_parser(pdf_file)
    else:
        print("Test PDF not found!")
