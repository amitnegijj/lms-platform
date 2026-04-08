import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff, CheckCircle, Rocket, BookOpen, Award } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    phone_number: "",
    role: "student",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await register({
        email: form.email,
        password: form.password,
        first_name: form.first_name,
        last_name: form.last_name,
        phone_number: form.phone_number || undefined,
        role: form.role,
      });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: "student", label: "Student", emoji: "🎓", desc: "Learn & grow" },
    { value: "instructor", label: "Instructor", emoji: "👨‍🏫", desc: "Teach & inspire" },
    { value: "admin", label: "Admin", emoji: "⚙️", desc: "Manage platform" },
  ];

  return (
    <div className="min-h-screen bg-auth flex relative overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-40 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-purple-100/60 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-cyan-100/60 blur-3xl" />

      {/* Left Panel */}
      <div className="hidden lg:flex w-5/12 flex-col justify-center px-16 relative">
        <div className="absolute top-24 right-20 animate-float">
          <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center shadow-lg shadow-pink-100/50">
            <Rocket className="w-7 h-7 text-pink-500" />
          </div>
        </div>
        <div className="absolute bottom-40 right-12 animate-float" style={{ animationDelay: "1.5s" }}>
          <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center shadow-lg shadow-indigo-100/50">
            <BookOpen className="w-5 h-5 text-indigo-500" />
          </div>
        </div>

        <div className="relative z-10 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <span className="text-slate-800 text-2xl font-extrabold tracking-tight">LearnHub</span>
          </div>

          <h1 className="text-4xl font-extrabold text-slate-800 leading-[1.15] mb-6 tracking-tight">
            Start Your<br />
            <span className="text-gradient">Learning Adventure!</span>
          </h1>

          <p className="text-slate-500 text-lg max-w-md leading-relaxed">
            Join thousands of students. Create your free account and unlock a world of knowledge!
          </p>

          <div className="mt-10 space-y-4">
            {[
              { icon: BookOpen, text: "Access 200+ fun courses", color: "text-indigo-500", bg: "bg-indigo-50" },
              { icon: Award, text: "Earn certificates & badges", color: "text-amber-500", bg: "bg-amber-50" },
              { icon: CheckCircle, text: "Track your progress easily", color: "text-emerald-500", bg: "bg-emerald-50" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}>
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <span className="text-slate-500 text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-16 py-8 relative z-10">
        <div className="w-full max-w-lg animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-200">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-slate-800 text-xl font-extrabold">LearnHub</span>
          </div>

          <div className="card p-8 shadow-xl shadow-slate-200/50">
            <h2 className="text-2xl font-extrabold text-slate-800 mb-1.5">Create your account 🚀</h2>
            <p className="text-slate-400 mb-7">It's free! Let's get you started</p>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm animate-scale-in flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 text-sm font-semibold mb-2">First Name</label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <input id="register-firstname" type="text" className="input-field pl-10" placeholder="John" value={form.first_name} onChange={(e) => updateField("first_name", e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-600 text-sm font-semibold mb-2">Last Name</label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <input id="register-lastname" type="text" className="input-field pl-10" placeholder="Doe" value={form.last_name} onChange={(e) => updateField("last_name", e.target.value)} required />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 text-sm font-semibold mb-2">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                  <input id="register-email" type="email" className="input-field pl-10" placeholder="you@example.com" value={form.email} onChange={(e) => updateField("email", e.target.value)} required />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 text-sm font-semibold mb-2">
                  Phone <span className="text-slate-300 font-normal">(optional)</span>
                </label>
                <div className="relative group">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                  <input id="register-phone" type="tel" className="input-field pl-10" placeholder="+91 98765 43210" value={form.phone_number} onChange={(e) => updateField("phone_number", e.target.value)} />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 text-sm font-semibold mb-2">I am a</label>
                <div className="grid grid-cols-3 gap-3">
                  {roleOptions.map((role) => (
                    <button
                      type="button"
                      key={role.value}
                      onClick={() => updateField("role", role.value)}
                      className={`py-3 px-2 rounded-xl text-center transition-all duration-300 border-2 ${
                        form.role === role.value
                          ? "bg-indigo-50 border-indigo-200 shadow-md shadow-indigo-100/50"
                          : "bg-slate-50 border-transparent hover:bg-white hover:border-slate-200"
                      }`}
                    >
                      <span className="text-lg block mb-0.5">{role.emoji}</span>
                      <span className={`text-xs font-bold block ${form.role === role.value ? "text-indigo-600" : "text-slate-500"}`}>
                        {role.label}
                      </span>
                      <span className={`text-[10px] block ${form.role === role.value ? "text-indigo-400" : "text-slate-300"}`}>
                        {role.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-600 text-sm font-semibold mb-2">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                  <input id="register-password" type={showPassword ? "text" : "password"} className="input-field pl-10 pr-10" placeholder="Min 6 characters" value={form.password} onChange={(e) => updateField("password", e.target.value)} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 text-sm font-semibold mb-2">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                  <input id="register-confirm-password" type={showPassword ? "text" : "password"} className="input-field pl-10" placeholder="Re-enter password" value={form.confirm_password} onChange={(e) => updateField("confirm_password", e.target.value)} required />
                </div>
              </div>

              <button id="register-submit" type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-[15px] mt-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Create Account <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <p className="text-center text-slate-400 text-sm mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-500 font-semibold hover:text-indigo-700 transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
