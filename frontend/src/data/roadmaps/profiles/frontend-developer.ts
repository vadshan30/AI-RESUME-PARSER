import { CareerRoadmap } from '../types';

export const frontendDeveloperRoadmap: CareerRoadmap = {
  id: "frontend-developer",
  title: "Frontend Developer",
  
  foundations: {
    role: "Frontend Developer",
    responsibilities: ["Build user interfaces", "Ensure cross-browser compatibility", "Optimize web performance", "Integrate REST/GraphQL APIs"],
    mindset: "User-centric, design-oriented, and detail-driven.",
    opportunities: "Ubiquitous demand across every digital industry.",
    salaryRange: "$70,000 - $160,000+",
    futureDemand: "High (Steady continuous growth)"
  },
  
  prerequisites: [
    "How the Internet Works",
    "Basic Command Line",
    "Version Control (Git)",
    "Web Design Basics"
  ],
  
  coreSkills: [
    "HTML5", "CSS3", "JavaScript (ES6+)", "TypeScript", 
    "React / Vue / Angular", "Next.js", "Tailwind CSS", 
    "State Management (Redux/Zustand)", "REST APIs", 
    "GraphQL", "Jest / Cypress", "Webpack / Vite", 
    "Web Accessibility (a11y)", "Web Performance"
  ],
  
  resources: {
    books: ["Eloquent JavaScript", "You Don't Know JS", "CSS Secrets"],
    courses: ["The Odin Project", "FreeCodeCamp", "Frontend Masters"],
    websites: ["MDN Web Docs", "CSS-Tricks", "JavaScript.info"],
    youtube: ["Kevin Powell", "Web Dev Simplified", "Fireship", "Traversy Media"],
    blogs: ["Smashing Magazine", "Dev.to", "CSS-Tricks"]
  },
  
  weeklyPlan: [
    { week: 1, topic: "HTML & CSS Basics", description: "Build static pages, master flexbox and grid." },
    { week: 2, topic: "JavaScript Fundamentals", description: "Variables, loops, functions, and DOM manipulation." },
    { week: 3, topic: "Advanced JS & ES6", description: "Promises, Async/Await, closures, and array methods." },
    { week: 4, topic: "React Basics", description: "Components, props, state, and useEffect." },
    { week: 5, topic: "React Ecosystem", description: "Routing (React Router) and State Management (Zustand)." },
    { week: 6, topic: "CSS Frameworks", description: "Build responsive UIs incredibly fast with Tailwind CSS." },
    { week: 7, topic: "TypeScript", description: "Add static typing to your React applications." },
    { week: 8, topic: "Next.js & Performance", description: "Server-side rendering, routing, and deployment to Vercel." }
  ],
  
  projects: [
    { name: "Landing Page", difficulty: "Beginner", description: "Responsive marketing page.", techStack: ["HTML", "CSS", "JS"] },
    { name: "Kanban Board", difficulty: "Intermediate", description: "Drag and drop task management.", techStack: ["React", "Tailwind", "Zustand"] },
    { name: "E-commerce Storefront", difficulty: "Advanced", description: "Full storefront with cart, checkout UI, and product filtering.", techStack: ["Next.js", "TypeScript", "Tailwind", "Stripe API"] }
  ],
  
  certifications: [
    { name: "Meta Front-End Developer", level: "Beginner", provider: "Coursera" },
    { name: "AWS Certified Developer", level: "Professional", provider: "AWS" },
    { name: "Certified Web Accessibility Professional", level: "Intermediate", provider: "IAAP" }
  ],
  
  interviewPrep: {
    topics: ["JavaScript Quirks", "DOM Manipulation", "React Hooks", "CSS Layouts (Flex/Grid)"],
    questions: ["Explain Event Delegation.", "What is the virtual DOM?", "How do you optimize a React app?"],
    systemDesign: ["Design a news feed component", "Architect a scalable component library"]
  },
  
  portfolioChecklist: [
    "Personal portfolio website (Custom domain)",
    "At least 3 high-quality projects",
    "Clean, semantic HTML and accessible ARIA labels",
    "Lighthouse score of 90+ on all projects"
  ],
  
  jobReadiness: [
    "Can build responsive layouts from Figma designs",
    "Understands asynchronous JS and API fetching",
    "Proficient with React and custom hooks",
    "Experience with Git branching and PRs"
  ],
  
  careerProgression: [
    { level: "1", title: "Junior Frontend Developer", timeline: "0-2 Years" },
    { level: "2", title: "Frontend Developer", timeline: "2-4 Years" },
    { level: "3", title: "Senior Frontend Engineer", timeline: "4-7 Years" },
    { level: "4", title: "Frontend Architect", timeline: "7+ Years" }
  ],
  
  salaryGrowth: [
    { level: "Fresher", estimatedSalary: "$70,000", numericValue: 70000 },
    { level: "Junior", estimatedSalary: "$90,000", numericValue: 90000 },
    { level: "Mid-Level", estimatedSalary: "$120,000", numericValue: 120000 },
    { level: "Senior", estimatedSalary: "$160,000+", numericValue: 160000 },
    { level: "Principal", estimatedSalary: "$200,000+", numericValue: 200000 }
  ],
  
  estimatedTimeline: {
    fastTrack: "4 Months",
    normal: "6 Months",
    partTime: "10 Months"
  },
  
  dailyRoadmap: [
    { day: "Monday", topic: "UI/UX & CSS Layouts" },
    { day: "Tuesday", topic: "JavaScript Algorithms" },
    { day: "Wednesday", topic: "Component Building" },
    { day: "Thursday", topic: "State Management & APIs" },
    { day: "Friday", topic: "Performance & Testing" },
    { day: "Saturday", topic: "Portfolio Projects" },
    { day: "Sunday", topic: "Code Review & Rest" }
  ],
  
  monthlyMilestones: [
    { month: 1, focus: "HTML, CSS, and basic JS" },
    { month: 2, focus: "Advanced JS & DOM Manipulation" },
    { month: 3, focus: "React, State, and Routing" },
    { month: 4, focus: "Tailwind, TypeScript, and API Integration" },
    { month: 5, focus: "Next.js, Performance, and Testing" },
    { month: 6, focus: "Portfolio Polish and Interview Prep" }
  ],
  
  industryTools: [
    "VS Code", "Figma", "Git", "GitHub", 
    "Chrome DevTools", "Vercel", "NPM/Yarn", "Postman"
  ],
  
  practicePlatforms: [
    "Frontend Mentor", "CodePen", "CSSBattle", "LeetCode (JS)"
  ],
  
  finalChecklist: [
    "Portfolio is live and responsive",
    "Projects have README files",
    "Familiar with React performance hooks (useMemo, useCallback)",
    "Can convert a Figma design to pixel-perfect code"
  ]
};
