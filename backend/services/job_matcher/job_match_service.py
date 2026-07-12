import re
import hashlib
import logging
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional, Tuple
from backend.services.job_matcher.role_requirements import (
    get_role_requirements, LEVEL_ORDER, ROLE_FAMILIES, ROLE_TO_FAMILY_MAP
)

logger = logging.getLogger(__name__)

SKILL_CATEGORIES = {
    "frontend": ["react", "angular", "vue", "html", "css", "javascript", "typescript", "next.js", "tailwind", "sass"],
    "backend": ["django", "flask", "fastapi", "spring", "node.js", "express", "go", "rust", "java", "python"],
    "cloud": ["aws", "azure", "gcp", "cloud", "lambda", "ec2", "s3"],
    "devops": ["docker", "kubernetes", "terraform", "jenkins", "ci/cd", "ansible", "prometheus", "grafana"],
    "database": ["sql", "mysql", "postgresql", "mongodb", "redis", "elasticsearch", "cassandra"],
    "ai_ml": ["machine learning", "deep learning", "tensorflow", "pytorch", "nlp", "computer vision", "llm"],
    "mobile": ["android", "ios", "kotlin", "swift", "flutter", "react native"],
    "security": ["network security", "encryption", "firewall", "penetration testing", "iam", "siem"],
    "testing": ["selenium", "cypress", "playwright", "junit", "pytest", "jest", "test automation"],
    "data": ["sql", "python", "pandas", "numpy", "tableau", "power bi", "excel", "statistics"],
    "design": ["figma", "sketch", "adobe xd", "photoshop", "illustrator", "user research", "prototyping"],
    "product": ["product management", "agile", "scrum", "roadmap", "user research", "a/b testing"],
    "soft_skills": ["leadership", "communication", "collaboration", "problem solving", "teamwork", "mentoring"],
}

PROGRAMMING_LANGUAGES = [
    "python", "java", "javascript", "typescript", "c++", "c#", "go", "rust",
    "kotlin", "swift", "ruby", "php", "scala", "r", "dart", "bash", "shell"
]

FRAMEWORKS = [
    "react", "angular", "vue", "django", "flask", "fastapi", "spring", "node.js",
    "express", "next.js", "tensorflow", "pytorch", "selenium", "junit", "pytest"
]

CLOUD_PLATFORMS = ["aws", "azure", "gcp", "oracle cloud", "ibm cloud", "digitalocean"]

DATABASES = ["mysql", "postgresql", "mongodb", "redis", "elasticsearch", "cassandra", "dynamodb", "sqlite"]

DEVOPS_TOOLS = ["docker", "kubernetes", "jenkins", "terraform", "ansible", "prometheus", "grafana", "gitlab ci"]

LEARNING_RESOURCES_MAP = {
    "docker": {"courses": ["Docker Mastery on Udemy", "Docker & Kubernetes: The Practical Guide"], "docs": ["docs.docker.com"], "projects": ["Containerize a web app with Docker"]},
    "kubernetes": {"courses": ["CKA Certification Course on Udemy", "Kubernetes for Developers"], "docs": ["kubernetes.io/docs"], "projects": ["Deploy a microservice on K8s cluster"]},
    "aws": {"courses": ["AWS Solutions Architect on Coursera", "AWS Certified Developer on A Cloud Guru"], "docs": ["aws.amazon.com/documentation"], "projects": ["Deploy serverless app on AWS Lambda"]},
    "gcp": {"courses": ["Google Cloud Engineer on Coursera", "GCP Data Engineer"], "docs": ["cloud.google.com/docs"], "projects": ["Build a data pipeline on GCP"]},
    "azure": {"courses": ["Azure Fundamentals on Microsoft Learn", "Azure Developer Associate"], "docs": ["docs.microsoft.com/azure"], "projects": ["Migrate an app to Azure"]},
    "terraform": {"courses": ["Terraform Beginner to Pro on Udemy", "HashiCorp Learn"], "docs": ["developer.hashicorp.com/terraform"], "projects": ["Provision multi-cloud infra with Terraform"]},
    "react": {"courses": ["React 18 Complete Guide on Udemy", "Epic React by Kent C. Dodds"], "docs": ["react.dev"], "projects": ["Build a full-stack dashboard with React"]},
    "python": {"courses": ["Python for Everybody on Coursera", "Python Crash Course book"], "docs": ["docs.python.org"], "projects": ["Build a REST API with FastAPI"]},
    "sql": {"courses": ["SQL for Data Analysis on Coursera", "Mode Analytics SQL Tutorial"], "docs": ["w3schools.com/sql"], "projects": ["Design and normalize a database schema"]},
    "typescript": {"courses": ["TypeScript Handbook", "Understanding TypeScript on Udemy"], "docs": ["typescriptlang.org/docs"], "projects": ["Convert a JS project to TypeScript"]},
    "redis": {"courses": ["Redis University", "Redis for Developers on Udemy"], "docs": ["redis.io/documentation"], "projects": ["Implement caching layer with Redis"]},
    "kafka": {"courses": ["Apache Kafka on Coursera", "Kafka for Beginners on Udemy"], "docs": ["kafka.apache.org/documentation"], "projects": ["Build a real-time data pipeline with Kafka"]},
    "ci/cd": {"courses": ["Jenkins CI/CD on Coursera", "GitLab CI/CD Course"], "docs": ["docs.gitlab.com/ci"], "projects": ["Set up a CI/CD pipeline for a web app"]},
    "machine learning": {"courses": ["Andrew Ng ML Course on Coursera", "Fast.ai Practical Deep Learning"], "docs": ["scikit-learn.org", "tensorflow.org"], "projects": ["Build an end-to-end ML pipeline"]},
}


