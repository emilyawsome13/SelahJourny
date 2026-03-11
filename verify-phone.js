const phoneSetupForm = document.querySelector("#phone-setup-form");
const verifyForm = document.querySelector("#verify-form");
const verifyStatus = document.querySelector("#verify-status");
const verifySupportCopy = document.querySelector("#verify-support-copy");
const resendPhoneCodeButton = document.querySelector("#resend-phone-code");

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

function showPhoneSetupState() {
  verifySupportCopy.textContent = "Add the phone number you want to secure this account with.";
  setMessage(verifyStatus, "We will text you a 6-digit verification code.", "neutral");
  phoneSetupForm.hidden = false;
  verifyForm.hidden = true;
  resendPhoneCodeButton.hidden = true;
}

function showCodeEntryState(maskedPhoneNumber) {
  verifySupportCopy.textContent = `Enter the 6-digit code sent to ${maskedPhoneNumber || "your phone number"}.`;
  setMessage(verifyStatus, "Your code is active for 10 minutes.", "neutral");
  phoneSetupForm.hidden = true;
  verifyForm.hidden = false;
  resendPhoneCodeButton.hidden = false;
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

    if (!data.needsPhoneVerification) {
      window.location.replace("/app");
      return;
    }

    if (!data.user.phone?.number) {
      showPhoneSetupState();
      return;
    }

    showCodeEntryState(data.user.phone?.maskedNumber);
  } catch (error) {
    setMessage(verifyStatus, error.message || "The verification page could not load.", "error");
  }
}

async function handlePhoneSetupSubmit(event) {
  event.preventDefault();
  const submitButton = phoneSetupForm.querySelector('button[type="submit"]');
  const formData = new FormData(phoneSetupForm);
  const phoneNumber = String(formData.get("phoneNumber") || "").trim();

  submitButton.disabled = true;
  setMessage(verifyStatus, "Sending your verification code...", "neutral");

  try {
    const data = await requestJson("/api/phone/verification/start", {
      method: "POST",
      body: JSON.stringify({ phoneNumber })
    });

    phoneSetupForm.reset();
    showCodeEntryState(data.user?.phone?.maskedNumber);
    setMessage(verifyStatus, data.phoneStatus?.message || data.message, "success");
  } catch (error) {
    setMessage(verifyStatus, error.message, "error");
  } finally {
    submitButton.disabled = false;
  }
}

async function handleVerifySubmit(event) {
  event.preventDefault();
  const submitButton = verifyForm.querySelector('button[type="submit"]');
  const formData = new FormData(verifyForm);
  const code = String(formData.get("code") || "").trim();

  submitButton.disabled = true;
  setMessage(verifyStatus, "Verifying your phone...", "neutral");

  try {
    const data = await requestJson("/api/phone/verification/confirm", {
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
  resendPhoneCodeButton.disabled = true;
  setMessage(verifyStatus, "Sending a new code...", "neutral");

  try {
    const data = await requestJson("/api/phone/verification/resend", {
      method: "POST",
      body: JSON.stringify({})
    });

    showCodeEntryState(data.user?.phone?.maskedNumber);
    setMessage(verifyStatus, data.phoneStatus?.message || data.message, "success");
  } catch (error) {
    setMessage(verifyStatus, error.message, "error");
  } finally {
    resendPhoneCodeButton.disabled = false;
  }
}

phoneSetupForm.addEventListener("submit", handlePhoneSetupSubmit);
verifyForm.addEventListener("submit", handleVerifySubmit);
resendPhoneCodeButton.addEventListener("click", handleResendCode);
loadVerificationState();
