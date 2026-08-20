import React, { useState } from "react";
import { CULTURE_ARTICLES, CultureArticle } from "../lib/cultureContent";
import { 
  BookOpen, 
  Clock, 
  Bookmark, 
  Lightbulb, 
  Share2, 
  ChevronDown, 
  Check, 
  Sparkles,
  Volume2
} from "lucide-react";

interface LearnSnapFeedProps {
  savedArticleSlugs: string[];
  onToggleBookmark: (slug: string) => void;
  onOpenFullArticle: (article: CultureArticle) => void;
}

export const LearnSnapFeed: React.FC<LearnSnapFeedProps> = ({
  savedArticleSlugs,
  onToggleBookmark,
  onOpenFullArticle,
}) => {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const handleShare = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}#${slug}`);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-2 pt-2 pb-20">
      {/* Scroll Hint Bar */}
      <div className="text-center py-2 text-xs font-semibold text-stone-500 flex items-center justify-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>Vertical Snap Feed • Swipe up for next cultural lesson</span>
      </div>

      {/* Snap Container: Native CSS scroll-snap */}
      <div className="h-[calc(100vh-10rem)] overflow-y-scroll snap-y snap-mandatory rounded-3xl space-y-4 pr-1 pb-4 scroll-smooth">
        {CULTURE_ARTICLES.map((article, idx) => {
          const isSaved = savedArticleSlugs.includes(article.slug);

          return (
            <div
              key={article.id}
              id={`snap-card-${article.slug}`}
              className="h-full w-full snap-start snap-always bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-md flex flex-col justify-between relative overflow-hidden"
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-black flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Lesson {idx + 1} of {CULTURE_ARTICLES.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      id={`btn-bookmark-${article.slug}`}
                      onClick={() => onToggleBookmark(article.slug)}
                      className={`p-2 rounded-xl border transition-all ${
                        isSaved
                          ? "bg-red-50 text-red-600 border-red-200"
                          : "text-stone-400 border-stone-200 hover:bg-stone-50"
                      }`}
                      title="Bookmark this lesson"
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? "fill-red-600" : ""}`} />
                    </button>

                    <button
                      id={`btn-share-${article.slug}`}
                      onClick={() => handleShare(article.slug)}
                      className="p-2 rounded-xl border border-stone-200 text-stone-400 hover:text-stone-700 hover:bg-stone-50 transition-colors"
                      title="Copy lesson link"
                    >
                      {copiedSlug === article.slug ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Title & Read time */}
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 leading-tight tracking-tight">
                    {article.title}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-stone-400 pt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{article.readTime}</span>
                    <span>•</span>
                    <span className="uppercase font-semibold text-red-600">
                      {article.interest_tags.join(" & ")}
                    </span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mt-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200/60">
                  {article.summary}
                </p>

                {/* Highlighted Section Snippet */}
                <div className="mt-3.5 space-y-2 text-xs text-stone-700">
                  <h3 className="font-bold text-stone-900 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-red-600" />
                    <span>Core Insight</span>
                  </h3>
                  <div className="space-y-1.5 pl-2 border-l-2 border-red-500/40">
                    {article.sections[0]?.content.slice(0, 2).map((p, pIdx) => (
                      <p key={pIdx} className="line-clamp-2 leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Local Insider Tip Banner */}
                {article.sections[0]?.tips && article.sections[0].tips[0] && (
                  <div className="mt-3.5 p-3 bg-amber-50/90 border border-amber-200/80 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-bold block text-amber-800">Local Pro-Tip:</span>
                      <p className="mt-0.5 line-clamp-2">{article.sections[0].tips[0]}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions & Scroll Prompt */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  id={`btn-open-guide-${article.slug}`}
                  onClick={() => onOpenFullArticle(article)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 text-xs font-semibold transition-all shadow-xs"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Read Complete Guide</span>
                </button>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-stone-400 animate-bounce">
                  <span>Swipe Up</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
