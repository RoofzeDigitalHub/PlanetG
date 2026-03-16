(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const revealSelector = "section";
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
  );

  const observeElement = (el) => {
    if (!el || el.dataset.revealBound === "true") return;
    el.dataset.revealBound = "true";
    el.classList.add("reveal");
    observer.observe(el);
  };

  const scan = (root = document) => {
    root.querySelectorAll(revealSelector).forEach(observeElement);
  };

  scan();

  const revealAllPending = () => {
    document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => {
      el.classList.add("is-visible");
    });
  };

  window.addEventListener("load", () => {
    window.setTimeout(revealAllPending, 600);
  });

  window.setTimeout(revealAllPending, 1800);

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
