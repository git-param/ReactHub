from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
from app.database import Base
from app.utils.constants import COMPONENT_STATUS_DRAFT


class Component(Base):
    __tablename__ = "components"
    
    id = Column(String(100), primary_key=True, index=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False, index=True)
    component_code_path = Column(String(255), nullable=False)
    status = Column(String(50), default=COMPONENT_STATUS_DRAFT, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    author = relationship("User", back_populates="components")
    comments = relationship("Comment", back_populates="component", cascade="all, delete-orphan")
    votes = relationship("Vote", back_populates="component", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('idx_slug_status', 'slug', 'status'),
        Index('idx_category_status', 'category', 'status'),
        Index('idx_user_id_status', 'user_id', 'status'),
    )
