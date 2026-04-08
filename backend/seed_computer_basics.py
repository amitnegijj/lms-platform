"""Seed the Computer Basics course into the existing database."""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal
from models import Course, Chapter, Lesson, CourseStatus

db = SessionLocal()

# Find the instructor user
from models import User, UserRole
instructor = db.query(User).filter(User.role == UserRole.instructor).first()
if not instructor:
    print("ERROR: No instructor found. Run seed.py first.")
    db.close()
    sys.exit(1)

# Course data from the JSON
course_data = {
    "title": "Computer Basics",
    "description": "A comprehensive 70-day, 10-week course covering everything from what a computer is to advanced productivity tools, internet safety, and a final project. Perfect for absolute beginners.",
    "short_description": "Master computer fundamentals in 70 days — hardware, OS, internet, productivity tools, and security.",
    "difficulty_level": "beginner",
    "duration_weeks": 10,
    "status": CourseStatus.published,
}

# Organized by week: each week has 6 lessons + 1 review day
weeks = [
    {
        "title": "Week 1: Computer Fundamentals",
        "days": [
            {"day": 1,  "title": "What is a Computer?",          "videos": ["InHnZ-DMjEY"], "takeaways": ["A computer is an electronic device that processes data.", "It uses binary (1s and 0s) to function.", "Computers follow instructions provided by software."]},
            {"day": 2,  "title": "Hardware vs Software",           "videos": ["InHnZ-DMjEY"], "takeaways": ["Hardware: Physical components (Monitor, CPU, RAM).", "Software: Digital instructions (Windows, Apps, Games).", "Software tells hardware how to act."]},
            {"day": 3,  "title": "Input Devices",                  "videos": ["Cu3R5it4cQs"], "takeaways": ["Keyboards enter text.", "Mice and touchpads navigate the screen.", "Microphones capture audio."]},
            {"day": 4,  "title": "Output Devices",                 "videos": ["Cu3R5it4cQs"], "takeaways": ["Monitors display visual info.", "Speakers output sound.", "Printers create hard copies."]},
            {"day": 5,  "title": "Types of Computers",             "videos": ["InHnZ-DMjEY"], "takeaways": ["Desktops: Stationary and powerful.", "Laptops: Portable and battery-powered.", "Tablets/Phones: Highly portable touch devices."]},
            {"day": 6,  "title": "Inside the Box: CPU & RAM",      "videos": ["InHnZ-DMjEY"], "takeaways": ["CPU: The Central Processing Unit (the brain).", "RAM: Short-term memory for active tasks.", "Hard Drive/SSD: Long-term storage for files."]},
            {"day": 7,  "title": "Week 1 Review & Quiz",           "videos": [], "takeaways": ["Review all lessons from the previous 6 days.", "Pass the quiz to unlock Week 2."], "is_quiz": True},
        ],
    },
    {
        "title": "Week 2: Operating Systems",
        "days": [
            {"day": 8,  "title": "Introduction to Operating Systems", "videos": ["HBy0w6S_PrU"], "takeaways": ["OS manages hardware and software resources.", "Common OS: Windows, macOS, Linux.", "It provides the User Interface (UI)."]},
            {"day": 9,  "title": "Navigating Windows 11",             "videos": ["HBy0w6S_PrU"], "takeaways": ["The Taskbar holds frequently used apps.", "The Start Menu is for searching and launching apps.", "The Desktop is your main workspace."]},
            {"day": 10, "title": "Mac OS Basics",                     "videos": ["HBy0w6S_PrU"], "takeaways": ["The Dock is used for launching apps.", "Finder is used for file management.", "The Menu Bar is always at the top of the screen."]},
            {"day": 11, "title": "Linux & Open Source",               "videos": ["HBy0w6S_PrU"], "takeaways": ["Linux is 'Open Source', meaning anyone can view its code.", "It's widely used in servers and supercomputers.", "Ubuntu is a great beginner-friendly version."]},
            {"day": 12, "title": "File Management 101",               "videos": ["HBy0w6S_PrU"], "takeaways": ["Folders organize related files together.", "File extensions (like .jpg or .pdf) tell the computer what the file is.", "Searching is faster when files are named clearly."]},
            {"day": 13, "title": "Copy, Move, and Delete",            "videos": ["HBy0w6S_PrU"], "takeaways": ["Copying makes a duplicate; Moving relocates the original.", "The Recycle Bin stores deleted files temporarily.", "Emptying the trash removes files permanently."]},
            {"day": 14, "title": "Week 2 Review & Quiz",              "videos": [], "takeaways": ["Review all lessons from the previous 6 days.", "Pass the quiz to unlock Week 3."], "is_quiz": True},
        ],
    },
    {
        "title": "Week 3: Keyboard & Typing Skills",
        "days": [
            {"day": 15, "title": "Keyboard Layout (QWERTY)",          "videos": ["Cu3R5it4cQs"], "takeaways": ["QWERTY is the standard keyboard layout.", "The Home Row is where your fingers should rest.", "Modifier keys (Shift, Ctrl) change the behavior of other keys."]},
            {"day": 16, "title": "Typing Technique: Home Row",        "videos": ["Cu3R5it4cQs"], "takeaways": ["Left hand: A, S, D, F | Right hand: J, K, L, ;", "Each finger is responsible for a specific zone of the keyboard.", "Good posture prevents wrist strain."]},
            {"day": 17, "title": "Essential Keyboard Shortcuts",      "videos": ["HBy0w6S_PrU"], "takeaways": ["Ctrl+C (Copy) and Ctrl+V (Paste) are essential.", "Ctrl+Z (Undo) fixes mistakes instantly.", "Ctrl+S (Save) protects your work from crashes."]},
            {"day": 18, "title": "Special Keys & Symbols",            "videos": ["Cu3R5it4cQs"], "takeaways": ["The Shift key allows access to the top symbols on keys.", "Caps Lock locks letters to uppercase.", "The Tab key is used for indentation."]},
            {"day": 19, "title": "Ergonomics & Health",               "videos": ["Cu3R5it4cQs"], "takeaways": ["Keep wrists level and not resting on hard edges.", "Take frequent breaks to avoid Repetitive Strain Injury (RSI).", "The monitor should be at eye level."]},
            {"day": 20, "title": "Selecting Text & Navigation",       "videos": ["Cu3R5it4cQs"], "takeaways": ["Arrow keys move the cursor.", "Ctrl + Arrow move the cursor by entire words.", "Shift + Arrow selects text as you move."]},
            {"day": 21, "title": "Week 3 Review & Quiz",              "videos": [], "takeaways": ["Review all lessons from the previous 6 days.", "Pass the quiz to unlock Week 4."], "is_quiz": True},
        ],
    },
    {
        "title": "Week 4: Internet & Web Browsing",
        "days": [
            {"day": 22, "title": "What is the Internet?",             "videos": ["InHnZ-DMjEY"], "takeaways": ["The Internet is the physical network of cables and servers.", "The World Wide Web (WWW) is a service that runs on the internet.", "Data is sent in small packets across the globe."]},
            {"day": 23, "title": "Using Web Browsers",                "videos": ["HBy0w6S_PrU"], "takeaways": ["Common browsers: Chrome, Firefox, Safari, Edge.", "Browsers translate HTML code into visual pages.", "Tabs allow you to view multiple sites simultaneously."]},
            {"day": 24, "title": "Understanding URLs",                 "videos": ["HBy0w6S_PrU"], "takeaways": ["URL stands for Uniform Resource Locator.", "The domain (e.g., google.com) is the address.", "HTTPS indicates a secure, encrypted connection."]},
            {"day": 25, "title": "Mastering Search Engines",          "videos": ["HBy0w6S_PrU"], "takeaways": ["Using keywords instead of full sentences is often better.", "Quotes (' ') search for an exact phrase.", "The first few results are often paid 'Ads'."]},
            {"day": 26, "title": "Bookmarks & Browsing History",      "videos": ["HBy0w6S_PrU"], "takeaways": ["Bookmarks save the URL of a page for quick access.", "Browsing history allows you to find a site you visited yesterday.", "Incognito/Private mode does not save history."]},
            {"day": 27, "title": "Web Safety Basics",                 "videos": ["HBy0w6S_PrU"], "takeaways": ["Avoid clicking suspicious pop-ups or 'You won a prize' alerts.", "The padlock icon in the URL bar indicates a secure site.", "Only download files from trusted, well-known sources."]},
            {"day": 28, "title": "Week 4 Review & Quiz",              "videos": [], "takeaways": ["Review all lessons from the previous 6 days.", "Pass the quiz to unlock Week 5."], "is_quiz": True},
        ],
    },
    {
        "title": "Week 5: Email & Communication",
        "days": [
            {"day": 29, "title": "Creating Your First Email",         "videos": ["HBy0w6S_PrU"], "takeaways": ["Gmail, Outlook, and Yahoo are the most popular providers.", "Choose a professional username for work and school.", "Set up a strong, unique password immediately."]},
            {"day": 30, "title": "Composing Professional Emails",     "videos": ["HBy0w6S_PrU"], "takeaways": ["The Subject line must be clear and concise.", "The Body should be polite and structured.", "Always include a greeting and a professional sign-off."]},
            {"day": 31, "title": "Working with Attachments",          "videos": ["HBy0w6S_PrU"], "takeaways": ["The paperclip icon is used to attach files.", "Large files should be sent via cloud links (e.g., Drive).", "Be cautious of attachments from unknown senders."]},
            {"day": 32, "title": "Organizing Your Inbox",             "videos": ["HBy0w6S_PrU"], "takeaways": ["Folders/Labels keep your emails categorized.", "Archiving removes mail from the inbox without deleting it.", "Marking as 'Unread' helps you remember to reply."]},
            {"day": 33, "title": "Email Etiquette (Netiquette)",      "videos": ["HBy0w6S_PrU"], "takeaways": ["Avoid ALL CAPS (it looks like shouting).", "Be concise and respectful in your tone.", "CC (Carbon Copy) is visible; BCC (Blind Carbon Copy) is hidden."]},
            {"day": 34, "title": "Fighting Spam & Phishing",          "videos": ["HBy0w6S_PrU"], "takeaways": ["Check the sender's actual email address, not just the name.", "Be wary of 'urgent' requests for passwords or money.", "Use the 'Report Spam' button to train your email provider."]},
            {"day": 35, "title": "Week 5 Review & Quiz",              "videos": [], "takeaways": ["Review all lessons from the previous 6 days.", "Pass the quiz to unlock Week 6."], "is_quiz": True},
        ],
    },
    {
        "title": "Week 6: Word Processing",
        "days": [
            {"day": 36, "title": "Intro to Word Processing",          "videos": ["HBy0w6S_PrU"], "takeaways": ["Word processors (Word, Google Docs) are for letters, reports, essays.", "The 'Ribbon' or 'Menu' contains all your tools.", "Documents are saved as .docx or .pdf files."]},
            {"day": 37, "title": "Formatting Text",                   "videos": ["HBy0w6S_PrU"], "takeaways": ["Bold, Italic, and Underline emphasize important text.", "Fonts and sizes change the mood and readability of the document.", "Alignment (Left, Center, Right, Justified) organizes text."]},
            {"day": 38, "title": "Lists & Bullet Points",             "videos": ["HBy0w6S_PrU"], "takeaways": ["Numbered lists are for sequences/steps.", "Bullet points are for general items/lists.", "Indentation helps create sub-lists."]},
            {"day": 39, "title": "Inserting Tables",                  "videos": ["HBy0w6S_PrU"], "takeaways": ["Tables help organize complex information visually.", "You can add/remove rows and columns easily.", "Cell borders and shading make tables easier to read."]},
            {"day": 40, "title": "Images & Page Layout",              "videos": ["HBy0w6S_PrU"], "takeaways": ["Images should be aligned with 'Text Wrapping' to look tidy.", "Margins define the white space around the page edges.", "Orientation can be Portrait (vertical) or Landscape (horizontal)."]},
            {"day": 41, "title": "Saving, Exporting & Printing",      "videos": ["HBy0w6S_PrU"], "takeaways": ["'Save As' allows you to choose a filename and location.", "Exporting to PDF preserves the formatting for everyone.", "Print Preview shows exactly how it will look on paper."]},
            {"day": 42, "title": "Week 6 Review & Quiz",              "videos": [], "takeaways": ["Review all lessons from the previous 6 days.", "Pass the quiz to unlock Week 7."], "is_quiz": True},
        ],
    },
    {
        "title": "Week 7: Spreadsheets",
        "days": [
            {"day": 43, "title": "What is a Spreadsheet?",            "videos": ["HBy0w6S_PrU"], "takeaways": ["Spreadsheets are made of cells (intersections of rows and columns).", "Cells are named by letter and number (e.g., A1).", "They are used for budgets, lists, and calculations."]},
            {"day": 44, "title": "Data Entry Basics",                 "videos": ["HBy0w6S_PrU"], "takeaways": ["Press Enter to move down, Tab to move right.", "Data can be text, numbers, or dates.", "Merging cells creates a single large cell for headers."]},
            {"day": 45, "title": "Simple Formulas",                   "videos": ["HBy0w6S_PrU"], "takeaways": ["Every formula starts with an equals sign (=).", "Basic operators: +, -, *, /.", "Cell references (e.g., =A1+B1) allow automatic updates."]},
            {"day": 46, "title": "Functions (SUM, AVERAGE)",          "videos": ["HBy0w6S_PrU"], "takeaways": ["SUM adds a range of cells.", "AVERAGE finds the mean value.", "Functions make calculating large datasets fast."]},
            {"day": 47, "title": "Sorting & Filtering",               "videos": ["HBy0w6S_PrU"], "takeaways": ["Sorted data is arranged alphabetically or numerically.", "Filtering hides data that doesn't match your criteria.", "Filters are essential for data analysis."]},
            {"day": 48, "title": "Basic Charts & Graphs",             "videos": ["HBy0w6S_PrU"], "takeaways": ["Pie charts show parts of a whole.", "Bar charts compare different categories.", "Line charts show trends over time."]},
            {"day": 49, "title": "Week 7 Review & Quiz",              "videos": [], "takeaways": ["Review all lessons from the previous 6 days.", "Pass the quiz to unlock Week 8."], "is_quiz": True},
        ],
    },
    {
        "title": "Week 8: Presentations",
        "days": [
            {"day": 50, "title": "Intro to Presentation Software",    "videos": ["HBy0w6S_PrU"], "takeaways": ["Presentations are made of 'Slides'.", "The goal is to support the speaker, not replace them.", "Consistent design makes a professional impression."]},
            {"day": 51, "title": "Adding Text & Layouts",             "videos": ["HBy0w6S_PrU"], "takeaways": ["Avoid too much text on one slide (use bullet points).", "Layouts provide pre-set positions for titles and content.", "Contrast (light text on dark bg) ensures readability."]},
            {"day": 52, "title": "Visuals: Images & Shapes",          "videos": ["HBy0w6S_PrU"], "takeaways": ["High-quality images are better than blurry ones.", "Shapes can be used as call-outs or flowcharts.", "Alignment tools help keep images tidy."]},
            {"day": 53, "title": "Transitions & Animations",          "videos": ["HBy0w6S_PrU"], "takeaways": ["Transitions happen between slides.", "Animations happen to objects on a slide.", "Less is more: too many animations distract the audience."]},
            {"day": 54, "title": "Presenting & Speaker Notes",        "videos": ["HBy0w6S_PrU"], "takeaways": ["Speaker notes are for you, not the audience.", "Presenter view allows you to see the next slide.", "Practice the timing of your slides."]},
            {"day": 55, "title": "Designing for the Audience",        "videos": ["HBy0w6S_PrU"], "takeaways": ["Use large fonts for the back of the room.", "Keep a consistent color scheme.", "End with a 'Questions' slide."]},
            {"day": 56, "title": "Week 8 Review & Quiz",              "videos": [], "takeaways": ["Review all lessons from the previous 6 days.", "Pass the quiz to unlock Week 9."], "is_quiz": True},
        ],
    },
    {
        "title": "Week 9: Online Safety & Privacy",
        "days": [
            {"day": 57, "title": "Password Security",                 "videos": ["InHnZ-DMjEY"], "takeaways": ["Use a mix of letters, numbers, and symbols.", "Avoid using personal info like birthdays.", "Password managers help you remember unique passwords."]},
            {"day": 58, "title": "Phishing & Social Engineering",     "videos": ["InHnZ-DMjEY"], "takeaways": ["Phishing is using fake emails to steal info.", "Hackers often use 'Urgency' to steal data.", "Never give passwords over email or phone."]},
            {"day": 59, "title": "Antivirus & Software Updates",      "videos": ["InHnZ-DMjEY"], "takeaways": ["Antivirus scans for and removes malware.", "Updates patch security holes in your OS.", "Keep your browser and apps updated automatically."]},
            {"day": 60, "title": "Privacy Settings",                  "videos": ["InHnZ-DMjEY"], "takeaways": ["Check privacy settings on social media.", "Be careful about sharing your location.", "Use 'Two-Factor Authentication' (2FA) for extra security."]},
            {"day": 61, "title": "Safe Social Media Use",             "videos": ["HBy0w6S_PrU"], "takeaways": ["Think before you post: it's permanent.", "Block and report abusive users.", "Verify information before sharing it."]},
            {"day": 62, "title": "Identity Theft & Protection",       "videos": ["InHnZ-DMjEY"], "takeaways": ["Monitor your bank accounts and email logins.", "Shred physical documents with personal info.", "Use secure, encrypted connections (VPNs) on public Wi-Fi."]},
            {"day": 63, "title": "Week 9 Review & Quiz",              "videos": [], "takeaways": ["Review all lessons from the previous 6 days.", "Pass the quiz to unlock Week 10."], "is_quiz": True},
        ],
    },
    {
        "title": "Week 10: Cloud, Collaboration & Final Project",
        "days": [
            {"day": 64, "title": "Cloud Storage Basics",              "videos": ["InHnZ-DMjEY"], "takeaways": ["Google Drive, OneDrive, and Dropbox are 'Cloud' storage.", "Cloud storage prevents loss if your hardware fails.", "Collaboration is easier when files are shared online."]},
            {"day": 65, "title": "Collaboration Tools",               "videos": ["HBy0w6S_PrU"], "takeaways": ["Real-time editing (Docs/Sheets) allows teamwork.", "Comments and suggestions help refine work.", "Shared folders allow organized group access."]},
            {"day": 66, "title": "Basic Troubleshooting",             "videos": ["HBy0w6S_PrU"], "takeaways": ["Try 'Restarting' first (fixes many issues).", "Check the cables and power supply.", "Screengrab the error message and search it on Google."]},
            {"day": 67, "title": "Finding Help Online",               "videos": ["HBy0w6S_PrU"], "takeaways": ["Official help forums are a great resource.", "YouTube tutorials are excellent for visual learners.", "Check the 'Help' menu within the software."]},
            {"day": 68, "title": "Final Project: Planning",           "videos": ["HBy0w6S_PrU"], "takeaways": ["Combine a document, a spreadsheet, and a presentation.", "Use the cloud to organize your project files.", "Focus on a topic you are passionate about."]},
            {"day": 69, "title": "Final Project: Execution",          "videos": ["HBy0w6S_PrU"], "takeaways": ["Create a report (Word), a budget (Excel), and a pitch (Slides).", "Use professional formatting and safe practices.", "Export everything as PDF for the final submission."]},
            {"day": 70, "title": "Week 10 Review & Final Quiz",       "videos": [], "takeaways": ["Review all lessons from the previous 6 days.", "Congratulations on completing the course!"], "is_quiz": True},
        ],
    },
]

