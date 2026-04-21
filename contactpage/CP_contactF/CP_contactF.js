(function () {
  const FORM_SELECTOR = "[data-contact-form]";
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
    }, 3000);
  };

  const clearStatus = (status) => {
    if (!status) return;
    status.hidden = true;
    status.textContent = "";
    status.classList.remove("is-success", "is-error");
  };

  const setStatus = (status, message, type) => {
    if (!status) return;
    status.hidden = false;
    status.textContent = message;
    status.classList.remove("is-success", "is-error");
    status.classList.add(`is-${type}`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const button = form.querySelector("[data-send-button]");
    const status = form.querySelector("[data-contact-status]");

    if (typeof form.reportValidity === "function" && !form.reportValidity()) {
      return;
    }

    clearStatus(status);

    if (button) {
      button.disabled = true;
      button.textContent = "SENDING...";
    }

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    console.log("[Contact Form] Submitting payload:", payload);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      const rawBody = await response.text();
      let data = {};

      if (rawBody) {
        console.log("[Contact Form] Raw response:", rawBody);
      }

      if (rawBody) {
        try {
          data = JSON.parse(rawBody);
        } catch (parseError) {
          throw new Error("Invalid JSON response from contact-submit.php");
        }
      }

      console.log("[Contact Form] Server response:", {
        status: response.status,
        ok: response.ok,
        body: data
      });

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      form.reset();
      setStatus(status, data.message || "Message sent successfully!", "success");
      showToast(data.message || "Message sent successfully!", "success");
    } catch (error) {
      const message = error.message || "Server error";
      console.error("[Contact Form] Submit failed:", error);
      setStatus(status, message, "error");
      showToast(message, "error");
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = "SEND MESSAGE";
      }
    }
  };

  const bindForm = (form) => {
    if (!form || form.dataset.contactBound === "true") return;

    form.dataset.contactBound = "true";
    clearStatus(form.querySelector("[data-contact-status]"));
    form.addEventListener("submit", handleSubmit);
  };

  const setup = (root = document) => {
    if (!root || typeof root.querySelectorAll !== "function") return;
    root.querySelectorAll(FORM_SELECTOR).forEach(bindForm);
  };

  window.PlanetGContactForm = { setup };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setup(document));
  } else {
    setup(document);
  }
})();


