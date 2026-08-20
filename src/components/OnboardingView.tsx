import React, { useState } from "react";
import { InterestTagType } from "../lib/schemas";
import { 
  Utensils, 
  Mountain, 
  Palette, 
  Trophy, 
  Briefcase, 
  Languages, 
  Sparkles, 
  Check, 
  ArrowRight 
} from "lucide-react";

interface OnboardingViewProps {
  initialTags?: InterestTagType[];
  onSaveInterests: (tags: InterestTagType[]) => Promise<void>;
  isLoading: boolean;
}

interface TagOption {
  id: InterestTagType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const TAG_OPTIONS: TagOption[] = [
  {
    id: "food",
    label: "Hawker & Food Culture",
    description: "Hawker centres, tze char feasts, Michelin stalls, and kopi orders",
    icon: <Utensils className="w-5 h-5 text-amber-600" />,
  },
  {
    id: "outdoors",
    label: "Outdoors & Nature",
    description: "MacRitchie Reservoir, Southern Ridges, and Rail Corridor trails",
    icon: <Mountain className="w-5 h-5 text-emerald-600" />,
  },
  {
    id: "arts",
    label: "Arts & Culture",
    description: "Heritage shophouses, SAM exhibitions, theater, and urban sketching",
    icon: <Palette className="w-5 h-5 text-violet-600" />,
  },
  {
    id: "sports",
    label: "Sports & Fitness",
    description: "East Coast volleyball, dragon boating, running, and climbing",
    icon: <Trophy className="w-5 h-5 text-blue-600" />,
  },
  {
    id: "professional",
    label: "Tech & Professional",
    description: "Expats in tech, founder meetups, networking, and career mixers",
    icon: <Briefcase className="w-5 h-5 text-stone-700" />,
  },
  {
    id: "language",
    label: "Language & Dialects",
    description: "Singlish nuances, conversational Mandarin, and Hokkien idioms",
    icon: <Languages className="w-5 h-5 text-pink-600" />,
  },
  {
    id: "other",
    label: "Social & Lifestyle",
    description: "Board game nights, festival celebrations, and general expat life",
    icon: <Sparkles className="w-5 h-5 text-orange-600" />,
  },
];

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  initialTags = [],
  onSaveInterests,
  isLoading,
}) => {
  const [selectedTags, setSelectedTags] = useState<InterestTagType[]>(initialTags);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleTag = (tag: InterestTagType) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSelectAll = () => {
    if (selectedTags.length === TAG_OPTIONS.length) {
      setSelectedTags([]);
    } else {
      setSelectedTags(TAG_OPTIONS.map((t) => t.id));
    }
  };

  const handleSubmit = async () => {
    if (selectedTags.length === 0) {
      setErrorMsg("Please select at least 1 interest to customize your feed.");
      return;
    }
    setErrorMsg(null);
    try {
      await onSaveInterests(selectedTags);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to save profile interests.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold uppercase tracking-wider mb-3">
          Step 1 of 1 • Profile Onboarding
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          What are your interests in Singapore?
        </h1>
        <p className="text-sm text-stone-600 mt-2">
          We will customize your <strong className="text-stone-800">Learn</strong> cultural feed and recommend matching <strong className="text-stone-800">Community Groups</strong>.
        </p>
      </div>

      {errorMsg && (
        <div
          id="onboarding-error-banner"
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium"
        >
          {errorMsg}
        </div>
      )}

      {/* Quick Select All Toggle */}
      <div className="flex justify-end mb-4">
        <button
          id="btn-select-all-interests"
          type="button"
          onClick={handleSelectAll}
          className="text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          {selectedTags.length === TAG_OPTIONS.length
            ? "Deselect All"
            : "Select All (Recommended)"}
        </button>
      </div>

      {/* Grid of Interests */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
        {TAG_OPTIONS.map((tag) => {
          const isSelected = selectedTags.includes(tag.id);
          return (
            <button
              key={tag.id}
              id={`tag-option-${tag.id}`}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className={`flex items-start gap-3.5 p-4 rounded-2xl border text-left transition-all relative ${
                isSelected
                  ? "bg-red-50/70 border-red-500/80 shadow-xs ring-1 ring-red-500/20"
                  : "bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/50"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isSelected ? "bg-white shadow-xs" : "bg-stone-100"
                }`}
              >
                {tag.icon}
              </div>
              <div className="flex-1 pr-6">
                <h3 className="text-sm font-bold text-stone-900">{tag.label}</h3>
                <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                  {tag.description}
                </p>
              </div>
              {/* Checkmark badge */}
              <div
                className={`absolute top-4 right-4 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  isSelected
                    ? "bg-red-600 text-white"
                    : "border border-stone-300 text-transparent"
                }`}
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="sticky bottom-4 bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-stone-200 shadow-md flex items-center justify-between gap-4">
        <div className="text-xs text-stone-600">
          <span className="font-bold text-stone-900">{selectedTags.length}</span> of {TAG_OPTIONS.length} interests selected
        </div>

        <button
          id="btn-save-onboarding"
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || selectedTags.length === 0}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 active:scale-98 transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Save & View Feed</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
