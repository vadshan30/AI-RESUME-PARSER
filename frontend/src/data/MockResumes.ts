export interface MockResume {
  id: string;
  name: string;
  title: string;
  role: string;
  experience: number;
  skills: string[];
  education: {
    degree: string;
    field: string;
    institution: string;
    cgpa?: number;
    year: number;
  }[];
  certifications: string[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
    duration: string;
  }[];
  workExperience: {
    title: string;
    company: string;
    duration: string;
    description: string[];
    technologies: string[];
  }[];
  achievements: string[];
  github?: string;
  linkedin?: string;
  portfolio?: string;
  summary: string;
  email: string;
  phone: string;
  location: string;
  languages: string[];
  lastUpdated: string;
}

const manualExamples: MockResume[] = [
  {
    id: "resume_001",
    name: "John Doe",
    title: "Senior React Developer",
    role: "Frontend Developer",
    experience: 6,
    skills: ["React", "Next.js", "TypeScript", "JavaScript", "Redux", "HTML5", "CSS3", "Tailwind CSS", "Webpack", "Jest", "Git", "Figma", "Storybook", "GraphQL", "Node.js"],
    education: [{ degree: "B.S.", field: "Computer Science", institution: "Stanford University", cgpa: 3.8, year: 2018 }],
    certifications: ["AWS Certified Developer", "Meta React Developer"],
    projects: [
      { name: "E-Commerce Platform", description: "Built a full-featured e-commerce platform with Next.js, TypeScript, and GraphQL", technologies: ["Next.js", "TypeScript", "GraphQL", "Tailwind", "Prisma"], duration: "6 months" },
      { name: "Portfolio Website", description: "Personal portfolio with 3D animations and dark mode", technologies: ["React", "Three.js", "Framer Motion"], duration: "1 month" },
      { name: "Chat Application", description: "Real-time chat app with WebSocket and Redis", technologies: ["React", "Socket.io", "Redis", "Express"], duration: "3 months" }
    ],
    workExperience: [
      { title: "Senior Frontend Developer", company: "Google", duration: "2022-2024", description: ["Led a team of 8 developers building Google Cloud's frontend", "Migrated 50% of app to Next.js with 40% performance improvement", "Implemented A/B testing framework used by 20+ teams", "Mentored 4 junior developers who all got promoted"], technologies: ["React", "Next.js", "TypeScript", "Go", "Google Cloud"] },
      { title: "Frontend Developer", company: "Microsoft", duration: "2018-2022", description: ["Built and maintained Azure portal UI components", "Reduced bundle size by 60% through code splitting", "Implemented dark mode used by millions of users"], technologies: ["React", "Redux", "TypeScript", "Azure", "Webpack"] }
    ],
    achievements: ["Google Innovation Award 2023", "Built system serving 50M+ daily active users"],
    github: "https://github.com/johndoe",
    linkedin: "https://linkedin.com/in/johndoe",
    portfolio: "https://johndoe.dev",
    summary: "Senior React Developer with 6 years of experience building large-scale web applications. Passionate about performance optimization and developer experience.",
    email: "john.doe@example.com",
    phone: "+1-555-0123",
    location: "San Francisco, CA",
    languages: ["English", "Spanish"],
    lastUpdated: "2024-03-15"
  },
  {
    id: "resume_002",
    name: "Jane Smith",
    title: "Senior Java Developer",
    role: "Backend Developer",
    experience: 8,
    skills: ["Java", "Spring Boot", "Microservices", "Docker", "Kubernetes", "AWS", "PostgreSQL", "Redis", "Kafka", "REST API", "GraphQL", "Maven", "Jenkins", "Git", "Linux"],
    education: [{ degree: "Master's", field: "Computer Science", institution: "MIT", cgpa: 3.9, year: 2016 }],
    certifications: ["AWS Solutions Architect", "Oracle Certified Java Programmer", "Spring Professional Certified", "Docker Certified Associate"],
    projects: [
      { name: "Payment Gateway Service", description: "Microservice handling $1B+ in transactions", technologies: ["Java", "Spring Boot", "Kafka", "PostgreSQL", "Redis"], duration: "1 year" },
      { name: "Authentication Service", description: "OAuth2 and JWT authentication for enterprise apps", technologies: ["Java", "Spring Security", "JWT", "Redis"], duration: "6 months" }
    ],
    workExperience: [
      { title: "Senior Backend Engineer", company: "Amazon", duration: "2020-2024", description: ["Led development of payment processing service handling $1B+", "Reduced latency by 50% through caching and optimization", "Designed event-driven architecture using Kafka", "Managed 12 microservices with 99.99% uptime"], technologies: ["Java", "Spring Boot", "AWS", "Kafka", "Docker", "Kubernetes"] },
      { title: "Backend Developer", company: "PayPal", duration: "2016-2020", description: ["Built payment processing APIs handling 10M+ requests daily", "Designed and implemented database sharding strategy"], technologies: ["Java", "Spring", "MySQL", "Redis", "Docker"] }
    ],
    achievements: ["Amazon's Best Engineering Award 2023", "Scaled system to 100M+ users without downtime"],
    github: "https://github.com/janesmith",
    linkedin: "https://linkedin.com/in/janesmith",
    summary: "Senior Backend Engineer with 8 years of experience in Java and Spring Boot. Expertise in building scalable microservices and event-driven architectures.",
    email: "jane.smith@example.com",
    phone: "+1-555-0124",
    location: "Seattle, WA",
    languages: ["English", "French"],
    lastUpdated: "2024-03-14"
  },
  {
    id: "resume_003",
    name: "David Chen",
    title: "AI Engineer",
    role: "AI Engineer",
    experience: 5,
    skills: ["Python", "PyTorch", "TensorFlow", "LLMs", "Transformers", "LangChain", "RAG", "Vector DB", "Docker", "AWS", "Kubernetes", "MLOps", "SQL", "JavaScript", "React"],
    education: [{ degree: "PhD", field: "Machine Learning", institution: "UC Berkeley", cgpa: 3.9, year: 2019 }],
    certifications: ["Google Professional ML Engineer", "AWS Machine Learning Specialty"],
    projects: [
      { name: "LLM Chatbot", description: "Enterprise chatbot using GPT-4 with RAG implementation", technologies: ["LangChain", "ChromaDB", "OpenAI", "FastAPI"], duration: "6 months" },
      { name: "Stock Price Predictor", description: "LSTM-based stock price prediction with 80% accuracy", technologies: ["PyTorch", "LSTM", "Pandas", "Plotly"], duration: "3 months" }
    ],
    workExperience: [
      { title: "Senior AI Engineer", company: "OpenAI", duration: "2022-2024", description: ["Built LLM applications serving 1M+ users", "Implemented RAG systems for enterprise customers", "Optimized model inference latency by 60%", "Led team of 10 AI engineers"], technologies: ["PyTorch", "LangChain", "LLMs", "AWS", "Docker"] },
      { title: "Machine Learning Engineer", company: "Google DeepMind", duration: "2019-2022", description: ["Developed NLP models for language understanding", "Published 5 research papers at ACL and NeurIPS"], technologies: ["TensorFlow", "Transformers", "Python", "BigQuery"] }
    ],
    achievements: ["NeurIPS Best Paper 2022", "Built system processing 1B+ tokens daily"],
    github: "https://github.com/davidchen",
    linkedin: "https://linkedin.com/in/davidchen",
    summary: "AI Engineer with 5 years of experience in building production-grade ML systems. Published at top conferences.",
    email: "david.chen@example.com",
    phone: "+1-555-0125",
    location: "San Francisco, CA",
    languages: ["English", "Mandarin"],
    lastUpdated: "2024-03-13"
  },
  {
    id: "resume_004",
    name: "Sarah Johnson",
    title: "Senior DevOps Engineer",
    role: "DevOps Engineer",
    experience: 7,
    skills: ["AWS", "Docker", "Kubernetes", "Terraform", "Ansible", "Jenkins", "GitHub Actions", "Python", "Linux", "Prometheus", "Grafana", "CI/CD", "Helm", "Istio", "Go"],
    education: [{ degree: "B.S.", field: "Computer Engineering", institution: "Georgia Tech", cgpa: 3.7, year: 2017 }],
    certifications: ["AWS Solutions Architect", "Certified Kubernetes Administrator", "HashiCorp Certified Terraform Associate"],
    projects: [
      { name: "Kubernetes Cluster Management", description: "Managed 500+ node Kubernetes cluster", technologies: ["Kubernetes", "Helm", "Istio", "Prometheus"], duration: "1 year" },
      { name: "CI/CD Pipeline Automation", description: "Automated build and deploy pipeline for 50+ services", technologies: ["Jenkins", "GitHub Actions", "Docker"], duration: "6 months" }
    ],
    workExperience: [
      { title: "Senior DevOps Engineer", company: "Netflix", duration: "2020-2024", description: ["Managed cloud infrastructure for 200M+ subscribers", "Reduced deployment time from 2 hours to 15 minutes", "Implemented observability stack with Prometheus and Grafana", "Led infrastructure migration to Kubernetes"], technologies: ["AWS", "Kubernetes", "Terraform", "Prometheus", "Go"] },
      { title: "DevOps Engineer", company: "Spotify", duration: "2017-2020", description: ["Built CI/CD pipelines for 100+ microservices", "Managed Docker containers across 1000+ nodes"], technologies: ["Docker", "Jenkins", "AWS", "Python"] }
    ],
    achievements: ["Netflix Infrastructure Award 2023", "Achieved 99.99% uptime for critical services"],
    github: "https://github.com/sarahjohnson",
    linkedin: "https://linkedin.com/in/sarahjohnson",
    summary: "Senior DevOps Engineer with 7 years of experience in cloud infrastructure and container orchestration.",
    email: "sarah.johnson@example.com",
    phone: "+1-555-0126",
    location: "Los Gatos, CA",
    languages: ["English", "German"],
    lastUpdated: "2024-03-12"
  },
  {
    id: "resume_005",
    name: "Alex Rodriguez",
    title: "Junior Full Stack Developer",
    role: "Full Stack Developer",
    experience: 2,
    skills: ["JavaScript", "React", "Node.js", "Express", "MongoDB", "HTML5", "CSS3", "Bootstrap", "Git", "REST API", "Python", "SQL", "Docker", "Linux", "JWT"],
    education: [{ degree: "B.S.", field: "Computer Science", institution: "University of Texas", cgpa: 3.6, year: 2022 }],
    certifications: ["Meta Backend Developer", "Google IT Support"],
    projects: [
      { name: "E-Learning Platform", description: "Learning management system with user authentication", technologies: ["React", "Node.js", "MongoDB", "JWT"], duration: "4 months" },
      { name: "Weather App", description: "Real-time weather dashboard with API integration", technologies: ["React", "OpenWeather API", "Chart.js"], duration: "1 month" }
    ],
    workExperience: [
      { title: "Junior Full Stack Developer", company: "Startup Inc", duration: "2022-2024", description: ["Built RESTful APIs using Node.js and Express", "Developed React components for the main dashboard", "Maintained MongoDB database with 10K+ users"], technologies: ["React", "Node.js", "MongoDB", "Express"] }
    ],
    achievements: ["Built MVP that secured $2M in funding", "Deployed first production app to AWS"],
    github: "https://github.com/alexrodriguez",
    linkedin: "https://linkedin.com/in/alexrodriguez",
    summary: "Full Stack Developer with 2 years of experience building web applications. Eager to learn and grow.",
    email: "alex.rodriguez@example.com",
    phone: "+1-555-0127",
    location: "Austin, TX",
    languages: ["English", "Spanish"],
    lastUpdated: "2024-03-11"
  }
];

