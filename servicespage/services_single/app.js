(function () {

  // Single service page uses both full-width and split layout sections.
  const sections = [
    // Shared top bar
    { file: "/planetG/homepage/infobar/infobar.html", target: "root" },
    // Shared navigation
    { file: "/planetG/homepage/header/header.html", target: "root" },
    // Page hero
    { file: "/planetG/servicespage/services_single/single_services_hero/single_services_hero.html", target: "root" },
    // Sidebar service list
    { file: "/planetG/servicespage/services_single/services_list/services_list.html", target: "sidebar" },
    // Main content showcase
    { file: "/planetG/servicespage/services_single/Garden_Oasis_Showcase/Garden_Oasis_Showcase.html", target: "main" },
    // Main content reasons to choose us
    { file: "/planetG/servicespage/services_single/Why_Choose _Us/Why_Choose _Us.html", target: "main" },
    // Main content latest project
    { file: "/planetG/servicespage/services_single/latest_project/latest_project.html", target: "main" },
    // Shared footer
    { file: "/planetG/homepage/footer/footer.html", target: "root" }
  ];

  const root = document.getElementById("page");

  if (!root) {
    console.error("Missing #page container in index.html");
    return;
  }

  const cacheBust = Date.now().toString();

  const withCacheBust = (url) => {
    if (!url) return url;
    if (/^https?:\/\//i.test(url)) return url;
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}v=${cacheBust}`;
  };

  const appendLayoutOverrides = () => {
    const href = withCacheBust("/planetG/assets/layout-overrides.css");
    if (document.head.querySelector(`link[rel="stylesheet"][href="${href}"]`)) {
      return;
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  };

  const moveSectionStyles = (wrapper) => {
    const head = document.head;
    if (!head) return Promise.resolve();

    const links = Array.from(wrapper.querySelectorAll('link[rel="stylesheet"]'));
    const styles = Array.from(wrapper.querySelectorAll("style"));
    const newLinks = [];

    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) {
        link.remove();
        return;
      }
      if (!/^https?:\/\//i.test(href)) {
        link.setAttribute("href", withCacheBust(href));
      }
      const finalHref = link.getAttribute("href");
      if (head.querySelector(`link[rel="stylesheet"][href="${finalHref}"]`)) {
        link.remove();
        return;
      }
      newLinks.push(link);
    });

    styles.forEach((style) => {
      if (!head.contains(style)) head.appendChild(style);
    });

    if (newLinks.length === 0) return Promise.resolve();

    wrapper.style.visibility = "hidden";
    const loadPromises = newLinks.map(
      (link) =>
        new Promise((resolve) => {
          link.addEventListener("load", resolve, { once: true });
          link.addEventListener("error", resolve, { once: true });
        })
    );

    newLinks.forEach((link) => head.appendChild(link));

    return Promise.all(loadPromises).then(() => {
      wrapper.style.visibility = "";
    });
  };

  const layout = document.createElement("div");
  layout.className = "service-layout";

  const sidebar = document.createElement("aside");
  sidebar.className = "service-sidebar";

  const main = document.createElement("div");
  main.className = "service-main";

  layout.appendChild(sidebar);
  layout.appendChild(main);

  let layoutMounted = false;

  async function loadSections() {
    const results = await Promise.all(
      sections.map(async ({ file, target }) => {
        try {
          const response = await fetch(withCacheBust(file), { cache: "no-store" });
          const html = await response.text();
          return { file, target, html, ok: true };
        } catch (error) {
          console.error("Error loading:", file, error);
          return { file, target, html: "", ok: false };
        }
      })
    );

    const stylePromises = [];

    results.forEach(({ html, ok, target }) => {
      if (!ok) return;

      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;
      stylePromises.push(moveSectionStyles(wrapper));

      if (target === "root") {
        root.appendChild(wrapper);
        return;
      }

      if (!layoutMounted) {
        root.appendChild(layout);
        layoutMounted = true;
      }

      if (target === "sidebar") {
        sidebar.appendChild(wrapper);
      } else {
        main.appendChild(wrapper);
      }
    });

    await Promise.all(stylePromises).catch(() => {});
    appendLayoutOverrides();

  }

  loadSections();

})();


