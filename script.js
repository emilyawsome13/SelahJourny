const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const revealElements = document.querySelectorAll(".reveal");
const authModal = document.querySelector("#auth-modal");
const authFeedback = document.querySelector("#auth-feedback");
const authTitle = document.querySelector("#auth-title");
const authTabsContainer = document.querySelector(".auth-tabs");
const authTabs = document.querySelectorAll("[data-auth-tab]");
const authForms = {
  signup: document.querySelector('[data-auth-form="signup"]'),
  login: document.querySelector('[data-auth-form="login"]'),
  recover: document.querySelector('[data-auth-form="recover"]')
};
const authOpenButtons = document.querySelectorAll("[data-open-auth]");
const authCloseButtons = document.querySelectorAll("[data-close-auth]");
const authSwitchButtons = document.querySelectorAll("[data-auth-switch]");
const accountHeading = document.querySelector("#account-heading");
const accountCopy = document.querySelector("#account-copy");
const accountStatusMessage = document.querySelector("#account-status-message");
const guestActions = document.querySelector("#guest-actions");
const memberActions = document.querySelector("#member-actions");
const memberChip = document.querySelector("#member-chip");
const memberChipCopy = document.querySelector("#member-chip-copy");
const previewTitle = document.querySelector("#preview-title");
const previewCopy = document.querySelector("#preview-copy");
const guestOnlyButtons = document.querySelectorAll("[data-guest-only]");
const memberOnlyButtons = document.querySelectorAll("[data-member-only]");
const resendWelcomeEmailButton = document.querySelector("#resend-welcome-email");
const logoutButtons = [
  document.querySelector("#account-logout"),
  document.querySelector("#header-logout")
].filter(Boolean);

