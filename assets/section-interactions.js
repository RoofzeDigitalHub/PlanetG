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

  function getStoreVideoModal() {
    let modal = document.querySelector("[data-store-video-modal]");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.className = "store-video-modal";
    modal.dataset.storeVideoModal = "true";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="store-video-modal-backdrop" data-store-video-close></div>
      <div class="store-video-modal-panel" role="dialog" aria-modal="true" aria-label="Store video preview">
        <button type="button" class="store-video-modal-close" aria-label="Close video" data-store-video-close>&times;</button>
        <div class="store-video-modal-media">
          <video controls playsinline preload="metadata"></video>
        </div>
        <div class="store-video-modal-info">
          <div>
            <small>Name</small>
            <h4 class="store-video-modal-title"></h4>
          </div>
          <div>
            <small>Location</small>
            <p class="store-video-modal-location"></p>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }

  function openStoreVideoModal(card) {
    const source = card.getAttribute("data-store-video-src");
    if (!source) return;

    const modal = getStoreVideoModal();
    const video = modal.querySelector("video");
    const title = modal.querySelector(".store-video-modal-title");
    const location = modal.querySelector(".store-video-modal-location");

    if (!video || !title || !location) return;

    title.textContent = card.getAttribute("data-store-video-title") || "Store Video";
    location.textContent = card.getAttribute("data-store-video-location") || "";

    video.pause();
    video.innerHTML = "";

    const sourceNode = document.createElement("source");
    sourceNode.src = source;
    sourceNode.type = "video/mp4";
    video.appendChild(sourceNode);
    video.load();

    modal.classList.add("is-active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("store-video-modal-open");

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  }

  function closeStoreVideoModal() {
    const modal = document.querySelector("[data-store-video-modal].is-active");
    if (!modal) return;

    const video = modal.querySelector("video");
    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.innerHTML = "";
      video.load();
    }

    modal.classList.remove("is-active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("store-video-modal-open");
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

  function getGalleryModal() {
    let modal = document.querySelector("[data-gallery-modal]");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.className = "gallery-modal";
    modal.dataset.galleryModal = "true";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="gallery-modal-backdrop" data-gallery-close></div>
      <div class="gallery-modal-panel" role="dialog" aria-modal="true" aria-label="Image preview">
        <button type="button" class="gallery-modal-close" aria-label="Close image preview" data-gallery-close>&times;</button>
        <img class="gallery-modal-image" alt="">
        <p class="gallery-modal-caption"></p>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }

  function openGalleryModal(card) {
    const modal = getGalleryModal();
    const img = modal.querySelector(".gallery-modal-image");
    const caption = modal.querySelector(".gallery-modal-caption");
    const previewImage = card.querySelector("img");
    const preferredSource = card.getAttribute("data-gallery-image") || "";
    const fallbackSource = previewImage?.currentSrc || previewImage?.src || "";
    const source = preferredSource || fallbackSource;
    if (!img || !source) return;

    img.onerror = null;
    if (preferredSource && fallbackSource && preferredSource !== fallbackSource) {
      img.onerror = () => {
        img.onerror = null;
        img.src = fallbackSource;
      };
    }

    img.src = source;
    img.alt = card.getAttribute("data-gallery-caption") || card.querySelector("img")?.alt || "Gallery image";

    const captionText = card.getAttribute("data-gallery-caption") || "";
    caption.textContent = captionText;
    caption.hidden = !captionText;

    modal.classList.add("is-active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("gallery-modal-open");
  }

  function closeGalleryModal() {
    const modal = document.querySelector("[data-gallery-modal].is-active");
    if (!modal) return;

    const img = modal.querySelector(".gallery-modal-image");
    if (img) {
      img.src = "";
    }

    modal.classList.remove("is-active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("gallery-modal-open");
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

    const storeVideoClose = event.target.closest("[data-store-video-close]");
    if (storeVideoClose) {
      event.preventDefault();
      closeStoreVideoModal();
      return;
    }

    const storeVideoCard = event.target.closest(".store-video-card");
    if (storeVideoCard) {
      event.preventDefault();
      openStoreVideoModal(storeVideoCard);
      return;
    }

    const galleryClose = event.target.closest("[data-gallery-close]");
    if (galleryClose) {
      event.preventDefault();
      closeGalleryModal();
      return;
    }

    const galleryCard = event.target.closest(".gallery-card");
    if (galleryCard) {
      event.preventDefault();
      openGalleryModal(galleryCard);
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

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeGalleryModal();
      closeStoreVideoModal();
    }

    if ((event.key === "Enter" || event.key === " ") && event.target instanceof Element) {
      const storeVideoCard = event.target.closest(".store-video-card");
      if (storeVideoCard) {
        event.preventDefault();
        openStoreVideoModal(storeVideoCard);
      }
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
