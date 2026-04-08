import os
from dotenv import load_dotenv

load_dotenv()

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "lms-super-secret-key-change-in-production-2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Database
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./lms.db")

# CORS
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
