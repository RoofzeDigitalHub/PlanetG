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


