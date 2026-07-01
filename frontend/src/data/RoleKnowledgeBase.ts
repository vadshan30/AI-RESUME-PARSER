export interface ScoringWeights {
  skills: number;
  experience: number;
  ats: number;
  projects: number;
  education: number;
}

export interface SalaryRange {
  entry: number;
  mid: number;
  senior: number;
  lead: number;
}

export interface RoadmapTemplates {
  immediate: string[];
  shortTerm: string[];
  longTerm: string[];
}

export interface RoleProfile {
  name: string;
  idealExperience: number;
  idealEducation: string;
  requiredSkills: string[];
  preferredSkills: string[];
  expectedProjects: string[];
  certifications: string[];
  topCompanies: { name: string; type: string; diff: 'Very High' | 'High' | 'Medium' }[];
  salaryRange: SalaryRange;
  interviewTopics: string[];
  scoringWeights: ScoringWeights;
  roadmapTemplates: RoadmapTemplates;
}

export const ROLE_KNOWLEDGE_BASE: Record<string, RoleProfile> = {
  "Ruby on Rails Developer": {
    name: "Ruby on Rails Developer",
    idealExperience: 5,
    idealEducation: "Bachelor's",
    requiredSkills: ["Ruby", "Ruby on Rails", "PostgreSQL", "Redis", "Sidekiq", "REST API", "GraphQL", "RSpec", "Docker", "Git", "Linux", "Capistrano", "Heroku", "AWS", "Nginx"],
    preferredSkills: ["React", "Stimulus", "Turbo", "Hotwire"],
    expectedProjects: ["E-commerce Platform", "Booking System", "CRM", "Payment Integration", "Authentication", "API Development"],
    certifications: ["AWS Certified Developer", "Ruby Association Certified Ruby Programmer"],
    topCompanies: [
      { name: "Shopify", type: "Tech", diff: "Very High" },
      { name: "GitLab", type: "Tech", diff: "Very High" },
      { name: "Basecamp", type: "Tech", diff: "High" },
      { name: "GitHub", type: "FAANG", diff: "Very High" },
      { name: "Thoughtbot", type: "Consulting", diff: "High" },
      { name: "37signals", type: "Tech", diff: "High" }
    ],
    salaryRange: { entry: 600000, mid: 1200000, senior: 2000000, lead: 3000000 },
    interviewTopics: ["Rails Architecture", "MVC", "ActiveRecord", "Performance Optimization", "Caching", "Background Jobs", "Testing", "Deployment"],
    scoringWeights: { skills: 40, experience: 20, ats: 20, projects: 10, education: 10 },
    roadmapTemplates: {
      immediate: ["Learn Ruby fundamentals", "Understand MVC architecture", "Build a simple Rails CRUD app"],
      shortTerm: ["Master ActiveRecord associations", "Implement authentication (Devise)", "Deploy to Heroku"],
      longTerm: ["Master RSpec testing", "Implement Redis and Sidekiq for background jobs", "Scale production deployment on AWS"]
    }
  },
  "Frontend Developer": {
    name: "Frontend Developer",
    idealExperience: 4,
    idealEducation: "Bachelor's",
    requiredSkills: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Redux", "Tailwind", "Webpack", "Responsive Design", "Accessibility", "Performance Optimization"],
    preferredSkills: ["Vue.js", "Svelte", "Framer Motion", "GraphQL Apollo"],
    expectedProjects: ["Portfolio", "Dashboard", "Admin Panel", "Landing Page", "PWA"],
    certifications: ["Meta Front-End Developer Certificate", "AWS Certified Developer"],
    topCompanies: [
      { name: "Vercel", type: "Tech", diff: "Very High" },
      { name: "Netlify", type: "Tech", diff: "High" },
      { name: "Adobe", type: "Tech", diff: "Very High" },
      { name: "Canva", type: "Tech", diff: "High" },
      { name: "Figma", type: "Tech", diff: "Very High" }
    ],
    salaryRange: { entry: 500000, mid: 1000000, senior: 1800000, lead: 2500000 },
    interviewTopics: ["DOM Manipulation", "React Hooks", "State Management", "CSS Layouts", "Web Vitals", "Accessibility"],
    scoringWeights: { skills: 50, experience: 15, ats: 15, projects: 15, education: 5 },
    roadmapTemplates: {
      immediate: ["Master HTML/CSS and responsive design", "Deep dive into ES6+ JavaScript", "Build interactive components"],
      shortTerm: ["Learn React and Hooks", "Implement global state (Redux/Zustand)", "Build a dynamic Portfolio"],
      longTerm: ["Master Next.js SSR/SSG", "Optimize Web Vitals and accessibility", "Deploy complex PWAs"]
    }
  },
  "Backend Developer": {
    name: "Backend Developer",
    idealExperience: 5,
    idealEducation: "Bachelor's",
    requiredSkills: ["Java", "Spring Boot", "REST", "JWT", "OAuth", "MySQL", "Redis", "Kafka", "RabbitMQ", "Docker", "Kubernetes", "System Design"],
    preferredSkills: ["Go", "Node.js", "GraphQL", "AWS"],
    expectedProjects: ["Authentication System", "Microservices Architecture", "Payment Gateway", "Scalable APIs"],
    certifications: ["AWS Certified Solutions Architect", "CKA (Kubernetes Administrator)"],
    topCompanies: [
      { name: "Uber", type: "Tech", diff: "Very High" },
      { name: "Stripe", type: "Fintech", diff: "Very High" },
      { name: "Netflix", type: "FAANG", diff: "Very High" },
      { name: "Square", type: "Fintech", diff: "High" },
      { name: "Twilio", type: "Tech", diff: "High" }
    ],
    salaryRange: { entry: 600000, mid: 1200000, senior: 2200000, lead: 3200000 },
    interviewTopics: ["System Design", "Microservices vs Monoliths", "Database Indexing", "Message Queues", "Caching Strategies"],
    scoringWeights: { skills: 35, experience: 25, ats: 20, projects: 10, education: 10 },
    roadmapTemplates: {
      immediate: ["Master primary language (Java/Go/Node)", "Build secure REST APIs with JWT", "Understand relational databases"],
      shortTerm: ["Implement caching (Redis)", "Dockerize applications", "Build a microservice ecosystem"],
      longTerm: ["Master system design for high scale", "Implement event-driven architecture (Kafka)", "Orchestrate with Kubernetes"]
    }
  },
  "AI Engineer": {
    name: "AI Engineer",
    idealExperience: 4,
    idealEducation: "Master's",
    requiredSkills: ["Python", "PyTorch", "TensorFlow", "Transformers", "LangChain", "LLMs", "RAG", "Vector Databases", "Prompt Engineering", "Model Deployment"],
    preferredSkills: ["C++", "CUDA", "FastAPI", "ONNX"],
    expectedProjects: ["Chatbot", "RAG System", "Recommendation Engine", "Vision Model", "LLM Assistant"],
    certifications: ["DeepLearning.AI TensorFlow Developer", "AWS Certified Machine Learning"],
    topCompanies: [
      { name: "OpenAI", type: "AI Lab", diff: "Very High" },
      { name: "Anthropic", type: "AI Lab", diff: "Very High" },
      { name: "Google DeepMind", type: "FAANG", diff: "Very High" },
      { name: "NVIDIA", type: "Tech", diff: "Very High" },
      { name: "Meta AI", type: "FAANG", diff: "Very High" },
      { name: "Hugging Face", type: "AI Startup", diff: "High" }
    ],
    salaryRange: { entry: 800000, mid: 1600000, senior: 2800000, lead: 4500000 },
    interviewTopics: ["Transformer Architecture", "Attention Mechanisms", "RAG Implementation", "Fine-tuning", "Vector Search"],
    scoringWeights: { skills: 45, experience: 15, ats: 15, projects: 15, education: 10 },
    roadmapTemplates: {
      immediate: ["Master Python and NumPy", "Understand deep learning fundamentals", "Build a basic neural network"],
      shortTerm: ["Learn PyTorch or TensorFlow", "Implement NLP pipelines with Transformers", "Build a RAG system with Vector DBs"],
      longTerm: ["Fine-tune custom LLMs", "Optimize model deployment and inference", "Contribute to open-source AI projects"]
    }
  },
  "Data Scientist": {
    name: "Data Scientist",
    idealExperience: 4,
    idealEducation: "Master's",
    requiredSkills: ["Python", "Statistics", "Pandas", "NumPy", "Scikit-learn", "SQL", "Power BI", "Tableau", "Feature Engineering", "Machine Learning"],
    preferredSkills: ["R", "Spark", "Hadoop", "AWS SageMaker"],
    expectedProjects: ["Prediction Models", "Customer Segmentation", "Recommendation System", "Fraud Detection"],
    certifications: ["Google Data Analytics", "AWS Certified Data Analytics"],
    topCompanies: [
      { name: "Meta", type: "FAANG", diff: "Very High" },
      { name: "Airbnb", type: "Tech", diff: "Very High" },
      { name: "Spotify", type: "Tech", diff: "High" },
      { name: "DoorDash", type: "Tech", diff: "High" },
      { name: "Netflix", type: "FAANG", diff: "Very High" }
    ],
    salaryRange: { entry: 700000, mid: 1400000, senior: 2400000, lead: 3500000 },
    interviewTopics: ["Probability and Statistics", "A/B Testing", "Machine Learning Algorithms", "SQL Queries", "Data Visualization"],
    scoringWeights: { skills: 35, experience: 20, ats: 15, projects: 15, education: 15 },
    roadmapTemplates: {
      immediate: ["Master Python, Pandas, and SQL", "Learn descriptive statistics", "Perform exploratory data analysis (EDA)"],
      shortTerm: ["Learn Scikit-learn for machine learning", "Build classification and regression models", "Create interactive dashboards (Tableau/Power BI)"],
      longTerm: ["Master advanced statistics and A/B testing", "Implement scalable pipelines with Spark", "Deploy ML models to production"]
    }
  }
};

