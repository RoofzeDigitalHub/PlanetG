(function () {

  const sections = [
    "/planetG/homepage/infobar/infobar.html",
    "/planetG/homepage/header/header.html",
    "/planetG/servicespage/all_services/herosection/herosection.html",
    "/planetG/servicespage/all_services/services_cards/services_cards.html",
    "/planetG/servicespage/all_services/Garden_Consultation/Garden_Consultation.html",
    "/planetG/homepage/footer/footer.html"
  ];

  const root = document.getElementById("page");

  if (!root) {
    console.error("Missing #page container");
    return;
  }

  const markReady = () => {
    document.documentElement.dataset.pgReady = "true";
    window.dispatchEvent(new CustomEvent("pg:page-ready"));
  };

  async function loadSections() {

    try {

      const results = await window.PGPagePrefetch.loadSections("servicesAll", sections);

      // 🔥 STEP-BY-STEP RENDER (smooth feel)
      for (const { html, ok } of results) {

        if (!ok || !html) continue;

        const wrapper = document.createElement("div");
        wrapper.className = "pg-section";
        wrapper.style.opacity = "0";
        wrapper.innerHTML = html;

        root.appendChild(wrapper);

        // 🔥 smooth fade-in per section
        requestAnimationFrame(() => {
          wrapper.style.transition = "opacity 0.4s ease";
          wrapper.style.opacity = "1";
        });

        // 🔥 small delay for smoothness
        await new Promise(res => setTimeout(res, 80));
      }

      markReady();

    } catch (err) {
      console.error("Load failed:", err);
      markReady();
    }
  }

  loadSections();

})();