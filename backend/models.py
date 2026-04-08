from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey, Text, Boolean, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum


class UserRole(str, enum.Enum):
    admin = "admin"
    instructor = "instructor"
    student = "student"


class CourseStatus(str, enum.Enum):
    draft = "draft"
    published = "published"
    archived = "archived"


class EnrollmentStatus(str, enum.Enum):
    active = "active"
    completed = "completed"
    dropped = "dropped"


class ProgressStatus(str, enum.Enum):
    not_started = "not_started"
    in_progress = "in_progress"
    completed = "completed"


# ─── Users ───────────────────────────────────────────────
class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone_number = Column(String(20))
    avatar_url = Column(String(500))
    role = Column(Enum(UserRole), default=UserRole.student)
    status = Column(String(50), default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    enrollments = relationship("Enrollment", back_populates="student")
    taught_courses = relationship("Course", back_populates="instructor")


# ─── Courses ─────────────────────────────────────────────
class Course(Base):
    __tablename__ = "courses"

    course_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    short_description = Column(String(500))
    thumbnail_url = Column(String(500))
    status = Column(Enum(CourseStatus), default=CourseStatus.draft)
    instructor_id = Column(Integer, ForeignKey("users.user_id"))
    duration_weeks = Column(Integer, default=0)
    difficulty_level = Column(String(50), default="beginner")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    instructor = relationship("User", back_populates="taught_courses")
    chapters = relationship("Chapter", back_populates="course", order_by="Chapter.order")
    enrollments = relationship("Enrollment", back_populates="course")


# ─── Chapters ────────────────────────────────────────────
class Chapter(Base):
    __tablename__ = "chapters"

    chapter_id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.course_id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    course = relationship("Course", back_populates="chapters")
    lessons = relationship("Lesson", back_populates="chapter", order_by="Lesson.order")


# ─── Lessons ─────────────────────────────────────────────
class Lesson(Base):
    __tablename__ = "lessons"

    lesson_id = Column(Integer, primary_key=True, index=True)
    chapter_id = Column(Integer, ForeignKey("chapters.chapter_id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    content_type = Column(String(50), default="document")  # video, document, quiz
    content_url = Column(String(500))
    duration_minutes = Column(Integer, default=0)
    order = Column(Integer, default=0)
    is_free = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    chapter = relationship("Chapter", back_populates="lessons")
    progress = relationship("StudentProgress", back_populates="lesson")


# ─── Enrollments ─────────────────────────────────────────
class Enrollment(Base):
    __tablename__ = "enrollments"

    enrollment_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.course_id"), nullable=False)
    status = Column(Enum(EnrollmentStatus), default=EnrollmentStatus.active)
    enrolled_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))

    # Relationships
    student = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")


# ─── Student Progress ───────────────────────────────────
class StudentProgress(Base):
    __tablename__ = "student_progress"

    progress_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.lesson_id"), nullable=False)
    status = Column(Enum(ProgressStatus), default=ProgressStatus.not_started)
    time_spent_seconds = Column(Integer, default=0)
    score = Column(Float)
    completed_at = Column(DateTime(timezone=True))
    last_accessed = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    lesson = relationship("Lesson", back_populates="progress")