const generateResumes = (): MockResume[] => {
  const categories = {
    "Frontend Developers": { count: 15, titles: ["Junior React Developer", "Senior React Developer", "React Native Developer", "Next.js Developer", "Angular Developer", "Vue.js Developer", "Svelte Developer", "TypeScript Developer", "JavaScript Developer", "Frontend Architect", "UI Developer", "Web Developer", "Frontend Lead", "Frontend Engineer", "Senior Frontend Engineer"], skills: ["React", "Angular", "Vue", "JavaScript", "TypeScript", "HTML", "CSS", "Next.js", "Redux", "Webpack", "Tailwind", "SASS", "GraphQL", "Figma", "Jest"] },
    "Backend Developers": { count: 15, titles: ["Junior Backend Developer", "Senior Backend Developer", "Python Developer", "Java Developer", "Node.js Developer", "Go Developer", "Rust Developer", "Spring Boot Developer", "Django Developer", "Flask Developer", ".NET Developer", "Backend Architect", "Backend Lead", "API Developer", "Microservices Engineer"], skills: ["Java", "Python", "Node.js", "C#", "Go", "Rust", "Spring Boot", "Django", "PostgreSQL", "MongoDB", "Redis", "Kafka", "Docker", "AWS", "REST APIs"] },
    "Full Stack Developers": { count: 10, titles: ["Junior Full Stack Developer", "Senior Full Stack Developer", "MERN Stack Developer", "MEAN Stack Developer", "Full Stack Architect", "Full Stack Lead", "Full Stack Engineer", "Full Stack Python Developer", "Full Stack Java Developer", "Full Stack JavaScript Developer"], skills: ["React", "Node.js", "Express", "MongoDB", "Python", "Django", "PostgreSQL", "Docker", "AWS", "TypeScript", "GraphQL", "Redis", "Git", "Linux"] },
    "AI & ML Engineers": { count: 12, titles: ["Machine Learning Engineer", "AI Engineer", "Deep Learning Engineer", "NLP Engineer", "Computer Vision Engineer", "Data Scientist", "MLOps Engineer", "AI Researcher", "Generative AI Engineer", "LLM Engineer", "Prompt Engineer", "AI Product Manager"], skills: ["Python", "PyTorch", "TensorFlow", "Scikit-learn", "Pandas", "CUDA", "LangChain", "LLMs", "RAG", "MLOps", "Docker", "AWS SageMaker", "SQL", "OpenAI"] },
    "Data Science & Analytics": { count: 12, titles: ["Data Scientist", "Data Analyst", "Business Analyst", "Data Engineer", "BI Developer", "Tableau Developer", "Power BI Developer", "Analytics Engineer", "Big Data Engineer", "Data Architect", "Quantitative Analyst", "Research Scientist"], skills: ["Python", "R", "SQL", "Tableau", "Power BI", "Snowflake", "BigQuery", "Apache Spark", "Hadoop", "Pandas", "dbt", "Airflow", "Excel", "Statistics"] },
    "DevOps & SRE": { count: 12, titles: ["DevOps Engineer", "Site Reliability Engineer", "Cloud Engineer", "Kubernetes Engineer", "Docker Engineer", "CI/CD Engineer", "Infrastructure Engineer", "Platform Engineer", "Cloud Architect", "DevSecOps Engineer", "Automation Engineer", "Build Engineer"], skills: ["Linux", "Bash", "Python", "Docker", "Kubernetes", "Terraform", "Ansible", "Jenkins", "GitLab CI", "AWS", "Prometheus", "Grafana", "Go", "Datadog"] },
    "Cloud Engineers": { count: 10, titles: ["AWS Engineer", "Azure Engineer", "GCP Engineer", "Cloud Solutions Architect", "Cloud Developer", "Cloud Security Engineer", "Cloud Administrator", "Cloud Network Engineer", "Multi-Cloud Architect", "Cloud Consultant"], skills: ["AWS", "Azure", "GCP", "Terraform", "CloudFormation", "Python", "Bash", "Docker", "Kubernetes", "IAM", "Networking", "Serverless", "S3", "EC2"] },
    "Cybersecurity": { count: 10, titles: ["Security Engineer", "Cybersecurity Analyst", "Penetration Tester", "SOC Analyst", "Application Security Engineer", "Cloud Security Engineer", "Security Architect", "Incident Response Engineer", "Ethical Hacker", "GRC Analyst"], skills: ["Wireshark", "Metasploit", "Burp Suite", "Python", "Linux", "AWS Security", "OWASP", "Cryptography", "SIEM", "Splunk", "Nmap", "Firewalls", "Kali Linux"] },
    "Mobile Developers": { count: 10, titles: ["Android Developer", "iOS Developer", "Flutter Developer", "React Native Developer", "Mobile Architect", "Mobile Lead", "Kotlin Developer", "Swift Developer", "Mobile QA Engineer", "Cross-Platform Developer"], skills: ["Swift", "Kotlin", "Java", "Objective-C", "Flutter", "Dart", "React Native", "iOS SDK", "Android SDK", "Firebase", "SQLite", "CoreData", "Git"] },
    "Other Tech Roles": { count: 20, titles: ["QA Engineer", "Automation Tester", "Performance Tester", "Technical Product Manager", "Product Manager", "UX Designer", "UI Designer", "Game Developer", "Blockchain Developer", "Embedded Engineer", "IoT Engineer", "Systems Administrator", "Network Engineer", "Database Administrator", "Technical Consultant", "Solutions Architect", "Enterprise Architect", "Software Architect", "Technical Lead", "Engineering Manager"], skills: ["Agile", "Scrum", "Jira", "Selenium", "C++", "C#", "Solidity", "C", "Figma", "Sketch", "Oracle", "MySQL", "Cisco", "TCP/IP", "System Design", "Leadership"] }
  };

  // Seeded PRNG for determinism so the UI doesn't flicker on hot reloads
  let seed = 1;
  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
  const randomFrom = (arr: any[]) => arr[Math.floor(random() * arr.length)];
  const randomInt = (min: number, max: number) => Math.floor(random() * (max - min + 1)) + min;
  const randomSkills = (pool: string[], count: number) => {
    const shuffled = [...pool].sort(() => 0.5 - random());
    return shuffled.slice(0, count);
  };

  const firstNames = ["James", "Maria", "Robert", "Elena", "Michael", "Sophia", "William", "Isabella", "David", "Mia", "Richard", "Charlotte", "Joseph", "Amelia", "Thomas", "Harper", "Charles", "Evelyn", "Christopher", "Abigail", "Daniel", "Emily", "Matthew", "Elizabeth", "Anthony", "Mila", "Mark", "Ella", "Donald", "Avery"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson"];
  const companies = ["TechCorp", "Innovate LLC", "Global Systems", "DataFlow Inc", "CloudScale", "CyberShield", "WebWorks", "MobileFirst", "AI Solutions", "FutureTech", "StartupX", "Enterprise IT", "FinTech Dynamics", "HealthTech Partners"];
  const universities = ["State University", "Tech Institute", "Global University", "City College", "National Academy", "Polytechnic Institute", "Online University"];

  const generated: MockResume[] = [];
  let currentId = 6;

  for (const [categoryName, data] of Object.entries(categories)) {
    for (let i = 0; i < data.count; i++) {
      const title = data.titles[i % data.titles.length];
      
      if (["Senior React Developer", "Senior Java Developer", "AI Engineer", "Senior DevOps Engineer", "Junior Full Stack Developer"].includes(title)) {
        if(i === 0) continue;
      }

      const exp = (title.includes("Senior") || title.includes("Architect") || title.includes("Lead") || title.includes("Manager")) ? randomInt(6, 15) : title.includes("Junior") ? randomInt(1, 3) : randomInt(3, 7);
      
      const resume: MockResume = {
        id: `resume_${currentId.toString().padStart(3, '0')}`,
        name: `${randomFrom(firstNames)} ${randomFrom(lastNames)}`,
        title: title,
        role: categoryName.split(' ')[0],
        experience: exp,
        skills: randomSkills(data.skills, randomInt(6, 12)),
        education: [
          {
            degree: exp > 8 ? "Master's" : "B.S.",
            field: "Computer Science",
            institution: randomFrom(universities),
            cgpa: Number((random() * 1.5 + 2.5).toFixed(1)),
            year: 2024 - exp - randomInt(1, 4)
          }
        ],
        certifications: ["Relevant Certification " + randomInt(1, 3)],
        projects: [
          {
            name: `${title.split(' ')[0]} Project`,
            description: "Implemented core features and optimized performance.",
            technologies: randomSkills(data.skills, randomInt(3, 5)),
            duration: `${randomInt(2, 6)} months`
          }
        ],
        workExperience: [
          {
            title: title,
            company: randomFrom(companies),
            duration: `20${24 - Math.floor(exp/2)}-2024`,
            description: [
              "Developed scalable applications and mentored junior developers.",
              "Improved system performance by 30%.",
              "Collaborated with cross-functional teams."
            ],
            technologies: randomSkills(data.skills, randomInt(4, 6))
          }
        ],
        achievements: ["Employee of the Month", "Delivered project ahead of schedule"],
        summary: `${title} with ${exp} years of experience in building high-quality software solutions.`,
        email: `user${currentId}@example.com`,
        phone: "+1-555-" + currentId.toString().padStart(4, '0'),
        location: "Remote",
        languages: ["English"],
        lastUpdated: "2024-03-01"
      };
      
      generated.push(resume);
      currentId++;
    }
  }

  return [...manualExamples, ...generated];
};

export const MOCK_RESUMES = generateResumes();
