import logging
import json
import time
from uuid import uuid4
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

# Configure standard python logger
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("ai_resume_parser")

class StructuredLogger:
    @staticmethod
    def get_logger(name: str):
        return logging.getLogger(name)
    
    @staticmethod
    def log_api_request(endpoint: str, resume_id: int, execution_time: float, success: bool, error: str = None):
        log_data = {
            "event": "api_request",
            "endpoint": endpoint,
            "resume_id": resume_id,
            "execution_time_ms": round(execution_time * 1000, 2),
            "success": success
        }
        if error:
            log_data["error"] = error
            logger.error(json.dumps(log_data))
        else:
            logger.info(json.dumps(log_data))

    @staticmethod
    def log_ai_interaction(model: str, prompt_length: int, response_length: int, execution_time: float, success: bool, error: str = None):
        log_data = {
            "event": "ai_interaction",
            "model": model,
            "prompt_chars": prompt_length,
            "response_chars": response_length,
            "execution_time_ms": round(execution_time * 1000, 2),
            "success": success
        }
        if error:
            log_data["error"] = error
            logger.error(json.dumps(log_data))
        else:
            logger.info(json.dumps(log_data))

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = str(uuid4())
        start_time = time.time()
        
        # Attach request_id to request state
        request.state.request_id = request_id
        
        try:
            response = await call_next(request)
            execution_time = time.time() - start_time
            logger.info(json.dumps({
                "event": "http_request",
                "request_id": request_id,
                "method": request.method,
                "url": str(request.url.path),
                "status_code": response.status_code,
                "execution_time_ms": round(execution_time * 1000, 2)
            }))
            return response
        except Exception as e:
            execution_time = time.time() - start_time
            logger.error(json.dumps({
                "event": "http_request_error",
                "request_id": request_id,
                "method": request.method,
                "url": str(request.url.path),
                "error": str(e),
                "execution_time_ms": round(execution_time * 1000, 2)
            }))
            raise
