from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base
from utils.constants import FEEDBACK_STATUS_NEW


class Feedback(Base):
    __tablename__ = "feedback"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    subject = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    category = Column(String(100))
    status = Column(String(50), default=FEEDBACK_STATUS_NEW, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="feedback")
    
    __table_args__ = (
        Index('idx_user_status_created', 'user_id', 'status', 'created_at'),
    )
