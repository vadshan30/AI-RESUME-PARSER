🚀 AI Resume Parser & ATS Platform
________________________________________
📋 Overview
AI Resume Parser & ATS is a production-ready SaaS platform that leverages Google Gemini AI for intelligent resume analysis, ATS scoring, job matching, and career guidance.
Live Demo: https://ai-resume-parser-1-5eb7.onrender.com
⚠️ Render Free Tier Notice: Services spin down after 15 minutes of inactivity. First visit may take 30-60 seconds to wake up.
________________________________________
🌐 Live URLs
Component	URL
Frontend	https://ai-resume-parser-1-5eb7.onrender.com

Backend API	https://ai-resume-parser-upwf.onrender.com

API Docs	https://ai-resume-parser-upwf.onrender.com/docs

________________________________________
✨ Key Features
📄 Resume Management
•	Upload & parse PDF/DOCX resumes
•	Extract skills, education, experience
•	Resume history with search & delete
🧠 AI-Powered Analysis
•	Resume review & feedback
•	ATS compatibility scoring
•	Resume X-Ray (deep scan)
•	Resume improver (AI rewriting)
🎯 Job Matching
•	Job match analyzer
•	Skill gap detection
•	Hiring probability prediction
🗺️ Career Development
•	Learning roadmap generator
•	Career insights & alternatives
•	AI Career Twin recommendations
🎤 Interview Preparation
•	AI-powered mock interviews
•	Difficulty levels (Beginner → Expert)
•	Speech-to-text support
•	Automated answer evaluation
________________________________________
🛠️ Tech Stack
Layer	Technology
Frontend	React 18, TypeScript, Vite, Tailwind CSS, Zustand
Backend	FastAPI, Python 3.11, SQLAlchemy, Uvicorn
AI	Google Gemini 2.11
Database	TiDB Cloud (MySQL-compatible)
Deployment	Render (Free Tier)
________________________________________
🚀 Quick Start
Prerequisites
•	Python 3.11+
•	Node.js 18+
•	Google Gemini API Key
Installation
bash
# Clone
git clone https://github.com/vadshan30/AI-RESUME-PARSER.git
cd AI-RESUME-PARSER

# Backend
cd backend
pip install -r requirements.txt
python -m uvicorn backend.main:app --reload --port 8000

# Frontend (new terminal)
cd frontend
npm install
npm run dev
Access: http://localhost:5173
________________________________________
📊 API Endpoints
Resume Endpoints
Method	Endpoint	Description
POST	/resume/upload	Upload PDF
GET	/resume/	Get all resumes
GET	/resume/{id}	Get specific resume
DELETE	/resume/{id}	Delete resume
AI Endpoints
Method	Endpoint	Description
POST	/ai/review	Resume review
POST	/ai/job-match	Job matching
POST	/ai/skill-gap	Skill gap analysis
POST	/ai/interview-simulator	Mock interview
POST	/ai/hiring-probability	Hiring odds
POST	/ai/resume-xray	Deep scan
POST	/ai/career-roadmap	Career path
POST	/ai/cover-letter	Generate cover letter
Full API Docs: https://ai-resume-parser-upwf.onrender.com/docs
________________________________________
🔧 Deployment
Render Configuration
Backend (Web Service):
•	Build Command: pip install -r requirements.txt
•	Start Command: python -m uvicorn backend.main:app --host 0.0.0.0 --port $PORT
Frontend (Static Site):
•	Root Directory: frontend
•	Build Command: npm install && npm run build
•	Publish Directory: dist
________________________________________
📁 Project Structure
text
AI-RESUME-PARSER/
├── backend/
│   ├── ai/              # AI providers & services
│   ├── core/            # Config, cache, logging
│   ├── models/          # Database models
│   ├── parsers/         # PDF parsing
│   ├── routers/         # API endpoints
│   ├── services/        # Business logic
│   └── main.py          # FastAPI entry
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Zustand stores
│   │   └── services/    # API services
│   └── package.json
└── render.yaml          # Deploy config
________________________________________
📝 License
MIT License - see LICENSE file.
________________________________________
🤝 Contributing
1.	Fork the repo
2.	Create feature branch (git checkout -b feature/AmazingFeature)
3.	Commit changes (git commit -m 'Add feature')
4.	Push (git push origin feature/AmazingFeature)
5.	Open Pull Request
________________________________________
📧 Contact
Maintainer: Vadshan
•	GitHub: vadshan30
•	Live Demo: https://ai-resume-parser-1-5eb7.onrender.com
________________________________________
🙏 Acknowledgments
•	Google Gemini AI
•	FastAPI
•	React
•	Render
________________________________________
Built with ❤️ by Vadshan
________________________________________
⭐ Found this useful? Give it a star on GitHub!

