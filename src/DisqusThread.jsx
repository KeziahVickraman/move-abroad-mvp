import { useEffect, useState } from "react";

const SHORTNAME = "move-abroad";
const PAGE_URL = "https://move-abroad-mvp.vercel.app/";
const PAGE_ID = "team-page";

export default function DisqusThread() {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    try {
      window.disqus_config = function () {
        this.page.url = PAGE_URL;
        this.page.identifier = PAGE_ID;
      };

      if (window.DISQUS) {
        try {
          window.DISQUS.reset({ reload: true, config: window.disqus_config });
        } catch {
          // ignore reset error
        }
      } else if (!document.getElementById("disqus-embed")) {
        const s = document.createElement("script");
        s.id = "disqus-embed";
        s.src = "https://" + SHORTNAME + ".disqus.com/embed.js";
        s.setAttribute("data-timestamp", String(Date.now()));
        s.async = true;
        s.crossOrigin = "anonymous";
        s.onerror = () => {
          setHasError(true);
        };
        document.body.appendChild(s);
      }
    } catch {
      setHasError(true);
    }
  }, []);

  return (
    <div className="w-full">
      <div id="disqus_thread" style={{ minHeight: 320 }} />
      {hasError && (
        <div className="text-center py-6 px-4 text-xs text-stone-500 bg-stone-50 rounded-2xl border border-stone-200 mt-2 space-y-1">
          <p className="font-semibold text-stone-700">Disqus Discussion Thread ({SHORTNAME})</p>
          <p className="text-[11px] text-stone-400">
            If comments do not render in the sandboxed preview, ensure the shortname <code>{SHORTNAME}</code> is created on <a href="https://disqus.com/admin/create/" target="_blank" rel="noreferrer" className="text-red-600 underline">Disqus Admin</a> and allowed for domain <code>{PAGE_URL}</code>.
          </p>
        </div>
      )}
    </div>
  );
}
