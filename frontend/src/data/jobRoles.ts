export interface JobCategory {
  name: string;
  icon: string;
  roles: string[];
}

export const JOB_CATEGORIES: JobCategory[] = [
  {
    name: "Software Development",
    icon: "💻",
    roles: [
      "Software Engineer", "Software Developer", "Backend Developer", "Frontend Developer", "Full Stack Developer",
      "Python Developer", "Java Developer", "C Developer", "C++ Developer", "C# Developer",
      ".NET Developer", "PHP Developer", "Laravel Developer", "Spring Boot Developer",
      "Django Developer", "Flask Developer", "Node.js Developer", "Express.js Developer",
      "Go Developer", "Rust Developer", "Kotlin Developer", "Swift Developer",
      "Ruby Developer", "Ruby on Rails Developer", "Scala Developer", "Perl Developer"
    ]
  },
  {
    name: "Web Development",
    icon: "🌐",
    roles: [
      "React Developer", "Next.js Developer", "Angular Developer", "Vue.js Developer",
      "Svelte Developer", "HTML Developer", "JavaScript Developer", "TypeScript Developer",
      "WordPress Developer", "Drupal Developer", "Shopify Developer", "Magento Developer"
    ]
  },
  {
    name: "Mobile Development",
    icon: "📱",
    roles: [
      "Android Developer", "iOS Developer", "Flutter Developer", "React Native Developer",
      "Xamarin Developer", "Ionic Developer", "Mobile App Developer", "Cross-platform Developer"
    ]
  },
  {
    name: "Artificial Intelligence & Machine Learning",
    icon: "🤖",
    roles: [
      "AI Engineer", "Machine Learning Engineer", "Deep Learning Engineer", "NLP Engineer",
      "Computer Vision Engineer", "Prompt Engineer", "LLM Engineer", "AI Research Scientist",
      "Generative AI Engineer", "MLOps Engineer", "AI Consultant", "Reinforcement Learning Engineer",
      "Speech Recognition Engineer", "Robotics AI Engineer", "AI Product Manager"
    ]
  },
  {
    name: "Data Science & Analytics",
    icon: "📊",
    roles: [
      "Data Scientist", "Data Analyst", "Business Analyst", "Analytics Engineer",
      "Data Engineer", "Big Data Engineer", "BI Developer", "Power BI Developer",
      "Tableau Developer", "Data Architect", "Data Warehouse Engineer", "ETL Developer",
      "Quantitative Analyst", "Market Research Analyst", "Marketing Analyst"
    ]
  },
  {
    name: "Cloud Computing",
    icon: "☁️",
    roles: [
      "AWS Engineer", "Azure Engineer", "Google Cloud Engineer", "Cloud Architect",
      "Cloud Developer", "Cloud Administrator", "Cloud Security Engineer", "Platform Engineer",
      "Cloud Network Engineer", "Cloud Database Engineer", "Multi-Cloud Architect", "Cloud Consultant"
    ]
  },
  {
    name: "DevOps & SRE",
    icon: "⚙️",
    roles: [
      "DevOps Engineer", "Site Reliability Engineer", "Kubernetes Engineer", "Docker Engineer",
      "CI/CD Engineer", "Release Engineer", "Infrastructure Engineer", "Build Engineer",
      "Automation Engineer", "Platform Engineer", "SRE Lead", "Cloud DevOps Engineer",
      "DevSecOps Engineer", "GitOps Engineer", "Observability Engineer"
    ]
  },
  {
    name: "Cyber Security",
    icon: "🔒",
    roles: [
      "Cyber Security Analyst", "SOC Analyst", "Ethical Hacker", "Penetration Tester",
      "Security Engineer", "Application Security Engineer", "Cloud Security Engineer",
      "Digital Forensics Analyst", "Incident Response Engineer", "Threat Intelligence Analyst",
      "Security Architect", "Security Consultant", "GRC Analyst", "Vulnerability Analyst",
      "Malware Analyst", "Security Researcher", "Identity & Access Engineer", "Security Operations Lead",
      "Network Security Engineer", "Cryptography Engineer", "Information Security Manager"
    ]
  },
  {
    name: "Networking",
    icon: "🔌",
    roles: [
      "Network Engineer", "Network Administrator", "Network Architect", "Wireless Engineer",
      "Telecom Engineer", "Network Security Engineer", "VoIP Engineer", "Network Analyst",
      "Data Center Engineer", "Network Manager"
    ]
  },
  {
    name: "Database Administration",
    icon: "s🗄️",
    roles: [
      "SQL Developer", "Database Administrator", "Oracle DBA", "PostgreSQL DBA",
      "MongoDB Developer", "MySQL Developer", "Data Warehouse Engineer", "NoSQL Developer",
      "Database Architect", "Data Integration Engineer", "Data Pipeline Engineer", "Database DevOps"
    ]
  },
  {
    name: "Testing & QA",
    icon: "🧪",
    roles: [
      "QA Engineer", "Test Engineer", "Automation Tester", "Selenium Tester",
      "Performance Tester", "Manual Tester", "Test Lead", "QA Manager",
      "Mobile QA Engineer", "API Tester", "Security Tester", "Test Architect"
    ]
  },
  {
    name: "Embedded Systems & IoT",
    icon: "📟",
    roles: [
      "Embedded Engineer", "Firmware Engineer", "Robotics Engineer", "IoT Engineer",
      "PLC Engineer", "Mechatronics Engineer", "Automotive Engineer", "RTOS Developer",
      "Device Driver Developer", "Microcontroller Engineer"
    ]
  },
  {
    name: "Blockchain & Web3",
    icon: "⛓️",
    roles: [
      "Blockchain Developer", "Solidity Developer", "Smart Contract Engineer",
      "Web3 Developer", "NFT Developer", "DeFi Engineer", "Blockchain Architect",
      "Crypto Engineer", "DApp Developer", "Consensus Protocol Engineer"
    ]
  },
  {
    name: "AR/VR & Gaming",
    icon: "🎮",
    roles: [
      "AR Developer", "VR Developer", "Unity Developer", "Unreal Engine Developer",
      "Game Developer", "3D Graphics Engineer", "Metaverse Developer", "XR Engineer",
      "Gaming Tech Lead", "Game AI Developer"
    ]
  },
  {
    name: "UI/UX & Design",
    icon: "🎨",
    roles: [
      "UI Designer", "UX Designer", "Product Designer", "Graphic Designer",
      "Interaction Designer", "Visual Designer", "Design System Lead", "UX Researcher",
      "User Interface Architect", "DesignOps Engineer"
    ]
  },
  {
    name: "Product Management",
    icon: "📦",
    roles: [
      "Product Manager", "Technical Product Manager", "Program Manager",
      "Product Owner", "Associate Product Manager", "Senior Product Manager",
      "Product Operations Manager", "Growth Product Manager"
    ]
  },
  {
    name: "Engineering Management",
    icon: "👔",
    roles: [
      "Engineering Manager", "Technical Lead", "Software Architect", "Solution Architect",
      "Enterprise Architect", "Systems Architect", "Cloud Architect", "Data Architect",
      "Security Architect", "Principal Engineer", "Director of Engineering", "VP of Engineering"
    ]
  },
  {
    name: "ERP & Enterprise Systems",
    icon: "🏢",
    roles: [
      "SAP Consultant", "SAP ABAP Developer", "Salesforce Developer",
      "Salesforce Administrator", "Dynamics 365 Developer", "Oracle ERP Developer",
      "Workday Developer", "ServiceNow Developer", "PeopleSoft Developer",
      "NetSuite Developer", "Odoo Developer", "Enterprise Systems Architect"
    ]
  },
  {
    name: "Other Engineering Roles",
    icon: "🔧",
    roles: [
      "Computer Engineer", "Systems Engineer", "Automation Engineer", "Mechatronics Engineer",
      "Electronics Engineer", "Electrical Engineer", "Mechanical Design Engineer", "Industrial Engineer",
      "Chemical Engineer", "Biomedical Engineer", "Civil Engineer", "Structural Engineer",
      "Automotive Engineer", "Aerospace Engineer", "Environmental Engineer", "Materials Engineer",
      "Nanotechnology Engineer", "Optics Engineer", "Acoustics Engineer", "Energy Engineer",
      "Manufacturing Engineer", "Quality Engineer", "Supply Chain Engineer", "Robotics Technician",
      "Field Service Engineer", "Instrumentation Engineer", "Process Engineer"
    ]
  }
];

// Flat list for searching
export const ALL_ROLES = JOB_CATEGORIES.flatMap(category => category.roles);