def extract_resume_features(resume_data: Dict[str, Any], resume_text: str) -> Dict[str, Any]:
    text_lower = resume_text.lower()
    raw_skills = [str(s).lower() for s in (resume_data.get("skills") or [])]
    skill_text = " ".join(raw_skills)

    technical_skills = set()
    programming_languages = set()
    frameworks = set()
    cloud_platforms = set()
    databases = set()
    devops_tools = set()
    soft_skills = set()

    for s in raw_skills + text_lower.split():
        s_lower = s.strip().lower()
        if not s_lower or len(s_lower) < 2:
            continue
        for lang in PROGRAMMING_LANGUAGES:
            if lang in s_lower:
                programming_languages.add(lang.capitalize())
                technical_skills.add(lang.capitalize())
        for fw in FRAMEWORKS:
            if fw in s_lower:
                frameworks.add(fw.capitalize())
                technical_skills.add(fw.capitalize())
        for cp in CLOUD_PLATFORMS:
            if cp in s_lower:
                cloud_platforms.add(cp.upper() if cp in ["aws", "gcp"] else cp.capitalize())
                technical_skills.add(cp.upper() if cp in ["aws", "gcp"] else cp.capitalize())
        for db in DATABASES:
            if db in s_lower:
                databases.add(db.capitalize())
                technical_skills.add(db.capitalize())
        for dt in DEVOPS_TOOLS:
            if dt in s_lower:
                devops_tools.add(dt.upper() if dt in ["ci/cd"] else dt.capitalize())
                technical_skills.add(dt.upper() if dt in ["ci/cd"] else dt.capitalize())
        for ss in ["leadership", "communication", "problem solving", "teamwork", "collaboration", "mentoring", "agile", "scrum"]:
            if ss in s_lower:
                soft_skills.add(ss.capitalize() if ss != "problem solving" else "Problem Solving")

    experience_list = resume_data.get("experience_details") or resume_data.get("experience") or []
    projects_list = resume_data.get("projects") or []
    education_list = resume_data.get("education") or []
    job_titles = resume_data.get("job_titles") or []

    exp_years = float(resume_data.get("experience") or 0)
    if exp_years <= 0 and experience_list:
        date_pattern = re.compile(r'(\d{4})\s*[-to]+\s*(\d{4}|present|current)', re.IGNORECASE)
        year_range_total = 0
        for exp in experience_list:
            matches = date_pattern.findall(str(exp))
            for start_str, end_str in matches:
                try:
                    start = int(start_str)
                    if end_str.lower() in ("present", "current"):
                        end = datetime.now().year
                    else:
                        end = int(end_str)
                    year_range_total += max(0, end - start)
                except ValueError:
                    pass
        if year_range_total > 0:
            exp_years = year_range_total

    cert_keywords = ["certified", "certification", "aws certified", "google certified", "microsoft certified",
                     "pmp", "scrum master", "cissp", "ceh", "cka", "comptia"]
    certifications = [c for c in raw_skills if any(k in c.lower() for k in cert_keywords)]
    for kw in cert_keywords:
        if kw in text_lower:
            certifications.append(kw.capitalize())

    has_github = bool(re.search(r'github\.com', resume_text, re.IGNORECASE))
    has_portfolio = bool(re.search(r'portfolio|behance\.net|dribbble\.com', resume_text, re.IGNORECASE))
    has_linkedin = bool(re.search(r'linkedin\.com', resume_text, re.IGNORECASE))
    has_quantified = bool(re.search(r'\b\d+\s*%|\b\d+\s*x\b|\b\d+\s*(million|k|cr|lpa|users|requests|ms|seconds)\b', resume_text, re.IGNORECASE))

    return {
        "technical_skills": sorted(technical_skills) if technical_skills else raw_skills,
        "programming_languages": sorted(programming_languages),
        "frameworks": sorted(frameworks),
        "cloud_platforms": sorted(cloud_platforms),
        "databases": sorted(databases),
        "devops_tools": sorted(devops_tools),
        "soft_skills": sorted(soft_skills),
        "certifications": sorted(set(certifications)),
        "experience_years": round(exp_years, 1),
        "experience_list": experience_list,
        "projects": projects_list,
        "education": education_list,
        "job_titles": job_titles,
        "has_github": has_github,
        "has_portfolio": has_portfolio,
        "has_linkedin": has_linkedin,
        "has_quantified": has_quantified,
        "word_count": len(resume_text.split()),
    }


