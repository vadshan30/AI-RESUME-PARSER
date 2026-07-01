export interface InterviewQuestion {
  id: string;
  category: 'Technical' | 'Behavioral' | 'System Design' | 'General';
  role: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  question: string;
  expectedAnswer: string;
  hints: string[];
  keywords: string[];
  timeLimit: number; // Seconds
  followUpQuestions: string[];
}

export const interviewQuestions: InterviewQuestion[] = [
  // --- REACT (JUNIOR) ---
  {
    id: 'react_j_01',
    category: 'Technical',
    role: ['React Developer', 'Frontend Developer', 'Junior React Developer', 'Software Engineer', 'Full Stack Developer'],
    difficulty: 'Easy',
    question: 'What is the virtual DOM and how does React use it?',
    expectedAnswer: 'The virtual DOM is a lightweight copy of the actual DOM. React uses it to optimize rendering by calculating the difference (diffing) between the virtual DOM and the actual DOM, then applying only the changes needed.',
    hints: ['Think about performance optimization', 'Consider how React decides what to re-render'],
    keywords: ['virtual dom', 'dom', 'diffing', 'reconciliation', 'performance'],
    timeLimit: 120,
    followUpQuestions: ["How does React's reconciliation algorithm work?"]
  },
  {
    id: 'react_j_02',
    category: 'Technical',
    role: ['React Developer', 'Frontend Developer', 'Junior React Developer', 'Software Engineer', 'Full Stack Developer'],
    difficulty: 'Easy',
    question: 'Explain the difference between props and state in React.',
    expectedAnswer: 'Props are read-only components passed from a parent to a child, while state is local and mutable data managed within the component itself.',
    hints: ['Think about data flow direction', 'Which one can a component change?'],
    keywords: ['props', 'state', 'immutable', 'mutable', 'parent', 'child'],
    timeLimit: 90,
    followUpQuestions: ['Can a child modify its props directly?']
  },
  {
    id: 'react_j_03',
    category: 'Technical',
    role: ['React Developer', 'Frontend Developer', 'Junior React Developer', 'Software Engineer', 'Full Stack Developer'],
    difficulty: 'Easy',
    question: 'What is JSX and why is it used in React?',
    expectedAnswer: 'JSX is a syntax extension for JavaScript that looks like HTML. It allows developers to write UI structures seamlessly alongside JavaScript logic, which Babel then compiles into React.createElement calls.',
    hints: ['It looks like HTML but it is not', 'How does the browser understand it?'],
    keywords: ['jsx', 'syntax extension', 'babel', 'createelement', 'html'],
    timeLimit: 90,
    followUpQuestions: ['Can browsers read JSX natively?']
  },
  {
    id: 'react_j_04',
    category: 'Technical',
    role: ['React Developer', 'Frontend Developer', 'Junior React Developer', 'Software Engineer', 'Full Stack Developer'],
    difficulty: 'Easy',
    question: 'What are hooks in React? Name a few basic hooks.',
    expectedAnswer: 'Hooks are functions that let functional components hook into React state and lifecycle features. Examples include useState, useEffect, and useContext.',
    hints: ['Introduced in React 16.8', 'They start with use'],
    keywords: ['hooks', 'functional', 'state', 'lifecycle', 'usestate', 'useeffect'],
    timeLimit: 120,
    followUpQuestions: ['What are the rules of Hooks?']
  },
  
  // --- REACT (MID) ---
  {
    id: 'react_m_01',
    category: 'Technical',
    role: ['React Developer', 'Frontend Developer', 'Mid React Developer', 'Software Engineer', 'Full Stack Developer'],
    difficulty: 'Medium',
    question: 'Explain the useEffect hook and its use cases in detail.',
    expectedAnswer: 'useEffect handles side effects in functional components, running after rendering. Use cases include data fetching, setting subscriptions, or manually manipulating the DOM. The dependency array controls when it re-runs, and a return function acts as a cleanup.',
    hints: ['Think about API calls', 'How do you replace componentDidMount?'],
    keywords: ['useeffect', 'side effects', 'dependency array', 'cleanup', 'unmount'],
    timeLimit: 180,
    followUpQuestions: ['What happens if you omit the dependency array entirely?']
  },
  {
    id: 'react_m_02',
    category: 'Technical',
    role: ['React Developer', 'Frontend Developer', 'Mid React Developer', 'Software Engineer', 'Full Stack Developer'],
    difficulty: 'Medium',
    question: 'How do you optimize performance in a React application?',
    expectedAnswer: 'Performance optimization involves techniques like using React.memo for component caching, useMemo and useCallback to avoid recalculations/recreations, code splitting with React.lazy and Suspense, and ensuring stable keys in lists.',
    hints: ['Think about unnecessary re-renders', 'How do you load only what is needed?'],
    keywords: ['react.memo', 'usememo', 'usecallback', 'code splitting', 'lazy', 'suspense'],
    timeLimit: 180,
    followUpQuestions: ['When would useMemo actually hurt performance?']
  },
  {
    id: 'react_m_03',
    category: 'Technical',
    role: ['React Developer', 'Frontend Developer', 'Mid React Developer', 'Software Engineer', 'Full Stack Developer'],
    difficulty: 'Medium',
    question: 'Explain the difference between controlled and uncontrolled components.',
    expectedAnswer: 'A controlled component relies on React state to manage its value via value and onChange props. An uncontrolled component maintains its own internal state, and you access its value using a ref.',
    hints: ['Think about forms', 'Where does the source of truth live?'],
    keywords: ['controlled', 'uncontrolled', 'state', 'ref', 'source of truth'],
    timeLimit: 120,
    followUpQuestions: ['Which approach is generally preferred in React and why?']
  },

  // --- REACT (SENIOR) ---
  {
    id: 'react_s_01',
    category: 'Technical',
    role: ['React Developer', 'Frontend Developer', 'Senior React Developer', 'Software Engineer', 'Full Stack Developer'],
    difficulty: 'Hard',
    question: 'Explain React\'s Fiber architecture and how it improves performance.',
    expectedAnswer: 'React Fiber is a complete rewrite of the reconciliation algorithm. It allows React to pause, abort, or prioritize rendering work across multiple frames, enabling smoother animations and concurrent rendering without blocking the main thread.',
    hints: ['Think about the main thread', 'How does it handle priorities?'],
    keywords: ['fiber', 'reconciliation', 'pause', 'abort', 'prioritize', 'concurrent', 'main thread'],
    timeLimit: 240,
    followUpQuestions: ['How does Fiber compare to the old Stack reconciler?']
  },
  {
    id: 'react_s_02',
    category: 'Technical',
    role: ['React Developer', 'Frontend Developer', 'Senior React Developer', 'Software Engineer', 'Full Stack Developer'],
    difficulty: 'Hard',
    question: 'How would you implement a micro-frontend architecture with React?',
    expectedAnswer: 'Micro-frontends can be implemented using Webpack Module Federation to dynamically load remote chunks, using iframes (legacy), or using build-time integration like single-spa. Module Federation allows sharing dependencies at runtime.',
    hints: ['Think about Webpack 5', 'How do independent teams deploy independently?'],
    keywords: ['micro-frontend', 'module federation', 'webpack', 'single-spa', 'runtime'],
    timeLimit: 240,
    followUpQuestions: ['What are the performance downsides of Module Federation?']
  },

  // --- JAVA (JUNIOR) ---
  {
    id: 'java_j_01',
    category: 'Technical',
    role: ['Java Developer', 'Backend Developer', 'Junior Java Developer', 'Software Engineer', 'Full Stack Developer'],
    difficulty: 'Easy',
    question: 'What is object-oriented programming? Explain the four pillars.',
    expectedAnswer: 'OOP is a paradigm based on objects. The four pillars are Encapsulation (hiding data), Inheritance (reusing code), Polymorphism (many forms via overriding/overloading), and Abstraction (hiding implementation details).',
    hints: ['Remember the acronym APIE'],
    keywords: ['oop', 'encapsulation', 'inheritance', 'polymorphism', 'abstraction'],
    timeLimit: 120,
    followUpQuestions: ['Give a real-world example of Polymorphism.']
  },
  {
    id: 'java_j_02',
    category: 'Technical',
    role: ['Java Developer', 'Backend Developer', 'Junior Java Developer', 'Software Engineer', 'Full Stack Developer'],
    difficulty: 'Easy',
    question: 'Explain the difference between JDK, JRE, and JVM.',
    expectedAnswer: 'The JVM runs the byte code. The JRE contains the JVM plus core libraries needed to run Java apps. The JDK contains the JRE plus development tools like the compiler (javac).',
    hints: ['Which one do you need just to run an app?', 'Which one compiles code?'],
    keywords: ['jvm', 'jre', 'jdk', 'compiler', 'byte code'],
    timeLimit: 120,
    followUpQuestions: ['Is the JVM platform independent?']
  },

  // --- JAVA (MID) ---
  {
    id: 'java_m_01',
    category: 'Technical',
    role: ['Java Developer', 'Backend Developer', 'Mid Java Developer', 'Software Engineer', 'Full Stack Developer'],
    difficulty: 'Medium',
    question: 'Explain the Spring Boot auto-configuration mechanism.',
    expectedAnswer: 'Spring Boot auto-configuration automatically configures beans based on classpath dependencies using @EnableAutoConfiguration and conditional annotations like @ConditionalOnClass or @ConditionalOnMissingBean.',
    hints: ['How does Spring know you want a Tomcat server?', 'Look at the @SpringBootApplication annotation'],
    keywords: ['auto-configuration', 'classpath', 'conditional', 'beans', 'enableautoconfiguration'],
    timeLimit: 180,
    followUpQuestions: ['How can you exclude a specific auto-configuration class?']
  },
  {
    id: 'java_m_02',
    category: 'Technical',
    role: ['Java Developer', 'Backend Developer', 'Mid Java Developer', 'Software Engineer', 'Full Stack Developer'],
    difficulty: 'Medium',
    question: 'What is the difference between JPA and Hibernate?',
    expectedAnswer: 'JPA (Java Persistence API) is merely a specification defining the API for ORM in Java. Hibernate is an actual implementation of that JPA specification.',
    hints: ['One is rules, one is the actual code'],
    keywords: ['jpa', 'hibernate', 'specification', 'implementation', 'orm'],
    timeLimit: 120,
    followUpQuestions: ['Can you use JPA without Hibernate?']
  },

  // --- JAVA (SENIOR) ---
  {
    id: 'java_s_01',
    category: 'Technical',
    role: ['Java Developer', 'Backend Developer', 'Senior Java Developer', 'Software Engineer', 'Full Stack Developer'],
    difficulty: 'Hard',
    question: 'How would you handle distributed transactions in microservices?',
    expectedAnswer: 'Distributed transactions can be handled using the Saga pattern, either choreographed (event-driven) or orchestrated (central coordinator). Two-Phase Commit (2PC) is usually avoided due to blocking and performance issues.',
    hints: ['Think about eventual consistency', 'Sagas vs 2PC'],
    keywords: ['saga pattern', 'two-phase commit', '2pc', 'choreography', 'orchestration', 'eventual consistency'],
    timeLimit: 240,
    followUpQuestions: ['How do compensating transactions work in a Saga?']
  },
  
  // --- PYTHON (JUNIOR) ---
  {
    id: 'py_j_01',
    category: 'Technical',
    role: ['Python Developer', 'Backend Developer', 'Junior Python Developer', 'Software Engineer', 'Full Stack Developer', 'Data Scientist'],
    difficulty: 'Easy',
    question: 'Explain the difference between lists and tuples in Python.',
    expectedAnswer: 'Lists are mutable and declared with square brackets, while tuples are immutable and declared with parentheses. Tuples are generally slightly faster and can be used as dictionary keys.',
    hints: ['Think about immutability'],
    keywords: ['mutable', 'immutable', 'lists', 'tuples', 'dictionary keys'],
    timeLimit: 120,
    followUpQuestions: ['Why would you choose a tuple over a list?']
  },
  {
    id: 'py_j_02',
    category: 'Technical',
    role: ['Python Developer', 'Backend Developer', 'Junior Python Developer', 'Software Engineer', 'Full Stack Developer', 'Data Scientist'],
    difficulty: 'Easy',
    question: 'What is a decorator in Python and how is it used?',
    expectedAnswer: 'A decorator is a function that takes another function and extends its behavior without explicitly modifying it. It wraps the function, commonly used for logging, auth, or timing via the @ symbol.',
    hints: ['Think about wrapping functions', 'Used heavily in Flask/Django routing'],
    keywords: ['decorator', 'wrapper', 'extend behavior', '@'],
    timeLimit: 150,
    followUpQuestions: ['Can a decorator take arguments?']
  },

  // --- PYTHON (MID) ---
  {
    id: 'py_m_01',
    category: 'Technical',
    role: ['Python Developer', 'Backend Developer', 'Mid Python Developer', 'Software Engineer', 'Full Stack Developer'],
    difficulty: 'Medium',
    question: 'Explain the difference between Django and Flask.',
    expectedAnswer: 'Django is a full-stack, batteries-included framework with built-in ORM, admin panel, and auth. Flask is a lightweight micro-framework that gives you extreme flexibility but requires you to plug in third-party libraries for ORM/Auth.',
    hints: ['Batteries included vs Micro-framework'],
    keywords: ['django', 'flask', 'batteries-included', 'micro-framework', 'orm', 'lightweight'],
    timeLimit: 180,
    followUpQuestions: ['When would you definitively choose Flask over Django?']
  },

  // --- PYTHON (SENIOR) ---
  {
    id: 'py_s_01',
    category: 'Technical',
    role: ['Python Developer', 'Backend Developer', 'Senior Python Developer', 'Software Engineer', 'Full Stack Developer', 'Machine Learning Engineer'],
    difficulty: 'Hard',
    question: 'Explain the Python GIL and how to work around it.',
    expectedAnswer: 'The Global Interpreter Lock (GIL) prevents multiple native threads from executing Python bytecodes at once, severely limiting CPU-bound multi-threading. You work around it by using the multiprocessing module, utilizing C-extensions, or using AsyncIO for I/O bound tasks.',
    hints: ['Why doesn\'t threading work well for CPU tasks in Python?'],
    keywords: ['gil', 'global interpreter lock', 'multiprocessing', 'threads', 'cpu-bound', 'asyncio'],
    timeLimit: 240,
    followUpQuestions: ['Why does Python have a GIL in the first place?']
  },

  // --- NODE.JS (JUNIOR) ---
  {
    id: 'node_j_01',
    category: 'Technical',
    role: ['Node.js Developer', 'Backend Developer', 'Junior Node Developer', 'Software Engineer', 'Full Stack Developer'],
    difficulty: 'Easy',
    question: 'Explain the event loop in Node.js.',
    expectedAnswer: 'The event loop handles asynchronous callbacks. Node is single-threaded, but it offloads I/O operations to the system kernel (libuv). When I/O completes, the kernel tells Node to put the callback in the poll queue for execution.',
    hints: ['Think about libuv', 'How does a single thread handle thousands of requests?'],
    keywords: ['event loop', 'libuv', 'single-threaded', 'asynchronous', 'callbacks', 'i/o'],
    timeLimit: 180,
    followUpQuestions: ['What are the phases of the Event Loop?']
  },

  // --- NODE.JS (MID) ---
  {
    id: 'node_m_01',
    category: 'Technical',
    role: ['Node.js Developer', 'Backend Developer', 'Mid Node Developer', 'Software Engineer', 'Full Stack Developer'],
    difficulty: 'Medium',
    question: 'What is the difference between process.nextTick and setImmediate?',
    expectedAnswer: 'process.nextTick fires immediately on the same phase of the event loop before any I/O events, blocking the loop. setImmediate fires on the next iteration (check phase) of the event loop.',
    hints: ['Which one runs sooner?'],
    keywords: ['process.nexttick', 'setimmediate', 'event loop', 'check phase', 'blocking'],
    timeLimit: 180,
    followUpQuestions: ['Why is process.nextTick potentially dangerous?']
  },

  // --- SYSTEM DESIGN (MEDIUM) ---
  {
    id: 'sys_m_01',
    category: 'System Design',
    role: ['Backend Developer', 'Full Stack Developer', 'Software Engineer', 'Senior React Developer', 'Node.js Developer', 'Java Developer', 'Python Developer'],
    difficulty: 'Medium',
    question: 'Design a URL shortener like bit.ly.',
    expectedAnswer: 'I would use a REST API to receive long URLs, generate a Base62 hash (or use a distributed ID generator like Snowflake + Base62), store it in a NoSQL DB for fast reads, and put a Load Balancer in front. A Redis cache would hold the top 20% most accessed URLs. I would use 301 redirects for SEO.',
    hints: ['How do you prevent hash collisions?', 'How do you handle reads vs writes?'],
    keywords: ['base62', 'nosql', 'redis', 'cache', 'load balancer', 'redirect', 'hash', 'collision'],
    timeLimit: 300,
    followUpQuestions: ['How would you handle URL expiration?']
  },
  
  // --- SYSTEM DESIGN (HARD) ---
  {
    id: 'sys_h_01',
    category: 'System Design',
    role: ['Backend Architect', 'Senior Backend Developer', 'DevOps Engineer', 'SRE'],
    difficulty: 'Hard',
    question: 'Design YouTube\'s video streaming platform.',
    expectedAnswer: 'Architecture involves uploading services (chunking videos, async transcoding via queues like Kafka), metadata DBs (Cassandra/NoSQL), and search (Elasticsearch). Video chunks are stored in Blob Storage (S3) and cached globally across a CDN (CloudFront/Akamai) using adaptive bitrate streaming (HLS/DASH).',
    hints: ['Think about chunking', 'How is video served globally without lag?'],
    keywords: ['cdn', 'chunking', 'transcoding', 'kafka', 's3', 'blob', 'adaptive bitrate', 'hls'],
    timeLimit: 480,
    followUpQuestions: ['How do you handle massive spikes in traffic for viral videos?']
  },

  // --- BEHAVIORAL (EASY) ---
  {
    id: 'behav_e_01',
    category: 'Behavioral',
    role: ['All', 'React Developer', 'Java Developer', 'Python Developer', 'Data Scientist', 'DevOps Engineer'],
    difficulty: 'Easy',
    question: 'Tell me about yourself and your career journey.',
    expectedAnswer: 'Candidate should provide a concise, professional summary covering their past experience, current role, and future goals, ideally connecting it to the position they are interviewing for.',
    hints: ['Keep it professional', 'Focus on your technical journey'],
    keywords: ['experience', 'role', 'journey', 'goals', 'skills'],
    timeLimit: 120,
    followUpQuestions: []
  },

  // --- BEHAVIORAL (MEDIUM) ---
  {
    id: 'behav_m_01',
    category: 'Behavioral',
    role: ['All', 'Senior React Developer', 'Backend Architect', 'Data Engineer'],
    difficulty: 'Medium',
    question: 'Describe a complex technical problem you solved using the STAR method.',
    expectedAnswer: 'Candidate uses Situation, Task, Action, Result framework. They should clearly define the problem, their specific contribution, the technical trade-offs considered, and the measurable business impact of the solution.',
    hints: ['Remember Situation, Task, Action, Result', 'Focus on YOUR specific actions'],
    keywords: ['situation', 'task', 'action', 'result', 'impact', 'trade-offs'],
    timeLimit: 240,
    followUpQuestions: ['What would you do differently if you had to do it again?']
  },

  // --- AI/ML (MEDIUM) ---
  {
    id: 'ml_m_01',
    category: 'Technical',
    role: ['Machine Learning Engineer', 'Data Scientist', 'AI Engineer'],
    difficulty: 'Medium',
    question: 'Explain the bias-variance trade-off in ML.',
    expectedAnswer: 'Bias is error from erroneous assumptions (underfitting). Variance is error from sensitivity to small fluctuations in training data (overfitting). The trade-off is finding the sweet spot where both bias and variance are minimized to optimize out-of-sample prediction.',
    hints: ['Think about underfitting vs overfitting'],
    keywords: ['bias', 'variance', 'underfitting', 'overfitting', 'trade-off'],
    timeLimit: 180,
    followUpQuestions: ['How does increasing model complexity affect bias and variance?']
  },
  
  // --- AI/ML (HARD) ---
  {
    id: 'ml_h_01',
    category: 'Technical',
    role: ['Machine Learning Engineer', 'AI Engineer'],
    difficulty: 'Hard',
    question: 'Explain the difference between RAG and fine-tuning for LLMs.',
    expectedAnswer: 'RAG (Retrieval-Augmented Generation) retrieves external knowledge dynamically and injects it into the prompt context. Fine-tuning actually alters the model\'s internal weights. RAG is better for dynamic, factual data to prevent hallucinations, while fine-tuning is better for changing tone, style, or specific task formatting.',
    hints: ['Which one changes weights?', 'Which one uses vector databases?'],
    keywords: ['rag', 'retrieval', 'fine-tuning', 'weights', 'context', 'vector', 'hallucinations'],
    timeLimit: 240,
    followUpQuestions: ['Can you use both RAG and fine-tuning together?']
  },

  // --- DEVOPS (MEDIUM) ---
  {
    id: 'dev_m_01',
    category: 'Technical',
    role: ['DevOps Engineer', 'SRE', 'Cloud Engineer'],
    difficulty: 'Medium',
    question: 'Explain the difference between Docker and Kubernetes.',
    expectedAnswer: 'Docker is a containerization platform used to package an application and its dependencies into a single container image. Kubernetes is a container orchestration platform used to manage, scale, and deploy thousands of those Docker containers across clusters.',
    hints: ['One builds the box, the other manages a warehouse of boxes'],
    keywords: ['docker', 'kubernetes', 'containerization', 'orchestration', 'scale', 'cluster'],
    timeLimit: 180,
    followUpQuestions: ['What is the difference between a Pod and a Container?']
  }
];
