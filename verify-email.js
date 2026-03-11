const verifyForm = document.querySelector("#verify-form");
const verifyStatus = document.querySelector("#verify-status");
const verifySupportCopy = document.querySelector("#verify-support-copy");
const resendEmailCodeButton = document.querySelector("#resend-email-code");
const brandLogoShells = document.querySelectorAll("[data-brand-logo-shell]");
const brandLogoImages = document.querySelectorAll("[data-brand-logo]");

function setMessage(element, message, tone = "neutral") {
  if (!element) {
    return;
  }

  element.textContent = message;
  element.className = `status-message is-${tone}`;
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
    const error = new Error(data.message || "Request failed.");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
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

async function loadVerificationState() {
  try {
    const data = await requestJson("/api/session", {
      headers: {}
    });

    if (!data.authenticated || !data.user) {
      window.location.replace("/login");
      return;
    }

    if (!data.needsEmailVerification) {
      window.location.replace("/app");
      return;
    }

    verifySupportCopy.textContent = `Enter the 6-digit code sent to ${data.user.emailVerification?.maskedEmail || data.user.email || "your email"}.`;
    setMessage(verifyStatus, "Your code is active for 10 minutes.", "neutral");
    verifyForm.hidden = false;
    resendEmailCodeButton.hidden = false;
  } catch (error) {
    setMessage(verifyStatus, error.message || "The verification page could not load.", "error");
  }
}

async function handleVerifySubmit(event) {
  event.preventDefault();
  const submitButton = verifyForm.querySelector('button[type="submit"]');
  const formData = new FormData(verifyForm);
  const code = String(formData.get("code") || "").trim();

  submitButton.disabled = true;
  setMessage(verifyStatus, "Verifying your email...", "neutral");

  try {
    const data = await requestJson("/api/email/verification/confirm", {
      method: "POST",
      body: JSON.stringify({ code })
    });

    setMessage(verifyStatus, data.message, "success");
    verifyForm.reset();

    if (data.redirectTo) {
      window.location.assign(data.redirectTo);
    }
  } catch (error) {
    setMessage(verifyStatus, error.message, "error");
  } finally {
    submitButton.disabled = false;
  }
}

async function handleResendCode() {
  resendEmailCodeButton.disabled = true;
  setMessage(verifyStatus, "Sending a new code...", "neutral");

  try {
    const data = await requestJson("/api/email/verification/resend", {
      method: "POST",
      body: JSON.stringify({})
    });

    verifySupportCopy.textContent = `Enter the 6-digit code sent to ${data.user?.emailVerification?.maskedEmail || data.user?.email || "your email"}.`;
    setMessage(verifyStatus, data.verificationStatus?.message || data.message, "success");
  } catch (error) {
    setMessage(verifyStatus, error.message, "error");
  } finally {
    resendEmailCodeButton.disabled = false;
  }
}

verifyForm.addEventListener("submit", handleVerifySubmit);
resendEmailCodeButton.addEventListener("click", handleResendCode);
initializeBrandLogo();
loadVerificationState();
