from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func as sql_func
from typing import List
from database import get_db
from models import Course, Chapter, Lesson, Enrollment, User, UserRole, CourseStatus, EnrollmentStatus
from schemas import (
    CourseCreate, CourseUpdate, CourseOut, CourseListOut,
    ChapterCreate, ChapterOut,
    LessonCreate, LessonOut,
    EnrollmentCreate, EnrollmentOut,
)
from auth import get_current_user, require_role

router = APIRouter(prefix="/api/courses", tags=["Courses"])


# ─── Course CRUD ─────────────────────────────────────────
@router.get("/", response_model=List[CourseListOut])
def list_courses(
    status_filter: str = None,
    db: Session = Depends(get_db),
):
    query = db.query(Course).options(joinedload(Course.instructor))
    if status_filter:
        query = query.filter(Course.status == status_filter)
    else:
        query = query.filter(Course.status == CourseStatus.published)

    courses = query.order_by(Course.created_at.desc()).all()
    result = []
    for course in courses:
        enrollment_count = db.query(Enrollment).filter(
            Enrollment.course_id == course.course_id,
            Enrollment.status == EnrollmentStatus.active,
        ).count()
        course_data = CourseListOut.model_validate(course)
        course_data.enrollment_count = enrollment_count
        result.append(course_data)
    return result


@router.get("/{course_id}", response_model=CourseOut)
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = (
        db.query(Course)
        .options(
            joinedload(Course.instructor),
            joinedload(Course.chapters).joinedload(Chapter.lessons),
        )
        .filter(Course.course_id == course_id)
        .first()
    )
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    enrollment_count = db.query(Enrollment).filter(
        Enrollment.course_id == course_id,
        Enrollment.status == EnrollmentStatus.active,
    ).count()
    course_data = CourseOut.model_validate(course)
    course_data.enrollment_count = enrollment_count
    return course_data


@router.post("/", response_model=CourseOut, status_code=status.HTTP_201_CREATED)
def create_course(
    payload: CourseCreate,
    current_user: User = Depends(require_role(UserRole.admin, UserRole.instructor)),
    db: Session = Depends(get_db),
):
    course = Course(
        **payload.model_dump(),
        instructor_id=current_user.user_id,
    )
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


@router.put("/{course_id}", response_model=CourseOut)
def update_course(
    course_id: int,
    payload: CourseUpdate,
    current_user: User = Depends(require_role(UserRole.admin, UserRole.instructor)),
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.course_id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    if current_user.role != UserRole.admin and course.instructor_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(course, key, value)
    db.commit()
    db.refresh(course)
    return course


@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course(
    course_id: int,
    current_user: User = Depends(require_role(UserRole.admin)),
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.course_id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(course)
    db.commit()


# ─── Chapters ────────────────────────────────────────────
@router.post("/{course_id}/chapters", response_model=ChapterOut, status_code=status.HTTP_201_CREATED)
def create_chapter(
    course_id: int,
    payload: ChapterCreate,
    current_user: User = Depends(require_role(UserRole.admin, UserRole.instructor)),
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.course_id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    chapter = Chapter(course_id=course_id, **payload.model_dump())
    db.add(chapter)
    db.commit()
    db.refresh(chapter)
    return chapter


# ─── Lessons ─────────────────────────────────────────────
@router.post(
    "/{course_id}/chapters/{chapter_id}/lessons",
    response_model=LessonOut,
    status_code=status.HTTP_201_CREATED,
)
def create_lesson(
    course_id: int,
    chapter_id: int,
    payload: LessonCreate,
    current_user: User = Depends(require_role(UserRole.admin, UserRole.instructor)),
    db: Session = Depends(get_db),
):
    chapter = (
        db.query(Chapter)
        .filter(Chapter.chapter_id == chapter_id, Chapter.course_id == course_id)
        .first()
    )
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")

    lesson = Lesson(chapter_id=chapter_id, **payload.model_dump())
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return lesson


# ─── Enrollment ──────────────────────────────────────────
@router.post("/enroll", response_model=EnrollmentOut, status_code=status.HTTP_201_CREATED)
def enroll_in_course(
    payload: EnrollmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # check course exists & is published
    course = db.query(Course).filter(
        Course.course_id == payload.course_id,
        Course.status == CourseStatus.published,
    ).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found or not available")

    # check not already enrolled
    existing = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.user_id,
        Enrollment.course_id == payload.course_id,
        Enrollment.status == EnrollmentStatus.active,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already enrolled in this course")

    enrollment = Enrollment(
        user_id=current_user.user_id,
        course_id=payload.course_id,
    )
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment


@router.get("/my/enrollments", response_model=List[EnrollmentOut])
def my_enrollments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    enrollments = (
        db.query(Enrollment)
        .options(joinedload(Enrollment.course).joinedload(Course.instructor))
        .filter(Enrollment.user_id == current_user.user_id)
        .order_by(Enrollment.enrolled_at.desc())
        .all()
    )
    return enrollments
