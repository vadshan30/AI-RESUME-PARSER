from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database import engine, Base
from backend.routers import resumes, ai, analytics, career, roadmap, insights, studio, platform, health, job_match
from backend.middleware.error_handler import setup_app as setup_error_handlers

# Create all tables in the database (this creates the normalized relational tables)
# This will recreate tables that were dropped by the user.
# Forcing uvicorn reload again.
from backend.models import Base
from backend.database import engine

Base.metadata.create_all(bind=engine)

# Auto-migrate: Add new columns if they don't exist
from sqlalchemy import text
try:
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE resumes ADD COLUMN analysis_data JSON;"))
except Exception as e:
    pass # Column likely already exists

try:
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE resumes ADD COLUMN file_path VARCHAR(500) NULL;"))
except Exception as e:
    pass # Column likely already exists

app = FastAPI(title="AI Resume Parser & ATS", version="1.0.0")
setup_error_handlers(app)

import os

from backend.core.config import get_settings

settings = get_settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    # Allow any local dev port (5173, 5174, etc.) and deployed frontends
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(resumes.router)
app.include_router(ai.router)
app.include_router(job_match.router)
app.include_router(analytics.router)
app.include_router(career.router)
app.include_router(roadmap.router)
app.include_router(insights.router)
app.include_router(studio.router)
app.include_router(platform.router)
app.include_router(health.router)


@app.get("/")
def read_root():
    return {
        "message": "AI Resume Parser backend is running.",
        "status": "success",
        "phase": "Phase 1 - Database Integration"
    }