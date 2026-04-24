(function () {

  const sections = [
    "/planetG/homepage/infobar/infobar.html",
    "/planetG/homepage/header/header.html",
    "/planetG/pagesection/gallery/Gy_Hero/Gy_Hero.html",
    "/planetG/pagesection/gallery/Gy_image/Gy_image.html",
    "/planetG/homepage/footer/footer.html"
  ];

  const root = document.getElementById("page");

  if (!root) {
    console.error("Missing #page container in index.html");
    return;
  }

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

  const markPageReady = () => {
    document.documentElement.dataset.pgPageReady = "true";
    window.dispatchEvent(new CustomEvent("pg:page-ready"));
  };

  async function loadSections() {
    const results = await window.PGPagePrefetch.loadSections("gallery", sections);

    const fragment = document.createDocumentFragment();

    results.forEach(({ html, ok }) => {
      if (!ok || !html) return;

      const wrapper = document.createElement("div");
      wrapper.className = "pg-section";
      wrapper.appendChild(extractSectionContent(html));

      fragment.appendChild(wrapper);
    });

    root.replaceChildren(fragment);

    markPageReady();
  }

  loadSections();

})();
