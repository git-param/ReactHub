from sqlalchemy import Column, Integer, String, Boolean, DateTime, Index
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
from app.utils.constants import USER_ROLE_USER


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default=USER_ROLE_USER, nullable=False)
    avatar = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    components = relationship("Component", back_populates="author", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="author", cascade="all, delete-orphan")
    votes = relationship("Vote", back_populates="user", cascade="all, delete-orphan")
    feedback = relationship("Feedback", back_populates="user", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('idx_email_created', 'email', 'created_at'),
    )
