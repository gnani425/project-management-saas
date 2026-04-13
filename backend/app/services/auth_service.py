from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user import User
from app.models.subscription import Subscription
from app.core.security import hash_password, verify_password, create_access_token


# 🔐 REGISTER USER
def register_user(db: Session, role: str, email: str, password: str):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create new user
    new_user = User(
        email=email,
        password=hash_password(password),
        role=role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # ✅ Create default subscription (FREE PLAN)
    new_subscription = Subscription(
        user_id=new_user.id,
        plan="free",
        status="active"
    )

    db.add(new_subscription)
    db.commit()

    return {
        "message": "User registered successfully",
        "email": new_user.email,
        "role": new_user.role
    }


# 🔑 LOGIN USER
def login_user(db: Session, user):
    db_user = db.query(User).filter(User.email == user["email"]).first()

    # Validate credentials
    if not db_user or not verify_password(user["password"], db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create JWT token
    token = create_access_token({"user_id": db_user.id})

    # ✅ RETURN ROLE (CRITICAL FIX)
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": db_user.role
    }