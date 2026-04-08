import { useEffect, useState, useRef } from "react";
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
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

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

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (end === 0) return;
    const duration = 1200;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = end / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplay(end);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [value]);

  return <span ref={ref}>{display}{suffix}</span>;
}

function ProgressRing({ percent, size = 48, stroke = 4 }: { percent: number; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference - (percent / 100) * circumference);
    }, 300);
    return () => clearTimeout(timer);
  }, [percent, circumference]);

  return (
    <svg width={size} height={size} className="progress-ring">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke="url(#progressGrad)" strokeWidth={stroke}
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" className="progress-ring-circle"
      />
      <defs>
        <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  );
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
      bg: "bg-indigo-soft",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-500",
      emoji: "📚",
    },
    {
      label: "Completed",
      value: stats?.completed_courses ?? 0,
      icon: GraduationCap,
      bg: "bg-emerald-soft",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-500",
      emoji: "🎉",
    },
    {
      label: "Hours Learned",
      value: stats?.total_time_spent_hours ?? 0,
      icon: Clock,
      bg: "bg-amber-soft",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-500",
      emoji: "⏱️",
    },
    {
      label: "Progress",
      value: stats?.overall_progress_percent ?? 0,
      icon: TrendingUp,
      bg: "bg-cyan-soft",
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-500",
      emoji: "📈",
      suffix: "%",
      hasRing: true,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="shimmer h-36 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => <div key={i} className="shimmer h-32 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="shimmer h-64 rounded-2xl" />
          <div className="lg:col-span-2 shimmer h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl p-7 animate-fade-in-up bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/10 blur-2xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-white/10 blur-2xl translate-y-1/2" />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm font-medium mb-1">Welcome back!</p>
            <h1 className="text-2xl font-extrabold text-white mb-2 tracking-tight">
              Hey {user?.first_name}! Ready to learn? 🎯
            </h1>
            <p className="text-white/60 max-w-lg text-sm">
              {stats?.in_progress_courses
                ? `You have ${stats.in_progress_courses} course${stats.in_progress_courses > 1 ? "s" : ""} in progress. Keep going, you're doing amazing!`
                : "Browse our course catalog and start your learning journey today!"}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 text-center">
              <Flame className="w-5 h-5 text-orange-300 mx-auto mb-1" />
              <span className="text-white font-extrabold text-lg block leading-tight">3</span>
              <span className="text-white/60 text-[10px] font-medium">Day Streak 🔥</span>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 text-center">
              <Target className="w-5 h-5 text-emerald-300 mx-auto mb-1" />
              <span className="text-white font-extrabold text-lg block leading-tight">{stats?.total_lessons_completed ?? 0}</span>
              <span className="text-white/60 text-[10px] font-medium">Lessons Done</span>
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
              className={`card card-hover rounded-2xl p-5 animate-fade-in-up stagger-${i + 1}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
                {card.hasRing ? (
                  <ProgressRing percent={card.value} />
                ) : (
                  <span className="text-lg">{card.emoji}</span>
                )}
              </div>
              <p className="text-3xl font-extrabold text-slate-800 tracking-tight">
                <AnimatedNumber value={card.value} suffix={card.suffix} />
              </p>
              <p className="text-slate-400 text-sm mt-1 font-medium">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions + Recent Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="card rounded-2xl p-6 animate-fade-in-up stagger-5">
          <div className="flex items-center gap-2 mb-5">
            <Zap className="w-4 h-4 text-amber-500" />
            <h3 className="text-slate-800 font-bold">Quick Actions</h3>
          </div>
          <div className="space-y-2">
            {[
              { label: "Browse Courses", href: "/courses", icon: BookOpen, bg: "bg-indigo-50", color: "text-indigo-500", emoji: "📚" },
              { label: "My Achievements", href: "/achievements", icon: Trophy, bg: "bg-amber-50", color: "text-amber-500", emoji: "🏆" },
              { label: "View Progress", href: "/my-learning", icon: TrendingUp, bg: "bg-emerald-50", color: "text-emerald-500", emoji: "📊" },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.href}
                className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-slate-50 transition-all duration-200 group"
              >
                <div className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <action.icon className={`w-[18px] h-[18px] ${action.color}`} />
                </div>
                <span className="text-slate-600 text-sm font-medium group-hover:text-slate-800 transition-colors flex-1">
                  {action.label}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recommended Courses */}
        <div className="lg:col-span-2 card rounded-2xl p-6 animate-fade-in-up stagger-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <h3 className="text-slate-800 font-bold">Recommended for You</h3>
            </div>
            <Link to="/courses" className="text-indigo-500 text-sm font-semibold hover:text-indigo-700 transition-colors flex items-center gap-1 group">
              View All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-indigo-300" />
              </div>
              <p className="text-slate-500 text-sm font-medium">No courses available yet</p>
              <p className="text-slate-300 text-xs mt-1">Courses will appear here once published</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courses.map((course, i) => {
                const hue = (course.course_id * 47) % 360;
                return (
                  <Link
                    key={course.course_id}
                    to={`/courses/${course.course_id}`}
                    className={`group p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all duration-200 animate-fade-in-up stagger-${i + 7}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{ background: `hsl(${hue}, 80%, 94%)` }}
                      >
                        <BookOpen className="w-5 h-5" style={{ color: `hsl(${hue}, 60%, 45%)` }} />
                      </div>
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                        course.difficulty_level === "beginner" ? "bg-emerald-50 text-emerald-600" :
                        course.difficulty_level === "intermediate" ? "bg-amber-50 text-amber-600" :
                        "bg-red-50 text-red-500"
                      }`}>
                        {course.difficulty_level}
                      </span>
                    </div>
                    <h4 className="text-slate-700 font-semibold text-sm group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {course.title}
                    </h4>
                    <p className="text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                      {course.short_description || "Explore this course to learn more."}
                    </p>
                    <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-300 font-medium">
                      <span>{course.duration_weeks}w</span>
                      <span className="w-1 h-1 rounded-full bg-slate-200" />
                      <span>{course.enrollment_count} enrolled</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
