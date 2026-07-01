import { RoleAnalysisData } from '../types/PlatformAnalysisData';

export const allRoleAnalyses: Record<string, RoleAnalysisData> = {
  "Junior React Developer": {
    roleName: "Junior React Developer",
    category: "Frontend",
    experienceLevel: "Junior",
    platformScore: 62,
    atsScore: 58,
    hireProbability: 55,
    careerReadiness: 50,
    industryRank: "Top 45%",
    totalSkills: 12,
    totalProjects: 2,
    experienceYears: 1.5,
    educationCount: 1,
    extractedSkills: ["React", "JavaScript", "HTML5", "CSS3", "Git", "Bootstrap", "REST APIs", "Redux", "Jest", "Webpack", "NPM", "Chrome DevTools"],
    categories: [
      { name: "Frontend", count: 8, demand: 95 },
      { name: "Backend", count: 2, demand: 60 },
      { name: "Tools", count: 2, demand: 70 }
    ],
    atsPerformance: {
      formatting: 65,
      skills: 60,
      keywords: 55,
      achievements: 40,
      readability: 75,
      actionVerbs: 50,
      education: 80,
      experience: 45,
      projects: 55
    },
    qualityBreakdown: {
      formatting: 65,
      content: 60,
      skills: 60,
      experience: 45,
      education: 80,
      achievements: 40,
      projects: 55,
      leadership: 20,
      communication: 65
    },
    benchmarks: {
      freshers: 95,
      junior: 65,
      midLevel: 25,
      senior: 8,
      lead: 2
    },
    jobReadiness: {
      startups: 75,
      productCompanies: 60,
      serviceMNCs: 85,
      remoteJobs: 70,
      faang: 25,
      unicorns: 40
    },
    skillIntelligence: {
      "Frontend": { skillsFound: 8, marketDemand: 95, growthRate: 15, salaryImpact: 10 },
      "Backend": { skillsFound: 2, marketDemand: 60, growthRate: 10, salaryImpact: 5 },
      "Tools": { skillsFound: 2, marketDemand: 70, growthRate: 8, salaryImpact: 3 }
    },
    aiSummary: "You have a solid foundation in React and modern JavaScript. Your resume shows good understanding of frontend fundamentals. To improve, focus on building more projects, learning TypeScript, and adding measurable achievements. Consider contributing to open source to strengthen your portfolio.",
    suggestions: [
      { text: "Learn TypeScript to improve code quality and job prospects", impact: "CRITICAL", time: "2 weeks", category: "Skills" },
      { text: "Build 2-3 portfolio projects showcasing React skills", impact: "HIGH", time: "1 month", category: "Projects" },
      { text: "Add measurable achievements with numbers and percentages", impact: "HIGH", time: "30 mins", category: "ATS" },
      { text: "Learn state management with Redux or Zustand", impact: "MEDIUM", time: "2 weeks", category: "Skills" },
      { text: "Create a personal portfolio website", impact: "MEDIUM", time: "1 week", category: "Projects" }
    ],
    careerGrowth: {
      currentRole: "Junior React Developer",
      nextRole: "React Developer",
      nextRoleTimeline: "Estimated 1-2 years",
      futureRole: "Senior React Developer",
      futureRoleTimeline: "Estimated 3-4 years",
      leadershipRole: "Frontend Lead",
      leadershipRoleTimeline: "Estimated 5-6 years",
      executiveRole: "Frontend Architect",
      executiveRoleTimeline: "Estimated 7-8 years"
    },
    companyFit: [
      { name: "Startup", fitScore: 75, missingSkills: ["TypeScript", "Next.js"], interviewDifficulty: "Medium" },
      { name: "TCS", fitScore: 85, missingSkills: ["Angular"], interviewDifficulty: "Easy" },
      { name: "Infosys", fitScore: 80, missingSkills: ["Java"], interviewDifficulty: "Medium" }
    ],
    salary: {
      current: { min: 350000, average: 450000, max: 600000 },
      afterImprovements: { min: 450000, average: 550000, max: 700000 },
      currency: "INR"
    },
    interviewReadiness: {
      technical: 55,
      behavioral: 50,
      systemDesign: 30,
      coding: 50,
      communication: 60
    }
  },
  "Mid React Developer": {
    roleName: "Mid React Developer",
    category: "Frontend",
    experienceLevel: "Mid",
    platformScore: 78,
    atsScore: 82,
    hireProbability: 80,
    careerReadiness: 78,
    industryRank: "Top 22%",
    totalSkills: 20,
    totalProjects: 4,
    experienceYears: 4,
    educationCount: 2,
    extractedSkills: ["React", "TypeScript", "Next.js", "Redux Toolkit", "Tailwind CSS", "Jest", "GraphQL", "Apollo Client", "Docker", "Git", "CI/CD", "AWS", "Storybook", "Figma", "Webpack", "Node.js", "Express", "MongoDB", "PostgreSQL", "Linux"],
    categories: [
      { name: "Frontend", count: 12, demand: 95 },
      { name: "Backend", count: 4, demand: 75 },
      { name: "Cloud", count: 2, demand: 80 },
      { name: "DevOps", count: 2, demand: 70 }
    ],
    atsPerformance: {
      formatting: 85,
      skills: 90,
      keywords: 88,
      achievements: 75,
      readability: 92,
      actionVerbs: 82,
      education: 90,
      experience: 80,
      projects: 85
    },
    qualityBreakdown: {
      formatting: 85,
      content: 90,
      skills: 90,
      experience: 80,
      education: 88,
      achievements: 75,
      projects: 85,
      leadership: 50,
      communication: 80
    },
    benchmarks: {
      freshers: 95,
      junior: 82,
      midLevel: 55,
      senior: 18,
      lead: 5
    },
    jobReadiness: {
      startups: 92,
      productCompanies: 85,
      serviceMNCs: 95,
      remoteJobs: 88,
      faang: 55,
      unicorns: 70
    },
    skillIntelligence: {
      "Frontend": { skillsFound: 12, marketDemand: 95, growthRate: 15, salaryImpact: 12 },
      "Backend": { skillsFound: 4, marketDemand: 75, growthRate: 12, salaryImpact: 8 },
      "Cloud": { skillsFound: 2, marketDemand: 80, growthRate: 20, salaryImpact: 10 },
      "DevOps": { skillsFound: 2, marketDemand: 70, growthRate: 18, salaryImpact: 7 }
    },
    aiSummary: "You have strong React and TypeScript skills with good project experience. Your understanding of Next.js and modern frontend architecture is impressive. To advance to senior level, focus on system design, performance optimization at scale, and leadership skills. Consider contributing to open source and building a stronger portfolio.",
    suggestions: [
      { text: "Learn micro-frontend architecture with Module Federation", impact: "HIGH", time: "3 weeks", category: "Skills" },
      { text: "Add system design examples to your experience section", impact: "HIGH", time: "30 mins", category: "Experience" },
      { text: "Get AWS certification to boost cloud credibility", impact: "MEDIUM", time: "1 month", category: "Certifications" },
      { text: "Build a complex project with GraphQL federation", impact: "MEDIUM", time: "2 months", category: "Projects" },
      { text: "Mentor junior developers and document leadership", impact: "MEDIUM", time: "Ongoing", category: "Leadership" }
    ],
    careerGrowth: {
      currentRole: "React Developer",
      nextRole: "Senior React Developer",
      nextRoleTimeline: "Estimated 1-2 years",
      futureRole: "Frontend Lead",
      futureRoleTimeline: "Estimated 3-4 years",
      leadershipRole: "Frontend Architect",
      leadershipRoleTimeline: "Estimated 5-6 years",
      executiveRole: "Director of Frontend Engineering",
      executiveRoleTimeline: "Estimated 8-10 years"
    },
    companyFit: [
      { name: "Google", fitScore: 55, missingSkills: ["Go", "System Design", "Algorithms"], interviewDifficulty: "Very Hard" },
      { name: "Microsoft", fitScore: 60, missingSkills: ["Azure", "C#"], interviewDifficulty: "Very Hard" },
      { name: "Amazon", fitScore: 50, missingSkills: ["AWS", "DynamoDB"], interviewDifficulty: "Very Hard" },
      { name: "Zoho", fitScore: 85, missingSkills: ["Java"], interviewDifficulty: "Medium" }
    ],
    salary: {
      current: { min: 800000, average: 1000000, max: 1400000 },
      afterImprovements: { min: 1000000, average: 1200000, max: 1600000 },
      currency: "INR"
    },
    interviewReadiness: {
      technical: 75,
      behavioral: 70,
      systemDesign: 55,
      coding: 75,
      communication: 80
    }
  },
  "Senior React Developer": {
    roleName: "Senior React Developer",
    category: "Frontend",
    experienceLevel: "Senior",
    platformScore: 92,
    atsScore: 95,
    hireProbability: 92,
    careerReadiness: 90,
    industryRank: "Top 8%",
    totalSkills: 28,
    totalProjects: 8,
    experienceYears: 8,
    educationCount: 2,
    extractedSkills: ["React", "TypeScript", "Next.js", "Redux Toolkit", "React Query", "Tailwind CSS", "Jest", "Cypress", "GraphQL", "Apollo Client", "Docker", "Kubernetes", "AWS", "GCP", "Storybook", "Micro-frontend", "Module Federation", "Node.js", "Express", "PostgreSQL", "MongoDB", "Redis", "Webpack", "Vite", "Rust", "Go", "Python"],
    categories: [
      { name: "Frontend", count: 15, demand: 98 },
      { name: "Backend", count: 5, demand: 80 },
      { name: "Cloud", count: 4, demand: 90 },
      { name: "DevOps", count: 4, demand: 85 }
    ],
    atsPerformance: {
      formatting: 95,
      skills: 98,
      keywords: 95,
      achievements: 90,
      readability: 95,
      actionVerbs: 92,
      education: 95,
      experience: 92,
      projects: 95
    },
    qualityBreakdown: {
      formatting: 95,
      content: 98,
      skills: 98,
      experience: 92,
      education: 95,
      achievements: 90,
      projects: 95,
      leadership: 85,
      communication: 90
    },
    benchmarks: {
      freshers: 98,
      junior: 95,
      midLevel: 85,
      senior: 55,
      lead: 25
    },
    jobReadiness: {
      startups: 98,
      productCompanies: 95,
      serviceMNCs: 98,
      remoteJobs: 95,
      faang: 85,
      unicorns: 90
    },
    skillIntelligence: {
      "Frontend": { skillsFound: 15, marketDemand: 98, growthRate: 12, salaryImpact: 15 },
      "Backend": { skillsFound: 5, marketDemand: 80, growthRate: 10, salaryImpact: 10 },
      "Cloud": { skillsFound: 4, marketDemand: 90, growthRate: 20, salaryImpact: 12 },
      "DevOps": { skillsFound: 4, marketDemand: 85, growthRate: 18, salaryImpact: 10 }
    },
    aiSummary: "You are a highly skilled Senior React Developer with excellent TypeScript, Next.js, and micro-frontend expertise. Your cloud and DevOps experience is exceptional. You're ready for Lead/Architect roles. Focus on system design at scale and leadership. Consider contributing to major open-source projects and speaking at conferences.",
    suggestions: [
      { text: "Contribute to major open-source React projects", impact: "HIGH", time: "Ongoing", category: "Projects" },
      { text: "Start speaking at conferences and writing technical blogs", impact: "HIGH", time: "Ongoing", category: "Communication" },
      { text: "Learn Rust or Go for systems programming", impact: "MEDIUM", time: "3 months", category: "Skills" },
      { text: "Get AWS Solutions Architect certification", impact: "MEDIUM", time: "2 months", category: "Certifications" }
    ],
    careerGrowth: {
      currentRole: "Senior React Developer",
      nextRole: "Frontend Lead",
      nextRoleTimeline: "Estimated 1 year",
      futureRole: "Frontend Architect",
      futureRoleTimeline: "Estimated 2-3 years",
      leadershipRole: "Director of Frontend Engineering",
      leadershipRoleTimeline: "Estimated 4-5 years",
      executiveRole: "VP of Engineering",
      executiveRoleTimeline: "Estimated 7-10 years"
    },
    companyFit: [
      { name: "Google", fitScore: 85, missingSkills: ["Algorithms"], interviewDifficulty: "Very Hard" },
      { name: "Microsoft", fitScore: 90, missingSkills: ["Azure"], interviewDifficulty: "Very Hard" },
      { name: "Amazon", fitScore: 88, missingSkills: ["AWS"], interviewDifficulty: "Very Hard" },
      { name: "Meta", fitScore: 92, missingSkills: ["PHP"], interviewDifficulty: "Very Hard" }
    ],
    salary: {
      current: { min: 2000000, average: 2500000, max: 3500000 },
      afterImprovements: { min: 2500000, average: 3000000, max: 4000000 },
      currency: "INR"
    },
    interviewReadiness: {
      technical: 92,
      behavioral: 85,
      systemDesign: 85,
      coding: 90,
      communication: 90
    }
  },
  "Java Developer": {
    roleName: "Java Developer",
    category: "Backend",
    experienceLevel: "Mid",
    platformScore: 80,
    atsScore: 85,
    hireProbability: 82,
    careerReadiness: 78,
    industryRank: "Top 20%",
    totalSkills: 22,
    totalProjects: 3,
    experienceYears: 5,
    educationCount: 2,
    extractedSkills: ["Java", "Spring Boot", "Spring Security", "Spring Data JPA", "Hibernate", "PostgreSQL", "MySQL", "Redis", "Kafka", "RabbitMQ", "Docker", "Kubernetes", "AWS", "Maven", "Gradle", "JUnit", "Mockito", "REST APIs", "GraphQL", "gRPC", "Microservices", "Design Patterns"],
    categories: [
      { name: "Backend", count: 14, demand: 95 },
      { name: "Cloud", count: 4, demand: 85 },
      { name: "DevOps", count: 3, demand: 75 },
      { name: "Database", count: 3, demand: 80 }
    ],
    atsPerformance: {
      formatting: 82,
      skills: 88,
      keywords: 85,
      achievements: 78,
      readability: 85,
      actionVerbs: 80,
      education: 90,
      experience: 85,
      projects: 80
    },
    qualityBreakdown: {
      formatting: 82,
      content: 90,
      skills: 88,
      experience: 85,
      education: 90,
      achievements: 78,
      projects: 80,
      leadership: 45,
      communication: 70
    },
    benchmarks: {
      freshers: 95,
      junior: 85,
      midLevel: 55,
      senior: 20,
      lead: 5
    },
    jobReadiness: {
      startups: 85,
      productCompanies: 88,
      serviceMNCs: 95,
      remoteJobs: 82,
      faang: 45,
      unicorns: 65
    },
    skillIntelligence: {
      "Backend": { skillsFound: 14, marketDemand: 95, growthRate: 12, salaryImpact: 12 },
      "Cloud": { skillsFound: 4, marketDemand: 85, growthRate: 20, salaryImpact: 10 },
      "DevOps": { skillsFound: 3, marketDemand: 75, growthRate: 18, salaryImpact: 8 },
      "Database": { skillsFound: 3, marketDemand: 80, growthRate: 8, salaryImpact: 5 }
    },
    aiSummary: "You have strong Java/Spring Boot expertise with solid microservices experience. Your cloud and containerization skills are good. To advance, focus on system design, architectural patterns, and leadership. Consider learning Kotlin or Scala for functional programming and get certified in AWS/Azure.",
    suggestions: [
      { text: "Learn Kotlin or Scala for functional programming", impact: "MEDIUM", time: "2 months", category: "Skills" },
      { text: "Get AWS Solutions Architect certification", impact: "HIGH", time: "2 months", category: "Certifications" },
      { text: "Study system design and distributed systems", impact: "HIGH", time: "3 months", category: "Skills" },
      { text: "Build a real-time event-driven microservices project", impact: "HIGH", time: "3 months", category: "Projects" }
    ],
    careerGrowth: {
      currentRole: "Java Developer",
      nextRole: "Senior Java Developer",
      nextRoleTimeline: "Estimated 1-2 years",
      futureRole: "Java Lead",
      futureRoleTimeline: "Estimated 3-4 years",
      leadershipRole: "Backend Architect",
      leadershipRoleTimeline: "Estimated 5-6 years",
      executiveRole: "Director of Engineering",
      executiveRoleTimeline: "Estimated 8-10 years"
    },
    companyFit: [
      { name: "Amazon", fitScore: 45, missingSkills: ["AWS", "Distributed Systems"], interviewDifficulty: "Very Hard" },
      { name: "TCS", fitScore: 95, missingSkills: [], interviewDifficulty: "Easy" },
      { name: "Infosys", fitScore: 92, missingSkills: [], interviewDifficulty: "Easy" },
      { name: "Oracle", fitScore: 88, missingSkills: ["Oracle DB", "Cloud"], interviewDifficulty: "Medium" }
    ],
    salary: {
      current: { min: 900000, average: 1200000, max: 1800000 },
      afterImprovements: { min: 1200000, average: 1500000, max: 2200000 },
      currency: "INR"
    },
    interviewReadiness: {
      technical: 80,
      behavioral: 70,
      systemDesign: 60,
      coding: 85,
      communication: 75
    }
  },
  "Python Developer": {
    roleName: "Python Developer",
    category: "Backend",
    experienceLevel: "Mid",
    platformScore: 76,
    atsScore: 80,
    hireProbability: 78,
    careerReadiness: 75,
    industryRank: "Top 25%",
    totalSkills: 20,
    totalProjects: 4,
    experienceYears: 4,
    educationCount: 2,
    extractedSkills: ["Python", "Django", "Flask", "FastAPI", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Celery", "Docker", "AWS", "REST APIs", "GraphQL", "Pandas", "NumPy", "Pytest", "Git", "Linux", "Nginx", "Gunicorn"],
    categories: [
      { name: "Backend", count: 12, demand: 90 },
      { name: "Data", count: 4, demand: 85 },
      { name: "Cloud", count: 2, demand: 80 },
      { name: "DevOps", count: 2, demand: 70 }
    ],
    atsPerformance: {
      formatting: 80,
      skills: 85,
      keywords: 80,
      achievements: 70,
      readability: 85,
      actionVerbs: 75,
      education: 85,
      experience: 75,
      projects: 80
    },
    qualityBreakdown: {
      formatting: 80,
      content: 85,
      skills: 85,
      experience: 75,
      education: 85,
      achievements: 70,
      projects: 80,
      leadership: 35,
      communication: 75
    },
    benchmarks: {
      freshers: 92,
      junior: 78,
      midLevel: 45,
      senior: 15,
      lead: 3
    },
    jobReadiness: {
      startups: 88,
      productCompanies: 82,
      serviceMNCs: 90,
      remoteJobs: 85,
      faang: 35,
      unicorns: 55
    },
    skillIntelligence: {
      "Backend": { skillsFound: 12, marketDemand: 90, growthRate: 10, salaryImpact: 10 },
      "Data": { skillsFound: 4, marketDemand: 85, growthRate: 15, salaryImpact: 8 },
      "Cloud": { skillsFound: 2, marketDemand: 80, growthRate: 20, salaryImpact: 8 },
      "DevOps": { skillsFound: 2, marketDemand: 70, growthRate: 18, salaryImpact: 5 }
    },
    aiSummary: "You have solid Python/Django expertise with good API development experience. Your data processing skills are a plus. To improve, focus on microservices, async programming with FastAPI, and cloud deployment. Consider learning Go or Rust for better performance and scalability.",
    suggestions: [
      { text: "Learn FastAPI for async Python development", impact: "HIGH", time: "2 weeks", category: "Skills" },
      { text: "Study microservices architecture with Python", impact: "HIGH", time: "2 months", category: "Skills" },
      { text: "Get AWS certification for cloud credibility", impact: "MEDIUM", time: "1 month", category: "Certifications" },
      { text: "Build a real-time data pipeline project", impact: "MEDIUM", time: "2 months", category: "Projects" }
    ],
    careerGrowth: {
      currentRole: "Python Developer",
      nextRole: "Senior Python Developer",
      nextRoleTimeline: "Estimated 1-2 years",
      futureRole: "Python Lead",
      futureRoleTimeline: "Estimated 3-4 years",
      leadershipRole: "Backend Architect",
      leadershipRoleTimeline: "Estimated 5-6 years",
      executiveRole: "Director of Engineering",
      executiveRoleTimeline: "Estimated 8-10 years"
    },
    companyFit: [
      { name: "Google", fitScore: 35, missingSkills: ["Go", "C++", "Algorithms"], interviewDifficulty: "Very Hard" },
      { name: "Amazon", fitScore: 40, missingSkills: ["AWS", "Java"], interviewDifficulty: "Very Hard" },
      { name: "Zoho", fitScore: 85, missingSkills: [], interviewDifficulty: "Medium" },
      { name: "Freshworks", fitScore: 82, missingSkills: ["Ruby"], interviewDifficulty: "Medium" }
    ],
    salary: {
      current: { min: 700000, average: 900000, max: 1400000 },
      afterImprovements: { min: 900000, average: 1200000, max: 1700000 },
      currency: "INR"
    },
    interviewReadiness: {
      technical: 75,
      behavioral: 65,
      systemDesign: 50,
      coding: 70,
      communication: 70
    }
  },
  "Machine Learning Engineer": {
    roleName: "Machine Learning Engineer",
    category: "AI/ML",
    experienceLevel: "Mid",
    platformScore: 82,
    atsScore: 78,
    hireProbability: 80,
    careerReadiness: 76,
    industryRank: "Top 18%",
    totalSkills: 20,
    totalProjects: 4,
    experienceYears: 4,
    educationCount: 2,
    extractedSkills: ["Python", "PyTorch", "TensorFlow", "Scikit-learn", "Pandas", "NumPy", "SQL", "PostgreSQL", "Docker", "AWS SageMaker", "MLflow", "Kubeflow", "DVC", "Kafka", "FastAPI", "Linux", "Git", "Airflow", "Spark", "Hadoop"],
    categories: [
      { name: "ML/DL", count: 10, demand: 95 },
      { name: "Data", count: 5, demand: 85 },
      { name: "Cloud", count: 3, demand: 80 },
      { name: "DevOps", count: 2, demand: 70 }
    ],
    atsPerformance: {
      formatting: 75,
      skills: 80,
      keywords: 75,
      achievements: 70,
      readability: 80,
      actionVerbs: 72,
      education: 95,
      experience: 70,
      projects: 75
    },
    qualityBreakdown: {
      formatting: 75,
      content: 85,
      skills: 80,
      experience: 70,
      education: 95,
      achievements: 70,
      projects: 75,
      leadership: 35,
      communication: 65
    },
    benchmarks: {
      freshers: 95,
      junior: 80,
      midLevel: 50,
      senior: 18,
      lead: 5
    },
    jobReadiness: {
      startups: 85,
      productCompanies: 80,
      serviceMNCs: 88,
      remoteJobs: 82,
      faang: 40,
      unicorns: 60
    },
    skillIntelligence: {
      "ML/DL": { skillsFound: 10, marketDemand: 95, growthRate: 25, salaryImpact: 15 },
      "Data": { skillsFound: 5, marketDemand: 85, growthRate: 15, salaryImpact: 8 },
      "Cloud": { skillsFound: 3, marketDemand: 80, growthRate: 20, salaryImpact: 10 },
      "DevOps": { skillsFound: 2, marketDemand: 70, growthRate: 18, salaryImpact: 5 }
    },
    aiSummary: "You have strong ML and Python skills with good model development experience. Your MLOps and deployment skills need improvement. To advance, focus on LLMs, Generative AI, and production ML systems. Consider contributing to open-source ML projects and getting cloud ML certifications.",
    suggestions: [
      { text: "Learn LLMs and Generative AI with LangChain", impact: "CRITICAL", time: "2 months", category: "Skills" },
      { text: "Master MLOps with MLflow and Kubeflow", impact: "HIGH", time: "2 months", category: "Skills" },
      { text: "Get AWS ML Specialty or Google ML certification", impact: "HIGH", time: "1 month", category: "Certifications" },
      { text: "Build an end-to-end ML project from training to deployment", impact: "HIGH", time: "2 months", category: "Projects" }
    ],
    careerGrowth: {
      currentRole: "Machine Learning Engineer",
      nextRole: "Senior ML Engineer",
      nextRoleTimeline: "Estimated 1-2 years",
      futureRole: "ML Lead",
      futureRoleTimeline: "Estimated 3-4 years",
      leadershipRole: "ML Architect",
      leadershipRoleTimeline: "Estimated 5-6 years",
      executiveRole: "Director of AI",
      executiveRoleTimeline: "Estimated 8-10 years"
    },
    companyFit: [
      { name: "Google DeepMind", fitScore: 30, missingSkills: ["Research", "LLMs", "Publications"], interviewDifficulty: "Very Hard" },
      { name: "OpenAI", fitScore: 25, missingSkills: ["Transformers", "RL", "Research"], interviewDifficulty: "Very Hard" },
      { name: "Zoho AI", fitScore: 80, missingSkills: ["TinyML"], interviewDifficulty: "Medium" },
      { name: "Freshworks AI", fitScore: 78, missingSkills: ["NLP"], interviewDifficulty: "Medium" }
    ],
    salary: {
      current: { min: 1200000, average: 1600000, max: 2500000 },
      afterImprovements: { min: 1800000, average: 2200000, max: 3200000 },
      currency: "INR"
    },
    interviewReadiness: {
      technical: 75,
      behavioral: 65,
      systemDesign: 55,
      coding: 70,
      communication: 65
    }
  },
  "Data Scientist": {
    roleName: "Data Scientist",
    category: "AI/ML",
    experienceLevel: "Mid",
    platformScore: 78,
    atsScore: 75,
    hireProbability: 76,
    careerReadiness: 72,
    industryRank: "Top 25%",
    totalSkills: 18,
    totalProjects: 5,
    experienceYears: 4,
    educationCount: 2,
    extractedSkills: ["Python", "R", "SQL", "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "PyTorch", "Matplotlib", "Seaborn", "Tableau", "Power BI", "PostgreSQL", "MySQL", "BigQuery", "Spark", "Hive", "Git"],
    categories: [
      { name: "Data Science", count: 10, demand: 90 },
      { name: "ML", count: 4, demand: 85 },
      { name: "Visualization", count: 2, demand: 75 },
      { name: "Data Engineering", count: 2, demand: 80 }
    ],
    atsPerformance: {
      formatting: 70,
      skills: 75,
      keywords: 70,
      achievements: 65,
      readability: 75,
      actionVerbs: 65,
      education: 90,
      experience: 65,
      projects: 70
    },
    qualityBreakdown: {
      formatting: 70,
      content: 80,
      skills: 75,
      experience: 65,
      education: 90,
      achievements: 65,
      projects: 70,
      leadership: 30,
      communication: 70
    },
    benchmarks: {
      freshers: 90,
      junior: 75,
      midLevel: 40,
      senior: 12,
      lead: 2
    },
    jobReadiness: {
      startups: 80,
      productCompanies: 75,
      serviceMNCs: 85,
      remoteJobs: 78,
      faang: 30,
      unicorns: 50
    },
    skillIntelligence: {
      "Data Science": { skillsFound: 10, marketDemand: 90, growthRate: 15, salaryImpact: 10 },
      "ML": { skillsFound: 4, marketDemand: 85, growthRate: 20, salaryImpact: 8 },
      "Visualization": { skillsFound: 2, marketDemand: 75, growthRate: 8, salaryImpact: 3 },
      "Data Engineering": { skillsFound: 2, marketDemand: 80, growthRate: 18, salaryImpact: 5 }
    },
    aiSummary: "You have good data science skills with Python, R, and Tableau. Your ML and statistical modeling knowledge is solid. To improve, focus on production model deployment, deep learning, and big data technologies. Consider getting AWS/GCP data science certifications.",
    suggestions: [
      { text: "Learn deep learning with PyTorch/TensorFlow", impact: "HIGH", time: "2 months", category: "Skills" },
      { text: "Master production model deployment with MLOps", impact: "HIGH", time: "2 months", category: "Skills" },
      { text: "Learn Spark and big data processing", impact: "MEDIUM", time: "1 month", category: "Skills" },
      { text: "Build an end-to-end data science project with deployment", impact: "HIGH", time: "2 months", category: "Projects" }
    ],
    careerGrowth: {
      currentRole: "Data Scientist",
      nextRole: "Senior Data Scientist",
      nextRoleTimeline: "Estimated 1-2 years",
      futureRole: "Lead Data Scientist",
      futureRoleTimeline: "Estimated 3-4 years",
      leadershipRole: "AI/ML Architect",
      leadershipRoleTimeline: "Estimated 5-6 years",
      executiveRole: "Director of Data Science",
      executiveRoleTimeline: "Estimated 8-10 years"
    },
    companyFit: [
      { name: "Google", fitScore: 30, missingSkills: ["ML Research", "Publications"], interviewDifficulty: "Very Hard" },
      { name: "Microsoft", fitScore: 35, missingSkills: ["Azure ML", "Research"], interviewDifficulty: "Very Hard" },
      { name: "TCS", fitScore: 85, missingSkills: ["SAS"], interviewDifficulty: "Easy" },
      { name: "Infosys", fitScore: 82, missingSkills: ["Java"], interviewDifficulty: "Easy" }
    ],
    salary: {
      current: { min: 1000000, average: 1400000, max: 2000000 },
      afterImprovements: { min: 1400000, average: 1800000, max: 2500000 },
      currency: "INR"
    },
    interviewReadiness: {
      technical: 70,
      behavioral: 65,
      systemDesign: 45,
      coding: 60,
      communication: 70
    }
  },
  "DevOps Engineer": {
    roleName: "DevOps Engineer",
    category: "DevOps",
    experienceLevel: "Mid",
    platformScore: 80,
    atsScore: 82,
    hireProbability: 80,
    careerReadiness: 78,
    industryRank: "Top 20%",
    totalSkills: 22,
    totalProjects: 3,
    experienceYears: 5,
    educationCount: 1,
    extractedSkills: ["Docker", "Kubernetes", "AWS", "Terraform", "Ansible", "Jenkins", "GitHub Actions", "GitLab CI", "Python", "Bash", "Linux", "Prometheus", "Grafana", "ELK Stack", "Istio", "Helm", "ArgoCD", "Nginx", "PostgreSQL", "Redis", "Kafka", "Vault"],
    categories: [
      { name: "Containers", count: 6, demand: 95 },
      { name: "Cloud", count: 5, demand: 90 },
      { name: "CI/CD", count: 4, demand: 85 },
      { name: "Monitoring", count: 3, demand: 80 },
      { name: "Scripting", count: 2, demand: 75 },
      { name: "Security", count: 2, demand: 80 }
    ],
    atsPerformance: {
      formatting: 80,
      skills: 88,
      keywords: 85,
      achievements: 75,
      readability: 82,
      actionVerbs: 78,
      education: 80,
      experience: 85,
      projects: 78
    },
    qualityBreakdown: {
      formatting: 80,
      content: 88,
      skills: 88,
      experience: 85,
      education: 80,
      achievements: 75,
      projects: 78,
      leadership: 40,
      communication: 70
    },
    benchmarks: {
      freshers: 95,
      junior: 82,
      midLevel: 50,
      senior: 18,
      lead: 5
    },
    jobReadiness: {
      startups: 88,
      productCompanies: 85,
      serviceMNCs: 92,
      remoteJobs: 85,
      faang: 45,
      unicorns: 65
    },
    skillIntelligence: {
      "Containers": { skillsFound: 6, marketDemand: 95, growthRate: 18, salaryImpact: 12 },
      "Cloud": { skillsFound: 5, marketDemand: 90, growthRate: 20, salaryImpact: 10 },
      "CI/CD": { skillsFound: 4, marketDemand: 85, growthRate: 15, salaryImpact: 8 },
      "Monitoring": { skillsFound: 3, marketDemand: 80, growthRate: 12, salaryImpact: 5 }
    },
    aiSummary: "You have strong DevOps expertise with Docker, Kubernetes, and AWS. Your CI/CD and monitoring skills are solid. To advance, focus on DevSecOps, GitOps, and Infrastructure as Code at scale. Consider learning Go or Rust for better performance and getting AWS/Azure certifications.",
    suggestions: [
      { text: "Learn DevSecOps practices and security automation", impact: "HIGH", time: "2 months", category: "Skills" },
      { text: "Get AWS Solutions Architect certification", impact: "HIGH", time: "2 months", category: "Certifications" },
      { text: "Study GitOps with ArgoCD and Flux", impact: "MEDIUM", time: "1 month", category: "Skills" },
      { text: "Build a multi-cloud infrastructure project", impact: "MEDIUM", time: "2 months", category: "Projects" }
    ],
    careerGrowth: {
      currentRole: "DevOps Engineer",
      nextRole: "Senior DevOps Engineer",
      nextRoleTimeline: "Estimated 1-2 years",
      futureRole: "DevOps Lead",
      futureRoleTimeline: "Estimated 3-4 years",
      leadershipRole: "Cloud Architect",
      leadershipRoleTimeline: "Estimated 5-6 years",
      executiveRole: "Director of Cloud Infrastructure",
      executiveRoleTimeline: "Estimated 8-10 years"
    },
    companyFit: [
      { name: "Google", fitScore: 45, missingSkills: ["Kubernetes", "SRE"], interviewDifficulty: "Very Hard" },
      { name: "Amazon", fitScore: 50, missingSkills: ["AWS", "DynamoDB"], interviewDifficulty: "Very Hard" },
      { name: "TCS", fitScore: 95, missingSkills: [], interviewDifficulty: "Easy" },
      { name: "Infosys", fitScore: 92, missingSkills: [], interviewDifficulty: "Easy" }
    ],
    salary: {
      current: { min: 900000, average: 1200000, max: 1800000 },
      afterImprovements: { min: 1200000, average: 1600000, max: 2200000 },
      currency: "INR"
    },
    interviewReadiness: {
      technical: 80,
      behavioral: 70,
      systemDesign: 65,
      coding: 75,
      communication: 75
    }
  },
  "Full Stack Developer": {
    roleName: "Full Stack Developer",
    category: "Full Stack",
    experienceLevel: "Mid",
    platformScore: 76,
    atsScore: 80,
    hireProbability: 78,
    careerReadiness: 74,
    industryRank: "Top 25%",
    totalSkills: 20,
    totalProjects: 5,
    experienceYears: 4,
    educationCount: 1,
    extractedSkills: ["React", "Node.js", "Express.js", "MongoDB", "PostgreSQL", "JavaScript", "TypeScript", "HTML5", "CSS3", "Redux", "Git", "Docker", "AWS", "REST APIs", "GraphQL", "Jest", "Webpack", "Bootstrap", "Tailwind CSS", "Linux"],
    categories: [
      { name: "Frontend", count: 8, demand: 90 },
      { name: "Backend", count: 6, demand: 85 },
      { name: "Database", count: 3, demand: 80 },
      { name: "DevOps", count: 3, demand: 70 }
    ],
    atsPerformance: {
      formatting: 78,
      skills: 82,
      keywords: 80,
      achievements: 70,
      readability: 85,
      actionVerbs: 75,
      education: 80,
      experience: 75,
      projects: 80
    },
    qualityBreakdown: {
      formatting: 78,
      content: 85,
      skills: 82,
      experience: 75,
      education: 80,
      achievements: 70,
      projects: 80,
      leadership: 35,
      communication: 75
    },
    benchmarks: {
      freshers: 92,
      junior: 78,
      midLevel: 45,
      senior: 12,
      lead: 3
    },
    jobReadiness: {
      startups: 88,
      productCompanies: 82,
      serviceMNCs: 90,
      remoteJobs: 82,
      faang: 30,
      unicorns: 55
    },
    skillIntelligence: {
      "Frontend": { skillsFound: 8, marketDemand: 90, growthRate: 12, salaryImpact: 10 },
      "Backend": { skillsFound: 6, marketDemand: 85, growthRate: 10, salaryImpact: 8 },
      "Database": { skillsFound: 3, marketDemand: 80, growthRate: 8, salaryImpact: 5 },
      "DevOps": { skillsFound: 3, marketDemand: 70, growthRate: 15, salaryImpact: 5 }
    },
    aiSummary: "You have good full-stack skills with React, Node.js, and MongoDB. Your understanding of both frontend and backend is solid. To improve, focus on TypeScript, cloud deployment, and system design. Consider specializing in one area (either frontend or backend) for senior roles.",
    suggestions: [
      { text: "Deepen TypeScript knowledge and use it in all projects", impact: "HIGH", time: "2 weeks", category: "Skills" },
      { text: "Learn system design and scalability", impact: "HIGH", time: "2 months", category: "Skills" },
      { text: "Get AWS certification for cloud experience", impact: "MEDIUM", time: "1 month", category: "Certifications" },
      { text: "Build a microservices project with Docker and Kubernetes", impact: "MEDIUM", time: "2 months", category: "Projects" }
    ],
    careerGrowth: {
      currentRole: "Full Stack Developer",
      nextRole: "Senior Full Stack Developer",
      nextRoleTimeline: "Estimated 1-2 years",
      futureRole: "Full Stack Lead",
      futureRoleTimeline: "Estimated 3-4 years",
      leadershipRole: "Solution Architect",
      leadershipRoleTimeline: "Estimated 5-6 years",
      executiveRole: "Director of Engineering",
      executiveRoleTimeline: "Estimated 8-10 years"
    },
    companyFit: [
      { name: "Google", fitScore: 30, missingSkills: ["Algorithms", "System Design"], interviewDifficulty: "Very Hard" },
      { name: "Amazon", fitScore: 35, missingSkills: ["AWS", "Microservices"], interviewDifficulty: "Very Hard" },
      { name: "Zoho", fitScore: 85, missingSkills: [], interviewDifficulty: "Medium" },
      { name: "Freshworks", fitScore: 82, missingSkills: ["Ruby"], interviewDifficulty: "Medium" }
    ],
    salary: {
      current: { min: 800000, average: 1000000, max: 1500000 },
      afterImprovements: { min: 1000000, average: 1300000, max: 1800000 },
      currency: "INR"
    },
    interviewReadiness: {
      technical: 75,
      behavioral: 70,
      systemDesign: 55,
      coding: 72,
      communication: 75
    }
  },
  "Cybersecurity Analyst": {
    roleName: "Cybersecurity Analyst",
    category: "Security",
    experienceLevel: "Mid",
    platformScore: 74,
    atsScore: 72,
    hireProbability: 70,
    careerReadiness: 68,
    industryRank: "Top 30%",
    totalSkills: 18,
    totalProjects: 2,
    experienceYears: 4,
    educationCount: 2,
    extractedSkills: ["Network Security", "OWASP", "SIEM", "Splunk", "Linux", "Python", "Bash", "Firewalls", "IDS/IPS", "Penetration Testing", "Vulnerability Assessment", "Cloud Security", "AWS Security", "Encryption", "PKI", "ISO 27001", "GDPR", "Incident Response"],
    categories: [
      { name: "Network Security", count: 5, demand: 85 },
      { name: "Application Security", count: 4, demand: 80 },
      { name: "Cloud Security", count: 3, demand: 85 },
      { name: "Compliance", count: 3, demand: 75 },
      { name: "Tools", count: 3, demand: 80 }
    ],
    atsPerformance: {
      formatting: 70,
      skills: 75,
      keywords: 72,
      achievements: 65,
      readability: 75,
      actionVerbs: 68,
      education: 85,
      experience: 70,
      projects: 65
    },
    qualityBreakdown: {
      formatting: 70,
      content: 78,
      skills: 75,
      experience: 70,
      education: 85,
      achievements: 65,
      projects: 65,
      leadership: 30,
      communication: 65
    },
    benchmarks: {
      freshers: 90,
      junior: 72,
      midLevel: 35,
      senior: 10,
      lead: 2
    },
    jobReadiness: {
      startups: 70,
      productCompanies: 75,
      serviceMNCs: 85,
      remoteJobs: 75,
      faang: 25,
      unicorns: 45
    },
    skillIntelligence: {
      "Network Security": { skillsFound: 5, marketDemand: 85, growthRate: 10, salaryImpact: 8 },
      "Application Security": { skillsFound: 4, marketDemand: 80, growthRate: 15, salaryImpact: 8 },
      "Cloud Security": { skillsFound: 3, marketDemand: 85, growthRate: 20, salaryImpact: 10 },
      "Compliance": { skillsFound: 3, marketDemand: 75, growthRate: 8, salaryImpact: 5 }
    },
    aiSummary: "You have solid cybersecurity skills with network security and SIEM experience. Your application security and cloud security knowledge is good. To improve, focus on cloud security, DevSecOps, and penetration testing. Consider getting CEH, CISSP, or AWS Security certifications.",
    suggestions: [
      { text: "Get CEH or CISSP certification", impact: "CRITICAL", time: "2-3 months", category: "Certifications" },
      { text: "Learn cloud security (AWS Security, Azure Security)", impact: "HIGH", time: "2 months", category: "Skills" },
      { text: "Master DevSecOps practices", impact: "HIGH", time: "1 month", category: "Skills" },
      { text: "Build a security lab with penetration testing tools", impact: "MEDIUM", time: "1 month", category: "Projects" }
    ],
    careerGrowth: {
      currentRole: "Cybersecurity Analyst",
      nextRole: "Security Engineer",
      nextRoleTimeline: "Estimated 1-2 years",
      futureRole: "Senior Security Engineer",
      futureRoleTimeline: "Estimated 3-4 years",
      leadershipRole: "Security Architect",
      leadershipRoleTimeline: "Estimated 5-6 years",
      executiveRole: "CISO",
      executiveRoleTimeline: "Estimated 10-12 years"
    },
    companyFit: [
      { name: "Google", fitScore: 25, missingSkills: ["Cloud Security", "GCP", "Zero Trust"], interviewDifficulty: "Very Hard" },
      { name: "Microsoft", fitScore: 30, missingSkills: ["Azure Security", "MSFT Tools"], interviewDifficulty: "Very Hard" },
      { name: "TCS", fitScore: 88, missingSkills: [], interviewDifficulty: "Easy" },
      { name: "Infosys", fitScore: 85, missingSkills: [], interviewDifficulty: "Easy" }
    ],
    salary: {
      current: { min: 800000, average: 1100000, max: 1600000 },
      afterImprovements: { min: 1200000, average: 1600000, max: 2200000 },
      currency: "INR"
    },
    interviewReadiness: {
      technical: 70,
      behavioral: 65,
      systemDesign: 45,
      coding: 55,
      communication: 65
    }
  }
};

export const mockAnalysisData = allRoleAnalyses;
