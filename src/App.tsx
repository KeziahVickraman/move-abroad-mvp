import { useState, useEffect, useCallback } from "react";
import { 
  authService, 
  groupsService, 
  UserProfile 
} from "./lib/supabase";
import { 
  GroupType, 
  InterestTagType, 
  RsvpType, 
  WeatherNowType, 
  BusArrivalType, 
  ExternalEventType, 
  FxRateType 
} from "./lib/schemas";
import { CultureArticle } from "./lib/cultureContent";
import { liveApiService } from "./lib/apiServices";

// Components
import { BottomTabBar, NavTab } from "./components/BottomTabBar";
import { HomeTodayView } from "./components/HomeTodayView";
import { DiscoverSwipeView } from "./components/DiscoverSwipeView";
import { LearnSnapFeed } from "./components/LearnSnapFeed";
import { LocalNowView } from "./components/LocalNowView";
import { SavedView } from "./components/SavedView";
import { ProfileView } from "./components/ProfileView";
import { LandingView } from "./components/LandingView";
import { OnboardingView } from "./components/OnboardingView";
import { ArticleModal } from "./components/ArticleModal";

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>("home");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [userRsvps, setUserRsvps] = useState<RsvpType[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<CultureArticle | null>(null);
  
  // Real-time API States (v1.1)
  const [weather, setWeather] = useState<WeatherNowType | null>(null);
  const [busArrivals, setBusArrivals] = useState<BusArrivalType[]>([]);
  const [isBusLive, setIsBusLive] = useState<boolean>(false);
  const [busError, setBusError] = useState<string | undefined>();
  const [fxRates, setFxRates] = useState<FxRateType | null>(null);
  const [mrtStatus, setMrtStatus] = useState<{ line: string; status: "Normal" | "Delayed" | "Maintenance"; note: string }[]>([]);
  const [externalEvents, setExternalEvents] = useState<ExternalEventType[]>([]);
  const [savedBusStop, setSavedBusStop] = useState<string>(() => {
    return localStorage.getItem("moveabroad_bus_stop") || "03211";
  });
  const [savedArticleSlugs, setSavedArticleSlugs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("moveabroad_saved_articles");
      return saved ? JSON.parse(saved) : ["hawker-etiquette-chope"];
    } catch {
      return ["hawker-etiquette-chope"];
    }
  });

  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isRefreshingTelemetry, setIsRefreshingTelemetry] = useState(false);

  // Fetch live telematics (Data.gov.sg, LTA DataMall, FX Rates, MRT)
  const fetchLiveTelemetry = useCallback(async (stopCode: string) => {
    setIsRefreshingTelemetry(true);
    try {
      const [w, b, fx, mrt, events] = await Promise.allSettled([
        liveApiService.getWeatherNow(),
        liveApiService.getBusArrivals(stopCode),
        liveApiService.getFxRates(),
        liveApiService.getMrtStatus(),
        liveApiService.getExternalEvents(),
      ]);

      if (w.status === "fulfilled") setWeather(w.value);
      if (b.status === "fulfilled") {
        setBusArrivals(b.value.arrivals);
        setIsBusLive(b.value.isLive);
        setBusError(b.value.error);
      }
      if (fx.status === "fulfilled") setFxRates(fx.value);
      if (mrt.status === "fulfilled") setMrtStatus(mrt.value);
      if (events.status === "fulfilled") setExternalEvents(events.value);
    } finally {
      setIsRefreshingTelemetry(false);
    }
  }, []);

  // Load initial app data
  const initializeApp = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);

      const loadedGroups = await groupsService.getGroups();
      setGroups(loadedGroups);

      if (currentUser) {
        const rsvps = await groupsService.getUserRsvps(currentUser.id);
        setUserRsvps(rsvps);
      }

      await fetchLiveTelemetry(savedBusStop);
    } catch (err) {
      console.error("Initialization error:", err);
    } finally {
      setIsInitializing(false);
    }
  }, [fetchLiveTelemetry, savedBusStop]);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  // Auth Handler
  const handleStartAuth = async (email: string) => {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      const userProfile = await authService.signInWithEmail(email);
      setUser(userProfile);
      
      const rsvps = await groupsService.getUserRsvps(userProfile.id);
      setUserRsvps(rsvps);

      if (userProfile.interest_tags.length === 0) {
        setCurrentTab("onboarding");
      } else {
        setCurrentTab("home");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication error occurred.";
      setAuthError(msg);
      throw err;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // Onboarding / Profile Save Interests Handler
  const handleSaveInterests = async (tags: InterestTagType[]) => {
    if (!user) {
      const newUser = await authService.signInWithEmail("keziah@moveabroad.sg");
      const updated = await authService.updateProfileInterests(newUser.id, tags);
      setUser(updated);
    } else {
      const updated = await authService.updateProfileInterests(user.id, tags);
      setUser(updated);
    }
    setCurrentTab("home");
  };

  // Change and persist saved bus stop
  const handleChangeBusStop = async (code: string) => {
    setSavedBusStop(code);
    localStorage.setItem("moveabroad_bus_stop", code);
    await fetchLiveTelemetry(code);
  };

  // RSVP Action Handler
  const handleRsvp = async (
    groupId: string,
    status: "going" | "interested" | "cancelled"
  ) => {
    let activeUserId = user?.id;
    if (!activeUserId) {
      const guest = await authService.signInWithEmail("keziah@moveabroad.sg");
      setUser(guest);
      activeUserId = guest.id;
    }

    await groupsService.saveRsvp(activeUserId, groupId, status);
    const updatedRsvps = await groupsService.getUserRsvps(activeUserId);
    setUserRsvps(updatedRsvps);
  };

  // Toggle Bookmark for Learn articles
  const handleToggleBookmark = (slug: string) => {
    setSavedArticleSlugs((prev) => {
      const updated = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug];
      localStorage.setItem("moveabroad_saved_articles", JSON.stringify(updated));
      return updated;
    });
  };

  // Sign out
  const handleSignOut = async () => {
    await authService.signOut();
    setUser(null);
    setUserRsvps([]);
    setCurrentTab("home");
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
        <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-stone-700">Loading MoveAbroad SG (v1.1)...</p>
        <p className="text-xs text-stone-400 mt-1">Connecting Data.gov.sg & Singapore telematics</p>
      </div>
    );
  }

  const activeRsvpsCount = userRsvps.filter((r) => r.status !== "cancelled").length;
  const totalSavedCount = activeRsvpsCount + savedArticleSlugs.length;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans antialiased selection:bg-red-100 selection:text-red-900 pb-16">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div 
            onClick={() => setCurrentTab("home")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-xs shadow-xs group-hover:scale-105 transition-transform">
              SG
            </div>
            <div>
              <span className="text-sm font-extrabold tracking-tight text-stone-900 block leading-tight">
                MoveAbroad <span className="text-red-600">SG</span>
              </span>
              <span className="text-[9px] text-stone-400 font-semibold uppercase tracking-wider block">
                Relocation & Assimilation Hub
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Feed
            </span>

            {user ? (
              <button
                onClick={() => setCurrentTab("profile")}
                className="w-7 h-7 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center hover:ring-2 hover:ring-red-500 transition-all"
                title={user.email}
              >
                {user.email.charAt(0).toUpperCase()}
              </button>
            ) : (
              <button
                onClick={() => setCurrentTab("landing")}
                className="px-2.5 py-1 bg-stone-900 text-white rounded-lg text-[11px] font-semibold hover:bg-stone-800 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Routed Content Screens */}
      <main className="flex-1">
        {currentTab === "home" && (
          <HomeTodayView
            weather={weather}
            busArrivals={busArrivals}
            savedBusStop={savedBusStop}
            featuredGroup={groups[0] || null}
            userRsvps={userRsvps}
            onRsvp={handleRsvp}
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenArticle={(article) => setSelectedArticle(article)}
          />
        )}

        {currentTab === "discover" && (
          <DiscoverSwipeView
            groups={groups}
            externalEvents={externalEvents}
            userRsvps={userRsvps}
            userInterests={user?.interest_tags || []}
            onRsvp={handleRsvp}
            onOpenAuth={() => setCurrentTab("landing")}
            userId={user?.id || null}
          />
        )}

        {currentTab === "learn" && (
          <LearnSnapFeed
            savedArticleSlugs={savedArticleSlugs}
            onToggleBookmark={handleToggleBookmark}
            onOpenFullArticle={(article) => setSelectedArticle(article)}
          />
        )}

        {currentTab === "local_now" && (
          <LocalNowView
            weather={weather}
            busArrivals={busArrivals}
            isBusLive={isBusLive}
            busError={busError}
            fxRates={fxRates}
            mrtStatus={mrtStatus}
            currentBusStop={savedBusStop}
            onChangeBusStop={handleChangeBusStop}
            onRefreshAll={() => fetchLiveTelemetry(savedBusStop)}
            isRefreshing={isRefreshingTelemetry}
          />
        )}

        {currentTab === "saved" && (
          <SavedView
            groups={groups}
            userRsvps={userRsvps}
            savedArticleSlugs={savedArticleSlugs}
            onCancelRsvp={(groupId) => handleRsvp(groupId, "cancelled")}
            onRemoveBookmark={handleToggleBookmark}
            onOpenArticle={(article) => setSelectedArticle(article)}
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === "profile" && (
          <ProfileView
            userEmail={user?.email || null}
            userInterests={user?.interest_tags || []}
            savedBusStop={savedBusStop}
            onSaveInterests={handleSaveInterests}
            onSaveBusStop={handleChangeBusStop}
            onSignOut={handleSignOut}
          />
        )}

        {currentTab === "landing" && (
          <LandingView
            onStartAuth={handleStartAuth}
            onExploreAsGuest={() => setCurrentTab("home")}
            isLoading={isLoadingAuth}
            error={authError}
          />
        )}

        {currentTab === "onboarding" && (
          <OnboardingView
            initialTags={user?.interest_tags || []}
            onSaveInterests={handleSaveInterests}
            isLoading={isLoadingAuth}
          />
        )}
      </main>

      {/* Fixed Bottom Tab Bar */}
      <BottomTabBar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        savedCount={totalSavedCount}
      />

      {/* Cultural Article Reader Modal */}
      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </div>
  );
}
