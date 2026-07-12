import logging
import re
import os
import concurrent.futures
from typing import Dict, Any

from backend.services.job_matcher.local_parser import local_parse_resume, local_parse_job_description
from backend.services.job_matcher.role_classifier import classify_roles
from backend.services.job_matcher.matching_engine import match_features
from backend.services.job_matcher.scoring_engine import calculate_scores
from backend.services.job_matcher.recommendation_engine import generate_recommendations
from backend.services.job_matcher.job_match_service import build_enhanced_response
from backend.parsers.pdf_extractor import extract_text_from_file

logger = logging.getLogger(__name__)

from backend.services.job_matcher.scan_tracker import scan_tracker

class PipelineException(Exception):
    def __init__(self, stage: str, reason: str, details: str, suggestion: str):
        self.stage = stage
        self.reason = reason
        self.details = details
        self.suggestion = suggestion
        super().__init__(f"[{stage}] {reason}: {details}")

def generate_job_match_report(resume_data: Dict[str, Any], job_description: str, target_role: str = None) -> Dict[str, Any]:
    """
    Orchestrates the pipeline modules to generate the final Enterprise ATS Job Match report.
    Takes parsed DB resume data (including file_path), raw JD string, and optional target role string.
    """
    logger.info("Generating Enterprise ATS Job Match Report...")
    scan_tracker.start()

    # STEP 1: Database Resume Load
    logger.info("[STEP 1] Database Resume Load")
    logger.info("Input Resume ID: %s", resume_data.get("id") if resume_data else "None")
    if not resume_data or "id" not in resume_data:
        err_msg = "No resume data or ID was provided."
        logger.error("[STEP 1] FAIL: %s", err_msg)
        scan_tracker.fail("Resume Loader", err_msg, "")
        raise PipelineException("Resume Loader", "Resume ID missing", err_msg, "Please select a valid resume.")
    
    scan_tracker.set_stage("Resume Loaded")
    logger.info("[STEP 1] PASS. Resume Name: %s", resume_data.get("name"))

    # STEP 2: File Verification
    logger.info("[STEP 2] File Verification")
    file_path = resume_data.get("file_path")
    logger.info("Input File Path: %s", file_path)
    if file_path and not os.path.exists(str(file_path)):
        from backend.parsers.pdf_extractor import resolve_resume_path
        file_path = resolve_resume_path(file_path)
        logger.info("Resolved File Path: %s", file_path)
        resume_data["file_path"] = file_path

    resume_text = ""
    using_legacy = False

    if not file_path or not os.path.exists(str(file_path)):
        # Build a rich synthetic resume text from all DB-stored fields
        name = resume_data.get("name") or ""
        skills = resume_data.get("skills") or []
        experiences = resume_data.get("experience_details") or []
        projects = resume_data.get("projects") or []
        education = resume_data.get("education") or []
        job_titles = resume_data.get("job_titles") or []

        parts = []
        if name:
            parts.append(f"Name: {name}")
        if job_titles:
            parts.append("Role: " + ", ".join(job_titles))
        if skills:
            parts.append("Skills: " + ", ".join(skills))
        if experiences:
            parts.append("Experience:\n" + "\n".join(f"- {e}" for e in experiences))
        if projects:
            parts.append("Projects:\n" + "\n".join(f"- {p}" for p in projects))
        if education:
            parts.append("Education:\n" + "\n".join(f"- {e}" for e in education))

        synthetic_text = "\n".join(parts).strip()

        if not synthetic_text or len(synthetic_text) < 50:
            err_msg = "Database record is missing file_path and has insufficient structured data to run analysis."
            logger.error("[STEP 2] FAIL: %s", err_msg)
            scan_tracker.fail("File Verification", err_msg, "")
            raise PipelineException(
                "File Verification",
                "Resume file not available",
                err_msg,
                "Please re-upload your resume from the Dashboard."
            )

        resume_text = synthetic_text
        using_legacy = True
        scan_tracker.set_stage("File Verified")
        logger.warning("[STEP 2] File not found on disk. Using synthesized DB text (%d chars)", len(resume_text))
    else:
        scan_tracker.set_stage("File Verified")
        logger.info("[STEP 2] PASS")

    # STEP 3: Text Extraction
    logger.info("[STEP 3] Text Extraction")
    if file_path and os.path.exists(str(file_path)) and not using_legacy:
        try:
            resume_text = extract_text_from_file(file_path)
            chars_count = len(resume_text.strip())
            words_count = len(resume_text.split())
            logger.info("Extracted %d characters, %d words", chars_count, words_count)
            
            # Validation
            if chars_count < 100:
                err_msg = f"Extracted only {chars_count} characters. Text is too short."
                logger.error("[STEP 3] FAIL: %s", err_msg)
                scan_tracker.fail("Text Extraction", err_msg, "")
                raise PipelineException("Text Extraction", "Text too short", err_msg, "Upload a text-based PDF or ensure the document has content.")
            
            scan_tracker.set_stage("Text Extracted")
            logger.info("[STEP 3] PASS")
        except Exception as e:
            if isinstance(e, PipelineException):
                raise e
            import traceback
            tb = traceback.format_exc()
            logger.error("[STEP 3] FAIL: %s\n%s", str(e), tb)
            scan_tracker.fail("Text Extraction", str(e), tb)
            raise PipelineException("Text Extraction", "PDF extraction failed", str(e), "Ensure the file is not corrupted or password-protected.")
    else:
        # resume_text already populated from synthesized DB text in STEP 2
        scan_tracker.set_stage("Text Extracted")
        logger.info("[STEP 3] PASS (Synthesized DB text, %d chars)", len(resume_text))

    # STEP 4: Resume Validation
    logger.info("[STEP 4] Resume Validation")
    pages = 1
    file_size = 0
    file_name = resume_data.get("filename") or ""
    file_type = ""
    if file_path:
        if not file_name:
            file_name = os.path.basename(file_path)
        file_type = os.path.splitext(file_path)[1].replace('.', '').upper()
        if os.path.exists(file_path):
            file_size = os.path.getsize(file_path)
            if file_type == 'PDF':
                try:
                    import pdfplumber
                    with pdfplumber.open(file_path) as pdf:
                        pages = len(pdf.pages)
                except:
                    pass
    else:
        file_name = "Legacy Raw Text"
        file_type = "TXT"

    try:
        from backend.validators.content_validator import content_validator
        validation_report = content_validator.evaluate_resume_quality(resume_text)
        validation_report.update({
            "file_name": file_name,
            "file_type": file_type,
            "file_size_bytes": file_size,
            "chars_extracted": len(resume_text),
            "pages": pages,
            "text_preview": resume_text[:300] + "..." if len(resume_text) > 300 else resume_text
        })
        
        logger.info("Validation Score: %d/100, Status: %s", validation_report["score"], validation_report["status"])
        
        if validation_report["status"] == "INVALID":
            err_msg = f"Resume quality check failed: {validation_report['reason']}"
            logger.error("[STEP 4] FAIL: %s", err_msg)
            scan_tracker.fail("Resume Validation", err_msg, "")
            return {
                "success": False,
                "ats_score": 0,
                "message": f"Invalid resume. Reason: {validation_report['reason']}",
                "validation_report": validation_report
            }
            
        scan_tracker.set_stage("Resume Validated")
        logger.info("[STEP 4] PASS")
    except Exception as e:
        import traceback
        tb = traceback.format_exc()
        logger.error("[STEP 4] FAIL: %s\n%s", str(e), tb)
        scan_tracker.fail("Resume Validation", str(e), tb)
        raise PipelineException("Resume Validation", "Validation error", str(e), "Please check document format.")

    # Normalize resume text for Gemini LLM request
    normalized_resume_text = re.sub(r'\s+', ' ', resume_text).strip()
    
    # STEP 5 & 6: Concurrent Resume and JD Parsing
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
        # STEP 5: Resume Parsing
        logger.info("[STEP 5] Resume Parsing Started")
        future_res = executor.submit(local_parse_resume, normalized_resume_text)
        
        # STEP 6: Job Description Parsing
        logger.info("[STEP 6] Job Description Parsing Started")
        future_job = None
        if job_description:
            try:
                jd_length = len(job_description.strip())
                logger.info("JD Length: %d chars", jd_length)
                if jd_length < 50:
                    raise ValueError(f"Job description too short ({jd_length} chars).")
                if re.match(r'^[asdfjkl;]+$', job_description.lower()) or len(re.findall(r'[a-zA-Z]', job_description)) < 20:
                    raise ValueError("Invalid Job Description format.")
                    
                future_job = executor.submit(local_parse_job_description, job_description)
            except Exception as e:
                logger.error("[STEP 6] FAIL during pre-validation: %s", str(e))
                scan_tracker.fail("Job Description Parser", str(e), "")
                raise PipelineException("Job Description Parser", "JD parsing pre-validation failed", str(e), "Make sure you paste a clear, standard job description.")
            
        try:
            res_parsed = future_res.result()
            skills = res_parsed.get("skills", [])
            education = res_parsed.get("education", [])
            experience = res_parsed.get("experience", 0)
            
            if not res_parsed.get("name"):
                logger.warning("[STEP 5] Warning: Candidate name was not extracted.")
            if not skills:
                raise ValueError("No skills extracted from resume.")
                
            logger.info("Parsed %d skills, %d education, experience %s years", len(skills), len(education), experience)
            scan_tracker.resume_summary = res_parsed
            scan_tracker.set_stage("Resume Parsed")
            logger.info("[STEP 5] PASS")
        except Exception as e:
            import traceback
            tb = traceback.format_exc()
            logger.error("[STEP 5] FAIL: %s\n%s", str(e), tb)
            scan_tracker.fail("Resume Parser", str(e), tb)
            raise PipelineException("Resume Parser", "Parsing failed", str(e), "Ensure your resume contains clear headings and structured data.")

        if future_job:
            try:
                job_parsed = future_job.result()
                logger.info("Parsed job: %s, skills: %d", job_parsed.get("job_title", "Unknown"), len(job_parsed.get("required_skills", [])))
                scan_tracker.jd_summary = job_parsed
                scan_tracker.set_stage("Job Description Parsed")
                logger.info("[STEP 6] PASS")
            except Exception as e:
                import traceback
                tb = traceback.format_exc()
                logger.error("[STEP 6] FAIL: %s\n%s", str(e), tb)
                scan_tracker.fail("Job Description Parser", str(e), tb)
                raise PipelineException("Job Description Parser", "JD parsing failed", str(e), "Make sure you paste a clear, standard job description.")
        else:
            job_parsed = {"required_skills": []}
            logger.info("[STEP 6] SKIPPED (No JD provided)")
            
    # STEP 7: Role Classification
    logger.info("[STEP 7] Role Classification")
    try:
        role_data = classify_roles(res_parsed, job_parsed, target_role)
        logger.info("Inferred Role: %s", role_data.get("inferred_target_role", "Unknown"))
        scan_tracker.set_stage("Role Classified")
        logger.info("[STEP 7] PASS")
    except Exception as e:
        import traceback
        tb = traceback.format_exc()
        logger.error("[STEP 7] FAIL: %s\n%s", str(e), tb)
        scan_tracker.fail("Role Classifier", str(e), tb)
        raise PipelineException("Role Classifier", "Role classification failed", str(e), "Specify target role explicitly.")

    # STEP 8: ATS Calculation
    logger.info("[STEP 8] ATS Calculation")
    try:
        match_data = match_features(res_parsed, job_parsed)
        score_data = calculate_scores(match_data, role_data, res_parsed, job_parsed)
        
        if score_data.get("overall_score") is None:
            raise ValueError("Scoring engine returned None overall score.")
            
        logger.info("Scoring Pass. Overall Score: %d", score_data.get("overall_score"))
        scan_tracker.set_stage("ATS Calculated")
        logger.info("[STEP 8] PASS")
    except Exception as e:
        import traceback
        tb = traceback.format_exc()
        logger.error("[STEP 8] FAIL: %s\n%s", str(e), tb)
        scan_tracker.fail("Scoring Engine", str(e), tb)
        raise PipelineException("Scoring Engine", "ATS scoring failed", str(e), "Check if experience is a number and skills match.")

    # STEP 9: Report & Recommendations
    logger.info("[STEP 9] Recommendation Generation")
    try:
        rec_data = generate_recommendations(match_data, role_data, score_data)
        
        if not rec_data.get("priority_learning_plan") or not rec_data.get("salary_estimate"):
            raise ValueError("Recommendations generation returned incomplete details.")
            
        scan_tracker.set_stage("Report Generated")
        logger.info("[STEP 9] PASS")
    except Exception as e:
        import traceback
        tb = traceback.format_exc()
        logger.error("[STEP 9] FAIL: %s\n%s", str(e), tb)
        scan_tracker.fail("Recommendation Engine", str(e), tb)
        raise PipelineException("Recommendation Engine", "Report generation failed", str(e), "Verify recommendations engine dependencies.")

    # STEP 10: Critical Gaps, Market Intelligence & Priority Learning Plan
    logger.info("[STEP 10] Enhanced Job Match Analysis (Critical Gaps, Market Intelligence, Learning Plan)")
    try:
        enhanced = build_enhanced_response(resume_data, normalized_resume_text, target_role, job_description, {
            "scores": score_data,
            "match_analysis": match_data,
            "role_analysis": role_data,
            "recommendations": rec_data,
        })
        logger.info("[STEP 10] PASS — Generated %d gaps, market intel, and learning plan", 
                    len(enhanced.get("critical_gaps", {}).get("gaps", [])))
    except Exception as e:
        logger.warning("[STEP 10] Enhanced generation failed, using fallback: %s", str(e))
        enhanced = _fallback_enhanced(target_role, score_data)

    logger.info("Response returned")

    report = {
        "success": True,
        "resume_summary": res_parsed,
        "job_summary": job_parsed,
        "role_analysis": role_data,
        "match_analysis": match_data,
        "scores": score_data,
        "recommendations": rec_data,
        "validation_report": validation_report,
        "critical_gaps": enhanced.get("critical_gaps"),
        "market_intelligence": enhanced.get("market_intelligence"),
        "priority_learning_plan": enhanced.get("priority_learning_plan"),
        "role_info": enhanced.get("role_info"),
        "score_improvement": enhanced.get("score_improvement"),
        "generated_at": enhanced.get("generated_at"),
    }
    
    return report


def _fallback_enhanced(target_role: str, score_data: dict) -> dict:
    """Minimal fallback when enhanced generation fails."""
    from datetime import datetime, timezone
    return {
        "critical_gaps": {"gaps": [], "summary": {"total_gaps": 0, "critical_count": 0, "high_count": 0, "medium_count": 0, "low_count": 0, "estimated_total_gain": 0}, "missing_mandatory_skills": [], "missing_preferred_skills": [], "missing_certifications": [], "missing_soft_skills": [], "experience_gap_years": 0, "education_gap": None},
        "market_intelligence": {"salary": {"india": "Market competitive", "usa": "Market competitive", "remote": "Market competitive"}, "demand": "High", "top_companies": [], "trending_skills": [], "career_outlook": "Positive", "market_insights": ["Market data temporarily unavailable — please refresh."]},
        "priority_learning_plan": {"phases": {}, "total_weeks": 0, "total_hours": 0, "total_estimated_score_gain": 0},
        "role_info": {"detected_role": target_role or "Software Developer", "detected_level": "Mid"},
        "score_improvement": {"current_score": score_data.get("overall_score", 65), "potential_score": score_data.get("overall_score", 65), "total_gain": 0},
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }

