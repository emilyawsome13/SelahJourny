const resetForm = document.querySelector("#reset-form");
const resetStatus = document.querySelector("#reset-status");
const resetSupportCopy = document.querySelector("#reset-support-copy");
const resetToken = new URL(window.location.href).searchParams.get("token") || "";
const brandLogoShells = document.querySelectorAll("[data-brand-logo-shell]");
const brandLogoImages = document.querySelectorAll("[data-brand-logo]");

function setMessage(element, message, tone = "neutral") {
  if (!element) {
    return;
  }

  element.textContent = message;
  element.className = `status-message is-${tone}`;
}

function initializeBrandLogo() {
  if (!brandLogoImages.length) {
    return;
  }

  const probe = new Image();
  probe.onload = () => {
    brandLogoShells.forEach((shell) => {
      shell.hidden = false;
    });

    brandLogoImages.forEach((image) => {
      image.src = "/assets/selah-logo.png";
      image.hidden = false;
    });
  };
  probe.src = "/assets/selah-logo.png";
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

async function verifyToken() {
  if (!resetToken) {
    resetSupportCopy.textContent = "This recovery link is missing the reset token.";
    setMessage(resetStatus, "This reset link is invalid or expired.", "error");
    return;
  }

  try {
    const data = await requestJson(`/api/password/reset/validate?token=${encodeURIComponent(resetToken)}`, {
      headers: {}
    });

    resetSupportCopy.textContent = `This reset link is active for ${data.email}. Choose a new password below.`;
    setMessage(resetStatus, "Reset link verified. Choose a strong new password.", "success");
    resetForm.hidden = false;
  } catch (error) {
    resetSupportCopy.textContent = "Ask for a new recovery link from the login screen and try again.";
    setMessage(resetStatus, error.message, "error");
  }
}

async function handleResetSubmit(event) {
  event.preventDefault();

  const submitButton = resetForm.querySelector('button[type="submit"]');
  const formData = new FormData(resetForm);
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (password !== confirmPassword) {
    setMessage(resetStatus, "Your passwords do not match.", "error");
    return;
  }

  submitButton.disabled = true;
  setMessage(resetStatus, "Updating your password...", "neutral");

  try {
    const data = await requestJson("/api/password/reset", {
      method: "POST",
      body: JSON.stringify({
        token: resetToken,
        password
      })
    });

    setMessage(resetStatus, data.message, "success");
    resetForm.reset();

    if (data.redirectTo) {
      window.location.assign(data.redirectTo);
    }
  } catch (error) {
    setMessage(resetStatus, error.message, "error");
  } finally {
    submitButton.disabled = false;
  }
}

resetForm.addEventListener("submit", handleResetSubmit);
initializeBrandLogo();
verifyToken();
