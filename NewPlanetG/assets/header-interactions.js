(function () {
  const getHeader = () => document.querySelector(".gardyn-header");
  const getTopbar = () => document.querySelector(".gardyn-topbar");
  const getHeaderScrollThreshold = () => (
    window.matchMedia("(max-width: 991.98px)").matches ? 24 : 10
  );

  const setTopbarHeight = () => {
    const topbar = getTopbar();
    const height = topbar ? topbar.getBoundingClientRect().height : 0;
    document.documentElement.style.setProperty("--gardyn-topbar-height", `${Math.round(height)}px`);
  };

  const handleScroll = () => {
    const header = getHeader();
    const scrolled = window.scrollY > getHeaderScrollThreshold();
    document.body.classList.toggle("gardyn-scrolled", scrolled);
    if (header) {
      header.classList.toggle("scrolled", scrolled);
    }
  };

  const syncHeaderLayout = () => {
    setTopbarHeight();
    handleScroll();
  };

  const openMenuModal = () => {
    const modal = document.querySelector("[data-menu-modal]");
    if (!modal) return;
    modal.classList.add("is-active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("menu-modal-open");
  };

  const closeMenuModal = () => {
    const modal = document.querySelector("[data-menu-modal].is-active");
    if (!modal) return;
    modal.classList.remove("is-active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-modal-open");
  };

  const openSearchModal = () => {
    const modal = document.querySelector("[data-search-modal]");
    if (!modal) return;
    closeMenuModal();
    modal.classList.add("is-active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("menu-modal-open");
  };

  const closeSearchModal = () => {
    const modal = document.querySelector("[data-search-modal].is-active");
    if (!modal) return;
    modal.classList.remove("is-active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-modal-open");
  };

  const closeAllDropdowns = () => {
    document.querySelectorAll(".nav-item.dropdown.show").forEach((item) => {
      item.classList.remove("show");
      const menu = item.querySelector(".dropdown-menu");
      if (menu) menu.classList.remove("show");
    });
  };

  const normalizePath = (pathname) => {
    const normalized = (pathname || "/").trim().toLowerCase();
    if (!normalized || normalized === "/") return "/";
    return normalized.replace(/\/+$/, "") || "/";
  };

  const isHomePath = (pathname) => {
    const path = normalizePath(pathname);
    return [
      "/",
      "/index.html",
      "/planetg",
      "/planetg/index.html",
      "/planetg/homepage",
      "/planetg/homepage/index",
      "/planetg/homepage/index/index.html"
    ].includes(path);
  };

  const getCurrentRoute = () => {
    const path = normalizePath(window.location.pathname);

    if (isHomePath(path)) return "home";
    if (path.startsWith("/planetg/servicespage")) return "services";
    if (path.startsWith("/planetg/pagesection/abouts_us")) return "about";
    if (path.startsWith("/planetg/projectspage")) return "projects";
    if (path.startsWith("/planetg/pagesection/gallery")) return "gallery";
    if (path.startsWith("/planetg/storepage")) return "store";
    if (path.startsWith("/planetg/contactpage")) return "contact";

    return "";
  };

  const syncActiveNavLinks = () => {
    const currentRoute = getCurrentRoute();

    document.querySelectorAll("[data-nav-route]").forEach((link) => {
      const isActive = !!currentRoute && link.getAttribute("data-nav-route") === currentRoute;

      link.classList.toggle("is-active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const resetSharedHeaderUi = () => {
    closeMenuModal();
    closeSearchModal();
    closeAllDropdowns();
    syncHeaderLayout();
    syncActiveNavLinks();
  };

  const scheduleSharedHeaderUiReset = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resetSharedHeaderUi);
    });
  };

  const watchForSharedHeader = () => {
    if (!document.body) return;

    if (document.querySelector(".gardyn-header") || document.querySelector(".gardyn-topbar")) {
      scheduleSharedHeaderUiReset();
      return;
    }

    const observer = new MutationObserver(() => {
      if (!document.querySelector(".gardyn-header") && !document.querySelector(".gardyn-topbar")) {
        return;
      }

      scheduleSharedHeaderUiReset();
      observer.disconnect();
    });

    observer.observe(document.body, { childList: true, subtree: true });
  };

  const toggleDropdown = (toggle) => {
    const item = toggle.closest(".nav-item.dropdown");
    if (!item) return;
    const menu = item.querySelector(".dropdown-menu");
    const isOpen = item.classList.toggle("show");
    if (menu) menu.classList.toggle("show", isOpen);
  };

  resetSharedHeaderUi();
  watchForSharedHeader();

  window.addEventListener("resize", syncHeaderLayout);
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("load", scheduleSharedHeaderUiReset);
  window.addEventListener("pageshow", scheduleSharedHeaderUiReset);
  window.addEventListener("hashchange", scheduleSharedHeaderUiReset);
  window.addEventListener("popstate", scheduleSharedHeaderUiReset);
  window.addEventListener("pg:page-ready", scheduleSharedHeaderUiReset);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleSharedHeaderUiReset);
  }

  document.addEventListener("click", (event) => {
    const menuToggle = event.target.closest("[data-menu-toggle]");
    if (menuToggle) {
      event.preventDefault();
      closeSearchModal();
      openMenuModal();
      return;
    }

    const menuClose = event.target.closest("[data-menu-close]");
    if (menuClose) {
      event.preventDefault();
      closeMenuModal();
      return;
    }

    const searchToggle = event.target.closest("[data-search-toggle]");
    if (searchToggle) {
      event.preventDefault();
      openSearchModal();
      return;
    }

    const searchClose = event.target.closest("[data-search-close]");
    if (searchClose) {
      event.preventDefault();
      closeSearchModal();
      return;
    }

    const mobileToggle = event.target.closest("[data-mobile-toggle]");
    if (mobileToggle) {
      event.preventDefault();
      const item = mobileToggle.closest(".mobile-item");
      if (!item) return;
      const isOpen = item.classList.toggle("is-open");
      mobileToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      return;
    }

    const mobileLink = event.target.closest(".mobile-link");
    if (mobileLink) {
      closeMenuModal();
      return;
    }

    const menuLink = event.target.closest(".menu-link");
    if (menuLink) {
      closeMenuModal();
      return;
    }

    const dropdownToggle = event.target.closest(".nav-item.dropdown > .nav-link");
    if (dropdownToggle) {
      event.preventDefault();
      closeAllDropdowns();
      toggleDropdown(dropdownToggle);
      return;
    }

    if (!event.target.closest(".nav-item.dropdown")) {
      closeAllDropdowns();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenuModal();
      closeSearchModal();
      closeAllDropdowns();
    }
  });
})();
