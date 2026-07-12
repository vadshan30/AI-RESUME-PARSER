import logging
from typing import Dict, List, Any

logger = logging.getLogger(__name__)

ROLE_FAMILIES = {
    "frontend": {
        "display": "Frontend Development",
        "required_skills": [
            "React", "JavaScript", "TypeScript", "HTML", "CSS",
            "Git", "REST APIs", "Responsive Design"
        ],
        "preferred_skills": [
            "Next.js", "Tailwind CSS", "Redux", "GraphQL",
            "Webpack/Vite", "Jest", "Cypress", "Storybook"
        ],
        "soft_skills": ["Communication", "Problem Solving", "Collaboration", "Attention to Detail"],
        "certifications": ["Meta Front-End Developer", "Google UX Design", "AWS Certified Developer"],
        "experience_required": {"Entry": 0, "Junior": 1, "Mid": 3, "Senior": 5, "Lead": 7},
        "salary_range": {
            "Entry": {"india": "₹3–6 LPA", "usa": "$50k–$70k", "remote": "$40k–$60k"},
            "Junior": {"india": "₹6–12 LPA", "usa": "$70k–$95k", "remote": "$60k–$80k"},
            "Mid": {"india": "₹12–22 LPA", "usa": "$95k–$130k", "remote": "$85k–$110k"},
            "Senior": {"india": "₹22–40 LPA", "usa": "$130k–$170k", "remote": "$110k–$145k"},
            "Lead": {"india": "₹40–65 LPA", "usa": "$170k–$220k", "remote": "$145k–$185k"},
        },
        "top_companies": ["Google", "Meta", "Amazon", "Microsoft", "Stripe", "Airbnb", "Netflix"],
        "trending_skills": ["Next.js", "TypeScript", "Tailwind CSS", "tRPC", "Vitest"],
        "demand_level": {"Entry": "High", "Junior": "Very High", "Mid": "Very High", "Senior": "High", "Lead": "Moderate"},
        "industry": "Technology / Software",
        "career_outlook": "Strong — frontend roles continue growing with web app demand and design systems maturity.",
        "promotion_potential": "High — can progress to Senior/Lead, Staff Engineer, or Engineering Manager.",
        "competition": {
            "Entry": "High — many bootcamp grads and self-taught developers.",
            "Junior": "High — competitive entry-level market.",
            "Mid": "Moderate — experienced devs are in demand.",
            "Senior": "Low-Moderate — senior talent is scarce.",
            "Lead": "Low — very few qualified candidates at this level.",
        }
    },
    "backend": {
        "display": "Backend Engineering",
        "required_skills": [
            "Python", "Java", "SQL", "REST APIs", "Git",
            "Docker", "Database Design", "API Security"
        ],
        "preferred_skills": [
            "Kubernetes", "Redis", "Message Queues", "Microservices",
            "AWS/GCP", "CI/CD", "GraphQL", "NoSQL Databases"
        ],
        "soft_skills": ["Problem Solving", "System Design", "Communication", "Analytical Thinking"],
        "certifications": ["AWS Certified Solutions Architect", "Google Professional Cloud Architect", "Oracle Certified"],
        "experience_required": {"Entry": 0, "Junior": 1, "Mid": 3, "Senior": 5, "Lead": 7},
        "salary_range": {
            "Entry": {"india": "₹4–7 LPA", "usa": "$55k–$75k", "remote": "$45k–$65k"},
            "Junior": {"india": "₹7–14 LPA", "usa": "$75k–$100k", "remote": "$65k–$85k"},
            "Mid": {"india": "₹14–25 LPA", "usa": "$100k–$140k", "remote": "$90k–$120k"},
            "Senior": {"india": "₹25–45 LPA", "usa": "$140k–$180k", "remote": "$120k–$155k"},
            "Lead": {"india": "₹45–70 LPA", "usa": "$180k–$230k", "remote": "$155k–$200k"},
        },
        "top_companies": ["Google", "Amazon", "Microsoft", "Uber", "Stripe", "Flipkart", "Swiggy"],
        "trending_skills": ["Go", "Rust", "Kafka", "gRPC", "Dapr", "eBPF"],
        "demand_level": {"Entry": "High", "Junior": "Very High", "Mid": "Very High", "Senior": "Very High", "Lead": "High"},
        "industry": "Technology / Software",
        "career_outlook": "Excellent — backbone of all digital products; demand consistently high.",
        "promotion_potential": "Very High — clear path to Staff Engineer, Architect, or Engineering Manager.",
        "competition": {
            "Entry": "High — large pool of CS graduates.",
            "Junior": "High — competitive market for early career.",
            "Mid": "Moderate — good opportunities for skilled engineers.",
            "Senior": "Low-Moderate — strong demand for senior talent.",
            "Lead": "Low — leadership roles are hard to fill.",
        }
    },
    "fullstack": {
        "display": "Full Stack Development",
        "required_skills": [
            "JavaScript", "TypeScript", "React", "Node.js", "SQL",
            "REST APIs", "Git", "HTML", "CSS", "Docker"
        ],
        "preferred_skills": [
            "Next.js", "PostgreSQL", "AWS/GCP", "Redis",
            "GraphQL", "CI/CD", "Tailwind CSS", "Prisma"
        ],
        "soft_skills": ["Problem Solving", "Communication", "Adaptability", "Product Thinking"],
        "certifications": ["AWS Certified Developer", "Meta Full Stack Developer", "Google Cloud Developer"],
        "experience_required": {"Entry": 0, "Junior": 1, "Mid": 3, "Senior": 5, "Lead": 7},
        "salary_range": {
            "Entry": {"india": "₹4–7 LPA", "usa": "$55k–$80k", "remote": "$45k–$65k"},
            "Junior": {"india": "₹7–15 LPA", "usa": "$80k–$105k", "remote": "$65k–$90k"},
            "Mid": {"india": "₹15–28 LPA", "usa": "$105k–$145k", "remote": "$90k–$125k"},
            "Senior": {"india": "₹28–50 LPA", "usa": "$145k–$190k", "remote": "$125k–$160k"},
            "Lead": {"india": "₹50–80 LPA", "usa": "$190k–$250k", "remote": "$160k–$210k"},
        },
        "top_companies": ["Google", "Meta", "Amazon", "Microsoft", "Atlassian", "Zoho", "Razorpay"],
        "trending_skills": ["Next.js", "tRPC", "Tailwind CSS", "Prisma", "PlanetScale", "Vercel"],
        "demand_level": {"Entry": "High", "Junior": "Very High", "Mid": "Very High", "Senior": "Very High", "Lead": "High"},
        "industry": "Technology / Software / Startups",
        "career_outlook": "Excellent — full stack skills are prized at startups and mid-size companies.",
        "promotion_potential": "High — can lead full teams or become CTO at startups.",
        "competition": {
            "Entry": "High — many applicants claim full stack skills.",
            "Junior": "Moderate-High — genuine full stack ability stands out.",
            "Mid": "Moderate — strong demand for experienced full stack devs.",
            "Senior": "Low-Moderate — rare combination of breadth and depth.",
            "Lead": "Low — top talent is highly recruited.",
        }
    },
    "data_science": {
        "display": "Data Science & Analytics",
        "required_skills": [
            "Python", "SQL", "Machine Learning", "Statistics",
            "Pandas", "NumPy", "Data Visualization", "Git"
        ],
        "preferred_skills": [
            "TensorFlow/PyTorch", "Deep Learning", "NLP", "Spark",
            "Tableau/Power BI", "Cloud ML (AWS/GCP)", "MLOps"
        ],
        "soft_skills": ["Analytical Thinking", "Communication", "Business Acumen", "Curiosity"],
        "certifications": ["Google Data Analytics Professional", "AWS Certified ML Specialty", "TensorFlow Developer"],
        "experience_required": {"Entry": 0, "Junior": 1, "Mid": 3, "Senior": 5, "Lead": 7},
        "salary_range": {
            "Entry": {"india": "₹4–8 LPA", "usa": "$60k–$85k", "remote": "$50k–$70k"},
            "Junior": {"india": "₹8–16 LPA", "usa": "$85k–$115k", "remote": "$70k–$95k"},
            "Mid": {"india": "₹16–30 LPA", "usa": "$115k–$155k", "remote": "$95k–$130k"},
            "Senior": {"india": "₹30–55 LPA", "usa": "$155k–$200k", "remote": "$130k–$170k"},
            "Lead": {"india": "₹55–85 LPA", "usa": "$200k–$260k", "remote": "$170k–$220k"},
        },
        "top_companies": ["Google", "Meta", "Amazon", "Microsoft", "Uber", "LinkedIn", "Spotify"],
        "trending_skills": ["LLMs", "RAG", "MLOps", "Vector Databases", "Causal Inference", "XGBoost"],
        "demand_level": {"Entry": "High", "Junior": "Very High", "Mid": "Very High", "Senior": "Very High", "Lead": "High"},
        "industry": "Technology / Finance / Healthcare / E-commerce",
        "career_outlook": "Very Strong — data-driven decision making is a top priority across all industries.",
        "promotion_potential": "High — path to Lead Data Scientist, Head of Analytics, or Chief Data Officer.",
        "competition": {
            "Entry": "Very High — many PhDs and bootcamp grads compete.",
            "Junior": "High — strong competition for data roles.",
            "Mid": "Moderate — experienced data scientists are valued.",
            "Senior": "Low-Moderate — senior data scientists are hard to find.",
            "Lead": "Low — leadership roles are scarce and specialized.",
        }
    },
    "ai_ml": {
        "display": "AI / Machine Learning Engineering",
        "required_skills": [
            "Python", "Machine Learning", "Deep Learning", "SQL",
            "TensorFlow/PyTorch", "Data Processing", "Git"
        ],
        "preferred_skills": [
            "NLP", "Computer Vision", "MLOps", "Kubernetes",
            "Spark", "AWS SageMaker/GCP Vertex AI", "Model Deployment"
        ],
        "soft_skills": ["Research Mindset", "Problem Solving", "Analytical Thinking", "Communication"],
        "certifications": ["AWS Certified ML Specialty", "TensorFlow Developer", "Google ML Engineer"],
        "experience_required": {"Entry": 0, "Junior": 1, "Mid": 3, "Senior": 5, "Lead": 7},
        "salary_range": {
            "Entry": {"india": "₹5–10 LPA", "usa": "$70k–$95k", "remote": "$55k–$80k"},
            "Junior": {"india": "₹10–20 LPA", "usa": "$95k–$130k", "remote": "$80k–$110k"},
            "Mid": {"india": "₹20–38 LPA", "usa": "$130k–$175k", "remote": "$110k–$145k"},
            "Senior": {"india": "₹38–65 LPA", "usa": "$175k–$225k", "remote": "$145k–$190k"},
            "Lead": {"india": "₹65–100 LPA", "usa": "$225k–$300k", "remote": "$190k–$250k"},
        },
        "top_companies": ["Google DeepMind", "OpenAI", "Meta AI", "Anthropic", "Microsoft Research", "NVIDIA"],
        "trending_skills": ["LLMs", "RAG", "Agentic AI", "Fine-tuning", "Vector Databases", "Prompt Engineering"],
        "demand_level": {"Entry": "Very High", "Junior": "Very High", "Mid": "Very High", "Senior": "Very High", "Lead": "Very High"},
        "industry": "Technology / AI / Research / Finance",
        "career_outlook": "Explosive growth — AI is the defining technology of the decade with unmatched demand.",
        "promotion_potential": "Very High — path to Senior ML Engineer, AI Architect, or Director of AI.",
        "competition": {
            "Entry": "Very High — massive influx of candidates.",
            "Junior": "High — requires strong theoretical foundations.",
            "Mid": "Moderate — practical deployment skills are rare.",
            "Senior": "Low — deep expertise in high demand.",
            "Lead": "Very Low — top tier talent is aggressively recruited.",
        }
    },
    "devops": {
        "display": "DevOps / Site Reliability Engineering",
        "required_skills": [
            "Docker", "Kubernetes", "CI/CD", "Linux", "Git",
            "Cloud Platforms (AWS/Azure/GCP)", "Scripting (Python/Bash)"
        ],
        "preferred_skills": [
            "Terraform", "Ansible", "Prometheus", "Grafana",
            "Helm", "ArgoCD", "Istio", "Observability Stack"
        ],
        "soft_skills": ["Problem Solving", "System Design", "Automation Mindset", "Collaboration"],
        "certifications": ["AWS Certified DevOps Engineer", "CKA (Certified Kubernetes Admin)", "Google Cloud DevOps"],
        "experience_required": {"Entry": 0, "Junior": 1, "Mid": 3, "Senior": 5, "Lead": 7},
        "salary_range": {
            "Entry": {"india": "₹4–8 LPA", "usa": "$60k–$85k", "remote": "$50k–$70k"},
            "Junior": {"india": "₹8–16 LPA", "usa": "$85k–$115k", "remote": "$70k–$95k"},
            "Mid": {"india": "₹16–30 LPA", "usa": "$115k–$155k", "remote": "$95k–$130k"},
            "Senior": {"india": "₹30–55 LPA", "usa": "$155k–$200k", "remote": "$130k–$170k"},
            "Lead": {"india": "₹55–85 LPA", "usa": "$200k–$260k", "remote": "$170k–$220k"},
        },
        "top_companies": ["Google", "Amazon", "Microsoft", "Netflix", "Uber", "Spotify", "Atlassian"],
        "trending_skills": ["GitOps", "Platform Engineering", "eBPF", "Service Mesh", "Chaos Engineering"],
        "demand_level": {"Entry": "High", "Junior": "High", "Mid": "Very High", "Senior": "Very High", "Lead": "High"},
        "industry": "Technology / Cloud / SaaS / Enterprise",
        "career_outlook": "Very Strong — DevOps is critical to modern software delivery at scale.",
        "promotion_potential": "High — can become Platform Engineer, SRE Manager, or Cloud Architect.",
        "competition": {
            "Entry": "Moderate — fewer entry-level DevOps roles exist.",
            "Junior": "Moderate — requires hands-on infrastructure knowledge.",
            "Mid": "Moderate — good demand for experienced engineers.",
            "Senior": "Low — senior SRE/DevOps talent is scarce.",
            "Lead": "Low — platform leads are highly valued.",
        }
    },
    "cloud": {
        "display": "Cloud Engineering",
        "required_skills": [
            "AWS/Azure/GCP", "Docker", "Kubernetes", "Linux",
            "Infrastructure as Code", "Python", "CI/CD", "Networking"
        ],
        "preferred_skills": [
            "Terraform", "Cloud Security", "Serverless", "Multi-Cloud",
            "Cost Optimization", "IAM", "Cloud Migration"
        ],
        "soft_skills": ["System Design", "Problem Solving", "Documentation", "Collaboration"],
        "certifications": ["AWS Solutions Architect", "Google Cloud Architect", "Azure Solutions Architect"],
        "experience_required": {"Entry": 0, "Junior": 1, "Mid": 3, "Senior": 5, "Lead": 7},
        "salary_range": {
            "Entry": {"india": "₹4–7 LPA", "usa": "$55k–$80k", "remote": "$45k–$65k"},
            "Junior": {"india": "₹7–15 LPA", "usa": "$80k–$110k", "remote": "$65k–$90k"},
            "Mid": {"india": "₹15–28 LPA", "usa": "$110k–$150k", "remote": "$90k–$125k"},
            "Senior": {"india": "₹28–50 LPA", "usa": "$150k–$195k", "remote": "$125k–$165k"},
            "Lead": {"india": "₹50–80 LPA", "usa": "$195k–$250k", "remote": "$165k–$210k"},
        },
        "top_companies": ["AWS", "Google Cloud", "Azure", "Oracle Cloud", "Cloudflare", "Datadog", "HashiCorp"],
        "trending_skills": ["Multi-Cloud", "FinOps", "Cloud Security", "Serverless", "Edge Computing"],
        "demand_level": {"Entry": "High", "Junior": "High", "Mid": "Very High", "Senior": "Very High", "Lead": "High"},
        "industry": "Cloud Computing / Technology / Enterprise",
        "career_outlook": "Very Strong — cloud adoption continues to accelerate across all industries.",
        "promotion_potential": "High — path to Cloud Architect, Head of Cloud, or CTO.",
        "competition": {
            "Entry": "Moderate — cloud skills require hands-on experience.",
            "Junior": "Moderate — certified professionals stand out.",
            "Mid": "Moderate — demand is high for experienced engineers.",
            "Senior": "Low-Moderate — senior architects are well-compensated.",
            "Lead": "Low — cloud leadership roles are niche.",
        }
    },
    "mobile": {
        "display": "Mobile Development",
        "required_skills": [
            "Kotlin", "Java", "Swift", "Android SDK", "iOS SDK",
            "REST APIs", "Git", "App Architecture (MVVM/MVC)"
        ],
        "preferred_skills": [
            "Flutter", "React Native", "CI/CD for Mobile", "App Store Deployment",
            "Firebase", "Unit Testing", "Performance Optimization"
        ],
        "soft_skills": ["User Focus", "Problem Solving", "Attention to Detail", "Communication"],
        "certifications": ["Google Associate Android Developer", "Apple Certified iOS Developer"],
        "experience_required": {"Entry": 0, "Junior": 1, "Mid": 3, "Senior": 5, "Lead": 7},
        "salary_range": {
            "Entry": {"india": "₹3–6 LPA", "usa": "$50k–$70k", "remote": "$40k–$60k"},
            "Junior": {"india": "₹6–12 LPA", "usa": "$70k–$95k", "remote": "$60k–$80k"},
            "Mid": {"india": "₹12–22 LPA", "usa": "$95k–$130k", "remote": "$80k–$110k"},
            "Senior": {"india": "₹22–40 LPA", "usa": "$130k–$170k", "remote": "$110k–$145k"},
            "Lead": {"india": "₹40–65 LPA", "usa": "$170k–$220k", "remote": "$145k–$185k"},
        },
        "top_companies": ["Google", "Apple", "Meta", "Uber", "Spotify", "Swiggy", "Zomato"],
        "trending_skills": ["Kotlin Multiplatform", "SwiftUI", "Compose", "Flutter", "App Clips"],
        "demand_level": {"Entry": "High", "Junior": "High", "Mid": "High", "Senior": "High", "Lead": "Moderate"},
        "industry": "Technology / Consumer Apps / E-commerce",
        "career_outlook": "Stable — mobile is mature but continues to require specialized developers.",
        "promotion_potential": "Moderate-High — path to Lead Mobile Developer or Mobile Architect.",
        "competition": {
            "Entry": "High — many self-taught mobile developers.",
            "Junior": "Moderate-High — specialization helps.",
            "Mid": "Moderate — experienced devs with published apps stand out.",
            "Senior": "Low-Moderate — mobile seniors are well-compensated.",
            "Lead": "Low — platform-specific leads are rare.",
        }
    },
    "security": {
        "display": "Cybersecurity",
        "required_skills": [
            "Network Security", "Linux", "Scripting (Python/Bash)",
            "Security Assessment", "Firewalls", "IAM", "Encryption"
        ],
        "preferred_skills": [
            "Penetration Testing", "SIEM Tools", "Cloud Security",
            "Incident Response", "Compliance (GDPR/SOC2)", "Threat Modeling"
        ],
        "soft_skills": ["Analytical Thinking", "Attention to Detail", "Communication", "Ethical Mindset"],
        "certifications": ["CISSP", "CEH", "CompTIA Security+", "CISM", "OSCP"],
        "experience_required": {"Entry": 0, "Junior": 1, "Mid": 3, "Senior": 5, "Lead": 7},
        "salary_range": {
            "Entry": {"india": "₹4–7 LPA", "usa": "$55k–$80k", "remote": "$45k–$65k"},
            "Junior": {"india": "₹7–14 LPA", "usa": "$80k–$110k", "remote": "$65k–$90k"},
            "Mid": {"india": "₹14–28 LPA", "usa": "$110k–$150k", "remote": "$90k–$125k"},
            "Senior": {"india": "₹28–50 LPA", "usa": "$150k–$195k", "remote": "$125k–$165k"},
            "Lead": {"india": "₹50–80 LPA", "usa": "$195k–$250k", "remote": "$165k–$210k"},
        },
        "top_companies": ["CrowdStrike", "Palo Alto Networks", "Cloudflare", "Cisco", "Okta", "Zscaler"],
        "trending_skills": ["Zero Trust", "Cloud Security", "SOAR", "XDR", "AI Security"],
        "demand_level": {"Entry": "Very High", "Junior": "Very High", "Mid": "Very High", "Senior": "Very High", "Lead": "Very High"},
        "industry": "Cybersecurity / Technology / Finance / Government",
        "career_outlook": "Extremely Strong — cyber threats are growing and talent shortage is acute.",
        "promotion_potential": "Very High — path to Security Architect, CISO, or Head of Security.",
        "competition": {
            "Entry": "Moderate — fewer entry-level cybersecurity roles.",
            "Junior": "Moderate — certifications help break in.",
            "Mid": "Moderate — hands-on security engineers are in high demand.",
            "Senior": "Low — senior security professionals are very scarce.",
            "Lead": "Very Low — CISO-level talent is extremely rare.",
        }
    },
    "qa": {
        "display": "Quality Assurance & Testing",
        "required_skills": [
            "Test Automation", "Selenium", "API Testing", "SQL",
            "Agile/Scrum", "Bug Tracking", "Test Case Design"
        ],
        "preferred_skills": [
            "Cypress", "Playwright", "Performance Testing", "CI/CD",
            "Python/JavaScript", "Mobile Testing", "Security Testing"
        ],
        "soft_skills": ["Attention to Detail", "Analytical Thinking", "Communication", "Patience"],
        "certifications": ["ISTQB Certified", "AWS Certified DevOps", "Certified Software Tester"],
        "experience_required": {"Entry": 0, "Junior": 1, "Mid": 3, "Senior": 5, "Lead": 7},
        "salary_range": {
            "Entry": {"india": "₹3–5 LPA", "usa": "$45k–$65k", "remote": "$35k–$55k"},
            "Junior": {"india": "₹5–10 LPA", "usa": "$65k–$85k", "remote": "$55k–$75k"},
            "Mid": {"india": "₹10–18 LPA", "usa": "$85k–$115k", "remote": "$75k–$95k"},
            "Senior": {"india": "₹18–30 LPA", "usa": "$115k–$150k", "remote": "$95k–$130k"},
            "Lead": {"india": "₹30–50 LPA", "usa": "$150k–$190k", "remote": "$130k–$165k"},
        },
        "top_companies": ["Google", "Microsoft", "Amazon", "Atlassian", "BrowserStack", "Testlio"],
        "trending_skills": ["Playwright", "Cypress", "Test Automation Frameworks", "Shift-Left Testing", "AI Testing"],
        "demand_level": {"Entry": "Moderate", "Junior": "Moderate", "Mid": "High", "Senior": "High", "Lead": "Moderate"},
        "industry": "Technology / SaaS / E-commerce",
        "career_outlook": "Stable — QA is essential but automation is shifting the skill requirements.",
        "promotion_potential": "Moderate — path to QA Lead, Test Architect, or QA Manager.",
        "competition": {
            "Entry": "Moderate — fewer entry-level QA roles as automation grows.",
            "Junior": "Moderate — automation skills are differentiators.",
            "Mid": "Moderate — experienced QA engineers with coding skills are in demand.",
            "Senior": "Low-Moderate — senior SDETs are valued.",
            "Lead": "Low — QA leadership roles are limited.",
        }
    },
    "design": {
        "display": "UI/UX Design",
        "required_skills": [
            "Figma", "User Research", "Wireframing", "Prototyping",
            "Design Systems", "Visual Design", "Information Architecture"
        ],
        "preferred_skills": [
            "Motion Design", "HTML/CSS", "Usability Testing", "Accessibility",
            "Design Tokens", "Data Visualization", "Illustration"
        ],
        "soft_skills": ["Empathy", "Communication", "Creativity", "Collaboration", "User Focus"],
        "certifications": ["Google UX Design", "Interaction Design Foundation", "NN/g UX Certification"],
        "experience_required": {"Entry": 0, "Junior": 1, "Mid": 3, "Senior": 5, "Lead": 7},
        "salary_range": {
            "Entry": {"india": "₹3–6 LPA", "usa": "$45k–$65k", "remote": "$35k–$55k"},
            "Junior": {"india": "₹6–12 LPA", "usa": "$65k–$90k", "remote": "$55k–$75k"},
            "Mid": {"india": "₹12–22 LPA", "usa": "$90k–$130k", "remote": "$75k–$105k"},
            "Senior": {"india": "₹22–38 LPA", "usa": "$130k–$170k", "remote": "$105k–$140k"},
            "Lead": {"india": "₹38–60 LPA", "usa": "$170k–$220k", "remote": "$140k–$185k"},
        },
        "top_companies": ["Apple", "Google", "Meta", "Airbnb", "Figma", "Spotify", "Adobe"],
        "trending_skills": ["Design Systems", "Figma Advanced", "Motion Design", "UX Writing", "AI for Design"],
        "demand_level": {"Entry": "High", "Junior": "High", "Mid": "High", "Senior": "High", "Lead": "Moderate"},
        "industry": "Technology / Design / Consumer Products",
        "career_outlook": "Strong — design is increasingly valued in product-led organizations.",
        "promotion_potential": "Moderate-High — path to Lead Designer, Design Director, or Head of Design.",
        "competition": {
            "Entry": "Very High — many bootcamp grads with portfolios.",
            "Junior": "High — strong portfolio is essential to stand out.",
            "Mid": "Moderate — experienced designers with UX research skills shine.",
            "Senior": "Low-Moderate — senior design talent is competitive.",
            "Lead": "Low — design leaders are rare and highly compensated.",
        }
    },
    "data_analyst": {
        "display": "Data Analytics",
        "required_skills": [
            "SQL", "Excel", "Python", "Data Visualization",
            "Statistics", "Critical Thinking", "Dashboarding"
        ],
        "preferred_skills": [
            "Tableau/Power BI", "R", "BigQuery", "Data Warehousing",
            "ETL Processes", "AB Testing", "Snowflake"
        ],
        "soft_skills": ["Analytical Thinking", "Business Acumen", "Communication", "Storytelling"],
        "certifications": ["Google Data Analytics", "Microsoft PL-300", "Tableau Desktop Specialist"],
        "experience_required": {"Entry": 0, "Junior": 1, "Mid": 3, "Senior": 5, "Lead": 7},
        "salary_range": {
            "Entry": {"india": "₹3–6 LPA", "usa": "$45k–$65k", "remote": "$35k–$55k"},
            "Junior": {"india": "₹6–12 LPA", "usa": "$65k–$85k", "remote": "$55k–$75k"},
            "Mid": {"india": "₹12–20 LPA", "usa": "$85k–$115k", "remote": "$75k–$100k"},
            "Senior": {"india": "₹20–35 LPA", "usa": "$115k–$150k", "remote": "$100k–$130k"},
            "Lead": {"india": "₹35–55 LPA", "usa": "$150k–$190k", "remote": "$130k–$165k"},
        },
        "top_companies": ["Google", "Amazon", "Microsoft", "Flipkart", "Swiggy", "Zomato", "Razorpay"],
        "trending_skills": ["SQL Advanced", "Python", "Looker", "dbt", "Data Storytelling", "Airflow"],
        "demand_level": {"Entry": "High", "Junior": "Very High", "Mid": "Very High", "Senior": "Very High", "Lead": "High"},
        "industry": "Technology / Finance / E-commerce / Consulting",
        "career_outlook": "Very Strong — every company needs data-driven decision making.",
        "promotion_potential": "High — path to Senior Analyst, Analytics Manager, or Head of Analytics.",
        "competition": {
            "Entry": "High — many applicants with SQL skills.",
            "Junior": "Moderate-High — domain knowledge helps.",
            "Mid": "Moderate — experienced analysts with business impact stand out.",
            "Senior": "Low-Moderate — senior analysts who drive strategy are in demand.",
            "Lead": "Low — analytics leadership roles are limited.",
        }
    },
    "product": {
        "display": "Product Management",
        "required_skills": [
            "Product Strategy", "User Research", "Data Analysis",
            "Agile/Scrum", "Roadmapping", "Stakeholder Management"
        ],
        "preferred_skills": [
            "Technical Background", "A/B Testing", "Wireframing",
            "SQL", "Competitive Analysis", "Go-to-Market Strategy"
        ],
        "soft_skills": ["Leadership", "Communication", "Empathy", "Strategic Thinking", "Negotiation"],
        "certifications": ["SPO (Scrum Product Owner)", "Google Project Management", "Pragmatic Institute"],
        "experience_required": {"Entry": 0, "Junior": 1, "Mid": 3, "Senior": 5, "Lead": 7},
        "salary_range": {
            "Entry": {"india": "₹5–10 LPA", "usa": "$65k–$90k", "remote": "$55k–$75k"},
            "Junior": {"india": "₹10–20 LPA", "usa": "$90k–$125k", "remote": "$75k–$100k"},
            "Mid": {"india": "₹20–35 LPA", "usa": "$125k–$165k", "remote": "$100k–$140k"},
            "Senior": {"india": "₹35–60 LPA", "usa": "$165k–$215k", "remote": "$140k–$180k"},
            "Lead": {"india": "₹60–90 LPA", "usa": "$215k–$280k", "remote": "$180k–$235k"},
        },
        "top_companies": ["Google", "Meta", "Amazon", "Microsoft", "Stripe", "Uber", "Airbnb"],
        "trending_skills": ["AI Product Management", "Data-Driven Decision Making", "Design Thinking", "OKR Planning"],
        "demand_level": {"Entry": "High", "Junior": "High", "Mid": "Very High", "Senior": "Very High", "Lead": "High"},
        "industry": "Technology / SaaS / E-commerce / Fintech",
        "career_outlook": "Very Strong — product management is a key role in all tech companies.",
        "promotion_potential": "Very High — path to Group PM, Director of Product, or CPO.",
        "competition": {
            "Entry": "Very High — many applicants from consulting and engineering.",
            "Junior": "High — APM programs are extremely competitive.",
            "Mid": "Moderate — experienced PMs with shipped products stand out.",
            "Senior": "Low-Moderate — senior PMs are highly recruited.",
            "Lead": "Low — product leadership requires exceptional track record.",
        }
    },
    "admin": {
        "display": "System Administration / IT",
        "required_skills": [
            "Linux/Windows Server", "Networking", "Scripting (Python/Bash)",
            "Active Directory", "Cloud Basics", "Monitoring"
        ],
        "preferred_skills": [
            "Ansible/Puppet", "Docker", "Kubernetes", "Terraform",
            "Security Hardening", "Backup & Recovery", "Virtualization"
        ],
        "soft_skills": ["Problem Solving", "Documentation", "Patience", "Customer Service"],
        "certifications": ["CompTIA Network+", "Red Hat RHCSA", "Microsoft Azure Admin", "CCNA"],
        "experience_required": {"Entry": 0, "Junior": 1, "Mid": 3, "Senior": 5, "Lead": 7},
        "salary_range": {
            "Entry": {"india": "₹2–5 LPA", "usa": "$40k–$60k", "remote": "$35k–$50k"},
            "Junior": {"india": "₹5–9 LPA", "usa": "$60k–$80k", "remote": "$50k–$70k"},
            "Mid": {"india": "₹9–16 LPA", "usa": "$80k–$105k", "remote": "$70k–$90k"},
            "Senior": {"india": "₹16–28 LPA", "usa": "$105k–$135k", "remote": "$90k–$115k"},
            "Lead": {"india": "₹28–45 LPA", "usa": "$135k–$170k", "remote": "$115k–$145k"},
        },
        "top_companies": ["Microsoft", "Amazon", "Google", "IBM", "Deloitte", "Infosys", "Wipro"],
        "trending_skills": ["Cloud Migration", "Automation", "DevOps", "Infrastructure as Code", "Zero Trust"],
        "demand_level": {"Entry": "Moderate", "Junior": "Moderate", "Mid": "High", "Senior": "High", "Lead": "Moderate"},
        "industry": "IT Services / Enterprise / Consulting",
        "career_outlook": "Moderate — traditional sysadmin roles declining; cloud and automation skills increasingly required.",
        "promotion_potential": "Moderate — path to Infrastructure Manager, IT Director, or Cloud Architect.",
        "competition": {
            "Entry": "Moderate — many entry-level candidates.",
            "Junior": "Moderate — certifications help stand out.",
            "Mid": "Low-Moderate — experienced sysadmins are steady.",
            "Senior": "Low — senior infrastructure talent is valued.",
            "Lead": "Low — limited leadership positions.",
        }
    },
    "blockchain": {
        "display": "Blockchain Development",
        "required_skills": [
            "Solidity", "Ethereum", "Smart Contracts", "Web3.js",
            "JavaScript/TypeScript", "Git", "Blockchain Architecture"
        ],
        "preferred_skills": [
            "Rust", "Solana", "DeFi Protocols", "Hardhat/Truffle",
            "IPFS", "Zero Knowledge Proofs", "Layer 2 Scaling"
        ],
        "soft_skills": ["Problem Solving", "Innovation Mindset", "Security Awareness", "Continuous Learning"],
        "certifications": ["ConsenSys Developer", "Blockchain Council", "Certified Blockchain Developer"],
        "experience_required": {"Entry": 0, "Junior": 1, "Mid": 3, "Senior": 5, "Lead": 7},
        "salary_range": {
            "Entry": {"india": "₹5–10 LPA", "usa": "$70k–$100k", "remote": "$55k–$80k"},
            "Junior": {"india": "₹10–20 LPA", "usa": "$100k–$140k", "remote": "$80k–$115k"},
            "Mid": {"india": "₹20–40 LPA", "usa": "$140k–$185k", "remote": "$115k–$155k"},
            "Senior": {"india": "₹40–70 LPA", "usa": "$185k–$240k", "remote": "$155k–$200k"},
            "Lead": {"india": "₹70–110 LPA", "usa": "$240k–$320k", "remote": "$200k–$270k"},
        },
        "top_companies": ["Coinbase", "ConsenSys", "Chainlink Labs", "OpenSea", "Polygon", "Solana Labs"],
        "trending_skills": ["ZK Proofs", "L2 Scaling", "DeFi", "Rust on Solana", "Account Abstraction"],
        "demand_level": {"Entry": "Moderate", "Junior": "Moderate", "Mid": "High", "Senior": "High", "Lead": "Moderate"},
        "industry": "Blockchain / Web3 / DeFi / Cryptocurrency",
        "career_outlook": "Cyclical — follows crypto market cycles; long-term trend is positive for blockchain infrastructure.",
        "promotion_potential": "High — path to Lead Blockchain Developer, Smart Contract Architect, or CTO.",
        "competition": {
            "Entry": "Moderate — bootcamp grads entering the space.",
            "Junior": "Moderate — solidity developers are needed.",
            "Mid": "Low-Moderate — experienced blockchain devs are scarce.",
            "Senior": "Low — senior blockchain talent is highly sought.",
            "Lead": "Very Low — top architects are extremely rare.",
        }
    }
}

