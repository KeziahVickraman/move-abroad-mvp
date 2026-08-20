import React from "react";
import { UserProfile } from "../lib/supabase";
import { Compass, Users, BookOpen, User, LogIn, Sparkles, MapPin } from "lucide-react";

interface NavbarProps {
  currentTab: "landing" | "onboarding" | "learn" | "groups" | "profile";
  onNavigate: (tab: "landing" | "onboarding" | "learn" | "groups" | "profile") => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  user,
  onOpenAuth,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          id="nav-brand-logo"
          onClick={() => onNavigate(user ? "learn" : "landing")}
          className="flex items-center gap-2.5 text-left group transition-transform active:scale-98"
        >
          <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-sm shadow-red-600/20 group-hover:bg-red-700 transition-colors">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-stone-900 tracking-tight text-lg">
                MoveAbroad <span className="text-red-600">SG</span>
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-700 border border-red-200/60">
                MVP-1
              </span>
            </div>
            <p className="text-[11px] text-stone-500 hidden sm:flex items-center gap-1">
              <MapPin className="w-3 h-3 text-red-500" />
              Singapore Expat & Student Assimilation
            </p>
          </div>
        </button>

        {/* Navigation items */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {user ? (
            <>
              <button
                id="nav-tab-learn"
                onClick={() => onNavigate("learn")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentTab === "learn"
                    ? "bg-red-50 text-red-700 font-semibold"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Learn</span>
              </button>

              <button
                id="nav-tab-groups"
                onClick={() => onNavigate("groups")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentTab === "groups"
                    ? "bg-red-50 text-red-700 font-semibold"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Groups</span>
              </button>

              <button
                id="nav-tab-profile"
                onClick={() => onNavigate("profile")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentTab === "profile" || currentTab === "onboarding"
                    ? "bg-stone-900 text-white font-semibold"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="nav-btn-explore"
                onClick={() => onNavigate("learn")}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                Explore Guides
              </button>
              <button
                id="nav-btn-signin"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-all shadow-sm active:scale-98"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
