(function () {

  // Homepage sections load in the same order they appear on the page.
  const sections = [
    // Top utility bar
    "/planetG/homepage/infobar/infobar.html",
    // Main navigation
    "/planetG/homepage/header/header.html",
    // Hero banner
    "/planetG/homepage/herosection/herosection.html",
    // Client logo showcase
    "/planetG/homepage/client_logo/client_logo.html",
    // Intro content
    "/planetG/homepage/crafting_living/crafting_living.html",
    // Services preview
    "/planetG/homepage/servicesection/servicesection.html",
    // Price list teaser
    "/planetG/homepage/Price_List/Price_List.html",
    // Our story feature block
    "/planetG/homepage/ourstory/ourstory.html",
    // Why choose us block
    "/planetG/homepage/whychooseus/whychooseus.html",
    // Pricing plans
    "/planetG/homepage/pricingplan/pricingplan.html",
    // Video section
    "/planetG/homepage/videosection/videosection.html",
    // Testimonials
    "/planetG/homepage/testimonialslider/testimonialslider.html",
    // Latest work
    "/planetG/homepage/latestwork/latestwork.html",
    // Footer
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

  function setupInteractions() {
    if (document.documentElement.dataset.pgInteractions === "true") {
      return;
    }
    document.documentElement.dataset.pgInteractions = "true";

    const handleClientScroll = (button) => {
      const direction = parseInt(button.getAttribute("data-client-scroll") || "0", 10);
      if (!Number.isFinite(direction) || direction === 0) return;

      const section = button.closest(".client-logo-section") || document;
      const track = section.querySelector("[data-client-track]");
      const card = track?.querySelector(".client-logo-card");
      if (!track || !card) return;

      const styles = window.getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap || "0");
      const distance = card.getBoundingClientRect().width + gap;

      track.scrollBy({
        left: distance * direction,
        behavior: "smooth"
      });
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

    document.addEventListener("click", (event) => {
      const clientScroll = event.target.closest("[data-client-scroll]");
      if (clientScroll) {
        event.preventDefault();
        handleClientScroll(clientScroll);
        return;
      }

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
      }
    });
  }

  function initTestimonialSlider() {
    const section = document.querySelector(".quote-section");
    if (!section || section.dataset.sliderReady === "true") return;

    const textEl = document.getElementById("quoteText");
    const authorEl = document.getElementById("quoteAuthor");
    const dotsEl = document.getElementById("quoteDots");
    if (!textEl || !authorEl || !dotsEl) return;

    section.dataset.sliderReady = "true";

    const quotes = [
      {
        text: "This translation accurately conveys the original message, highlighting the professionalism and expertise of the Gardyn team.",
        author: "Donette Fendren"
      },
      {
        text: "Their attention to detail and thoughtful design choices made our garden feel like an extension of our home.",
        author: "Kimberly Lytton"
      },
      {
        text: "From planning to maintenance, every step was handled with care and clear communication.",
        author: "Orlando Diggs"
      }
    ];

    let index = 0;

    const renderDots = () => {
      dotsEl.innerHTML = "";
      quotes.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.className = "quote-dot" + (i === index ? " active" : "");
        dotsEl.appendChild(dot);
      });
    };

    const showQuote = (i) => {
      index = i;
      textEl.textContent = quotes[i].text;
      authorEl.textContent = quotes[i].author;
      renderDots();
    };

    showQuote(index);

    window.setInterval(() => {
      showQuote((index + 1) % quotes.length);
    }, 3500);
  }

  async function loadSections() {
    const results = await Promise.all(
      sections.map(async (file) => {
        try {
          const response = await fetch(withCacheBust(file), { cache: "no-store" });
          if (!response.ok) {
            console.error("Failed to load:", file, response.status);
            return { file, html: "", ok: false };
          }
          const html = await response.text();
          return { file, html, ok: true };
        } catch (error) {
          console.error("Error loading:", file, error);
          return { file, html: "", ok: false };
        }
      })
    );

    const stylePromises = [];

    results.forEach(({ html, ok }) => {
      if (!ok) return;
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;
      stylePromises.push(moveSectionStyles(wrapper));
      root.appendChild(wrapper);
    });

    await Promise.all(stylePromises).catch(() => {});
    appendLayoutOverrides();
    initTestimonialSlider();
    window.PGRevealRefresh?.();
  }

  setupInteractions();
  loadSections();

})();

