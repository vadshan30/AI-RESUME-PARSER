🚀 AI Resume Parser & ATS Platform
https://img.shields.io/badge/Deployed%2520on-Render-46E3B7?logo=render&logoColor=white
https://img.shields.io/badge/FastAPI-0.139.0-009688?logo=fastapi&logoColor=white
https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white
https://img.shields.io/badge/Gemini%2520AI-2.11.0-4285F4?logo=google&logoColor=white
https://img.shields.io/badge/License-MIT-yellow.svg

📋 Overview
AI Resume Parser & ATS is a comprehensive, production-ready SaaS platform designed to revolutionize the job application process. By leveraging the power of Google Gemini AI, it provides intelligent resume analysis, accurate ATS scoring, precise job matching, and personalized career guidance. Whether you're a job seeker looking to optimize your resume or a professional planning your next career move, this platform offers the tools you need to succeed in today's competitive job market.

The platform combines modern web technologies with cutting-edge artificial intelligence to deliver a seamless user experience. From parsing complex PDF resumes to generating AI-powered interview questions, every feature is designed with the end-user in mind. The system is built on a robust, scalable architecture that ensures high performance and reliability, making it suitable for both individual users and enterprise deployments.

Live Demo: https://ai-resume-parser-1-5eb7.onrender.com

⚠️ Render Free Tier Notice: The services spin down after 15 minutes of inactivity to conserve resources. On the first visit, it may take 30-60 seconds to wake up. This is normal behavior for free-tier hosting and does not affect the application's functionality once active.

🌐 Live URLs
Component	URL
Frontend Application	https://ai-resume-parser-1-5eb7.onrender.com
Backend API Service	https://ai-resume-parser-upwf.onrender.com
Interactive API Documentation	https://ai-resume-parser-upwf.onrender.com/docs
✨ Key Features
📄 Resume Management System
The platform offers a comprehensive resume management system that allows users to upload, parse, and store resumes in various formats. The system supports PDF, DOCX, and TXT files, automatically extracting structured data including skills, education, work experience, and project details. Users can maintain a complete history of their uploaded resumes with the ability to search, delete, or duplicate entries. This centralized repository ensures that all resume versions are easily accessible and manageable, streamlining the job application process.

🧠 AI-Powered Analysis Engine
At the heart of the platform lies a sophisticated AI analysis engine powered by Google Gemini. This engine provides detailed resume reviews with actionable feedback, highlighting strengths and areas for improvement. It generates comprehensive ATS compatibility scores that help users understand how well their resume performs against automated screening systems. The Resume X-Ray feature performs a deep scan of keyword density, formatting consistency, and content health, while the Resume Improver uses AI to rewrite and optimize specific sections of the resume for maximum impact.

🎯 Job Matching & Skill Analysis
The job matching module enables users to compare their resumes against specific job descriptions, providing a detailed analysis of compatibility and fit. The Skill Gap Detection feature identifies missing or underdeveloped skills relative to target roles, offering clear recommendations for professional development. The Hiring Probability predictor uses AI to estimate shortlisting odds, helping users prioritize their job applications effectively.

🗺️ Career Development Tools
Career development is a core focus of the platform, with tools designed to guide users toward their professional goals. The Learning Roadmap Generator creates personalized, step-by-step career paths based on current skills and target roles. Career Insights provides alternative career suggestions, while the AI Career Twin offers personalized recommendations for skills development and career progression. These features ensure that users not only optimize their resumes but also plan for long-term career success.

🎤 Interview Preparation Suite
The Interview Simulator is a standout feature that provides AI-powered mock interview experiences. Users can practice with difficulty levels ranging from Beginner to Expert, receiving real-time feedback on their answers. The integrated speech-to-text functionality allows voice-based responses, making the experience more realistic. The automated evaluation system scores answers and provides constructive feedback, helping users improve their interview skills and build confidence before facing real interviews.

📊 Analytics & Insights Dashboard
The platform includes a comprehensive analytics dashboard that visualizes key metrics such as resume health scores, ATS compatibility trends, and skill gap analyses. Users can track their progress over time, gaining valuable insights into their professional development journey. The platform analysis feature provides industry benchmarks and trends, helping users understand how they compare to other professionals in their field.

