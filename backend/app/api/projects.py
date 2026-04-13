from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.project import ProjectCreate
from app.services.project_service import (
    create_project,
    get_projects,
    get_project,
    update_project,
    delete_project
)
from app.core.database import get_db
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/projects", tags=["Projects"])


# ✅ CREATE PROJECT
@router.post("/")
def create(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return create_project(db, project, user.id)


# ✅ GET ALL PROJECTS
@router.get("/")
def get_all(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return get_projects(db, user.id)


# ✅ GET SINGLE PROJECT
@router.get("/{project_id}")
def get_one(
    project_id: int,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    project = get_project(db, project_id, user.id)

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return project


# ✅ UPDATE PROJECT
@router.put("/{project_id}")
def update(
    project_id: int,
    data: ProjectCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    project = update_project(db, project_id, data, user.id)

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return project


# ✅ DELETE PROJECT
@router.delete("/{project_id}")
def delete(
    project_id: int,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    result = delete_project(db, project_id, user.id)

    if not result:
        raise HTTPException(status_code=404, detail="Project not found")

    return {"message": "Project deleted successfully"}