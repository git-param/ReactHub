from pydantic_settings import BaseSettings
from functools import lru_cache
import os


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://reacthub_user:secure_password@localhost:5432/reacthub_db"
    SQLALCHEMY_ECHO: bool = True
    
    # JWT
    SECRET_KEY: str = "your-super-secret-key-change-this-in-production-min-32-chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    FRONTEND_URL: str = "http://localhost:5173"
    BACKEND_URL: str = "http://localhost:8000"
    
    # App
    DEBUG: bool = True
    ENVIRONMENT: str = "development"
    PROJECT_NAME: str = "ReactHub API"
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "allow"  # Allow extra fields from .env


@lru_cache()
def get_settings():
    return Settings()