🛠️ Technology Stack
Frontend Technologies
The frontend is built with React 18, utilizing TypeScript for type safety and Vite for lightning-fast build times. Tailwind CSS provides a utility-first styling approach, while Zustand handles state management efficiently. Axios manages HTTP requests, and Framer Motion adds smooth, professional animations. The combination of these technologies ensures a responsive, performant, and visually appealing user interface.

Backend Technologies
The backend is powered by FastAPI, a modern, high-performance web framework for building APIs with Python. SQLAlchemy serves as the ORM for database interactions, while Uvicorn provides a lightning-fast ASGI server. The system uses PyMySQL for MySQL connectivity, pdfplumber for robust PDF parsing, and python-docx for DOCX file processing. This technology stack ensures fast processing times and reliable data handling.

Artificial Intelligence
Google Gemini 2.11 serves as the primary AI engine, providing advanced natural language processing capabilities for resume analysis, content generation, and intelligent matching. The pydantic-settings library manages configuration across different environments, ensuring consistent behavior whether running locally or in production.

Database & Deployment
The platform uses TiDB Cloud, a MySQL-compatible distributed database that offers high availability and scalability. Both the frontend and backend are deployed on Render's free tier, providing automatic deployments from GitHub and reliable hosting with minimal configuration.

🏗️ Architecture Overview
The application follows a modern, microservices-inspired architecture that separates concerns and enables independent scaling of different components. The frontend communicates with the backend through a RESTful API, which in turn interacts with the AI engine and database. This clean separation ensures maintainability and allows for easy updates to individual components without affecting the entire system.

User Flow:

User uploads resume through the frontend interface

Frontend sends file to backend API for processing

Backend parses resume using pdfplumber and extracts structured data

Data is stored in TiDB Cloud database for future reference

AI analysis is performed using Google Gemini API

Results are returned to frontend for display

User can access insights, recommendations, and tools through the dashboard

📊 API Documentation
Resume Management Endpoints
Method	Endpoint	Description	Request Body
POST	/resume/upload	Upload a new resume PDF	multipart/form-data
GET	/resume/	Retrieve all uploaded resumes	-
GET	/resume/{id}	Retrieve specific resume by ID	-
DELETE	/resume/{id}	Delete a resume by ID	-
PUT	/resume/{id}/rename	Rename an existing resume	{"name": "new_name"}
POST	/resume/{id}/duplicate	Create a copy of an existing resume	-
AI-Powered Features Endpoints
Method	Endpoint	Description	Request Body
POST	/ai/review	Get comprehensive resume review	{"resume_text": "..."}
POST	/ai/summary	Generate a professional summary	{"resume_text": "..."}
POST	/ai/cover-letter	Generate a tailored cover letter	{"resume_text": "...", "job_title": "..."}
POST	/ai/interview-questions	Generate interview questions	{"resume_text": "...", "job_role": "..."}
POST	/ai/career-roadmap	Generate a career development roadmap	{"resume_text": "...", "career_goal": "..."}
POST	/ai/job-match	Analyze job description match	{"resume_text": "...", "job_description": "..."}
POST	/ai/skill-gap	Identify skill gaps for target roles	{"resume_text": "...", "target_role": "..."}
POST	/ai/hiring-probability	Calculate hiring probability	{"resume_text": "...", "job_description": "..."}
POST	/ai/resume-xray	Perform deep resume health scan	{"resume_text": "..."}
POST	/ai/interview-simulator	Conduct AI-powered mock interview	{"resume_text": "...", "difficulty": "..."}
POST	/ai/career-twin	Generate personalized career twin profile	{"resume_text": "..."}
POST	/ai/career-intelligence	Generate career intelligence insights	{"resume_text": "..."}
Full API Documentation: https://ai-resume-parser-upwf.onrender.com/docs

🚀 Getting Started
Prerequisites
Before installing the platform, ensure you have the following prerequisites:

Python 3.11+ - The backend requires Python 3.11 or higher

Node.js 18+ - The frontend requires Node.js 18 or higher

Git - For cloning the repository

Google Gemini API Key - You need a valid Gemini API key for AI features

