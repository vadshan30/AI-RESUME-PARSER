"""
Resume Improver Request Validation & Error Handling
----------------------------------------------------
Server-side validation (mirrors but does not replace client-side).
Error handler always returns structured fallback, never raw errors.
"""
from typing import Tuple, Optional, Dict, Any
from enum import Enum

from backend.services.resume_improver_service import fallback_improvement, validate_input


class ValidationErrorCode(str, Enum):
    EMPTY_DRAFT = "EMPTY_DRAFT"
    DRAFT_TOO_SHORT = "DRAFT_TOO_SHORT"
    DRAFT_TOO_LONG = "DRAFT_TOO_LONG"
    DRAFT_SPAM = "DRAFT_SPAM"
    DRAFT_SYMBOLS_ONLY = "DRAFT_SYMBOLS_ONLY"
    DRAFT_NUMBERS_ONLY = "DRAFT_NUMBERS_ONLY"
    INVALID_SECTION = "INVALID_SECTION"
    INVALID_ROLE = "INVALID_ROLE"
    INVALID_LEVEL = "INVALID_LEVEL"
    MISSING_FIELD = "MISSING_FIELD"
    INVALID_TYPE = "INVALID_TYPE"
    BACKEND_ERROR = "BACKEND_ERROR"
    AI_UNAVAILABLE = "AI_UNAVAILABLE"
    TIMEOUT = "TIMEOUT"
    UNKNOWN_ERROR = "UNKNOWN_ERROR"


class ValidationError:
    def __init__(self, code: ValidationErrorCode, message: str, field: Optional[str] = None):
        self.code = code
        self.message = message
        self.field = field

    def to_dict(self) -> Dict[str, Any]:
        return {
            "success": False,
            "error": self.message,
            "code": self.code.value,
            "field": self.field,
            "improved_text": "",
            "changes": [],
            "quality_score": 0,
            "ai_enhanced": False,
            "fallback_used": False,
        }


class ImproveResumeValidator:
    VALID_SECTIONS = ['auto', 'summary', 'experience', 'project', 'education', 'skills']
    VALID_LEVELS = ['Junior', 'Mid', 'Senior', 'Lead']

    MAX_DRAFT_LENGTH = 5000

    @staticmethod
    def validate_section_text(text: Optional[str]) -> Tuple[bool, Optional[ValidationError]]:
        if text is None or not isinstance(text, str):
            return False, ValidationError(
                ValidationErrorCode.EMPTY_DRAFT,
                "Please enter a meaningful resume section.",
                "section_text",
            )

        text = text.strip()

        if not text:
            return False, ValidationError(
                ValidationErrorCode.EMPTY_DRAFT,
                "Please enter a meaningful resume section.",
                "section_text",
            )

        # Word-count check (the core requirement)
        word_count = len(text.split())
        if word_count < 10:
            return False, ValidationError(
                ValidationErrorCode.DRAFT_TOO_SHORT,
                "Please enter a meaningful resume section.",
                "section_text",
            )

        if len(text) > ImproveResumeValidator.MAX_DRAFT_LENGTH:
            return False, ValidationError(
                ValidationErrorCode.DRAFT_TOO_LONG,
                f"The original draft cannot exceed {ImproveResumeValidator.MAX_DRAFT_LENGTH} characters.",
                "section_text",
            )

        # Keyboard spam detection (same logic as the service)
        valid, _ = validate_input(text)
        if not valid:
            return False, ValidationError(
                ValidationErrorCode.DRAFT_SPAM,
                "Unable to detect resume content. Please enter meaningful resume text.",
                "section_text",
            )

        return True, None

    @staticmethod
    def validate_section_type(section_type: Optional[str]) -> Tuple[bool, Optional[ValidationError]]:
        if section_type is None or not isinstance(section_type, str):
            return False, ValidationError(
                ValidationErrorCode.INVALID_SECTION,
                "Please select a section type.",
                "section_type",
            )
        if section_type not in ImproveResumeValidator.VALID_SECTIONS:
            return False, ValidationError(
                ValidationErrorCode.INVALID_SECTION,
                f"Invalid section type.",
                "section_type",
            )
        return True, None

    @staticmethod
    def validate_target_role(target_role: Optional[str]) -> Tuple[bool, Optional[ValidationError]]:
        if target_role is None:
            return True, None
        if not isinstance(target_role, str):
            return False, ValidationError(
                ValidationErrorCode.INVALID_ROLE,
                "Target role must be a string.",
                "target_role",
            )
        return True, None

    @staticmethod
    def validate_level(level: Optional[str]) -> Tuple[bool, Optional[ValidationError]]:
        if level is None:
            return True, None
        if not isinstance(level, str):
            return False, ValidationError(
                ValidationErrorCode.INVALID_LEVEL,
                "Experience level must be a string.",
                "level",
            )
        if level not in ImproveResumeValidator.VALID_LEVELS:
            return False, ValidationError(
                ValidationErrorCode.INVALID_LEVEL,
                f"Invalid experience level.",
                "level",
            )
        return True, None

    @staticmethod
    def validate_request(section_text: Optional[str], section_type: Optional[str],
                         target_role: Optional[str], level: Optional[str]) -> Tuple[bool, Optional[ValidationError]]:
        for field, validator in [
            (section_text, ImproveResumeValidator.validate_section_text),
            (section_type, ImproveResumeValidator.validate_section_type),
            (target_role, ImproveResumeValidator.validate_target_role),
            (level, ImproveResumeValidator.validate_level),
        ]:
            valid, error = validator(field)
            if not valid:
                return False, error
        return True, None


