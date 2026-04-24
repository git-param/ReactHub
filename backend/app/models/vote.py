from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint, Index
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Vote(Base):
    __tablename__ = "votes"
    __table_args__ = (
        UniqueConstraint("component_id", "user_id", name="uq_vote_component_user"),
        Index('idx_component_user', 'component_id', 'user_id'),
    )
    
    id = Column(Integer, primary_key=True, index=True)
    component_id = Column(String(100), ForeignKey("components.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    component = relationship("Component", back_populates="votes")
    user = relationship("User", back_populates="votes")
