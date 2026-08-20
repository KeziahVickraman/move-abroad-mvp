import React, { useState } from "react";
import { Compass, Users, BookOpen, ArrowRight, ShieldCheck, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import DisqusThread from "../DisqusThread";

interface LandingViewProps {
  onStartAuth: (email: string) => Promise<void>;
  onExploreAsGuest: () => void;
  isLoading: boolean;
  error: string | null;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartAuth,
  onExploreAsGuest,
  isLoading,
  error,
}) => {
  const [emailInput, setEmailInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) return;
    try {
      await onStartAuth(emailInput.trim());
      setSubmitted(true);
    } catch {
      // handled by parent error state
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmailInput("keziah@moveabroad.sg");
    await onStartAuth("keziah@moveabroad.sg");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-semibold uppercase tracking-wider mb-6">
          <Compass className="w-3.5 h-3.5" />
          Singapore Expat & Student Relocation Guide
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.15] mb-6">
          Assimilate into Singapore like a seasoned local.
        </h1>

        <p className="text-base sm:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed mb-10">
          Curated culture guides on hawker etiquette and Singlish, paired with vetted community interest groups and instant RSVPs to local gatherings.
        </p>

        {/* Auth Box / Magic Link Form */}
        <div className="max-w-md mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm text-left">
          <h2 className="text-lg font-bold text-stone-900 mb-1">
            Get started with your email
          </h2>
          <p className="text-xs text-stone-500 mb-5">
            Sign up or sign in instantly with magic link or local profile.
          </p>

          {error && (
            <div
              id="landing-auth-error"
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2"
            >
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          {submitted && !error ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-semibold">Authentication Link Prepared</p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Redirecting to onboarding and community feeds...
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="auth-email-input" className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Email address
                </label>
                <input
                  id="auth-email-input"
                  type="email"
                  required
                  placeholder="e.g. alex@company.com or student@nus.edu.sg"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                />
              </div>

              <button
                id="btn-submit-magic-link"
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 active:scale-98 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Continue to Onboarding</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500">
            <button
              id="btn-quick-demo"
              type="button"
              onClick={handleQuickDemoLogin}
              className="text-stone-700 font-semibold hover:text-red-600 transition-colors underline underline-offset-2"
            >
              ⚡ Instant Demo (Keziah)
            </button>
            <button
              id="btn-guest-browse"
              type="button"
              onClick={onExploreAsGuest}
              className="text-stone-500 hover:text-stone-800 transition-colors"
            >
              Browse guides as guest →
            </button>
          </div>
        </div>
      </section>

      {/* Feature Pillar Highlights */}
      <section className="py-12 bg-stone-50/80 border-t border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-md mx-auto mb-10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500">
              Built for Fast Assimilation
            </h3>
            <p className="text-xl font-bold text-stone-900 mt-1">
              Everything you need in your first 90 days
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Learn Pillar */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-stone-900 mb-1.5">Curated Local Guides</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Learn the unspoken rules: hawker table choping, MRT escalator discipline, Singlish particles (Lah, Leh, Lor), and neighborhood vibes.
              </p>
            </div>

            {/* Groups Pillar */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-stone-900 mb-1.5">Vetted Interest Groups</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Food crawlers, trail hikers at MacRitchie, beach volleyball, tech founders, and language exchanges with direct RSVP tracking.
              </p>
            </div>

            {/* External Chat Pillar */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 mb-4">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-stone-900 mb-1.5">Real Chats on Telegram</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                No noisy custom social network to learn. Tap RSVP, then jump straight into verified Telegram & WhatsApp community groups.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Talk to us Section */}
      <section className="py-10 px-4 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">Talk to us</h2>
            <p className="text-xs sm:text-sm text-stone-500 max-w-lg mx-auto leading-relaxed">
              Have questions, feedback, or recommendations for Singapore newcomers? Join the discussion below.
            </p>
          </div>
          <div className="pt-2">
            <DisqusThread />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-stone-200 text-center text-xs text-stone-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>MoveAbroad SG — Singapore Relocation & Assimilation Hub</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Supabase Auth & Database Ready
          </span>
        </div>
      </footer>
    </div>
  );
};
