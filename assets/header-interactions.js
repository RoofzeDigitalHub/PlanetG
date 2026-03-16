(function () {
  const header = document.querySelector(".gardyn-header");
  const topbar = document.querySelector(".gardyn-topbar");

  const setTopbarHeight = () => {
    const height = topbar ? topbar.getBoundingClientRect().height : 0;
    document.documentElement.style.setProperty("--gardyn-topbar-height", `${Math.round(height)}px`);
  };

  const handleScroll = () => {
    const scrolled = window.scrollY > 10;
    document.body.classList.toggle("gardyn-scrolled", scrolled);
    if (header) {
      header.classList.toggle("scrolled", scrolled);
    }
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

  const closeAllDropdowns = () => {
    document.querySelectorAll(".nav-item.dropdown.show").forEach((item) => {
      item.classList.remove("show");
      const menu = item.querySelector(".dropdown-menu");
      if (menu) menu.classList.remove("show");
    });
  };

  const toggleDropdown = (toggle) => {
    const item = toggle.closest(".nav-item.dropdown");
    if (!item) return;
    const menu = item.querySelector(".dropdown-menu");
    const isOpen = item.classList.toggle("show");
    if (menu) menu.classList.toggle("show", isOpen);
  };

  setTopbarHeight();
  handleScroll();

  window.addEventListener("resize", setTopbarHeight);
  window.addEventListener("scroll", handleScroll, { passive: true });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(setTopbarHeight);
  }

  document.addEventListener("click", (event) => {
    const menuToggle = event.target.closest("[data-menu-toggle]");
    if (menuToggle) {
      event.preventDefault();
      openMenuModal();
      return;
    }

    const menuClose = event.target.closest("[data-menu-close]");
    if (menuClose) {
      event.preventDefault();
      closeMenuModal();
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
      closeAllDropdowns();
    }
  });
})();