def detect_level(features: Dict[str, Any]) -> str:
    exp = features["experience_years"]
    titles_lower = " ".join(t.lower() for t in features["job_titles"])
    if exp >= 8 or any(k in titles_lower for k in ["principal", "director", "head", "vp", "chief"]):
        return "Lead"
    if exp >= 5 or any(k in titles_lower for k in ["senior", "lead", "staff"]):
        return "Senior"
    if exp >= 3 or any(k in titles_lower for k in ["mid", "intermediate"]):
        return "Mid"
    if exp >= 1 or any(k in titles_lower for k in ["junior", "associate", "intern"]):
        return "Junior"
    return "Entry"


def detect_role(features: Dict[str, Any], target_role: Optional[str] = None) -> str:
    if target_role:
        return target_role
    skill_text = " ".join(s.lower() for s in features["technical_skills"])
    titles_text = " ".join(t.lower() for t in features["job_titles"])
    combined = skill_text + " " + titles_text

    if any(k in combined for k in ["machine learning", "tensorflow", "pytorch", "deep learning", "ai", "llm", "nlp"]):
        if any(k in combined for k in ["data science", "data scientist"]):
            return "Data Scientist"
        return "AI Engineer"
    if any(k in combined for k in ["docker", "kubernetes", "devops", "terraform", "ci/cd", "jenkins", "sre"]):
        return "DevOps Engineer"
    if any(k in combined for k in ["aws", "azure", "gcp", "cloud engineer", "cloud architect"]):
        return "Cloud Engineer"
    if any(k in combined for k in ["react", "angular", "vue", "frontend", "html", "css", "ui"]):
        return "Frontend Developer"
    if any(k in combined for k in ["django", "flask", "fastapi", "spring", "backend", "node.js", "express"]):
        return "Backend Developer"
    if any(k in combined for k in ["android", "ios", "kotlin", "swift", "mobile"]):
        return "Mobile Developer"
    if any(k in combined for k in ["figma", "sketch", "ui/ux", "design", "user research", "prototyping"]):
        return "UI/UX Designer"
    if any(k in combined for k in ["sql", "tableau", "power bi", "data analysis", "analytics", "data analyst"]):
        return "Data Analyst"
    if any(k in combined for k in ["product manager", "product management", "roadmap", "stakeholder"]):
        return "Product Manager"
    if any(k in combined for k in ["security", "cybersecurity", "penetration", "firewall", "cissp"]):
        return "Cybersecurity Analyst"
    if any(k in combined for k in ["qa", "testing", "selenium", "automation test", "quality assurance"]):
        return "QA Engineer"
    if any(k in combined for k in ["blockchain", "solidity", "web3", "smart contract"]):
        return "Blockchain Developer"
    if any(k in combined for k in ["full stack", "fullstack", "next.js"]):
        return "Full Stack Developer"
    if any(k in combined for k in ["python"]):
        return "Python Developer"
    if any(k in combined for k in ["java"]):
        return "Java Developer"
    return "Software Developer"