function updateAuthQuery(mode) {
  const url = new URL(window.location.href);

  if (mode === "login" || mode === "signup" || mode === "recover") {
    url.searchParams.set("auth", mode);
  } else {
    url.searchParams.delete("auth");
  }

  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

function setMessage(element, message, tone = "neutral") {
  if (!element) {
    return;
  }

  element.textContent = message;
  element.className = `status-message is-${tone}`;
}

function setAuthMode(mode) {
  const isSignup = mode === "signup";
  const isRecover = mode === "recover";

  authTitle.textContent = isSignup
    ? "Create your Selah account"
    : isRecover
      ? "Recover your Selah account"
      : "Welcome back to Selah";

  if (authTabsContainer) {
    authTabsContainer.hidden = isRecover;
  }

  authTabs.forEach((tab) => {
    const isActive = !isRecover && tab.dataset.authTab === mode;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  Object.entries(authForms).forEach(([formMode, form]) => {
    form.hidden = formMode !== mode;
  });

  setMessage(
    authFeedback,
    isSignup
      ? "Use a real email address so your welcome email can be sent once SMTP is configured."
      : isRecover
        ? "Enter your account email and Selah will send a secure reset link."
        : "Enter the email and password you used when creating your account.",
    "neutral"
  );
}

function openAuthModal(mode = "signup") {
  setAuthMode(mode);
  updateAuthQuery(mode);
  authModal.hidden = false;
  document.body.classList.add("modal-open");

  const firstInput = authForms[mode]?.querySelector("input");
  if (firstInput) {
    firstInput.focus();
  }
}

function closeAuthModal() {
  updateAuthQuery(null);
  authModal.hidden = true;
  document.body.classList.remove("modal-open");
}

function getMemberStatus(user) {
  if (user?.welcomeEmail?.mode === "smtp") {
    return {
      message: `Signed in as ${user.email}. Your welcome email has been sent.`,
      tone: "success"
    };
  }

  if (user?.welcomeEmail?.error) {
    return {
      message: "Your welcome email is still in preview mode because SMTP is misconfigured. Fix it and resend when ready.",
      tone: "error"
    };
  }

  if (user?.welcomeEmail?.mode === "preview") {
    return {
      message: "Your welcome email is saved locally as a preview. Configure SMTP and resend it when ready.",
      tone: "neutral"
    };
  }

  return {
    message: `Signed in as ${user.email}.`,
    tone: "success"
  };
}

function updateGuestView(message = "No one is signed in yet.", tone = "neutral") {
  accountHeading.textContent = "Create your Selah account";
  accountCopy.textContent =
    "Sign up to unlock the calmer Bible library. This is where books, verses, notes, plans, and guided history can persist.";
  previewTitle.textContent = "Member library included";
  previewCopy.textContent =
    "Create an account to keep your verse library, study notes, reading plans, and AI guidance in one place.";

  guestActions.hidden = false;
  memberActions.hidden = true;
  memberChip.hidden = true;

  guestOnlyButtons.forEach((button) => {
    button.hidden = false;
  });

  memberOnlyButtons.forEach((button) => {
    button.hidden = true;
  });

  setMessage(accountStatusMessage, message, tone);
}

function updateMemberView(user, message, tone) {
  const status = getMemberStatus(user);

  accountHeading.textContent = `Welcome, ${user.name}`;
  accountCopy.textContent =
    "Your account is active. This is where your Bible library, saved verses, study notes, plans, and guided history now live.";
  previewTitle.textContent = "Your library is live";
  previewCopy.textContent =
    "Sessions are working and your verse library, study notes, reading plans, and AI guidance can stay attached to a real member account.";

  guestActions.hidden = true;
  memberActions.hidden = false;
  memberChip.hidden = false;
  memberChipCopy.textContent = user.name;

  guestOnlyButtons.forEach((button) => {
    button.hidden = true;
  });

  memberOnlyButtons.forEach((button) => {
    button.hidden = false;
  });

  setMessage(accountStatusMessage, message || status.message, tone || status.tone);
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

async function loadSession() {
  try {
    const data = await requestJson("/api/session", {
      headers: {}
    });

    if (data.authenticated && data.user) {
      window.location.replace("/app");
      return;
    }

    updateGuestView();
  } catch {
    updateGuestView("The server is available, but session status could not be loaded.", "error");
  }
}

async function handleAuthSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const mode = form.dataset.authForm;
  const submitButton = form.querySelector('button[type="submit"]');
  const payload = Object.fromEntries(new FormData(form).entries());
  const endpoint = mode === "signup"
    ? "/api/signup"
    : mode === "recover"
      ? "/api/password/forgot"
      : "/api/login";
  const pendingMessage = mode === "signup"
    ? "Creating your account..."
    : mode === "recover"
      ? "Sending your reset link..."
      : "Signing you in...";

  submitButton.disabled = true;
  setMessage(authFeedback, pendingMessage, "neutral");

  try {
    const data = await requestJson(endpoint, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    const successMessage = mode === "recover"
      ? data.message
      : data.redirectTo
      ? "Success. Opening your Bible library..."
      : mode === "signup" && data.emailStatus
        ? data.emailStatus.message
        : data.message;

    setMessage(authFeedback, successMessage, "success");
    form.reset();

    if (mode === "recover") {
      window.setTimeout(() => {
        setAuthMode("login");
        updateAuthQuery("login");
      }, 1200);
      return;
    }

    updateMemberView(data.user, successMessage, "success");

    if (data.redirectTo) {
      window.location.assign(data.redirectTo);
      return;
    }

    closeAuthModal();
  } catch (error) {
    setMessage(authFeedback, error.message, "error");
  } finally {
    submitButton.disabled = false;
  }
}

async function handleLogout() {
  try {
    const data = await requestJson("/api/logout", {
      method: "POST",
      body: JSON.stringify({})
    });

    updateGuestView(data.message, "neutral");
  } catch (error) {
    setMessage(accountStatusMessage, error.message, "error");
  }
}

async function handleResendWelcomeEmail() {
  if (!resendWelcomeEmailButton) {
    return;
  }

  resendWelcomeEmailButton.disabled = true;
  setMessage(accountStatusMessage, "Sending the welcome email again...", "neutral");

  try {
    const data = await requestJson("/api/welcome-email/resend", {
      method: "POST",
      body: JSON.stringify({})
    });

    const tone = data.emailStatus?.mode === "smtp"
      ? "success"
      : data.emailStatus?.error
        ? "error"
        : "neutral";

    updateMemberView(data.user, data.emailStatus?.message || data.message, tone);
  } catch (error) {
    setMessage(accountStatusMessage, error.message, "error");
  } finally {
    resendWelcomeEmailButton.disabled = false;
  }
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

authOpenButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openAuthModal(button.dataset.openAuth || "signup");
  });
});

authCloseButtons.forEach((button) => {
  button.addEventListener("click", closeAuthModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !authModal.hidden) {
    closeAuthModal();
  }
});

authTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setAuthMode(tab.dataset.authTab || "signup");
  });
});

authSwitchButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetMode = button.dataset.authSwitch || "login";
    setAuthMode(targetMode);
    updateAuthQuery(targetMode);

    const firstInput = authForms[targetMode]?.querySelector("input");
    if (firstInput) {
      firstInput.focus();
    }
  });
});

Object.values(authForms).forEach((form) => {
  form.addEventListener("submit", handleAuthSubmit);
});

logoutButtons.forEach((button) => {
  button.addEventListener("click", handleLogout);
});

if (resendWelcomeEmailButton) {
  resendWelcomeEmailButton.addEventListener("click", handleResendWelcomeEmail);
}

const initialAuthMode = new URL(window.location.href).searchParams.get("auth");
if (initialAuthMode === "login" || initialAuthMode === "signup" || initialAuthMode === "recover") {
  openAuthModal(initialAuthMode);
}

loadSession();
