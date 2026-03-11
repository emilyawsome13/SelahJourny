const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const revealElements = document.querySelectorAll(".reveal");
const authModal = document.querySelector("#auth-modal");
const authFeedback = document.querySelector("#auth-feedback");
const authTitle = document.querySelector("#auth-title");
const authModeLabel = document.querySelector("#auth-mode-label");
const authModeCopy = document.querySelector("#auth-mode-copy");
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
const siteState = {
  hasUsers: true
};

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
  const safeMode = mode === "login" && !siteState.hasUsers ? "signup" : mode;
  const isSignup = safeMode === "signup";
  const isRecover = safeMode === "recover";
  const modeLabel = isSignup
    ? "New account"
    : isRecover
      ? "Recovery"
      : "Existing member";
  const modeCopy = isSignup
    ? siteState.hasUsers
      ? "This flow creates a new Selah account for this live site."
      : "This live site does not have any accounts yet, so create the first one here."
    : isRecover
      ? "This flow sends a secure reset link to the email attached to your account."
      : siteState.hasUsers
        ? "This flow only signs into an account that already exists on this live site."
        : "Login is not available until the first live account is created.";

  authTitle.textContent = isSignup
    ? "Create your Selah account"
    : isRecover
      ? "Reset your Selah password"
      : "Log in to your Selah account";

  if (authModeLabel) {
    authModeLabel.textContent = modeLabel;
  }

  if (authModeCopy) {
    authModeCopy.textContent = modeCopy;
  }

  if (authTabsContainer) {
    authTabsContainer.hidden = isRecover;
  }

  authTabs.forEach((tab) => {
    const isActive = !isRecover && tab.dataset.authTab === safeMode;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  Object.entries(authForms).forEach(([formMode, form]) => {
    form.hidden = formMode !== safeMode;
  });

  setMessage(
    authFeedback,
    isSignup
      ? siteState.hasUsers
        ? "Use a real email address so your welcome email can be sent once SMTP is configured."
        : "This live site does not have any accounts yet. Create the first account here."
      : isRecover
        ? "Enter your account email and Selah will send a secure reset link."
        : siteState.hasUsers
          ? "Enter the email and password you used when creating your account."
          : "No accounts exist on this deployment yet. Create one first.",
    "neutral"
  );
}

function openAuthModal(mode = "signup") {
  const safeMode = mode === "login" && !siteState.hasUsers ? "signup" : mode;
  setAuthMode(safeMode);
  updateAuthQuery(safeMode);
  authModal.hidden = false;
  document.body.classList.add("modal-open");

  const firstInput = authForms[safeMode]?.querySelector("input");
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
  accountHeading.textContent = siteState.hasUsers ? "Create your Selah account" : "Create the first Selah account";
  accountCopy.textContent = siteState.hasUsers
    ? "Sign up to unlock the Bible browser. This is where books, generated verses, notes, and guided history can persist."
    : "This deployment does not have any member accounts yet. Create one here to unlock the Bible browser and save your own library.";
  previewTitle.textContent = siteState.hasUsers ? "Member library included" : "Fresh live deployment";
  previewCopy.textContent = siteState.hasUsers
    ? "Create an account to keep your verse library, study notes, generated verses, and AI guidance in one place."
    : "Local accounts do not automatically exist on this live site. Create your account here to start using the deployed version.";

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
    "Your account is active. This is where your Bible browser, saved verses, study notes, generated verses, and guided history now live.";
  previewTitle.textContent = "Your library is live";
  previewCopy.textContent =
    "Sessions are working and your verse library, study notes, generated verses, and AI guidance can stay attached to a real member account.";

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
    const error = new Error(data.message || "Request failed.");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

async function loadSession() {
  try {
    const data = await requestJson("/api/session", {
      headers: {}
    });

    siteState.hasUsers = data.hasUsers !== false;

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

    if (mode === "signup") {
      siteState.hasUsers = true;
    }

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
    if (mode === "login" && error.status === 401) {
      siteState.hasUsers = error.data?.hasUsers !== false;

      if (!siteState.hasUsers) {
        setAuthMode("signup");
        updateAuthQuery("signup");
        setMessage(
          authFeedback,
          "This live site does not have an account database yet. Create your account on this deployment first.",
          "error"
        );
        updateGuestView(authFeedback.textContent, "error");
        return;
      }

      setMessage(
        authFeedback,
        "That email or password did not match this live site. If your account was only created locally, create it here instead, or use Forgot your password.",
        "error"
      );
      return;
    }

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
