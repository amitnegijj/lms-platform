import { useEffect, useState } from "react";
import { courseService } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { BookOpen, Clock, Users, Search, Filter, ArrowRight } from "lucide-react";
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

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");

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
    try {
      await courseService.enroll(courseId);
      alert("Successfully enrolled!");
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to enroll");
    }
  };

  const levelColors: Record<string, string> = {
    beginner: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    intermediate: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    advanced: "bg-red-500/15 text-red-400 border-red-500/20",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-bold text-white">Course Catalog</h1>
        <p className="text-white/40 mt-1">Discover courses and start learning today</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up stagger-1">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/30" />
          <input
            type="text"
            placeholder="Search courses..."
            className="input-field pl-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-white/40" />
          {["all", "beginner", "intermediate", "advanced"].map((level) => (
            <button
              key={level}
              onClick={() => setFilterLevel(level)}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all border ${
                filterLevel === level
                  ? "bg-primary/15 border-primary/30 text-primary-light"
                  : "bg-white/4 border-white/8 text-white/40 hover:bg-white/8"
              }`}
            >
              {level === "all" ? "All" : level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <BookOpen className="w-16 h-16 text-white/10 mx-auto mb-4" />
          <h3 className="text-white/50 text-lg font-medium mb-2">No courses found</h3>
          <p className="text-white/30 text-sm">
            {searchQuery ? "Try a different search term" : "Courses will appear here once published"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, i) => (
            <div
              key={course.course_id}
              className={`glass rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300 group animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}
            >
              {/* Thumbnail */}
              <div
                className="h-40 relative"
                style={{
                  background: `linear-gradient(135deg, 
                    hsl(${(course.course_id * 47) % 360}, 70%, 25%), 
                    hsl(${(course.course_id * 47 + 60) % 360}, 60%, 20%))`,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white/15" />
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${levelColors[course.difficulty_level] || levelColors.beginner}`}>
                    {course.difficulty_level}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-white font-semibold group-hover:text-primary-light transition-colors line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-white/35 text-sm mt-2 line-clamp-2 min-h-[2.5rem]">
                  {course.short_description || "Explore this course to learn more about the topic."}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 mt-4 text-xs text-white/30">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {course.duration_weeks} weeks
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {course.enrollment_count} students
                  </span>
                </div>

                {/* Instructor */}
                {course.instructor && (
                  <p className="text-white/25 text-xs mt-3">
                    by {course.instructor.first_name} {course.instructor.last_name}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
                  <Link
                    to={`/courses/${course.course_id}`}
                    className="flex-1 text-center text-sm font-medium text-primary-light hover:text-primary transition-colors"
                  >
                    View Details
                  </Link>
                  {user?.role === "student" && (
                    <button
                      onClick={() => handleEnroll(course.course_id)}
                      className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
                    >
                      Enroll <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
