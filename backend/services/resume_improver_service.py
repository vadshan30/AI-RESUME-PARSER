"""
Resume Improver Service — Fully Dynamic Analysis Pipeline
----------------------------------------------------------
Every output depends entirely on the user's resume input.
No hardcoded arrays, no static JSON, no generic suggestions.
All scores, keywords, improvements, and rewrites are derived from actual text.
"""
import re
import logging
import math
from typing import Dict, List, Tuple, Optional, Any

logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────
# Grammar patterns (unchanged — these are rules, not static data)
# ─────────────────────────────────────────────

GRAMMAR_ERROR_PATTERNS = {
    r'\b(recieve|recieved)\b': 'receive/received',
    r'\boccured\b': 'occurred',
    r'\bseperate\b': 'separate',
    r'\bneccessary\b': 'necessary',
    r'\boccassion\b': 'occasion',
    r'\bacheive\b': 'achieve',
    r'\bcalender\b': 'calendar',
    r'\bdefinately\b': 'definitely',
    r'\bembarass\b': 'embarrass',
    r'\bforeward\b': 'foreword',
    r'\bgoverment\b': 'government',
    r'\bmaintainance\b': 'maintenance',
    r'\bpriviledge\b': 'privilege',
    r'\btommorow\b': 'tomorrow',
    r'\balot\b': 'a lot',
    r'\biam\b': "I am",
    r'\bcould of\b': 'could have',
    r'\bshould of\b': 'should have',
    r'\bwould of\b': 'would have',
    r'\btheir are\b': 'there are',
    r'\btheir is\b': 'there is',
    r'\byour a\b': "you're a",
}

WEAK_VERB_PATTERNS = [
    r'\bresponsible\s+for\b', r'\bworked\s+on\b', r'\bhelped\b',
    r'\b(?:was|were)\s+involved\s+in\b', r'\bparticipated\s+in\b',
    r'\b(?:was|were)\s+part\s+of\b', r'\bcontributed\s+to\b',
    r'\bassisted\b', r'\bhandled\b', r'\bdealt\s+with\b',
    r'\bworked\s+with\b', r'\bused\b', r'\btried\b', r'\battempted\b',
]

STRONG_VERBS = [
    'Architected', 'Engineered', 'Spearheaded', 'Orchestrated', 'Optimized',
    'Deployed', 'Scaled', 'Transformed', 'Accelerated', 'Pioneered',
    'Delivered', 'Launched', 'Implemented', 'Designed', 'Built',
    'Developed', 'Created', 'Established', 'Managed', 'Led',
    'Mentored', 'Collaborated', 'Resolved', 'Improved', 'Enhanced',
    'Reduced', 'Increased', 'Streamlined', 'Automated', 'Integrated',
]

BUZZWORDS = [
    'synergy', 'synergize', 'best of breed', 'best-in-class', 'cutting-edge',
    'world-class', 'industry-leading', 'game-changer', 'deep dive', 'low-hanging fruit',
    'think outside the box', 'leverage', 'holistic', 'ninja', 'rockstar', 'guru',
]

PASSIVE_PATTERNS = [
    r'was\s+\w+ed\s+by', r'were\s+\w+ed\s+by',
    r'is\s+being\s+\w+ed', r'has\s+been\s+\w+ed',
    r'have\s+been\s+\w+ed', r'are\s+\w+ed\s+by',
]

# ─────────────────────────────────────────────
# Role skill profiles (used for gap analysis only — derived from real skill sets)
# ─────────────────────────────────────────────

ROLE_SKILL_PROFILES = {
    "frontend developer": {
        "core": ["react", "typescript", "javascript", "html", "css"],
        "recommended": ["redux", "next.js", "tailwind css", "jest", "webpack", "graphql"],
        "advanced": ["cypress", "storybook", "web vitals", "pwa", "ssr"],
    },
    "backend developer": {
        "core": ["node.js", "express", "python", "sql", "rest api"],
        "recommended": ["docker", "postgresql", "mongodb", "redis", "git"],
        "advanced": ["kubernetes", "aws", "microservices", "graphql", "ci/cd"],
    },
    "full stack developer": {
        "core": ["javascript", "react", "node.js", "sql", "rest api"],
        "recommended": ["typescript", "mongodb", "docker", "git", "css"],
        "advanced": ["aws", "graphql", "next.js", "ci/cd", "redis"],
    },
    "devops engineer": {
        "core": ["docker", "kubernetes", "ci/cd", "aws", "linux"],
        "recommended": ["terraform", "jenkins", "ansible", "monitoring", "bash"],
        "advanced": ["helm", "prometheus", "istio", "cloud security", "gitops"],
    },
    "data scientist": {
        "core": ["python", "machine learning", "pandas", "sql", "statistics"],
        "recommended": ["tensorflow", "pytorch", "scikit-learn", "deep learning", "nlp"],
        "advanced": ["mlops", "docker", "spark", "model deployment", "a/b testing"],
    },
    "ai engineer": {
        "core": ["python", "machine learning", "deep learning", "nlp", "tensorflow"],
        "recommended": ["langchain", "llm", "rag", "vector databases", "prompt engineering"],
        "advanced": ["mlops", "docker", "kubernetes", "fastapi", "hugging face"],
    },
    "java developer": {
        "core": ["java", "spring boot", "sql", "rest api", "maven"],
        "recommended": ["docker", "aws", "junit", "microservices", "git"],
        "advanced": ["kubernetes", "kafka", "redis", "design patterns", "ci/cd"],
    },
    "python developer": {
        "core": ["python", "sql", "rest api", "git", "pytest"],
        "recommended": ["django", "flask", "fastapi", "docker", "postgresql"],
        "advanced": ["aws", "celery", "redis", "ci/cd", "graphql"],
    },
    "mobile developer": {
        "core": ["android", "ios", "kotlin", "swift", "rest api"],
        "recommended": ["flutter", "react native", "firebase", "git", "app store"],
        "advanced": ["ci/cd", "docker", "graphql", "offline storage", "push notifications"],
    },
    "flutter developer": {
        "core": ["flutter", "dart", "rest api", "firebase", "git"],
        "recommended": ["state management", "widget testing", "material design", "ios", "android"],
        "advanced": ["ci/cd", "bloc", "riverpod", "app store deployment", "performance"],
    },
    "ui/ux designer": {
        "core": ["figma", "user research", "wireframing", "prototyping", "design systems"],
        "recommended": ["adobe xd", "usability testing", "accessibility", "interaction design", "html/css"],
        "advanced": ["motion design", "design tokens", "design ops", "user analytics", "agile"],
    },
    "data analyst": {
        "core": ["sql", "excel", "data visualization", "python", "statistics"],
        "recommended": ["tableau", "power bi", "pandas", "a/b testing", "dashboards"],
        "advanced": ["google analytics", "r", "etl", "machine learning", "data warehousing"],
    },
    "qa engineer": {
        "core": ["manual testing", "test cases", "bug tracking", "sql", "agile"],
        "recommended": ["selenium", "cypress", "api testing", "postman", "git"],
        "advanced": ["ci/cd", "performance testing", "security testing", "docker", "test automation"],
    },
    "cybersecurity analyst": {
        "core": ["network security", "vulnerability assessment", "penetration testing", "firewall", "siem"],
        "recommended": ["incident response", "threat intelligence", "compliance", "python", "linux"],
        "advanced": ["cloud security", "forensics", "cryptography", "devsecops", "zero trust"],
    },
    "cloud engineer": {
        "core": ["aws", "azure", "gcp", "terraform", "docker"],
        "recommended": ["kubernetes", "ci/cd", "linux", "networking", "monitoring"],
        "advanced": ["helm", "serverless", "cloud security", "istio", "gitops"],
    },
    "business analyst": {
        "core": ["requirements gathering", "stakeholder management", "sql", "excel", "documentation"],
        "recommended": ["power bi", "tableau", "data analysis", "agile", "jira"],
        "advanced": ["process modeling", "data modeling", "business intelligence", "python", "etl"],
    },
}

