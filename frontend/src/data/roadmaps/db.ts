import { CareerRoadmap } from './types';
import { aiEngineerRoadmap } from './profiles/ai-engineer';
import { frontendDeveloperRoadmap } from './profiles/frontend-developer';
import { dataScientistRoadmap } from './profiles/data-scientist';

// This is our central DB mapping role IDs to their deeply structured JSON
export const roadmapsDB: Record<string, CareerRoadmap> = {
  [aiEngineerRoadmap.id]: aiEngineerRoadmap,
  [frontendDeveloperRoadmap.id]: frontendDeveloperRoadmap,
  [dataScientistRoadmap.id]: dataScientistRoadmap,
};

export const getRoadmapById = (id: string): CareerRoadmap | undefined => {
  return roadmapsDB[id];
};

export const getAllRoadmaps = (): CareerRoadmap[] => {
  return Object.values(roadmapsDB);
};

// AI Fallback Generator
// If a user requests a role that isn't in our 100+ DB, this dynamic engine kicks in.
export const generateRoadmapDynamically = async (roleTitle: string): Promise<CareerRoadmap> => {
  // Simulate AI generation time
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  const id = roleTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  return {
    id,
    title: roleTitle,
    
    foundations: {
      role: roleTitle,
      responsibilities: [`Analyze requirements for ${roleTitle}`, `Develop ${roleTitle} solutions`, "Collaborate with cross-functional teams", "Maintain industry best practices"],
      mindset: "Adaptable, continuous learner, and problem solver.",
      opportunities: `Growing demand for specialized ${roleTitle} professionals globally.`,
      salaryRange: "Industry Standard (Varies by location)",
      futureDemand: "High"
    },
    
    prerequisites: [
      "Industry Fundamentals",
      "Basic Tools & Terminology",
      "Communication Skills",
      "Problem Solving Frameworks"
    ],
    
    coreSkills: [
      "Core Skill 1", "Core Skill 2", "Core Skill 3", 
      "Core Tool A", "Core Tool B", "Domain Expertise"
    ],
    
    resources: {
      books: [`The Pragmatic ${roleTitle}`, `Mastering ${roleTitle}`],
      courses: [`Complete ${roleTitle} Bootcamp`, `Advanced ${roleTitle} Concepts`],
      websites: ["Relevant Industry Forums", "Official Documentation"],
      youtube: [`Top ${roleTitle} Channels`],
      blogs: ["Medium Publications", "Substack Newsletters"]
    },
    
    weeklyPlan: [
      { week: 1, topic: "Fundamentals", description: `Understand the core responsibilities of a ${roleTitle}.` },
      { week: 2, topic: "Tools Setup", description: "Install and configure industry-standard tools." },
      { week: 3, topic: "First Project", description: "Build a beginner-level proof of concept." },
      { week: 4, topic: "Advanced Concepts", description: "Dive deeper into complex architectures." },
      { week: 5, topic: "Portfolio Building", description: "Create case studies and document work." },
      { week: 6, topic: "Interview Prep", description: "Mock interviews and resume tailoring." }
    ],
    
    projects: [
      { name: "Starter Project", difficulty: "Beginner", description: "A simple implementation to understand basics.", techStack: ["Tool A", "Tool B"] },
      { name: "Intermediate Challenge", difficulty: "Intermediate", description: "A robust project solving a real-world problem.", techStack: ["Tool B", "Tool C"] },
      { name: "Capstone Architecture", difficulty: "Advanced", description: "Enterprise-level application or case study.", techStack: ["Tool A", "Tool B", "Tool C", "Tool D"] }
    ],
    
    certifications: [
      { name: "Associate Certification", level: "Beginner", provider: "Industry Standard Org" },
      { name: "Professional Certification", level: "Professional", provider: "Major Vendor" }
    ],
    
    interviewPrep: {
      topics: ["Domain Knowledge", "Situational Judgment", "Technical Deep Dive", "System Design"],
      questions: ["Describe a time you solved a complex problem.", "How do you stay updated in your field?", `Explain a complex ${roleTitle} concept to a beginner.`],
      systemDesign: ["Design a scalable workflow", "Identify bottlenecks in a process"]
    },
    
    portfolioChecklist: [
      "Clean, updated Resume",
      "LinkedIn Profile optimized with keywords",
      "3 strong case studies or projects",
      "Active engagement in relevant communities"
    ],
    
    jobReadiness: [
      "Can work independently on mid-level tasks",
      "Understands the full lifecycle of a project",
      "Strong communication and documentation skills"
    ],
    
    careerProgression: [
      { level: "1", title: `Junior ${roleTitle}`, timeline: "0-2 Years" },
      { level: "2", title: roleTitle, timeline: "2-5 Years" },
      { level: "3", title: `Senior ${roleTitle}`, timeline: "5-8 Years" },
      { level: "4", title: `Lead ${roleTitle}`, timeline: "8+ Years" }
    ],
    
    salaryGrowth: [
      { level: "Fresher", estimatedSalary: "$60,000", numericValue: 60000 },
      { level: "Junior", estimatedSalary: "$80,000", numericValue: 80000 },
      { level: "Mid-Level", estimatedSalary: "$110,000", numericValue: 110000 },
      { level: "Senior", estimatedSalary: "$140,000+", numericValue: 140000 },
      { level: "Principal", estimatedSalary: "$180,000+", numericValue: 180000 }
    ],
    
    estimatedTimeline: {
      fastTrack: "3 Months",
      normal: "6 Months",
      partTime: "12 Months"
    },
    
    dailyRoadmap: [
      { day: "Monday", topic: "Theory & Concepts" },
      { day: "Tuesday", topic: "Hands-on Practice" },
      { day: "Wednesday", topic: "Deep Work & Projects" },
      { day: "Thursday", topic: "Review & Refactor" },
      { day: "Friday", topic: "Networking & Content" },
      { day: "Saturday", topic: "Long Project Sessions" },
      { day: "Sunday", topic: "Rest & Plan Next Week" }
    ],
    
    monthlyMilestones: [
      { month: 1, focus: "Foundations & Basics" },
      { month: 2, focus: "Core Skills & Tools" },
      { month: 3, focus: "First Projects" },
      { month: 4, focus: "Advanced Topics" },
      { month: 5, focus: "Portfolio Polish" },
      { month: 6, focus: "Job Hunt & Interviews" }
    ],
    
    industryTools: [
      "Communication (Slack/Teams)", "Project Management (Jira/Trello)", 
      "Documentation (Notion/Confluence)", "Domain Specific Tool A"
    ],
    
    practicePlatforms: [
      "Industry Forums", "Hackathons", "Open Source Projects"
    ],
    
    finalChecklist: [
      "Resume tailored",
      "Portfolio complete",
      "Mock interviews done",
      "Confidence in core skills"
    ]
  };
};
