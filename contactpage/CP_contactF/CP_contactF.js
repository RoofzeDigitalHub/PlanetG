(function () {
  const FORM_SELECTOR = "#contactForm, [data-contact-form]";
  let toastTimer = null;

  const ensureToast = () => {
    let toast = document.querySelector("[data-contact-toast]");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "contact-toast";
      toast.setAttribute("data-contact-toast", "");
      document.body.appendChild(toast);
    }
    return toast;
  };

  const showToast = (message, type = "success") => {
    const toast = ensureToast();
    toast.textContent = message;
    toast.className = `contact-toast is-${type} is-visible`;

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 4000);
  };

  const clearStatus = (status) => {
    if (!status) return;
    status.style.display = "none";
    status.textContent = "";
    status.className = "contact-form-status";
  };

  const setStatus = (status, message, type) => {
    if (!status) return;
    status.style.display = "block";
    status.textContent = message;
    status.className = `contact-form-status status-${type}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const button = form.querySelector("#sendBtn, [data-send-button]");
    const btnText = form.querySelector("#btnText");
    const btnSpinner = form.querySelector("#btnSpinner");
    const status = form.querySelector("#formStatus, [data-contact-status]");

    const nameInput = form.name;
    const emailInput = form.email;
    const phoneInput = form.phone;
    const serviceInput = form.service;
    const messageInput = form.message;

    const name = (nameInput?.value || "").trim();
    const email = (emailInput?.value || "").trim();
    const service = (serviceInput?.value || "").trim();
    const message = (messageInput?.value || "").trim();

    // Clear previous validation states
    [nameInput, emailInput, messageInput].forEach(inp => inp && inp.classList.remove("is-invalid"));
    clearStatus(status);

    if (!name) {
      if (nameInput) nameInput.classList.add("is-invalid");
      setStatus(status, "Please enter your name.", "error");
      nameInput?.focus();
      return;
    }

    if (!email) {
      if (emailInput) emailInput.classList.add("is-invalid");
      setStatus(status, "Please enter your email address.", "error");
      emailInput?.focus();
      return;
    }

    const emailPattern = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    if (!emailPattern.test(email)) {
      if (emailInput) emailInput.classList.add("is-invalid");
      setStatus(status, "Please enter a valid email address.", "error");
      emailInput?.focus();
      return;
    }

    if (!message) {
      if (messageInput) messageInput.classList.add("is-invalid");
      setStatus(status, "Please enter your message.", "error");
      messageInput?.focus();
      return;
    }

    if (button) {
      button.disabled = true;
      if (btnText) btnText.textContent = "Sending...";
      if (btnSpinner) btnSpinner.style.display = "inline-block";
    }

    const formData = new FormData(form);
    if (service) {
      formData.set("message", `[Service: ${service}]\n\n${message}`);
    }

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      let data = {};
      try {
        data = await response.json();
      } catch (parseError) {
        // Fallback if response isn't JSON
      }

      const isSuccess = response.ok && (data.status === "success" || data.ok === true);

      if (isSuccess) {
        form.reset();
        const successMsg = data.message || "Thank you! Your enquiry has been submitted successfully.";
        setStatus(status, successMsg, "success");
        showToast(successMsg, "success");
      } else {
        const errorMsg = (data && data.message) ? data.message : "Unable to submit your enquiry. Please try again.";
        setStatus(status, errorMsg, "error");
        showToast(errorMsg, "error");
      }
    } catch (error) {
      console.error("[Contact Form] Submit error:", error);
      const networkMsg = "Unable to submit your enquiry. Please try again.";
      setStatus(status, networkMsg, "error");
      showToast(networkMsg, "error");
    } finally {
      if (button) {
        button.disabled = false;
        if (btnText) btnText.textContent = "Send Message";
        if (btnSpinner) btnSpinner.style.display = "none";
      }
    }
  };

  const bindForm = (form) => {
    if (!form || form.dataset.contactBound === "true") return;
    form.dataset.contactBound = "true";
    clearStatus(form.querySelector("#formStatus, [data-contact-status]"));
    form.addEventListener("submit", handleSubmit);
  };

  const setup = (root = document) => {
    if (!root || typeof root.querySelectorAll !== "function") return;
    root.querySelectorAll(FORM_SELECTOR).forEach(bindForm);
  };

  window.PlanetGContactForm = { setup };

  // Observe mutation in case #page is rendered dynamically
  const observer = new MutationObserver(() => {
    const form = document.querySelector(FORM_SELECTOR);
    if (form && form.dataset.contactBound !== "true") {
      bindForm(form);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setup(document));
  } else {
    setup(document);
  }
})();
