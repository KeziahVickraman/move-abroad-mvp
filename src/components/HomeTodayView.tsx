import React from "react";
import { WeatherNowType, BusArrivalType, GroupType, RsvpType } from "../lib/schemas";
import { CULTURE_ARTICLES, CultureArticle } from "../lib/cultureContent";
import { 
  Sun, 
  CloudRain, 
  Wind, 
  Bus, 
  Users, 
  BookOpen, 
  ArrowRight, 
  Sparkles, 
  Check, 
  Flame, 
  MapPin, 
  Compass,
  MessageSquare
} from "lucide-react";
import DisqusThread from "../DisqusThread";

interface HomeTodayViewProps {
  weather: WeatherNowType | null;
  busArrivals: BusArrivalType[];
  savedBusStop: string;
  featuredGroup: GroupType | null;
  userRsvps: RsvpType[];
  onRsvp: (groupId: string, status: "going" | "interested" | "cancelled") => Promise<void>;
  onNavigate: (tab: "home" | "discover" | "learn" | "local_now" | "saved" | "profile") => void;
  onOpenArticle: (article: CultureArticle) => void;
}

export const HomeTodayView: React.FC<HomeTodayViewProps> = ({
  weather,
  busArrivals,
  savedBusStop,
  featuredGroup,
  userRsvps,
  onRsvp,
  onNavigate,
  onOpenArticle,
}) => {
  const isGoing = featuredGroup 
    ? userRsvps.some((r) => r.group_id === featuredGroup.id && r.status === "going")
    : false;

  const todayLesson = CULTURE_ARTICLES[0]; // Hawker etiquette

  return (
    <div className="max-w-xl mx-auto px-4 pt-6 pb-24 space-y-5 animate-in fade-in duration-200">
      {/* Top Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-red-600 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Singapore Daily Briefing</span>
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight mt-0.5">
            Today in Singapore
          </h1>
        </div>

        <button
          id="home-btn-discover-swipe"
          onClick={() => onNavigate("discover")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs font-bold transition-all active:scale-95 shadow-xs"
        >
          <Flame className="w-3.5 h-3.5 fill-red-600 text-red-600" />
          <span>Swipe Discover</span>
        </button>
      </div>

      {/* 1. Live Weather & PSI Banner (Data.gov.sg) */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white backdrop-blur-xs">
                DATA.GOV.SG LIVE
              </span>
              <span className="text-xs text-stone-300 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-red-400" />
                {weather?.area || "Central Singapore"}
              </span>
            </div>
            <div className="text-3xl font-extrabold tracking-tight mt-1 flex items-baseline gap-2">
              <span>{weather?.temperature_c || 31}°C</span>
              <span className="text-sm font-normal text-stone-300">
                {weather?.forecast || "Partly Cloudy"}
              </span>
            </div>
          </div>

          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
            {weather?.forecast.toLowerCase().includes("rain") ? (
              <CloudRain className="w-7 h-7" />
            ) : (
              <Sun className="w-7 h-7" />
            )}
          </div>
        </div>

        {/* Environmental Indicators */}
        <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block">24h PSI (Air)</span>
              <span className="font-bold text-white">
                {weather?.psi || 42} • <span className="text-emerald-400">Good</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block">UV Index</span>
              <span className="font-bold text-white">
                {weather?.uv_index || 7} • <span className="text-amber-400">Moderate</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Commute & Bus Arrivals (LTA DataMall) */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Bus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900">Your Commute Hub</h2>
              <p className="text-[11px] text-stone-500">Stop #{savedBusStop} • Tanjong Pagar / Downtown</p>
            </div>
          </div>

          <button
            id="home-btn-view-local-now"
            onClick={() => onNavigate("local_now")}
            className="text-xs text-red-600 font-bold hover:underline flex items-center gap-0.5"
          >
            <span>Live Telematics</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Bus services row */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {busArrivals.slice(0, 3).map((bus) => (
            <div
              key={bus.service_no}
              className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-center"
            >
              <span className="text-xs font-black text-stone-900 block">
                Bus {bus.service_no}
              </span>
              <span className="text-base font-extrabold text-emerald-600 mt-0.5 block">
                {bus.eta_min === 0 ? "Arr" : `${bus.eta_min}m`}
              </span>
              <span className="text-[9px] font-semibold text-stone-500 uppercase tracking-tight block">
                {bus.load.replace("_", " ")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Featured Community Gathering (Discover Spotlight) */}
      {featuredGroup && (
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500 uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-red-600" />
              <span>Community Gathering of the Day</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 uppercase">
              {featuredGroup.interest_tag}
            </span>
          </div>

          <div>
            <h2 className="text-base font-bold text-stone-900 leading-snug">
              {featuredGroup.title}
            </h2>
            <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
              {featuredGroup.description}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              id={`home-btn-rsvp-${featuredGroup.id}`}
              onClick={() => onRsvp(featuredGroup.id, isGoing ? "cancelled" : "going")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                isGoing
                  ? "bg-emerald-600 text-white"
                  : "bg-stone-900 text-white hover:bg-stone-800"
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isGoing ? "RSVP'd (Going)" : "RSVP Going"}</span>
            </button>

            <a
              id={`home-btn-chat-${featuredGroup.id}`}
              href={featuredGroup.external_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Join Chat</span>
            </a>
          </div>
        </div>
      )}

      {/* 4. Daily Cultural Snap (Learn Spotlight) */}
      <div 
        onClick={() => onOpenArticle(todayLesson)}
        className="bg-white rounded-2xl p-5 border border-stone-200 hover:border-red-400/80 shadow-xs space-y-2 cursor-pointer group transition-all"
      >
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-red-700">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Daily Cultural Snap</span>
          </div>
          <span className="text-stone-400 group-hover:text-red-600 flex items-center gap-0.5 font-semibold text-[11px]">
            Read in Snap Feed <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        <h3 className="text-sm font-bold text-stone-900 group-hover:text-red-600 transition-colors">
          "{todayLesson.title}"
        </h3>
        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
          {todayLesson.summary}
        </p>

        <div className="pt-2 flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-semibold uppercase">
            {todayLesson.readTime}
          </span>
          <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-semibold">
            Essential Local Etiquette
          </span>
        </div>
      </div>

      {/* 5. Quick App Launch Bar */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          id="home-quick-discover"
          onClick={() => onNavigate("discover")}
          className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-red-500/50 text-left transition-all group"
        >
          <Compass className="w-5 h-5 text-red-600 mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="text-xs font-bold text-stone-900">Discover Groups</h4>
          <p className="text-[10px] text-stone-500 mt-0.5">Swipe through meetups</p>
        </button>

        <button
          id="home-quick-local-now"
          onClick={() => onNavigate("local_now")}
          className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-red-500/50 text-left transition-all group"
        >
          <Wind className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="text-xs font-bold text-stone-900">Local Now</h4>
          <p className="text-[10px] text-stone-500 mt-0.5">Bus, PSI, and FX rates</p>
        </button>
      </div>

      {/* 6. Talk to us Section */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="space-y-1">
          <h2 className="text-base font-extrabold text-stone-900 tracking-tight">Talk to us</h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            Have questions, feedback, or recommendations for MoveAbroad SG? Join the discussion below.
          </p>
        </div>
        <DisqusThread />
      </div>
    </div>
  );
};
