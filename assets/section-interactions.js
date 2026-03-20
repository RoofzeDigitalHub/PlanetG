(function () {
  function setServiceItemActive(item) {
    const scope = item.closest(".services-list-section") || document;
    scope.querySelectorAll(".service-item").forEach((el) => el.classList.remove("active"));
    item.classList.add("active");
  }

  function isTouchWorkCardMode() {
    return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  }

  function toggleWorkCard(card) {
    const scope = card.closest(".latest-works") || document;
    scope.querySelectorAll(".work-card.is-active").forEach((el) => {
      if (el !== card) {
        el.classList.remove("is-active");
      }
    });
    card.classList.toggle("is-active");
  }

  function toggleProjectCard(card) {
    const scope = card.closest(".project-section") || document;
    scope.querySelectorAll(".project-card.is-active").forEach((el) => {
      if (el !== card) {
        el.classList.remove("is-active");
      }
    });
    card.classList.toggle("is-active");
  }

  function setGardenCardExpanded(card, expanded) {
    card.classList.toggle("is-expanded", expanded);
    const button = card.querySelector(".view-btn");
    if (button) {
      button.textContent = expanded ? "VIEW LESS" : "VIEW DETAILS";
      button.setAttribute("aria-expanded", expanded ? "true" : "false");
    }
  }

  function toggleGardenCard(card) {
    const scope = card.closest(".service-section") || document;
    scope.querySelectorAll(".garden-card.is-expanded").forEach((el) => {
      if (el !== card) {
        setGardenCardExpanded(el, false);
      }
    });
    setGardenCardExpanded(card, !card.classList.contains("is-expanded"));
  }

  function clearWorkCards(root = document) {
    root.querySelectorAll(".latest-works .work-card.is-active").forEach((el) => {
      el.classList.remove("is-active");
    });
  }

  function clearProjectCards(root = document) {
    root.querySelectorAll(".project-section .project-card.is-active").forEach((el) => {
      el.classList.remove("is-active");
    });
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
      return;
    }

    const gardenCard = event.target.closest(".garden-card");
    if (gardenCard) {
      toggleGardenCard(gardenCard);
    }

    const workCard = event.target.closest(".work-card");
    if (workCard) {
      if (isTouchWorkCardMode()) {
        event.preventDefault();
        toggleWorkCard(workCard);
      }
      return;
    }

    const projectCard = event.target.closest(".project-card");
    if (projectCard) {
      if (isTouchWorkCardMode()) {
        event.preventDefault();
        toggleProjectCard(projectCard);
      }
      return;
    }

    if (isTouchWorkCardMode()) {
      clearWorkCards();
      clearProjectCards();
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
