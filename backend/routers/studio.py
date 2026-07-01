import random
from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from typing import Dict, Any, List, Optional

from backend.data.templates_db import TEMPLATE_CATALOG, get_template_by_id
from backend.services.document_builder import generate_pdf, generate_docx

router = APIRouter(
    prefix="/api/studio",
    tags=["Resume Studio"]
)

class ExportRequest(BaseModel):
    template_id: str
    resume_data: Dict[str, Any]

@router.get("/templates")
def list_templates():
    return {
        "status": "success",
        "data": TEMPLATE_CATALOG
    }

@router.post("/export/pdf")
def export_pdf(req: ExportRequest):
    try:
        pdf_bytes = generate_pdf(req.resume_data, req.template_id)
        return Response(content=pdf_bytes, media_type="application/pdf", headers={
            "Content-Disposition": f"attachment; filename=resume_{req.template_id}.pdf"
        })
    except Exception as e:
        # If fpdf2 is missing, we catch it here so the server doesn't completely crash on startup
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/export/docx")
def export_docx(req: ExportRequest):
    try:
        docx_bytes = generate_docx(req.resume_data, req.template_id)
        return Response(content=docx_bytes, media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document", headers={
            "Content-Disposition": f"attachment; filename=resume_{req.template_id}.docx"
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class RewriteRequest(BaseModel):
    text: str
    tone: str

@router.post("/ai-rewrite")
def rewrite_text(req: RewriteRequest):
    # Simulated AI rewrite for the bullet point
    improvements = [
        f"Spearheaded {req.text.lower()} resulting in a 30% increase in efficiency.",
        f"Engineered highly scalable {req.text.lower()} leveraging modern frameworks.",
        f"Optimized {req.text.lower()} to reduce latency by 40ms across the stack."
    ]
    return {
        "status": "success",
        "data": {
            "rewritten": random.choice(improvements)
        }
    }
