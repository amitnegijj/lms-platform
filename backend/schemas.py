from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models import UserRole, CourseStatus, EnrollmentStatus, ProgressStatus


# ─── Auth Schemas ────────────────────────────────────────
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    phone_number: Optional[str] = None
    role: Optional[UserRole] = UserRole.student


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefresh(BaseModel):
    refresh_token: str


# ─── User Schemas ────────────────────────────────────────
class UserOut(BaseModel):
    user_id: int
    email: str
    first_name: str
    last_name: str
    phone_number: Optional[str] = None
    avatar_url: Optional[str] = None
    role: UserRole
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    avatar_url: Optional[str] = None


# ─── Lesson Schemas ──────────────────────────────────────
class LessonCreate(BaseModel):
    title: str
    description: Optional[str] = None
    content_type: str = "document"
    content_url: Optional[str] = None
    duration_minutes: int = 0
    order: int = 0
    is_free: bool = False


class LessonOut(BaseModel):
    lesson_id: int
    chapter_id: int
    title: str
    description: Optional[str] = None
    content_type: str
    content_url: Optional[str] = None
    duration_minutes: int
    order: int
    is_free: bool

    class Config:
        from_attributes = True


# ─── Chapter Schemas ─────────────────────────────────────
class ChapterCreate(BaseModel):
    title: str
    description: Optional[str] = None
    order: int = 0


class ChapterOut(BaseModel):
    chapter_id: int
    course_id: int
    title: str
    description: Optional[str] = None
    order: int
    lessons: List[LessonOut] = []

    class Config:
        from_attributes = True


# ─── Course Schemas ──────────────────────────────────────
class CourseCreate(BaseModel):
    title: str
    description: Optional[str] = None
    short_description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    duration_weeks: int = 0
    difficulty_level: str = "beginner"


class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    status: Optional[CourseStatus] = None
    duration_weeks: Optional[int] = None
    difficulty_level: Optional[str] = None


class CourseOut(BaseModel):
    course_id: int
    title: str
    description: Optional[str] = None
    short_description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    status: CourseStatus
    instructor_id: Optional[int] = None
    duration_weeks: int
    difficulty_level: str
    created_at: Optional[datetime] = None
    chapters: List[ChapterOut] = []
    instructor: Optional[UserOut] = None
    enrollment_count: Optional[int] = None

    class Config:
        from_attributes = True


class CourseListOut(BaseModel):
    course_id: int
    title: str
    short_description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    status: CourseStatus
    difficulty_level: str
    duration_weeks: int
    instructor: Optional[UserOut] = None
    enrollment_count: int = 0

    class Config:
        from_attributes = True


# ─── Enrollment Schemas ──────────────────────────────────
class EnrollmentCreate(BaseModel):
    course_id: int


class EnrollmentOut(BaseModel):
    enrollment_id: int
    user_id: int
    course_id: int
    status: EnrollmentStatus
    enrolled_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    course: Optional[CourseListOut] = None

    class Config:
        from_attributes = True


# ─── Progress Schemas ────────────────────────────────────
class ProgressUpdate(BaseModel):
    status: Optional[ProgressStatus] = None
    time_spent_seconds: Optional[int] = None
    score: Optional[float] = None


class ProgressOut(BaseModel):
    progress_id: int
    user_id: int
    lesson_id: int
    status: ProgressStatus
    time_spent_seconds: int
    score: Optional[float] = None
    completed_at: Optional[datetime] = None
    last_accessed: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── Dashboard Schemas ───────────────────────────────────
class DashboardStats(BaseModel):
    total_courses_enrolled: int = 0
    completed_courses: int = 0
    in_progress_courses: int = 0
    total_lessons_completed: int = 0
    total_time_spent_hours: float = 0.0
    overall_progress_percent: float = 0.0
