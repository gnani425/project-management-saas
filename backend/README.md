# Project Management SaaS 

##  Overview

This is a full-stack SaaS application for managing users, subscriptions, and projects.

---

##  Tech Stack

### Frontend

* React (Vite)
* Axios

### Backend

* FastAPI
* SQLAlchemy
* SQLite / PostgreSQL

---

## Features

*  User Authentication
*  Profile Management
*  Subscription Handling (Stripe)
*  JWT Authorization

---

##  Project Structure

```
project-management-saas/
│
├── backend/
├── frontend/
```

---

##  Setup Instructions

### 1. Clone the repo

```
git clone https://github.com/gnani425/project-management-saas.git
cd project-management-saas
```

---

### 2. Backend setup

```
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

---

### 3. Frontend setup

```
cd frontend
npm install
npm run dev
```

---

##  Environment Variables

Create `.env` in backend:

```
STRIPE_SECRET_KEY=your_key_here
```

---

## Notes

* `.env` is ignored using `.gitignore`
* Sensitive keys are not pushed to GitHub

---

## Author

Gnaneshwari Karupothula
