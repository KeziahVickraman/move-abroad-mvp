import React, { useState } from "react";
import { GroupType, RsvpType } from "../lib/schemas";
import { CULTURE_ARTICLES, CultureArticle } from "../lib/cultureContent";
import { 
  Bookmark, 
  CheckCircle2, 
  Calendar, 
  BookOpen, 
  ExternalLink, 
  X, 
  MessageSquare,
  Sparkles,
  ArrowRight
} from "lucide-react";

interface SavedViewProps {
  groups: GroupType[];
  userRsvps: RsvpType[];
  savedArticleSlugs: string[];
  onCancelRsvp: (groupId: string) => Promise<void>;
  onRemoveBookmark: (slug: string) => void;
  onOpenArticle: (article: CultureArticle) => void;
  onNavigate: (tab: "home" | "discover" | "learn" | "local_now" | "saved" | "profile") => void;
}

export const SavedView: React.FC<SavedViewProps> = ({
  groups,
  userRsvps,
  savedArticleSlugs,
  onCancelRsvp,
  onRemoveBookmark,
  onOpenArticle,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "rsvps" | "articles">("all");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const groupMap = new Map<string, GroupType>(groups.map((g) => [g.id, g]));
  const activeRsvps = userRsvps.filter((r) => r.status !== "cancelled");
  const bookmarkedArticles = CULTURE_ARTICLES.filter((a) => savedArticleSlugs.includes(a.slug));

  const totalSaved = activeRsvps.length + bookmarkedArticles.length;

  const handleCancelRsvp = async (groupId: string) => {
    setCancellingId(groupId);
    try {
      await onCancelRsvp(groupId);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 pt-6 pb-24 space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-red-600 uppercase tracking-wider">
          <Bookmark className="w-3.5 h-3.5 fill-red-600 text-red-600" />
          <span>Personal Hub</span>
        </div>
        <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight mt-0.5">
          Saved & RSVP'd
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Your active community meetups and bookmarked Singapore cultural lessons.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl text-xs">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 py-2 rounded-xl font-bold transition-all ${
            activeTab === "all" ? "bg-white text-stone-900 shadow-xs" : "text-stone-500 hover:text-stone-800"
          }`}
        >
          All ({totalSaved})
        </button>
        <button
          onClick={() => setActiveTab("rsvps")}
          className={`flex-1 py-2 rounded-xl font-bold transition-all ${
            activeTab === "rsvps" ? "bg-white text-stone-900 shadow-xs" : "text-stone-500 hover:text-stone-800"
          }`}
        >
          RSVP'd Meetups ({activeRsvps.length})
        </button>
        <button
          onClick={() => setActiveTab("articles")}
          className={`flex-1 py-2 rounded-xl font-bold transition-all ${
            activeTab === "articles" ? "bg-white text-stone-900 shadow-xs" : "text-stone-500 hover:text-stone-800"
          }`}
        >
          Guides ({bookmarkedArticles.length})
        </button>
      </div>

      {totalSaved === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">No items saved yet</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto leading-relaxed">
              Swipe right on Discover cards to RSVP, or bookmark guides in the Learn feed to save them here.
            </p>
          </div>

          <div className="flex gap-2 justify-center pt-2">
            <button
              onClick={() => onNavigate("discover")}
              className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors"
            >
              Swipe Discover
            </button>
            <button
              onClick={() => onNavigate("learn")}
              className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
            >
              Browse Learn
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 1. RSVP'd Groups Section */}
          {(activeTab === "all" || activeTab === "rsvps") && activeRsvps.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5 px-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Confirmed Meetups ({activeRsvps.length})</span>
              </h2>

              {activeRsvps.map((rsvp) => {
                const group = groupMap.get(rsvp.group_id);
                if (!group) return null;

                return (
                  <div
                    key={rsvp.group_id}
                    className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            rsvp.status === "going"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {rsvp.status.toUpperCase()}
                        </span>
                        <span className="text-xs font-bold text-stone-900">
                          {group.title}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 line-clamp-1">
                        {group.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={group.external_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Chat</span>
                        <ExternalLink className="w-3 h-3 text-stone-400" />
                      </a>

                      <button
                        onClick={() => handleCancelRsvp(group.id)}
                        disabled={cancellingId === group.id}
                        className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Cancel RSVP"
                      >
                        {cancellingId === group.id ? (
                          <span className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin block" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 2. Bookmarked Cultural Guides Section */}
          {(activeTab === "all" || activeTab === "articles") && bookmarkedArticles.length > 0 && (
            <div className="space-y-3 pt-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5 px-1">
                <BookOpen className="w-3.5 h-3.5 text-red-600" />
                <span>Bookmarked Culture Guides ({bookmarkedArticles.length})</span>
              </h2>

              {bookmarkedArticles.map((article) => (
                <div
                  key={article.slug}
                  className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-between gap-3 group"
                >
                  <div 
                    onClick={() => onOpenArticle(article)}
                    className="space-y-1 flex-1 cursor-pointer"
                  >
                    <h3 className="text-xs font-bold text-stone-900 group-hover:text-red-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-[11px] text-stone-500 line-clamp-1">
                      {article.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onOpenArticle(article)}
                      className="px-3 py-1.5 bg-stone-100 text-stone-700 hover:bg-stone-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => onRemoveBookmark(article.slug)}
                      className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      title="Remove bookmark"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
