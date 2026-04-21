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

  const markPageReady = () => {
    document.documentElement.dataset.pgPageReady = "true";
    window.dispatchEvent(new CustomEvent("pg:page-ready"));
  };

  async function loadSections() {
    const results = await window.PGPagePrefetch.loadSections("gallery", sections);

    const fragment = document.createDocumentFragment();

    results.forEach(({ html, ok }) => {
      if (!ok) return;

      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;

      fragment.appendChild(wrapper);
    });

    root.appendChild(fragment);

    markPageReady();
  }

  loadSections();

})();