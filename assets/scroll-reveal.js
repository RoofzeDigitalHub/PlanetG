(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const revealSelector = "section";
  const heroSectionSelector = ".hero, .hero-section, .gardyn-hero, .garden-hero, .ourstory-hero";
  const buttonSelector = [
    ".btn",
    "button",
    ".hero-btn",
    ".hero-link",
    ".crafting-btn",
    ".price-cta",
    ".video-play",
    ".search-form .btn-primary"
  ].join(", ");
  const textSelector = [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "li",
    ".section-text",
    ".hero-subtitle",
    ".breadcrumb-text",
    ".tag",
    ".price-desc",
    ".label",
    ".menu-about-text"
  ].join(", ");
  const mediaSelector = "img, picture, svg";
  const cardSelector = [
    ".project-card",
    ".work-card",
    ".service-card",
    ".choice-card",
    ".glass-card",
    ".green-card",
    ".video-frame",
    ".price-row"
  ].join(", ");
  const classAliases = {
    "reveal-up": ["aos-fade-up"],
    "reveal-left": ["aos-fade-left"],
    "reveal-right": ["aos-fade-right"],
    "reveal-hero": ["aos-zoom-in"],
    "reveal-zoom": ["aos-zoom-in"],
    "reveal-btn": ["aos-fade-up"],
    "reveal-card": ["aos-fade-up"]
  };

  const decorated = new WeakSet();
  const observed = new WeakSet();

  const isHeroSection = (section) => section.matches(heroSectionSelector);

  const applyReveal = (elements, revealClass, options = {}) => {
    const {
      delayStep = 0.2,
      startDelay = 0,
      duration = 0.85
    } = options;

    Array.from(elements).forEach((el, index) => {
      if (!(el instanceof Element)) return;
      if (el.dataset.revealApplied === "true") return;
      el.dataset.revealApplied = "true";
      const aliases = classAliases[revealClass] || [];
      el.classList.add("reveal-item", revealClass, ...aliases);
      el.style.setProperty("--reveal-delay", `${(startDelay + index * delayStep).toFixed(2)}s`);
      el.style.setProperty("--reveal-duration", `${duration}s`);
    });
  };

  const applyLayoutReveal = (section) => {
    section.querySelectorAll(".row").forEach((row) => {
      const columns = Array.from(row.children).filter((child) => {
        if (!(child instanceof Element) || !child.classList) return false;
        return Array.from(child.classList).some((cls) => /^col/.test(cls));
      });

      if (columns.length < 2) return;

      const midpoint = Math.ceil(columns.length / 2);
      columns.forEach((column, index) => {
        if (column.dataset.revealLayout === "true") return;
        column.dataset.revealLayout = "true";
        column.classList.add("reveal-item", index < midpoint ? "reveal-left" : "reveal-right");
        column.style.setProperty("--reveal-delay", `${(index * 0.2).toFixed(2)}s`);
        column.style.setProperty("--reveal-duration", "0.85s");
      });
    });
  };

  const decorateSection = (section) => {
    if (!section || decorated.has(section)) return;
    decorated.add(section);

    const hero = isHeroSection(section);

    if (hero) {
      applyReveal(section.querySelectorAll("h1, h2, h3"), "reveal-hero", {
        delayStep: 0.2,
        startDelay: 0.04,
        duration: 0.8
      });
      applyReveal(section.querySelectorAll("p, .hero-subtitle, .breadcrumb-text, .tag"), "reveal-up", {
        delayStep: 0.2,
        startDelay: 0.22,
        duration: 0.8
      });
      applyReveal(section.querySelectorAll(buttonSelector), "reveal-btn", {
        delayStep: 0.2,
        startDelay: 0.42,
        duration: 0.7
      });
    } else {
      applyReveal(section.querySelectorAll("h1, h2, h3, h4, h5, h6"), "reveal-up", {
        delayStep: 0.2,
        startDelay: 0.04,
        duration: 0.8
      });
      applyReveal(section.querySelectorAll("p, li, .section-text, .price-desc, .label, .menu-about-text"), "reveal-up", {
        delayStep: 0.2,
        startDelay: 0.2,
        duration: 0.75
      });
      applyReveal(section.querySelectorAll(buttonSelector), "reveal-btn", {
        delayStep: 0.2,
        startDelay: 0.38,
        duration: 0.65
      });
    }

    applyReveal(section.querySelectorAll(mediaSelector), "reveal-zoom", {
      delayStep: 0.2,
      startDelay: 0.08,
      duration: 0.85
    });

    applyReveal(section.querySelectorAll(cardSelector), "reveal-card", {
      delayStep: 0.2,
      startDelay: 0.1,
      duration: 0.9
    });

    applyLayoutReveal(section);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        decorateSection(entry.target);
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
  );

  const observeElement = (el) => {
    if (!el || observed.has(el)) return;
    observed.add(el);
    el.classList.add("reveal");
    observer.observe(el);
  };

  const scan = (root = document) => {
    root.querySelectorAll(revealSelector).forEach(observeElement);
  };

  scan();
  window.PGRevealRefresh = () => {
    scan();
  };

  const mo = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        if (node.matches && node.matches(revealSelector)) {
          observeElement(node);
        }
        if (node.querySelectorAll) {
          node.querySelectorAll(revealSelector).forEach(observeElement);
        }
      });
    });
  });

  mo.observe(document.body, { childList: true, subtree: true });
})();
