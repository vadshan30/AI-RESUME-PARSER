import { CareerRoadmap } from '../types';

export const dataScientistRoadmap: CareerRoadmap = {
  id: "data-scientist",
  title: "Data Scientist",
  
  foundations: {
    role: "Data Scientist",
    responsibilities: ["Data wrangling", "Statistical analysis", "Predictive modeling", "Data visualization"],
    mindset: "Curious, detail-oriented, and strictly driven by empirical evidence.",
    opportunities: "High demand in tech, finance, healthcare, and retail.",
    salaryRange: "$100,000 - $180,000+",
    futureDemand: "Very High (Consistent year-over-year growth)"
  },
  
  prerequisites: [
    "Programming (Python or R)",
    "Probability & Statistics",
    "Calculus & Linear Algebra",
    "SQL & Databases"
  ],
  
  coreSkills: [
    "Python", "SQL", "Pandas", "NumPy", 
    "Matplotlib / Seaborn", "Scikit-learn", 
    "Statistical Modeling", "A/B Testing", 
    "Machine Learning", "Tableau / PowerBI", 
    "Big Data (Spark)", "Jupyter"
  ],
  
  resources: {
    books: ["Python for Data Analysis", "Practical Statistics for Data Scientists", "An Introduction to Statistical Learning"],
    courses: ["IBM Data Science Professional Certificate", "Google Data Analytics", "Applied Data Science with Python (Coursera)"],
    websites: ["Kaggle", "Towards Data Science", "Analytics Vidhya"],
    youtube: ["StatQuest with Josh Starmer", "Ken Jee", "Corey Schafer"],
    blogs: ["KDnuggets", "DataCamp Blog", "Towards Data Science"]
  },
  
  weeklyPlan: [
    { week: 1, topic: "SQL & Databases", description: "Master queries, joins, window functions, and subqueries." },
    { week: 2, topic: "Python for Data", description: "Learn Python syntax, lists, dictionaries, and functions." },
    { week: 3, topic: "Data Manipulation", description: "Deep dive into Pandas and NumPy for cleaning data." },
    { week: 4, topic: "Data Visualization", description: "Create compelling charts with Matplotlib and Seaborn." },
    { week: 5, topic: "Statistics Basics", description: "Probability, distributions, hypothesis testing, and A/B testing." },
    { week: 6, topic: "Machine Learning I", description: "Linear regression, logistic regression, and decision trees." },
    { week: 7, topic: "Machine Learning II", description: "Random forests, clustering, PCA, and model evaluation." },
    { week: 8, topic: "Business Intelligence", description: "Build interactive dashboards in Tableau or PowerBI." }
  ],
  
  projects: [
    { name: "EDA Dashboard", difficulty: "Beginner", description: "Exploratory Data Analysis on a Kaggle dataset with Pandas profiling.", techStack: ["Python", "Pandas", "Seaborn"] },
    { name: "A/B Testing Framework", difficulty: "Intermediate", description: "Simulate and analyze results of an A/B test for an e-commerce site.", techStack: ["Python", "SciPy", "Statsmodels"] },
    { name: "Customer Churn Predictor", difficulty: "Advanced", description: "End-to-end ML pipeline to predict customer churn with a web interface.", techStack: ["Scikit-learn", "Flask", "Docker"] }
  ],
  
  certifications: [
    { name: "Google Data Analytics Certificate", level: "Beginner", provider: "Google" },
    { name: "Microsoft Certified: Azure Data Scientist", level: "Intermediate", provider: "Microsoft" },
    { name: "AWS Certified Data Analytics", level: "Professional", provider: "AWS" }
  ],
  
  interviewPrep: {
    topics: ["Probability & Statistics", "SQL Queries", "Machine Learning Concepts", "Product Sense"],
    questions: ["Explain P-value.", "Write a SQL query to find the 2nd highest salary.", "How do you handle imbalanced datasets?"],
    systemDesign: ["Design a data pipeline", "Experimentation platform design"]
  },
  
  portfolioChecklist: [
    "Jupyter Notebooks with clear markdown explanations",
    "At least one end-to-end ML project deployed",
    "Complex SQL queries demonstrated",
    "Interactive dashboard (Tableau/PowerBI) published"
  ],
  
  jobReadiness: [
    "Can clean messy datasets independently",
    "Understands the math behind common ML algorithms",
    "Able to communicate findings to non-technical stakeholders",
    "Proficient in writing optimized SQL"
  ],
  
  careerProgression: [
    { level: "1", title: "Junior Data Analyst/Scientist", timeline: "0-2 Years" },
    { level: "2", title: "Data Scientist", timeline: "2-5 Years" },
    { level: "3", title: "Senior Data Scientist", timeline: "5-8 Years" },
    { level: "4", title: "Lead Data Scientist", timeline: "8+ Years" }
  ],
  
  salaryGrowth: [
    { level: "Fresher", estimatedSalary: "$85,000", numericValue: 85000 },
    { level: "Junior", estimatedSalary: "$105,000", numericValue: 105000 },
    { level: "Mid-Level", estimatedSalary: "$135,000", numericValue: 135000 },
    { level: "Senior", estimatedSalary: "$165,000+", numericValue: 165000 },
    { level: "Principal", estimatedSalary: "$200,000+", numericValue: 200000 }
  ],
  
  estimatedTimeline: {
    fastTrack: "5 Months",
    normal: "8 Months",
    partTime: "12 Months"
  },
  
  dailyRoadmap: [
    { day: "Monday", topic: "Statistics & Math" },
    { day: "Tuesday", topic: "SQL & Data Extraction" },
    { day: "Wednesday", topic: "Python Data Wrangling" },
    { day: "Thursday", topic: "Machine Learning Algorithms" },
    { day: "Friday", topic: "Business Use Cases & BI" },
    { day: "Saturday", topic: "Kaggle & Projects" },
    { day: "Sunday", topic: "Rest & Networking" }
  ],
  
  monthlyMilestones: [
    { month: 1, focus: "SQL and Basic Python" },
    { month: 2, focus: "Data Wrangling and Visualization" },
    { month: 3, focus: "Statistics and Hypothesis Testing" },
    { month: 4, focus: "Classical Machine Learning" },
    { month: 5, focus: "Advanced ML and Model Tuning" },
    { month: 6, focus: "Dashboards, Portfolio, and Interviews" }
  ],
  
  industryTools: [
    "Jupyter", "SQL Server / PostgreSQL", "Tableau", "PowerBI", 
    "Git", "Docker", "AWS S3 / EC2", "Airflow"
  ],
  
  practicePlatforms: [
    "Kaggle", "StrataScratch", "LeetCode (DB)", "DataCamp"
  ],
  
  finalChecklist: [
    "SQL skills are sharp (Window functions, CTEs)",
    "Can explain technical results to business teams",
    "Portfolio shows full data lifecycle (extract -> clean -> model -> visualize)",
    "Familiar with Git and terminal"
  ]
};
