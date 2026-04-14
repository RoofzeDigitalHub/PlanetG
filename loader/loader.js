
(function () {
  const overlayId = "pg-loader-overlay";
  const prefetchedPageKey = "pg-prefetched-page";
  const prefetchedPageMaxAge = 60 * 1000;
  const pagePrefetchConfig = {
    home: {
      paths: [
        "/",
        "/index.html",
        "/planetG",
        "/planetG/",
        "/homepage/index/index.html",
        "/planetG/homepage/index/index.html"
      ],
      sections: [
        "/planetG/homepage/infobar/infobar.html",
        "/planetG/homepage/header/header.html",
        "/planetG/homepage/herosection/herosection.html",
        "/planetG/homepage/crafting_living/crafting_living.html",
        "/planetG/homepage/servicesection/servicesection.html",
        "/planetG/homepage/Price_List/Price_List.html",
        "/planetG/homepage/ourstory/ourstory.html",
        "/planetG/homepage/client_logo/client_logo.html",
        "/planetG/homepage/whychooseus/whychooseus.html",
        "/planetG/homepage/pricingplan/pricingplan.html",
        "/planetG/homepage/videosection/videosection.html",
        "/planetG/homepage/testimonialslider/testimonialslider.html",
        "/planetG/homepage/latestwork/latestwork.html",
        "/planetG/homepage/footer/footer.html"
      ]
    },
    servicesAll: {
      paths: [
        "/servicespage/all_services/index/index.html",
        "/planetG/servicespage/all_services/index/index.html"
      ],
      sections: [
        "/planetG/homepage/infobar/infobar.html",
        "/planetG/homepage/header/header.html",
        "/planetG/servicespage/all_services/herosection/herosection.html",
        "/planetG/servicespage/all_services/services_cards/services_cards.html",
        "/planetG/servicespage/all_services/Garden_Consultation/Garden_Consultation.html",
        "/planetG/homepage/footer/footer.html"
      ]
    },
    servicesSingle: {
      paths: [
        "/servicespage/services_single/index/index.html",
        "/planetG/servicespage/services_single/index/index.html"
      ],
      sections: [
        { file: "/planetG/homepage/infobar/infobar.html", target: "root" },
        { file: "/planetG/homepage/header/header.html", target: "root" },
        { file: "/planetG/servicespage/services_single/single_services_hero/single_services_hero.html", target: "root" },
        { file: "/planetG/servicespage/services_single/services_list/services_list.html", target: "sidebar" },
        { file: "/planetG/servicespage/services_single/Garden_Oasis_Showcase/Garden_Oasis_Showcase.html", target: "main" },
        { file: "/planetG/servicespage/services_single/Why_Choose _Us/Why_Choose _Us.html", target: "main" },
        { file: "/planetG/servicespage/services_single/latest_project/latest_project.html", target: "main" },
        { file: "/planetG/homepage/footer/footer.html", target: "root" }
      ]
    },
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
    },
    projectColumns: {
      paths: [
        "/projectspage/projects_3_columns/index/index.html",
        "/planetG/projectspage/projects_3_columns/index/index.html"
      ],
      sections: [
        "/planetG/homepage/infobar/infobar.html",
        "/planetG/homepage/header/header.html",
        "/planetG/projectspage/projects_3_columns/P3C_hero/P3C_hero.html",
        "/planetG/projectspage/projects_3_columns/P3C_Cards/P3C_Cards.html",
        "/planetG/projectspage/projects_3_columns/P3C_Garden_Consultation/P3C_Garden_Consultation.html",
        "/planetG/homepage/footer/footer.html"
      ]
    },
    aboutUs: {
      paths: [
        "/pagesection/abouts_us/index/index.html",
        "/planetG/pagesection/abouts_us/index/index.html"
      ],
      sections: [
        "/planetG/homepage/infobar/infobar.html",
        "/planetG/homepage/header/header.html",
        "/planetG/pagesection/abouts_us/Ab_hero/Ab_hero.html",
        "/planetG/pagesection/abouts_us/Ab_ourstory/Ab_ourstory.html",
        "/planetG/pagesection/abouts_us/Ab_ourTeam/Ab_ourTeam.html",
        "/planetG/pagesection/abouts_us/Ab_Garden_Consultation/Ab_Garden_Consultation.html",
        "/planetG/homepage/footer/footer.html"
      ]
    },
    gallery: {
      paths: [
        "/pagesection/gallery/index/index.html",
        "/planetG/pagesection/gallery/index/index.html"
      ],
      sections: [
        "/planetG/homepage/infobar/infobar.html",
        "/planetG/homepage/header/header.html",
        "/planetG/pagesection/gallery/Gy_Hero/Gy_Hero.html",
        "/planetG/pagesection/gallery/Gy_image/Gy_image.html",
        "/planetG/homepage/footer/footer.html"
      ]
    },
    contact: {
      paths: [
        "/contactpage/index/index.html",
        "/planetG/contactpage/index/index.html"
      ],
      sections: [
        "/planetG/homepage/infobar/infobar.html",
        "/planetG/homepage/header/header.html",
        "/planetG/contactpage/CP_hero/CP_hero.html",
        "/planetG/contactpage/CP_contactF/CP_contactF.html",
        "/planetG/homepage/footer/footer.html"
      ]
    },
    store: {
      paths: [
        "/storepage/index/index.html",
        "/planetG/storepage/index/index.html"
      ],
      sections: [
        "/planetG/homepage/infobar/infobar.html",
        "/planetG/homepage/header/header.html",
        "/planetG/storepage/ST_hero/ST_hero.html",
        "/planetG/storepage/ST_Video/ST_Video.html",
        "/planetG/homepage/footer/footer.html"
      ]
    },
    clientLogos: {
      paths: [
        "/clientlogopages/index/index.html",
        "/planetG/clientlogopages/index/index.html"
      ],
      sections: [
        "/planetG/homepage/infobar/infobar.html",
        "/planetG/homepage/header/header.html",
        "/planetG/clientlogopages/client-herosection/client-herosection.html",
        "/planetG/clientlogopages/client-logosection/client-logosection.html",
        "/planetG/clientlogopages/client-footer/client-footer.html"
      ]
    }
  };
  const pageRouteMap = new Map();

  Object.entries(pagePrefetchConfig).forEach(([pageId, config]) => {
    config.paths.forEach((path) => {
      pageRouteMap.set(normalizePrefetchPath(path), pageId);
    });
  });

  function normalizePrefetchPath(pathname) {
    if (!pathname || pathname === "/") {
      return "/planetG/homepage/index/index.html";
    }

    let normalized = pathname;
    if (normalized !== "/" && normalized.endsWith("/")) {
      normalized = normalized.slice(0, -1);
    }

    if (
      normalized === "/index.html" ||
      normalized === "/planetG" ||
      normalized === "/planetG/"
    ) {
      return "/planetG/homepage/index/index.html";
    }

    if (
      normalized.startsWith("/homepage/") ||
      normalized.startsWith("/servicespage/") ||
      normalized.startsWith("/projectspage/") ||
      normalized.startsWith("/pagesection/") ||
      normalized.startsWith("/contactpage/") ||
      normalized.startsWith("/storepage/") ||
      normalized.startsWith("/clientlogopages/")
    ) {
      return `/planetG${normalized}`;
    }

    return normalized;
  }

  function getPrefetchPageId(url) {
    try {
      const resolved = url instanceof URL ? url : new URL(url, window.location.href);
      return pageRouteMap.get(normalizePrefetchPath(resolved.pathname)) || null;
    } catch (error) {
      return null;
    }
  }

  function fetchSectionDescriptor(section) {
    const file = typeof section === "string" ? section : section.file;
    const target = typeof section === "string" ? undefined : section.target;

    return fetch(file, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          return { file, target, html: "", ok: false };
        }
        const html = await response.text();
        return { file, target, html, ok: true };
      })
      .catch((error) => {
        console.error("Error loading:", file, error);
        return { file, target, html: "", ok: false };
      });
  }

  function consumePrefetchedPayload(pageId) {
    try {
      const raw = window.sessionStorage.getItem(prefetchedPageKey);
      if (!raw) return null;

      const payload = JSON.parse(raw);
      const currentPath = normalizePrefetchPath(window.location.pathname);
      const isFresh = typeof payload.ts === "number" && (Date.now() - payload.ts) < prefetchedPageMaxAge;
      const pageMatches = payload.pageId === pageId;
      const pathMatches = payload.path === currentPath;

      if (!isFresh || (!pageMatches && !pathMatches)) {
        window.sessionStorage.removeItem(prefetchedPageKey);
        return null;
      }

      window.sessionStorage.removeItem(prefetchedPageKey);
      return Array.isArray(payload.results) ? payload.results : null;
    } catch (error) {
      window.sessionStorage.removeItem(prefetchedPageKey);
      return null;
    }
  }

  async function prefetchPageForUrl(url) {
    const resolved = url instanceof URL ? url : new URL(url, window.location.href);
    const pageId = getPrefetchPageId(resolved);
    if (!pageId) return false;

    const config = pagePrefetchConfig[pageId];
    if (!config) return false;

    const results = await Promise.all(config.sections.map(fetchSectionDescriptor));
    try {
      window.sessionStorage.setItem(prefetchedPageKey, JSON.stringify({
        pageId,
        path: normalizePrefetchPath(resolved.pathname),
        ts: Date.now(),
        results
      }));
    } catch (error) {
      return false;
    }

    return true;
  }

  function loadSectionsWithPrefetch(pageId, sections) {
    const prefetched = consumePrefetchedPayload(pageId);
    if (prefetched) {
      return Promise.resolve(prefetched);
    }
    return Promise.all(sections.map(fetchSectionDescriptor));
  }

  function handlePrefetchNavigation(event) {
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = event.target.closest("a[href]");
    if (!link) return;
    if (link.target && link.target !== "_self") return;
    if (link.hasAttribute("download")) return;

    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return;
    }

    let url;
    try {
      url = new URL(link.href, window.location.href);
    } catch (error) {
      return;
    }

    if (url.origin !== window.location.origin) return;
    if (!getPrefetchPageId(url)) return;

    const currentPath = normalizePrefetchPath(window.location.pathname);
    const nextPath = normalizePrefetchPath(url.pathname);
    if (currentPath === nextPath && url.search === window.location.search && !url.hash) {
      return;
    }

    event.preventDefault();
    prefetchPageForUrl(url)
      .catch(() => false)
      .finally(() => {
        window.location.assign(url.href);
      });
  }

  function handlePrefetchIntent(event) {
    const link = event.target.closest?.("a[href]");
    if (!link) return;

    let url;
    try {
      url = new URL(link.href, window.location.href);
    } catch (error) {
      return;
    }

    if (url.origin !== window.location.origin) return;
    if (!getPrefetchPageId(url)) return;

    prefetchPageForUrl(url).catch(() => false);
  }

  function initPrefetchedNavigation() {
    if (window.__pgPrefetchedNavigationReady === true) {
      return;
    }

    window.__pgPrefetchedNavigationReady = true;
    document.addEventListener("click", handlePrefetchNavigation, true);
    document.addEventListener("pointerenter", handlePrefetchIntent, true);
    document.addEventListener("focusin", handlePrefetchIntent, true);
  }

  window.PGPagePrefetch = {
    loadSections: loadSectionsWithPrefetch
  };

  function ensureLoader() {
    let overlay = document.getElementById(overlayId);
    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.id = overlayId;
    overlay.className = "pg-loader-overlay";
    overlay.innerHTML =
      '<div class="pg-loader-card" role="status" aria-live="polite">' +
      '<div class="pg-loader-buffer" aria-hidden="true">' +
      '<span class="pg-loader-bar"></span>' +
      '<span class="pg-loader-bar"></span>' +
      '<span class="pg-loader-bar"></span>' +
      '<span class="pg-loader-bar"></span>' +
      "</div>" +
      "</div>";

    document.body.appendChild(overlay);
    return overlay;
  }

  function showLoader() {
    const overlay = ensureLoader();
    overlay.classList.add("is-active");
    document.body.classList.add("pg-loading");
  }

  function hideLoader() {
    const overlay = document.getElementById(overlayId);
    if (overlay) overlay.classList.remove("is-active");
    document.body.classList.remove("pg-loading");
  }

  function getHeaderScrollThreshold() {
    return window.matchMedia("(max-width: 991.98px)").matches ? 24 : 10;
  }

  function isIgnorableLink(link) {
    const href = link.getAttribute("href");
    if (!href) return true;
    if (href.startsWith("#")) return true;
    if (href.startsWith("mailto:")) return true;
    if (href.startsWith("tel:")) return true;
    if (href.startsWith("javascript:")) return true;
    if (link.target && link.target !== "_self") return true;
    if (link.hasAttribute("download")) return true;
    if (link.dataset.skipLoader === "true") return true;

    try {
      const url = new URL(link.href, window.location.href);
      const currentUrl = new URL(window.location.href);
      if (url.origin !== currentUrl.origin) {
        return true;
      }
      if (
        url.pathname === currentUrl.pathname &&
        url.search === currentUrl.search &&
        (url.hash || "") === (currentUrl.hash || "")
      ) {
        return true;
      }
      if (
        url.origin === window.location.origin &&
        /\/planetG\/homepage\/index\/index\.html$/i.test(url.pathname)
      ) {
        return true;
      }
    } catch (error) {
      return false;
    }

    return false;
  }

  function bindNavigationLoader() {
    document.addEventListener("click", function (event) {
      if (event.defaultPrevented) return;
      const link = event.target.closest("a[href]");
      if (!link || isIgnorableLink(link)) return;
      showLoader();
    });

    window.addEventListener("pageshow", hideLoader);
    window.addEventListener("load", hideLoader, { once: true });
  }

  function initWaveButtons() {
    const buttons = document.querySelectorAll(".header-wave-btn:not([data-wave-ready])");
    buttons.forEach((btn) => {
      const textEl = btn.querySelector(".wave-text") || btn;
      const text = (textEl.textContent || "").trim();
      if (!text) return;

      textEl.textContent = "";
      [...text].forEach((ch, i) => {
        const span = document.createElement("span");
        span.className = "wave-char";
        span.style.setProperty("--i", i);
        span.textContent = ch === " " ? "\u00A0" : ch;
        textEl.appendChild(span);
      });

      btn.setAttribute("data-wave-ready", "true");
    });
  }

  function wrapStaggerText(el) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (node.parentElement && node.parentElement.closest("[data-stagger-ignore]")) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const textNodes = [];
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    let index = 0;
    textNodes.forEach((node) => {
      const text = node.nodeValue || "";
      const fragment = document.createDocumentFragment();

      [...text].forEach((ch) => {
        const char = ch === " " ? "\u00A0" : ch;
        const span = document.createElement("span");
        span.className = "stagger-char";
        span.style.setProperty("--i", index);

        const top = document.createElement("span");
        top.className = "char-top";
        top.textContent = char;

        const bottom = document.createElement("span");
        bottom.className = "char-bottom";
        bottom.textContent = char;

        span.appendChild(top);
        span.appendChild(bottom);
        fragment.appendChild(span);
        index += 1;
      });

      node.parentNode.replaceChild(fragment, node);
    });
  }

  function initStaggerButtons(root = document) {
    const buttons = root.querySelectorAll("[data-stagger]");
    buttons.forEach((btn) => {
      if (btn.dataset.staggerReady === "true") return;
      btn.dataset.staggerReady = "true";
      btn.classList.add("stagger-btn");
      wrapStaggerText(btn);
    });
  }

  function initHeroSlider() {
    const heroes = document.querySelectorAll(".hero[data-hero-images]:not([data-hero-ready])");
    heroes.forEach((hero) => {
      const rawImages = hero.getAttribute("data-hero-images") || "";
      const images = rawImages
        .split("|")
        .map((img) => img.trim())
        .filter(Boolean);

      if (images.length === 0) return;

      hero.setAttribute("data-hero-ready", "true");

      images.forEach((src) => {
        const img = new Image();
        img.src = src;
      });

      let index = 0;
      const interval = parseInt(hero.getAttribute("data-hero-interval") || "5000", 10);
      const safeInterval = Number.isFinite(interval) ? interval : 5000;
      const transition = parseInt(hero.getAttribute("data-hero-transition") || "1200", 10);
      const safeTransition = Number.isFinite(transition) ? transition : 1200;
      let isTransitioning = false;

      const applyImage = (i) => {
        const imageValue = 'url("' + images[i] + '")';
        hero.style.setProperty("--hero-bg-current", imageValue);
        hero.style.setProperty("--hero-bg-next", imageValue);
      };

      applyImage(index);

      if (images.length === 1) return;

      const timer = window.setInterval(() => {
        if (isTransitioning) return;
        index = (index + 1) % images.length;
        isTransitioning = true;
        hero.style.setProperty("--hero-bg-next", 'url("' + images[index] + '")');
        hero.classList.add("is-crossfading");

        window.setTimeout(() => {
          hero.style.setProperty("--hero-bg-current", 'url("' + images[index] + '")');
          hero.classList.remove("is-crossfading");
          window.setTimeout(() => {
            hero.style.setProperty("--hero-bg-next", 'url("' + images[index] + '")');
            isTransitioning = false;
          }, 60);
        }, safeTransition);
      }, safeInterval);

      hero._heroSliderTimer = timer;
    });
  }

  function initStickyHeader() {
    function updateTopbarHeight() {
      const topbar = document.querySelector(".gardyn-topbar");
      const height = topbar ? topbar.getBoundingClientRect().height : 0;
      document.documentElement.style.setProperty("--gardyn-topbar-height", `${Math.round(height)}px`);
    }

    function applyHeaderState() {
      const header = document.querySelector(".gardyn-header");
      if (!header) return;
      if (window.scrollY > getHeaderScrollThreshold()) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    window.addEventListener("scroll", applyHeaderState, { passive: true });
    window.addEventListener("load", () => {
      updateTopbarHeight();
      applyHeaderState();
    });
    window.addEventListener("resize", () => {
      updateTopbarHeight();
      applyHeaderState();
    });
    updateTopbarHeight();
    applyHeaderState();

    const observer = new MutationObserver(function () {
      if (document.querySelector(".gardyn-header") || document.querySelector(".gardyn-topbar")) {
        updateTopbarHeight();
        applyHeaderState();
      }
      initStaggerButtons();
      initHeroSlider();
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initPrefetchedNavigation();
      ensureLoader();
      bindNavigationLoader();
      initStaggerButtons();
      initHeroSlider();
      initStickyHeader();
    });
  } else {
    initPrefetchedNavigation();
    ensureLoader();
    bindNavigationLoader();
    initStaggerButtons();
    initHeroSlider();
    initStickyHeader();
  }
})();
