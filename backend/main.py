from fastapi import FastAPI
from app.api import auth, projects, subscriptions, webhook, admin, user
from app.core.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ Create tables
Base.metadata.create_all(bind=engine)

# ✅ Routers
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(subscriptions.router)
app.include_router(webhook.router, prefix="/stripe", tags=["Webhooks"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(user.router, prefix="/user", tags=["User"])  # ✅ only once

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)