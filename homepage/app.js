(function () {

  const sections = [
    "/planetG/homepage/infobar/infobar.html",
    "/planetG/homepage/header/header.html",
    "/planetG/homepage/herosection/herosection.html",
    "/planetG/homepage/crafting_living/crafting_living.html",
    "/planetG/homepage/ourstory/ourstory.html",
    "/planetG/homepage/servicesection/servicesection.html",
    "/planetG/homepage/Price_List/Price_List.html",
    "/planetG/homepage/whychooseus/whychooseus.html",
    "/planetG/homepage/pricingplan/pricingplan.html",
    "/planetG/homepage/videosection/videosection.html",
    "/planetG/homepage/testimonialslider/testimonialslider.html",
    "/planetG/homepage/latestwork/latestwork.html",
    "/planetG/homepage/footer/footer.html"
  ];

  
  const root = document.getElementById("page");

  if (!root) {
    console.error("Missing #page container in index.html");
    return;
  }

  function setupInteractions() {
    if (document.documentElement.dataset.pgInteractions === "true") {
      return;
    }
    document.documentElement.dataset.pgInteractions = "true";

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
        openMenuModal();
        return;
      }

      const menuClose = event.target.closest("[data-menu-close]");
      if (menuClose) {
        event.preventDefault();
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

  function forceRevealSections() {
    document.querySelectorAll("section.reveal").forEach((el) => {
      el.classList.add("is-visible");
    });
  }

  async function loadSections() {
    const results = await Promise.all(
      sections.map(async (file) => {
        try {
          const response = await fetch(file, { cache: "no-store" });
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

    results.forEach(({ html, ok }) => {
      if (!ok) return;
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;
      root.appendChild(wrapper);
    });

    initTestimonialSlider();
    window.setTimeout(forceRevealSections, 200);
  }

  setupInteractions();
  loadSections();

})();

