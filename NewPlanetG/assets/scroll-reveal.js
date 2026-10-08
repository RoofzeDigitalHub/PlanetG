/**
 * Planet G - Fluid Scroll Reveal & Number Counter Animations
 * Staggers entrance of headings, cards, and media smoothly.
 * Automatically animates counters (e.g. 850+, 550+, 20+).
 */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    document.querySelectorAll("section, .reveal-item").forEach((el) => {
      el.classList.add("is-visible");
    });
    return;
  }

  const revealSelector = "section, .hero, .crafting-section, .service-section, .why-choose-us, .latestwork-section, .client-logo-section, .client-reviews-section, .footer";
  const heroSectionSelector = ".hero, .hero-section, .gardyn-hero, .garden-hero, .ourstory-hero";
  
  const buttonSelector = [
    ".btn",
    "button",
    ".hero-btn",
    ".hero-link",
    ".crafting-btn",
    ".price-cta",
    ".video-play",
    ".btn-view-clients",
    ".btn-view-reviews"
  ].join(", ");

  const cardSelector = [
    ".garden-card",
    ".project-card",
    ".work-card",
    ".service-card",
    ".choice-card",
    ".stat-card",
    ".category-card",
    ".client-review-card",
    ".client-logo-card",
    ".partner-card",
    ".glass-card",
    ".green-card"
  ].join(", ");

  const decorated = new WeakSet();
  const observed = new WeakSet();

  const isHeroSection = (section) => section.matches && section.matches(heroSectionSelector);

  const applyReveal = (elements, revealClass, options = {}) => {
    const {
      delayStep = 0.08,
      startDelay = 0.04,
      duration = 0.7
    } = options;

    Array.from(elements).forEach((el, index) => {
      if (!(el instanceof Element)) return;
      if (el.dataset.revealApplied === "true") return;
      el.dataset.revealApplied = "true";
      el.classList.add("reveal-item", revealClass);
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
        column.style.setProperty("--reveal-delay", `${(index * 0.1).toFixed(2)}s`);
        column.style.setProperty("--reveal-duration", "0.75s");
      });
    });
  };

  const decorateSection = (section) => {
    if (!section || decorated.has(section)) return;
    decorated.add(section);

    const hero = isHeroSection(section);

    if (hero) {
      applyReveal(section.querySelectorAll("h1, h2, h3, .Nav-heading"), "reveal-hero", {
        delayStep: 0.1,
        startDelay: 0.02,
        duration: 0.75
      });
      applyReveal(section.querySelectorAll("p, .hero-subtitle, .text-hero, .tag"), "reveal-up", {
        delayStep: 0.08,
        startDelay: 0.15,
        duration: 0.7
      });
      applyReveal(section.querySelectorAll(buttonSelector), "reveal-btn", {
        delayStep: 0.08,
        startDelay: 0.28,
        duration: 0.65
      });
    } else {
      applyReveal(section.querySelectorAll(".service-pill, .client-logo-pill, .why-choose-pill, .latestwork-pill, .story-tag, .tag, .client-reviews-pill"), "reveal-up", {
        delayStep: 0.06,
        startDelay: 0.02,
        duration: 0.6
      });
      applyReveal(section.querySelectorAll("h1, h2, h3, h4, .crafting-title, .story-title"), "reveal-up", {
        delayStep: 0.08,
        startDelay: 0.06,
        duration: 0.7
      });
      applyReveal(section.querySelectorAll("p, .section-text, .crafting-text, .story-text, .client-logo-subtitle"), "reveal-up", {
        delayStep: 0.08,
        startDelay: 0.14,
        duration: 0.7
      });
      applyReveal(section.querySelectorAll(buttonSelector), "reveal-btn", {
        delayStep: 0.08,
        startDelay: 0.22,
        duration: 0.6
      });
    }

    applyReveal(section.querySelectorAll(cardSelector), "reveal-card", {
      delayStep: 0.09,
      startDelay: 0.08,
      duration: 0.75
    });

    applyLayoutReveal(section);
  };

  /* Smooth Number Counting Animation for Stats */
  const animateCounters = (container) => {
    container.querySelectorAll(".stat-number, .number, [data-counter]").forEach((el) => {
      if (el.dataset.counterDone === "true") return;
      const text = el.textContent.trim();
      const match = text.match(/^(\d+)(.*)$/);
      if (!match) return;
      el.dataset.counterDone = "true";
      const target = parseInt(match[1], 10);
      const suffix = match[2] || "";
      const duration = 1500;
      const startTime = performance.now();

      const update = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Cubic ease out
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(ease * target);
        el.textContent = `${current}${suffix}`;
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = `${target}${suffix}`;
        }
      };
      requestAnimationFrame(update);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        decorateSection(entry.target);
        entry.target.classList.add("is-visible");
        animateCounters(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.06, rootMargin: "0px 0px -30px 0px" }
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

  // Immediate initial scan
  scan();
  window.PGRevealRefresh = scan;

  // Observe dynamic additions
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

  if (document.body) {
    mo.observe(document.body, { childList: true, subtree: true });
  }

  // Safety fallback: reveal all if user scrolled very quickly
  setTimeout(() => {
    document.querySelectorAll(".reveal, section").forEach((sec) => {
      sec.classList.add("is-visible");
      animateCounters(sec);
    });
  }, 2800);
})();
