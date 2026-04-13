from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.subscription import Subscription

# ❗ NO prefix here (important)
router = APIRouter(tags=["Admin"])


# ✅ ADMIN CHECK
def require_admin(user=Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return user


# ✅ GET ALL USERS
@router.get("/users")
def get_all_users(
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    users = db.query(User).all()

    return [
        {
            "id": u.id,
            "email": u.email,
            "role": u.role
        }
        for u in users
    ]


# ✅ GET ALL SUBSCRIPTIONS
@router.get("/subscriptions")
def get_all_subscriptions(
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    subs = db.query(Subscription).all()

    return [
        {
            "id": s.id,
            "user_id": s.user_id,
            "plan": s.plan,
            "status": s.status
        }
        for s in subs
    ]


# ✅ USER + SUBSCRIPTION MAPPING
@router.get("/user-subscriptions")
def user_subscriptions(
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    data = db.query(User, Subscription).join(
        Subscription, User.id == Subscription.user_id
    ).all()

    return [
        {
            "email": user.email,
            "plan": sub.plan,
            "status": sub.status
        }
        for user, sub in data
    ]


# ✅ STATS
@router.get("/stats")
def subscription_stats(
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    active = db.query(Subscription).filter(
        Subscription.status == "active"
    ).count()

    canceled = db.query(Subscription).filter(
        Subscription.status == "canceled"
    ).count()

    past_due = db.query(Subscription).filter(
        Subscription.status == "past_due"
    ).count()

    return {
        "active": active,
        "canceled": canceled,
        "past_due": past_due
    }
@router.get("/advanced-stats")
def advanced_stats(db: Session = Depends(get_db), admin=Depends(require_admin)):
    total_users = db.query(User).count()

    free_users = db.query(User).outerjoin(Subscription).filter(
        (Subscription.plan == None) | (Subscription.plan == "free")
    ).count()

    pro_users = db.query(Subscription).filter(
        Subscription.plan == "pro",
        Subscription.status == "active"
    ).count()

    return {
        "total_users": total_users,
        "free_users": free_users,
        "pro_users": pro_users
    }


@router.post("/cancel/{user_id}")
def cancel_subscription(user_id: int, db: Session = Depends(get_db), admin=Depends(require_admin)):
    sub = db.query(Subscription).filter(Subscription.user_id == user_id).first()

    if not sub:
        raise HTTPException(status_code=404, detail="No subscription found")

    sub.status = "canceled"
    db.commit()

    return {"message": "Subscription canceled"}