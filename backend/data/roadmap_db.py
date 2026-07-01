import random
import math
from typing import Dict, Any, List

def generate_roadmap(role_name: str, missing_skills: List[str]) -> Dict[str, Any]:
    """Generates an 8-phase AI Career Roadmap dynamically."""
    
    role = role_name.lower()
    
    # Heuristics for Role Domains
    domain = "general"
    if any(k in role for k in ["software", "developer", "backend", "frontend", "full stack"]):
        domain = "software"
    elif any(k in role for k in ["ai", "machine learning", "data", "deep learning"]):
        domain = "data_ai"
    elif any(k in role for k in ["cloud", "devops", "platform", "kubernetes", "aws", "azure"]):
        domain = "cloud_devops"
    elif any(k in role for k in ["security", "cyber", "penetration", "soc"]):
        domain = "security"

    # Salary Progression Mapping
    salary_growth = {}
    if domain == "software":
        salary_growth = {"Entry": "₹5–8 LPA", "Junior": "₹8–12 LPA", "Mid": "₹12–20 LPA", "Senior": "₹20–35 LPA", "Lead": "₹35–60 LPA"}
    elif domain == "data_ai":
        salary_growth = {"Entry": "₹8–12 LPA", "Junior": "₹12–18 LPA", "Mid": "₹18–28 LPA", "Senior": "₹28–45 LPA", "Lead": "₹45–80 LPA"}
    elif domain == "cloud_devops":
        salary_growth = {"Entry": "₹7–10 LPA", "Junior": "₹10–16 LPA", "Mid": "₹16–25 LPA", "Senior": "₹25–40 LPA", "Lead": "₹40–70 LPA"}
    elif domain == "security":
        salary_growth = {"Entry": "₹6–9 LPA", "Junior": "₹9–14 LPA", "Mid": "₹14–22 LPA", "Senior": "₹22–38 LPA", "Lead": "₹38–65 LPA"}
    else:
        salary_growth = {"Entry": "₹4–7 LPA", "Junior": "₹7–11 LPA", "Mid": "₹11–18 LPA", "Senior": "₹18–30 LPA", "Lead": "₹30–50 LPA"}

    # Dynamic Phases Generation
    phases = []
    
    # Phase 1: Foundation
    phases.append({
        "id": 1,
        "title": "Foundation",
        "description": f"Master the prerequisites and foundational concepts required for {role_name}.",
        "duration_weeks": 3,
        "topics": ["Programming Basics", "Version Control (Git)", "Command Line", "Data Structures"] if domain != "security" else ["Networking Basics", "Linux Administration", "Windows Internals"],
        "tasks": [{"name": f"Learn {topic}", "completed": False} for topic in ["Git basics", "Terminal commands", "Core algorithms"]],
        "outcome": "Able to build simple scripts and manage code effectively."
    })

    # Phase 2: Core Technologies (Driven by Missing Skills)
    core_topics = missing_skills[:5] if missing_skills else ["Core Frameworks", "Database Management", "API Design", "System Architecture"]
    
    # Build detailed core tech modules
    core_modules = []
    for skill in core_topics:
        core_modules.append({
            "skill": skill,
            "why": f"Essential industry standard for {role_name}s.",
            "difficulty": random.choice(["Medium", "Hard"]),
            "study_hours": random.randint(15, 40),
            "practice_tasks": [f"Install & Configure {skill}", f"Build a hello-world app using {skill}", f"Debug common {skill} issues"]
        })

    phases.append({
        "id": 2,
        "title": "Core Technologies",
        "description": "Deep dive into the critical tools and languages required for the role.",
        "duration_weeks": 6,
        "topics": core_topics,
        "modules": core_modules,
        "tasks": [{"name": f"Master {skill}", "completed": False} for skill in core_topics],
        "outcome": "Proficient in day-to-day technologies used in the industry."
    })

    # Phase 3: Projects
    projects = []
    if domain == "data_ai":
        projects = [
            {"name": "Resume Parser using NLP", "difficulty": "Medium", "time": "2 weeks", "skills_used": ["Python", "Spacy", "Regex"]},
            {"name": "RAG Chatbot", "difficulty": "Hard", "time": "3 weeks", "skills_used": ["LangChain", "OpenAI", "Vector DB"]},
            {"name": "Image Classifier", "difficulty": "Medium", "time": "2 weeks", "skills_used": ["PyTorch", "CNNs"]}
        ]
    elif domain == "software":
        projects = [
            {"name": "E-Commerce REST API", "difficulty": "Medium", "time": "2 weeks", "skills_used": ["Node.js/Python", "SQL", "Auth"]},
            {"name": "Real-time Chat App", "difficulty": "Hard", "time": "3 weeks", "skills_used": ["WebSockets", "React", "Redis"]},
            {"name": "Portfolio Dashboard", "difficulty": "Beginner", "time": "1 week", "skills_used": ["HTML/CSS", "React"]}
        ]
    elif domain == "cloud_devops":
        projects = [
            {"name": "Automated CI/CD Pipeline", "difficulty": "Medium", "time": "2 weeks", "skills_used": ["GitHub Actions", "Docker"]},
            {"name": "AWS 3-Tier Architecture", "difficulty": "Hard", "time": "3 weeks", "skills_used": ["Terraform", "AWS"]},
            {"name": "K8s Microservices Deploy", "difficulty": "Hard", "time": "3 weeks", "skills_used": ["Kubernetes", "Helm"]}
        ]
    else:
        projects = [
            {"name": "Network Traffic Analyzer", "difficulty": "Medium", "time": "2 weeks", "skills_used": ["Wireshark", "Python"]},
            {"name": "Vulnerability Scanner", "difficulty": "Hard", "time": "3 weeks", "skills_used": ["Nmap", "Bash"]}
        ]

    phases.append({
        "id": 3,
        "title": "Projects",
        "description": "Build real-world projects to solidify your knowledge and enhance your portfolio.",
        "duration_weeks": 8,
        "projects": projects,
        "tasks": [{"name": f"Build {p['name']}", "completed": False} for p in projects],
        "outcome": "A strong portfolio proving your technical competence."
    })

    # Phase 4: Advanced Topics
    adv_topics = []
    if domain == "data_ai": adv_topics = ["LLM Fine-tuning", "MLOps", "Transformers", "AI Agents"]
    elif domain == "software": adv_topics = ["System Design", "Microservices", "Event-Driven Architecture", "GraphQL"]
    elif domain == "cloud_devops": adv_topics = ["Service Mesh", "GitOps", "Prometheus/Grafana", "Chaos Engineering"]
    else: adv_topics = ["Zero Trust Architecture", "Reverse Engineering", "Advanced Threat Hunting"]

    phases.append({
        "id": 4,
        "title": "Advanced Topics",
        "description": "Elevate yourself from Junior to Mid-level by mastering complex concepts.",
        "duration_weeks": 4,
        "topics": adv_topics,
        "tasks": [{"name": f"Explore {t}", "completed": False} for t in adv_topics],
        "outcome": "Capable of designing scalable and resilient systems."
    })

    # Phase 5: Interview Preparation
    interview_topics = {
        "technical": ["Data Structures", "Algorithms", "Language Specific Internals"],
        "system_design": ["Scalability", "Database Sharding", "Load Balancing"] if domain in ["software", "cloud_devops"] else ["Data Pipeline Design", "Model Deployment"],
        "behavioral": ["STAR Method", "Conflict Resolution", "Leadership Scenarios"]
    }

    phases.append({
        "id": 5,
        "title": "Interview Preparation",
        "description": "Prepare specifically for technical screenings, take-home assignments, and system design rounds.",
        "duration_weeks": 2,
        "interview_topics": interview_topics,
        "tasks": [
            {"name": "Solve 50 LeetCode Easy/Medium", "completed": False},
            {"name": "Do 2 Mock Interviews", "completed": False},
            {"name": "Prepare STAR stories", "completed": False}
        ],
        "outcome": "Interview-ready with high confidence."
    })

    # Phase 6: Certifications
    certs = []
    if domain == "cloud_devops": certs = ["AWS Solutions Architect", "CKA", "Terraform Associate"]
    elif domain == "data_ai": certs = ["Google Professional ML Engineer", "AWS Machine Learning Specialty"]
    elif domain == "security": certs = ["CompTIA Security+", "CISSP", "CEH"]
    else: certs = ["Meta Front-End Developer", "AWS Cloud Practitioner"]

    phases.append({
        "id": 6,
        "title": "Certifications",
        "description": "Optional but highly recommended certifications to bypass ATS filters.",
        "duration_weeks": 4,
        "certifications": [{"name": c, "difficulty": "Medium/Hard", "study_time": "40-80 Hours", "value": "High ROI"} for c in certs],
        "tasks": [{"name": f"Pass {c}", "completed": False} for c in certs],
        "outcome": "Globally recognized validation of skills."
    })

    # Phase 7 & 8: Portfolio & Job Prep
    phases.append({
        "id": 7,
        "title": "Portfolio Development",
        "description": "Optimize your GitHub and personal website to attract recruiters.",
        "duration_weeks": 1,
        "tips": ["Pin your best 3 projects on GitHub", "Write detailed READMEs with screenshots", "Deploy all web apps live"],
        "tasks": [{"name": "Clean up GitHub", "completed": False}, {"name": "Deploy Portfolio Site", "completed": False}],
        "outcome": "A professional digital footprint."
    })

    phases.append({
        "id": 8,
        "title": "Job Preparation",
        "description": "Resume optimization, LinkedIn networking, and application strategy.",
        "duration_weeks": 2,
        "checklist": ["ATS Optimize Resume", "Update LinkedIn Headline", "Reach out to 5 recruiters weekly", "Apply to 20 jobs weekly"],
        "tasks": [{"name": "Optimize Resume", "completed": False}, {"name": "Start Applications", "completed": False}],
        "outcome": "Landing the job."
    })

    # Weekly Planner logic (Auto-generated 12 week snapshot)
    weekly_plan = []
    for w in range(1, 13):
        if w <= 3: phase = "Foundation"
        elif w <= 7: phase = "Core Tech"
        elif w <= 10: phase = "Projects"
        else: phase = "Interview Prep"
        weekly_plan.append({"week": w, "focus": phase, "tasks": [f"Deep dive topic {w}", "Complete weekly quiz", "Hands-on practice lab"]})

    # Timeline Estimation
    total_weeks = sum([p["duration_weeks"] for p in phases])
    total_months = math.ceil(total_weeks / 4)
    timeline = {
        "total_months": total_months,
        "breakdown": [{"phase": p["title"], "weeks": p["duration_weeks"]} for p in phases]
    }

    return {
        "role_name": role_name,
        "salary_growth": salary_growth,
        "phases": phases,
        "timeline": timeline,
        "weekly_plan": weekly_plan,
        "missing_skills_targeted": missing_skills
    }
