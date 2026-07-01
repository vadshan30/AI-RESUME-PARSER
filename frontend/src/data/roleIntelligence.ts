export interface RoleIntelligence {
  role_name: string;
  category: string;
  required_skills: string[];
  preferred_skills: string[];
  soft_skills: string[];
  frameworks: string[];
  libraries: string[];
  programming_languages: string[];
  databases: string[];
  cloud: string[];
  tools: string[];
  certifications: string[];
  minimum_experience: number;
  education: string[];
  projects_expected: string[];
  interview_topics: string[];
  salary_range: { india: string; usa: string };
  role_weights: {
    skills: number;
    experience: number;
    projects: number;
    education: number;
    certifications: number;
    softSkills: number;
  };
  recruiter_personas: {
    strong: string;
    average: string;
    weak: string;
  };
}

export const CORE_ROLES_DB: Record<string, RoleIntelligence> = {
  "AI Engineer": {
    role_name: "AI Engineer",
    category: "Artificial Intelligence & Machine Learning",
    required_skills: ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "NLP", "OpenCV", "Pandas", "NumPy", "SQL", "FastAPI", "Docker", "Linux"],
    preferred_skills: ["LangChain", "LlamaIndex", "HuggingFace", "Vector Database", "RAG", "Transformers"],
    soft_skills: ["Problem Solving", "Analytical Thinking", "Communication"],
    frameworks: ["TensorFlow", "PyTorch", "FastAPI"],
    libraries: ["Pandas", "NumPy", "Scikit-Learn", "OpenCV"],
    programming_languages: ["Python", "C++"],
    databases: ["SQL", "Vector Database"],
    cloud: ["AWS", "GCP", "Azure"],
    tools: ["Docker", "Linux", "Git"],
    certifications: ["AWS Certified Machine Learning", "Google Professional Machine Learning Engineer"],
    minimum_experience: 3,
    education: ["BSc Computer Science", "MSc Artificial Intelligence"],
    projects_expected: ["Chatbot", "Resume Parser", "Recommendation System", "Image Classification", "LLM Assistant"],
    interview_topics: ["ML Algorithms", "Neural Networks", "CNN", "RNN", "Transformers", "Model Deployment"],
    salary_range: { india: "₹8–20 LPA", usa: "$110K–180K" },
    role_weights: { skills: 35, experience: 20, projects: 20, education: 10, certifications: 5, softSkills: 10 },
    recruiter_personas: {
      strong: "Excellent foundation in Deep Learning and solid production ML engineering. Very strong candidate.",
      average: "Demonstrates solid machine learning knowledge but lacks production deployment experience (MLOps).",
      weak: "Resume heavily lacks core ML frameworks (TensorFlow/PyTorch) and production engineering skills."
    }
  },
  "Frontend Developer": {
    role_name: "Frontend Developer",
    category: "Web Development",
    required_skills: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Redux", "Next.js", "Tailwind", "REST API"],
    preferred_skills: ["Framer Motion", "GraphQL", "Jest", "Cypress", "React Testing Library", "Webpack", "Accessibility", "Next Auth", "Redux Toolkit"],
    soft_skills: ["Attention to Detail", "Team Collaboration", "UX Empathy"],
    frameworks: ["React", "Next.js"],
    libraries: ["Redux", "Tailwind CSS"],
    programming_languages: ["JavaScript", "TypeScript"],
    databases: [],
    cloud: ["Vercel", "Netlify", "AWS"],
    tools: ["Git", "Webpack", "Vite", "Figma"],
    certifications: ["Meta Front-End Developer", "AWS Certified Developer"],
    minimum_experience: 2,
    education: ["BSc Computer Science", "Bootcamp Graduate"],
    projects_expected: ["Portfolio", "Dashboard", "Ecommerce", "Admin Panel"],
    interview_topics: ["Virtual DOM", "React Hooks", "Memoization", "Next.js Rendering", "CSS Specificity", "Event Loop"],
    salary_range: { india: "₹5–15 LPA", usa: "$80K–140K" },
    role_weights: { skills: 35, experience: 15, projects: 15, education: 10, certifications: 5, softSkills: 20 },
    recruiter_personas: {
      strong: "Exceptional modern UI development skills. Great mix of Next.js, state management, and accessibility focus.",
      average: "Strong UI skills with React and Tailwind. Accessibility and testing experience should be improved.",
      weak: "Candidate lacks modern state management (Redux/Zustand) and framework (Next.js) experience."
    }
  },
  "Backend Developer": {
    role_name: "Backend Developer",
    category: "Web Development",
    required_skills: ["Java", "Spring Boot", "Python", "FastAPI", "Node.js", "Express", "PostgreSQL", "MySQL", "MongoDB", "Docker", "Redis", "Git"],
    preferred_skills: ["GraphQL", "Kafka", "RabbitMQ", "Microservices", "Kubernetes", "Elasticsearch"],
    soft_skills: ["Problem Solving", "System Design", "Scalability Thinking"],
    frameworks: ["Spring Boot", "FastAPI", "Express"],
    libraries: ["Sequelize", "Prisma", "SQLAlchemy"],
    programming_languages: ["Java", "Python", "Node.js", "Go"],
    databases: ["PostgreSQL", "MySQL", "MongoDB", "Redis"],
    cloud: ["AWS", "Azure", "GCP"],
    tools: ["Docker", "Git", "Postman", "Swagger"],
    certifications: ["AWS Certified Developer", "Azure Developer Associate"],
    minimum_experience: 3,
    education: ["BSc Computer Science", "BEng Software Engineering"],
    projects_expected: ["REST API", "Authentication API", "Payment Gateway", "Microservices Backend"],
    interview_topics: ["REST vs GraphQL", "JWT", "Caching", "Database Normalization", "ACID Properties", "CAP Theorem"],
    salary_range: { india: "₹6–18 LPA", usa: "$90K–150K" },
    role_weights: { skills: 30, experience: 20, projects: 20, education: 15, certifications: 5, softSkills: 10 },
    recruiter_personas: {
      strong: "Deep knowledge of backend scalability, caching, and microservices. Outstanding profile.",
      average: "Good foundational API knowledge. Needs more exposure to message brokers (Kafka) and caching architectures.",
      weak: "Missing core database design principles and lacks modern backend framework depth."
    }
  },
  "DevOps Engineer": {
    role_name: "DevOps Engineer",
    category: "DevOps & SRE",
    required_skills: ["Docker", "Kubernetes", "Jenkins", "Linux", "Bash", "AWS", "Azure", "Terraform", "GitHub Actions", "CI/CD"],
    preferred_skills: ["Ansible", "Prometheus", "Grafana", "ArgoCD", "Python", "Go"],
    soft_skills: ["Troubleshooting", "Collaboration", "Reliability Mindset"],
    frameworks: [],
    libraries: [],
    programming_languages: ["Bash", "Python", "Go"],
    databases: ["SQL", "NoSQL"],
    cloud: ["AWS", "Azure", "GCP"],
    tools: ["Docker", "Kubernetes", "Jenkins", "Terraform", "GitHub Actions"],
    certifications: ["AWS Certified DevOps Engineer", "CKA (Certified Kubernetes Administrator)"],
    minimum_experience: 3,
    education: ["BSc Computer Science", "BEng Information Technology"],
    projects_expected: ["Kubernetes Deployment", "AWS Infrastructure as Code", "CI/CD Pipeline", "Monitoring Setup"],
    interview_topics: ["Docker Layers", "Kubernetes Pods", "CI/CD Pipelines", "Load Balancing", "Infrastructure as Code"],
    salary_range: { india: "₹10–25 LPA", usa: "$110K–170K" },
    role_weights: { skills: 40, experience: 20, projects: 15, education: 10, certifications: 10, softSkills: 5 },
    recruiter_personas: {
      strong: "Excellent infrastructure automation skills with Terraform and deep Kubernetes expertise.",
      average: "Solid CI/CD and Docker knowledge, but needs more experience with Infrastructure as Code (Terraform).",
      weak: "Lacks core container orchestration (Kubernetes) and cloud deployment automation skills."
    }
  },
  "Data Scientist": {
    role_name: "Data Scientist",
    category: "Data Science & Analytics",
    required_skills: ["Python", "Statistics", "Machine Learning", "SQL", "Pandas", "NumPy", "Scikit Learn", "Tableau", "Power BI"],
    preferred_skills: ["Feature Engineering", "A/B Testing", "Spark", "Hadoop", "XGBoost", "Deep Learning"],
    soft_skills: ["Storytelling with Data", "Analytical Thinking", "Business Acumen"],
    frameworks: [],
    libraries: ["Pandas", "NumPy", "Scikit-Learn", "Matplotlib", "Seaborn"],
    programming_languages: ["Python", "R", "SQL"],
    databases: ["PostgreSQL", "Snowflake", "BigQuery"],
    cloud: ["AWS", "GCP"],
    tools: ["Tableau", "Power BI", "Jupyter"],
    certifications: ["Google Data Analytics Professional", "AWS Certified Data Analytics"],
    minimum_experience: 2,
    education: ["MSc Statistics", "BSc Computer Science", "BSc Mathematics"],
    projects_expected: ["Sales Prediction", "Fraud Detection", "Customer Segmentation", "Churn Analysis"],
    interview_topics: ["P-Values", "Overfitting vs Underfitting", "Random Forests", "K-Means Clustering", "SQL Window Functions"],
    salary_range: { india: "₹8–22 LPA", usa: "$100K–160K" },
    role_weights: { skills: 35, experience: 15, projects: 20, education: 20, certifications: 5, softSkills: 5 },
    recruiter_personas: {
      strong: "Exceptional statistical foundation and great ability to translate data into business impact.",
      average: "Good predictive modeling skills, but needs deeper expertise in statistics and feature engineering.",
      weak: "Lacks advanced ML models and robust data visualization capabilities."
    }
  },
  "Cyber Security Analyst": {
    role_name: "Cyber Security Analyst",
    category: "Cyber Security",
    required_skills: ["Network Security", "Linux", "SIEM", "Firewalls", "Incident Response", "Vulnerability Scanning", "Wireshark", "Splunk"],
    preferred_skills: ["Kali Linux", "Burp Suite", "OWASP", "Nmap", "Metasploit", "Penetration Testing"],
    soft_skills: ["Critical Thinking", "High Stress Tolerance", "Attention to Detail"],
    frameworks: ["MITRE ATT&CK", "NIST"],
    libraries: [],
    programming_languages: ["Python", "Bash", "PowerShell"],
    databases: ["SQL"],
    cloud: ["AWS Security", "Azure Security"],
    tools: ["Wireshark", "Splunk", "Nmap", "Burp Suite", "Metasploit"],
    certifications: ["CompTIA Security+", "CISSP", "CEH"],
    minimum_experience: 2,
    education: ["BSc Cyber Security", "BSc Computer Science"],
    projects_expected: ["Network Traffic Analysis", "Vulnerability Assessment Report", "SIEM Implementation"],
    interview_topics: ["SQL Injection", "XSS", "CSRF", "OWASP Top 10", "Symmetric vs Asymmetric Encryption", "Incident Response Plan"],
    salary_range: { india: "₹6–18 LPA", usa: "$90K–150K" },
    role_weights: { skills: 35, experience: 20, projects: 10, education: 10, certifications: 20, softSkills: 5 },
    recruiter_personas: {
      strong: "Comprehensive security profile with outstanding certifications and threat hunting experience.",
      average: "Solid understanding of security concepts but lacks hands-on penetration testing and SIEM tooling experience.",
      weak: "Resume completely lacks core security tools (SIEM, Kali, Nmap) and essential certifications like Security+."
    }
  },
  "Cloud Engineer": {
    role_name: "Cloud Engineer",
    category: "Cloud Computing",
    required_skills: ["AWS", "Azure", "GCP", "Linux", "Networking", "Terraform", "Docker", "Python"],
    preferred_skills: ["Kubernetes", "Serverless architecture", "CloudFormation", "Ansible"],
    soft_skills: ["Problem Solving", "Adaptability", "Communication"],
    frameworks: [],
    libraries: ["Boto3"],
    programming_languages: ["Python", "Bash"],
    databases: ["DynamoDB", "RDS", "CosmosDB"],
    cloud: ["AWS", "Azure", "GCP"],
    tools: ["Terraform", "CloudFormation", "Docker"],
    certifications: ["AWS Solutions Architect", "Azure Administrator Associate"],
    minimum_experience: 3,
    education: ["BSc Computer Science", "BEng IT"],
    projects_expected: ["Serverless Web App", "High Availability Infrastructure", "Cloud Migration Strategy"],
    interview_topics: ["VPC Design", "IAM Roles", "Serverless vs Containers", "Load Balancing Strategies"],
    salary_range: { india: "₹10–28 LPA", usa: "$120K–200K" },
    role_weights: { skills: 35, experience: 20, projects: 15, education: 10, certifications: 15, softSkills: 5 },
    recruiter_personas: {
      strong: "Exceptional architectural knowledge and strong cloud infrastructure automation skills.",
      average: "Candidate has programming experience but lacks deep cloud deployment knowledge and infrastructure automation.",
      weak: "Lacks core cloud provider certifications and practical deployment experience."
    }
  }
};