def _normalize_skill(name: str) -> str:
    return name.lower().strip().replace(".", "").replace("#", "")


def _fuzzy_match(skill: str, candidates: List[str]) -> bool:
    ns = _normalize_skill(skill)
    for c in candidates:
        nc = _normalize_skill(c)
        if ns == nc or ns in nc or nc in ns:
            return True
    return False


def generate_gap_analysis(features: Dict[str, Any], requirements: Dict[str, Any]) -> Dict[str, Any]:
    resume_skills_text = " ".join(s.lower() for s in features["technical_skills"])
    resume_all_text = resume_skills_text + " " + features.get("experience_text", "").lower()

    required = requirements.get("required_skills", [])
    preferred = requirements.get("preferred_skills", [])
    soft_req = requirements.get("soft_skills", [])
    certs = requirements.get("certifications", [])

    missing_mandatory = []
    for skill in required:
        if not _fuzzy_match(skill, features["technical_skills"]):
            missing_mandatory.append(skill)

    missing_preferred = []
    for skill in preferred:
        if not _fuzzy_match(skill, features["technical_skills"]):
            missing_preferred.append(skill)

    missing_certs = []
    for cert in certs:
        cert_lower = cert.lower()
        if cert_lower not in resume_all_text and not any(cert_lower in str(c).lower() for c in features["certifications"]):
            if not any(cert_lower.split()[0] in str(c).lower() for c in features["certifications"]):
                missing_certs.append(cert)

    missing_soft = []
    for skill in soft_req:
        if not _fuzzy_match(skill, features["soft_skills"]):
            missing_soft.append(skill)

    exp_required = requirements.get("experience_required", 0)
    exp_gap = max(0, exp_required - features["experience_years"])

    edu_gap = None
    if not features["education"]:
        edu_gap = "No degree information found"
    elif exp_required >= 5 and not any("bachelor" in str(e).lower() or "b.tech" in str(e).lower() for e in features["education"]):
        edu_gap = "Bachelor's degree expected at this level"

    all_gaps = []
    gap_id = 0
    for skill in missing_mandatory:
        category = "Technical"
        if skill in ["docker", "kubernetes", "terraform", "ci/cd", "jenkins"]:
            category = "DevOps"
        elif skill in ["aws", "azure", "gcp"]:
            category = "Cloud Platform"
        elif skill in ["python", "java", "javascript", "typescript"]:
            category = "Programming Language"
        elif skill in ["react", "angular", "vue", "django", "flask"]:
            category = "Framework"
        elif skill in ["sql", "mysql", "postgresql", "mongodb", "redis"]:
            category = "Database"
        gain = max(4, min(12, 10 - gap_id))
        all_gaps.append({
            "id": f"gap_{gap_id}",
            "skill": skill,
            "category": category,
            "priority": "Critical" if gap_id < 2 else ("High" if gap_id < 5 else "Medium"),
            "type": "mandatory",
            "reason": f"Required for {requirements['role_name']} — mentioned in most job descriptions for this role",
            "impact": f"Improves ATS score and increases interview call rate",
            "estimated_score_gain": gain,
        })
        gap_id += 1

    for skill in missing_preferred:
        gain = max(2, min(8, 8 - gap_id % 5))
        all_gaps.append({
            "id": f"gap_{gap_id}",
            "skill": skill,
            "category": "Technical",
            "priority": "High" if gap_id < 4 else ("Medium" if gap_id < 8 else "Low"),
            "type": "preferred",
            "reason": f"Preferred skill for {requirements['role_name']} — adds competitive advantage",
            "impact": "Differentiates you from other candidates",
            "estimated_score_gain": gain,
        })
        gap_id += 1

    for cert in missing_certs:
        gain = max(3, min(7, 6 - gap_id % 4))
        all_gaps.append({
            "id": f"gap_{gap_id}",
            "skill": cert,
            "category": "Certification",
            "priority": "Medium",
            "type": "certification",
            "reason": f"Certification valued in {requirements['industry']} for {requirements['role_name']} roles",
            "impact": "Validates expertise and increases shortlist probability",
            "estimated_score_gain": gain,
        })
        gap_id += 1

    for skill in missing_soft:
        all_gaps.append({
            "id": f"gap_{gap_id}",
            "skill": skill,
            "category": "Soft Skill",
            "priority": "Medium",
            "type": "soft_skill",
            "reason": f"{skill} is important for career growth and team effectiveness",
            "impact": "Improves team fit and leadership perception",
            "estimated_score_gain": 3,
        })
        gap_id += 1

    if exp_gap > 0:
        all_gaps.append({
            "id": f"gap_{gap_id}",
            "skill": f"{exp_gap}+ years of experience",
            "category": "Experience",
            "priority": "Critical" if exp_gap > 3 else ("High" if exp_gap > 1 else "Medium"),
            "type": "experience",
            "reason": f"{requirements['role_name']} typically requires {exp_required} years; resume shows {features['experience_years']}",
            "impact": "Closing experience gap significantly improves hiring probability",
            "estimated_score_gain": min(15, 5 + int(exp_gap * 3)),
        })
        gap_id += 1

    if edu_gap:
        all_gaps.append({
            "id": f"gap_{gap_id}",
            "skill": edu_gap,
            "category": "Education",
            "priority": "Low",
            "type": "education",
            "reason": f"Education requirements for {requirements['role_name']} based on industry standards",
            "impact": "Completing education requirements removes ATS filter risk",
            "estimated_score_gain": 4,
        })

    all_gaps.sort(key=lambda g: ["Critical", "High", "Medium", "Low"].index(g["priority"]))

    summary = {
        "total_gaps": len(all_gaps),
        "critical_count": sum(1 for g in all_gaps if g["priority"] == "Critical"),
        "high_count": sum(1 for g in all_gaps if g["priority"] == "High"),
        "medium_count": sum(1 for g in all_gaps if g["priority"] == "Medium"),
        "low_count": sum(1 for g in all_gaps if g["priority"] == "Low"),
        "estimated_total_gain": sum(g["estimated_score_gain"] for g in all_gaps),
    }

    return {
        "gaps": all_gaps,
        "summary": summary,
        "missing_mandatory_skills": missing_mandatory,
        "missing_preferred_skills": missing_preferred,
        "missing_certifications": missing_certs,
        "missing_soft_skills": missing_soft,
        "experience_gap_years": exp_gap,
        "education_gap": edu_gap,
    }