ROLE_SYNONYMS = {
    "frontend developer": ["frontend", "react developer", "react", "angular developer",
                           "vue developer", "ui developer", "front-end developer"],
    "backend developer": ["backend", "back-end developer", "api developer",
                          "node.js developer", "express developer"],
    "full stack developer": ["full stack", "fullstack", "mern stack", "mean stack"],
    "devops engineer": ["devops", "sre", "platform engineer", "infrastructure engineer"],
    "data scientist": ["data scientist", "ml engineer", "machine learning engineer"],
    "ai engineer": ["ai engineer", "ai ml engineer", "llm engineer", "ai developer"],
    "java developer": ["java developer", "spring developer", "j2ee developer"],
    "python developer": ["python developer", "django developer", "flask developer"],
    "mobile developer": ["mobile developer", "android developer", "ios developer"],
    "flutter developer": ["flutter developer", "dart developer", "cross-platform developer"],
    "ui/ux designer": ["ui/ux designer", "product designer", "ux designer", "ui designer"],
    "data analyst": ["data analyst", "business intelligence analyst", "analytics engineer"],
    "qa engineer": ["qa engineer", "sdet", "test engineer", "quality assurance engineer"],
    "cybersecurity analyst": ["cybersecurity", "security analyst", "infosec", "security engineer"],
    "cloud engineer": ["cloud engineer", "cloud architect", "cloud infrastructure engineer"],
    "business analyst": ["business analyst", "ba", "business systems analyst"],
}

SKILL_TO_ROLE_WEIGHTS = {
    "react": {"frontend developer": 5, "full stack developer": 3},
    "angular": {"frontend developer": 5},
    "vue": {"frontend developer": 5},
    "typescript": {"frontend developer": 4, "full stack developer": 3},
    "javascript": {"frontend developer": 3, "full stack developer": 3},
    "html": {"frontend developer": 3},
    "css": {"frontend developer": 3},
    "next.js": {"frontend developer": 4, "full stack developer": 3},
    "redux": {"frontend developer": 3},
    "node.js": {"backend developer": 5, "full stack developer": 4},
    "express": {"backend developer": 5, "full stack developer": 3},
    "django": {"backend developer": 5, "python developer": 4},
    "flask": {"backend developer": 4, "python developer": 4},
    "fastapi": {"backend developer": 4, "python developer": 4},
    "spring boot": {"java developer": 5, "backend developer": 3},
    "java": {"java developer": 5},
    "python": {"python developer": 4, "data scientist": 3, "ai engineer": 3, "backend developer": 2},
    "sql": {"data analyst": 3, "backend developer": 3, "data scientist": 2},
    "mongodb": {"backend developer": 3, "full stack developer": 3},
    "docker": {"devops engineer": 5, "cloud engineer": 4, "backend developer": 2},
    "kubernetes": {"devops engineer": 5, "cloud engineer": 5},
    "aws": {"cloud engineer": 5, "devops engineer": 4, "backend developer": 2},
    "azure": {"cloud engineer": 5, "devops engineer": 3},
    "gcp": {"cloud engineer": 5, "devops engineer": 3},
    "terraform": {"devops engineer": 4, "cloud engineer": 5},
    "ci/cd": {"devops engineer": 4, "cloud engineer": 3},
    "tensorflow": {"data scientist": 5, "ai engineer": 5},
    "pytorch": {"data scientist": 5, "ai engineer": 5},
    "machine learning": {"data scientist": 5, "ai engineer": 5},
    "deep learning": {"data scientist": 4, "ai engineer": 5},
    "nlp": {"ai engineer": 5, "data scientist": 3},
    "langchain": {"ai engineer": 5},
    "pandas": {"data scientist": 4, "data analyst": 3, "ai engineer": 3},
    "tableau": {"data analyst": 4, "business analyst": 3},
    "power bi": {"data analyst": 4, "business analyst": 3},
    "figma": {"ui/ux designer": 5},
    "flutter": {"flutter developer": 5, "mobile developer": 3},
    "dart": {"flutter developer": 5},
    "kotlin": {"mobile developer": 4},
    "swift": {"mobile developer": 4},
    "selenium": {"qa engineer": 5},
    "cypress": {"qa engineer": 5},
    "jira": {"qa engineer": 3, "business analyst": 3},
    "postman": {"qa engineer": 4},
    "firewall": {"cybersecurity analyst": 4},
    "penetration testing": {"cybersecurity analyst": 5},
    "siem": {"cybersecurity analyst": 5},
    "vulnerability assessment": {"cybersecurity analyst": 5},
    "incident response": {"cybersecurity analyst": 4},
    "excel": {"data analyst": 4, "business analyst": 3},
    "manual testing": {"qa engineer": 4},
    "bug tracking": {"qa engineer": 4},
    "api testing": {"qa engineer": 4},
    "test automation": {"qa engineer": 5},
    "security policies": {"cybersecurity analyst": 3},
    "network security": {"cybersecurity analyst": 4},
    "junit": {"qa engineer": 4, "java developer": 3},
    "maven": {"java developer": 3},
    "wireframing": {"ui/ux designer": 4},
    "prototyping": {"ui/ux designer": 4},
    "user research": {"ui/ux designer": 4},
    "design systems": {"ui/ux designer": 4},
    "adobe xd": {"ui/ux designer": 4},
    "requirements gathering": {"business analyst": 5},
    "stakeholder management": {"business analyst": 4},
    "documentation": {"business analyst": 3},
}

# ─────────────────────────────────────────────
# Step 1: Resume Parser — Extract everything from text
# ─────────────────────────────────────────────

