import re
import hashlib
import logging
from typing import Set, List, Dict, Any, Tuple, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

# ============================================================
# COMPLETE SKILL DATABASE
# ============================================================

SKILL_DATABASE = {
    # ----- PROGRAMMING LANGUAGES -----
    "Python": ["python", "py", "python3", "python 3"],
    "JavaScript": ["javascript", "js", "es6", "es6+", "node", "nodejs"],
    "TypeScript": ["typescript", "ts", "type script"],
    "Java": ["java", "j2ee", "spring", "spring boot"],
    "C++": ["c++", "cpp", "c plus plus"],
    "C#": ["c#", "csharp", ".net", "dotnet"],
    "Ruby": ["ruby", "rails", "ror"],
    "PHP": ["php", "laravel", "symfony"],
    "Go": ["go", "golang"],
    "Rust": ["rust", "rustlang"],
    "Scala": ["scala"],
    "Kotlin": ["kotlin", "kt"],
    "Swift": ["swift", "ios", "xcode"],
    "R": ["r", "r language", "r programming"],
    "MATLAB": ["matlab"],
    "Shell": ["shell", "bash", "zsh", "sh"],
    "SQL": ["sql", "structured query language"],
    "NoSQL": ["nosql", "non-relational"],
    
    # ----- FRONTEND -----
    "React": ["react", "reactjs", "react.js", "next.js", "nextjs"],
    "Vue.js": ["vue", "vuejs", "vue.js", "nuxt.js"],
    "Angular": ["angular", "angularjs", "angular.js"],
    "Svelte": ["svelte", "sveltejs"],
    "Redux": ["redux", "react-redux", "rtk", "redux toolkit"],
    "Tailwind CSS": ["tailwind", "tailwindcss", "tailwind css"],
    "Bootstrap": ["bootstrap", "bs4", "bs5"],
    "Material-UI": ["material-ui", "mui", "material ui"],
    "SASS": ["sass", "scss"],
    "HTML": ["html", "html5"],
    "CSS": ["css", "css3"],
    "jQuery": ["jquery"],
    "Webpack": ["webpack", "webpack 4", "webpack 5"],
    "Vite": ["vite", "vitejs"],
    
    # ----- BACKEND -----
    "Django": ["django", "drf", "django rest"],
    "Flask": ["flask"],
    "FastAPI": ["fastapi", "fast api"],
    "Node.js": ["node", "nodejs", "node.js"],
    "Express.js": ["express", "expressjs"],
    "NestJS": ["nest", "nestjs"],
    "Spring Boot": ["spring boot", "spring"],
    "REST API": ["rest", "restful", "rest api", "restful api"],
    "GraphQL": ["graphql", "gql"],
    "gRPC": ["grpc"],
    "WebSocket": ["websocket", "ws", "socket.io"],
    "Microservices": ["microservices", "micro-services"],
    "API": ["api", "apis", "api development"],
    
    # ----- DATABASES -----
    "PostgreSQL": ["postgresql", "postgres", "psql"],
    "MySQL": ["mysql", "mariadb"],
    "MongoDB": ["mongodb", "mongo"],
    "Redis": ["redis"],
    "Elasticsearch": ["elasticsearch", "elastic"],
    "Cassandra": ["cassandra"],
    "DynamoDB": ["dynamodb", "dynamo db"],
    "Firebase": ["firebase", "firestore"],
    "SQLite": ["sqlite"],
    "Oracle": ["oracle", "oracle db"],
    "Database": ["database", "database design", "data modeling"],
    
    # ----- CLOUD -----
    "AWS": ["aws", "amazon web services", "ec2", "s3", "lambda", "rds", "vpc"],
    "Azure": ["azure", "microsoft azure"],
    "GCP": ["gcp", "google cloud", "google cloud platform"],
    "Docker": ["docker", "container", "dockerfile", "docker compose"],
    "Kubernetes": ["kubernetes", "k8s", "kube", "helm"],
    "Terraform": ["terraform", "tf", "iac"],
    "Cloud": ["cloud", "cloud computing", "cloud architecture"],
    
    # ----- DEVOPS -----
    "CI/CD": ["ci/cd", "ci cd", "continuous integration", "continuous deployment"],
    "Jenkins": ["jenkins", "jenkins ci"],
    "GitLab CI": ["gitlab ci", "gitlab-ci"],
    "GitHub Actions": ["github actions", "github action"],
    "Linux": ["linux", "ubuntu", "centos", "redhat"],
    "Bash": ["bash", "shell", "bash scripting"],
    
    # ----- AI & ML -----
    "Machine Learning": ["machine learning", "ml", "machine-learning"],
    "Deep Learning": ["deep learning", "dl", "deep-learning"],
    "Data Science": ["data science", "data scientist"],
    "TensorFlow": ["tensorflow", "tf"],
    "PyTorch": ["pytorch", "torch"],
    "Scikit-learn": ["scikit-learn", "sklearn", "scikit"],
    "Pandas": ["pandas"],
    "NumPy": ["numpy"],
    "Data Visualization": ["data visualization", "data viz", "tableau", "power bi"],
    "Statistics": ["statistics", "statistical analysis", "probability"],
    "NLP": ["nlp", "natural language processing"],
    "Computer Vision": ["computer vision", "cv"],
    
    # ----- MOBILE -----
    "Android": ["android", "android development", "android studio"],
    "iOS": ["ios", "ios development", "xcode"],
    "React Native": ["react native", "rn", "react-native"],
    "Flutter": ["flutter"],
    "Kotlin": ["kotlin", "kt"],
    "Swift": ["swift", "swiftui"],
    
    # ----- SECURITY -----
    "Security": ["security", "cybersecurity", "information security"],
    "Penetration Testing": ["penetration testing", "pen testing", "pentesting"],
    "OWASP": ["owasp", "owasp top 10"],
    
    # ----- SOFT SKILLS -----
    "Leadership": ["leadership", "leading", "lead", "team lead", "tech lead"],
    "Communication": ["communication", "communicate", "verbal", "written", "presentation"],
    "Problem Solving": ["problem solving", "problem-solving", "analytical", "critical thinking"],
    "Teamwork": ["teamwork", "team player", "collaboration", "collaborate"],
    "Agile": ["agile", "scrum", "kanban", "sprint", "jira"],
    "Project Management": ["project management", "project manager", "pm", "planning"],
    
    # ----- CERTIFICATIONS -----
    "AWS Certified": ["aws certified", "aws certification", "aws solutions architect"],
    "Azure Certified": ["azure certified", "azure certification"],
    "GCP Certified": ["gcp certified", "google cloud certified"],
    "CKA": ["cka", "certified kubernetes administrator"],
    "PMP": ["pmp", "project management professional"],
    "Scrum Master": ["scrum master", "certified scrum master"],
}

