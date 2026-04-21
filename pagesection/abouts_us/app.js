(function () {

  const sections = [
    "/planetG/homepage/infobar/infobar.html",
    "/planetG/homepage/header/header.html",
    "/planetG/pagesection/abouts_us/Ab_hero/Ab_hero.html",
    "/planetG/pagesection/abouts_us/Ab_ourstory/Ab_ourstory.html",
    "/planetG/pagesection/abouts_us/Ab_ourTeam/Ab_ourTeam.html",
    "/planetG/pagesection/abouts_us/Ab_Garden_Consultation/Ab_Garden_Consultation.html",
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
    const results = await window.PGPagePrefetch.loadSections("aboutUs", sections);

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