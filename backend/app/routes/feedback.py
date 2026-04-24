from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.feedback import Feedback
from app.models.user import User
from app.schemas.feedback import FeedbackCreate, FeedbackResponse, FeedbackStatusUpdate
from app.dependencies import get_current_user
from app.utils.constants import FEEDBACK_STATUS_NEW
from datetime import datetime

router = APIRouter()


@router.post("/", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
def create_feedback(
    feedback_data: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new feedback submission.
    User must be authenticated.
    """
    new_feedback = Feedback(
        user_id=current_user.id,
        subject=feedback_data.subject,
        message=feedback_data.message,
        rating=feedback_data.rating,
        category=feedback_data.category,
        status=FEEDBACK_STATUS_NEW,
        created_at=datetime.utcnow()
    )
    
    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)
    
    return new_feedback


@router.get("/", response_model=List[FeedbackResponse])
def get_feedbacks(
    skip: int = 0,
    limit: int = 100,
    status_filter: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all feedbacks for the authenticated user.
    Admins can see all feedbacks.
    """
    query = db.query(Feedback)
    
    # If user is not admin, only show their own feedbacks
    if current_user.role != "admin":
        query = query.filter(Feedback.user_id == current_user.id)
    
    # Filter by status if provided
    if status_filter:
        query = query.filter(Feedback.status == status_filter)
    
    feedbacks = query.order_by(Feedback.created_at.desc()).offset(skip).limit(limit).all()
    
    return feedbacks


@router.get("/{feedback_id}", response_model=FeedbackResponse)
def get_feedback(
    feedback_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific feedback by ID.
    Users can only view their own feedbacks (admins can view all).
    """
    feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    
    if not feedback:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feedback not found"
        )
    
    # Check authorization
    if current_user.role != "admin" and feedback.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this feedback"
        )
    
    return feedback


@router.put("/{feedback_id}", response_model=FeedbackResponse)
def update_feedback_status(
    feedback_id: int,
    status_update: FeedbackStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update feedback status (admin only).
    Only admins can update feedback status.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can update feedback"
        )
    
    feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    
    if not feedback:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feedback not found"
        )
    
    feedback.status = status_update.status
    feedback.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(feedback)
    
    return feedback


@router.delete("/{feedback_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_feedback(
    feedback_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a feedback (users can delete their own, admins can delete any).
    """
    feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    
    if not feedback:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feedback not found"
        )
    
    # Check authorization
    if current_user.role != "admin" and feedback.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this feedback"
        )
    
    db.delete(feedback)
    db.commit()
    
    return None
