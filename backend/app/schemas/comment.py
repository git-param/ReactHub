from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class CommentCreate(BaseModel):
    text: str = Field(..., min_length=1)


class CommentUpdate(BaseModel):
    text: Optional[str] = Field(None, min_length=1)


class CommentAuthor(BaseModel):
    id: int
    name: str
    avatar: Optional[str] = None
    
    class Config:
        from_attributes = True


class CommentResponse(BaseModel):
    id: int
    component_id: str
    user_id: int
    text: str
    created_at: datetime
    updated_at: datetime
    author: Optional[CommentAuthor] = None
    
    class Config:
        from_attributes = True


class CommentListResponse(BaseModel):
    data: list[CommentResponse]
    total: int
    skip: int
    limit: int
