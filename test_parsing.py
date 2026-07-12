import traceback
from backend.parsers.cleaner import normalize_text
from backend.parsers.sections import detect_sections
from backend.parsers.basic_info import extract_name, extract_email, extract_phone
from backend.parsers.skills import extract_categorized_skills, extract_hard_skills
from backend.parsers.education import extract_education, extract_education_intelligence
from backend.parsers.experience import extract_experience
from backend.parsers.projects import extract_projects
from backend.parsers.scoring import calculate_detailed_score, check_ats_formatting

dummy_text = """
John Doe
johndoe@email.com
(555) 123-4567

Summary
Software Engineer with 5 years of experience.

Skills
Python, JavaScript, React, SQL, FastAPI

Experience
Software Engineer at TechCorp (2020-Present)
- Developed APIs using FastAPI

Education
B.S. Computer Science, University of Technology (2016-2020)

Projects
AI Resume Parser
- Built a resume parsing system.
"""

def test():
    try:
        print("Testing normalize_text...")
        cleaned_text = normalize_text(dummy_text)
        
        print("Testing detect_sections...")
        sections = detect_sections(cleaned_text)
        
        print("Testing extract_name...")
        name = extract_name(dummy_text)
        
        print("Testing extract_email...")
        email = extract_email(dummy_text)
        
        print("Testing extract_phone...")
        phone = extract_phone(dummy_text)
        
        print("Testing extract_categorized_skills...")
        skills_text = sections.get("skills", "")
        categorized_skills = extract_categorized_skills(skills_text)
        
        print("Testing extract_hard_skills...")
        flat_skills = extract_hard_skills(skills_text)
        
        print("Testing extract_education_intelligence...")
        education_text = sections.get("education", "")
        edu_dict = extract_education_intelligence(education_text, dummy_text)
        
        print("Testing extract_education...")
        education_list = [edu_dict.get("degree")] if edu_dict.get("degree") else extract_education(dummy_text)
        
        print("Testing extract_experience...")
        experience_text = sections.get("experience", "")
        experience_list = extract_experience(experience_text, dummy_text)
        
        print("Testing extract_projects...")
        projects_text = sections.get("projects", "")
        projects_list = extract_projects(projects_text, dummy_text)
        
        print("Testing check_ats_formatting...")
        formatting_checks = check_ats_formatting(dummy_text)
        
        print("Testing calculate_detailed_score...")
        detailed_score = calculate_detailed_score(
            name=name, email=email, phone=phone, 
            skills=flat_skills, education=education_list, 
            projects=projects_list, experience=experience_list, 
            formatting_checks=formatting_checks, text_length=dummy_text
        )
        
        print("All local parsing passed successfully!")
    except Exception as e:
        print("=" * 80)
        print("ERROR OCCURRED IN LOCAL PARSING")
        traceback.print_exc()
        print("=" * 80)

if __name__ == "__main__":
    test()
