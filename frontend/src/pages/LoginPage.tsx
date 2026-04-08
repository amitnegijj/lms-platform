import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, Mail, Lock, ArrowRight, Eye, EyeOff, BookOpen, Trophy, BarChart3, Star } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-auth flex relative overflow-hidden">
      {/* Dot pattern */}
      <div className="absolute inset-0 bg-dots opacity-40 pointer-events-none" />

      {/* Decorative blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-indigo-100/60 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-cyan-100/60 blur-3xl" />

      {/* Left Panel — Branding */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center px-16 relative">
        <div className="absolute top-24 right-16 animate-float">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center shadow-lg shadow-amber-100/50">
            <Star className="w-8 h-8 text-amber-500" />
          </div>
        </div>
        <div className="absolute bottom-32 right-24 animate-float" style={{ animationDelay: "1s" }}>
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shadow-lg shadow-emerald-100/50">
            <Trophy className="w-6 h-6 text-emerald-500" />
          </div>
        </div>

        <div className="relative z-10 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <span className="text-slate-800 text-2xl font-extrabold tracking-tight">LearnHub</span>
          </div>

          <h1 className="text-5xl font-extrabold text-slate-800 leading-[1.15] mb-6 tracking-tight">
            Learn, Grow &<br />
            <span className="text-gradient">Achieve More!</span>
          </h1>

          <p className="text-slate-500 text-lg max-w-md leading-relaxed">
            Your one-stop platform for amazing courses, fun quizzes, and tracking your progress. Let's make learning awesome!
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 mt-10">
            {[
              { icon: BookOpen, label: "200+ Courses", bg: "bg-indigo-50", color: "text-indigo-600", iconColor: "text-indigo-500" },
              { icon: Trophy, label: "Earn Badges", bg: "bg-amber-50", color: "text-amber-700", iconColor: "text-amber-500" },
              { icon: BarChart3, label: "Track Progress", bg: "bg-emerald-50", color: "text-emerald-700", iconColor: "text-emerald-500" },
            ].map((item) => (
              <div key={item.label} className={`flex items-center gap-2 px-4 py-2.5 rounded-full ${item.bg} animate-wiggle`}>
                <item.icon className={`w-4 h-4 ${item.iconColor}`} />
                <span className={`text-sm font-semibold ${item.color}`}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-10 mt-14">
            {[
              { value: "10K+", label: "Happy Students", emoji: "🎓" },
              { value: "200+", label: "Courses", emoji: "📚" },
              { value: "98%", label: "Love It!", emoji: "❤️" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-extrabold text-slate-800">
                  {stat.value} <span className="text-xl">{stat.emoji}</span>
                </p>
                <p className="text-slate-400 text-sm font-medium mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-16 relative z-10">
        <div className="w-full max-w-md animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-200">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-slate-800 text-xl font-extrabold">LearnHub</span>
          </div>

          {/* Form card */}
          <div className="card p-8 shadow-xl shadow-slate-200/50">
            <h2 className="text-2xl font-extrabold text-slate-800 mb-1.5">Welcome back! 👋</h2>
            <p className="text-slate-400 mb-7">Sign in to continue learning</p>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm animate-scale-in flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-slate-600 text-sm font-semibold mb-2">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    id="login-email"
                    type="email"
                    className="input-field pl-10"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 text-sm font-semibold mb-2">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    className="input-field pl-10 pr-10"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-500 accent-indigo-500" />
                  <span className="text-slate-400 text-sm group-hover:text-slate-600 transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-indigo-500 text-sm font-medium hover:text-indigo-700 transition-colors">
                  Forgot password?
                </a>
              </div>

              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-[15px]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 my-7">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-slate-300 text-xs font-medium">OR</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            <p className="text-center text-slate-400 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-indigo-500 font-semibold hover:text-indigo-700 transition-colors">
                Create one free!
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
