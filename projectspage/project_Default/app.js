(function () {

  const sections = [
    "/planetG/homepage/infobar/infobar.html",
    "/planetG/homepage/header/header.html",
    "/planetG/projectspage/project_Default/PD_hero/PD_hero.html",
    "/planetG/projectspage/project_Default/PD_Cards/PD_Cards.html",
    "/planetG/projectspage/project_Default/PD_Garden_Consultation/PD_Garden_Consultation.html",
    "/planetG/homepage/footer/footer.html"
  ];

  const root = document.getElementById("page");
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

  if (!root) {
    console.error("❌ Missing #page container in index.html");
    return;
  }

  const markPageReady = () => {
    document.documentElement.dataset.pgPageReady = "true";
    window.dispatchEvent(new CustomEvent("pg:page-ready"));
  };

  const waitForPrefetch = () =>
    new Promise(resolve => {
      const check = () => {
        if (window.PGPagePrefetch?.loadSections) return resolve();
        setTimeout(check, 50);
      };
      check();
    });

  async function loadSections() {

    await waitForPrefetch();

    let results;

    try {
      results = await window.PGPagePrefetch.loadSections("projectDefault", sections);
    } catch (err) {
      console.error("❌ loadSections failed:", err);
      return;
    }

    const fragment = document.createDocumentFragment();

    for (const item of results || []) {

      if (!item || !item.ok || !item.html) {
        console.warn("⚠️ Skipping broken section:", item);
        continue;
      }

      const wrapper = document.createElement("div");
      wrapper.className = "pg-section";
      wrapper.appendChild(extractSectionContent(item.html));

      fragment.appendChild(wrapper);
    }

    root.replaceChildren(fragment);

    // safe refresh hook
    if (window.PGRevealRefresh) {
      try {
        window.PGRevealRefresh();
      } catch (e) {
        console.warn("Reveal refresh failed:", e);
      }
    }

    markPageReady();
  }

  loadSections();

})();
