import React, { useState, useMemo } from "react";
import { InterestTagType } from "../lib/schemas";
import { CULTURE_ARTICLES, CultureArticle } from "../lib/cultureContent";
import { Search, BookOpen, Clock, Tag, ArrowRight, Sparkles, Filter } from "lucide-react";

interface LearnViewProps {
  userInterests: InterestTagType[];
  onSelectArticle: (article: CultureArticle) => void;
  onNavigateToOnboarding: () => void;
}

const ALL_TAGS: { id: InterestTagType; label: string }[] = [
  { id: "food", label: "Food & Hawker" },
  { id: "outdoors", label: "Outdoors" },
  { id: "arts", label: "Arts & Culture" },
  { id: "sports", label: "Sports" },
  { id: "professional", label: "Professional" },
  { id: "language", label: "Language" },
  { id: "other", label: "Social" },
];

export const LearnView: React.FC<LearnViewProps> = ({
  userInterests,
  onSelectArticle,
  onNavigateToOnboarding,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filteredArticles = useMemo(() => {
    return CULTURE_ARTICLES.filter((article) => {
      // 1. Search filter
      const matchesSearch =
        searchQuery.trim() === "" ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // 2. Tag filter
      if (activeFilter === "all") return true;
      if (activeFilter === "my_interests") {
        if (userInterests.length === 0) return true;
        return article.interest_tags.some((tag) => userInterests.includes(tag));
      }
      return article.interest_tags.includes(activeFilter as InterestTagType);
    });
  }, [searchQuery, activeFilter, userInterests]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            Learn & Assimilate
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Live Like a Local in Singapore
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-xl">
            Practical cultural briefings covering daily life norms, hawker rituals, and communication cues.
          </p>
        </div>

        {userInterests.length > 0 && (
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 px-3.5 py-2 rounded-xl text-xs text-stone-600">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              Filtered to your <strong className="text-stone-900">{userInterests.length}</strong> saved interests
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

      {/* Controls Bar: Search & Tag Filter Pills */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs mb-8 space-y-3 sm:space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="search-articles-input"
            type="text"
            placeholder="Search guides (e.g. 'chope', 'kopi', 'mrt', 'singlish', 'rent')..."
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
            id="filter-all-articles"
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeFilter === "all"
                ? "bg-stone-900 text-white font-semibold shadow-xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            All Guides ({CULTURE_ARTICLES.length})
          </button>

          {userInterests.length > 0 && (
            <button
              id="filter-my-interests"
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

          {ALL_TAGS.map((tag) => (
            <button
              key={tag.id}
              id={`filter-tag-${tag.id}`}
              type="button"
              onClick={() => setActiveFilter(tag.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeFilter === tag.id
                  ? "bg-stone-900 text-white font-semibold shadow-xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto">
          <BookOpen className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-900">No matching guides found</h3>
          <p className="text-xs text-stone-500 mt-1 mb-4">
            Try adjusting your search keywords or reset filter pills to view all guides.
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
          {filteredArticles.map((article) => {
            const isUserMatched = article.interest_tags.some((t) =>
              userInterests.includes(t)
            );

            return (
              <div
                key={article.id}
                id={`article-card-${article.slug}`}
                onClick={() => onSelectArticle(article)}
                className="group bg-white rounded-2xl p-6 border border-stone-200 hover:border-red-500/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Top tags & badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex flex-wrap gap-1.5">
                      {article.interest_tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-stone-100 text-stone-700 uppercase tracking-wider"
                        >
                          <Tag className="w-2.5 h-2.5 text-stone-400" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      {isUserMatched && userInterests.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                          Matched
                        </span>
                      )}
                      <span className="text-xs text-stone-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <h2 className="text-lg font-bold text-stone-900 group-hover:text-red-600 transition-colors leading-snug mb-2">
                    {article.title}
                  </h2>
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3 mb-4">
                    {article.summary}
                  </p>
                </div>

                {/* Footer read link */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-red-600 group-hover:translate-x-0.5 transition-transform">
                  <span>Read full guide & local tips</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
