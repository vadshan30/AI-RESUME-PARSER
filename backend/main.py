from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database import engine, Base
from backend.routers import resumes, ai, analytics, career, roadmap, insights, studio

# Create all tables in the database (this creates the normalized relational tables)
# This will recreate tables that were dropped by the user.
# Forcing uvicorn reload again.
from backend.models import Base
from backend.database import engine

Base.metadata.create_all(bind=engine)

# Auto-migrate: Add analysis_data JSON column if it doesn't exist
from sqlalchemy import text
try:
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE resumes ADD COLUMN analysis_data JSON;"))
except Exception as e:
    pass # Column likely already exists

app = FastAPI(title="AI Resume Parser & ATS", version="1.0.0")

import os

# Configure CORS
# Allow origins from environment variable or fallback to local

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Your Vite dev
        "https://ai-resume-parser-1-5eb7.onrender.com",  # Your LIVE frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(resumes.router)
app.include_router(ai.router)
app.include_router(analytics.router)
app.include_router(career.router)
app.include_router(roadmap.router)
app.include_router(insights.router)
app.include_router(studio.router)


@app.get("/")
def read_root():
    return {
        "message": "AI Resume Parser backend is running.",
        "status": "success",
        "phase": "Phase 1 - Database Integration"
    }