ROLE_TO_FAMILY_MAP: Dict[str, str] = {
    "frontend developer": "frontend",
    "react developer": "frontend",
    "angular developer": "frontend",
    "vue developer": "frontend",
    "ui/ux designer": "design",
    "web developer": "frontend",
    "backend developer": "backend",
    "python developer": "backend",
    "java developer": "backend",
    ".net developer": "backend",
    "php developer": "backend",
    "ruby developer": "backend",
    "go developer": "backend",
    "rust developer": "backend",
    "node.js developer": "backend",
    "full stack developer": "fullstack",
    "data scientist": "data_science",
    "machine learning engineer": "ai_ml",
    "ai engineer": "ai_ml",
    "devops engineer": "devops",
    "site reliability engineer": "devops",
    "cloud engineer": "cloud",
    "cybersecurity analyst": "security",
    "android developer": "mobile",
    "ios developer": "mobile",
    "qa engineer": "qa",
    "game developer": "fullstack",
    "embedded systems engineer": "backend",
    "business analyst": "data_analyst",
    "product manager": "product",
    "data analyst": "data_analyst",
    "system administrator": "admin",
    "network engineer": "admin",
    "database administrator": "backend",
    "blockchain developer": "blockchain",
}

LEVEL_ORDER = ["Entry", "Junior", "Mid", "Senior", "Lead"]


