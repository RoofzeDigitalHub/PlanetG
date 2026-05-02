(function () {
  if (window.__pgWhatsAppFabInitialized === true) {
    return;
  }

  window.__pgWhatsAppFabInitialized = true;

  const cssBaseHref = "/planetG/assets/whatsapp-fab.css";
  const iconSrc = "/planetG/assets/whatsapp-icons.png";
  const whatsappHref = "https://wa.me/919879232854?text=Hi%20PlanetG%2C%20I%20want%20to%20know%20more%20about%20your%20services.";
  const iconMarkup =
    '<span class="pg-wa-fab__icon" aria-hidden="true">' +
    `<img class="pg-wa-fab__image" src="${iconSrc}" alt="" decoding="async">` +
    "</span>";
  let revealObserver = null;

  const getCssHref = () => {
    const currentScript = document.currentScript;
    if (!currentScript?.src) {
      return cssBaseHref;
    }

    try {
      const scriptUrl = new URL(currentScript.src, window.location.href);
      return scriptUrl.search ? `${cssBaseHref}${scriptUrl.search}` : cssBaseHref;
    } catch (error) {
      return cssBaseHref;
    }
  };

  const ensureStyles = () =>
    new Promise((resolve) => {
      let link = document.head.querySelector('link[data-pg-whatsapp-fab-css="true"]');

      if (link) {
        if (link.dataset.loaded === "true" || link.sheet) {
          link.dataset.loaded = "true";
          resolve();
          return;
        }

        link.addEventListener("load", () => {
          link.dataset.loaded = "true";
          resolve();
        }, { once: true });
        link.addEventListener("error", resolve, { once: true });
        return;
      }

      link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = getCssHref();
      link.dataset.pgWhatsappFabCss = "true";
      link.addEventListener("load", () => {
        link.dataset.loaded = "true";
        resolve();
      }, { once: true });
      link.addEventListener("error", resolve, { once: true });
      document.head.appendChild(link);
    });

  const hydrateButton = (button) => {
    if (!button) return null;

    button.classList.add("pg-wa-fab");
    button.dataset.pgWhatsappFab = "true";
    button.dataset.skipLoader = "true";
    button.href = whatsappHref;
    button.target = "_blank";
    button.rel = "noopener noreferrer";
    button.setAttribute("aria-label", "Chat with Planet G on WhatsApp");

    if (!button.querySelector(".pg-wa-fab__image")) {
      button.innerHTML = iconMarkup;
    }

    return button;
  };

  const hasPageContent = () => {
    const root = document.getElementById("page");
    if (!root) {
      return document.readyState === "interactive" || document.readyState === "complete";
    }

    const visibleChild = Array.from(root.children).some((child) => {
      if (!(child instanceof HTMLElement)) return false;
      const styles = window.getComputedStyle(child);
      if (styles.display === "none" || styles.visibility === "hidden") {
        return false;
      }
      const rect = child.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });

    if (visibleChild) return true;

    if (root.childElementCount > 0 && document.readyState !== "loading") {
      return true;
    }

    return (
      document.documentElement.dataset.pgPageReady === "true" ||
      document.readyState === "complete"
    );
  };

  const disconnectRevealObserver = () => {
    if (!revealObserver) return;
    revealObserver.disconnect();
    revealObserver = null;
  };

  const revealButton = () => {
    const button = ensureButton();
    if (!button) return;
    button.hidden = false;
    button.removeAttribute("hidden");
    button.classList.add("is-ready");
  };

  const maybeRevealButton = () => {
    if (!hasPageContent()) {
      return false;
    }

    revealButton();
    disconnectRevealObserver();
    return true;
  };

  const watchForPageReady = () => {
    if (maybeRevealButton()) {
      return;
    }

    const button = document.querySelector("[data-pg-whatsapp-fab]");
    if (button?.classList.contains("is-ready")) {
      return;
    }

    const root = document.getElementById("page");
    if (root && !revealObserver) {
      revealObserver = new MutationObserver(maybeRevealButton);
      revealObserver.observe(root, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "class"]
      });
    }

    window.addEventListener("load", maybeRevealButton, { once: true });
    window.addEventListener("pg:page-ready", maybeRevealButton, { once: true });
  };

  const ensureButton = () => {
    if (!document.body) {
      return null;
    }

    const existingButton = document.querySelector("[data-pg-whatsapp-fab]");
    if (existingButton) {
      return hydrateButton(existingButton);
    }

    const button = document.createElement("a");
    button.innerHTML = iconMarkup;
    document.body.appendChild(button);
    return hydrateButton(button);
  };

  const init = () => {
    window.requestAnimationFrame(ensureButton);
    ensureStyles().then(maybeRevealButton);
    watchForPageReady();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  window.addEventListener("pageshow", () => {
    init();
    maybeRevealButton();
  });
})();
