from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from backend.data.roadmap_db import generate_roadmap

router = APIRouter(
    prefix="/api/roadmap",
    tags=["Learning Roadmap"]
)

class RoadmapRequest(BaseModel):
    target_role: str
    missing_skills: List[str]

@router.post("/generate")
def create_roadmap(req: RoadmapRequest):
    if not req.target_role:
        raise HTTPException(status_code=400, detail="Target role is required")
        
    roadmap_data = generate_roadmap(req.target_role, req.missing_skills)
    
    return {
        "status": "success",
        "data": roadmap_data
    }
