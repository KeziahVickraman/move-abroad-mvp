import { useEffect, useState } from "react";

const SHORTNAME = "move-abroad";
// Exact URL configured in your Disqus admin dashboard screenshot:
const REGISTERED_PAGE_URL = "https://move-abroad-30fa2cqll-keziahvickraman-s-projects.vercel.app/";
const PAGE_ID = "team-page";

export default function DisqusThread() {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      // Determine canonical URL: prefer registered URL or current canonical path
      const canonicalUrl = typeof window !== "undefined" && window.location.origin.includes("vercel.app")
        ? window.location.href.split("#")[0]
        : REGISTERED_PAGE_URL;

      window.disqus_config = function () {
        this.page.url = canonicalUrl;
        this.page.identifier = PAGE_ID;
        this.page.title = "MoveAbroad SG Community Discussion";
      };

      if (window.DISQUS) {
        try {
          window.DISQUS.reset({ reload: true, config: window.disqus_config });
          setIsLoaded(true);
        } catch {
          // ignore reset error
        }
      } else {
        const existingScript = document.getElementById("disqus-embed");
        if (existingScript) {
          existingScript.remove();
        }

        const s = document.createElement("script");
        s.id = "disqus-embed";
        s.src = "https://" + SHORTNAME + ".disqus.com/embed.js";
        s.setAttribute("data-timestamp", String(Date.now()));
        s.async = true;
        s.onload = () => {
          setIsLoaded(true);
        };
        s.onerror = () => {
          setHasError(true);
        };
        (document.head || document.body).appendChild(s);
      }
    } catch {
      setHasError(true);
    }
  }, []);

  return (
    <div className="w-full">
      <div id="disqus_thread" className="w-full min-h-[320px]" />
      
      {/* Helper guide if Disqus needs domain permission */}
      {!isLoaded && (
        <div className="text-center py-4 px-3 text-xs text-stone-500 bg-stone-50 rounded-2xl border border-stone-200 mt-2 space-y-1.5">
          <p className="font-semibold text-stone-700">
            Disqus Forum: <code className="text-red-600 font-bold">{SHORTNAME}</code>
          </p>
          <p className="text-[11px] text-stone-500 leading-relaxed max-w-md mx-auto">
            Connected to <strong>{REGISTERED_PAGE_URL}</strong>.
          </p>
          <div className="pt-1 text-[11px] text-stone-400">
            To allow comments to load on all preview links, in Disqus Admin go to:
            <br />
            <strong className="text-stone-600">Settings → General → Trusted Domains</strong> and add <code>vercel.app</code> and <code>run.app</code>.
          </div>
        </div>
      )}
    </div>
  );
}