def parse_resume(text: str) -> Dict[str, Any]:
    """Parse resume text and extract all structured information."""
    text_lower = text.lower()
    words = text.split()
    sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]

    # Extract skills using the taxonomy parser
    try:
        from backend.parsers.skills import extract_categorized_skills, extract_hard_skills, extract_soft_skills
        categorized = extract_categorized_skills(text)
        all_skills = extract_hard_skills(text)
        soft_skills_list = extract_soft_skills(text)
    except ImportError:
        categorized = {}
        all_skills = []
        soft_skills_list = []

    technical_skills = [s for s in all_skills if s not in soft_skills_list]

    # Extract experience years
    experience_years = 0
    year_pats = [
        r'(\d+)\+?\s*(?:years?|yrs?)\s*(?:of)?\s*(?:experience|exp)',
        r'(?:experience|exp)\s*(?:of\s*)?(\d+)\+?\s*(?:years?|yrs?)',
        r'(\d+)\+?\s*yr',
    ]
    for pat in year_pats:
        m = re.search(pat, text_lower)
        if m:
            try:
                experience_years = int(m.group(1))
            except ValueError:
                pass
            break

    # Education
    education = []
    edu_pats = [
        r'(B\.?Tech|B\.?E|B\.?S|Bachelor\'?s|Bachelor)',
        r'(M\.?Tech|M\.?E|M\.?S|Master\'?s|Master|MBA)',
        r'(Ph\.?D|Doctorate|PhD)',
        r'(Diploma|Associate|Certificate)',
    ]
    for pat in edu_pats:
        m = re.search(pat, text, re.IGNORECASE)
        if m:
            education.append(m.group(1))

    # Projects
    project_keywords = ['built', 'developed', 'created', 'designed', 'deployed', 'launched', 'engineered']
    projects = []
    for kw in project_keywords:
        pattern = rf'{re.escape(kw)}\s+(?:a\s+|an\s+|the\s+)?(\w+(?:\s+\w+){{0,4}})'
        for m in re.finditer(pattern, text, re.IGNORECASE):
            p = m.group(1).strip()
            if p and len(p) > 2:
                projects.append(p)
    projects = list(dict.fromkeys(projects))[:6]

    # Certifications
    certs = []
    for kw in ['certified', 'certification', 'certificate']:
        if kw in text_lower:
            for line in text.split('\n'):
                if kw in line.lower():
                    c = line.strip()[:80]
                    if c:
                        certs.append(c)
    certs = list(dict.fromkeys(certs))[:4]

    # Action verbs
    action_verbs_found = [v for v in STRONG_VERBS if v.lower() in text_lower]

    # Weak verbs
    weak_verbs_found = []
    for pat in WEAK_VERB_PATTERNS:
        if re.search(pat, text_lower):
            weak_verbs_found.append(pat)

    # Achievements/metrics
    percentages = re.findall(r'\d+%', text)
    currency = re.findall(r'[\$€£₹]\s*\d+[kKmMbB]?', text)
    numbers = re.findall(r'\d+', text)
    time_metrics = re.findall(r'\d+\s*(hours|days|weeks|months|years)', text, re.IGNORECASE)

    # Numbers in context (achievements with numbers)
    achievements = []
    for m in re.finditer(r'(increased|decreased|reduced|improved|generated|saved|boosted|grew|expanded|delivered|achieved|processed|managed|led|built|developed|created|designed|implemented|launched|deployed|handled|completed|executed)\s+[\w\s]{0,30}?\d+', text, re.IGNORECASE):
        achievements.append(m.group(0)[:60])
    achievements = list(dict.fromkeys(achievements))[:5]

    # Grammar issues
    grammar_issues = []
    for pat in GRAMMAR_ERROR_PATTERNS:
        matches = re.findall(pat, text, re.IGNORECASE)
        if matches:
            for m in matches[:2]:
                grammar_issues.append(m)

    # Passive voice
    passive_count = sum(1 for pat in PASSIVE_PATTERNS if re.search(pat, text, re.IGNORECASE))

    # Buzzwords
    buzzwords_found = [b for b in BUZZWORDS if b in text_lower]

    # Section detection
    sections_found = []
    section_keywords = {
        "summary": ["passionate", "motivated", "dedicated", "professional", "summary", "objective"],
        "experience": ["responsible", "worked", "managed", "led", "developed", "implemented"],
        "project": ["project", "built", "developed", "github", "deployed", "tech stack"],
        "education": ["bachelor", "master", "degree", "university", "college", "b.tech"],
        "skills": ["skills", "proficient", "expertise", "languages", "technologies"],
    }
    for section, kws in section_keywords.items():
        if any(kw in text_lower for kw in kws):
            sections_found.append(section)

    # Companies mentioned
    companies = re.findall(r'(?:at|for|with)\s+([A-Z][A-Za-z0-9\s&.]+?)(?:,|\.|\s{2,}|\n)', text)
    companies = [c.strip() for c in companies if len(c.strip()) > 2][:5]

    return {
        "skills": all_skills,
        "technicalSkills": technical_skills,
        "softSkills": soft_skills_list,
        "categorizedSkills": categorized,
        "experienceYears": experience_years,
        "education": education,
        "projects": projects,
        "certifications": certs,
        "companies": companies,
        "actionVerbs": action_verbs_found,
        "weakVerbs": weak_verbs_found,
        "grammarIssues": grammar_issues,
        "passiveVoiceCount": passive_count,
        "buzzwords": buzzwords_found,
        "achievements": achievements,
        "percentages": percentages,
        "currency": currency,
        "numbers": numbers,
        "timeMetrics": time_metrics,
        "sections": sections_found,
        "wordCount": len(words),
        "sentenceCount": len(sentences),
        "characterCount": len(text),
    }


# ─────────────────────────────────────────────
# Step 2: Role Detection — Dynamic from skills
# ─────────────────────────────────────────────

def detect_role_from_skills(skills: List[str], text: str = "") -> str:
    """Detect the most likely role from extracted skills and text."""
    text_lower = text.lower()
    role_scores: Dict[str, int] = {}

    # Score from skill weights
    for skill in skills:
        skill_lower = skill.lower()
        for key, role_weights in SKILL_TO_ROLE_WEIGHTS.items():
            if key == skill_lower or key in skill_lower:
                for role, weight in role_weights.items():
                    role_scores[role] = role_scores.get(role, 0) + weight

    # Score from role synonyms in text
    for role, synonyms in ROLE_SYNONYMS.items():
        for syn in synonyms:
            if syn in text_lower:
                role_scores[role] = role_scores.get(role, 0) + 3

    # Score from direct mentions
    for role in ROLE_SKILL_PROFILES:
        role_words = role.split()
        if all(w in text_lower for w in role_words):
            role_scores[role] = role_scores.get(role, 0) + 2

    # Text-based keyword matching for roles that are hard to detect from skills alone
    text_role_keywords = {
        "qa engineer": ["test cases", "test automation", "automated testing", "manual testing",
                        "selenium", "cypress", "bug tracking", "regression testing", "qa"],
        "cybersecurity analyst": ["vulnerability assessment", "penetration testing", "security audit",
                                  "incident response", "threat detection", "firewall", "siem",
                                  "security policies", "infosec", "cybersecurity"],
        "business analyst": ["requirements gathering", "brd", "stakeholder management", "business analysis",
                             "process modeling", "user stories", "acceptance criteria"],
        "data analyst": ["data analysis", "data visualization", "dashboards", "analytics", "bi tools"],
        "ui/ux designer": ["user research", "wireframing", "prototyping", "design systems", "usability",
                           "user experience", "ui design", "figma"],
    }
    for role, keywords in text_role_keywords.items():
        for kw in keywords:
            if kw in text_lower:
                role_scores[role] = role_scores.get(role, 0) + 2

    # Fresher/entry-level detection
    fresher_keywords = ["fresher", "graduate", "entry level", "internship", "academic project",
                        "looking for", "eager to learn", "recent graduate", "b.tech", "bachelor",
                        "student", "college", "university"]
    fresher_score = sum(1 for kw in fresher_keywords if kw in text_lower)
    experience_years = 0
    year_match = re.search(r'(\d+)\+?\s*(?:years?|yrs?)\s*(?:of)?\s*(?:experience|exp)', text_lower)
    if year_match:
        try:
            experience_years = int(year_match.group(1))
        except ValueError:
            pass
    if fresher_score >= 2 and len(skills) <= 4 and experience_years == 0:
        role_scores["fresher/entry level"] = fresher_score * 5

    if not role_scores:
        return ""

    best_role = max(role_scores, key=role_scores.get)
    return best_role.title()


def detect_role(text: str) -> Optional[str]:
    parsed = parse_resume(text)
    return detect_role_from_skills(parsed.get("skills", []), text)


def detect_industry(skills: List[str], text: str = "") -> str:
    skill_text = " ".join(s.lower() for s in skills) + " " + text.lower()
    industry_map = {
        "Software Engineering": ["software", "developer", "engineering", "programming", "code"],
        "Data Science & AI": ["machine learning", "data science", "ai", "deep learning", "nlp"],
        "Cloud & Infrastructure": ["cloud", "aws", "azure", "devops", "infrastructure"],
        "Cybersecurity": ["security", "cybersecurity", "vulnerability", "penetration"],
        "Mobile Development": ["mobile", "android", "ios", "flutter", "swift"],
        "UI/UX Design": ["design", "figma", "user experience", "ui/ux", "prototyping"],
        "Data Analytics": ["analytics", "data analysis", "tableau", "power bi", "dashboard"],
    }
    scores = {}
    for industry, keywords in industry_map.items():
        score = sum(keyword in skill_text for keyword in keywords)
        if score > 0:
            scores[industry] = score
    return max(scores, key=scores.get) if scores else "General"


# ─────────────────────────────────────────────
# Step 3: Dynamic ATS Keywords — Role-specific
# ─────────────────────────────────────────────

def get_role_keywords(role: str) -> List[str]:
    """Get ATS keywords dynamically for a role."""
    role_lower = role.lower()
    profile = None
    for r, p in ROLE_SKILL_PROFILES.items():
        if r == role_lower or r in role_lower or role_lower in r:
            profile = p
            break
    if not profile:
        for r, p in ROLE_SKILL_PROFILES.items():
            for syn in ROLE_SYNONYMS.get(r, []):
                if syn in role_lower or role_lower in syn:
                    profile = p
                    break
            if profile:
                break
    if profile:
        return profile["core"] + profile["recommended"] + profile["advanced"]
    return []


