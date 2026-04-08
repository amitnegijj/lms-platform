import { useEffect, useState } from "react";
import { courseService } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import {
  BookOpen,
  Clock,
  Users,
  Search,
  ArrowRight,
  Sparkles,
  GraduationCap,
  LayoutGrid,
  List,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

interface CourseItem {
  course_id: number;
  title: string;
  short_description?: string;
  thumbnail_url?: string;
  difficulty_level: string;
  duration_weeks: number;
  enrollment_count: number;
  instructor?: {
    first_name: string;
    last_name: string;
  };
}

const levelConfig: Record<string, { bg: string; text: string; dot: string }> = {
  beginner: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-400" },
  intermediate: { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-400" },
  advanced: { bg: "bg-red-50", text: "text-red-500", dot: "bg-red-400" },
};

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [enrollingId, setEnrollingId] = useState<number | null>(null);
  const [enrolledIds, setEnrolledIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await courseService.listCourses();
        setCourses(data);
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredCourses = courses.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.short_description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLevel = filterLevel === "all" || c.difficulty_level === filterLevel;
    return matchSearch && matchLevel;
  });

  const handleEnroll = async (courseId: number) => {
    setEnrollingId(courseId);
    try {
      await courseService.enroll(courseId);
      setEnrolledIds((prev) => new Set(prev).add(courseId));
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to enroll");
    } finally {
      setEnrollingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="shimmer h-20 rounded-2xl" />
        <div className="shimmer h-14 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="shimmer h-72 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Course Catalog 📚</h1>
            <p className="text-slate-400 text-sm">
              {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""} available
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up stagger-1">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search courses by name or topic..."
            className="input-field pl-11 pr-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Filter pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-50 border border-slate-100">
            {["all", "beginner", "intermediate", "advanced"].map((level) => (
              <button
                type="button"
                key={level}
                onClick={() => setFilterLevel(level)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  filterLevel === level
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {level === "all" ? "All" : level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-50 border border-slate-100">
            <button type="button" title="Grid view" onClick={() => setViewMode("grid")} className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-300 hover:text-slate-500"}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button type="button" title="List view" onClick={() => setViewMode("list")} className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-300 hover:text-slate-500"}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Courses */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-24 animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-5">
            <BookOpen className="w-10 h-10 text-indigo-200" />
          </div>
          <h3 className="text-slate-600 text-lg font-bold mb-2">No courses found</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            {searchQuery ? "Try a different search term or adjust your filters" : "Courses will appear here once published"}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, i) => {
            const level = levelConfig[course.difficulty_level] || levelConfig.beginner;
            const isEnrolled = enrolledIds.has(course.course_id);
            const hue = (course.course_id * 47) % 360;
            return (
              <div
                key={course.course_id}
                className={`card-interactive rounded-2xl overflow-hidden group animate-fade-in-up stagger-${Math.min(i + 2, 8)}`}
              >
                {/* Thumbnail */}
                <div className="h-36 relative overflow-hidden" style={{ background: `linear-gradient(135deg, hsl(${hue}, 80%, 92%), hsl(${(hue + 40) % 360}, 70%, 88%))` }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-14 h-14 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500" style={{ color: `hsl(${hue}, 50%, 40%)` }} />
                  </div>
                  {/* Level badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${level.bg} ${level.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${level.dot}`} />
                      {course.difficulty_level}
                    </span>
                  </div>
                  {/* Popular badge */}
                  {course.enrollment_count > 50 && (
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-bold bg-white/90 text-amber-600 shadow-sm">
                        <Sparkles className="w-3 h-3" /> Popular
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-slate-700 font-bold text-[15px] group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-slate-400 text-sm mt-2 line-clamp-2 min-h-[2.5rem] leading-relaxed">
                    {course.short_description || "Explore this course to learn more about the topic."}
                  </p>

                  <div className="flex items-center gap-4 mt-4 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-300" /> {course.duration_weeks} weeks
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-300" /> {course.enrollment_count} students
                    </span>
                  </div>

                  {course.instructor && (
                    <div className="flex items-center gap-2 mt-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-[8px] text-white font-bold">
                        {course.instructor.first_name[0]}
                      </div>
                      <p className="text-slate-400 text-xs">
                        {course.instructor.first_name} {course.instructor.last_name}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
                    <Link
                      to={`/courses/${course.course_id}`}
                      className="flex-1 text-center text-sm font-semibold text-slate-400 hover:text-indigo-500 transition-colors"
                    >
                      View Details
                    </Link>
                    {user?.role === "student" && (
                      <button
                        type="button"
                        onClick={() => handleEnroll(course.course_id)}
                        disabled={enrollingId === course.course_id || isEnrolled}
                        className={`text-xs py-2 px-4 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                          isEnrolled
                            ? "bg-emerald-50 text-emerald-600"
                            : "btn-primary"
                        }`}
                      >
                        {enrollingId === course.course_id ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : isEnrolled ? (
                          <><CheckCircle className="w-3.5 h-3.5" /> Enrolled</>
                        ) : (
                          <>Enroll <ArrowRight className="w-3.5 h-3.5" /></>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filteredCourses.map((course, i) => {
            const level = levelConfig[course.difficulty_level] || levelConfig.beginner;
            const isEnrolled = enrolledIds.has(course.course_id);
            const hue = (course.course_id * 47) % 360;
            return (
              <div
                key={course.course_id}
                className={`card card-hover rounded-2xl p-5 flex items-center gap-5 group animate-fade-in-up stagger-${Math.min(i + 2, 8)}`}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `hsl(${hue}, 80%, 93%)` }}
                >
                  <BookOpen className="w-6 h-6" style={{ color: `hsl(${hue}, 55%, 45%)` }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-slate-700 font-bold text-sm group-hover:text-indigo-600 transition-colors truncate">
                      {course.title}
                    </h3>
                    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold ${level.bg} ${level.text} flex-shrink-0`}>
                      {course.difficulty_level}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs line-clamp-1">
                    {course.short_description || "Explore this course to learn more."}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-300 font-medium">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration_weeks}w</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course.enrollment_count}</span>
                    {course.instructor && <span>by {course.instructor.first_name} {course.instructor.last_name}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <Link to={`/courses/${course.course_id}`} className="text-xs font-semibold text-slate-400 hover:text-indigo-500 transition-colors">
                    Details
                  </Link>
                  {user?.role === "student" && (
                    <button
                      type="button"
                      onClick={() => handleEnroll(course.course_id)}
                      disabled={enrollingId === course.course_id || isEnrolled}
                      className={`text-xs py-2 px-4 rounded-lg font-bold flex items-center gap-1.5 transition-all ${isEnrolled ? "bg-emerald-50 text-emerald-600" : "btn-primary"}`}
                    >
                      {isEnrolled ? <><CheckCircle className="w-3.5 h-3.5" /> Enrolled</> : "Enroll"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
