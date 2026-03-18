(function () {

  const sections = [
    "/planetG/homepage/infobar/infobar.html",
    "/planetG/homepage/header/header.html",
    "/planetG/projectspage/projects_3_columns/P3C_hero/P3C_hero.html",
    "/planetG/projectspage/projects_3_columns/P3C_Cards/P3C_Cards.html",
    "/planetG/projectspage/projects_3_columns/P3C_Garden_Consultation/P3C_Garden_Consultation.html",
    "/planetG/homepage/footer/footer.html"
  ];

  const root = document.getElementById("page");

  if (!root) {
    console.error("Missing #page container in index.html");
    return;
  }

  const cacheBust = Date.now().toString();

  const withCacheBust = (url) => {
    if (!url) return url;
    if (/^https?:\/\//i.test(url)) return url;
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}v=${cacheBust}`;
  };

  const moveSectionStyles = (wrapper) => {
    const head = document.head;
    if (!head) return Promise.resolve();

    const links = Array.from(wrapper.querySelectorAll('link[rel="stylesheet"]'));
    const styles = Array.from(wrapper.querySelectorAll("style"));
    const newLinks = [];

    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) {
        link.remove();
        return;
      }
      if (!/^https?:\/\//i.test(href)) {
        link.setAttribute("href", withCacheBust(href));
      }
      const finalHref = link.getAttribute("href");
      if (head.querySelector(`link[rel="stylesheet"][href="${finalHref}"]`)) {
        link.remove();
        return;
      }
      newLinks.push(link);
    });

    styles.forEach((style) => {
      if (!head.contains(style)) head.appendChild(style);
    });

    if (newLinks.length === 0) return Promise.resolve();

    wrapper.style.visibility = "hidden";
    const loadPromises = newLinks.map(
      (link) =>
        new Promise((resolve) => {
          link.addEventListener("load", resolve, { once: true });
          link.addEventListener("error", resolve, { once: true });
        })
    );

    newLinks.forEach((link) => head.appendChild(link));

    return Promise.all(loadPromises).then(() => {
      wrapper.style.visibility = "";
    });
  };

  async function loadSections() {
    const results = await Promise.all(
      sections.map(async (file) => {
        try {
          const response = await fetch(withCacheBust(file), { cache: "no-store" });
          const html = await response.text();
          return { file, html, ok: true };
        } catch (error) {
          console.error("Error loading:", file, error);
          return { file, html: "", ok: false };
        }
      })
    );

    const stylePromises = [];

    results.forEach(({ html, ok }) => {
      if (!ok) return;
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;
      stylePromises.push(moveSectionStyles(wrapper));
      root.appendChild(wrapper);
    });

    await Promise.all(stylePromises).catch(() => {});
    window.PGRevealRefresh?.();

  }

  loadSections();

})();


