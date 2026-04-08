import { useAuth } from "../../context/AuthContext";
import { Bell, Search, Command } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const { user } = useAuth();
  const [searchFocused, setSearchFocused] = useState(false);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-lg border-b border-slate-100">
      {/* Left: Greeting */}
      <div>
        <h2 className="text-slate-800 text-lg font-bold tracking-tight">
          {greeting()}, {user?.first_name} 👋
        </h2>
        <p className="text-slate-400 text-sm">
          Let's continue your learning journey
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all duration-300 ${
            searchFocused
              ? "border-indigo-200 bg-white w-72 shadow-md shadow-indigo-100/30"
              : "border-slate-100 bg-slate-50 w-48"
          }`}
        >
          <Search className="w-4 h-4 text-slate-300 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-slate-700 text-sm w-full placeholder:text-slate-300"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {!searchFocused && (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium text-slate-300 border border-slate-100 bg-white">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          )}
        </div>

        {/* Notifications */}
        <button
          type="button"
          title="Notifications"
          className="relative p-2.5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-200 transition-all"
        >
          <Bell className="w-[18px] h-[18px] text-slate-400" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full ring-2 ring-white" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-indigo-200/50 transition-all shadow-sm shadow-indigo-200/30">
          {user?.first_name?.[0]}{user?.last_name?.[0]}
        </div>
      </div>
    </header>
  );
}