def generate_market_intelligence(role_name: str, level: str, features: Dict[str, Any], requirements: Dict[str, Any]) -> Dict[str, Any]:
    salary = requirements.get("salary_range", {"india": "₹10–20 LPA", "usa": "$90k–$140k", "remote": "$75k–$110k"})
    demand = requirements.get("demand_level", "High")
    companies = list(requirements.get("top_companies", []))
    trending = list(requirements.get("trending_skills", []))
    outlook = requirements.get("career_outlook", "Positive")
    promotion = requirements.get("promotion_potential", "Moderate")
    competition = requirements.get("competition", "Moderate")
    industry = requirements.get("industry", "Technology")

    current_level_idx = LEVEL_ORDER.index(level) if level in LEVEL_ORDER else 2
    next_level = LEVEL_ORDER[current_level_idx + 1] if current_level_idx < len(LEVEL_ORDER) - 1 else None
    next_level_salary = None
    if next_level:
        next_family = ROLE_FAMILIES.get(ROLE_TO_FAMILY_MAP.get(role_name.lower(), "fullstack"), ROLE_FAMILIES["fullstack"])
        next_level_salary = next_family["salary_range"].get(next_level, {})

    skill_count = len(features["technical_skills"])
    exp_years = features["experience_years"]
    word_count = features["word_count"]
    has_github = features["has_github"]
    has_portfolio = features["has_portfolio"]
    has_linkedin = features["has_linkedin"]
    projects_count = len(features["projects"])

    open_positions = {
        "Entry": "50,000+", "Junior": "150,000+", "Mid": "250,000+",
        "Senior": "180,000+", "Lead": "80,000+"
    }.get(level, "150,000+")

    growth_rate = {
        "frontend developer": "8%", "backend developer": "10%", "full stack developer": "12%",
        "data scientist": "15%", "machine learning engineer": "18%", "ai engineer": "20%",
        "devops engineer": "14%", "cloud engineer": "13%", "cybersecurity analyst": "16%",
        "mobile developer": "6%", "qa engineer": "4%", "ui/ux designer": "7%",
        "data analyst": "11%", "product manager": "9%", "system administrator": "3%",
    }.get(role_name.lower(), "8%")

    competitiveness = {"Entry": 70, "Junior": 65, "Mid": 50, "Senior": 35, "Lead": 25}.get(level, 50)
    salary_satisfaction = 65 if skill_count >= 8 else (50 if skill_count >= 4 else 35)

    return {
        "salary": salary,
        "next_level_salary": next_level_salary,
        "next_level": next_level,
        "demand": demand,
        "hiring_demand": demand,
        "open_positions": open_positions,
        "growth_rate": growth_rate,
        "top_companies": companies,
        "trending_skills": trending,
        "industry": industry,
        "career_outlook": outlook,
        "promotion_potential": promotion,
        "competition_level": competition,
        "competitiveness_index": competitiveness,
        "salary_satisfaction_index": salary_satisfaction,
        "market_insights": [
            f"There are {open_positions} open {role_name} positions in the current market.",
            f"The role has a {demand.lower()} demand level with a {growth_rate} annual growth rate.",
            f"Key trending skills include {', '.join(trending[:4])}.",
            f"Top hiring companies: {', '.join(companies[:5])}.",
            f"{outlook}",
        ],
    }


