import { CareerRoadmap } from '../types';

export const aiEngineerRoadmap: CareerRoadmap = {
  id: "ai-engineer",
  title: "AI Engineer",
  
  foundations: {
    role: "AI Engineer",
    responsibilities: ["Design AI models", "Deploy machine learning algorithms", "Build LLM applications", "Optimize neural networks"],
    mindset: "Analytical, experimental, and continuous learner.",
    opportunities: "High growth across tech, healthcare, and finance sectors.",
    salaryRange: "$120,000 - $250,000+",
    futureDemand: "Extremely High (30%+ YoY growth expected)"
  },
  
  prerequisites: [
    "Programming Fundamentals (Python)",
    "Linear Algebra & Calculus",
    "Probability & Statistics",
    "Data Structures & Algorithms",
    "Linux Command Line"
  ],
  
  coreSkills: [
    "Python", "NumPy", "Pandas", "Scikit-learn", 
    "TensorFlow", "PyTorch", "NLP", "Computer Vision", 
    "LLMs", "Transformers", "Prompt Engineering", 
    "Vector Databases", "RAG", "LangChain", 
    "FastAPI", "Docker", "Model Deployment (MLOps)"
  ],
  
  resources: {
    books: ["Deep Learning by Ian Goodfellow", "Hands-On Machine Learning with Scikit-Learn", "Pattern Recognition and Machine Learning"],
    courses: ["Andrew Ng Machine Learning (Coursera)", "DeepLearning.AI specialized paths", "Fast.ai Practical Deep Learning"],
    websites: ["Kaggle", "PapersWithCode", "HuggingFace"],
    youtube: ["StatQuest", "Sentdex", "Lex Fridman", "Yannic Kilcher"],
    blogs: ["OpenAI Blog", "Google AI Blog", "Towards Data Science"]
  },
  
  weeklyPlan: [
    { week: 1, topic: "Python & Math", description: "Master Python data structures and review Linear Algebra." },
    { week: 2, topic: "Data Manipulation", description: "Learn NumPy and Pandas for data wrangling." },
    { week: 3, topic: "Machine Learning Basics", description: "Implement regression, classification, and clustering with Scikit-Learn." },
    { week: 4, topic: "Deep Learning Foundations", description: "Understand neural networks, backpropagation, and build models in PyTorch." },
    { week: 5, topic: "NLP & Transformers", description: "Learn self-attention, HuggingFace transformers, and fine-tuning." },
    { week: 6, topic: "LLMs & RAG", description: "Build applications using LangChain, OpenAI API, and Vector DBs (Pinecone)." },
    { week: 7, topic: "Model Deployment", description: "Wrap models in FastAPI and containerize with Docker." },
    { week: 8, topic: "Capstone Project", description: "End-to-end AI SaaS application deployment." }
  ],
  
  projects: [
    { name: "Predictive Model", difficulty: "Beginner", description: "House price prediction using XGBoost.", techStack: ["Python", "Pandas", "Scikit-learn"] },
    { name: "Image Classifier", difficulty: "Intermediate", description: "Custom CNN for medical image classification.", techStack: ["PyTorch", "OpenCV"] },
    { name: "RAG Document Assistant", difficulty: "Advanced", description: "Chatbot that answers questions based on uploaded PDFs.", techStack: ["LangChain", "OpenAI API", "Pinecone", "FastAPI"] }
  ],
  
  certifications: [
    { name: "TensorFlow Developer Certificate", level: "Intermediate", provider: "Google" },
    { name: "AWS Certified Machine Learning", level: "Professional", provider: "AWS" },
    { name: "Azure AI Engineer Associate", level: "Intermediate", provider: "Microsoft" }
  ],
  
  interviewPrep: {
    topics: ["Machine Learning Theory", "Coding/Algorithms", "System Design for ML", "Math Foundations"],
    questions: ["Explain the bias-variance tradeoff.", "How does self-attention work?", "Design a recommendation system for Netflix."],
    systemDesign: ["Data pipeline architecture", "Model serving at scale", "Handling feature drift"]
  },
  
  portfolioChecklist: [
    "End-to-end deployed ML model",
    "Active GitHub with clean code and READMEs",
    "Kaggle profile with competition participation",
    "Technical blog post explaining an ML concept"
  ],
  
  jobReadiness: [
    "Able to train a custom model from scratch",
    "Experience deploying models via REST APIs",
    "Familiarity with Git and Docker",
    "Understanding of LLM limitations and prompt engineering"
  ],
  
  careerProgression: [
    { level: "1", title: "Junior AI Engineer", timeline: "0-2 Years" },
    { level: "2", title: "AI Engineer", timeline: "2-5 Years" },
    { level: "3", title: "Senior AI Engineer", timeline: "5-8 Years" },
    { level: "4", title: "Staff AI Engineer / Architect", timeline: "8+ Years" }
  ],
  
  salaryGrowth: [
    { level: "Fresher", estimatedSalary: "$90,000", numericValue: 90000 },
    { level: "Junior", estimatedSalary: "$120,000", numericValue: 120000 },
    { level: "Mid-Level", estimatedSalary: "$160,000", numericValue: 160000 },
    { level: "Senior", estimatedSalary: "$200,000+", numericValue: 200000 },
    { level: "Principal", estimatedSalary: "$250,000+", numericValue: 250000 }
  ],
  
  estimatedTimeline: {
    fastTrack: "6 Months",
    normal: "9 Months",
    partTime: "14 Months"
  },
  
  dailyRoadmap: [
    { day: "Monday", topic: "Theory & Math" },
    { day: "Tuesday", topic: "Model Training & Implementation" },
    { day: "Wednesday", topic: "Data Wrangling & EDA" },
    { day: "Thursday", topic: "Paper Reading & New Architectures" },
    { day: "Friday", topic: "Deployment & MLOps" },
    { day: "Saturday", topic: "Project Work" },
    { day: "Sunday", topic: "Rest & Review" }
  ],
  
  monthlyMilestones: [
    { month: 1, focus: "Python, Math, and Data Analysis" },
    { month: 2, focus: "Classical Machine Learning" },
    { month: 3, focus: "Deep Learning Foundations" },
    { month: 4, focus: "Specialization (NLP / Computer Vision)" },
    { month: 5, focus: "LLMs, RAG, and Modern AI" },
    { month: 6, focus: "MLOps and Final Portfolio Deployment" }
  ],
  
  industryTools: [
    "Jupyter Notebook", "VS Code", "Docker", "AWS/GCP", 
    "Git", "Weights & Biases", "HuggingFace", "Postman"
  ],
  
  practicePlatforms: [
    "Kaggle", "LeetCode", "DataCamp", "Google Colab"
  ],
  
  finalChecklist: [
    "Resume Tailored for AI Roles",
    "Portfolio contains 3+ diverse deployed projects",
    "GitHub is active",
    "Can confidently explain complex algorithms",
    "Understands vector databases and LLM APIs"
  ]
};
