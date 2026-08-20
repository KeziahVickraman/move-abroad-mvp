import React from "react";
import { CultureArticle } from "../lib/cultureContent";
import { X, Clock, Tag, BookOpen, Lightbulb, Share2, Check } from "lucide-react";

interface ArticleModalProps {
  article: CultureArticle | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!article) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
            <BookOpen className="w-4 h-4 text-red-600" />
            <span>Singapore Cultural Primer</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-article-share"
              onClick={handleCopyLink}
              title="Share article link"
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors text-xs flex items-center gap-1"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              id="btn-close-article-modal"
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {article.interest_tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200/60"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* Title & Summary */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-tight">
              {article.title}
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-200/60">
              {article.summary}
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-6 pt-2">
            {article.sections.map((section, idx) => (
              <div key={idx} className="space-y-3">
                <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  {section.heading}
                </h2>
                <div className="space-y-2 text-sm text-stone-700 leading-relaxed">
                  {section.content.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                </div>

                {section.tips && section.tips.length > 0 && (
                  <div className="mt-3 p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-xl space-y-1 text-xs text-amber-900">
                    <div className="font-bold flex items-center gap-1.5 text-amber-800">
                      <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Local Insider Tip</span>
                    </div>
                    {section.tips.map((tip, tIdx) => (
                      <p key={tIdx} className="pl-5">{tip}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Glossary */}
          {article.quickGlossary && article.quickGlossary.length > 0 && (
            <div className="mt-8 pt-6 border-t border-stone-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-3">
                Quick Glossary for this Guide
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {article.quickGlossary.map((item, gIdx) => (
                  <div
                    key={gIdx}
                    className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 text-xs"
                  >
                    <span className="font-bold text-stone-900 text-sm block">
                      "{item.term}"
                    </span>
                    <span className="text-stone-600 mt-0.5 block">
                      {item.meaning}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <span>MoveAbroad SG Cultural Knowledge Base</span>
          <button
            id="btn-close-article-footer"
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-800 transition-colors"
          >
            Done Reading
          </button>
        </div>
      </div>
    </div>
  );
};
