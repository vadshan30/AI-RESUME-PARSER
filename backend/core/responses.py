from typing import Generic, TypeVar, Optional, List, Any
from pydantic import BaseModel, Field

T = TypeVar('T')

class ResponseMeta(BaseModel):
    execution_time_ms: float
    debug_id: Optional[str] = None
    cached: bool = False

class StandardResponse(BaseModel, Generic[T]):
    success: bool
    data: Optional[T] = None
    warnings: List[str] = Field(default_factory=list)
    error: Optional[str] = None
    meta: Optional[ResponseMeta] = None

def success_response(data: Any, execution_time_ms: float = 0.0, cached: bool = False, warnings: List[str] = None, debug_id: str = None) -> StandardResponse:
    return StandardResponse(
        success=True,
        data=data,
        warnings=warnings or [],
        meta=ResponseMeta(execution_time_ms=execution_time_ms, cached=cached, debug_id=debug_id)
    )

def error_response(message: str, execution_time_ms: float = 0.0, debug_id: str = None) -> StandardResponse:
    return StandardResponse(
        success=False,
        error=message,
        meta=ResponseMeta(execution_time_ms=execution_time_ms, debug_id=debug_id)
    )
