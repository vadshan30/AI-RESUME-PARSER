# 🚀 AI Resume Parser & ATS Platform

[![Deployed on Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?logo=render&logoColor=white)](https://ai-resume-parser-1-5eb7.onrender.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.139.0-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)](https://reactjs.org)
[![Gemini AI](https://img.shields.io/badge/Gemini%20AI-2.11.0-4285F4?logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📋 Overview

**AI Resume Parser & ATS** is a production-ready SaaS platform that uses **Google Gemini AI** for resume analysis, ATS scoring, job matching, and career guidance.

🔗 **Live Demo:** [https://ai-resume-parser-1-5eb7.onrender.com](https://ai-resume-parser-1-5eb7.onrender.com)

> ⚠️ **Free Tier Notice:** Services spin down after 15 minutes of inactivity. First visit takes 30-60 seconds to wake up.

---

## 🌐 Live URLs

| Component | URL |
|-----------|-----|
| **Frontend** | [https://ai-resume-parser-1-5eb7.onrender.com](https://ai-resume-parser-1-5eb7.onrender.com) |
| **Backend API** | [https://ai-resume-parser-upwf.onrender.com](https://ai-resume-parser-upwf.onrender.com) |
| **API Docs** | [https://ai-resume-parser-upwf.onrender.com/docs](https://ai-resume-parser-upwf.onrender.com/docs) |

---

## ✨ Features

| Category | Features |
|----------|----------|
| 📄 **Resume Management** | Upload PDF/DOCX, extract skills/education/experience, history search |
| 🧠 **AI Analysis** | Resume review, ATS scoring, X-Ray scan, AI rewriting |
| 🎯 **Job Matching** | Job match analyzer, skill gap detection, hiring probability |
| 🗺️ **Career Development** | Learning roadmap, career insights, AI Career Twin |
| 🎤 **Interview Prep** | Mock interviews, difficulty levels, speech-to-text, automated evaluation |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Zustand |
| **Backend** | FastAPI, Python 3.11, SQLAlchemy, Uvicorn |
| **AI** | Google Gemini 2.11 |
| **Database** | TiDB Cloud (MySQL-compatible) |
| **Deployment** | Render (Free Tier) |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+, Node.js 18+, Google Gemini API Key

### Installation

```bash
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
