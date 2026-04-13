from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm   

from app.services.auth_service import register_user, login_user
from app.schemas.user import UserCreate
from app.core.database import get_db

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    return register_user( db,user.role, user.email, user.password)


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user_data = {
        "email": form_data.username,
        "password": form_data.password
    }
    return login_user(db, user_data)