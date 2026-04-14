(function () {

  // Contact page sections follow the same top-to-bottom reading order.
  const sections = [
    // Shared top bar
    "/planetG/homepage/infobar/infobar.html",
    // Shared navigation
    "/planetG/homepage/header/header.html",
    // Contact hero
    "/planetG/contactpage/CP_hero/CP_hero.html",
    // Contact form
    "/planetG/contactpage/CP_contactF/CP_contactF.html",
    // Shared footer
    "/planetG/homepage/footer/footer.html"
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

  const markPageReady = () => {
    document.documentElement.dataset.pgPageReady = "true";
    window.dispatchEvent(new CustomEvent("pg:page-ready"));
  };

  const setupContactForm = () => {
    const form = document.querySelector("[data-contact-form]");
    if (!form || form.dataset.contactBound === "true") {
      return;
    }
    form.dataset.contactBound = "true";

    const status = form.querySelector("[data-contact-status]");
    const submitButton = form.querySelector("[data-send-button]");
    const defaultButtonText = submitButton ? submitButton.textContent : "";

    const setStatus = (message, type) => {
      if (!status) return;
      status.hidden = false;
      status.textContent = message;
      status.classList.remove("is-success", "is-error");
      if (type) {
        status.classList.add(type === "success" ? "is-success" : "is-error");
      }
    };

    const clearStatus = () => {
      if (!status) return;
      status.hidden = true;
      status.textContent = "";
      status.classList.remove("is-success", "is-error");
    };

    const clearFieldErrors = () => {
      form.querySelectorAll(".form-control").forEach((field) => {
        field.classList.remove("is-invalid");
        field.removeAttribute("aria-invalid");
      });
    };

    const markInvalidFields = (fields) => {
      if (!fields) return;
      Object.keys(fields).forEach((name) => {
        const field = form.querySelector(`[name="${name}"]`);
        if (!field) return;
        field.classList.add("is-invalid");
        field.setAttribute("aria-invalid", "true");
      });
    };

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearStatus();
      clearFieldErrors();

      const formData = new FormData(form);

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "SENDING...";
      }

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json"
          }
        });

        const payload = await response.json().catch(() => ({
          ok: false,
          message: "Unexpected server response. Please try again."
        }));

        if (!response.ok || !payload.ok) {
          markInvalidFields(payload.errors);
          setStatus(payload.message || "Unable to send your message right now.", "error");
          return;
        }

        form.reset();
        setStatus(payload.message || "Thanks! Your message has been sent.", "success");
      } catch (error) {
        setStatus("We could not connect to the mail service. Please try again in a moment.", "error");
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = defaultButtonText;
        }
      }
    });
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

  async function loadSections() {
    const results = await window.PGPagePrefetch.loadSections("contact", sections);

    const stylePromises = [];

    results.forEach(({ html, ok }) => {
      if (!ok) return;
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;
      stylePromises.push(moveSectionStyles(wrapper));
      root.appendChild(wrapper);
    });

    await Promise.all(stylePromises).catch(() => {});
    setupContactForm();
    appendLayoutOverrides();
    markPageReady();
  }

  loadSections();

})();