class ImproveResumeErrorHandler:
    """Centralized error handling — always returns deterministic fallback, never raw errors."""

    @staticmethod
    def handle_validation_error(error: ValidationError) -> Dict[str, Any]:
        return error.to_dict()

    @staticmethod
    def handle_backend_error(error_str: str, original_text: str, section_type: str) -> Dict[str, Any]:
        """
        Called when AI or the primary engine fails.
        Never exposes the raw error string. Always runs the deterministic fallback.
        """
        # Determine user-facing message (never expose internals)
        error_lower = error_str.lower()
        if "429" in error_str or "quota" in error_lower:
            user_message = "AI service temporarily unavailable. Applied offline resume optimization."
        elif "timeout" in error_lower or "504" in error_str:
            user_message = "Request timed out. Applied offline resume optimization."
        else:
            user_message = "Applied offline resume optimization."

        # Run the real fallback engine
        try:
            fallback = fallback_improvement(
                text=original_text,
                section_type=section_type,
            )
            fallback["error"] = user_message
            fallback["fallback_used"] = True
            fallback["ai_enhanced"] = False
            return fallback
        except Exception:
            # Absolute last-resort: return the original text with a minimal safe response
            return {
                "success": True,
                "improved_text": original_text,
                "section_type": section_type,
                "changes": ["Unable to improve resume. Please try again later."],
                "quality_score": 50,
                "sub_scores": {
                    "overall": 50,
                    "ats_score": 0,
                    "grammar_score": 50,
                    "readability_score": 50,
                    "formatting_score": 50,
                },
                "ai_enhanced": False,
                "fallback_used": True,
                "error": user_message,
                "code": ValidationErrorCode.UNKNOWN_ERROR.value,
                "stats": {
                    "original_length": len(original_text),
                    "improved_length": len(original_text),
                    "word_count_original": len(original_text.split()),
                    "word_count_improved": len(original_text.split()),
                },
                "role_suggestions": ["General Resume Improvement Tips"],
            }

    @staticmethod
    def handle_success(result: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "success": True,
            "improved_text": result.get("improved_text", ""),
            "section_type": result.get("section_type", ""),
            "changes": result.get("changes", []),
            "quality_score": result.get("quality_score", 0),
            "sub_scores": result.get("sub_scores", {}),
            "ai_enhanced": result.get("ai_enhanced", False),
            "fallback_used": result.get("fallback_used", False),
            "error": None,
            "stats": result.get("stats", {}),
            "highlights": result.get("highlights", {}),
            "role_suggestions": result.get("role_suggestions", []),
            "quality_report": result.get("quality_report", {}),
            "detected_role": result.get("detected_role", ""),
            "detected_skills": result.get("detected_skills", []),
            "missing_skills_for_role": result.get("missing_skills_for_role", []),
        }
