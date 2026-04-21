(function () {

  const overlayId = "pg-loader-overlay";

  const prefetchedPageKey = "pg-prefetched-page";
  const prefetchedPageMaxAge = 60 * 1000;

  let uiInitialized = false;

  const pagePrefetchConfig = {
    home: { paths: ["/", "/index.html"], sections: [] },
    servicesAll: { paths: [], sections: [] },
    servicesSingle: { paths: [], sections: [] },
    projectDefault: {
      paths: [
        "/projectspage/project_Default/index/index.html",
        "/planetG/projectspage/project_Default/index/index.html"
      ],
      sections: [
        "/planetG/homepage/infobar/infobar.html",
        "/planetG/homepage/header/header.html",
        "/planetG/projectspage/project_Default/PD_hero/PD_hero.html",
        "/planetG/projectspage/project_Default/PD_Cards/PD_Cards.html",
        "/planetG/projectspage/project_Default/PD_Garden_Consultation/PD_Garden_Consultation.html",
        "/planetG/homepage/footer/footer.html"
      ]
    }
  };

  const pageRouteMap = new Map();

  Object.entries(pagePrefetchConfig).forEach(([pageId, config]) => {
    config.paths.forEach((path) => {
      pageRouteMap.set(path, pageId);
    });
  });

  function normalizePrefetchPath(pathname) {
    return pathname || "/";
  }

  function getPrefetchPageId(url) {
    try {
      const resolved = url instanceof URL ? url : new URL(url, window.location.href);
      return pageRouteMap.get(resolved.pathname) || null;
    } catch {
      return null;
    }
  }

  function fetchSectionDescriptor(section) {
    const file = typeof section === "string" ? section : section.file;

    return fetch(file, { cache: "no-store" })
      .then(r => r.text())
      .then(html => ({ file, html, ok: true }))
      .catch(() => ({ file, html: "", ok: false }));
  }

  async function loadSectionsWithPrefetch(pageId, sections) {
    return Promise.all(sections.map(fetchSectionDescriptor));
  }

  window.PGPagePrefetch = {
    loadSections: loadSectionsWithPrefetch
  };

  // ---------------- LOADER ----------------

  function ensureLoader() {
    let overlay = document.getElementById(overlayId);
    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.id = overlayId;
    overlay.className = "pg-loader-overlay";
    document.body.appendChild(overlay);
    return overlay;
  }

  function showLoader() {
    ensureLoader().classList.add("is-active");
  }

  function hideLoader() {
    const overlay = document.getElementById(overlayId);
    if (overlay) overlay.classList.remove("is-active");
  }

  function isIgnorableLink(link) {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) return true;
    if (link.target && link.target !== "_self") return true;
    return false;
  }

  function bindNavigationLoader() {
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a[href]");
      if (!link || isIgnorableLink(link)) return;
      if (!link.hasAttribute("data-pg-show-loader")) return;
      showLoader();
    });

    window.addEventListener("pageshow", hideLoader);
  }

  // ---------------- UI INIT SAFE FIX ----------------

  function initUIOnce() {
    if (uiInitialized) return;
    uiInitialized = true;

    if (window.initStaggerButtons) window.initStaggerButtons();
    if (window.initHeroSlider) window.initHeroSlider();
  }

  function initObserver() {
    const target = document.getElementById("page") || document.body;

    const observer = new MutationObserver(() => {
      initUIOnce();
    });

    observer.observe(target, {
      childList: true
      // ❌ subtree removed (IMPORTANT FIX)
    });
  }

  // ---------------- INIT ----------------

  function init() {
    ensureLoader();
    bindNavigationLoader();
    initObserver();

    // first run delay
    setTimeout(initUIOnce, 50);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
