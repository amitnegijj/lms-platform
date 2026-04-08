import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { courseService } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import {
  BookOpen,
  Clock,
  Users,
  ChevronDown,
  ChevronRight,
  PlayCircle,
  FileText,
  HelpCircle,
  ArrowLeft,
  CheckCircle,
  Lock,
  GraduationCap,
  Sparkles,
} from "lucide-react";

interface Lesson {
  lesson_id: number;
  title: string;
  description?: string;
  content_type: string;
  content_url?: string;
  duration_minutes: number;
  order: number;
  is_free: boolean;
}

interface Chapter {
  chapter_id: number;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface CourseDetail {
  course_id: number;
  title: string;
  description?: string;
  short_description?: string;
  difficulty_level: string;
  duration_weeks: number;
  enrollment_count: number;
  instructor?: { first_name: string; last_name: string };
  chapters: Chapter[];
}

const levelConfig: Record<string, { bg: string; text: string; dot: string }> = {
  beginner: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-400" },
  intermediate: { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-400" },
  advanced: { bg: "bg-red-50", text: "text-red-500", dot: "bg-red-400" },
};

const contentTypeIcon = (type: string) => {
  if (type === "video") return <PlayCircle className="w-4 h-4 text-indigo-400" />;
  if (type === "quiz") return <HelpCircle className="w-4 h-4 text-amber-400" />;
  return <FileText className="w-4 h-4 text-slate-400" />;
};

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set([0]));
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await courseService.getCourse(Number(id));
        setCourse(data);
      } catch {
        setError("Failed to load course.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const toggleChapter = (idx: number) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const handleEnroll = async () => {
    if (!course) return;
    setEnrolling(true);
    try {
      await courseService.enroll(course.course_id);
      setEnrolled(true);
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to enroll");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="shimmer h-48 rounded-2xl" />
        <div className="shimmer h-96 rounded-2xl" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="text-center py-24">
        <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-4" />
        <p className="text-slate-500 font-semibold">{error || "Course not found"}</p>
        <Link to="/courses" className="mt-4 inline-flex items-center gap-1.5 text-indigo-500 text-sm font-semibold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Courses
        </Link>
      </div>
    );
  }

  const level = levelConfig[course.difficulty_level] || levelConfig.beginner;
  const hue = (course.course_id * 47) % 360;
  const totalLessons = course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      {/* Back */}
      <Link to="/courses" className="inline-flex items-center gap-1.5 text-slate-400 text-sm font-semibold hover:text-indigo-500 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Courses
      </Link>

      {/* Hero card */}
      <div className="rounded-2xl overflow-hidden border border-slate-100 bg-white shadow-sm">
        {/* Banner */}
        <div
          className="h-40 flex items-center justify-center relative"
          style={{ background: `linear-gradient(135deg, hsl(${hue}, 80%, 92%), hsl(${(hue + 40) % 360}, 70%, 88%))` }}
        >
          <BookOpen className="w-20 h-20 opacity-10" style={{ color: `hsl(${hue}, 50%, 40%)` }} />
          <div className="absolute top-4 right-4">
            <span className={`inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider ${level.bg} ${level.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${level.dot}`} />
              {course.difficulty_level}
            </span>
          </div>
          {course.enrollment_count > 50 && (
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-full font-bold bg-white/90 text-amber-600 shadow-sm">
                <Sparkles className="w-3 h-3" /> Popular
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-6">
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mb-2">{course.title}</h1>
          {course.short_description && (
            <p className="text-slate-500 text-sm leading-relaxed mb-4">{course.short_description}</p>
          )}

          <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500 font-medium mb-5">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-300" /> {course.duration_weeks} weeks</span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-slate-300" /> {course.enrollment_count} students</span>
            <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-slate-300" /> {totalLessons} lessons</span>
            {course.instructor && (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-[8px] text-white font-bold">
                  {course.instructor.first_name[0]}
                </div>
                {course.instructor.first_name} {course.instructor.last_name}
              </span>
            )}
          </div>

          {course.description && (
            <p className="text-slate-500 text-sm leading-relaxed border-t border-slate-100 pt-4">{course.description}</p>
          )}

          {user?.role === "student" && (
            <div className="mt-5">
              <button
                type="button"
                onClick={handleEnroll}
                disabled={enrolling || enrolled}
                className={`py-2.5 px-6 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                  enrolled ? "bg-emerald-50 text-emerald-600" : "btn-primary"
                }`}
              >
                {enrolling ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : enrolled ? (
                  <><CheckCircle className="w-4 h-4" /> Enrolled</>
                ) : (
                  <><GraduationCap className="w-4 h-4" /> Enroll in this Course</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Curriculum */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-slate-800 font-extrabold text-lg tracking-tight">Course Curriculum</h2>
          <p className="text-slate-400 text-sm mt-0.5">{course.chapters.length} chapters · {totalLessons} lessons</p>
        </div>

        <div className="divide-y divide-slate-50">
          {course.chapters.map((chapter) => {
            const isOpen = expandedChapters.has(chapter.order);
            return (
              <div key={chapter.chapter_id}>
                {/* Chapter header */}
                <button
                  type="button"
                  onClick={() => toggleChapter(chapter.order)}
                  className="w-full flex items-center gap-3 px-6 py-4 hover:bg-slate-50/80 transition-colors text-left"
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${isOpen ? "bg-indigo-50" : "bg-slate-50"}`}>
                    {isOpen
                      ? <ChevronDown className="w-4 h-4 text-indigo-500" />
                      : <ChevronRight className="w-4 h-4 text-slate-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-700 font-bold text-sm">{chapter.title}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{chapter.lessons.length} lessons</p>
                  </div>
                </button>

                {/* Lessons */}
                {isOpen && (
                  <div className="bg-slate-50/50 divide-y divide-slate-100/80">
                    {chapter.lessons.map((lesson) => (
                      <div key={lesson.lesson_id} className="flex items-start gap-3 px-8 py-3">
                        <div className="mt-0.5 flex-shrink-0">
                          {contentTypeIcon(lesson.content_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-700 text-sm font-semibold">{lesson.title}</p>
                          {lesson.description && (
                            <p className="text-slate-400 text-xs mt-1 line-clamp-2 leading-relaxed">{lesson.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                          {lesson.is_free ? (
                            lesson.content_url ? (
                              <a
                                href={lesson.content_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] font-bold text-indigo-500 hover:text-indigo-700 transition-colors flex items-center gap-1"
                              >
                                <PlayCircle className="w-3.5 h-3.5" /> Preview
                              </a>
                            ) : (
                              <span className="text-[11px] font-bold text-emerald-500">Free</span>
                            )
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-slate-300" />
                          )}
                          <span className="text-[11px] text-slate-300 font-medium">{lesson.duration_minutes}m</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