def generate_learning_plan(gap_analysis: Dict[str, Any], features: Dict[str, Any], role_name: str, level: str) -> Dict[str, Any]:
    all_gaps = gap_analysis.get("gaps", [])
    priorities = {"Critical": 0, "High": 1, "Medium": 2, "Low": 3}
    sorted_gaps = sorted(all_gaps, key=lambda g: priorities.get(g.get("priority", "Low"), 99))

    targeted_gaps = [g for g in sorted_gaps if g.get("type") in ("mandatory", "preferred", "certification", "experience")]

    phases = {
        "30_days": {"label": "Next 30 Days", "weeks": [1, 2, 3, 4], "focus": "Critical gaps — highest impact first", "tasks": []},
        "60_days": {"label": "30–60 Days", "weeks": [5, 6, 7, 8], "focus": "High-priority skills — build depth", "tasks": []},
        "90_days": {"label": "60–90 Days", "weeks": [9, 10, 11, 12], "focus": "Preferred skills & certifications — rounding out profile", "tasks": []},
    }

    difficulty_map = {0: "Beginner", 1: "Beginner", 2: "Easy", 3: "Easy", 4: "Medium", 5: "Medium", 6: "Hard", 7: "Hard", 8: "Expert", 9: "Expert", 10: "Expert"}
    hours_map = {"Beginner": 4, "Easy": 6, "Medium": 8, "Hard": 12, "Expert": 16}

    week_counter = 1
    phase_order = ["30_days", "60_days", "90_days"]

    for idx, gap in enumerate(targeted_gaps[:12]):
        phase_key = phase_order[0] if idx < 4 else (phase_order[1] if idx < 8 else phase_order[2])
        phase = phases[phase_key]

        skill = gap.get("skill", "")
        priority = gap.get("priority", "Medium")
        category = gap.get("category", "Technical")

        week = phase["weeks"][idx % 4] if idx < 12 else week_counter
        if phase_key == "30_days":
            actual_week = week
        elif phase_key == "60_days":
            actual_week = week + 4
        else:
            actual_week = week + 8

        diff_idx = min(idx, 9)
        difficulty = difficulty_map.get(diff_idx, "Medium")
        hours = hours_map.get(difficulty, 6)
        gain = gap.get("estimated_score_gain", 5)

        resources = _get_learning_resources(skill)

        phase["tasks"].append({
            "id": f"task_{phase_key}_{idx}",
            "week": actual_week,
            "phase": phase_key,
            "skill": skill,
            "category": category,
            "task": f"Learn {skill}",
            "description": f"Master {skill} through structured learning and hands-on practice",
            "hours": hours,
            "difficulty": difficulty,
            "priority": priority,
            "type": gap.get("type", "technical"),
            "resources": resources,
            "impact": f"+{gain} ATS Score",
            "estimated_score_gain": gain,
            "completion_criteria": f"Build a project using {skill} and add it to your resume",
        })

    for phase in phases.values():
        if not phase["tasks"]:
            phase["tasks"].append({
                "id": f"task_{phase['label'].replace(' ', '_').lower()}_bonus",
                "week": phase["weeks"][0],
                "phase": phase_key,
                "skill": "Review & Refine",
                "category": "General",
                "task": "Review and refine existing resume content",
                "description": "Polish existing projects, add metrics, and improve bullet points",
                "hours": 4,
                "difficulty": "Easy",
                "priority": "Medium",
                "type": "improvement",
                "resources": ["resumeworded.com", "jobscan.co", "canva.com/resumes"],
                "impact": "+3 ATS Score",
                "estimated_score_gain": 3,
                "completion_criteria": "Updated resume with quantified achievements",
            })

    total_hours = sum(t["hours"] for phase in phases.values() for t in phase["tasks"])
    total_score_gain = sum(t["estimated_score_gain"] for phase in phases.values() for t in phase["tasks"])

    return {
        "phases": phases,
        "total_weeks": 12,
        "total_hours": total_hours,
        "total_estimated_score_gain": total_score_gain,
        "daily_commitment": round(total_hours / 90, 1),
        "weekly_commitment": round(total_hours / 12, 1),
        "generated_for": {
            "role": role_name,
            "level": level,
            "gaps_analyzed": len(targeted_gaps),
        },
    }