TiDB Cloud or MySQL Database - A MySQL-compatible database for data storage

Installation Guide
Clone the repository:

bash
git clone https://github.com/vadshan30/AI-RESUME-PARSER.git
cd AI-RESUME-PARSER
Backend Setup:

bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create .env file with your configuration
# Add GEMINI_API_KEY, DATABASE_URL, JWT_SECRET_KEY, and CORS_ORIGINS

# Start the backend server
python -m uvicorn backend.main:app --reload --port 8000
Frontend Setup (in a new terminal):

bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Create .env file with VITE_API_URL pointing to your backend

# Start the development server
npm run dev
Access the Application:

Frontend: http://localhost:5173

Backend API: http://localhost:8000

API Documentation: http://localhost:8000/docs

📁 Project Structure
text
AI-RESUME-PARSER/
├── backend/
│   ├── ai/                      # AI services and providers
│   │   ├── providers/           # Gemini, OpenAI, Ollama providers
│   │   └── services/            # AI business logic services
│   ├── core/                    # Core functionality
│   │   ├── config.py            # Configuration management
│   │   ├── cache.py             # Caching utilities
│   │   └── logger.py            # Logging configuration
│   ├── data/                    # Static data and role databases
│   ├── engines/                 # Resume processing engines
│   ├── middleware/              # Error handling middleware
│   ├── models/                  # Database models (SQLAlchemy)
│   ├── parsers/                 # PDF and text parsing utilities
│   ├── routers/                 # API endpoint routes
│   ├── schemas/                 # Pydantic schemas for validation
│   ├── services/                # Business logic services
│   ├── utils/                   # Helper functions
│   ├── validators/              # Input validation utilities
│   ├── main.py                  # FastAPI application entry point
│   └── requirements.txt         # Python dependencies
├── frontend/
│   ├── public/                  # Static assets
│   │   └── _redirects           # SPA routing configuration
│   ├── src/
│   │   ├── components/          # Reusable React components
│   │   ├── pages/               # Page components
│   │   ├── store/               # Zustand state management
│   │   ├── services/            # API integration services
│   │   ├── hooks/               # Custom React hooks
│   │   ├── data/                # Static data
│   │   └── utils/               # Helper functions
│   ├── index.html               # HTML entry point
│   ├── package.json             # Node.js dependencies
│   └── vite.config.js           # Vite configuration
├── render.yaml                  # Render deployment configuration
└── README.md                    # Project documentation
🔧 Deployment
Deploying to Render
Backend (Web Service):

Push your code to GitHub

Connect your repository to Render

Configure environment variables

Render automatically deploys on every push

Frontend (Static Site):

Push your code to GitHub

Connect your repository to Render as a Static Site

Set the root directory to frontend

Configure build command: npm install && npm run build

Set publish directory: dist

Deployment Configuration
yaml
# render.yaml
services:
  - type: web
    name: ai-resume-parser-backend
    runtime: python
    buildCommand: pip install -r requirements.txt
    startCommand: python -m uvicorn backend.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
📝 License
This project is licensed under the MIT License - see the LICENSE file for details. This means you are free to use, modify, distribute, and commercialize the software, provided you include the original copyright notice.

🤝 Contributing
We welcome contributions to improve the platform! To contribute:

Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request with a detailed description of your changes

Please ensure your code adheres to the project's coding standards and includes appropriate tests.

📧 Contact
Project Maintainer: Vadshan

GitHub: vadshan30

Live Demo: https://ai-resume-parser-1-5eb7.onrender.com

GitHub Repository: https://github.com/vadshan30/AI-RESUME-PARSER

🙏 Acknowledgments
This project would not be possible without the following open-source technologies:

Google Gemini AI - Providing advanced AI capabilities for resume analysis and content generation

FastAPI - Powering the high-performance backend API framework

React - Enabling the interactive and responsive user interface

Render - Hosting the application with seamless deployment workflows

TiDB Cloud - Providing reliable and scalable database infrastructure

⭐ Support the Project
If you found this project helpful, please consider:

Giving it a ⭐ on GitHub

Sharing it with others who might benefit from it

Contributing to its development

Built with ❤️ by Vadshan

Last Updated: July 2026

