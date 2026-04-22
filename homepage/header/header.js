const header = document.querySelector(".gardyn-header");
const topbar = document.querySelector(".gardyn-topbar");

function setTopbarHeight() {
  const height = topbar ? topbar.getBoundingClientRect().height : 0;
  document.documentElement.style.setProperty("--gardyn-topbar-height", `${Math.round(height)}px`);
}

function handleScroll() {
  const scrolled = window.scrollY > 10;
  document.body.classList.toggle("gardyn-scrolled", scrolled);
  if (header) {
    header.classList.toggle("scrolled", scrolled);
  }
}

const menuModal = document.querySelector("[data-menu-modal]");
const searchModal = document.querySelector("[data-search-modal]");

const openMenuModal = () => {
  if (!menuModal) return;
  menuModal.classList.add("is-active");
  menuModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("menu-modal-open");
};

const closeMenuModal = () => {
  const active = document.querySelector("[data-menu-modal].is-active");
  if (!active) return;
  active.classList.remove("is-active");
  active.setAttribute("aria-hidden", "true");
  document.body.classList.remove("menu-modal-open");
};

const openSearchModal = () => {
  if (!searchModal) return;
  closeMenuModal();
  searchModal.classList.add("is-active");
  searchModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("menu-modal-open");
};

const closeSearchModal = () => {
  const active = document.querySelector("[data-search-modal].is-active");
  if (!active) return;
  active.classList.remove("is-active");
  active.setAttribute("aria-hidden", "true");
  document.body.classList.remove("menu-modal-open");
};

const openVideoModal = (src) => {
  const modal = document.querySelector("[data-video-modal]");
  if (!modal) return;
  const frame = modal.querySelector("iframe");
  if (!frame) return;

  frame.src = src;
  modal.classList.add("is-active");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("video-modal-open");
};

const closeVideoModal = () => {
  const modal = document.querySelector("[data-video-modal].is-active");
  if (!modal) return;
  const frame = modal.querySelector("iframe");
  if (frame) frame.src = "";
  modal.classList.remove("is-active");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("video-modal-open");
};

setTopbarHeight();
handleScroll();

window.addEventListener("resize", setTopbarHeight);
window.addEventListener("scroll", handleScroll, { passive: true });

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(setTopbarHeight);
}

document.addEventListener("click", (event) => {
  const priceToggle = event.target.closest("[data-price-toggle]");
  if (priceToggle) {
    event.preventDefault();
    const section = priceToggle.closest(".price-section");
    if (!section) return;
    const isExpanded = section.classList.toggle("is-expanded");
    const expandedText = priceToggle.getAttribute("data-expanded-text") || "View Less";
    const collapsedText = priceToggle.getAttribute("data-collapsed-text") || "View More";
    priceToggle.textContent = isExpanded ? expandedText : collapsedText;
    return;
  }

  const videoClose = event.target.closest("[data-video-close]");
  if (videoClose) {
    event.preventDefault();
    closeVideoModal();
    return;
  }

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

  const videoTrigger = event.target.closest("[data-video-src]");
  if (videoTrigger) {
    event.preventDefault();
    const src = videoTrigger.getAttribute("data-video-src");
    if (!src) return;
    openVideoModal(src);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeVideoModal();
    closeMenuModal();
    closeSearchModal();
  }
});
