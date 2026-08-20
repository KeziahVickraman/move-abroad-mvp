import React, { useState } from "react";
import { InterestTagType } from "../lib/schemas";
import { API_CATALOG, ApiDocumentationItem } from "../lib/apiServices";
import { 
  User, 
  Sparkles, 
  Bus, 
  Key, 
  Database, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Copy, 
  CheckCheck, 
  Info,
  LogOut,
  Bell,
  Code
} from "lucide-react";

interface ProfileViewProps {
  userEmail: string | null;
  userInterests: InterestTagType[];
  savedBusStop: string;
  onSaveInterests: (interests: InterestTagType[]) => Promise<void>;
  onSaveBusStop: (busStopCode: string) => Promise<void>;
  onSignOut: () => Promise<void>;
}

const ALL_INTERESTS: { id: InterestTagType; label: string; icon: string; desc: string }[] = [
  { id: "food", label: "Food & Hawkers", icon: "🍜", desc: "Hawker centres, kopi stalls, dining clubs" },
  { id: "outdoors", label: "Outdoors & Nature", icon: "🌴", desc: "MacRitchie, Southern Ridges, Pulau Ubin" },
  { id: "arts", label: "Arts & Culture", icon: "🎭", desc: "Esplanade shows, museums, heritage tours" },
  { id: "sports", label: "Sports & Fitness", icon: "⚽", desc: "Running, badminton, climbing, dragon boat" },
  { id: "professional", label: "Professional & Tech", icon: "💼", desc: "Fintech, startups, networking mixers" },
  { id: "language", label: "Language & Singlish", icon: "🗣️", desc: "Singlish practice, language exchange" },
  { id: "other", label: "Expats & Social", icon: "✨", desc: "Weekend brunch, board games, meetups" },
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  userEmail,
  userInterests,
  savedBusStop,
  onSaveInterests,
  onSaveBusStop,
  onSignOut,
}) => {
  const [selectedInterests, setSelectedInterests] = useState<InterestTagType[]>(userInterests);
  const [busStopInput, setBusStopInput] = useState<string>(savedBusStop);
  const [isSavingInterests, setIsSavingInterests] = useState(false);
  const [isSavingBusStop, setIsSavingBusStop] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [expandedApiId, setExpandedApiId] = useState<string | null>(null);

  const toggleInterest = (tag: InterestTagType) => {
    setSelectedInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSaveInterests = async () => {
    setIsSavingInterests(true);
    try {
      await onSaveInterests(selectedInterests);
    } finally {
      setIsSavingInterests(false);
    }
  };

  const handleSaveBusStop = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBusStop(true);
    try {
      await onSaveBusStop(busStopInput.trim() || "03211");
    } finally {
      setIsSavingBusStop(false);
    }
  };

  const handleCopyEnvExample = () => {
    const envSnippet = `# MoveAbroad SG (v1.1) API Configuration
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
LTA_DATAMALL_API_KEY=
EVENTBRITE_OAUTH_TOKEN=
MEETUP_API_KEY=
TICKETMASTER_API_KEY=
ONEMAP_API_TOKEN=
EXCHANGERATE_API_KEY=
TELEGRAM_BOT_TOKEN=`;
    navigator.clipboard.writeText(envSnippet);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2500);
  };

  return (
    <div className="max-w-xl mx-auto px-4 pt-6 pb-28 space-y-6 animate-in fade-in duration-200">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
            {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h1 className="text-base font-extrabold text-stone-900 leading-tight">
              {userEmail || "MoveAbroad Explorer"}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Singapore Relocation Profile</span>
            </p>
          </div>
        </div>

        {userEmail && (
          <button
            id="btn-profile-signout"
            onClick={onSignOut}
            className="p-2.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 1. Commute Preferences (LTA Bus Stop) */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Bus className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900">Saved Home / Commute Bus Stop</h2>
            <p className="text-[11px] text-stone-500">Powers live arrival countdown on your Home & Local Now feeds</p>
          </div>
        </div>

        <form onSubmit={handleSaveBusStop} className="flex gap-2">
          <input
            type="text"
            value={busStopInput}
            onChange={(e) => setBusStopInput(e.target.value)}
            placeholder="e.g. 03211 (Tanjong Pagar), 01019 (Bugis)"
            className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 font-mono focus:outline-none focus:ring-1 focus:ring-red-500"
          />
          <button
            type="submit"
            disabled={isSavingBusStop}
            className="px-4 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors disabled:opacity-50"
          >
            {isSavingBusStop ? "Saving..." : "Save Stop"}
          </button>
        </form>
      </div>

      {/* 2. Interest Tags Editor */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900">Personal Interest Tags</h2>
              <p className="text-[11px] text-stone-500">Customizes your Discover swipe deck and Learn feeds</p>
            </div>
          </div>

          <button
            id="btn-save-interests"
            onClick={handleSaveInterests}
            disabled={isSavingInterests}
            className="px-3.5 py-1.5 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-all shadow-xs disabled:opacity-50"
          >
            {isSavingInterests ? "Saving..." : "Save Tags"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ALL_INTERESTS.map((interest) => {
            const isSelected = selectedInterests.includes(interest.id);
            return (
              <button
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                  isSelected
                    ? "bg-red-50/80 border-red-300 text-red-950 font-semibold"
                    : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                }`}
              >
                <span className="text-lg">{interest.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">{interest.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-red-600" />}
                  </div>
                  <p className="text-[10px] text-stone-400 font-normal mt-0.5">{interest.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. API Integrations Directory & Keys Guide */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900">API Keys & Live Integrations Guide</h2>
              <p className="text-[11px] text-stone-500">Every external data source, signup link & env variable name</p>
            </div>
          </div>

          <button
            onClick={handleCopyEnvExample}
            className="flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors"
          >
            {copiedEnv ? (
              <>
                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy .env</span>
              </>
            )}
          </button>
        </div>

        <div className="p-3.5 bg-blue-50/70 border border-blue-200/70 rounded-2xl text-xs text-blue-900 space-y-1">
          <span className="font-bold flex items-center gap-1 text-blue-950">
            <Info className="w-3.5 h-3.5 text-blue-600" /> How live APIs work in MoveAbroad SG:
          </span>
          <p className="text-[11px] leading-relaxed text-blue-800">
            All free public feeds (Data.gov.sg weather, Open FX rates) are <strong>already live and active out of the box</strong>. For proprietary feeds (LTA DataMall, Eventbrite, Meetup, Ticketmaster, Telegram Bot), add your free API keys in your environment to unlock real-time telematics.
          </p>
        </div>

        {/* API Catalog List */}
        <div className="space-y-2.5 pt-1">
          {API_CATALOG.map((api) => {
            const isExpanded = expandedApiId === api.id;

            return (
              <div
                key={api.id}
                className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-all space-y-2"
              >
                <div 
                  onClick={() => setExpandedApiId(isExpanded ? null : api.id)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900">{api.name}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          api.status === "configured"
                            ? "bg-emerald-100 text-emerald-800"
                            : api.status === "free_no_key_needed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {api.status === "free_no_key_needed"
                          ? "Free • No Key Needed"
                          : api.status === "configured"
                          ? "Key Active"
                          : "Placeholder Ready"}
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-500">{api.category} • {api.provider}</p>
                  </div>

                  <span className="text-xs font-semibold text-stone-400">
                    {isExpanded ? "Hide Details" : "View Setup"}
                  </span>
                </div>

                {isExpanded && (
                  <div className="pt-2 border-t border-stone-200/60 space-y-2 text-xs text-stone-700 animate-in fade-in duration-150">
                    <p className="text-[11px] leading-relaxed text-stone-600">
                      <strong>Purpose:</strong> {api.purpose}
                    </p>

                    <div className="p-2.5 bg-stone-900 text-stone-100 rounded-xl font-mono text-[11px] flex items-center justify-between">
                      <span>Env Var: <strong>{api.envVarName}</strong></span>
                      <button
                        onClick={() => navigator.clipboard.writeText(`${api.envVarName}=`)}
                        className="text-stone-400 hover:text-white text-[10px]"
                      >
                        Copy
                      </button>
                    </div>

                    <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200/60 text-[11px] text-amber-900">
                      <strong>Where to find:</strong> {api.whereToFind}
                    </div>

                    {api.registrationUrl && (
                      <a
                        href={api.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-red-600 font-bold hover:underline"
                      >
                        <span>Open {api.name} Registration Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