# Create course
course = Course(**course_data, instructor_id=instructor.user_id)
db.add(course)
db.commit()
db.refresh(course)
print(f"[OK] Created course: {course.title} (ID: {course.course_id})")

# Create chapters and lessons
total_lessons = 0
for ch_order, week in enumerate(weeks):
    chapter = Chapter(
        course_id=course.course_id,
        title=week["title"],
        order=ch_order,
    )
    db.add(chapter)
    db.commit()
    db.refresh(chapter)

    for ls_order, day in enumerate(week["days"]):
        is_quiz = day.get("is_quiz", False)
        content_type = "quiz" if is_quiz else ("video" if day["videos"] else "document")
        video_id = day["videos"][0] if day["videos"] else None
        content_url = f"https://www.youtube.com/watch?v={video_id}" if video_id else None
        description = "\n".join(f"• {t}" for t in day["takeaways"])

        lesson = Lesson(
            chapter_id=chapter.chapter_id,
            title=f"Day {day['day']}: {day['title']}",
            description=description,
            content_type=content_type,
            content_url=content_url,
            duration_minutes=20 if is_quiz else 30,
            order=ls_order,
            is_free=(day["day"] <= 3),  # First 3 days are free preview
        )
        db.add(lesson)
        total_lessons += 1

    db.commit()
    print(f"  [OK] Week {ch_order + 1}: {week['title']} ({len(week['days'])} lessons)")

print(f"\nComputer Basics course created successfully!")
print(f"   Chapters: {len(weeks)} weeks")
print(f"   Lessons:  {total_lessons} days")
db.close()
