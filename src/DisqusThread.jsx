import { useEffect } from "react";
const SHORTNAME = "[move-abroad]";
const PAGE_URL  = "[https://move-abroad-mvp.vercel.app/]";
const PAGE_ID   = "team-page";
export default function DisqusThread() {
  useEffect(() => {
    window.disqus_config = function () {
      this.page.url = PAGE_URL;
      this.page.identifier = PAGE_ID;
    };
    if (window.DISQUS) {
      window.DISQUS.reset({ reload: true, config: window.disqus_config });
    } else if (!document.getElementById("disqus-embed")) {
      const s = document.createElement("script");
      s.id = "disqus-embed";
      s.src = "https://" + SHORTNAME + ".disqus.com/embed.js";
      s.setAttribute("data-timestamp", String(Date.now()));
      document.body.appendChild(s);
    }
  }, []);
  return <div id="disqus_thread" style={{ minHeight: 320 }} />;
}
