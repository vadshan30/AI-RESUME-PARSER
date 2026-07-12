from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy.exc import SQLAlchemyError
import logging
import traceback
from typing import Dict, Any
from datetime import datetime

logger = logging.getLogger(__name__)

class ErrorResponse:
    """Standard error response format"""
    
    def __init__(
        self,
        status_code: int,
        message: str,
        error_type: str,
        details: Any = None,
        trace_id: str = None,
        timestamp: str = None
    ):
        self.status_code = status_code
        self.message = message
        self.error_type = error_type
        self.details = details
        self.trace_id = trace_id
        self.timestamp = timestamp or datetime.utcnow().isoformat()
    
    def to_dict(self) -> Dict[str, Any]:
        response = {
            "error": {
                "status": self.status_code,
                "message": self.message,
                "type": self.error_type,
                "timestamp": self.timestamp,
            }
        }
        if self.details:
            response["error"]["details"] = self.details
        if self.trace_id:
            response["error"]["trace_id"] = self.trace_id
        return response

class ErrorHandlerMiddleware:
    """Middleware for handling all errors in the application"""
    
    def __init__(self, app: FastAPI):
        self.app = app
        self.setup_handlers(app)
    
    def setup_handlers(self, app: FastAPI):
        @app.exception_handler(StarletteHTTPException)
        async def http_exception_handler(request: Request, exc: StarletteHTTPException):
            logger.error(f"HTTP Exception: {exc.detail}")
            return JSONResponse(
                status_code=exc.status_code,
                content=ErrorResponse(
                    status_code=exc.status_code,
                    message=str(exc.detail),
                    error_type="http_exception",
                    trace_id=request.headers.get("X-Request-ID"),
                ).to_dict(),
            )
        
        @app.exception_handler(RequestValidationError)
        async def validation_exception_handler(request: Request, exc: RequestValidationError):
            errors = [{"field": "->".join(str(l) for l in e.get("loc", [])), "message": e.get("msg")} for e in exc.errors()]
            logger.error(f"Validation Error: {errors}")
            return JSONResponse(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                content=ErrorResponse(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    message="Validation error",
                    error_type="validation_error",
                    details=errors,
                    trace_id=request.headers.get("X-Request-ID"),
                ).to_dict(),
            )
        
        @app.exception_handler(SQLAlchemyError)
        async def database_exception_handler(request: Request, exc: SQLAlchemyError):
            logger.error(f"Database Error: {str(exc)}")
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content=ErrorResponse(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    message="Internal server error",
                    error_type="database_error",
                    trace_id=request.headers.get("X-Request-ID"),
                ).to_dict(),
            )
        
        @app.exception_handler(Exception)
        async def general_exception_handler(request: Request, exc: Exception):
            logger.error(f"Unhandled Exception: {str(exc)}")
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content=ErrorResponse(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    message="Internal server error",
                    error_type="unhandled_exception",
                    trace_id=request.headers.get("X-Request-ID"),
                ).to_dict(),
            )

async def request_id_middleware(request: Request, call_next):
    import uuid
    request_id = request.headers.get("X-Request-ID")
    if not request_id:
        request_id = str(uuid.uuid4())
        request.scope["headers"].append((b"x-request-id", request_id.encode()))
    
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response

def setup_app(app: FastAPI):
    app.middleware("http")(request_id_middleware)
    ErrorHandlerMiddleware(app)
    logger.info("Application middleware and error handlers configured")
    return app