def get_role_family(role_name: str) -> str:
    normalized = role_name.lower().strip()
    if normalized in ROLE_TO_FAMILY_MAP:
        return ROLE_TO_FAMILY_MAP[normalized]
    for key in ROLE_TO_FAMILY_MAP:
        if key in normalized or normalized in key:
            return ROLE_TO_FAMILY_MAP[key]
    return "fullstack"


def get_role_requirements(role_name: str, level: str = "Mid") -> Dict[str, Any]:
    family_key = get_role_family(role_name)
    family = ROLE_FAMILIES.get(family_key, ROLE_FAMILIES["fullstack"])
    if level not in LEVEL_ORDER:
        level = "Mid"
    return {
        "role_name": role_name,
        "family": family["display"],
        "required_skills": list(family["required_skills"]),
        "preferred_skills": list(family["preferred_skills"]),
        "soft_skills": list(family["soft_skills"]),
        "certifications": list(family["certifications"]),
        "experience_required": family["experience_required"][level],
        "salary_range": family["salary_range"][level],
        "top_companies": list(family["top_companies"]),
        "trending_skills": list(family["trending_skills"]),
        "demand_level": family["demand_level"][level],
        "industry": family["industry"],
        "career_outlook": family["career_outlook"],
        "promotion_potential": family["promotion_potential"],
        "competition": family["competition"][level],
    }
