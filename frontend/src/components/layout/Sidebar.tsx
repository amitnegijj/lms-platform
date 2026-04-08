import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const studentLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/courses", label: "Courses", icon: BookOpen },
  { to: "/my-learning", label: "My Learning", icon: GraduationCap },
  { to: "/achievements", label: "Achievements", icon: Trophy },
];

const instructorLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/courses", label: "Courses", icon: BookOpen },
  { to: "/students", label: "Students", icon: Users },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

const adminLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/courses", label: "Courses", icon: BookOpen },
  { to: "/users", label: "Users", icon: Users },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const links =
    user?.role === "admin"
      ? adminLinks
      : user?.role === "instructor"
      ? instructorLinks
      : studentLinks;

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 flex flex-col bg-white border-r border-slate-100 transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-200/50">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <span className="text-slate-800 font-extrabold text-lg tracking-tight animate-fade-in">
            LearnHub
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {!collapsed && (
          <div className="px-3 mb-3">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Menu</span>
          </div>
        )}
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-indigo-500 to-purple-500" />
              )}
              <Icon
                className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                  isActive ? "text-indigo-500" : "text-slate-300 group-hover:text-slate-500"
                }`}
              />
              {!collapsed && <span>{link.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-slate-100 p-3 space-y-2">
        {/* Upgrade card */}
        {!collapsed && (
          <div className="mx-1 mb-2 p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/50">
            <Sparkles className="w-4 h-4 text-amber-500 mb-2" />
            <p className="text-slate-700 text-xs font-bold mb-0.5">Upgrade to Pro</p>
            <p className="text-slate-400 text-[10px] leading-relaxed">Unlock advanced features & premium courses</p>
          </div>
        )}

        {/* User info */}
        {!collapsed && user && (
          <div className="px-3 py-2.5 flex items-center gap-3 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 shadow-sm shadow-indigo-200">
              {user.first_name[0]}{user.last_name[0]}
            </div>
            <div className="min-w-0">
              <p className="text-slate-700 text-sm font-semibold truncate">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-slate-400 text-[10px] capitalize font-medium">{user.role}</p>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all w-full"
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && <span>Log Out</span>}
        </button>

        {/* Collapse toggle */}
        <button
          type="button"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 rounded-lg text-slate-300 hover:text-slate-500 hover:bg-slate-50 transition-all"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
