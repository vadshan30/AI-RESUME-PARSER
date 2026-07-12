from typing import Dict, Optional, List
import json
import os

class RoleDatabase:
    """
    Static dictionary representing the single source of truth for Role requirements.
    Replaces AI hallucinations about what skills a 'Software Engineer' needs.
    """
    def __init__(self):
        # We start by seeding the top most common roles in tech.
        self.roles: Dict[str, dict] = {
            "software engineer": {
                "title": "Software Engineer",
                "category": "Engineering",
                "core_skills": ["Data Structures", "Algorithms", "Object-Oriented Programming", "Version Control", "Debugging"],
                "technical_skills": ["Python", "Java", "JavaScript", "C++", "SQL", "Git"],
                "soft_skills": ["Problem Solving", "Teamwork", "Communication", "Time Management"],
                "certifications": ["AWS Certified Developer", "Oracle Certified Associate"],
                "salary_range": {"india": "₹6L - ₹25L", "usa": "$90k - $160k"},
                "interview_topics": ["System Design", "Coding Algorithms", "Behavioral", "Database Design"],
                "experience_levels": {
                    "entry": "0-2 years",
                    "mid": "3-5 years",
                    "senior": "5+ years"
                }
            },
            "frontend developer": {
                "title": "Frontend Developer",
                "category": "Engineering",
                "core_skills": ["Web Architecture", "Responsive Design", "State Management", "Performance Optimization"],
                "technical_skills": ["HTML5", "CSS3", "JavaScript", "React", "Vue", "TypeScript", "Webpack"],
                "soft_skills": ["Attention to Detail", "UI/UX Sensibility", "Communication"],
                "certifications": ["Meta Front-End Developer", "Google Mobile Web Specialist"],
                "salary_range": {"india": "₹5L - ₹20L", "usa": "$80k - $150k"},
                "interview_topics": ["DOM Manipulation", "CSS Specificity", "React Hooks", "Web Performance"],
                "experience_levels": {
                    "entry": "0-2 years",
                    "mid": "3-5 years",
                    "senior": "5+ years"
                }
            },
            "backend developer": {
                "title": "Backend Developer",
                "category": "Engineering",
                "core_skills": ["API Design", "Database Management", "Security", "Scalability"],
                "technical_skills": ["Node.js", "Python", "Java", "Go", "PostgreSQL", "MongoDB", "Redis", "Docker"],
                "soft_skills": ["Analytical Thinking", "Problem Solving", "System Architecture"],
                "certifications": ["AWS Certified Solutions Architect", "MongoDB Node.js Developer"],
                "salary_range": {"india": "₹7L - ₹25L", "usa": "$100k - $170k"},
                "interview_topics": ["REST vs GraphQL", "Database Indexing", "Caching Strategies", "Microservices"],
                "experience_levels": {
                    "entry": "0-2 years",
                    "mid": "3-5 years",
                    "senior": "5+ years"
                }
            },
            "data scientist": {
                "title": "Data Scientist",
                "category": "Data",
                "core_skills": ["Statistical Analysis", "Machine Learning", "Data Wrangling", "Data Visualization"],
                "technical_skills": ["Python", "R", "SQL", "Pandas", "Scikit-Learn", "TensorFlow", "Tableau"],
                "soft_skills": ["Critical Thinking", "Business Acumen", "Communication"],
                "certifications": ["IBM Data Science Professional", "AWS Certified Machine Learning"],
                "salary_range": {"india": "₹8L - ₹30L", "usa": "$110k - $180k"},
                "interview_topics": ["Probability Theory", "ML Algorithms", "A/B Testing", "SQL Queries"],
                "experience_levels": {
                    "entry": "0-2 years",
                    "mid": "3-5 years",
                    "senior": "5+ years"
                }
            },
            "product manager": {
                "title": "Product Manager",
                "category": "Product",
                "core_skills": ["Product Strategy", "Market Research", "Agile Methodologies", "User Stories", "Roadmapping"],
                "technical_skills": ["Jira", "Confluence", "Figma", "Google Analytics", "SQL"],
                "soft_skills": ["Leadership", "Stakeholder Management", "Empathy", "Negotiation"],
                "certifications": ["Certified Scrum Product Owner (CSPO)", "Pragmatic Institute Certified"],
                "salary_range": {"india": "₹12L - ₹40L", "usa": "$110k - $200k"},
                "interview_topics": ["Product Design", "Metrics & Analytics", "Behavioral", "Strategy Execution"],
                "experience_levels": {
                    "entry": "0-2 years",
                    "mid": "3-5 years",
                    "senior": "5+ years"
                }
            }
        }
        
        # Mapping to find roles even with slight misspellings or abbreviations
        self.aliases = {
            "sde": "software engineer",
            "sde1": "software engineer",
            "sde2": "software engineer",
            "software development engineer": "software engineer",
            "frontend engineer": "frontend developer",
            "front-end developer": "frontend developer",
            "ui developer": "frontend developer",
            "backend engineer": "backend developer",
            "back-end developer": "backend developer",
            "data analyst": "data scientist",
            "ml engineer": "data scientist",
            "pm": "product manager"
        }

    def get_role_data(self, target_role: str) -> Optional[dict]:
        """Look up a role directly from the static DB."""
        if not target_role:
            return None
            
        clean_role = target_role.strip().lower()
        
        # Exact match
        if clean_role in self.roles:
            return self.roles[clean_role]
            
        # Alias match
        if clean_role in self.aliases:
            return self.roles[self.aliases[clean_role]]
            
        # Partial match
        for key, value in self.roles.items():
            if key in clean_role or clean_role in key:
                return value
                
        return None

    def get_generic_role_template(self, role_name: str) -> dict:
        """Fallback template for unknown roles."""
        return {
            "title": role_name.title(),
            "category": "General Professional",
            "core_skills": ["Domain Expertise", "Problem Solving", "Adaptability"],
            "technical_skills": ["Industry Standard Tools", "Microsoft Office", "Communication Platforms"],
            "soft_skills": ["Communication", "Teamwork", "Time Management"],
            "certifications": ["Relevant Industry Certifications"],
            "salary_range": {"india": "Variable", "usa": "Variable"},
            "interview_topics": ["Past Experience", "Behavioral Questions", "Role-specific Technicals", "Cultural Fit"],
            "experience_levels": {
                "entry": "0-2 years",
                "mid": "3-5 years",
                "senior": "5+ years"
            }
        }

role_db = RoleDatabase()