# ============================================================
# ROLE PATTERNS
# ============================================================

ROLE_PATTERNS = {
    "frontend": ["frontend", "react", "angular", "vue", "ui/ux", "ui developer", "front-end"],
    "backend": ["backend", "back-end", "api", "server", "database", "python", "java"],
    "fullstack": ["full stack", "fullstack", "frontend and backend"],
    "data_scientist": ["data scientist", "machine learning", "ml", "ai"],
    "devops": ["devops", "ci/cd", "kubernetes", "docker", "aws"],
    "cloud": ["cloud", "aws", "azure", "gcp"],
    "mobile": ["android", "ios", "react native", "flutter"],
    "qa": ["qa", "testing", "automation", "quality assurance"],
    "security": ["security", "cybersecurity", "penetration testing", "owasp"],
}

# ============================================================
# MAIN SERVICE
# ============================================================

class HiringProbabilityService:
    """Hiring Probability Engine V9.0 - Complete Fix"""
    
    def __init__(self):
        self.cache = {}
        self.skill_db = SKILL_DATABASE
        self.role_patterns = ROLE_PATTERNS
        
        logger.info("=" * 60)
        logger.info("✅ HiringProbabilityService V9.0 Initialized")
        logger.info(f"✅ Skills loaded: {len(self.skill_db)} categories")
        logger.info("=" * 60)
    
    def analyze_job_match(
        self,
        resume_data: Dict[str, Any],
        resume_text: str,
        job_description: str
    ) -> Dict[str, Any]:
        """Main entry point - analyzes job match"""
        
        # ============================================================
        # STEP 1: EXTRACT RESUME DATA (WITH FALLBACKS)
        # ============================================================
        
        # Extract skills from resume (with fallback to text extraction)
        resume_skills = self._extract_resume_skills(resume_data, resume_text)
        
        # Extract job titles
        resume_titles = self._extract_resume_titles(resume_data, resume_text)
        
        # Extract experience
        resume_experience = self._extract_resume_experience(resume_data, resume_text)
        
        # Extract education
        resume_education = self._extract_resume_education(resume_data, resume_text)
        resume_education_level = self._get_education_level(resume_education)
        
        logger.info("=" * 60)
        logger.info("📄 RESUME DATA EXTRACTED")
        logger.info(f"Skills found: {len(resume_skills)}")
        logger.info(f"Job Titles: {resume_titles}")
        logger.info(f"Experience: {resume_experience} years")
        logger.info(f"Education: {resume_education} (level: {resume_education_level})")
        logger.info("=" * 60)
        
        # ============================================================
        # STEP 2: VALIDATE JOB DESCRIPTION (LENIENT)
        # ============================================================
        
        if not job_description or len(job_description.strip()) < 10:
            return self._error_response("Job description is too short")
        
        # ============================================================
        # STEP 3: EXTRACT JOB DATA
        # ============================================================
        
        job_skills = self._extract_job_skills(job_description)
        job_role = self._detect_role(job_description)
        job_experience = self._extract_job_experience(job_description)
        job_education = self._extract_job_education(job_description)
        job_education_level = self._get_education_level(job_education)
        
        logger.info("📄 JOB DATA EXTRACTED")
        logger.info(f"Role: {job_role}")
        logger.info(f"Skills found: {len(job_skills)}")
        logger.info(f"Experience required: {job_experience} years")
        logger.info(f"Education required: {job_education} (level: {job_education_level})")
        logger.info("=" * 60)
        
        # ============================================================
        # STEP 4: CALCULATE MATCH SCORES
        # ============================================================
        
        # 4.1 Role Similarity (25%)
        role_similarity = self._calculate_role_similarity(job_role, resume_titles)
        logger.info(f"🎯 Role Similarity: {role_similarity:.1f}%")
        
        # 4.2 Mandatory Skills (30%)
        mandatory_score, matched_skills, missing_skills = self._calculate_skill_match(
            job_skills, resume_skills
        )
        logger.info(f"📊 Mandatory Skills: {mandatory_score:.1f}%")
        logger.info(f"   Matched: {len(matched_skills)}")
        logger.info(f"   Missing: {len(missing_skills)}")
        
        # 4.3 Experience (15%)
        experience_score = self._calculate_experience_match(resume_experience, job_experience)
        logger.info(f"📊 Experience: {experience_score:.1f}%")
        
        # 4.4 Education (10%)
        education_score = self._calculate_education_match(resume_education_level, job_education_level)
        logger.info(f"📊 Education: {education_score:.1f}%")
        
        # 4.5 Responsibilities (10%)
        responsibility_score = self._calculate_responsibility_match(job_description, resume_text)
        logger.info(f"📊 Responsibilities: {responsibility_score:.1f}%")
        
        # 4.6 Keyword Coverage (10%)
        keyword_score = self._calculate_keyword_coverage(job_description, resume_text)
        logger.info(f"📊 Keyword Coverage: {keyword_score:.1f}%")
        
        # ============================================================
        # STEP 5: CALCULATE OVERALL SCORE
        # ============================================================
        
        # Weighted average
        overall_score = int(
            (role_similarity * 0.25) +
            (mandatory_score * 0.30) +
            (experience_score * 0.15) +
            (education_score * 0.10) +
            (responsibility_score * 0.10) +
            (keyword_score * 0.10)
        )
        
        # Ensure score is between 0-100
        overall_score = max(0, min(100, overall_score))
        
        logger.info("=" * 60)
        logger.info(f"✅ FINAL SCORE: {overall_score}%")
        logger.info("=" * 60)
        
        # ============================================================
        # STEP 6: CLASSIFICATION
        # ============================================================
        
        classification = self._get_classification(overall_score)
        
        # ============================================================
        # STEP 7: GAP ANALYSIS
        # ============================================================
        
        gaps = self._generate_gaps(
            matched_skills, missing_skills,
            resume_experience, job_experience,
            resume_education, job_education,
            overall_score
        )
        
        # ============================================================
        # STEP 8: BUILD RESPONSE
        # ============================================================
        
        return {
            "valid": True,
            "overall_score": overall_score,
            "classification": classification,
            "role_similarity": round(role_similarity, 1),
            "mandatory_skill_score": round(mandatory_score, 1),
            "experience_score": round(experience_score, 1),
            "education_score": round(education_score, 1),
            "responsibility_score": round(responsibility_score, 1),
            "keyword_score": round(keyword_score, 1),
            "matched_skills": matched_skills[:15],
            "missing_skills": missing_skills[:15],
            "experience_gap": gaps["experience_gap"],
            "education_gap": gaps["education_gap"],
            "strengths": gaps["strengths"],
            "recommendations": gaps["recommendations"],
            "debug": {
                "resume_skills_found": len(resume_skills),
                "job_skills_found": len(job_skills),
                "job_role": job_role
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    
    # ============================================================
    # RESUME DATA EXTRACTION METHODS
    # ============================================================
    
    def _extract_resume_skills(self, resume_data: Dict, resume_text: str) -> List[str]:
        """Extract skills from resume data or text"""
        skills = []
        
        # Try from structured data
        if resume_data:
            skills.extend(resume_data.get("skills", []))
            skills.extend(resume_data.get("technologies", []))
        
        # If no skills found, extract from text
        if not skills:
            skills = self._extract_skills_from_text(resume_text)
        
        # Remove duplicates
        return list(dict.fromkeys([s.strip() for s in skills if s]))
    
    def _extract_resume_titles(self, resume_data: Dict, resume_text: str) -> List[str]:
        """Extract job titles from resume"""
        titles = []
        
        if resume_data:
            titles.extend(resume_data.get("job_titles", []))
            if "current_title" in resume_data:
                titles.append(resume_data["current_title"])
        
        # If no titles, try to extract from text
        if not titles:
            # Look for common title patterns
            title_patterns = [
                r'(Senior|Junior|Lead|Principal|Staff)\s+(Software|Frontend|Backend|Full Stack|Data)\s+(Developer|Engineer|Scientist)',
                r'(Software|Frontend|Backend|Data)\s+(Developer|Engineer|Scientist)',
            ]
            for pattern in title_patterns:
                match = re.search(pattern, resume_text, re.IGNORECASE)
                if match:
                    titles.append(match.group(0))
                    break
        
        return [t for t in titles if t]
    
    def _extract_resume_experience(self, resume_data: Dict, resume_text: str) -> float:
        """Extract experience from resume"""
        # Try from structured data
        if resume_data:
            exp = resume_data.get("experience_years", 0)
            if exp > 0:
                return float(exp)
        
        # Extract from text
        exp_match = re.search(
            r'(\d+)\+?\s*(?:years?|yrs?|yr)\s+of\s+(?:experience|work)',
            resume_text,
            re.IGNORECASE
        )
        if exp_match:
            return float(exp_match.group(1))
        
        # Check for keywords
        if 'senior' in resume_text.lower() or 'lead' in resume_text.lower():
            return 5.0
        if 'mid' in resume_text.lower() or 'intermediate' in resume_text.lower():
            return 3.0
        if 'junior' in resume_text.lower() or 'entry' in resume_text.lower():
            return 1.0
        
        return 0.0
    
    def _extract_resume_education(self, resume_data: Dict, resume_text: str) -> str:
        """Extract education from resume"""
        if resume_data:
            edu = resume_data.get("education", "")
            if edu:
                return edu
        
        # Check for degree mentions
        degrees = ['PhD', 'Doctorate', 'Master', 'Bachelor', 'Associate']
        text_lower = resume_text.lower()
        for degree in degrees:
            if degree.lower() in text_lower:
                return degree
        
        return "Unknown"
    
    # ============================================================
    # JOB DATA EXTRACTION METHODS
    # ============================================================
    
    def _extract_skills_from_text(self, text: str) -> List[str]:
        """Extract skills from text"""
        found = []
        text_lower = text.lower()
        
        for skill_name, variations in self.skill_db.items():
            for variation in variations:
                if variation in text_lower:
                    found.append(skill_name)
                    break
        
        return list(dict.fromkeys(found))
    
    def _extract_job_skills(self, job_text: str) -> List[str]:
        """Extract skills from job description"""
        return self._extract_skills_from_text(job_text)
    
    def _extract_job_experience(self, job_text: str) -> int:
        """Extract experience from job description"""
        patterns = [
            r'(\d+)\+?\s*(?:years?|yrs?|yr)\s+of\s+(?:experience|work)',
            r'(\d+)\s*(?:years?|yrs?|yr)\s+experience',
            r'(\d+)\+?\s*(?:years?|yrs?|yr)\s+required',
            r'minimum\s+(\d+)\s*(?:years?|yrs?|yr)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, job_text, re.IGNORECASE)
            if match:
                try:
                    years = int(match.group(1))
                    if 0 < years < 50:
                        return years
                except:
                    pass
        
        if 'entry level' in job_text.lower() or 'junior' in job_text.lower():
            return 1
        if 'senior' in job_text.lower() or 'lead' in job_text.lower():
            return 5
        
        return 2
    
    def _extract_job_education(self, job_text: str) -> str:
        """Extract education from job description"""
        text_lower = job_text.lower()
        
        if 'phd' in text_lower or 'doctorate' in text_lower:
            return "PhD"
        if 'master' in text_lower or 'ms' in text_lower:
            return "Master's"
        if 'bachelor' in text_lower or 'bs' in text_lower or 'degree' in text_lower:
            return "Bachelor's"
        
        return "Unknown"
    
    def _get_education_level(self, education: str) -> int:
        """Convert education to level"""
        edu_lower = education.lower()
        
        if 'phd' in edu_lower or 'doctorate' in edu_lower:
            return 5
        if 'master' in edu_lower or 'ms' in edu_lower:
            return 4
        if 'bachelor' in edu_lower or 'bs' in edu_lower or 'degree' in edu_lower:
            return 3
        if 'associate' in edu_lower:
            return 2
        
        return 0
    
    def _detect_role(self, job_text: str) -> str:
        """Detect role from job description"""
        text_lower = job_text.lower()
        
        for role, patterns in self.role_patterns.items():
            if any(pattern in text_lower for pattern in patterns):
                return role
        
        return "fullstack"
    
    # ============================================================
    # MATCHING ENGINE
    # ============================================================
    
    def _calculate_role_similarity(self, job_role: str, resume_titles: List[str]) -> float:
        """Calculate role similarity"""
        if not job_role or not resume_titles:
            return 0.0
        
        job_role_lower = job_role.lower()
        
        for title in resume_titles:
            title_lower = title.lower()
            
            # Exact or partial match
            if job_role_lower in title_lower or title_lower in job_role_lower:
                return 95.0
            
            # Category matching
            job_cat = None
            title_cat = None
            
            for cat, patterns in self.role_patterns.items():
                if any(p in job_role_lower for p in patterns):
                    job_cat = cat
                if any(p in title_lower for p in patterns):
                    title_cat = cat
            
            if job_cat and title_cat:
                if job_cat == title_cat:
                    return 90.0
        
        return 30.0
    
    def _calculate_skill_match(self, job_skills: List[str], resume_skills: List[str]) -> Tuple[float, List[str], List[str]]:
        """Calculate skill match"""
        if not job_skills:
            return 100.0, [], []
        
        if not resume_skills:
            return 0.0, [], job_skills
        
        # Normalize for comparison
        def normalize(s):
            return s.lower().strip().replace(" ", "").replace("-", "").replace(".", "")
        
        resume_norm = [normalize(s) for s in resume_skills]
        job_norm = [normalize(s) for s in job_skills]
        
        matched = []
        missing = []
        
        for skill, skill_norm in zip(job_skills, job_norm):
            found = False
            for i, (res_skill, res_norm) in enumerate(zip(resume_skills, resume_norm)):
                if skill_norm in res_norm or res_norm in skill_norm:
                    matched.append(skill)
                    found = True
                    break
            if not found:
                missing.append(skill)
        
        score = (len(matched) / len(job_skills)) * 100 if job_skills else 100.0
        
        return round(score, 1), matched, missing
    
    def _calculate_experience_match(self, resume_exp: float, job_exp: int) -> float:
        """Calculate experience match"""
        if job_exp <= 0:
            return 100.0
        
        if resume_exp <= 0:
            return 0.0
        
        if resume_exp >= job_exp:
            return 100.0
        
        return min(100.0, (resume_exp / job_exp) * 100)
    
    def _calculate_education_match(self, resume_level: int, job_level: int) -> float:
        """Calculate education match"""
        if job_level <= 0:
            return 100.0
        
        if resume_level <= 0:
            return 0.0
        
        if resume_level >= job_level:
            return 100.0
        
        return min(100.0, (resume_level / job_level) * 100)
    
    def _calculate_responsibility_match(self, job_text: str, resume_text: str) -> float:
        """Calculate responsibility match"""
        if not job_text or not resume_text:
            return 0.0
        
        # Extract key phrases
        job_words = set(re.findall(r'[A-Za-z]{4,}', job_text.lower()))
        resume_words = set(re.findall(r'[A-Za-z]{4,}', resume_text.lower()))
        
        # Remove common words
        common = {'with', 'from', 'that', 'this', 'have', 'will', 'your', 'about', 'they', 'what'}
        job_words = job_words - common
        resume_words = resume_words - common
        
        if not job_words:
            return 100.0
        
        matched = len(job_words & resume_words)
        
        return min(100.0, (matched / len(job_words)) * 100)
    
    def _calculate_keyword_coverage(self, job_text: str, resume_text: str) -> float:
        """Calculate keyword coverage"""
        if not job_text or not resume_text:
            return 0.0
        
        # Extract important keywords
        words = re.findall(r'[A-Za-z]{4,}', job_text.lower())
        word_freq = {}
        
        for word in words:
            if word not in ['with', 'from', 'that', 'this', 'have', 'will', 'your']:
                word_freq[word] = word_freq.get(word, 0) + 1
        
        important = [w for w, f in word_freq.items() if f > 1]
        
        if not important:
            return 100.0
        
        resume_lower = resume_text.lower()
        found = sum(1 for kw in important if kw in resume_lower)
        
        return min(100.0, (found / len(important)) * 100)
    
    # ============================================================
    # CLASSIFICATION
    # ============================================================
    
    def _get_classification(self, score: float) -> str:
        """Get classification"""
        if score >= 90:
            return "Excellent Match 🏆"
        elif score >= 75:
            return "Strong Match ✅"
        elif score >= 60:
            return "Good Match 👍"
        elif score >= 40:
            return "Partial Match ⚠️"
        elif score >= 20:
            return "Weak Match 🔴"
        else:
            return "Poor Match ❌"
    
    # ============================================================
    # GAP ANALYSIS
    # ============================================================
    
    def _generate_gaps(
        self,
        matched_skills: List[str],
        missing_skills: List[str],
        resume_exp: float,
        job_exp: int,
        resume_edu: str,
        job_edu: str,
        score: float
    ) -> Dict:
        """Generate gap analysis"""
        
        strengths = []
        recommendations = []
        
        if len(matched_skills) > 5:
            strengths.append(f"Strong skill match with {len(matched_skills)} matching skills")
        
        if resume_exp >= job_exp:
            strengths.append("Experience meets or exceeds requirements")
        
        if missing_skills:
            top_missing = missing_skills[:3]
            recommendations.append(f"Add these skills: {', '.join(top_missing)}")
        
        if resume_exp < job_exp:
            gap = job_exp - resume_exp
            recommendations.append(f"Gain {gap:.0f} more years of experience")
        
        resume_level = self._get_education_level(resume_edu)
        job_level = self._get_education_level(job_edu)
        
        if resume_level < job_level:
            recommendations.append(f"Consider {job_edu} or equivalent")
        
        if not recommendations:
            recommendations.append("Continue building your portfolio")
        
        return {
            "strengths": strengths[:3],
            "recommendations": recommendations[:5],
            "experience_gap": f"Resume: {resume_exp:.1f} years. Job: {job_exp} years." if resume_exp < job_exp else "Experience meets requirements",
            "education_gap": f"Resume: {resume_edu}. Job: {job_edu}." if resume_level < job_level else "Education meets requirements"
        }
    
    # ============================================================
    # ERROR RESPONSE
    # ============================================================
    
    def _error_response(self, reason: str) -> Dict:
        """Generate error response"""
        return {
            "valid": False,
            "overall_score": 0,
            "classification": "Invalid",
            "reason": reason,
            "timestamp": datetime.utcnow().isoformat()
        }


# ============================================================
# SINGLETON INSTANCE
# ============================================================

hiring_service = HiringProbabilityService()
