export interface ProfessionalSummary {
  original: string;
  improved: string;
  keywords: string[];
  length: 'Short' | 'Medium' | 'Long';
}

const genericOriginal = "Highly motivated and results-oriented professional with a strong track record of success. Proven ability to learn quickly and adapt to new technologies. Seeking to leverage expertise to drive innovation and growth.";

export const professionalSummaries: Record<string, ProfessionalSummary> = {
  // FRONTEND DEVELOPER
  "Junior React Developer": {
    original: genericOriginal,
    improved: "Passionate Frontend Developer with 2 years of experience building responsive web applications using React and JavaScript. Skilled in creating pixel-perfect UI components and optimizing for cross-browser compatibility. Eager to contribute to innovative projects while continuing to grow technical expertise in modern frontend technologies. Strong foundation in HTML5, CSS3, and version control with Git.",
    keywords: ["React", "JavaScript", "HTML5", "CSS3", "responsive", "pixel-perfect", "frontend", "Git"],
    length: "Medium"
  },
  "Mid React Developer": {
    original: genericOriginal,
    improved: "Frontend Developer with 4 years of experience specializing in React and TypeScript. Proven track record of building scalable, high-performance web applications with a focus on user experience and accessibility. Expertise in state management (Redux, Context API), performance optimization, and modern frontend architecture. Strong collaborator who bridges design and development effectively.",
    keywords: ["React", "TypeScript", "Redux", "Context API", "performance optimization", "UX", "accessibility", "scalable"],
    length: "Medium"
  },
  "Senior React Developer": {
    original: genericOriginal,
    improved: "Senior Frontend Engineer with 6+ years of experience architecting large-scale React applications for enterprise clients. Expert in TypeScript, Next.js, and micro-frontend architecture. Led teams of 8+ developers, established coding standards, and implemented CI/CD pipelines. Passionate about performance optimization, developer experience, and mentoring junior engineers. Strong background in system design and frontend architecture decisions.",
    keywords: ["Senior Frontend", "React", "TypeScript", "Next.js", "micro-frontend", "architecture", "CI/CD", "mentoring", "system design"],
    length: "Long"
  },
  "React Native Developer": {
    original: genericOriginal,
    improved: "Mobile Developer with 4 years of experience building cross-platform applications with React Native. Published 5+ apps on iOS and Google Play stores with 100K+ combined downloads. Expertise in native module integration, performance optimization, and mobile UI/UX best practices. Skilled in TypeScript, Expo, and React Native CLI. Passionate about delivering seamless mobile experiences.",
    keywords: ["Mobile Developer", "React Native", "iOS", "Google Play", "UI/UX", "TypeScript", "Expo", "cross-platform"],
    length: "Medium"
  },
  "Angular Developer": {
    original: genericOriginal,
    improved: "Frontend Developer with 5 years of experience specializing in Angular and TypeScript. Built enterprise-scale applications for financial and healthcare sectors. Expertise in RxJS, NgRx, and Angular Material. Strong understanding of reactive programming, component architecture, and performance optimization. Committed to writing clean, maintainable code and following best practices.",
    keywords: ["Angular", "TypeScript", "RxJS", "NgRx", "Angular Material", "reactive programming", "enterprise-scale", "performance"],
    length: "Medium"
  },
  "Vue.js Developer": {
    original: genericOriginal,
    improved: "Vue.js Developer with 4 years of experience building SPAs and static sites with Vue.js and Nuxt.js. Proficient in Vuex/Pinia, Vue Router, and Tailwind CSS. Passionate about creating elegant, performant user interfaces with a focus on developer experience. Experienced in building component libraries and design systems.",
    keywords: ["Vue.js", "Nuxt.js", "Vuex", "Pinia", "Tailwind CSS", "SPA", "design systems", "performant"],
    length: "Medium"
  },
  "Frontend Architect": {
    original: genericOriginal,
    improved: "Frontend Architect with 10+ years of experience designing scalable, high-performance web applications. Expert in micro-frontend architecture, web performance optimization, and frontend system design. Led technology modernization initiatives for Fortune 500 companies. Passionate about establishing coding standards, mentoring teams, and driving technical strategy. Strong background in cloud deployment and CI/CD pipelines.",
    keywords: ["Frontend Architect", "micro-frontend", "system design", "modernization", "Fortune 500", "strategy", "CI/CD", "scalable"],
    length: "Long"
  },

  // BACKEND DEVELOPER
  "Java/Spring Boot Developer": {
    original: genericOriginal,
    improved: "Backend Engineer with 5 years of experience building robust microservices using Java and Spring Boot. Designed and implemented RESTful APIs processing 10M+ requests daily. Expertise in Spring Security, Spring Data JPA, and message queues (Kafka, RabbitMQ). Strong background in database optimization, system design, and cloud deployment. Committed to writing clean, testable code and following best practices.",
    keywords: ["Backend Engineer", "Java", "Spring Boot", "microservices", "RESTful APIs", "Kafka", "RabbitMQ", "database optimization"],
    length: "Medium"
  },
  "Senior Java/Spring Boot Developer": {
    original: genericOriginal,
    improved: "Senior Backend Engineer with 8 years of experience architecting enterprise-grade microservices with Java and Spring Boot. Led teams of 10+ developers in building distributed systems serving 100M+ users. Expertise in event-driven architecture, database sharding, and cloud-native development. Strong background in system design, performance optimization, and technical mentoring. Passionate about scalable, resilient systems.",
    keywords: ["Senior Backend", "Java", "Spring Boot", "distributed systems", "event-driven", "database sharding", "cloud-native", "mentoring"],
    length: "Long"
  },
  "Python/Django Developer": {
    original: genericOriginal,
    improved: "Python Developer with 4 years of experience building web applications using Django and Flask. Designed and implemented REST APIs, data processing pipelines, and authentication systems. Expertise in PostgreSQL, Redis, Celery, and Docker. Strong background in database optimization, testing, and API design. Passionate about clean code and continuous learning.",
    keywords: ["Python Developer", "Django", "Flask", "REST APIs", "PostgreSQL", "Redis", "Celery", "Docker"],
    length: "Medium"
  },
  "Senior Python Developer": {
    original: genericOriginal,
    improved: "Senior Python Engineer with 6+ years of experience building scalable web applications and data pipelines. Expertise in Django, FastAPI, and asynchronous programming. Led development of microservices processing 1M+ requests daily. Strong background in system design, database optimization, and cloud infrastructure (AWS, GCP). Committed to mentoring and driving engineering best practices.",
    keywords: ["Senior Python", "FastAPI", "asynchronous", "microservices", "system design", "AWS", "GCP", "data pipelines"],
    length: "Medium"
  },
  "Node.js Developer": {
    original: genericOriginal,
    improved: "Node.js Developer with 4 years of experience building high-performance REST APIs and microservices. Expertise in Express.js, TypeScript, and MongoDB/PostgreSQL. Designed and implemented systems handling 50K+ concurrent connections. Strong understanding of event-driven architecture, caching strategies, and performance optimization. Passionate about clean code and system scalability.",
    keywords: ["Node.js", "Express.js", "TypeScript", "MongoDB", "event-driven", "caching", "performance optimization", "REST APIs"],
    length: "Medium"
  },
  "Senior Node.js Developer": {
    original: genericOriginal,
    improved: "Senior Node.js Engineer with 7 years of experience architecting distributed systems and microservices. Expert in TypeScript, NestJS, and cloud-native development. Led teams of 8+ developers building scalable, event-driven architectures. Expertise in system design, database scaling, and performance optimization at scale. Committed to technical excellence and team mentorship.",
    keywords: ["Senior Node.js", "NestJS", "distributed systems", "microservices", "TypeScript", "cloud-native", "database scaling", "mentorship"],
    length: "Long"
  },
  "Go/Golang Developer": {
    original: genericOriginal,
    improved: "Go Developer with 3 years of experience building high-performance distributed systems. Expertise in gRPC, Protocol Buffers, and microservices architecture. Designed and implemented scalable APIs with 100K+ QPS. Strong background in concurrency patterns, system design, and performance optimization. Passionate about writing efficient, maintainable code.",
    keywords: ["Go Developer", "Golang", "gRPC", "Protocol Buffers", "microservices", "concurrency", "performance", "scalable"],
    length: "Medium"
  },
  "Backend Architect": {
    original: genericOriginal,
    improved: "Backend Architect with 12+ years of experience designing large-scale distributed systems. Expert in microservices architecture, event-driven design, and cloud-native patterns. Led architecture decisions for systems serving 500M+ users. Strong background in system design, database sharding, and performance optimization. Passionate about technical strategy, team mentorship, and engineering excellence.",
    keywords: ["Backend Architect", "distributed systems", "microservices", "event-driven", "cloud-native", "database sharding", "strategy", "mentorship"],
    length: "Long"
  },

  // FULL STACK DEVELOPER
  "Junior Full Stack Developer": {
    original: genericOriginal,
    improved: "Full Stack Developer with 2 years of experience building web applications using JavaScript, React, and Node.js. Skilled in both frontend and backend development with a focus on creating functional, user-friendly applications. Proficient in MongoDB, Express.js, and REST APIs. Eager to learn new technologies and contribute to meaningful projects in a collaborative environment.",
    keywords: ["Full Stack", "JavaScript", "React", "Node.js", "frontend", "backend", "MongoDB", "Express.js"],
    length: "Medium"
  },
  "Mid Full Stack Developer": {
    original: genericOriginal,
    improved: "Full Stack Developer with 4 years of experience building end-to-end web applications using React, Node.js, and TypeScript. Expertise in REST APIs, authentication, and database design. Built applications serving 10K+ users with optimized frontend and backend performance. Strong understanding of full-stack architecture, testing, and deployment.",
    keywords: ["Full Stack", "React", "Node.js", "TypeScript", "REST APIs", "authentication", "architecture", "deployment"],
    length: "Medium"
  },
  "Senior Full Stack Developer": {
    original: genericOriginal,
    improved: "Senior Full Stack Engineer with 7+ years of experience architecting scalable web applications across the entire stack. Expert in React, Node.js, TypeScript, and cloud deployment. Led teams of 5+ developers in building production applications serving 50K+ users. Strong background in system design, performance optimization, and technical leadership. Passionate about full-stack architecture and mentoring.",
    keywords: ["Senior Full Stack", "React", "Node.js", "TypeScript", "cloud deployment", "system design", "technical leadership", "mentoring"],
    length: "Long"
  },
  "MERN Stack Developer": {
    original: genericOriginal,
    improved: "MERN Stack Developer with 4 years of experience building full-stack applications using MongoDB, Express.js, React, and Node.js. Expertise in authentication, real-time features, and deployment. Built and maintained applications with 10K+ users. Passionate about creating efficient, scalable solutions and staying current with modern JavaScript technologies.",
    keywords: ["MERN Stack", "MongoDB", "Express.js", "React", "Node.js", "authentication", "real-time", "scalable"],
    length: "Medium"
  },
  "Full Stack Architect": {
    original: genericOriginal,
    improved: "Full Stack Architect with 12+ years of experience designing and building enterprise-scale web applications. Expert in React, Node.js, cloud architecture, and system design. Led technology strategy for Fortune 500 companies, establishing best practices and architectural standards. Strong background in microservices, performance optimization, and team leadership. Passionate about driving technical excellence and innovation.",
    keywords: ["Full Stack Architect", "enterprise-scale", "cloud architecture", "system design", "Fortune 500", "strategy", "microservices", "innovation"],
    length: "Long"
  },

  // AI/ML ENGINEER
  "Machine Learning Engineer": {
    original: genericOriginal,
    improved: "Machine Learning Engineer with 4 years of experience building and deploying ML models in production. Expertise in Python, PyTorch, and Scikit-learn. Built recommendation systems and predictive models serving 1M+ users. Strong background in feature engineering, model evaluation, and MLOps. Passionate about turning data into actionable insights and solving real-world problems.",
    keywords: ["Machine Learning", "MLOps", "Python", "PyTorch", "Scikit-learn", "recommendation systems", "feature engineering", "predictive models"],
    length: "Medium"
  },
  "Senior ML Engineer": {
    original: genericOriginal,
    improved: "Senior Machine Learning Engineer with 7 years of experience building production ML systems at scale. Expert in PyTorch, TensorFlow, and distributed training. Led deployment of ML models serving 10M+ predictions daily. Strong background in MLOps, model monitoring, and pipeline optimization. Committed to building reliable, scalable ML infrastructure and mentoring teams.",
    keywords: ["Senior ML", "PyTorch", "TensorFlow", "distributed training", "MLOps", "model monitoring", "pipeline optimization", "scale"],
    length: "Long"
  },
  "AI Engineer": {
    original: genericOriginal,
    improved: "AI Engineer with 4 years of experience building AI-powered applications using LLMs and Generative AI. Expertise in LangChain, RAG systems, and prompt engineering. Built enterprise AI solutions serving 100K+ users. Strong background in model evaluation, fine-tuning, and deployment. Passionate about pushing the boundaries of what AI can do.",
    keywords: ["AI Engineer", "LLMs", "Generative AI", "LangChain", "RAG systems", "prompt engineering", "fine-tuning", "deployment"],
    length: "Medium"
  },
  "Senior AI Engineer": {
    original: genericOriginal,
    improved: "Senior AI Engineer with 6+ years of experience building production-grade AI systems. Expert in LLMs, Transformers, and vector databases. Led development of AI applications serving 500K+ users. Strong background in MLOps, model optimization, and AI infrastructure. Committed to building reliable, ethical AI systems and mentoring teams.",
    keywords: ["Senior AI", "LLMs", "Transformers", "vector databases", "MLOps", "model optimization", "AI infrastructure", "ethical AI"],
    length: "Long"
  },
  "Data Scientist": {
    original: genericOriginal,
    improved: "Data Scientist with 5 years of experience turning data into business insights using Python, SQL, and machine learning. Expertise in statistical analysis, predictive modeling, and data visualization. Built models improving business outcomes by 25+%. Strong background in A/B testing, feature engineering, and stakeholder communication.",
    keywords: ["Data Scientist", "Python", "SQL", "statistical analysis", "predictive modeling", "data visualization", "A/B testing", "business insights"],
    length: "Medium"
  },
  "Senior Data Scientist": {
    original: genericOriginal,
    improved: "Senior Data Scientist with 8 years of experience leading data-driven initiatives at scale. Expert in machine learning, statistical modeling, and experimental design. Built data products serving 10M+ users. Strong background in A/B testing, causal inference, and cross-functional collaboration. Committed to driving business value through data science excellence.",
    keywords: ["Senior Data Scientist", "statistical modeling", "experimental design", "data products", "A/B testing", "causal inference", "cross-functional"],
    length: "Long"
  },
  "NLP Engineer": {
    original: genericOriginal,
    improved: "NLP Engineer with 4 years of experience building natural language processing systems. Expertise in Transformers, text classification, and named entity recognition. Built NLP pipelines processing 10M+ documents daily. Strong background in linguistics, model evaluation, and deployment. Passionate about understanding and generating human language.",
    keywords: ["NLP", "Transformers", "text classification", "named entity recognition", "linguistics", "model evaluation", "human language"],
    length: "Medium"
  },
  "Computer Vision Engineer": {
    original: genericOriginal,
    improved: "Computer Vision Engineer with 5 years of experience building image and video processing systems. Expertise in PyTorch, OpenCV, and deep learning. Built CV models for autonomous systems with 95+% accuracy. Strong background in model optimization, deployment, and real-time processing. Passionate about visual intelligence and its applications.",
    keywords: ["Computer Vision", "PyTorch", "OpenCV", "deep learning", "autonomous systems", "model optimization", "real-time processing"],
    length: "Medium"
  },

  // DEVOPS ENGINEER
  "DevOps Engineer": {
    original: genericOriginal,
    improved: "DevOps Engineer with 4 years of experience managing cloud infrastructure and CI/CD pipelines. Expertise in Docker, Kubernetes, AWS, and Terraform. Automated deployment processes reducing time-to-market by 50%. Strong background in monitoring, logging, and infrastructure as code. Passionate about building reliable, scalable systems and improving developer productivity.",
    keywords: ["DevOps", "Docker", "Kubernetes", "AWS", "Terraform", "CI/CD", "infrastructure as code", "monitoring"],
    length: "Medium"
  },
  "Senior DevOps Engineer": {
    original: genericOriginal,
    improved: "Senior DevOps Engineer with 7 years of experience architecting cloud infrastructure at scale. Expert in Kubernetes, AWS/Azure/GCP, and Infrastructure as Code. Led migration of enterprise applications to cloud with 99.99% uptime. Strong background in DevSecOps, cost optimization, and team leadership. Committed to building robust, scalable infrastructure.",
    keywords: ["Senior DevOps", "Kubernetes", "multi-cloud", "Infrastructure as Code", "DevSecOps", "cost optimization", "99.99% uptime", "team leadership"],
    length: "Long"
  },
  "SRE/Cloud Engineer": {
    original: genericOriginal,
    improved: "Site Reliability Engineer with 5 years of experience ensuring reliability and performance of cloud-native systems. Expertise in Kubernetes, observability, and incident management. Maintained 99.99% uptime for services serving 50M+ users. Strong background in monitoring, SLIs/SLOs, and automation. Passionate about building reliable, resilient systems.",
    keywords: ["SRE", "Site Reliability", "observability", "incident management", "99.99% uptime", "SLIs/SLOs", "automation", "resilient"],
    length: "Medium"
  },
  "Senior Cloud Engineer": {
    original: genericOriginal,
    improved: "Senior Cloud Engineer with 8 years of experience architecting multi-cloud solutions. Expert in AWS, Azure, GCP, and hybrid cloud strategies. Led cloud transformation initiatives for enterprise organizations. Strong background in security, cost optimization, and infrastructure automation. Committed to building scalable, secure, and cost-efficient cloud solutions.",
    keywords: ["Senior Cloud", "multi-cloud", "hybrid cloud", "transformation", "security", "cost optimization", "infrastructure automation", "cost-efficient"],
    length: "Long"
  },
  "Platform Engineer": {
    original: genericOriginal,
    improved: "Platform Engineer with 5 years of experience building internal developer platforms and tooling. Expertise in Kubernetes, CI/CD, and cloud infrastructure. Built platforms serving 500+ developers across organization. Strong background in developer experience, automation, and operational excellence. Passionate about improving developer productivity and infrastructure reliability.",
    keywords: ["Platform Engineer", "developer platforms", "tooling", "Kubernetes", "CI/CD", "developer experience", "automation", "operational excellence"],
    length: "Medium"
  },
  "DevSecOps Engineer": {
    original: genericOriginal,
    improved: "DevSecOps Engineer with 5 years of experience integrating security into DevOps pipelines. Expertise in security scanning, compliance, and infrastructure security. Implemented security automation reducing vulnerabilities by 70%. Strong background in DevSecOps practices, compliance standards, and cloud security. Committed to building secure, compliant infrastructure.",
    keywords: ["DevSecOps", "security scanning", "compliance", "infrastructure security", "automation", "vulnerabilities", "cloud security"],
    length: "Medium"
  },

  // CYBERSECURITY
  "Security Engineer": {
    original: genericOriginal,
    improved: "Security Engineer with 4 years of experience in application security and penetration testing. Expertise in OWASP Top 10, security assessment tools (Burp Suite, Metasploit), and vulnerability management. Conducted security assessments for 50+ applications. Strong background in secure coding, threat modeling, and incident response. Passionate about building secure systems and protecting data.",
    keywords: ["Security Engineer", "application security", "penetration testing", "OWASP", "vulnerability management", "threat modeling", "incident response"],
    length: "Medium"
  },
  "Senior Security Engineer": {
    original: genericOriginal,
    improved: "Senior Security Engineer with 8 years of experience architecting enterprise security solutions. Expert in application security, cloud security, and security automation. Led security initiatives for Fortune 500 companies. Strong background in compliance (GDPR, HIPAA), security strategy, and team leadership. Committed to building resilient security programs.",
    keywords: ["Senior Security", "enterprise security", "cloud security", "security automation", "compliance", "GDPR", "HIPAA", "resilient"],
    length: "Long"
  },
  "Cybersecurity Analyst": {
    original: genericOriginal,
    improved: "Cybersecurity Analyst with 3 years of experience in monitoring, detection, and incident response. Expertise in SIEM tools (Splunk, QRadar), threat hunting, and vulnerability assessment. Responded to 100+ security incidents with effective containment. Strong background in security operations, threat intelligence, and risk assessment. Passionate about protecting organizations from cyber threats.",
    keywords: ["Cybersecurity Analyst", "monitoring", "detection", "SIEM", "threat hunting", "incident response", "security operations", "risk assessment"],
    length: "Medium"
  },
  "Penetration Tester": {
    original: genericOriginal,
    improved: "Penetration Tester with 4 years of experience conducting ethical hacking assessments. Expertise in web, mobile, and network penetration testing. Identified 500+ vulnerabilities including critical security flaws. Strong background in OWASP, PTES, and security frameworks. Committed to helping organizations strengthen their security posture through ethical hacking.",
    keywords: ["Penetration Tester", "ethical hacking", "web security", "mobile security", "network security", "vulnerabilities", "OWASP", "PTES"],
    length: "Medium"
  },
  "Cloud Security Engineer": {
    original: genericOriginal,
    improved: "Cloud Security Engineer with 5 years of experience securing cloud environments. Expertise in AWS/Azure/GCP security, IAM, and compliance. Implemented cloud security controls protecting 1000+ resources. Strong background in DevSecOps, security automation, and zero trust architecture. Passionate about building secure cloud environments.",
    keywords: ["Cloud Security", "IAM", "compliance", "DevSecOps", "security automation", "zero trust architecture", "AWS", "Azure", "GCP"],
    length: "Medium"
  },

  // DATA ENGINEER
  "Data Engineer": {
    original: genericOriginal,
    improved: "Data Engineer with 4 years of experience building data pipelines and ETL processes. Expertise in Python, SQL, Apache Airflow, and data warehousing. Built scalable data pipelines processing 10M+ records daily. Strong background in data modeling, data quality, and pipeline monitoring. Passionate about building reliable, efficient data infrastructure.",
    keywords: ["Data Engineer", "ETL", "Python", "SQL", "Apache Airflow", "data warehousing", "data modeling", "data quality"],
    length: "Medium"
  },
  "Senior Data Engineer": {
    original: genericOriginal,
    improved: "Senior Data Engineer with 7 years of experience architecting enterprise data platforms. Expert in cloud data platforms (Snowflake, BigQuery), stream processing (Kafka, Flink), and data governance. Led data platform initiatives serving 500+ data consumers. Strong background in data architecture, pipeline orchestration, and team leadership. Committed to building robust data infrastructure.",
    keywords: ["Senior Data Engineer", "enterprise data platforms", "Snowflake", "BigQuery", "stream processing", "data governance", "data architecture", "orchestration"],
    length: "Long"
  },
  "Big Data Engineer": {
    original: genericOriginal,
    improved: "Big Data Engineer with 5 years of experience building large-scale data processing systems. Expertise in Spark, Hadoop, and cloud data platforms. Built data pipelines handling 100TB+ of data. Strong background in data lake architecture, performance optimization, and real-time processing. Passionate about solving complex data problems at scale.",
    keywords: ["Big Data", "Spark", "Hadoop", "cloud data platforms", "100TB+", "data lake", "performance optimization", "real-time processing"],
    length: "Medium"
  },
  "Analytics Engineer": {
    original: genericOriginal,
    improved: "Analytics Engineer with 4 years of experience building data models and analytics infrastructure. Expertise in dbt, SQL, and data visualization tools (Tableau, Power BI). Built analytics solutions serving 200+ business users. Strong background in data modeling, data quality, and stakeholder collaboration. Passionate about turning data into actionable insights.",
    keywords: ["Analytics Engineer", "dbt", "SQL", "Tableau", "Power BI", "data modeling", "data quality", "stakeholder collaboration"],
    length: "Medium"
  }
};
