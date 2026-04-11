from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ComponentCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)
    category: str = Field(..., min_length=1, max_length=100)
    component_code: str = Field(..., min_length=1)
    css_code: str = ""
    slug: Optional[str] = Field(None, max_length=255)


class ComponentUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    component_code: Optional[str] = None
    css_code: Optional[str] = None


class ComponentResponse(BaseModel):
    id: str
    slug: str
    name: str
    description: str
    category: str
    component_code_path: str
    component_code: Optional[str]
    css_code: Optional[str]
    status: str
    user_id: Optional[int]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ComponentDetailResponse(ComponentResponse):
    votes_count: int = 0
