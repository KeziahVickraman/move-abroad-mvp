import React from "react";
import { 
  Home, 
  Compass, 
  BookOpen, 
  Radio, 
  Bookmark, 
  User 
} from "lucide-react";

export type NavTab = "home" | "discover" | "learn" | "local_now" | "saved" | "profile" | "onboarding";

interface BottomTabBarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  savedCount: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentTab,
  onTabChange,
  savedCount,
}) => {
  const tabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: "Home", icon: <Home className="w-5 h-5" /> },
    { id: "discover", label: "Discover", icon: <Compass className="w-5 h-5" /> },
    { id: "learn", label: "Learn", icon: <BookOpen className="w-5 h-5" /> },
    { id: "local_now", label: "Local Now", icon: <Radio className="w-5 h-5" /> },
    { id: "saved", label: "Saved", icon: <Bookmark className="w-5 h-5" /> },
    { id: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-stone-200 shadow-lg">
      <div className="max-w-xl mx-auto px-2 sm:px-6 h-16 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-nav-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 relative transition-all active:scale-95 ${
                isActive
                  ? "text-red-600 font-semibold"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.id === "saved" && savedCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center border-2 border-white">
                    {savedCount}
                  </span>
                )}
                {tab.id === "local_now" && (
                  <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight leading-none ${isActive ? "font-bold" : "font-medium"}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-red-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
