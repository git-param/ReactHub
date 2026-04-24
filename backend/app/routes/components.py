from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.component import Component
from app.models.user import User
from app.schemas.component import ComponentCreate, ComponentResponse, ComponentUpdate
from app.dependencies import get_current_user
from app.services.component_service import ComponentService
from app.utils.constants import COMPONENT_STATUS_PUBLISHED, USER_ROLE_ADMIN
from datetime import datetime
import re

router = APIRouter()


def _slugify(name: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return slug or "component"


def _to_component_response(component: Component) -> ComponentResponse:
    component_code = ComponentService.read_component_file(
        component.category,
        component.component_code_path,
        "Component.tsx"
    ) or ""

    css_code = ComponentService.read_component_file(
        component.category,
        component.component_code_path,
        "Component.css"
    ) or ""

    return ComponentResponse(
        id=component.id,
        slug=component.slug,
        name=component.name,
        description=component.description,
        category=component.category,
        component_code_path=component.component_code_path,
        component_code=component_code,
        css_code=css_code,
        status=component.status,
        user_id=component.user_id,
        created_at=component.created_at,
        updated_at=component.updated_at,
    )


@router.post("/", response_model=ComponentResponse, status_code=status.HTTP_201_CREATED)
def create_component(
    component_data: ComponentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new component (admin only).
    Automatically creates folder structure and files in frontend.
    Only metadata is stored in database.
    """
    if current_user.role != USER_ROLE_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can create components"
        )
    
    try:
        # Create component folder in frontend
        component_uuid, folder_path = ComponentService.create_component_folder(
            component_data.category,
            component_data.name
        )
        
        # Create component files
        files_created = ComponentService.create_component_files(
            folder_path,
            component_data.name,
            component_data.component_code,
            component_data.css_code
        )
        
        if not files_created:
            raise Exception("Failed to create component files")
        
        # Generate a unique ID for the component
        component_id = f"{component_data.category}-{component_uuid}"
        
        # Save to database (only metadata)
        slug_base = component_data.slug or _slugify(component_data.name)
        new_component = Component(
            id=component_id,
            name=component_data.name,
            slug=f"{slug_base}-{component_uuid[:6]}",
            description=component_data.description,
            category=component_data.category,
            component_code_path=component_uuid,
            status=COMPONENT_STATUS_PUBLISHED,
            user_id=current_user.id,
            created_at=datetime.utcnow()
        )
        
        db.add(new_component)
        db.commit()
        db.refresh(new_component)

        return _to_component_response(new_component)
    
    except Exception as e:
        db.rollback()
        print(f"Error creating component: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create component: {str(e)}"
        )


@router.get("/browse/all", response_model=List[ComponentResponse])
def browse_all_components(
    db: Session = Depends(get_db)
):
    """
    Browse all published components from database with code from filesystem.
    Returns components with their code and css read from files.
    """
    try:
        # Get all published components from database
        db_components = db.query(Component).filter(
            Component.status == COMPONENT_STATUS_PUBLISHED
        ).all()
        
        return [_to_component_response(component) for component in db_components]
    
    except Exception as e:
        print(f"Error browsing components: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to browse components: {str(e)}"
        )


@router.get("/", response_model=List[ComponentResponse])
def get_components(
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get all published components, optionally filtered by category.
    """
    query = db.query(Component).filter(Component.status == COMPONENT_STATUS_PUBLISHED)
    
    if category:
        query = query.filter(Component.category == category)
    
    components = query.order_by(Component.created_at.desc()).offset(skip).limit(limit).all()
    return [_to_component_response(component) for component in components]


@router.get("/{component_id}", response_model=ComponentResponse)
def get_component(
    component_id: str,
    db: Session = Depends(get_db)
):
    """
    Get a specific component by ID.
    """
    component = db.query(Component).filter(Component.id == component_id).first()
    
    if not component:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Component not found"
        )
    
    return _to_component_response(component)


@router.put("/{component_id}", response_model=ComponentResponse)
def update_component(
    component_id: str,
    component_data: ComponentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update component details and files (admin only).
    """
    if current_user.role != USER_ROLE_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can update components"
        )
    
    component = db.query(Component).filter(Component.id == component_id).first()
    
    if not component:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Component not found"
        )
    
    try:
        # Update files if provided
        if component_data.component_code or component_data.css_code:
            ComponentService.update_component_files(
                component.category,
                component.component_code_path,
                component_data.component_code,
                component_data.css_code
            )
        
        # Update database fields
        if component_data.name:
            component.name = component_data.name
        if component_data.description:
            component.description = component_data.description
        component.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(component)

        return _to_component_response(component)
    
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update component: {str(e)}"
        )


@router.delete("/{component_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_component(
    component_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a component and its files (admin only).
    """
    if current_user.role != USER_ROLE_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can delete components"
        )
    
    component = db.query(Component).filter(Component.id == component_id).first()
    
    if not component:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Component not found"
        )
    
    try:
        # Delete files from frontend
        ComponentService.delete_component_folder(
            component.category,
            component.component_code_path
        )
        
        # Delete from database
        db.delete(component)
        db.commit()
        
        return None
    
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete component: {str(e)}"
        )
