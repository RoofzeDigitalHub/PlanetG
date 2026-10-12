/**
 * Planet G - Interactive Functionality
 * Mobile navigation, category gallery filtering, form submissions
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile Menu Toggle
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navMenu = document.getElementById("navMenu");

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      const icon = hamburgerBtn.querySelector("i");
      if (icon) {
        if (navMenu.classList.contains("open")) {
          icon.classList.remove("fa-bars");
          icon.classList.add("fa-xmark");
        } else {
          icon.classList.remove("fa-xmark");
          icon.classList.add("fa-bars");
        }
      }
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target) && navMenu.classList.contains("open")) {
        navMenu.classList.remove("open");
        const icon = hamburgerBtn.querySelector("i");
        if (icon) {
          icon.classList.remove("fa-xmark");
          icon.classList.add("fa-bars");
        }
      }
    });
  }

  // 2. Projects Category Filter & Deep Linking
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");
  const categoryCards = document.querySelectorAll(".project-category-card");
  const categoryGrid = document.getElementById("projectCategoryGrid");
  const gallerySection = document.getElementById("projectGallerySection");
  const backToOverviewBtn = document.getElementById("backToOverviewBtn");
  const activeCategoryTitle = document.getElementById("activeCategoryTitle");

  function filterProjects(category) {
    if (!galleryItems.length) return;

    if (categoryCards.length && categoryGrid && gallerySection) {
      if (category === "all") {
        categoryGrid.style.display = "grid";
      } else {
        categoryGrid.style.display = "none";
      }
      gallerySection.style.display = "block";
    }

    filterBtns.forEach(btn => {
      if (btn.getAttribute("data-filter") === category) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    if (activeCategoryTitle) {
      const activeBtn = document.querySelector(`.filter-btn[data-filter="${category}"]`);
      if (activeBtn) {
        activeCategoryTitle.textContent = activeBtn.textContent.trim();
      }
    }

    galleryItems.forEach(item => {
      const itemCat = item.getAttribute("data-category");
      if (category === "all" || itemCat === category) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });

    // Smooth scroll to gallery
    if (gallerySection && category !== "all") {
      gallerySection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // Attach filter buttons click
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const cat = btn.getAttribute("data-filter");
      filterProjects(cat);
    });
  });

  // Attach category overview card click
  categoryCards.forEach(card => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      const cat = card.getAttribute("data-category");
      filterProjects(cat);
    });
  });

  // Back to overview button
  if (backToOverviewBtn && categoryGrid) {
    backToOverviewBtn.addEventListener("click", (e) => {
      e.preventDefault();
      categoryGrid.style.display = "grid";
      filterProjects("all");
      categoryGrid.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // Check URL params for category on page load
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get("category");
  if (categoryParam) {
    filterProjects(categoryParam);
  }

  // 3. Contact Form Submission
  const contactForm = document.getElementById("contactForm");
  const formFeedback = document.getElementById("formFeedback");

  if (contactForm && formFeedback) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector("button[type='submit']");
      const originalBtnText = submitBtn ? submitBtn.innerHTML : "Send Message";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin icon-sm"></i> Sending...';
      }

      formFeedback.style.display = "none";
      formFeedback.className = "form-feedback";

      const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwM0Py-5gaczalRBj8EuBUmoA2vRcav1KTLCRiX0txXbk1n8QwltiJOIDmhx0cCsMDx/exec";
      const payload = {
        name: contactForm.name ? contactForm.name.value.trim() : "",
        email: contactForm.email ? contactForm.email.value.trim() : "",
        phone: contactForm.phone ? contactForm.phone.value.trim() : "",
        service: contactForm.service ? contactForm.service.value.trim() : "General Consultation / Other",
        message: contactForm.message ? contactForm.message.value.trim() : ""
      };

      try {
        const response = await fetch(SCRIPT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json().catch(() => null);

        if (response.ok && result && result.success) {
          formFeedback.textContent = result.message || "Thank you! Your message has been sent successfully. We will get back to you shortly.";
          formFeedback.classList.add("success");
          formFeedback.style.display = "block";
          contactForm.reset();
        } else {
          const errMsg = (result && result.message) 
            ? result.message 
            : "Unable to send your inquiry at this moment. Please email us directly at office@planetg.co.in or contact via WhatsApp.";
          
          formFeedback.textContent = errMsg;
          formFeedback.className = "form-feedback error";
          formFeedback.style.display = "block";
        }
      } catch (err) {
        formFeedback.textContent = "Thank you! For instant assistance, you can also reach us directly via WhatsApp at +91 9879232854 or office@planetg.co.in.";
        formFeedback.className = "form-feedback";
        formFeedback.style.display = "block";
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  }
});
