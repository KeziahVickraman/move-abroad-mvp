import React, { useState, useMemo } from "react";
import { GroupType, InterestTagType, ExternalEventType, RsvpType } from "../lib/schemas";
import { 
  Heart, 
  X, 
  Info, 
  RotateCcw, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  Sparkles, 
  Check, 
  MessageSquare,
  Ticket
} from "lucide-react";

export interface DiscoverCardItem {
  id: string;
  type: "group" | "external_event";
  title: string;
  interest_tag: InterestTagType;
  description: string;
  source: "community_group" | "eventbrite" | "meetup" | "ticketmaster";
  start_at: string | null;
  venue?: string;
  external_link: string;
}

interface DiscoverSwipeViewProps {
  groups: GroupType[];
  externalEvents: ExternalEventType[];
  userRsvps: RsvpType[];
  userInterests: InterestTagType[];
  onRsvp: (groupId: string, status: "going" | "interested" | "cancelled") => Promise<void>;
  onOpenAuth: () => void;
  userId: string | null;
}

const TAG_COLORS: Record<InterestTagType, { bg: string; text: string; border: string }> = {
  food: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  outdoors: { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
  arts: { bg: "bg-violet-50", text: "text-violet-800", border: "border-violet-200" },
  sports: { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" },
  professional: { bg: "bg-stone-100", text: "text-stone-800", border: "border-stone-200" },
  language: { bg: "bg-pink-50", text: "text-pink-800", border: "border-pink-200" },
  other: { bg: "bg-orange-50", text: "text-orange-800", border: "border-orange-200" },
};

export const DiscoverSwipeView: React.FC<DiscoverSwipeViewProps> = ({
  groups,
  externalEvents,
  userRsvps,
  userInterests,
  onRsvp,
  onOpenAuth,
  userId,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedDetailCard, setSelectedDetailCard] = useState<DiscoverCardItem | null>(null);
  const [swipeFeedback, setSwipeFeedback] = useState<"like" | "pass" | null>(null);

  // Combine Groups and External Live Events into unified discoverable cards
  const allCards: DiscoverCardItem[] = useMemo(() => {
    const groupItems: DiscoverCardItem[] = groups.map((g) => ({
      id: g.id,
      type: "group",
      title: g.title,
      interest_tag: g.interest_tag,
      description: g.description || "Local community gathering for Singapore expats and residents.",
      source: "community_group",
      start_at: g.next_event_at,
      venue: "Singapore Location (Coordinated in Chat)",
      external_link: g.external_link,
    }));

    const eventItems: DiscoverCardItem[] = externalEvents.map((e) => ({
      id: e.external_id,
      type: "external_event",
      title: e.title,
      interest_tag: e.interest_tag || "other",
      description: `Live event discovered via ${e.source.toUpperCase()} Singapore. Connect with fellow attendees and RSVP directly.`,
      source: e.source,
      start_at: e.start_at,
      venue: e.venue || "Singapore Venue",
      external_link: e.external_link,
    }));

    return [...groupItems, ...eventItems];
  }, [groups, externalEvents]);

  // Filtered deck
  const filteredCards = useMemo(() => {
    return allCards.filter((card) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "my_interests") {
        if (userInterests.length === 0) return true;
        return userInterests.includes(card.interest_tag);
      }
      return card.interest_tag === activeFilter;
    });
  }, [allCards, activeFilter, userInterests]);

  const currentCard = filteredCards[currentIndex];

  const isCurrentRsvpd = currentCard
    ? userRsvps.some((r) => r.group_id === currentCard.id && r.status === "going")
    : false;

  const handleSwipeRight = async () => {
    if (!currentCard) return;
    setSwipeFeedback("like");
    setTimeout(() => setSwipeFeedback(null), 400);

    if (userId) {
      // If it's a seeded group, write to RSVP table
      if (currentCard.type === "group") {
        await onRsvp(currentCard.id, "going");
      }
    } else {
      onOpenAuth();
    }

    if (currentIndex < filteredCards.length) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSwipeLeft = () => {
    if (!currentCard) return;
    setSwipeFeedback("pass");
    setTimeout(() => setSwipeFeedback(null), 400);
    if (currentIndex < filteredCards.length) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleResetDeck = () => {
    setCurrentIndex(0);
    setSwipeFeedback(null);
  };

  const formatEventDate = (isoString: string | null) => {
    if (!isoString) return "Upcoming Weekend";
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
      return "Dates coordinated via chat";
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-4 pb-24 space-y-4 animate-in fade-in duration-200">
      {/* Top Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          id="discover-filter-all"
          onClick={() => { setActiveFilter("all"); setCurrentIndex(0); }}
          className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
            activeFilter === "all"
              ? "bg-stone-900 text-white shadow-xs"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          All Deck ({allCards.length})
        </button>

        {userInterests.length > 0 && (
          <button
            id="discover-filter-my-interests"
            onClick={() => { setActiveFilter("my_interests"); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
              activeFilter === "my_interests"
                ? "bg-red-600 text-white shadow-xs"
                : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            My Interests
          </button>
        )}

        {(["food", "outdoors", "arts", "sports", "professional", "language"] as InterestTagType[]).map((tag) => (
          <button
            key={tag}
            id={`discover-filter-${tag}`}
            onClick={() => { setActiveFilter(tag); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap capitalize transition-all ${
              activeFilter === tag
                ? "bg-stone-900 text-white shadow-xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Swipeable Card Stage */}
      <div className="relative min-h-[460px] flex flex-col justify-center">
        {currentCard ? (
          <div
            id={`discover-card-${currentCard.id}`}
            className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-md flex flex-col justify-between relative overflow-hidden transition-all duration-300 transform min-h-[460px]"
          >
            {/* Feedback Stamp on swipe */}
            {swipeFeedback === "like" && (
              <div className="absolute top-8 right-8 rotate-12 border-4 border-emerald-500 text-emerald-600 font-black text-2xl px-4 py-1 rounded-2xl bg-white/90 backdrop-blur-xs z-30 animate-pulse">
                GOING!
              </div>
            )}
            {swipeFeedback === "pass" && (
              <div className="absolute top-8 left-8 -rotate-12 border-4 border-stone-400 text-stone-500 font-black text-2xl px-4 py-1 rounded-2xl bg-white/90 backdrop-blur-xs z-30 animate-pulse">
                SKIP
              </div>
            )}

            {/* Top Card Badges */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${
                    TAG_COLORS[currentCard.interest_tag]?.bg || "bg-stone-100"
                  } ${TAG_COLORS[currentCard.interest_tag]?.text || "text-stone-800"} ${
                    TAG_COLORS[currentCard.interest_tag]?.border || "border-stone-200"
                  }`}
                >
                  {currentCard.interest_tag}
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 uppercase">
                  {currentCard.source === "community_group" ? (
                    <>
                      <MessageSquare className="w-3 h-3 text-emerald-600" />
                      MoveAbroad Community
                    </>
                  ) : (
                    <>
                      <Ticket className="w-3 h-3 text-red-600" />
                      {currentCard.source.toUpperCase()} SG
                    </>
                  )}
                </span>
              </div>

              {/* Title & Description */}
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 leading-snug tracking-tight mb-3">
                {currentCard.title}
              </h2>

              <p className="text-sm text-stone-600 leading-relaxed line-clamp-4 mb-6">
                {currentCard.description}
              </p>

              {/* Event Time & Location details */}
              <div className="space-y-2.5 bg-stone-50 p-4 rounded-2xl border border-stone-200/60 mb-4 text-xs">
                <div className="flex items-center gap-2 text-stone-700">
                  <Calendar className="w-4 h-4 text-red-600 shrink-0" />
                  <div>
                    <span className="font-semibold text-stone-900">
                      {formatEventDate(currentCard.start_at)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-stone-600">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="line-clamp-1">{currentCard.venue}</span>
                </div>
              </div>
            </div>

            {/* Bottom Card Controls / Actions */}
            <div>
              <div className="flex items-center justify-between text-xs text-stone-400 mb-4 px-2">
                <span>Card {currentIndex + 1} of {filteredCards.length}</span>
                <button
                  id="btn-card-expand-info"
                  onClick={() => setSelectedDetailCard(currentCard)}
                  className="text-stone-700 font-bold hover:text-red-600 flex items-center gap-1"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>View Full Details</span>
                </button>
              </div>

              {/* Tinder-style Big Action Buttons */}
              <div className="grid grid-cols-3 gap-3">
                {/* Skip / Pass */}
                <button
                  id="btn-discover-pass"
                  onClick={handleSwipeLeft}
                  className="flex flex-col items-center justify-center py-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-600 active:scale-95 transition-all shadow-xs"
                >
                  <X className="w-6 h-6 stroke-[2.5]" />
                  <span className="text-[10px] font-bold mt-1 uppercase">Skip</span>
                </button>

                {/* Info / Expand */}
                <button
                  id="btn-discover-info"
                  onClick={() => setSelectedDetailCard(currentCard)}
                  className="flex flex-col items-center justify-center py-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 active:scale-95 transition-all shadow-xs"
                >
                  <Info className="w-6 h-6 stroke-[2]" />
                  <span className="text-[10px] font-bold mt-1 uppercase">Details</span>
                </button>

                {/* RSVP / Like */}
                <button
                  id="btn-discover-like"
                  onClick={handleSwipeRight}
                  className="flex flex-col items-center justify-center py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white active:scale-95 transition-all shadow-md shadow-red-600/20"
                >
                  <Heart className="w-6 h-6 fill-white stroke-white stroke-[2]" />
                  <span className="text-[10px] font-bold mt-1 uppercase">RSVP Going</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Deck State */
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm text-center space-y-4 max-w-sm mx-auto">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">You've Caught Up!</h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                You've reviewed all available community groups and live Singapore event cards in this category.
              </p>
            </div>

            <button
              id="btn-discover-reset-deck"
              onClick={handleResetDeck}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-stone-800 active:scale-98 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Review Deck Again</span>
            </button>
          </div>
        )}
      </div>

      {/* Card Detail Modal */}
      {selectedDetailCard && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden max-h-[85vh] flex flex-col">
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-red-50 text-red-700">
                  {selectedDetailCard.interest_tag}
                </span>
                <button
                  onClick={() => setSelectedDetailCard(null)}
                  className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h2 className="text-xl font-extrabold text-stone-900 leading-tight">
                {selectedDetailCard.title}
              </h2>

              <p className="text-sm text-stone-600 leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-200/60">
                {selectedDetailCard.description}
              </p>

              <div className="space-y-2 text-xs text-stone-700">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-600 shrink-0" />
                  <span className="font-semibold">{formatEventDate(selectedDetailCard.start_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{selectedDetailCard.venue}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center gap-3">
              <a
                id="btn-discover-open-external"
                href={selectedDetailCard.external_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-stone-800 transition-colors"
              >
                <span>Open {selectedDetailCard.source === "community_group" ? "Telegram / WhatsApp Chat" : "Official Event Link"}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setSelectedDetailCard(null)}
                className="py-3 px-4 rounded-xl border border-stone-200 text-stone-600 font-semibold text-xs hover:bg-stone-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