export const getRoleProfile = (roleName: string): RoleProfile => {
  // If exact match found
  if (ROLE_KNOWLEDGE_BASE[roleName]) {
    return ROLE_KNOWLEDGE_BASE[roleName];
  }

  // Fuzzy matching fallback
  const lowerRole = roleName.toLowerCase();
  for (const [key, profile] of Object.entries(ROLE_KNOWLEDGE_BASE)) {
    if (lowerRole.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerRole)) {
      return profile;
    }
  }

  // Ultimate generic fallback if nothing matches
  return {
    name: roleName,
    idealExperience: 4,
    idealEducation: "Bachelor's",
    requiredSkills: ["JavaScript", "Python", "SQL", "Git", "Docker", "Agile", "REST API", "Communication"],
    preferredSkills: ["Cloud Platforms", "CI/CD"],
    expectedProjects: ["Full Stack Application", "API Integration", "Database Migration"],
    certifications: ["AWS Cloud Practitioner"],
    topCompanies: [
      { name: "Google", type: "FAANG", diff: "Very High" },
      { name: "Amazon", type: "FAANG", diff: "Very High" },
      { name: "Local Tech", type: "Tech", diff: "Medium" }
    ],
    salaryRange: { entry: 500000, mid: 1000000, senior: 1800000, lead: 2500000 },
    interviewTopics: ["System Design", "Behavioral", "Data Structures", "Algorithms"],
    scoringWeights: { skills: 30, experience: 30, ats: 20, projects: 10, education: 10 },
    roadmapTemplates: {
      immediate: ["Improve ATS formatting", "Add more metrics to experience bullets"],
      shortTerm: ["Build a portfolio project", "Learn Docker"],
      longTerm: ["Attain a cloud certification", "Apply for senior roles"]
    }
  };
};
