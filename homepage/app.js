(function () {

  const sections = [
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
  ];

  const root = document.getElementById("page");

  if (!root) {
    console.error("Missing #page container");
    return;
  }

  const markPageReady = () => {
    document.documentElement.dataset.pgPageReady = "true";
    window.dispatchEvent(new CustomEvent("pg:page-ready"));
  };

  const waitForDOM = () =>
    new Promise((resolve) => {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", resolve, { once: true });
      } else {
        resolve();
      }
    });

  const waitForPrefetch = () =>
    new Promise((resolve) => {
      const check = () => {
        if (window.PGPagePrefetch?.loadSections) {
          resolve();
          return;
        }

        window.setTimeout(check, 50);
      };

      check();
    });

  const extractSectionContent = (html) => {
    const parsed = new DOMParser().parseFromString(html || "", "text/html");
    const fragment = document.createDocumentFragment();
    const blockedTags = new Set(["BASE", "LINK", "META", "SCRIPT", "STYLE", "TITLE"]);

    Array.from(parsed.body.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && blockedTags.has(node.nodeName)) {
        return;
      }

      fragment.appendChild(document.importNode(node, true));
    });

    return fragment;
  };

  async function loadSections() {
    await waitForPrefetch();

    const results = await window.PGPagePrefetch.loadSections("home", sections);

    const fragment = document.createDocumentFragment();

    results.forEach(({ html, ok }) => {
      if (!ok || !html) return;

      const wrapper = document.createElement("div");
      wrapper.className = "pg-section";
      wrapper.appendChild(extractSectionContent(html));

      fragment.appendChild(wrapper);
    });

    root.replaceChildren(fragment);

    window.initClientLogoSlider?.();
    window.initTestimonialSlider?.();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.PGRevealRefresh?.();
        markPageReady();
      });
    });
  }

  (async function init() {
    await waitForDOM();

    try {
      await loadSections();
    } catch (error) {
      console.error("Failed to load homepage sections", error);
      markPageReady();
    }
  })();

})();
