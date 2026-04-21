(function () {

  const root = document.getElementById("page");
  if (!root) return;

  const sections = [
    "/planetG/homepage/infobar/infobar.html",
    "/planetG/homepage/header/header.html",
    "/planetG/contactpage/CP_hero/CP_hero.html",
    "/planetG/contactpage/CP_contactF/CP_contactF.html",
    "/planetG/homepage/footer/footer.html"
  ];

  const waitForDOM = () =>
    new Promise(res => {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", res);
      } else {
        res();
      }
    });

  const waitForPrefetch = () =>
    new Promise(resolve => {
      const check = () => {
        if (window.PGPagePrefetch?.loadSections) return resolve();
        setTimeout(check, 50);
      };
      check();
    });

  const setupContactForm = () => {
    window.PlanetGContactForm?.setup(root);
  };

  const loadSections = async () => {
    const results = await window.PGPagePrefetch.loadSections("contact", sections);
    const frag = document.createDocumentFragment();

    for (const { html, ok } of results) {
      if (!ok) continue;
      const wrap = document.createElement("div");
      wrap.innerHTML = html;
      frag.appendChild(wrap);
    }

    root.appendChild(frag);
    setupContactForm();

    document.documentElement.dataset.pgPageReady = "true";
    window.dispatchEvent(new CustomEvent("pg:page-ready"));
  };

  (async function init() {
    await waitForDOM();
    await waitForPrefetch();   // prevents race condition
    await loadSections();
  })();

})();
