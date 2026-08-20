import { useEffect } from "react";

const SHORTNAME = "move-abroad";
const PAGE_URL = "https://move-abroad-30fa2cqll-keziahvickraman-s-projects.vercel.app/";
const PAGE_ID = "team-page";

export default function DisqusThread() {
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
          // ignore reset exception
        }
      } else if (!document.getElementById("disqus-embed")) {
        const s = document.createElement("script");
        s.id = "disqus-embed";
        s.src = "https://" + SHORTNAME + ".disqus.com/embed.js";
        s.setAttribute("data-timestamp", String(Date.now()));
        s.async = true;
        s.onerror = (e) => {
          console.warn("Disqus embed script notice:", e);
        };
        (document.head || document.body).appendChild(s);
      }
    } catch (err) {
      console.warn("Disqus initialization notice:", err);
    }
  }, []);

  return <div id="disqus_thread" style={{ minHeight: 320 }} />;
}
