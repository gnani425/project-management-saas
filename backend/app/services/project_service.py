from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.project import Project
from app.models.subscription import Subscription


def get_project_limit(plan: str):
    if plan == "free":
        return 3
    elif plan == "pro":
        return 10
    elif plan == "enterprise":
        return 100
    return 3


def check_project_limit(db: Session, user_id: int):
    sub = db.query(Subscription).filter(
        Subscription.user_id == user_id
    ).first()

    if not sub:
        raise HTTPException(
            status_code=400,
            detail="No subscription found"
        )

    count = db.query(Project).filter(
        Project.owner_id == user_id
    ).count()

    limit = get_project_limit(sub.plan)

    if count >= limit:
        raise HTTPException(
            status_code=400,
            detail=f"Project limit reached ({limit})"
        )


def create_project(db: Session, project, user_id: int):
    check_project_limit(db, user_id)

    new_project = Project(
        name=project.name,
        description=project.description,
        owner_id=user_id
    )

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return new_project


def get_projects(db: Session, user_id: int):
    return db.query(Project).filter(
        Project.owner_id == user_id
    ).all()


def update_project(db: Session, project_id: int, data, user_id: int):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.owner_id == user_id
    ).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    for key, value in data.dict().items():
        setattr(project, key, value)

    db.commit()
    db.refresh(project)

    return project


def delete_project(db: Session, project_id: int, user_id: int):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.owner_id == user_id
    ).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    db.delete(project)
    db.commit()

    return {"message": "Project deleted"}

def get_project(db, project_id: int, user_id: int):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.owner_id == user_id
    ).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return project