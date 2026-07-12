import os
from typing import List, Optional
from pydantic import BaseSettings

class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Application
    APP_NAME: str = "Resume Parser API"
    APP_ENV: str = "development"
    APP_DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost/db"
    
    # JWT
    JWT_SECRET_KEY: str = "secret"
    JWT_ALGORITHM: str = "HS256"
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174,https://ai-resume-parser-1-5eb7.onrender.com"
    CORS_ALLOW_CREDENTIALS: bool = True
    
    # AI Services
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-2.5-pro"
    AI_TIMEOUT: int = 90
    MAX_RETRIES: int = 2
    DEBUG_AI: bool = True

    
    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

_settings: Optional[Settings] = None

def get_settings() -> Settings:
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings