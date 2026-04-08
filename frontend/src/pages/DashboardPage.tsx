import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { userService, courseService } from "../lib/api";
import {
  BookOpen,
  GraduationCap,
  Clock,
  TrendingUp,
  Trophy,
  ArrowRight,
  Flame,
} from "lucide-react";

interface Stats {
  total_courses_enrolled: number;
  completed_courses: number;
  in_progress_courses: number;
  total_lessons_completed: number;
  total_time_spent_hours: number;
  overall_progress_percent: number;
}

interface CourseItem {
  course_id: number;
  title: string;
  short_description?: string;
  thumbnail_url?: string;
  difficulty_level: string;
  duration_weeks: number;
  enrollment_count: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, coursesRes] = await Promise.all([
          userService.getDashboardStats(),
          courseService.listCourses(),
        ]);
        setStats(statsRes.data);
        setCourses(coursesRes.data.slice(0, 4));
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statCards = [
    {
      label: "Enrolled Courses",
      value: stats?.total_courses_enrolled ?? 0,
      icon: BookOpen,
      gradient: "from-indigo-500 to-purple-600",
      bg: "bg-indigo-500/10",
    },
    {
      label: "Completed",
      value: stats?.completed_courses ?? 0,
      icon: GraduationCap,
      gradient: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Hours Learned",
      value: stats?.total_time_spent_hours ?? 0,
      icon: Clock,
      gradient: "from-amber-500 to-orange-600",
      bg: "bg-amber-500/10",
    },
    {
      label: "Progress",
      value: `${stats?.overall_progress_percent ?? 0}%`,
      icon: TrendingUp,
      gradient: "from-cyan-500 to-blue-600",
      bg: "bg-cyan-500/10",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div
        className="relative overflow-hidden rounded-2xl p-8 animate-fade-in-up"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.1))",
          border: "1px solid rgba(99,102,241,0.15)",
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Welcome back, {user?.first_name}! 🎉
            </h1>
            <p className="text-white/50 max-w-lg">
              {stats?.in_progress_courses
                ? `You have ${stats.in_progress_courses} course${stats.in_progress_courses > 1 ? "s" : ""} in progress. Keep up the great work!`
                : "Browse our course catalog and start your learning journey today."}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-white font-semibold">3 Day Streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`glass rounded-2xl p-5 hover:scale-[1.02] transition-all duration-300 cursor-default animate-fade-in-up stagger-${i + 1}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 bg-gradient-to-br ${card.gradient} bg-clip-text`} style={{ color: card.gradient.includes("indigo") ? "#818cf8" : card.gradient.includes("emerald") ? "#34d399" : card.gradient.includes("amber") ? "#fbbf24" : "#22d3ee" }} />
                </div>
                <span className="text-xs text-white/30 font-medium">This Month</span>
              </div>
              <p className="text-2xl font-bold text-white">{card.value}</p>
              <p className="text-white/40 text-sm mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions + Recent Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="glass rounded-2xl p-6 animate-fade-in-up stagger-5">
          <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: "Browse Courses", href: "/courses", icon: BookOpen, color: "#818cf8" },
              { label: "My Achievements", href: "/achievements", icon: Trophy, color: "#fbbf24" },
              { label: "View Progress", href: "/my-learning", icon: TrendingUp, color: "#34d399" },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group"
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${action.color}15` }}>
                  <action.icon className="w-4.5 h-4.5" style={{ color: action.color }} />
                </div>
                <span className="text-white/70 text-sm font-medium group-hover:text-white transition-colors flex-1">
                  {action.label}
                </span>
                <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
              </a>
            ))}
          </div>
        </div>

        {/* Recent / Recommended Courses */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 animate-fade-in-up stagger-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-white font-semibold">Recommended Courses</h3>
            <a href="/courses" className="text-primary-light text-sm hover:text-primary transition-colors flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-10">
              <BookOpen className="w-12 h-12 text-white/10 mx-auto mb-3" />
              <p className="text-white/40 text-sm">No courses available yet.</p>
              <p className="text-white/25 text-xs mt-1">Courses will appear here once published.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courses.map((course) => (
                <a
                  key={course.course_id}
                  href={`/courses/${course.course_id}`}
                  className="p-4 rounded-xl border border-white/5 hover:border-primary/20 hover:bg-white/3 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.15))" }}
                    >
                      <BookOpen className="w-5 h-5 text-primary-light" />
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      course.difficulty_level === "beginner" ? "bg-emerald-500/15 text-emerald-400" :
                      course.difficulty_level === "intermediate" ? "bg-amber-500/15 text-amber-400" :
                      "bg-red-500/15 text-red-400"
                    }`}>
                      {course.difficulty_level}
                    </span>
                  </div>
                  <h4 className="text-white font-medium text-sm group-hover:text-primary-light transition-colors line-clamp-1">
                    {course.title}
                  </h4>
                  <p className="text-white/35 text-xs mt-1 line-clamp-2">
                    {course.short_description || "Explore this course to learn more."}
                  </p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-white/30">
                    <span>{course.duration_weeks}w</span>
                    <span>•</span>
                    <span>{course.enrollment_count} enrolled</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
