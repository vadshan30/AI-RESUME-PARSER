"""
Resume Improver Endpoint — Complete Request Pipeline
---------------------------------------------------
1. Server-side validation
2. AI enhancement (try)
3. Deterministic fallback (if AI fails)
Always returns structured JSON — never raw HTTP errors.
"""
import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

logger = logging.getLogger(__name__)

from backend.validators.improve_resume_validator import (
    ImproveResumeValidator, ImproveResumeErrorHandler, ValidationError,
)
from backend.ai.services.ai_service import AIService

router = APIRouter(prefix="/ai", tags=["AI Features"])
ai_service = AIService()


class ImproveSectionRequest(BaseModel):
    section_text: str
    section_type: str
    target_role: Optional[str] = None
    level: Optional[str] = None


@router.post("/improve-resume")
def improve_resume_section(req: ImproveSectionRequest):
    logger.info("[IMPROVE-RESUME] Request: text_len=%d section=%s role=%s level=%s",
                len(req.section_text) if req.section_text else 0,
                req.section_type, req.target_role, req.level)

    # ── Step 1: Backend validation ──
    valid, validation_error = ImproveResumeValidator.validate_request(
        req.section_text, req.section_type, req.target_role, req.level,
    )
    if not valid:
        logger.warning("[IMPROVE-RESUME] Validation failed: %s - %s",
                       validation_error.code.value, validation_error.message)
        return ImproveResumeErrorHandler.handle_validation_error(validation_error)

    logger.info("[IMPROVE-RESUME] Validation passed")

    # ── Step 2: Try AI enhancement ──
    ai_succeeded = False
    ai_result = None
    try:
        logger.info("[IMPROVE-RESUME] Calling AI service")
        ai_result = ai_service.improve_resume_section_hybrid(
            req.section_text, req.section_type, req.target_role, req.level,
        )
        ai_succeeded = ai_result is not None and ai_result.get("success") is True
        if ai_succeeded:
            logger.info("[IMPROVE-RESUME] AI service succeeded")
        else:
            logger.warning("[IMPROVE-RESUME] AI service returned non-success")
    except HTTPException:
        raise
    except Exception as e:
        logger.warning("[IMPROVE-RESUME] AI service failed: %s. Falling back to deterministic engine.", str(e))

    # ── Step 3: Deterministic fallback (always works) ──
    if ai_succeeded:
        response = ImproveResumeErrorHandler.handle_success(ai_result)
        logger.info("[IMPROVE-RESUME] AI enhancement complete — quality_score=%d",
                    response.get("quality_score", 0))
    else:
        error_detail = ""
        if ai_result:
            error_detail = ai_result.get("error", "") or ""
        response = ImproveResumeErrorHandler.handle_backend_error(
            error_detail, req.section_text, req.section_type,
        )
        logger.info("[IMPROVE-RESUME] Offline optimization applied — quality_score=%d",
                    response.get("quality_score", 50))

    return response
