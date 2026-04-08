import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-mesh flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex w-5/12 flex-col justify-center px-16 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/15 blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-56 h-56 rounded-full bg-accent/10 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

        <div className="relative z-10 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366f1, #06b6d4)" }}>
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <span className="text-white text-2xl font-bold tracking-tight">LMS Platform</span>
          </div>

          <h1 className="text-4xl font-extrabold text-white leading-tight mb-6">
            Start Your
            <br />
            <span className="text-gradient">Learning Adventure</span>
          </h1>

          <p className="text-white/50 text-lg max-w-md leading-relaxed">
            Join thousands of learners. Create your account and unlock a world of knowledge.
          </p>

          <div className="mt-10 space-y-4">
            {[
              "Access 200+ premium courses",
              "Track progress with detailed analytics",
              "Earn certificates & badges",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white/60">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-primary-light" />
                </div>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Register Form */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-16 py-10">
        <div className="w-full max-w-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366f1, #06b6d4)" }}>
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-xl font-bold">LMS Platform</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Create your account</h2>
          <p className="text-white/40 mb-8">Fill in your details to get started</p>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/60 text-sm font-medium mb-2">First Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    id="register-firstname"
                    type="text"
                    className="input-field pl-10"
                    placeholder="John"
                    value={form.first_name}
                    onChange={(e) => updateField("first_name", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/60 text-sm font-medium mb-2">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    id="register-lastname"
                    type="text"
                    className="input-field pl-10"
                    placeholder="Doe"
                    value={form.last_name}
                    onChange={(e) => updateField("last_name", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-white/60 text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  id="register-email"
                  type="email"
                  className="input-field pl-10"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-white/60 text-sm font-medium mb-2">Phone (optional)</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  id="register-phone"
                  type="tel"
                  className="input-field pl-10"
                  placeholder="+91 98765 43210"
                  value={form.phone_number}
                  onChange={(e) => updateField("phone_number", e.target.value)}
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-white/60 text-sm font-medium mb-2">I am a</label>
              <div className="grid grid-cols-3 gap-3">
                {["student", "instructor", "admin"].map((role) => (
                  <button
                    type="button"
                    key={role}
                    onClick={() => updateField("role", role)}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all border ${
                      form.role === role
                        ? "bg-primary/15 border-primary/40 text-primary-light"
                        : "bg-white/4 border-white/8 text-white/40 hover:bg-white/8 hover:text-white/60"
                    }`}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-white/60 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  className="input-field pl-10 pr-10"
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-white/60 text-sm font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  id="register-confirm-password"
                  type={showPassword ? "text" : "password"}
                  className="input-field pl-10"
                  placeholder="••••••••"
                  value={form.confirm_password}
                  onChange={(e) => updateField("confirm_password", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-light font-medium hover:text-primary transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