// Generic Fallback Engine for the remaining 450+ roles
export const getRoleIntelligence = (roleName: string, category: string): RoleIntelligence => {
  // If we have a deeply hardcoded core role, return it
  if (CORE_ROLES_DB[roleName]) {
    return CORE_ROLES_DB[roleName];
  }

  // Otherwise, interpolate based on category and role name
  const name = roleName.toLowerCase();
  
  let required: string[] = ["Problem Solving", "Communication", "Agile"];
  let preferred: string[] = ["Leadership", "Mentoring"];
  let projects: string[] = ["Industry specific project 1", "Industry specific project 2"];
  let interview: string[] = ["Behavioral questions", "Past experience deep dive", "Role specific scenarios"];
  let salary = { india: "₹5–15 LPA", usa: "$70K–130K" };
  let certs: string[] = ["Role specific certification"];
  let tools: string[] = ["Microsoft Office", "Jira"];

  // Category based interpolation heuristics
  if (category.includes("Software") || category.includes("Web") || category.includes("Mobile")) {
    required = ["Data Structures", "Algorithms", "Git", "REST APIs", "System Design"];
    preferred = ["Cloud platforms", "CI/CD", "Docker"];
    projects = ["Full Stack Application", "API Service", "System Architecture Design"];
    interview = ["System Design", "Algorithmic Problem Solving", "Code Review", "Scalability"];
    salary = { india: "₹8–22 LPA", usa: "$90K–160K" };
    tools = ["Git", "VS Code", "Postman", "Docker"];
    if (name.includes("react") || name.includes("frontend")) {
      required.push("React", "JavaScript", "TypeScript", "CSS");
    }
    if (name.includes("node") || name.includes("backend")) {
      required.push("Node.js", "SQL", "Databases");
    }
    if (name.includes("mobile") || name.includes("android") || name.includes("ios")) {
      required.push("Swift", "Kotlin", "React Native", "Flutter");
      projects = ["Mobile App Deployment", "Offline Sync Implementation"];
    }
  } else if (category.includes("Data") || category.includes("AI") || category.includes("Machine Learning")) {
    required = ["Python", "SQL", "Statistics", "Data Modeling"];
    preferred = ["Machine Learning", "Big Data tools", "Cloud Data Platforms"];
    projects = ["Data Pipeline", "Predictive Model", "Data Dashboard"];
    interview = ["Statistical Analysis", "SQL Optimization", "Data Structures", "Model Evaluation"];
    salary = { india: "₹9–25 LPA", usa: "$100K–180K" };
    tools = ["Jupyter", "SQL IDEs", "Tableau"];
  } else if (category.includes("DevOps") || category.includes("Cloud")) {
    required = ["Linux", "Bash", "Cloud Provider (AWS/Azure/GCP)", "CI/CD", "Networking"];
    preferred = ["Terraform", "Kubernetes", "Docker"];
    projects = ["Infrastructure as Code", "Automated Deployment Pipeline", "Monitoring Setup"];
    interview = ["Linux Internals", "Networking Protocols", "Deployment Strategies", "Infrastructure as Code"];
    salary = { india: "₹10–25 LPA", usa: "$110K–180K" };
    tools = ["Terraform", "Jenkins", "Docker", "Kubernetes"];
  } else if (category.includes("Security")) {
    required = ["Networking", "Linux", "Risk Assessment", "Security Fundamentals"];
    preferred = ["Penetration Testing", "SIEM Tools", "Cryptography"];
    projects = ["Vulnerability Report", "Network Security Audit"];
    interview = ["Network Protocols", "Encryption Standards", "Vulnerability Triage", "OWASP"];
    salary = { india: "₹8–20 LPA", usa: "$95K–160K" };
    tools = ["Wireshark", "Nmap", "SIEM"];
  } else if (category.includes("Design") || category.includes("UI/UX")) {
    required = ["Figma", "User Research", "Wireframing", "Prototyping", "UI Design"];
    preferred = ["HTML/CSS", "Design Systems", "Usability Testing"];
    projects = ["Case Study", "Design System Creation", "App Redesign"];
    interview = ["Design Process", "Portfolio Review", "App Critique", "User Research Methodologies"];
    salary = { india: "₹6–18 LPA", usa: "$80K–140K" };
    tools = ["Figma", "Adobe CC", "Miro"];
  }

  return {
    role_name: roleName,
    category: category,
    required_skills: required,
    preferred_skills: preferred,
    soft_skills: ["Communication", "Teamwork", "Adaptability"],
    frameworks: [],
    libraries: [],
    programming_languages: category.includes("Software") ? ["JavaScript", "Python", "Java"] : [],
    databases: category.includes("Data") ? ["SQL", "NoSQL"] : [],
    cloud: ["AWS", "Azure"],
    tools: tools,
    certifications: certs,
    minimum_experience: 3,
    education: ["Bachelor's Degree relevant to field"],
    projects_expected: projects,
    interview_topics: interview,
    salary_range: salary,
    role_weights: {
      skills: 35, experience: 25, projects: 15, education: 10, certifications: 5, softSkills: 10
    },
    recruiter_personas: {
      strong: `Extremely strong candidate for the ${roleName} role. Excellent alignment of skills and experience.`,
      average: `Candidate meets the basic requirements for a ${roleName} but could strengthen industry-specific tools.`,
      weak: `Resume lacks critical core competencies specifically required for the ${roleName} trajectory.`
    }
  };
};
