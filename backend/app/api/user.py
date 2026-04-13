from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.subscription import Subscription

router = APIRouter(tags=["User"])

@router.get("/profile")
def get_profile(user=Depends(get_current_user), db: Session = Depends(get_db)):
    sub = db.query(Subscription).filter(
        Subscription.user_id == user.id,
        Subscription.status == "active"
    ).first()

    return {
        "email": user.email,
        "subscription": {
            "plan": sub.plan if sub else "free",
            "status": sub.status if sub else "inactive"
        }
    }