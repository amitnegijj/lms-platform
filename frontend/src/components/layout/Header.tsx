import { useAuth } from "../../context/AuthContext";
import { Bell, Search } from "lucide-react";
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
    <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 border-b border-white/5 glass">
      {/* Left: Greeting */}
      <div>
        <h2 className="text-white text-lg font-semibold">
          {greeting()}, {user?.first_name} 👋
        </h2>
        <p className="text-white/40 text-sm">
          Let's continue your learning journey
        </p>
      </div>

      {/* Right: Search + Notifications */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300 ${
            searchFocused
              ? "border-primary/50 bg-white/8 w-64"
              : "border-white/8 bg-white/4 w-44"
          }`}
        >
          <Search className="w-4 h-4 text-white/40 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-white/30"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl border border-white/8 bg-white/4 hover:bg-white/8 transition-all">
          <Bell className="w-4.5 h-4.5 text-white/60" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:scale-105 transition-transform">
          {user?.first_name?.[0]}{user?.last_name?.[0]}
        </div>
      </div>
    </header>
  );
}
