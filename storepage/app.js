(function () {

  const sections = [
    "/planetG/homepage/infobar/infobar.html",
    "/planetG/homepage/header/header.html",
    "/planetG/storepage/ST_hero/ST_hero.html",
    "/planetG/storepage/ST_Video/ST_Video.html",
    "/planetG/homepage/footer/footer.html"
  ];

  const root = document.getElementById("page");

  if (!root) {
    console.error("Missing #page container in index.html");
    return;
  }

  document.body.classList.add("store-page");

  const markPageReady = () => {
    document.documentElement.dataset.pgPageReady = "true";
    window.dispatchEvent(new CustomEvent("pg:page-ready"));
  };

  async function loadSections() {
    const results = await window.PGPagePrefetch.loadSections("store", sections);

    const fragment = document.createDocumentFragment();

    results.forEach(({ html, ok }) => {
      if (!ok) return;

      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;

      // IMPORTANT: NO CSS HANDLING HERE
      fragment.appendChild(wrapper);
    });

    root.appendChild(fragment);

    markPageReady();
  }

  loadSections();

})();