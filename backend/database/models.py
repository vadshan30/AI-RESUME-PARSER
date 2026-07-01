from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(150), unique=True, index=True)
    password_hash = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    resumes = relationship("Resume", back_populates="owner", cascade="all, delete-orphan")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    resume_name = Column(String(255))
    ats_score = Column(Integer)
    resume_score = Column(Integer)
    category = Column(String(100))
    confidence = Column(Integer)
    upload_date = Column(DateTime, default=datetime.utcnow)

    # Relationships
    owner = relationship("User", back_populates="resumes")
    analysis = relationship("ResumeAnalysis", back_populates="resume", uselist=False, cascade="all, delete-orphan")


class ResumeAnalysis(Base):
    __tablename__ = "resume_analysis"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), unique=True)
    
    # Using JSON type to efficiently store the arrays and objects
    skills = Column(JSON)
    soft_skills = Column(JSON)
    projects = Column(JSON)
    experience = Column(JSON)
    education = Column(JSON)
    
    missing_skills = Column(JSON)
    recommended_jobs = Column(JSON)
    learning_recommendations = Column(JSON)
    ats_recommendations = Column(JSON)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    resume = relationship("Resume", back_populates="analysis")
