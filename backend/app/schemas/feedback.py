from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class FeedbackCreate(BaseModel):
    subject: str = Field(..., min_length=1, max_length=255)
    message: str = Field(..., min_length=1)
    category: Optional[str] = None


class FeedbackStatusUpdate(BaseModel):
    status: str = Field(..., min_length=1)


class FeedbackResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    subject: str
    message: str
    category: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
