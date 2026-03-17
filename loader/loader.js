(function () {
  const overlayId = "pg-loader-overlay";

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

  function isIgnorableLink(link) {
    const href = link.getAttribute("href");
    if (!href) return true;
    if (href.startsWith("#")) return true;
    if (href.startsWith("mailto:")) return true;
    if (href.startsWith("tel:")) return true;
    if (href.startsWith("javascript:")) return true;
    if (link.target && link.target !== "_self") return true;
    if (link.hasAttribute("download")) return true;
    return false;
  }

  function bindNavigationLoader() {
    document.addEventListener("click", function (event) {
      const link = event.target.closest("a[href]");
      if (!link || isIgnorableLink(link)) return;
      showLoader();
    });

    window.addEventListener("beforeunload", showLoader);
    window.addEventListener("pageshow", hideLoader);
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

      const applyImage = (i) => {
        hero.style.setProperty("--hero-bg", 'url("' + images[i] + '")');
      };

      applyImage(index);

      const timer = window.setInterval(() => {
        index = (index + 1) % images.length;
        applyImage(index);
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
      if (window.scrollY > 0) {
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
      ensureLoader();
      bindNavigationLoader();
      initStaggerButtons();
      initHeroSlider();
      initStickyHeader();
    });
  } else {
    ensureLoader();
    bindNavigationLoader();
    initStaggerButtons();
    initHeroSlider();
    initStickyHeader();
  }
})();
