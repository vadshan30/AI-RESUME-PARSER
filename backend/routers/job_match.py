import logging
import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from backend.database import get_db
from backend.routers.ai import get_resume_db_obj, extract_resume_data

router = APIRouter(prefix="/api/job-match", tags=["Job Matcher"])
logger = logging.getLogger(__name__)

class JobMatchRequest(BaseModel):
    resume_id: int
    job_description: Optional[str] = None
    target_role: Optional[str] = None

class ExtractJDRequest(BaseModel):
    job_description: str

@router.post("/extract-jd")
def api_extract_jd(req: ExtractJDRequest):
    import re
    text = req.job_description

    skill_patterns = [
        r'\b(python|java|javascript|typescript|react|angular|vue|node\.?js|express|django|flask|fastapi|spring|sql|nosql|mongodb|postgresql|mysql|redis|aws|azure|gcp|docker|kubernetes|git|ci/?cd|rest|graphql|machine.?learning|deep.?learning|nlp|tensorflow|pytorch|pandas|numpy|scikit.?learn|html|css|sass|tailwind|bootstrap|figma|photoshop|illustrator|jira|confluence|agile|scrum|kanban|sdlc|devops|mlops|etl|airflow|spark|hadoop|kafka|elasticsearch|kibana|grafana|prometheus|terraform|ansible|jenkins|github.?actions|linux|bash|powershell|c\+\+|c#|go|rust|ruby|php|swift|kotlin|scala|r|matlab|excel|tableau|power.?bi|looker|snowflake|databricks|bigquery|redshift|salesforce|hubspot|stripe|paypal|oauth|jwt|ssl|tls|cybersecurity|penetration.?testing|owasp|soc2|gdpr|hipaa|pci|iso.?27001|cloud.?formation|serverless|lambda|s3|ec2|rds|dynamodb|sqs|sns|cloudfront|route.?53|iam|cloudwatch|terraform|pulumi|helm|istio|envoy|grpc|websocket|webrtc|blockchain|solidity|web3|defi|smart.?contract|ai|generative.?ai|llm|gpt|transformer|bert|rag|langchain|llamaindex|vector.?database|pinecone|weaviate|chromadb|openai|anthropic|hugging.?face|copilot|cursor)\b',
    ]
    exp_patterns = [
        r'(\d{1,2})\+?\s*(?:to|-)?\s*(\d{1,2})?\+?\s*years?\s*(?:of\s+)?experience',
        r'(\d{1,2})\+?\s*years?\s*(?:of\s+)?(?:professional\s+)?experience',
        r'minimum\s+of\s+(\d{1,2})\s*years',
        r'at\s+least\s+(\d{1,2})\s*years',
    ]

    text_lower = text.lower()
    found_skills = set()
    for pat in skill_patterns:
        for match in re.finditer(pat, text_lower):
            skill = match.group(1).strip()
            if len(skill) > 2:
                found_skills.add(skill)

    soft_skill_keywords = [
        'communication', 'leadership', 'teamwork', 'problem.solving', 'critical.thinking',
        'adaptability', 'time.management', 'collaboration', 'mentoring', 'stakeholder',
        'presentation', 'negotiation', 'creative', 'analytical', 'detail.oriented',
        'self.motivated', 'proactive', 'empathy', 'conflict.resolution', 'decision.making'
    ]
    found_soft = set()
    for s in soft_skill_keywords:
        if s.replace('.', '') in text_lower or s in text_lower:
            found_soft.add(s.replace('.', ' ').title())

    min_exp = 0
    max_exp = None
    for pat in exp_patterns:
        matches = re.findall(pat, text_lower)
        for m in matches:
            if isinstance(m, tuple):
                nums = [int(x) for x in m if x]
                if nums:
                    min_exp = max(min_exp, min(nums))
                    if len(nums) > 1:
                        max_exp = max(nums) if max_exp is None else max(max_exp, max(nums))
            else:
                min_exp = max(min_exp, int(m))

    return {
        "requiredSkills": sorted(found_skills),
        "softSkills": sorted(found_soft),
        "minExperience": min_exp,
        "maxExperience": max_exp
    }

