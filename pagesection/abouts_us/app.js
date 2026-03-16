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

  async function loadSections() {
    const results = await Promise.all(
      sections.map(async (file) => {
        try {
          const response = await fetch(file, { cache: "no-store" });
          const html = await response.text();
          return { file, html, ok: true };
        } catch (error) {
          console.error("Error loading:", file, error);
          return { file, html: "", ok: false };
        }
      })
    );

    results.forEach(({ html, ok }) => {
      if (!ok) return;
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;
      root.appendChild(wrapper);
    });

  }

  loadSections();

})();


