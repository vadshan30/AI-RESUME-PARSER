import re

# Comprehensive skill taxonomy — each entry: (canonical_name, category, [match_patterns])
SKILL_TAXONOMY = [
    # Programming Languages
    ("Python", "Programming Languages", ["python"]),
    ("Java", "Programming Languages", ["\\bjava\\b"]),
    ("C++", "Programming Languages", ["c\\+\\+", "cpp"]),
    ("C", "Programming Languages", ["\\bc\\b"]),
    ("C#", "Programming Languages", ["c#", "csharp"]),
    ("JavaScript", "Programming Languages", ["javascript", "\\bjs\\b", "es6", "es2015"]),
    ("TypeScript", "Programming Languages", ["typescript", "\\bts\\b"]),
    ("Go", "Programming Languages", ["\\bgolang\\b", "\\bgo\\b"]),
    ("Rust", "Programming Languages", ["\\brust\\b"]),
    ("Ruby", "Programming Languages", ["\\bruby\\b"]),
    ("PHP", "Programming Languages", ["\\bphp\\b"]),
    ("Swift", "Programming Languages", ["\\bswift\\b"]),
    ("Kotlin", "Programming Languages", ["\\bkotlin\\b"]),
    ("Scala", "Programming Languages", ["\\bscala\\b"]),
    ("R", "Programming Languages", ["\\br programming\\b", "\\br language\\b"]),
    ("MATLAB", "Programming Languages", ["\\bmatlab\\b"]),
    ("Dart", "Programming Languages", ["\\bdart\\b"]),
    ("Shell/Bash", "Programming Languages", ["\\bbash\\b", "\\bshell script", "\\bshell\\b"]),
    ("PowerShell", "Programming Languages", ["powershell"]),

    # Web Frameworks & Libraries
    ("React", "Frameworks & Libraries", ["\\breact\\b", "react.js", "reactjs"]),
    ("Next.js", "Frameworks & Libraries", ["next.js", "nextjs", "\\bnext\\b"]),
    ("Angular", "Frameworks & Libraries", ["\\bangular\\b"]),
    ("Vue.js", "Frameworks & Libraries", ["vue.js", "vuejs", "\\bvue\\b"]),
    ("Svelte", "Frameworks & Libraries", ["\\bsvelte\\b"]),
    ("Node.js", "Frameworks & Libraries", ["node.js", "nodejs", "\\bnode\\b"]),
    ("Express.js", "Frameworks & Libraries", ["express.js", "expressjs", "\\bexpress\\b"]),
    ("NestJS", "Frameworks & Libraries", ["nestjs", "nest.js"]),
    ("Django", "Frameworks & Libraries", ["\\bdjango\\b"]),
    ("Flask", "Frameworks & Libraries", ["\\bflask\\b"]),
    ("FastAPI", "Frameworks & Libraries", ["fastapi"]),
    ("Spring Boot", "Frameworks & Libraries", ["spring boot", "springboot"]),
    ("Spring", "Frameworks & Libraries", ["\\bspring\\b"]),
    ("Laravel", "Frameworks & Libraries", ["\\blaravel\\b"]),
    ("Rails", "Frameworks & Libraries", ["ruby on rails", "\\brails\\b"]),
    ("ASP.NET", "Frameworks & Libraries", ["asp.net", "aspnet"]),
    ("Redux", "Frameworks & Libraries", ["\\bredux\\b"]),
    ("GraphQL", "Frameworks & Libraries", ["graphql"]),
    ("REST API", "Frameworks & Libraries", ["rest api", "restful", "\\brest\\b"]),
    ("gRPC", "Frameworks & Libraries", ["\\bgrpc\\b"]),
    ("WebSocket", "Frameworks & Libraries", ["websocket"]),
    ("Tailwind CSS", "Frameworks & Libraries", ["tailwind"]),
    ("Bootstrap", "Frameworks & Libraries", ["bootstrap"]),
    ("Material UI", "Frameworks & Libraries", ["material.ui", "material ui", "mui"]),
    ("jQuery", "Frameworks & Libraries", ["jquery"]),

    # Databases
    ("MySQL", "Databases", ["\\bmysql\\b"]),
    ("PostgreSQL", "Databases", ["postgresql", "postgres", "\\bpsql\\b"]),
    ("MongoDB", "Databases", ["mongodb", "\\bmongo\\b"]),
    ("SQLite", "Databases", ["sqlite"]),
    ("Oracle", "Databases", ["\\boracle\\b"]),
    ("SQL Server", "Databases", ["sql server", "mssql"]),
    ("Redis", "Databases", ["\\bredis\\b"]),
    ("Cassandra", "Databases", ["cassandra"]),
    ("Elasticsearch", "Databases", ["elasticsearch", "elastic search"]),
    ("DynamoDB", "Databases", ["dynamodb"]),
    ("Firebase", "Databases", ["firebase"]),
    ("Supabase", "Databases", ["supabase"]),
    ("SQL", "Databases", ["\\bsql\\b"]),
    ("NoSQL", "Databases", ["nosql"]),

    # Cloud & DevOps
    ("AWS", "Cloud & DevOps", ["\\baws\\b", "amazon web services", "ec2", "s3", "lambda", "rds"]),
    ("Azure", "Cloud & DevOps", ["\\bazure\\b", "microsoft azure"]),
    ("GCP", "Cloud & DevOps", ["\\bgcp\\b", "google cloud"]),
    ("Docker", "Cloud & DevOps", ["\\bdocker\\b"]),
    ("Kubernetes", "Cloud & DevOps", ["kubernetes", "\\bk8s\\b"]),
    ("Terraform", "Cloud & DevOps", ["terraform"]),
    ("Ansible", "Cloud & DevOps", ["\\bansible\\b"]),
    ("Jenkins", "Cloud & DevOps", ["\\bjenkins\\b"]),
    ("GitHub Actions", "Cloud & DevOps", ["github actions"]),
    ("GitLab CI", "Cloud & DevOps", ["gitlab ci", "gitlab"]),
    ("CI/CD", "Cloud & DevOps", ["ci/cd", "cicd", "continuous integration", "continuous deployment"]),
    ("Linux", "Cloud & DevOps", ["\\blinux\\b", "\\bunix\\b"]),
    ("Nginx", "Cloud & DevOps", ["\\bnginx\\b"]),
    ("Vercel", "Cloud & DevOps", ["\\bvercel\\b"]),
    ("Netlify", "Cloud & DevOps", ["netlify"]),
    ("Heroku", "Cloud & DevOps", ["heroku"]),

    # AI / ML / Data Science
    ("Machine Learning", "AI & Data Science", ["machine learning", "\\bml\\b"]),
    ("Deep Learning", "AI & Data Science", ["deep learning", "\\bdl\\b"]),
    ("TensorFlow", "AI & Data Science", ["tensorflow"]),
    ("PyTorch", "AI & Data Science", ["pytorch"]),
    ("Scikit-learn", "AI & Data Science", ["scikit.learn", "sklearn"]),
    ("Keras", "AI & Data Science", ["\\bkeras\\b"]),
    ("Pandas", "AI & Data Science", ["\\bpandas\\b"]),
    ("NumPy", "AI & Data Science", ["\\bnumpy\\b"]),
    ("Matplotlib", "AI & Data Science", ["matplotlib"]),
    ("NLP", "AI & Data Science", ["\\bnlp\\b", "natural language processing"]),
    ("Computer Vision", "AI & Data Science", ["computer vision"]),
    ("LangChain", "AI & Data Science", ["langchain"]),
    ("OpenAI API", "AI & Data Science", ["openai"]),
    ("Hugging Face", "AI & Data Science", ["hugging face", "huggingface"]),
    ("Data Analysis", "AI & Data Science", ["data analysis", "data analytics"]),
    ("Power BI", "AI & Data Science", ["power bi"]),
    ("Tableau", "AI & Data Science", ["\\btableau\\b"]),
    ("Apache Spark", "AI & Data Science", ["\\bspark\\b", "apache spark"]),

    # Tools & Platforms
    ("Git", "Tools & Platforms", ["\\bgit\\b"]),
    ("GitHub", "Tools & Platforms", ["github"]),
    ("Jira", "Tools & Platforms", ["\\bjira\\b"]),
    ("Postman", "Tools & Platforms", ["postman"]),
    ("VS Code", "Tools & Platforms", ["vs code", "vscode"]),
    ("Figma", "Tools & Platforms", ["\\bfigma\\b"]),
    ("Adobe XD", "Tools & Platforms", ["adobe xd"]),
    ("Photoshop", "Tools & Platforms", ["photoshop"]),
    ("Illustrator", "Tools & Platforms", ["illustrator"]),
    ("Webpack", "Tools & Platforms", ["webpack"]),
    ("Vite", "Tools & Platforms", ["\\bvite\\b"]),
    ("npm/yarn", "Tools & Platforms", ["\\bnpm\\b", "\\byarn\\b"]),
    ("Excel", "Tools & Platforms", ["\\bexcel\\b"]),
    ("Kafka", "Tools & Platforms", ["\\bkafka\\b"]),
    ("RabbitMQ", "Tools & Platforms", ["rabbitmq"]),

    # Soft Skills
    ("Leadership", "Soft Skills", ["leadership", "\\blead\\b", "\\bled\\b"]),
    ("Communication", "Soft Skills", ["communication", "\\bcommunicate\\b"]),
    ("Teamwork", "Soft Skills", ["teamwork", "team player", "collaboration"]),
    ("Problem Solving", "Soft Skills", ["problem.solving", "problem solving"]),
    ("Agile/Scrum", "Soft Skills", ["\\bagile\\b", "\\bscrum\\b", "\\bkanban\\b"]),
    ("Project Management", "Soft Skills", ["project management"]),
    ("Critical Thinking", "Soft Skills", ["critical thinking"]),
    ("Time Management", "Soft Skills", ["time management"]),
]


def extract_categorized_skills(text: str) -> dict:
    """
    Extracts skills from resume text and categorizes them using the taxonomy.
    Returns only categories that have at least one skill found.
    """
    text_lower = text.lower()
    found: dict[str, list] = {}

    for canonical, category, patterns in SKILL_TAXONOMY:
        for pattern in patterns:
            if re.search(pattern, text_lower):
                found.setdefault(category, [])
                if canonical not in found[category]:
                    found[category].append(canonical)
                break

    # Remove empty categories
    return {cat: skills for cat, skills in found.items() if skills}


def extract_hard_skills(text: str) -> list:
    """
    Returns a flat deduplicated list of all detected skills.
    """
    categorized = extract_categorized_skills(text)
    all_skills = []
    for skills in categorized.values():
        all_skills.extend(skills)
    return list(dict.fromkeys(all_skills))  # preserve order, deduplicate


def extract_soft_skills(text: str) -> list:
    """
    Returns only soft skills found in the text.
    """
    categorized = extract_categorized_skills(text)
    return categorized.get("Soft Skills", [])
