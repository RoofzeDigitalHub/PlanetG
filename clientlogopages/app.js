(function () {

  // Client page sections follow the same shared top-bar and header pattern as other pages.
  const sections = [
    // Shared top bar
    "/planetG/homepage/infobar/infobar.html",
    // Shared navigation
    "/planetG/homepage/header/header.html",
    // Page hero
    "/planetG/clientlogopages/client-herosection/client-herosection.html",
    // Client logo grid
    "/planetG/clientlogopages/client-logosection/client-logosection.html",
    // Shared client footer
    "/planetG/clientlogopages/client-footer/client-footer.html"
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

  const appendLayoutOverrides = () => {
    const href = withCacheBust("/planetG/assets/layout-overrides.css");
    if (document.head.querySelector(`link[rel="stylesheet"][href="${href}"]`)) {
      return;
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  };

  const markPageReady = () => {
    document.documentElement.dataset.pgPageReady = "true";
    window.dispatchEvent(new CustomEvent("pg:page-ready"));
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
    const results = await window.PGPagePrefetch.loadSections("clientLogos", sections);

    const stylePromises = [];

    results.forEach(({ html, ok }) => {
      if (!ok) return;
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;
      stylePromises.push(moveSectionStyles(wrapper));
      root.appendChild(wrapper);
    });

    await Promise.all(stylePromises).catch(() => {});
    appendLayoutOverrides();
    window.PGRevealRefresh?.();
    markPageReady();
  }

  loadSections();

})();
