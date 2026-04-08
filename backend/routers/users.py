from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import User, UserRole, Enrollment, StudentProgress, EnrollmentStatus, ProgressStatus
from schemas import UserOut, UserUpdate, DashboardStats
from auth import get_current_user, require_role

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get("/profile", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/profile", response_model=UserOut)
def update_profile(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(current_user, key, value)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/dashboard/stats", response_model=DashboardStats)
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    enrollments = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.user_id
    ).all()

    total_enrolled = len(enrollments)
    completed = sum(1 for e in enrollments if e.status == EnrollmentStatus.completed)
    in_progress = total_enrolled - completed

    progress_records = db.query(StudentProgress).filter(
        StudentProgress.user_id == current_user.user_id
    ).all()

    lessons_completed = sum(1 for p in progress_records if p.status == ProgressStatus.completed)
    total_time = sum(p.time_spent_seconds for p in progress_records)

    total_lessons = len(progress_records) if progress_records else 1
    overall_progress = (lessons_completed / total_lessons * 100) if total_lessons > 0 else 0

    return DashboardStats(
        total_courses_enrolled=total_enrolled,
        completed_courses=completed,
        in_progress_courses=in_progress,
        total_lessons_completed=lessons_completed,
        total_time_spent_hours=round(total_time / 3600, 1),
        overall_progress_percent=round(overall_progress, 1),
    )


# ─── Admin: User Management ─────────────────────────────
@router.get("/", response_model=List[UserOut])
def list_users(
    current_user: User = Depends(require_role(UserRole.admin)),
    db: Session = Depends(get_db),
):
    return db.query(User).order_by(User.created_at.desc()).all()


@router.put("/{user_id}/status")
def update_user_status(
    user_id: int,
    new_status: str,
    current_user: User = Depends(require_role(UserRole.admin)),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.status = new_status
    db.commit()
    return {"message": f"User status updated to {new_status}"}