def _get_learning_resources(skill: str) -> List[Dict[str, str]]:
    skill_lower = skill.lower().strip()
    for key, resources in LEARNING_RESOURCES_MAP.items():
        if key in skill_lower or skill_lower in key:
            result = []
            for course in resources.get("courses", [])[:2]:
                result.append({"type": "course", "title": course})
            for doc in resources.get("docs", [])[:2]:
                result.append({"type": "documentation", "title": f"Official {skill} Documentation", "url": doc})
            for proj in resources.get("projects", [])[:1]:
                result.append({"type": "project", "title": proj})
            return result

    return [
        {"type": "course", "title": f"Learn {skill} on Coursera or Udemy"},
        {"type": "documentation", "title": f"Official {skill} Documentation", "url": f"https://{skill_lower.replace(' ', '')}.org/docs"},
        {"type": "project", "title": f"Build a project with {skill}"},
    ]


def calculate_score_improvement(current_score: Optional[int], gap_analysis: Dict[str, Any]) -> Dict[str, Any]:
    total_gain = gap_analysis.get("summary", {}).get("estimated_total_gain", 0)
    current = current_score or 65
    potential = min(100, current + total_gain)

    return {
        "current_score": current,
        "potential_score": potential,
        "total_gain": total_gain,
        "gap_percentage": round((current / 100) * 100, 1),
        "improvement_percentage": round(((potential - current) / current) * 100 if current > 0 else 0, 1),
    }


def build_enhanced_response(
    resume_data: Dict[str, Any],
    resume_text: str,
    target_role: Optional[str],
    job_description: Optional[str],
    existing_report: Dict[str, Any]
) -> Dict[str, Any]:
    features = extract_resume_features(resume_data, resume_text)
    level = detect_level(features)
    role = detect_role(features, target_role)
    requirements = get_role_requirements(role, level)

    gap_analysis = generate_gap_analysis(features, requirements)
    market_intel = generate_market_intelligence(role, level, features, requirements)
    learning_plan = generate_learning_plan(gap_analysis, features, role, level)

    scores = existing_report.get("scores", {})
    current_score = scores.get("overall_score") if isinstance(scores, dict) else None
    score_improvement = calculate_score_improvement(current_score, gap_analysis)

    role_info = {
        "detected_role": role,
        "detected_level": level,
        "requirements": {
            "required_skills": requirements["required_skills"],
            "preferred_skills": requirements["preferred_skills"],
            "soft_skills": requirements["soft_skills"],
            "certifications": requirements["certifications"],
            "experience_required": requirements["experience_required"],
            "industry": requirements["industry"],
        },
        "resume_summary": {
            "technical_skills_count": len(features["technical_skills"]),
            "experience_years": features["experience_years"],
            "projects_count": len(features["projects"]),
            "education_count": len(features["education"]),
            "has_github": features["has_github"],
            "has_portfolio": features["has_portfolio"],
            "has_linkedin": features["has_linkedin"],
        },
    }

    return {
        "critical_gaps": gap_analysis,
        "market_intelligence": market_intel,
        "priority_learning_plan": learning_plan,
        "role_info": role_info,
        "score_improvement": score_improvement,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }
