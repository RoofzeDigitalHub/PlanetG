(function () {
  function setServiceItemActive(item) {
    const scope = item.closest(".services-list-section") || document;
    scope.querySelectorAll(".service-item").forEach((el) => el.classList.remove("active"));
    item.classList.add("active");
  }

  function handleTeamScroll(button) {
    const value = parseInt(button.getAttribute("data-team-scroll") || "0", 10);
    if (!Number.isFinite(value) || value === 0) return;
    const section = button.closest(".team-section") || document;
    const slider = section.querySelector(".team-slider");
    if (!slider) return;
    slider.scrollBy({ left: value, behavior: "smooth" });
  }

  function shouldLazyLoad(img) {
    if (img.closest(".hero, .gardyn-hero, .hero-section, .garden-hero")) return false;
    if (img.closest(".gardyn-header, .gardyn-topbar, header")) return false;
    return true;
  }

  function applyLazyLoading(root = document) {
    root.querySelectorAll("img:not([loading])").forEach((img) => {
      if (!shouldLazyLoad(img)) return;
      img.setAttribute("loading", "lazy");
    });
  }

  document.addEventListener("click", (event) => {
    const serviceItem = event.target.closest(".service-item");
    if (serviceItem) {
      event.preventDefault();
      setServiceItemActive(serviceItem);
      return;
    }

    const teamScroll = event.target.closest("[data-team-scroll]");
    if (teamScroll) {
      event.preventDefault();
      handleTeamScroll(teamScroll);
    }
  });

  applyLazyLoading();

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        if (node.matches("img")) {
          applyLazyLoading(node.parentElement || document);
          return;
        }
        if (node.querySelectorAll) {
          applyLazyLoading(node);
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
