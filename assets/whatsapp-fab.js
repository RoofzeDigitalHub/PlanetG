(function () {
  if (window.__pgWhatsAppFabInitialized === true) {
    return;
  }

  window.__pgWhatsAppFabInitialized = true;

  const cssBaseHref = "/planetG/assets/whatsapp-fab.css";
  const whatsappHref = "https://wa.me/919879232854?text=Hi%20PlanetG%2C%20I%20want%20to%20know%20more%20about%20your%20services.";
  const iconMarkup =
    '<span class="pg-wa-fab__icon" aria-hidden="true">' +
    '<svg viewBox="0 0 64 64" focusable="false">' +
    '<path d="M32 11.5c-11.4 0-20.5 8.8-20.5 19.8 0 3.5.9 6.9 2.7 9.8L12.8 53l10.1-3.2c2.8 1.5 5.9 2.3 9.1 2.3 11.3 0 20.5-8.8 20.5-19.8S43.3 11.5 32 11.5Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>' +
    '<path d="M25.4 22.8c-.7 0-1.3.3-1.7.9-1.1 1.3-1.7 3-1.5 4.6.5 3.8 2.6 7.2 5.6 9.9 3.2 2.7 6.9 4 10.4 3.6 1.5-.2 2.9-1 3.9-2.2.4-.5.5-1.3.1-1.9l-1.9-3c-.4-.7-1.4-.9-2.1-.4l-2.5 1.5c-.4.3-.9.3-1.4.1-1-.5-2.2-1.3-3.3-2.3-1.1-1-2-2.2-2.5-3.3-.2-.5-.2-1 .1-1.4l1.6-2.3c.5-.7.3-1.7-.4-2.1l-2.9-2c-.3-.2-.8-.4-1.4-.4Z" fill="currentColor"></path>' +
    "</svg>" +
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

    if (!button.querySelector(".pg-wa-fab__icon")) {
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
