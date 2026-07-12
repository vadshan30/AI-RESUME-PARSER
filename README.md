🚀 AI Resume Parser & ATS Platform
https://img.shields.io/badge/Deployed%2520on-Render-46E3B7?logo=render&logoColor=white
https://img.shields.io/badge/FastAPI-0.139.0-009688?logo=fastapi&logoColor=white
https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white
https://img.shields.io/badge/Gemini%2520AI-2.11.0-4285F4?logo=google&logoColor=white
https://img.shields.io/badge/License-MIT-yellow.svg

📋 Overview
AI Resume Parser & ATS is a comprehensive, production-ready SaaS platform designed to revolutionize the job application process. By leveraging the power of Google Gemini AI, it provides intelligent resume analysis, accurate ATS scoring, precise job matching, and personalized career guidance. Whether you're a job seeker looking to optimize your resume or a professional planning your next career move, this platform offers the tools you need to succeed in today's competitive job market.

The platform combines modern web technologies with cutting-edge artificial intelligence to deliver a seamless user experience. From parsing complex PDF resumes to generating AI-powered interview questions, every feature is designed with the end-user in mind. The system is built on a robust, scalable architecture that ensures high performance and reliability, making it suitable for both individual users and enterprise deployments.

🔗 Live Demo: https://ai-resume-parser-1-5eb7.onrender.com

⚠️ Render Free Tier Notice: Services spin down after 15 minutes of inactivity. First visit may take 30-60 seconds to wake up. This is normal behavior for free-tier hosting.

🌐 Live URLs
Component	URL
Frontend Application	https://ai-resume-parser-1-5eb7.onrender.com
Backend API Service	https://ai-resume-parser-upwf.onrender.com
Interactive API Docs	https://ai-resume-parser-upwf.onrender.com/docs
✨ Key Features
📄 Resume Management System
Upload & Parse - Support for PDF, DOCX, and TXT files with automatic text extraction

Structured Data Extraction - Automatically extract skills, education, work experience, projects, and certifications

Resume History - Maintain a complete history with search, delete, and duplicate functionality

Organization - Rename and organize resumes for easy access and management

🧠 AI-Powered Analysis
Resume Review - Get detailed feedback with actionable improvement suggestions

ATS Compatibility Scoring - AI-driven scores for Applicant Tracking Systems

Resume X-Ray - Deep scan of keyword density, formatting, and content health

Resume Improver - AI-powered section rewriting and optimization for maximum impact

🎯 Job Matching
Job Match Analyzer - Compare resumes against job descriptions with detailed compatibility analysis

Skill Gap Detection - Identify missing or underdeveloped skills for target roles

Hiring Probability - AI prediction of shortlisting odds and interview likelihood

🗺️ Career Development
Learning Roadmap - Personalized, step-by-step career path generation

Career Insights - Discover alternative career paths and opportunities

AI Career Twin - Personalized career recommendations and skill development guidance

Career Intelligence - Data-driven career insights and market trends

🎤 Interview Preparation
AI Mock Interviews - Realistic interview simulations with AI

Difficulty Levels - Beginner, Intermediate, Advanced, and Expert modes

Speech-to-Text - Voice-based answers for realistic practice

Automated Evaluation - Detailed scoring and constructive feedback on answers

📊 Analytics Dashboard
Resume Health Scores - Visual tracking of resume quality over time

ATS Compatibility Trends - Monitor improvement in ATS scores

Skill Gap Analysis - Track skill development progress

Industry Benchmarks - Compare against professionals in your field

🛠️ Technology Stack
Layer	Technology
Frontend	React 18, TypeScript, Vite, Tailwind CSS, Zustand, Axios, Framer Motion
Backend	FastAPI, Python 3.11, SQLAlchemy, Uvicorn, PyMySQL
AI	Google Gemini 2.11
Database	TiDB Cloud (MySQL-compatible)
Deployment	Render (Free Tier)
Frontend Technologies
The frontend is built with React 18, utilizing TypeScript for type safety and Vite for lightning-fast build times. Tailwind CSS provides a utility-first styling approach, while Zustand handles state management efficiently. Axios manages HTTP requests, and Framer Motion adds smooth, professional animations. The combination ensures a responsive, performant, and visually appealing user interface.

Backend Technologies
The backend is powered by FastAPI, a modern, high-performance web framework for building APIs with Python. SQLAlchemy serves as the ORM for database interactions, while Uvicorn provides a lightning-fast ASGI server. The system uses PyMySQL for MySQL connectivity, pdfplumber for robust PDF parsing, and python-docx for DOCX file processing.

Artificial Intelligence
Google Gemini 2.11 serves as the primary AI engine, providing advanced natural language processing capabilities for resume analysis, content generation, and intelligent matching. The pydantic-settings library manages configuration across different environments.

Database & Deployment
The platform uses TiDB Cloud, a MySQL-compatible distributed database that offers high availability and scalability. Both the frontend and backend are deployed on Render's free tier, providing automatic deployments from GitHub and reliable hosting.

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

🚀 Quick Start
Prerequisites
Python 3.11+ - Backend requirement

Node.js 18+ - Frontend requirement

Git - For cloning the repository

Google Gemini API Key - Required for AI features

TiDB Cloud or MySQL Database - For data storage

Installation
bash
# Clone the repository
git clone https://github.com/vadshan30/AI-RESUME-PARSER.git
cd AI-RESUME-PARSER

# Backend setup
cd backend
pip install -r requirements.txt
python -m uvicorn backend.main:app --reload --port 8000

# Frontend setup (in a new terminal)
cd frontend
npm install
npm run dev
Access the Application:

Frontend: http://localhost:5173

Backend API: http://localhost:8000

API Documentation: http://localhost:8000/docs

🔧 Deployment
Deploy to Render
Backend (Web Service):

Push code to GitHub

Connect repository to Render

Set environment variables

Render auto-deploys on every push

Frontend (Static Site):

Push code to GitHub

Connect repository to Render

Set root directory: frontend

Build command: npm install && npm run build

Publish directory: dist

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

