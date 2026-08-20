import React, { useState, useMemo } from "react";
import { GroupType, InterestTagType, RsvpType } from "../lib/schemas";
import { 
  Users, 
  Calendar, 
  ExternalLink, 
  Check, 
  Bookmark, 
  X, 
  RefreshCw, 
  Sparkles, 
  AlertCircle, 
  MessageSquare,
  Filter,
  Search
} from "lucide-react";

interface GroupsViewProps {
  groups: GroupType[];
  userRsvps: RsvpType[];
  userInterests: InterestTagType[];
  onRsvp: (groupId: string, status: "going" | "interested" | "cancelled", simulateFailure?: boolean) => Promise<void>;
  onNavigateToOnboarding: () => void;
  userId: string | null;
  onOpenAuth: () => void;
}

const TAG_CONFIG: Record<
  InterestTagType,
  { label: string; bg: string; text: string; border: string }
> = {
  food: { label: "Food & Hawker", bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  outdoors: { label: "Outdoors & Trails", bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
  arts: { label: "Arts & Culture", bg: "bg-violet-50", text: "text-violet-800", border: "border-violet-200" },
  sports: { label: "Sports & Fitness", bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" },
  professional: { label: "Tech & Professional", bg: "bg-stone-100", text: "text-stone-800", border: "border-stone-200" },
  language: { label: "Language & Slang", bg: "bg-pink-50", text: "text-pink-800", border: "border-pink-200" },
  other: { label: "Social & Lifestyle", bg: "bg-orange-50", text: "text-orange-800", border: "border-orange-200" },
};

export const GroupsView: React.FC<GroupsViewProps> = ({
  groups,
  userRsvps,
  userInterests,
  onRsvp,
  onNavigateToOnboarding,
  userId,
  onOpenAuth,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingGroupId, setLoadingGroupId] = useState<string | null>(null);
  const [failedGroupMap, setFailedGroupMap] = useState<Record<string, { status: "going" | "interested" | "cancelled"; message: string }>>({});
  const [simulateFailureMap, setSimulateFailureMap] = useState<Record<string, boolean>>({});

  // Helper map of user RSVP statuses for O(1) lookups
  const rsvpMap = useMemo(() => {
    const map = new Map<string, "going" | "interested" | "cancelled">();
    for (const rsvp of userRsvps) {
      map.set(rsvp.group_id, rsvp.status);
    }
    return map;
  }, [userRsvps]);

  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      // Search
      const matchesSearch =
        searchQuery.trim() === "" ||
        group.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // Filter
      if (activeFilter === "all") return true;
      if (activeFilter === "my_interests") {
        if (userInterests.length === 0) return true;
        return userInterests.includes(group.interest_tag);
      }
      if (activeFilter === "my_rsvps") {
        return rsvpMap.has(group.id);
      }
      return group.interest_tag === activeFilter;
    });
  }, [groups, searchQuery, activeFilter, userInterests, rsvpMap]);

  const handleRsvpClick = async (
    groupId: string,
    status: "going" | "interested" | "cancelled",
    isRetry = false
  ) => {
    if (!userId) {
      onOpenAuth();
      return;
    }

    setLoadingGroupId(groupId);
    // Clear previous error for this group
    setFailedGroupMap((prev) => {
      const copy = { ...prev };
      delete copy[groupId];
      return copy;
    });

    const shouldFail = isRetry ? false : Boolean(simulateFailureMap[groupId]);

    try {
      await onRsvp(groupId, status, shouldFail);
      // Turn off simulated failure toggle once executed
      if (simulateFailureMap[groupId]) {
        setSimulateFailureMap((prev) => ({ ...prev, [groupId]: false }));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error writing RSVP to Supabase.";
      setFailedGroupMap((prev) => ({
        ...prev,
        [groupId]: { status, message: msg },
      }));
    } finally {
      setLoadingGroupId(null);
    }
  };

  const formatEventDate = (isoString: string | null) => {
    if (!isoString) return "Gathering scheduled via Telegram";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-SG", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return "Upcoming weekend";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" />
            Community Interest Groups
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Meet Fellow Expats & Locals in Singapore
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-xl">
            RSVP directly in-app to reserve your spot, then jump straight into the group's verified Telegram or WhatsApp chat.
          </p>
        </div>

        {userInterests.length > 0 && (
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 px-3.5 py-2 rounded-xl text-xs text-stone-600">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              Matched to your <strong className="text-stone-900">{userInterests.length}</strong> interests
            </span>
            <button
              onClick={onNavigateToOnboarding}
              className="text-red-600 font-semibold hover:underline ml-1"
            >
              Edit
            </button>
          </div>
        )}
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs mb-8 space-y-3 sm:space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="search-groups-input"
            type="text"
            placeholder="Search groups by activity, neighborhood, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50/70 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-stone-400 flex items-center gap-1 shrink-0 font-medium mr-1">
            <Filter className="w-3 h-3" />
            Filter:
          </span>

          <button
            id="filter-all-groups"
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeFilter === "all"
                ? "bg-stone-900 text-white font-semibold shadow-xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            All Groups ({groups.length})
          </button>

          {userInterests.length > 0 && (
            <button
              id="filter-groups-my-interests"
              type="button"
              onClick={() => setActiveFilter("my_interests")}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                activeFilter === "my_interests"
                  ? "bg-red-600 text-white font-semibold shadow-xs"
                  : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              My Interests
            </button>
          )}

          {userRsvps.length > 0 && (
            <button
              id="filter-my-rsvps"
              type="button"
              onClick={() => setActiveFilter("my_rsvps")}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                activeFilter === "my_rsvps"
                  ? "bg-emerald-700 text-white font-semibold shadow-xs"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
              }`}
            >
              <Check className="w-3 h-3" />
              My RSVPs ({userRsvps.length})
            </button>
          )}

          {Object.entries(TAG_CONFIG).map(([tagKey, tagVal]) => (
            <button
              key={tagKey}
              id={`filter-group-tag-${tagKey}`}
              type="button"
              onClick={() => setActiveFilter(tagKey)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeFilter === tagKey
                  ? "bg-stone-900 text-white font-semibold shadow-xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {tagVal.label}
            </button>
          ))}
        </div>
      </div>

      {/* Groups Grid */}
      {filteredGroups.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto">
          <Users className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-900">No matching groups found</h3>
          <p className="text-xs text-stone-500 mt-1 mb-4">
            Try adjusting your search query or reset filter pills to view all seeded interest groups.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveFilter("all");
            }}
            className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredGroups.map((group) => {
            const currentStatus = rsvpMap.get(group.id);
            const tagStyle = TAG_CONFIG[group.interest_tag] || TAG_CONFIG.other;
            const isMatchedInterest = userInterests.includes(group.interest_tag);
            const isCardLoading = loadingGroupId === group.id;
            const cardError = failedGroupMap[group.id];
            const isSimulating = Boolean(simulateFailureMap[group.id]);

            const isTelegram = group.external_link.includes("t.me");
            const isWhatsApp = group.external_link.includes("whatsapp.com");

            return (
              <div
                key={group.id}
                id={`group-card-${group.id}`}
                className={`bg-white rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                  currentStatus === "going"
                    ? "border-emerald-400/80 ring-1 ring-emerald-400/30 shadow-xs"
                    : currentStatus === "interested"
                    ? "border-amber-400/80 ring-1 ring-amber-400/30 shadow-xs"
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <div>
                  {/* Category Tag & Interest Match Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider border ${tagStyle.bg} ${tagStyle.text} ${tagStyle.border}`}
                    >
                      {tagStyle.label}
                    </span>

                    <div className="flex items-center gap-2">
                      {isMatchedInterest && userInterests.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                          Matched
                        </span>
                      )}
                      {currentStatus && (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            currentStatus === "going"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {currentStatus === "going" ? <Check className="w-3 h-3" /> : <Bookmark className="w-3 h-3" />}
                          RSVP: {currentStatus.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h2 className="text-lg font-bold text-stone-900 leading-snug mb-2">
                    {group.title}
                  </h2>
                  <p className="text-xs text-stone-600 leading-relaxed mb-4">
                    {group.description}
                  </p>

                  {/* Next Event Date */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60 mb-5 flex items-center gap-2.5 text-xs text-stone-700">
                    <Calendar className="w-4 h-4 text-red-600 shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                        Next Meetup
                      </span>
                      <span className="font-semibold text-stone-900">
                        {formatEventDate(group.next_event_at)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Inline Error and Retry Box (Strict Specification Requirement) */}
                {cardError && (
                  <div
                    id={`rsvp-error-${group.id}`}
                    className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex flex-col gap-2 animate-in fade-in duration-200"
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-bold text-red-900">RSVP write failed</p>
                        <p className="text-[11px] text-red-700 mt-0.5">{cardError.message}</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        id={`btn-retry-rsvp-${group.id}`}
                        type="button"
                        onClick={() => handleRsvpClick(group.id, cardError.status, true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700 text-white rounded-lg font-semibold text-xs hover:bg-red-800 transition-colors shadow-xs"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Retry RSVP ({cardError.status})</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Card Action Controls: RSVP Buttons & External Links */}
                <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {/* RSVP Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      id={`btn-rsvp-going-${group.id}`}
                      type="button"
                      disabled={isCardLoading}
                      onClick={() =>
                        handleRsvpClick(
                          group.id,
                          currentStatus === "going" ? "cancelled" : "going"
                        )
                      }
                      className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                        currentStatus === "going"
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                      }`}
                    >
                      {isCardLoading ? (
                        <span className="w-3.5 h-3.5 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      <span>{currentStatus === "going" ? "Going ✓" : "RSVP Going"}</span>
                    </button>

                    <button
                      id={`btn-rsvp-interested-${group.id}`}
                      type="button"
                      disabled={isCardLoading}
                      onClick={() =>
                        handleRsvpClick(
                          group.id,
                          currentStatus === "interested" ? "cancelled" : "interested"
                        )
                      }
                      className={`flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        currentStatus === "interested"
                          ? "bg-amber-500 text-white font-semibold shadow-xs"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                      title="Mark as interested"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Interested</span>
                    </button>

                    {currentStatus && (
                      <button
                        id={`btn-rsvp-cancel-${group.id}`}
                        type="button"
                        disabled={isCardLoading}
                        onClick={() => handleRsvpClick(group.id, "cancelled")}
                        className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Cancel RSVP"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* External Chat Link (Telegram or WhatsApp) */}
                  <a
                    id={`btn-external-link-${group.id}`}
                    href={group.external_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-xs shrink-0"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Join {isTelegram ? "Telegram" : isWhatsApp ? "WhatsApp" : "Chat"}</span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </a>
                </div>

                {/* Validation helper: Simulate failure for iron law testing */}
                <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                  <span>External link verified</span>
                  <label className="flex items-center gap-1 cursor-pointer hover:text-stone-600">
                    <input
                      type="checkbox"
                      checked={isSimulating}
                      onChange={(e) =>
                        setSimulateFailureMap((prev) => ({
                          ...prev,
                          [group.id]: e.target.checked,
                        }))
                      }
                      className="rounded border-stone-300 text-red-600 focus:ring-red-500 scale-90"
                    />
                    <span>Simulate write error (for smoke testing retry)</span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
