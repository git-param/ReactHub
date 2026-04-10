from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from utils.constants import MIN_PASSWORD_LENGTH


class UserBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(..., min_length=MIN_PASSWORD_LENGTH)


class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    avatar: Optional[str] = None


class UserResponse(UserBase):
    id: int
    role: str
    avatar: Optional[str] = None
    is_active: bool
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserDetailResponse(UserResponse):
    pass
