from fastapi import APIRouter, Depends, status, Request
from sqlalchemy.orm import Session
from datetime import datetime
import logging
import os
import sys

from backend.database import get_db
from backend.core.config import get_settings

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/system", tags=["System Health"])

@router.get("/health")
async def health_check(request: Request, db: Session = Depends(get_db)):
    settings = get_settings()
    services = {}
    overall_status = "healthy"
    
    # Check Backend Running
    services["backend"] = {"status": "healthy", "version": "1.0.0"}
    
    # Check Database
    try:
        from sqlalchemy import text
        db.execute(text("SELECT 1"))
        services["database"] = {"status": "healthy"}
    except Exception as e:
        services["database"] = {"status": "unhealthy", "error": str(e)}
        overall_status = "unhealthy"
        logger.error(f"Database health check failed: {e}")
        
    # Check Upload Folder
    upload_path = "backend/uploads/resumes"
    if os.path.exists(upload_path):
        services["upload_folder"] = {"status": "healthy", "path": upload_path}
    else:
        services["upload_folder"] = {"status": "unhealthy", "error": "Directory missing"}
        overall_status = "unhealthy"
        
    # Check Resume Parser
    try:
        import pdfplumber
        services["resume_parser"] = {"status": "healthy", "module": "pdfplumber"}
    except ImportError:
        services["resume_parser"] = {"status": "unhealthy", "error": "pdfplumber not installed"}
        overall_status = "unhealthy"
        
    # Check Gemini AI
    if os.getenv("GEMINI_API_KEY"):
        try:
            from google import genai
            client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
            services["gemini_ai"] = {
                "status": "healthy",
                "provider": "Gemini",
                "model": settings.GEMINI_MODEL,
                "api_key": "configured"
            }
        except Exception as e:
            services["gemini_ai"] = {
                "status": "unhealthy", 
                "reason": str(e)
            }
            overall_status = "unhealthy"
            logger.error(f"Gemini AI health check failed: {e}")
    else:
        services["gemini_ai"] = {
            "status": "unhealthy",
            "reason": "API Key is missing"
        }
        overall_status = "unhealthy"

    # Endpoint Registration Check
    routes = [route.path for route in request.app.routes]
    
    has_upload = any(r.endswith("/resume/upload") for r in routes)
    has_job_match = any(r.endswith("/api/job-match/") for r in routes)
    
    services["resume_upload_service"] = {"status": "healthy" if has_upload else "unhealthy"}
    services["job_match_api"] = {"status": "healthy" if has_job_match else "unhealthy"}
    services["endpoint_registration"] = {
        "status": "healthy",
        "total_routes": len(routes),
        "job_match_registered": has_job_match,
        "upload_registered": has_upload
    }
    
    system = {
        "python_version": sys.version.split(" ")[0],
        "platform": sys.platform,
        "environment": settings.APP_ENV,
        "timestamp": datetime.utcnow().isoformat()
    }
    
    response = {
        "status": overall_status,
        "services": services,
        "system": system
    }
    
    status_code = status.HTTP_200_OK if overall_status == "healthy" else status.HTTP_503_SERVICE_UNAVAILABLE
    return response