@router.post("")
def api_job_match(req: JobMatchRequest, db: Session = Depends(get_db)):
    logger.info("Request received")
    logger.info("Endpoint matched: POST /api/job-match")
    logger.info(f"Resume ID: {req.resume_id}")

    if not req.resume_id:
        raise HTTPException(status_code=400, detail="Resume ID is required")
        
    db_resume = get_resume_db_obj(db, req.resume_id)
    if not db_resume:
        raise HTTPException(status_code=404, detail="Resume not found in database")
    
    logger.info("Resume found")
    logger.info("Database query success")
    
    resume_data = extract_resume_data(db_resume)
    
    try:
        from backend.services.job_matcher.report_generator import generate_job_match_report, PipelineException
        return generate_job_match_report(resume_data, req.job_description, req.target_role)
    except Exception as e:
        from backend.services.job_matcher.report_generator import PipelineException
        from backend.services.job_matcher.scan_tracker import scan_tracker
        import traceback
        tb = traceback.format_exc()
        
        if isinstance(e, PipelineException):
            logger.error(f"Pipeline Failed at {e.stage}: {e.reason}")
            scan_tracker.fail(e.stage, e.reason, tb)
            raise HTTPException(status_code=400, detail={
                "success": False,
                "failed_stage": e.stage,
                "reason": e.reason,
                "details": e.details,
                "suggestion": e.suggestion
            })
            
        logger.error(f"Job Match Engine Failed: {str(e)}", exc_info=True)
        scan_tracker.fail("System Error", str(e), tb)
        raise HTTPException(status_code=500, detail={
            "success": False,
            "failed_stage": "System Error",
            "reason": "Internal server error during scan",
            "details": str(e),
            "suggestion": "Please try again later or contact developer support with the debug log."
        })

@router.get("/debug/last-scan")
def get_last_scan_debug():
    from backend.services.job_matcher.scan_tracker import scan_tracker
    return {
        "current_stage": scan_tracker.current_stage,
        "completed_steps": scan_tracker.completed_steps,
        "failed_step": scan_tracker.failed_step,
        "error": scan_tracker.error,
        "stack_trace": scan_tracker.stack_trace,
        "execution_time": f"{scan_tracker.execution_time:.2f}s",
        "resume_summary": scan_tracker.resume_summary,
        "jd_summary": scan_tracker.jd_summary
    }

@router.get("/debug/{resume_id}")
def api_job_match_debug(resume_id: int, db: Session = Depends(get_db)):
    db_resume = get_resume_db_obj(db, resume_id)
    resume_data = extract_resume_data(db_resume)
    
    file_path = resume_data.get("file_path")
    file_exists = False
    pages = 0
    chars = 0
    words = 0
    text = ""
    
    if file_path and os.path.exists(file_path):
        file_exists = True
        try:
            import pdfplumber
            with pdfplumber.open(file_path) as pdf:
                pages = len(pdf.pages)
            from backend.parsers.pdf_extractor import extract_text_from_file
            text = extract_text_from_file(file_path)
            chars = len(text)
            words = len(text.split())
        except Exception:
            pass

    # Calculate points-based validation report
    validation_report = None
    if text:
        from backend.validators.content_validator import content_validator
        validation_report = content_validator.evaluate_resume_quality(text)

    return {
        "Resume Exists": True,
        "Resume Path": file_path,
        "File Exists": file_exists,
        "Pages": pages,
        "Characters": chars,
        "Words": words,
        "Detected Role": resume_data.get("job_titles", ["Unknown"])[0] if resume_data.get("job_titles") else "Unknown",
        "Detected Skills": len(resume_data.get("skills", [])),
        "Projects Count": len(resume_data.get("projects", [])),
        "Education Count": len(resume_data.get("education", [])),
        "validation_report": validation_report,
        "Parser Version": "v2.0.1"
    }
