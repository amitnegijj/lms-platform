"""Seed the database with sample data for development."""
from database import engine, SessionLocal
from models import Base, User, Course, Chapter, Lesson, Enrollment, UserRole, CourseStatus
from auth import hash_password

# Recreate all tables
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# ─── Users ────────────────────────────────────────────
admin = User(
    email="admin@lms.com",
    password_hash=hash_password("admin123"),
    first_name="Admin",
    last_name="User",
    role=UserRole.admin,
)
instructor = User(
    email="instructor@lms.com",
    password_hash=hash_password("instructor123"),
    first_name="Dr. Sarah",
    last_name="Johnson",
    role=UserRole.instructor,
)
student = User(
    email="amit@test.com",
    password_hash=hash_password("password123"),
    first_name="Amit",
    last_name="Negi",
    role=UserRole.student,
)
db.add_all([admin, instructor, student])
db.commit()
db.refresh(instructor)
db.refresh(student)

print(f"✅ Created users: admin, instructor, student")

# ─── Courses ──────────────────────────────────────────
courses_data = [
    {
        "title": "Python for Data Science",
        "description": "Master Python programming with hands-on data science projects. Learn NumPy, Pandas, Matplotlib, and Scikit-learn.",
        "short_description": "Master Python for data analysis, visualization, and machine learning.",
        "difficulty_level": "beginner",
        "duration_weeks": 8,
        "status": CourseStatus.published,
        "chapters": [
            {"title": "Python Fundamentals", "lessons": ["Variables & Data Types", "Control Flow", "Functions", "File I/O"]},
            {"title": "NumPy & Pandas", "lessons": ["NumPy Arrays", "Pandas DataFrames", "Data Cleaning", "Merging Data"]},
            {"title": "Data Visualization", "lessons": ["Matplotlib Basics", "Seaborn Charts", "Interactive Plots", "Dashboard Project"]},
        ],
    },
    {
        "title": "Full-Stack Web Development",
        "description": "Build modern web applications using React, Node.js, and PostgreSQL. From frontend to deployment.",
        "short_description": "Build web apps with React, Node.js, and PostgreSQL from scratch.",
        "difficulty_level": "intermediate",
        "duration_weeks": 12,
        "status": CourseStatus.published,
        "chapters": [
            {"title": "HTML, CSS & JavaScript", "lessons": ["HTML5 Semantics", "CSS Flexbox & Grid", "JavaScript ES6+", "DOM Manipulation"]},
            {"title": "React.js", "lessons": ["Components & Props", "State Management", "React Router", "API Integration"]},
            {"title": "Node.js & Express", "lessons": ["Express Server", "RESTful APIs", "Authentication", "Database Integration"]},
            {"title": "Deployment", "lessons": ["Docker Basics", "CI/CD Pipeline", "Cloud Deployment", "Monitoring"]},
        ],
    },
    {
        "title": "Machine Learning A-Z",
        "description": "Comprehensive machine learning course covering supervised, unsupervised, and deep learning techniques.",
        "short_description": "From linear regression to neural networks — the complete ML journey.",
        "difficulty_level": "advanced",
        "duration_weeks": 16,
        "status": CourseStatus.published,
        "chapters": [
            {"title": "Supervised Learning", "lessons": ["Linear Regression", "Logistic Regression", "Decision Trees", "SVM"]},
            {"title": "Unsupervised Learning", "lessons": ["K-Means Clustering", "PCA", "Anomaly Detection"]},
            {"title": "Deep Learning", "lessons": ["Neural Networks", "CNNs", "RNNs", "Transfer Learning"]},
        ],
    },
    {
        "title": "UI/UX Design Masterclass",
        "description": "Learn user-centered design principles, wireframing, prototyping, and usability testing.",
        "short_description": "Design stunning, user-friendly interfaces with modern tools and techniques.",
        "difficulty_level": "beginner",
        "duration_weeks": 6,
        "status": CourseStatus.published,
        "chapters": [
            {"title": "Design Thinking", "lessons": ["User Research", "Personas & Scenarios", "Information Architecture"]},
            {"title": "Visual Design", "lessons": ["Color Theory", "Typography", "Layout Principles", "Design Systems"]},
            {"title": "Prototyping", "lessons": ["Wireframing", "Figma Basics", "Interactive Prototypes", "Usability Testing"]},
        ],
    },
    {
        "title": "DevOps Engineering",
        "description": "Master DevOps practices including containerization, orchestration, CI/CD, and infrastructure as code.",
        "short_description": "Automate, deploy, and scale with Docker, Kubernetes, and Terraform.",
        "difficulty_level": "advanced",
        "duration_weeks": 10,
        "status": CourseStatus.published,
        "chapters": [
            {"title": "Docker & Containers", "lessons": ["Docker Fundamentals", "Dockerfile", "Docker Compose", "Container Security"]},
            {"title": "Kubernetes", "lessons": ["K8s Architecture", "Pods & Services", "Deployments", "Helm Charts"]},
            {"title": "CI/CD & IaC", "lessons": ["GitHub Actions", "Jenkins", "Terraform", "Ansible"]},
        ],
    },
    {
        "title": "Cybersecurity Essentials",
        "description": "Learn offensive and defensive security techniques, ethical hacking, and security compliance.",
        "short_description": "Protect systems and data with ethical hacking and security best practices.",
        "difficulty_level": "intermediate",
        "duration_weeks": 8,
        "status": CourseStatus.published,
        "chapters": [
            {"title": "Security Fundamentals", "lessons": ["CIA Triad", "Threat Modeling", "Risk Assessment"]},
            {"title": "Network Security", "lessons": ["Firewalls", "VPNs", "IDS/IPS", "Packet Analysis"]},
            {"title": "Ethical Hacking", "lessons": ["Reconnaissance", "Vulnerability Scanning", "Exploitation", "Reporting"]},
        ],
    },
]

for cdata in courses_data:
    chapters = cdata.pop("chapters")
    course = Course(**cdata, instructor_id=instructor.user_id)
    db.add(course)
    db.commit()
    db.refresh(course)

    for ch_order, ch in enumerate(chapters):
        chapter = Chapter(
            course_id=course.course_id,
            title=ch["title"],
            order=ch_order,
        )
        db.add(chapter)
        db.commit()
        db.refresh(chapter)

        for ls_order, lesson_title in enumerate(ch["lessons"]):
            lesson = Lesson(
                chapter_id=chapter.chapter_id,
                title=lesson_title,
                content_type="document",
                duration_minutes=30 + (ls_order * 10),
                order=ls_order,
            )
            db.add(lesson)

    db.commit()

print(f"✅ Created {len(courses_data)} courses with chapters and lessons")

# ─── Enroll student in first 3 courses ────────────────
for i in range(3):
    enrollment = Enrollment(
        user_id=student.user_id,
        course_id=i + 1,
    )
    db.add(enrollment)
db.commit()

print(f"✅ Enrolled student in 3 courses")
print()
print("🎓 Seed data created successfully!")
print()
print("Login credentials:")
print("  Admin:      admin@lms.com / admin123")
print("  Instructor: instructor@lms.com / instructor123")
print("  Student:    amit@test.com / password123")

db.close()
