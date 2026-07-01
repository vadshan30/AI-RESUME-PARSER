from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List

from backend.data.insights_db import generate_career_insights

router = APIRouter(
    prefix="/api/insights",
    tags=["Career Insights"]
)

class InsightsRequest(BaseModel):
    resume_data: Dict[str, Any]

@router.post("/analyze")
def analyze_insights(req: InsightsRequest):
    if not req.resume_data:
        raise HTTPException(status_code=400, detail="Resume data is required")
        
    insights = generate_career_insights(req.resume_data)
    
    return {
        "status": "success",
        "data": insights
    }