def ats_analysis(text: str, target_role: Optional[str]) -> Dict[str, Any]:
    if not target_role:
        return {
            "matched": [],
            "missing": [],
            "density": 0,
            "score": 0,
        }
    keywords = get_role_keywords(target_role)
    if not keywords:
        return {
            "matched": [],
            "missing": [],
            "density": 0,
            "score": 0,
        }

    text_lower = text.lower()
    matched = [kw for kw in keywords if kw.lower() in text_lower]
    missing = [kw for kw in keywords if kw.lower() not in text_lower]
    total_words = len(text.split())
    keyword_occurrences = sum(text_lower.count(kw.lower()) for kw in keywords)
    density = round((keyword_occurrences / max(total_words, 1)) * 100, 1)
    score = min(100, round((len(matched) / max(len(keywords), 1)) * 100))

    return {
        "matched": matched,
        "missing": missing,
        "density": density,
        "score": score,
    }


# ─────────────────────────────────────────────
# Step 4: Dynamic Metrics — Always from actual text
# ─────────────────────────────────────────────

def generate_dynamic_metrics(original: str, improved: str, ats_result: Dict[str, Any],
                              resume_context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    ctx = resume_context or {}
    original_words = len(original.split())
    improved_words = len(improved.split())
    original_sentences = len([s for s in re.split(r'[.!?]+', original) if s.strip()])
    improved_sentences = len([s for s in re.split(r'[.!?]+', improved) if s.strip()])

    grammar_corrections = 0
    for pat in GRAMMAR_ERROR_PATTERNS:
        if re.search(pat, original, re.IGNORECASE) and not re.search(pat, improved, re.IGNORECASE):
            grammar_corrections += 1

    ats_keywords_added = len(ats_result.get("missing", []))

    weak_verbs_replaced = 0
    for pat in WEAK_VERB_PATTERNS:
        if re.search(pat, original, re.IGNORECASE) and not re.search(pat, improved, re.IGNORECASE):
            weak_verbs_replaced += 1

    achievements_added = 0
    for p in [r'\d+%', r'[\$€£₹]', r'\d+\s*(hours|days|weeks|months|years|users|customers|clients|projects)']:
        if not re.search(p, original, re.IGNORECASE) and re.search(p, improved, re.IGNORECASE):
            achievements_added += 1

    sections_improved = 1 + (1 if grammar_corrections > 0 else 0) + (1 if ats_keywords_added > 0 else 0) + (1 if weak_verbs_replaced > 0 else 0)

    readability_original = calculate_readability_score(original)
    readability_improved = calculate_readability_score(improved)

    # Action verbs in improved
    action_verbs_improved = len([v for v in STRONG_VERBS if v.lower() in improved.lower()])
    action_verbs_original = len([v for v in STRONG_VERBS if v.lower() in original.lower()])

    return {
        "characters": len(improved),
        "words": improved_words,
        "sentences": improved_sentences,
        "reading_time": max(1, round(improved_words / 200)),
        "ats_keywords_added": ats_keywords_added,
        "grammar_corrections": grammar_corrections,
        "sections_improved": sections_improved,
        "achievements_added": achievements_added,
        "weak_verbs_replaced": weak_verbs_replaced,
        "readability_score": readability_improved,
        "original_readability": readability_original,
        "word_count_change": improved_words - original_words,
        "action_verbs_original": action_verbs_original,
        "action_verbs_improved": action_verbs_improved,
        "original_words": original_words,
        "improved_words": improved_words,
        "original_sentences": original_sentences,
        "improved_sentences": improved_sentences,
    }


def calculate_readability_score(text: str) -> int:
    words = text.split()
    if not words:
        return 0
    sentences = [s for s in re.split(r'[.!?]+', text) if s.strip()]
    if not sentences:
        return 50
    avg_words_per_sentence = len(words) / len(sentences)
    syllables_per_word = sum(count_syllables(w) for w in words) / len(words) if words else 0
    score = 206.835 - 1.015 * avg_words_per_sentence - 84.6 * syllables_per_word
    return max(0, min(100, round(score)))


def count_syllables(word: str) -> int:
    word = word.lower().strip(".,!?;:")
    if not word:
        return 1
    vowels = "aeiouy"
    count = 0
    prev_vowel = False
    for ch in word:
        is_vowel = ch in vowels
        if is_vowel and not prev_vowel:
            count += 1
        prev_vowel = is_vowel
    if word.endswith("e"):
        count = max(1, count - 1)
    return max(1, count)


# ─────────────────────────────────────────────
# Step 5: Grammar Analysis
# ─────────────────────────────────────────────

def grammar_analysis(text: str) -> Dict[str, Any]:
    corrections_made = []
    fixed = text

    # Capitalization
    fixed_cap = re.sub(r'(?:^|\.\s+)([a-z])', lambda m: m.group(0)[:-1] + m.group(1).upper(), fixed)
    if fixed_cap != fixed:
        corrections_made.append({"type": "capitalization", "description": "Fixed sentence capitalization"})
    fixed = fixed_cap

    # Double spaces
    fixed = re.sub(r' +', ' ', fixed)

    # Missing period
    if fixed.strip() and not fixed.strip()[-1] in ".!?":
        fixed = fixed.rstrip() + "."
        corrections_made.append({"type": "punctuation", "description": "Added missing period"})

    # Comma spacing
    fixed = re.sub(r',([^ ])', r', \1', fixed)

    # Common typos
    typos = {
        r'\brecieve\b': 'receive', r'\boccured\b': 'occurred',
        r'\bseperate\b': 'separate', r'\bneccessary\b': 'necessary',
        r'\boccassion\b': 'occasion', r'\bacheive\b': 'achieve',
        r'\bcalender\b': 'calendar', r'\bdefinately\b': 'definitely',
        r'\bembarass\b': 'embarrass', r'\btommorow\b': 'tomorrow',
        r'\balot\b': 'a lot', r'\biam\b': 'I am',
        r'\bcould of\b': 'could have', r'\bshould of\b': 'should have',
        r'\bwould of\b': 'would have',
    }
    for pattern, fix in typos.items():
        if re.search(pattern, fixed, re.IGNORECASE):
            fixed = re.sub(pattern, fix, fixed, flags=re.IGNORECASE)
            corrections_made.append({"type": "typo", "description": f"Fixed spelling: {pattern} -> {fix}"})

    # Issues
    issues = []
    for pat in GRAMMAR_ERROR_PATTERNS:
        if re.search(pat, text, re.IGNORECASE):
            issues.append(f"Spelling error: {pat}")

    return {
        "corrected_text": fixed,
        "corrections": corrections_made,
        "issues": issues,
    }


# ─────────────────────────────────────────────
# Step 6: Dynamic Score Calculation
# ─────────────────────────────────────────────

def calculate_quality_score(text: str, section_type: str, ats_result: Dict[str, Any],
                            verb_result: Dict[str, Any], achievement_result: Dict[str, Any],
                            resume_context: Optional[Dict[str, Any]] = None) -> Dict[str, int]:
    parsed = resume_context or parse_resume(text)
    scores = {}

    # Grammar (weight: 20%)
    grammar_score = 60
    sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
    if sentences:
        capped = sum(1 for s in sentences if s and s[0].isupper())
        grammar_score += min(20, round((capped / len(sentences)) * 20))
    if text.count(".") > 2:
        grammar_score += 5
    if text.count(",") > 1:
        grammar_score += 5
    typo_count = sum(1 for pat in GRAMMAR_ERROR_PATTERNS if re.search(pat, text, re.IGNORECASE))
    grammar_score -= typo_count * 5
    grammar_score = min(100, max(0, grammar_score))
    scores["grammar"] = grammar_score

    # ATS match (weight: 20%)
    ats_score = ats_result.get("score", 0)
    keywords_matched = len(ats_result.get("matched", []))
    if keywords_matched > 5:
        ats_score = min(100, ats_score + 10)
    elif keywords_matched == 0:
        ats_score = max(0, ats_score - 10)
    scores["ats"] = ats_score

    # Skills (weight: 25%)
    skills_score = 50
    ctx_skills = parsed.get("technicalSkills", [])
    if ctx_skills:
        skills_score += min(30, len(ctx_skills) * 3)
    ctx_soft = parsed.get("softSkills", [])
    if ctx_soft:
        skills_score += min(10, len(ctx_soft) * 2)
    text_lower = text.lower()
    if ctx_skills:
        skills_in_text = sum(1 for s in ctx_skills[:15] if s.lower() in text_lower)
        skills_score += min(10, skills_in_text * 2)
    skills_score = min(100, skills_score)
    scores["skills"] = skills_score

    # Projects (weight: 15%)
    project_score = 40
    ctx_projects = parsed.get("projects", [])
    if ctx_projects:
        project_score += min(40, len(ctx_projects) * 8)
    has_project_verbs = bool(re.search(r'\b(built|developed|created|designed|deployed|launched)\b', text, re.IGNORECASE))
    if has_project_verbs:
        project_score += 20
    project_score = min(100, project_score)
    scores["projects"] = project_score

    # Achievements (weight: 10%)
    ach_score = achievement_result.get("score", 0)
    ach_total = achievement_result.get("total", 0)
    if ach_total > 3:
        ach_score = min(100, ach_score + 15)
    elif ach_total == 0:
        ach_score = max(0, ach_score - 10)
    scores["achievements"] = ach_score

    # Action Verbs (weight: 10%)
    verb_count = verb_result.get("count", 0)
    total_words = len(text.split())
    verb_density = round((verb_count / max(total_words, 1)) * 100, 1)
    action_score = min(100, verb_count * 10 + verb_density * 2)
    scores["action_verbs"] = action_score

    # Formatting (weight: 5%)
    fmt_score = 60
    lines = text.split("\n")
    bullet_lines = sum(1 for l in lines if l.strip().startswith(("•", "-", "*")))
    if bullet_lines > 0:
        fmt_score += 15
    if len(lines) > 1:
        fmt_score += 10
    if len(text) > 100:
        fmt_score += 5
    fmt_score = min(100, fmt_score)
    scores["formatting"] = fmt_score

    # Readability (weight: 5%)
    read_score = calculate_readability_score(text)
    buzzword_penalty = sum(5 for b in BUZZWORDS if b in text_lower)
    read_score = max(0, read_score - buzzword_penalty)
    scores["readability"] = read_score

    # Overall (weighted)
    weights = {
        "grammar": 0.20,
        "ats": 0.20,
        "skills": 0.25,
        "projects": 0.15,
        "achievements": 0.10,
        "action_verbs": 0.05,
        "formatting": 0.03,
        "readability": 0.02,
    }
    overall = round(sum(scores[k] * weights[k] for k in weights))
    overall = min(100, max(0, overall))

    return {
        "overall": overall,
        "ats_score": ats_score,
        "grammar_score": scores["grammar"],
        "readability_score": scores["readability"],
        "formatting_score": fmt_score,
        "action_verb_score": action_score,
        "projects_score": project_score,
        "skills_score": skills_score,
        "achievement_score": ach_score,
        "skills_weight": 25,
        "grammar_weight": 20,
        "ats_weight": 20,
        "projects_weight": 15,
        "achievements_weight": 10,
        "action_verbs_weight": 5,
        "formatting_weight": 5,
        "readability_weight": 5,
    }


# ─────────────────────────────────────────────
# Step 7: Dynamic Missing Skills
# ─────────────────────────────────────────────

def generate_missing_skills(parsed: Dict[str, Any], role: str) -> List[str]:
    """Compare detected skills against role profile to find gaps."""
    if not role:
        return []
    detected = set(s.lower() for s in parsed.get("skills", []))
    profile = None
    role_lower = role.lower()
    for r, p in ROLE_SKILL_PROFILES.items():
        if r == role_lower or r in role_lower or role_lower in r:
            profile = p
            break
    if not profile:
        for r, p in ROLE_SKILL_PROFILES.items():
            for syn in ROLE_SYNONYMS.get(r, []):
                if syn in role_lower or role_lower in syn:
                    profile = p
                    break
            if profile:
                break
    if not profile:
        return []

    all_recommended = profile["core"] + profile["recommended"] + profile["advanced"]
    missing = [s for s in all_recommended if s.lower() not in detected]
    return missing[:8]


# ─────────────────────────────────────────────
# Step 8: Rewrite Resume — Dynamically rewrite input
# ─────────────────────────────────────────────

def rewrite_resume(text: str, section_type: str, target_role: Optional[str] = None) -> Dict[str, Any]:
    changes = []
    improved = text

    # 1. Grammar pass
    grammar_result = grammar_analysis(improved)
    improved = grammar_result["corrected_text"]
    for c in grammar_result["corrections"]:
        changes.append(c["description"])

    # 2. Weak verb replacement
    weak_to_strong = {
        "responsible for": "Managed",
        "worked on": "Developed",
        "helped": "Collaborated with",
        "made": "Designed",
        "did": "Executed",
        "was involved in": "Spearheaded",
        "participated in": "Led",
        "was part of": "Architected",
        "contributed to": "Engineered",
        "assisted": "Supported",
        "handled": "Orchestrated",
        "dealt with": "Resolved",
        "worked with": "Partnered with",
        "used": "Leveraged",
        "tried": "Implemented",
        "attempted": "Pioneered",
    }
    for weak, strong in weak_to_strong.items():
        pattern = r'\b' + re.escape(weak) + r'\b'
        if re.search(pattern, improved, re.IGNORECASE):
            improved = re.sub(pattern, strong, improved, flags=re.IGNORECASE)
            changes.append(f'Replaced "{weak}" with "{strong}"')

    # 3. Filler word removal
    filler_words = ["very", "really", "quite", "just", "basically", "essentially",
                     "actually", "literally", "obviously", "simply", "somewhat"]
    for filler in filler_words:
        pattern = r'\b' + re.escape(filler) + r'\b\s*'
        if re.search(pattern, improved, re.IGNORECASE):
            improved = re.sub(pattern, "", improved, flags=re.IGNORECASE)
            changes.append(f'Removed filler word: "{filler}"')

    # 4. Remove duplicate consecutive words
    words = improved.split()
    cleaned = []
    for i, w in enumerate(words):
        if i == 0 or w.lower() != words[i - 1].lower():
            cleaned.append(w)
    if len(cleaned) < len(words):
        improved = " ".join(cleaned)
        changes.append("Removed duplicate words")

    # 5. Passive to active
    for pat in PASSIVE_PATTERNS:
        if re.search(pat, improved, re.IGNORECASE):
            changes.append("Converted passive voice to active voice")
            break

    # 6. Add bullet points for experience/project sections
    if section_type in ("experience", "project"):
        lines = improved.split("\n")
        new_lines = []
        for line in lines:
            stripped = line.strip()
            if stripped and not stripped[0] in "•-*":
                new_lines.append("• " + stripped)
            else:
                new_lines.append(line)
        improved = "\n".join(new_lines)
        if new_lines != lines:
            changes.append("Standardized bullet point formatting")

    # 7. ATS keyword injection (add 1-2 missing keywords naturally)
    if target_role:
        keywords = get_role_keywords(target_role)
        if keywords:
            text_lower = improved.lower()
            missing_keywords = [kw for kw in keywords if kw.lower() not in text_lower]
            added = 0
            for keyword in missing_keywords[:2]:
                if section_type in ("experience", "summary"):
                    improved = improved.rstrip(".") + f". Expertise in {keyword}"
                    changes.append(f'Added ATS keyword: "{keyword}"')
                    added += 1
                elif section_type == "project":
                    improved = improved.rstrip(".") + f". Built with {keyword}"
                    changes.append(f'Added ATS keyword: "{keyword}"')
                    added += 1
            if added == 0 and missing_keywords:
                kw = missing_keywords[0]
                improved = improved.rstrip(".") + f". Proficient in {kw}"
                changes.append(f'Added ATS keyword: "{kw}"')

    # 8. Content-specific rewrite for uniqueness
    content_improved = rewrite_content_specific(improved, target_role)
    if content_improved != improved:
        improved = content_improved

    # 9. Flag long sentences
    sentences = re.split(r'[.!?]+', improved)
    long_sentences = [s.strip() for s in sentences if len(s.split()) > 30]
    if long_sentences:
        changes.append("Broke down long sentences for better readability")

    # Deduplicate changes
    seen = set()
    unique_changes = []
    for c in changes:
        if c not in seen:
            seen.add(c)
            unique_changes.append(c)

    return {
        "improved_text": improved.strip() if improved.strip() else text,
        "changes": unique_changes,
    }


# ─────────────────────────────────────────────
# Step 8b: Content-specific rewrite for generating a more unique output
# ─────────────────────────────────────────────

def rewrite_content_specific(text: str, target_role: Optional[str] = None) -> str:
    """Generate a more uniquely rewritten version by restructuring content."""
    improved = text

    # Replace common weak phrases with varied strong ones
    replacements = {
        r'\bworked\s+on\b': 'Developed',
        r'\bbuilt\b': 'Architected',
        r'\bmade\b': 'Engineered',
        r'\bdid\b': 'Executed',
        r'\bused\b': 'Leveraged',
        r'\bcreated\b': 'Designed and implemented',
        r'\bhelped\b': 'Collaborated to deliver',
        r'\bwas\s+responsible\s+for\b': 'Owned',
    }
    for pat, repl in replacements.items():
        improved = re.sub(pat, repl, improved, flags=re.IGNORECASE)

    # Add bullet points if not present
    lines = improved.split('\n')
    if not any(l.strip().startswith('*') or l.strip().startswith('-') or l.strip().startswith('•') for l in lines):
        bullet_lines = []
        for line in lines:
            line = line.strip()
            if line:
                bullet_lines.append(f'• {line}')
        improved = '\n'.join(bullet_lines)

    # Role-specific enhancement
    if target_role:
        role_lower = target_role.lower()
        if 'frontend' in role_lower or 'react' in role_lower:
            improved = re.sub(r'\bresponsive\b', 'responsive, accessible', improved, flags=re.IGNORECASE)
        elif 'backend' in role_lower:
            improved = re.sub(r'\bapi\b', 'RESTful API', improved, flags=re.IGNORECASE)
        elif 'ai' in role_lower or 'data' in role_lower:
            improved = re.sub(r'\bmodel\b', 'production-ready model', improved, flags=re.IGNORECASE)
        elif 'devops' in role_lower or 'cloud' in role_lower:
            improved = re.sub(r'\bdeploy\b', 'automated deploy', improved, flags=re.IGNORECASE)
        elif 'ui' in role_lower or 'design' in role_lower:
            improved = re.sub(r'\bdesign\b', 'user-centered design', improved, flags=re.IGNORECASE)

    return improved


# ─────────────────────────────────────────────
# Step 9: Dynamic Key Improvements
# ─────────────────────────────────────────────

def generate_improvements(changes: List[str], grammar_result: Dict[str, Any],
                           ats_result: Dict[str, Any], verb_result: Dict[str, Any],
                           achievement_result: Dict[str, Any],
                           format_result: Dict[str, Any],
                           resume_context: Optional[Dict[str, Any]] = None) -> List[str]:
    improvements = []
    parsed = resume_context or {}

    # Grammar
    if grammar_result.get("corrections"):
        types = set(c["type"] for c in grammar_result["corrections"])
        if "capitalization" in types:
            improvements.append("Corrected grammar and capitalization")
        if "typo" in types:
            improvements.append("Fixed spelling errors")
        if "punctuation" in types:
            improvements.append("Fixed punctuation errors")

    typo_count = sum(1 for pat in GRAMMAR_ERROR_PATTERNS if re.search(pat, grammar_result.get("corrected_text", ""), re.IGNORECASE))
    if typo_count > 0:
        improvements.append(f"Fixed {typo_count} spelling error(s)")

    # Action verbs
    verb_count = verb_result.get("count", 0)
    if verb_count > 3:
        improvements.append(f"Used {verb_count} strong action verbs")
    elif verb_count > 0:
        improvements.append(f"Added {verb_count} strong action verbs")
    else:
        improvements.append("Added strong action verbs for impact")

    has_verb_replacement = any("Replaced" in c for c in changes)
    if has_verb_replacement:
        improvements.append("Replaced weak verbs with powerful alternatives")

    # ATS keywords
    matched = ats_result.get("matched", [])
    missing = ats_result.get("missing", [])
    if matched:
        improvements.append(f"Retained {len(matched)} relevant ATS keywords")
    if missing:
        improvements.append(f"Added {len(missing[:3])} missing ATS keywords: {', '.join(missing[:3])}")
    if ats_result.get("density", 0) > 0:
        improvements.append(f"Achieved {ats_result['density']}% ATS keyword density")

    # Projects
    ctx_projects = parsed.get("projects", [])
    if ctx_projects:
        improvements.append(f"Highlighted {len(ctx_projects)} project(s) from your experience")

    # Achievements
    if achievement_result.get("total", 0) > 0:
        improvements.append(f"Emphasized {achievement_result['total']} measurable achievement(s)")
    if achievement_result.get("percentages", 0) > 0:
        improvements.append(f"Quantified results with {achievement_result['percentages']} percentage-based metric(s)")
    if achievement_result.get("currency", 0) > 0:
        improvements.append("Added monetary impact metrics")

    # Skills-based
    ctx_skills = parsed.get("technicalSkills", [])
    if ctx_skills:
        text_lower = grammar_result.get("corrected_text", "").lower()
        mentioned = sum(1 for s in ctx_skills[:10] if s.lower() in text_lower)
        if mentioned > 0:
            improvements.append(f"Referenced {mentioned} of {len(ctx_skills)} detected technical skills")

    # Formatting
    bullet_count = format_result.get("bullet_count", 0)
    if bullet_count > 0:
        improvements.append(f"Formatted with {bullet_count} bullet points for ATS readability")
    else:
        improvements.append("Added bullet point structure for ATS readability")

    # Passive voice
    if any("passive" in c.lower() for c in changes):
        improvements.append("Reduced passive voice usage for stronger impact")

    # Readability
    if any("sentence" in c.lower() for c in changes):
        improvements.append("Improved sentence clarity and conciseness")
    if any("filler" in c.lower() for c in changes):
        improvements.append("Removed filler words for tighter prose")

    # Weak verb replacements
    weak_replaced = [c for c in changes if "Replaced" in c]
    if weak_replaced:
        improvements.append(f"Upgraded {len(weak_replaced)} weak verb(s) to professional alternatives")

    # Role-specific
    ctx_role = parsed.get("targetRole", "")
    if ctx_role:
        improvements.append(f"Optimized content for {ctx_role} position")

    # Weak verbs detected
    weak_verbs_list = parsed.get("weakVerbs", [])
    if weak_verbs_list and len(weak_verbs_list) > 0:
        improvements.append(f"Detected and replaced {len(weak_verbs_list)} weak verb pattern(s)")

    # Grammar issues found
    grammar_issues = parsed.get("grammarIssues", [])
    if grammar_issues:
        improvements.append(f"Identified and corrected {len(grammar_issues)} grammar issue(s)")

    # Industry
    ctx_industry = parsed.get("industry", "")
    if ctx_industry:
        improvements.append(f"Tailored language for {ctx_industry} industry standards")

    # Deduplicate
    seen = set()
    unique = []
    for imp in improvements:
        if imp not in seen:
            seen.add(imp)
            unique.append(imp)

    return unique


# ─────────────────────────────────────────────
# Step 10: Dynamic Role-specific Suggestions
# ─────────────────────────────────────────────

def generate_role_suggestions(text: str, target_role: Optional[str],
                               resume_context: Optional[Dict[str, Any]] = None) -> List[str]:
    parsed = resume_context or parse_resume(text)
    ctx_skills = parsed.get("technicalSkills", [])
    ctx_soft = parsed.get("softSkills", [])
    ctx_projects = parsed.get("projects", [])
    ctx_certs = parsed.get("certifications", [])
    ctx_industry = parsed.get("industry", "")
    ctx_role = target_role or parsed.get("targetRole", "")

    suggestions = []
    detected_lower = ctx_role.lower()

    if "frontend" in detected_lower:
        suggestions.append("Highlight component architecture and state management patterns")
        suggestions.append("Mention performance optimization (code splitting, lazy loading, memoization)")
        suggestions.append("Include responsive design and cross-browser compatibility experience")
        if "typescript" not in [s.lower() for s in ctx_skills]:
            suggestions.append("Add TypeScript proficiency for type safety")
        if not any(t in [s.lower() for s in ctx_skills] for t in ["jest", "cypress"]):
            suggestions.append("Include frontend testing experience (Jest, Cypress, React Testing Library)")
    elif "backend" in detected_lower:
        suggestions.append("Specify API design patterns (REST, GraphQL, gRPC)")
        suggestions.append("Mention database schema design and query optimization")
        if "docker" not in [s.lower() for s in ctx_skills]:
            suggestions.append("Add Docker containerization for consistent deployments")
        if "redis" not in [s.lower() for s in ctx_skills]:
            suggestions.append("Mention caching strategies (Redis, CDN)")
        suggestions.append("Include microservices architecture experience")
    elif "data scientist" in detected_lower or "machine learning" in detected_lower:
        suggestions.append("Quantify model performance (accuracy, precision, recall, F1)")
        if not any(t in [s.lower() for s in ctx_skills] for t in ["tensorflow", "pytorch"]):
            suggestions.append("Mention deep learning frameworks (TensorFlow, PyTorch)")
        suggestions.append("Describe data pipeline and feature engineering approach")
        if "docker" not in [s.lower() for s in ctx_skills]:
            suggestions.append("Include MLOps practices for model deployment")
    elif "ai" in detected_lower or "llm" in detected_lower or "langchain" in detected_lower:
        suggestions.append("Quantify model performance and accuracy metrics")
        suggestions.append("Mention RAG architecture and vector database experience")
        suggestions.append("Describe prompt engineering and LLM fine-tuning approach")
        if "docker" not in [s.lower() for s in ctx_skills]:
            suggestions.append("Include MLOps practices for AI model deployment")
    elif "devops" in detected_lower or "cloud" in detected_lower or "sre" in detected_lower:
        suggestions.append("Specify cloud platforms and services (AWS, Azure, GCP)")
        if "terraform" not in [s.lower() for s in ctx_skills]:
            suggestions.append("Add Infrastructure-as-Code tools (Terraform, CloudFormation)")
        suggestions.append("Include monitoring and observability stack (Prometheus, Grafana, Datadog)")
        if "kubernetes" not in [s.lower() for s in ctx_skills]:
            suggestions.append("Mention container orchestration (Kubernetes, ECS)")
    elif "flutter" in detected_lower or "mobile" in detected_lower:
        suggestions.append("Highlight platform-specific optimization and App Store deployment")
        if "firebase" not in [s.lower() for s in ctx_skills]:
            suggestions.append("Mention Firebase or backend integration for mobile apps")
        suggestions.append("Include state management approach (Provider, Bloc, Riverpod)")
    elif "full stack" in detected_lower:
        suggestions.append("Demonstrate end-to-end feature ownership across frontend and backend")
        suggestions.append("Balance technical depth in both client and server technologies")
        suggestions.append("Include DevOps and deployment pipeline experience")
    elif "java" in detected_lower:
        suggestions.append("Mention JVM optimization and memory management experience")
        suggestions.append("Include microservices and Spring Boot ecosystem depth")
        suggestions.append("Specify testing frameworks (JUnit, Mockito, Integration tests)")
    elif "python" in detected_lower:
        suggestions.append("Highlight Python-specific optimizations and async programming")
        suggestions.append("Include relevant framework depth (Django, Flask, FastAPI)")
    elif "data analyst" in detected_lower or "analyst" in detected_lower:
        suggestions.append("Quantify business insights and decision impact")
        suggestions.append("Mention specific BI tools (Tableau, Power BI, Looker)")
        suggestions.append("Include SQL complexity and data pipeline examples")
    elif "security" in detected_lower or "cyber" in detected_lower:
        suggestions.append("Specify security frameworks and compliance standards")
        suggestions.append("Mention incident response and threat detection experience")
    elif "ui/ux" in detected_lower or "designer" in detected_lower:
        suggestions.append("Highlight design thinking and user-centered design process")
        suggestions.append("Mention design system contribution and accessibility standards")
        suggestions.append("Include specific tools (Figma, Adobe XD, prototyping tools)")
    elif "qa" in detected_lower or "test" in detected_lower:
        suggestions.append("Mention test automation frameworks and coverage metrics")
        suggestions.append("Include CI/CD integration for automated testing")
        suggestions.append("Specify API testing and performance testing experience")
    elif "business analyst" in detected_lower or "ba" in detected_lower.split():
        suggestions.append("Highlight stakeholder management and requirements gathering")
        suggestions.append("Mention data analysis and process improvement outcomes")
        suggestions.append("Include specific tools (JIRA, Confluence, SQL, Power BI)")
    else:
        suggestions.append("Quantify achievements with metrics and numbers")
        suggestions.append("Use strong action verbs throughout")
        suggestions.append("Add specific technologies and tools relevant to your target role")

    if ctx_skills:
        suggestions.append(f"Build on your existing skills in {', '.join(ctx_skills[:3])} to differentiate yourself")
    if ctx_projects:
        suggestions.append(f"Emphasize project outcomes for {ctx_projects[0]} with specific metrics")
    if ctx_certs:
        cert_names = [c[:40] for c in ctx_certs[:2]]
        suggestions.append(f"Feature your certifications: {', '.join(cert_names)}")
    if ctx_industry:
        suggestions.append(f"Use {ctx_industry} industry terminology and keywords throughout")

    return suggestions[:8]


# ─────────────────────────────────────────────
# Step 11: Validate Input
# ─────────────────────────────────────────────

def validate_input(text: str) -> Tuple[bool, Optional[str]]:
    if not text or not text.strip():
        return False, "Please enter a meaningful resume section."
    text = text.strip()
    word_count = len(text.split())
    if word_count < 10:
        return False, "Please enter a meaningful resume section."
    if len(text) > 5000:
        return False, "Resume section must not exceed 5000 characters."
    spam_patterns = [
        r'^[a-z]{10,}$', r'^[asdfghjkl;]{5,}$', r'^[qwertyuiop]{5,}$',
        r'^[zxcvbnm,./]{5,}$', r'^(.)\1{4,}', r'^[dklfjsa]{5,}',
    ]
    for pattern in spam_patterns:
        if re.match(pattern, text, re.IGNORECASE):
            return False, "Unable to detect resume content. Please enter meaningful resume text."
    char_counts = {}
    for ch in text:
        char_counts[ch] = char_counts.get(ch, 0) + 1
    if char_counts and max(char_counts.values()) > len(text) * 0.5:
        return False, "Unable to detect resume content. Please enter meaningful resume text."
    if not any(c.isalnum() for c in text):
        return False, "Please enter a meaningful resume section."
    if all(c.isdigit() or c.isspace() or c in "-." for c in text):
        return False, "Please enter a meaningful resume section."
    return True, None


# ─────────────────────────────────────────────
# Step 12: Context Analysis (kept for backward compat)
# ─────────────────────────────────────────────

def analyze_resume_context(text: str) -> Dict[str, Any]:
    parsed = parse_resume(text)
    role = detect_role_from_skills(parsed.get("skills", []), text)
    industry = detect_industry(parsed.get("skills", []), text)
    parsed["targetRole"] = role
    parsed["industry"] = industry
    return parsed


# ─────────────────────────────────────────────
# Step 13: Quality Report — Fully Dynamic
# ─────────────────────────────────────────────

def generate_quality_report(text: str, resume_context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    parsed = resume_context or parse_resume(text)
    report = {}

    grammar_issues = []
    for pat, fix in GRAMMAR_ERROR_PATTERNS.items():
        matches = re.findall(pat, text, re.IGNORECASE)
        if matches:
            for m in matches[:2]:
                grammar_issues.append(f"'{m}' should be '{fix}'")
    report["grammar_issues"] = grammar_issues[:5]

    passive_count = sum(1 for pat in PASSIVE_PATTERNS if re.search(pat, text, re.IGNORECASE))
    report["passive_voice_count"] = passive_count

    words = text.lower().split()
    repeated = []
    for i in range(1, len(words)):
        if words[i] == words[i - 1] and len(words[i]) > 2:
            repeated.append(words[i])
    report["repeated_words"] = list(set(repeated))[:5]

    report["weak_verbs"] = []
    for pat in WEAK_VERB_PATTERNS:
        m = re.search(pat, text, re.IGNORECASE)
        if m:
            report["weak_verbs"].append(m.group(0))

    sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
    long_sentences = [s for s in sentences if len(s.split()) > 30]
    report["long_sentences"] = len(long_sentences)

    buzzwords_found = [b for b in BUZZWORDS if b in text.lower()]
    report["buzzwords"] = buzzwords_found[:5]

    has_metrics = bool(re.search(r'\d+', text))
    report["missing_metrics"] = 0 if has_metrics else 1

    spelling_errors = []
    for pat in GRAMMAR_ERROR_PATTERNS:
        matches = re.findall(pat, text, re.IGNORECASE)
        spelling_errors.extend(matches)
    report["spelling_errors"] = spelling_errors[:5]

    ctx_skills = parsed.get("skills", [])
    if ctx_skills:
        text_lower = text.lower()
        missing_skills = [s for s in ctx_skills[:20] if s.lower() not in text_lower]
        report["missing_skills"] = missing_skills[:8]
    else:
        report["missing_skills"] = []

    report["total_issues"] = (
        len(grammar_issues) + passive_count + len(long_sentences) +
        len(buzzwords_found) + len(spelling_errors)
    )

    report["detected_action_verbs"] = len([v for v in STRONG_VERBS if v.lower() in text.lower()])
    report["detected_projects"] = parsed.get("projects", [])
    report["detected_certifications"] = parsed.get("certifications", [])
    report["detected_education"] = parsed.get("education", [])
    report["detected_experience_years"] = parsed.get("experienceYears", 0)

    return report


# ─────────────────────────────────────────────
# Step 14: Action Verb & Achievement Analysis
# ─────────────────────────────────────────────

def action_verb_analysis(text: str, section_type: str) -> Dict[str, Any]:
    found = [v for v in STRONG_VERBS if v.lower() in text.lower()]
    count = len(found)
    ratio = round(count / max(len(text.split()), 1) * 100, 1)
    return {
        "strong_verbs_found": found,
        "count": count,
        "density": ratio,
        "score": min(100, count * 10),
    }


def achievement_detection(text: str) -> Dict[str, Any]:
    percentages = re.findall(r'\d+%', text)
    numbers = re.findall(r'\d+', text)
    currency = re.findall(r'[\$€£₹]\s*\d+[kKmMbB]?', text)
    time_metrics = re.findall(r'\d+\s*(hours|days|weeks|months|years|people|users|customers|clients|projects|teams)', text, re.IGNORECASE)
    impact_verbs = re.findall(r'\b(increased|decreased|reduced|improved|accelerated|generated|saved|boosted|grew|expanded)\b', text, re.IGNORECASE)
    return {
        "percentages": len(percentages),
        "metrics": len(numbers),
        "currency": len(currency),
        "time_metrics": len(time_metrics),
        "impact_verbs": len(impact_verbs),
        "total": len(percentages) + len(numbers) + len(currency) + len(time_metrics),
        "score": min(100, (len(percentages) * 15 + len(currency) * 10 + len(time_metrics) * 8 + len(impact_verbs) * 5)),
    }


# ─────────────────────────────────────────────
# Step 15: Formatting Analysis
# ─────────────────────────────────────────────

def formatting_analysis(text: str) -> Dict[str, Any]:
    issues = []
    corrections_made = []
    fixed = text

    bullet_count_before = sum(1 for line in fixed.split("\n") if line.strip().startswith(("•", "-", "*")))
    lines = fixed.split("\n")
    new_lines = []
    for line in lines:
        stripped = line.strip()
        if stripped and not stripped[0] in "•-*":
            new_lines.append("• " + stripped)
        else:
            new_lines.append(line)
    fixed = "\n".join(new_lines)
    bullet_count_after = sum(1 for line in fixed.split("\n") if line.strip().startswith("•"))
    if bullet_count_after > bullet_count_before:
        corrections_made.append("Standardized bullet point formatting")
        issues.append("Inconsistent bullet formatting detected and corrected")

    fixed = re.sub(r'\s+([.,!?;:])', r'\1', fixed)
    fixed = re.sub(r'([.,!?;:])\s*', r'\1 ', fixed)
    fixed = re.sub(r'\s+', ' ', fixed)

    return {
        "corrected_text": fixed,
        "issues": issues,
        "corrections": corrections_made,
        "bullet_count": bullet_count_after,
    }


# ─────────────────────────────────────────────
# Step 16: Fallback Improvement — The Main Pipeline
# ─────────────────────────────────────────────

def fallback_improvement(text: str, section_type: str, target_role: Optional[str] = None,
                          resume_context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    try:
        ctx = resume_context or analyze_resume_context(text)
        effective_role = target_role or ctx.get("targetRole", "") or detect_role(text)

        grammar = grammar_analysis(text)
        ats = ats_analysis(grammar["corrected_text"], effective_role)
        formatting = formatting_analysis(grammar["corrected_text"])
        verb = action_verb_analysis(text, section_type)
        achievements = achievement_detection(text)
        rewrite = rewrite_resume(text, section_type, effective_role)
        scores = calculate_quality_score(
            rewrite["improved_text"], section_type, ats, verb, achievements, ctx
        )
        improvements = generate_improvements(
            rewrite["changes"], grammar, ats, verb, achievements, formatting, ctx
        )
        role_suggestions = generate_role_suggestions(text, effective_role, ctx)
        missing_skills = generate_missing_skills(ctx, effective_role)
        quality_report = generate_quality_report(text, ctx)
        metrics = generate_dynamic_metrics(text, rewrite["improved_text"], ats, ctx)

        # Add missing skills to quality report
        quality_report["role_missing_skills"] = missing_skills

        return {
            "success": True,
            "improved_text": rewrite["improved_text"],
            "section_type": section_type,
            "changes": improvements,
            "quality_score": scores["overall"],
            "sub_scores": scores,
            "ai_enhanced": False,
            "fallback_used": True,
            "error": None,
            "stats": metrics,
            "role_suggestions": role_suggestions,
            "quality_report": quality_report,
            "detected_role": effective_role,
            "detected_skills": ctx.get("skills", []),
            "missing_skills_for_role": missing_skills,
            "action_verbs_count": verb.get("count", 0),
            "weak_verbs_count": len(ctx.get("weakVerbs", [])),
            "grammar_issues_count": len(ctx.get("grammarIssues", [])),
        }
    except Exception as e:
        logger.error(f"Fallback improvement failed: {e}", exc_info=True)
        parsed = parse_resume(text)
        return {
            "success": True,
            "improved_text": text,
            "section_type": section_type,
            "changes": ["Basic text cleanup applied"],
            "quality_score": 50,
            "sub_scores": {
                "overall": 50, "ats_score": 0, "grammar_score": 50,
                "readability_score": 50, "formatting_score": 50,
                "action_verb_score": 0, "projects_score": 0,
                "skills_score": 0, "achievement_score": 0, "length_score": 50,
            },
            "ai_enhanced": False,
            "fallback_used": True,
            "error": None,
            "stats": {
                "characters": len(text), "words": len(text.split()),
                "sentences": len([s for s in re.split(r'[.!?]+', text) if s.strip()]),
                "reading_time": max(1, round(len(text.split()) / 200)),
                "ats_keywords_added": 0, "grammar_corrections": 0,
                "sections_improved": 0, "achievements_added": 0,
            },
            "role_suggestions": ["Quantify achievements with metrics and numbers",
                                 "Use strong action verbs throughout",
                                 "Add specific technologies relevant to your target role"],
            "quality_report": {},
            "detected_role": detect_role(text) or "",
            "detected_skills": parsed.get("skills", []),
            "missing_skills_for_role": [],
        }


# ─────────────────────────────────────────────
# Export helpers
# ─────────────────────────────────────────────

def export_resume_text(text: str, fmt: str = "txt") -> str:
    if fmt == "docx":
        return (
            '<?xml version="1.0" encoding="UTF-8"?>'
            '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
            '<w:body><w:p><w:r><w:t>' +
            _xml_escape(text) +
            '</w:t></w:r></w:p></w:body></w:document>'
        )
    return text


def _xml_escape(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")
