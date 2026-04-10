from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class ComponentCreate(BaseModel):
    id: str = Field(..., min_length=1, max_length=100)
    slug: str = Field(..., min_length=1, max_length=255)
    name: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)
    category: str = Field(..., min_length=1, max_length=100)
    framework: Optional[List[str]] = []
    component_code: Optional[str] = None
    css_code: Optional[str] = None
    usage_code: Optional[str] = None
    install_cmd: Optional[Dict[str, Any]] = {}
    preview_image: Optional[str] = None


class ComponentUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    framework: Optional[List[str]] = None
    component_code: Optional[str] = None
    css_code: Optional[str] = None
    usage_code: Optional[str] = None
    install_cmd: Optional[Dict[str, Any]] = None
    preview_image: Optional[str] = None


class ComponentResponse(BaseModel):
    id: str
    slug: str
    name: str
    description: str
    category: str
    framework: List[str]
    component_code: Optional[str]
    css_code: Optional[str]
    usage_code: Optional[str]
    install_cmd: Dict[str, Any]
    preview_image: Optional[str]
    status: str
    user_id: Optional[int]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ComponentDetailResponse(ComponentResponse):
    votes_count: int = 0
