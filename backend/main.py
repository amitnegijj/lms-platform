from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import database
import models
from routers import auth, courses, users
import config

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="LMS Platform API",
    description="Learning Management System — REST API",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        config.FRONTEND_URL,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(users.router)


@app.get("/")
def read_root():
    return {"message": "Welcome to LMS Platform API", "docs": "/docs"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
