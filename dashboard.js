const dashboardGreeting = document.querySelector("#dashboard-greeting");
const dashboardMemberName = document.querySelector("#dashboard-member-name");
const dashboardStatus = document.querySelector("#dashboard-status");
const dashboardLogout = document.querySelector("#dashboard-logout");
const dashboardResendEmail = document.querySelector("#dashboard-resend-email");
const brandLogoShells = document.querySelectorAll("[data-brand-logo-shell]");
const brandLogoImages = document.querySelectorAll("[data-brand-logo]");
const tabButtons = Array.from(document.querySelectorAll(".workspace-tab-button[data-tab-target]"));
const tabPanels = Array.from(document.querySelectorAll("[data-tab-panel]"));
const tabShortcutButtons = Array.from(document.querySelectorAll("[data-open-tab]"));

const statBooks = document.querySelector("#stat-books");
const statTopics = document.querySelector("#stat-topics");
const statSavedVerses = document.querySelector("#stat-saved-verses");
const statStudyNotes = document.querySelector("#stat-study-notes");
const statCurrentBook = document.querySelector("#stat-current-book");

const quickVerseReference = document.querySelector("#quick-verse-reference");
const quickVerseBadge = document.querySelector("#quick-verse-badge");
const quickVerseText = document.querySelector("#quick-verse-text");
const quickVerseMeta = document.querySelector("#quick-verse-meta");
const quickVerseReason = document.querySelector("#quick-verse-reason");
const quickVerseSaveButton = document.querySelector("#quick-verse-save");
const quickVerseOpenButton = document.querySelector("#quick-verse-open");
const quickVerseNoteButton = document.querySelector("#quick-verse-note");
const quickGenerateAnotherButton = document.querySelector("#quick-generate-another");

const memberEmailValue = document.querySelector("#member-email-value");
const memberSinceValue = document.querySelector("#member-since-value");
const continueReadingReference = document.querySelector("#continue-reading-reference");
const continueReadingCopy = document.querySelector("#continue-reading-copy");
const continueReadingButton = document.querySelector("#continue-reading-button");

const browserTranslation = document.querySelector("#browser-translation");
const browserBook = document.querySelector("#browser-book");
const browserChapter = document.querySelector("#browser-chapter");
const browserSearch = document.querySelector("#browser-search");
const browserLoadButton = document.querySelector("#browser-load-button");
const browserSavePositionButton = document.querySelector("#browser-save-position");
const browserStatus = document.querySelector("#browser-status");
const browserBookCount = document.querySelector("#browser-book-count");
const browserBookList = document.querySelector("#browser-book-list");

const readerHeading = document.querySelector("#reader-heading");
const readerMeta = document.querySelector("#reader-meta");
const readerSourcePill = document.querySelector("#reader-source-pill");
const chapterHeadingList = document.querySelector("#chapter-heading-list");
const chapterVerseList = document.querySelector("#chapter-verse-list");

const selectedVerseReference = document.querySelector("#selected-verse-reference");
const selectedVerseText = document.querySelector("#selected-verse-text");
const saveSelectedVerseButton = document.querySelector("#save-selected-verse");
const generateFromSelectionButton = document.querySelector("#generate-from-selection");
const selectedVerseToNoteButton = document.querySelector("#selected-verse-to-note");

const studyNoteForm = document.querySelector("#study-note-form");
const studyNoteTitle = document.querySelector("#study-note-title");
const studyNoteReference = document.querySelector("#study-note-reference");
const studyNoteVerseText = document.querySelector("#study-note-verse-text");
const studyNoteBody = document.querySelector("#study-note-body");
const studyNoteTranslationId = document.querySelector("#study-note-translation-id");
const studyNoteBookId = document.querySelector("#study-note-book-id");
const studyNoteChapter = document.querySelector("#study-note-chapter");
const studyNoteVerse = document.querySelector("#study-note-verse");
const studyNoteStatus = document.querySelector("#study-note-status");

const generatorForm = document.querySelector("#generator-form");
const generatorModeButtons = document.querySelectorAll("[data-generator-mode]");
const generatorModeLabel = document.querySelector("#generator-mode-label");
const generatorTopic = document.querySelector("#generator-topic");
const generatorTestament = document.querySelector("#generator-testament");
const generatorBook = document.querySelector("#generator-book");
const generatorTopicList = document.querySelector("#generator-topic-list");
const generatorStatus = document.querySelector("#generator-status");

const generatedVerseReference = document.querySelector("#generated-verse-reference");
const generatedVerseBadge = document.querySelector("#generated-verse-badge");
const generatedVerseText = document.querySelector("#generated-verse-text");
const generatedVerseMeta = document.querySelector("#generated-verse-meta");
const generatedVerseReason = document.querySelector("#generated-verse-reason");
const generatedVerseSaveButton = document.querySelector("#generated-verse-save");
const generatedVerseOpenButton = document.querySelector("#generated-verse-open");
const generatedVerseNoteButton = document.querySelector("#generated-verse-note");
const generatedVerseRefreshButton = document.querySelector("#generated-verse-refresh");

const savedVersesList = document.querySelector("#saved-verses-list");
const studyNotesList = document.querySelector("#study-notes-list");

const accountEmail = document.querySelector("#account-email");
const accountJoined = document.querySelector("#account-joined");
const accountEmailState = document.querySelector("#account-email-state");

const profileForm = document.querySelector("#profile-form");
const profileName = document.querySelector("#profile-name");
const profileFocus = document.querySelector("#profile-focus");
const profileSeason = document.querySelector("#profile-season");
const profileBio = document.querySelector("#profile-bio");
const profileFormStatus = document.querySelector("#profile-form-status");

const passwordForm = document.querySelector("#password-form");
const passwordFormStatus = document.querySelector("#password-form-status");
const settingsForm = document.querySelector("#settings-form");
const settingsStartTab = document.querySelector("#settings-start-tab");
const settingsPreferredTranslation = document.querySelector("#settings-preferred-translation");
const settingsDefaultGeneratorMode = document.querySelector("#settings-default-generator-mode");
const settingsAiVoice = document.querySelector("#settings-ai-voice");
const settingsReminderTime = document.querySelector("#settings-reminder-time");
const settingsWeeklyDigest = document.querySelector("#settings-weekly-digest");
const settingsShowVerseReason = document.querySelector("#settings-show-verse-reason");
const settingsCompactBookCards = document.querySelector("#settings-compact-book-cards");
const settingsFormStatus = document.querySelector("#settings-form-status");

const generatorModeLabels = {
  random: "Random verse",
  daily: "Verse of the day",
  topic: "Topic verse",
  testament: "Testament verse",
  book: "Book verse",
  chapter: "Chapter verse"
};

const workspaceTabs = tabPanels.map((panel) => panel.dataset.tabPanel).filter(Boolean);

const state = {
  user: null,
  books: [],
  translations: [],
  topics: [],
  readingPosition: {
    translationId: "BSB",
    bookId: "JHN",
    chapter: 1
  },
  currentChapter: null,
  bookSearch: "",
  currentContextVerse: null,
  quickVerse: null,
  generatedVerse: null,
  generatorMode: "random",
  generatorOffset: 0,
  quickGeneratorOffset: 0,
  savedVerses: [],
  studyNotes: [],
  activeTab: "overview"
};

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function setMessage(element, message, tone = "neutral") {
  if (!element) {
    return;
  }

  element.textContent = message;
  element.className = `status-message is-${tone}`;
}

function formatDate(value) {
  if (!value) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

function redirectToLogin() {
  window.location.replace("/?auth=login");
}

function redirectToEmailVerification() {
  window.location.replace("/verify-email");
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

function normalizeWorkspaceTab(value) {
  const tabId = String(value || "")
    .trim()
    .replace(/^#/, "")
    .toLowerCase();

  return workspaceTabs.includes(tabId) ? tabId : "";
}

function getPreferredStartTab() {
  return normalizeWorkspaceTab(state.user?.settings?.startTab) || "browser";
}

function setActiveTab(tabId, options = {}) {
  const nextTab = normalizeWorkspaceTab(tabId) || getPreferredStartTab();
  const previousTab = state.activeTab;
  state.activeTab = nextTab;

  tabButtons.forEach((button) => {
    const isActive = button.dataset.tabTarget === nextTab;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });

  tabPanels.forEach((panel) => {
    const isActive = panel.dataset.tabPanel === nextTab;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });

  if (options.updateHash !== false) {
    const nextHash = `#${nextTab}`;

    if (window.location.hash !== nextHash) {
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}${nextHash}`);
    }
  }

  if (previousTab !== nextTab) {
    window.scrollTo({ top: 0, left: 0 });
  }
}

function handleTabKeydown(event) {
  const currentIndex = tabButtons.findIndex((button) => button === event.currentTarget);

  if (currentIndex < 0) {
    return;
  }

  let nextIndex = currentIndex;

  if (event.key === "ArrowRight") {
    nextIndex = (currentIndex + 1) % tabButtons.length;
  } else if (event.key === "ArrowLeft") {
    nextIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
  } else if (event.key === "Home") {
    nextIndex = 0;
  } else if (event.key === "End") {
    nextIndex = tabButtons.length - 1;
  } else {
    return;
  }

  event.preventDefault();
  const nextButton = tabButtons[nextIndex];
  nextButton.focus();
  setActiveTab(nextButton.dataset.tabTarget);
}

function getBookMeta(bookId) {
  return state.books.find((entry) => entry.id === bookId) || null;
}

function getBookName(bookId) {
  return getBookMeta(bookId)?.name || bookId;
}

function getEmailStateLabel(user) {
  if (user?.welcomeEmail?.mode === "smtp") {
    return "Delivered";
  }

  if (user?.welcomeEmail?.mode === "preview") {
    return "Preview only";
  }

  if (user?.welcomeEmail?.error) {
    return "Needs resend";
  }

  return "Pending";
}

function getDashboardStatus(user) {
  if (user?.welcomeEmail?.mode === "smtp") {
    return {
      message: `Signed in as ${user.email}. Welcome email already delivered.`,
      tone: "success"
    };
  }

  if (user?.welcomeEmail?.error) {
    return {
      message: "Your earlier welcome email had a delivery problem. You can resend it from here.",
      tone: "error"
    };
  }

  if (user?.welcomeEmail?.mode === "preview") {
    return {
      message: "Your welcome email is saved as a preview. Configure SMTP and resend it when ready.",
      tone: "neutral"
    };
  }

  return {
    message: `Signed in as ${user.email}.`,
    tone: "success"
  };
}

function buildVerseMeta(verse) {
  if (!verse) {
    return "";
  }

  const book = getBookMeta(verse.bookId);
  return [
    verse.translationId || "BSB",
    book?.group || "",
    verse.testament === "old" ? "Old Testament" : verse.testament === "new" ? "New Testament" : ""
  ].filter(Boolean).join(" - ");
}

function getFilteredBooks() {
  const query = state.bookSearch.trim().toLowerCase();

  return state.books.filter((book) => {
    if (!query) {
      return true;
    }

    return (
      book.name.toLowerCase().includes(query) ||
      book.group.toLowerCase().includes(query) ||
      book.testament.toLowerCase().includes(query)
    );
  });
}

function renderStats() {
  statBooks.textContent = String(state.books.length || 66);
  statTopics.textContent = String(state.topics.length);
  statSavedVerses.textContent = String(state.savedVerses.length);
  statStudyNotes.textContent = String(state.studyNotes.length);
  statCurrentBook.textContent = getBookName(state.readingPosition.bookId);
}

function renderContinueReading() {
  continueReadingReference.textContent = `${getBookName(state.readingPosition.bookId)} ${state.readingPosition.chapter}`;
  continueReadingCopy.textContent = `${state.readingPosition.translationId} saved place. Open this chapter to keep reading.`;
}

function renderQuickVerse() {
  const showReason = state.user?.settings?.showVerseReason ?? true;
  quickVerseReason.hidden = !showReason;

  if (!state.quickVerse) {
    quickVerseReference.textContent = "Waiting for a verse";
    quickVerseText.textContent = "A generated verse will appear here.";
    quickVerseMeta.textContent = "";
    quickVerseReason.textContent = "This area gives you a quick starting verse before you browse or generate your own.";
    quickVerseBadge.textContent = "Quick verse";
    return;
  }

  quickVerseReference.textContent = state.quickVerse.reference;
  quickVerseText.textContent = state.quickVerse.text;
  quickVerseMeta.textContent = buildVerseMeta(state.quickVerse);
  quickVerseReason.textContent = state.quickVerse.reason || "A verse is ready.";
  quickVerseBadge.textContent = generatorModeLabels[state.quickVerse.mode] || "Quick verse";
}

function renderGeneratedVerse() {
  const showReason = state.user?.settings?.showVerseReason ?? true;
  generatedVerseReason.hidden = !showReason;

  if (!state.generatedVerse) {
    generatedVerseReference.textContent = "Waiting for a verse";
    generatedVerseText.textContent = "A generated verse will appear here.";
    generatedVerseMeta.textContent = "";
    generatedVerseReason.textContent = "Selah will tell you why this verse was picked so the generator feels useful, not random for no reason.";
    generatedVerseBadge.textContent = "Curated";
    return;
  }

  generatedVerseReference.textContent = state.generatedVerse.reference;
  generatedVerseText.textContent = state.generatedVerse.text;
  generatedVerseMeta.textContent = buildVerseMeta(state.generatedVerse);
  generatedVerseReason.textContent = state.generatedVerse.reason || "A verse is ready.";
  generatedVerseBadge.textContent = generatorModeLabels[state.generatedVerse.mode] || "Curated";
}

function renderContextVerse() {
  if (!state.currentContextVerse) {
    selectedVerseReference.textContent = "Choose a verse";
    selectedVerseText.textContent = "Click a verse in the browser to use it in your note, save it, or generate from that chapter.";
    studyNoteReference.value = "";
    studyNoteVerseText.value = "";
    studyNoteTranslationId.value = "";
    studyNoteBookId.value = "";
    studyNoteChapter.value = "";
    studyNoteVerse.value = "";
    return;
  }

  selectedVerseReference.textContent = state.currentContextVerse.reference;
  selectedVerseText.textContent = state.currentContextVerse.text;
  studyNoteReference.value = state.currentContextVerse.reference;
  studyNoteVerseText.value = state.currentContextVerse.text;
  studyNoteTranslationId.value = state.currentContextVerse.translationId || "BSB";
  studyNoteBookId.value = state.currentContextVerse.bookId || "";
  studyNoteChapter.value = String(state.currentContextVerse.chapter || "");
  studyNoteVerse.value = String(state.currentContextVerse.verse || "");
}

function renderTranslationSelects() {
  const options = state.translations.map((translation) => (
    `<option value="${escapeHtml(translation.id)}">${escapeHtml(translation.shortName)} - ${escapeHtml(translation.englishName)}</option>`
  )).join("");

  browserTranslation.innerHTML = options;
  browserTranslation.value = state.readingPosition.translationId;
}

function renderBookSelects() {
  const options = state.books.map((book) => (
    `<option value="${escapeHtml(book.id)}">${escapeHtml(book.name)}</option>`
  )).join("");

  browserBook.innerHTML = options;
  generatorBook.innerHTML = `<option value="">Current browser book</option>${options}`;
  browserBook.value = state.readingPosition.bookId;
  generatorBook.value = state.readingPosition.bookId;
  updateChapterLimit();
}

function renderBookList() {
  const books = getFilteredBooks();

  browserBookList.classList.toggle("is-compact", Boolean(state.user?.settings?.compactBookCards));
  browserBookCount.textContent = `${books.length} book${books.length === 1 ? "" : "s"}`;
  browserBookList.innerHTML = books.map((book) => `
    <button
      class="book-card${book.id === state.readingPosition.bookId ? " is-active" : ""}"
      type="button"
      data-book-id="${escapeHtml(book.id)}"
    >
      <strong>${escapeHtml(book.name)}</strong>
      <span>${escapeHtml(book.group)} - ${escapeHtml(book.numberOfChapters)} chapters</span>
    </button>
  `).join("");
}

function renderChapter() {
  if (!state.currentChapter) {
    readerHeading.textContent = "Choose a chapter";
    readerMeta.textContent = "Translation and chapter details will appear here.";
    readerSourcePill.textContent = "Waiting";
    chapterHeadingList.innerHTML = "";
    chapterVerseList.innerHTML = "";
    return;
  }

  readerHeading.textContent = `${state.currentChapter.book.name} ${state.currentChapter.chapter.number}`;
  readerMeta.textContent = `${state.currentChapter.translation.englishName} - ${state.currentChapter.book.numberOfChapters} chapters in ${state.currentChapter.book.name}`;
  readerSourcePill.textContent = state.currentChapter.source === "remote" ? "Live chapter" : "Fallback chapter";
  chapterHeadingList.innerHTML = state.currentChapter.chapter.headings.map((heading) => (
    `<span class="theme-chip">${escapeHtml(heading)}</span>`
  )).join("");
  chapterVerseList.innerHTML = state.currentChapter.chapter.verses.map((verse) => {
    const reference = `${state.currentChapter.book.name} ${state.currentChapter.chapter.number}:${verse.verse}`;
    const isActive = state.currentContextVerse?.reference === reference;
    return `
      <button
        class="verse-row${isActive ? " is-active" : ""}"
        type="button"
        data-verse-reference="${escapeHtml(reference)}"
        data-verse-number="${escapeHtml(verse.verse)}"
        data-verse-text="${escapeHtml(verse.text)}"
      >
        <span class="verse-number">${escapeHtml(verse.verse)}</span>
        <span class="verse-text">${escapeHtml(verse.text)}</span>
      </button>
    `;
  }).join("");
}

function renderGeneratorTopics() {
  generatorTopicList.innerHTML = state.topics.map((topic) => `
    <button class="prompt-chip" type="button" data-generator-topic="${escapeHtml(topic.topic)}">
      ${escapeHtml(topic.topic)}
    </button>
  `).join("");
}

function renderSettingsForm() {
  if (!state.user) {
    return;
  }

  const translationOptions = state.translations.length
    ? state.translations.map((translation) => (
      `<option value="${escapeHtml(translation.id)}">${escapeHtml(translation.shortName)} - ${escapeHtml(translation.englishName)}</option>`
    )).join("")
    : `<option value="${escapeHtml(state.user.settings?.preferredTranslationId || state.readingPosition.translationId)}">${escapeHtml(state.user.settings?.preferredTranslationId || state.readingPosition.translationId)}</option>`;

  settingsPreferredTranslation.innerHTML = translationOptions;
  settingsStartTab.value = normalizeWorkspaceTab(state.user.settings?.startTab) || "browser";
  settingsPreferredTranslation.value = state.user.settings?.preferredTranslationId || state.readingPosition.translationId;
  settingsDefaultGeneratorMode.value = generatorModeLabels[state.user.settings?.defaultGeneratorMode]
    ? state.user.settings.defaultGeneratorMode
    : "random";
  settingsAiVoice.value = state.user.settings?.aiVoice || "grounded";
  settingsReminderTime.value = state.user.settings?.reminderTime || "07:30";
  settingsWeeklyDigest.checked = state.user.settings?.weeklyDigest ?? true;
  settingsShowVerseReason.checked = state.user.settings?.showVerseReason ?? true;
  settingsCompactBookCards.checked = state.user.settings?.compactBookCards ?? false;
}

function renderSavedVerses() {
  if (!state.savedVerses.length) {
    savedVersesList.innerHTML = `<article class="library-empty">No saved verses yet.</article>`;
    return;
  }

  savedVersesList.innerHTML = state.savedVerses.map((entry) => `
    <article class="library-card">
      <div class="library-card-top">
        <div>
          <p class="card-label">${escapeHtml(entry.translationId)}</p>
          <h3>${escapeHtml(entry.reference)}</h3>
        </div>
        <div class="library-action-row">
          <button class="button button-secondary library-action" type="button" data-open-saved-verse="${escapeHtml(entry.id)}">
            Open
          </button>
          <button class="button button-ghost library-action" type="button" data-remove-saved-verse="${escapeHtml(entry.id)}">
            Remove
          </button>
        </div>
      </div>
      <p>${escapeHtml(entry.text)}</p>
      <p class="inline-note">Saved ${escapeHtml(formatDate(entry.createdAt))}</p>
    </article>
  `).join("");
}

function renderStudyNotes() {
  if (!state.studyNotes.length) {
    studyNotesList.innerHTML = `<article class="library-empty">No study notes yet.</article>`;
    return;
  }

  studyNotesList.innerHTML = state.studyNotes.map((entry) => `
    <article class="library-card">
      <div class="library-card-top">
        <div>
          <p class="card-label">${escapeHtml(entry.reference || "Study note")}</p>
          <h3>${escapeHtml(entry.title)}</h3>
        </div>
        <div class="library-action-row">
          <button class="button button-secondary library-action" type="button" data-open-study-note="${escapeHtml(entry.id)}">
            Open
          </button>
          <button class="button button-ghost library-action" type="button" data-remove-study-note="${escapeHtml(entry.id)}">
            Remove
          </button>
        </div>
      </div>
      ${entry.verseText ? `<p class="library-verse-text">${escapeHtml(entry.verseText)}</p>` : ""}
      <p>${escapeHtml(entry.body)}</p>
      <p class="inline-note">Saved ${escapeHtml(formatDate(entry.createdAt))}</p>
    </article>
  `).join("");
}

function setGeneratorMode(mode) {
  state.generatorMode = generatorModeLabels[mode] ? mode : "random";
  generatorModeButtons.forEach((button) => {
    const isActive = button.dataset.generatorMode === state.generatorMode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  generatorModeLabel.textContent = generatorModeLabels[state.generatorMode] || "Random verse";
}

function applyUser(user) {
  state.user = user;
  const firstName = user.name.split(/\s+/)[0] || user.name;
  const status = getDashboardStatus(user);

  dashboardGreeting.textContent = `${firstName}, your browser and generator are ready.`;
  dashboardMemberName.textContent = user.name;
  memberEmailValue.textContent = user.email;
  memberSinceValue.textContent = formatDate(user.createdAt);
  accountEmail.textContent = user.email;
  accountJoined.textContent = formatDate(user.createdAt);
  accountEmailState.textContent = getEmailStateLabel(user);

  profileName.value = user.name || "";
  profileFocus.value = user.profile?.focus || "";
  profileSeason.value = user.profile?.currentSeason || "";
  profileBio.value = user.profile?.bio || "";

  state.readingPosition = {
    ...state.readingPosition,
    ...(user.settings?.readingPosition || {})
  };

  setGeneratorMode(user.settings?.defaultGeneratorMode || state.generatorMode);
  renderSettingsForm();
  renderContinueReading();
  renderBookList();
  renderQuickVerse();
  renderGeneratedVerse();
  setMessage(dashboardStatus, status.message, status.tone);
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
    throw error;
  }

  return data;
}

function updateChapterLimit() {
  const book = getBookMeta(browserBook.value || state.readingPosition.bookId);
  browserChapter.max = String(book?.numberOfChapters || 1);
}

function setContextVerse(verse) {
  if (!verse) {
    return;
  }

  state.currentContextVerse = {
    reference: verse.reference,
    translationId: verse.translationId || state.currentChapter?.translation?.id || state.readingPosition.translationId,
    bookId: verse.bookId || state.currentChapter?.book?.id || state.readingPosition.bookId,
    chapter: Number(verse.chapter || state.currentChapter?.chapter?.number || state.readingPosition.chapter),
    verse: Number(verse.verse),
    text: verse.text,
    testament: verse.testament || getBookMeta(verse.bookId)?.testament || null
  };
  renderContextVerse();
  renderChapter();
}

async function loadBootstrap() {
  const data = await requestJson("/api/bible/bootstrap");
  state.books = data.books || [];
  state.translations = data.translations || [];
  state.topics = data.topics || [];
  state.readingPosition = {
    ...state.readingPosition,
    ...(data.readingPosition || {})
  };

  if (state.user?.settings?.preferredTranslationId) {
    state.readingPosition.translationId = state.user.settings.preferredTranslationId;
  }

  state.quickVerse = {
    ...data.verseOfDay,
    translationId: data.verseOfDay?.translationId || "BSB",
    testament: getBookMeta(data.verseOfDay?.bookId)?.testament || null,
    mode: "daily",
    reason: "This is today's featured verse inside Selah."
  };

  renderTranslationSelects();
  renderBookSelects();
  renderBookList();
  renderGeneratorTopics();
  renderSettingsForm();
  setGeneratorMode(state.user?.settings?.defaultGeneratorMode || state.generatorMode);
  renderQuickVerse();
  renderGeneratedVerse();
  renderContinueReading();
  renderStats();
}

async function loadChapter(options = {}) {
  const translationId = options.translationId || browserTranslation.value || state.readingPosition.translationId;
  const bookId = options.bookId || browserBook.value || state.readingPosition.bookId;
  const chapter = Math.max(1, Number(options.chapter || browserChapter.value || state.readingPosition.chapter || 1));
  const highlightVerse = Number(options.highlightVerse || 0);

  browserLoadButton.disabled = true;
  setMessage(browserStatus, "Loading chapter...", "neutral");

  try {
    const query = new URLSearchParams({
      translationId,
      bookId,
      chapter: String(chapter)
    });
    const data = await requestJson(`/api/bible/chapter?${query.toString()}`);
    state.currentChapter = data.chapter;
    state.readingPosition = {
      translationId: data.chapter.translation.id,
      bookId: data.chapter.book.id,
      chapter: data.chapter.chapter.number
    };
    browserTranslation.value = data.chapter.translation.id;
    browserBook.value = data.chapter.book.id;
    generatorBook.value = data.chapter.book.id;
    browserChapter.value = String(data.chapter.chapter.number);
    updateChapterLimit();
    renderContinueReading();
    renderBookList();
    renderChapter();
    renderStats();

    if (highlightVerse > 0) {
      const matchedVerse = data.chapter.chapter.verses.find((entry) => Number(entry.verse) === highlightVerse);

      if (matchedVerse) {
        setContextVerse({
          reference: `${data.chapter.book.name} ${data.chapter.chapter.number}:${matchedVerse.verse}`,
          translationId: data.chapter.translation.id,
          bookId: data.chapter.book.id,
          chapter: data.chapter.chapter.number,
          verse: matchedVerse.verse,
          text: matchedVerse.text,
          testament: getBookMeta(data.chapter.book.id)?.testament || null
        });
      }
    }

    setMessage(browserStatus, `Loaded ${data.chapter.book.name} ${data.chapter.chapter.number}.`, "success");
    return data.chapter;
  } catch (error) {
    setMessage(browserStatus, error.message, "error");
    return null;
  } finally {
    browserLoadButton.disabled = false;
  }
}

async function loadSavedVerses() {
  const data = await requestJson("/api/library/verses");
  state.savedVerses = data.savedVerses || [];
  renderSavedVerses();
  renderStats();
}

async function loadStudyNotes() {
  const data = await requestJson("/api/study-notes");
  state.studyNotes = data.notes || [];
  renderStudyNotes();
  renderStats();
}

async function openPassage(verse) {
  if (!verse?.bookId || !verse?.chapter) {
    return;
  }

  setActiveTab("browser");
  await loadChapter({
    translationId: verse.translationId || state.readingPosition.translationId,
    bookId: verse.bookId,
    chapter: verse.chapter,
    highlightVerse: verse.verse
  });
}

async function runGenerator({
  mode = state.generatorMode,
  topic = generatorTopic.value,
  testament = generatorTestament.value,
  bookId = generatorBook.value || state.readingPosition.bookId,
  chapter = state.currentChapter?.chapter?.number || state.readingPosition.chapter,
  offset = state.generatorOffset
} = {}) {
  setMessage(generatorStatus, "Generating verse...", "neutral");

  try {
    const data = await requestJson("/api/bible/generate", {
      method: "POST",
      body: JSON.stringify({
        mode,
        topic,
        testament,
        bookId,
        chapter,
        offset
      })
    });

    state.generatedVerse = data.result;
    renderGeneratedVerse();
    setMessage(generatorStatus, data.message, "success");
  } catch (error) {
    setMessage(generatorStatus, error.message, "error");
  }
}

async function runQuickGenerator() {
  try {
    const data = await requestJson("/api/bible/generate", {
      method: "POST",
      body: JSON.stringify({
        mode: "random",
        bookId: state.readingPosition.bookId,
        chapter: state.readingPosition.chapter,
        offset: state.quickGeneratorOffset
      })
    });

    state.quickVerse = data.result;
    state.quickGeneratorOffset += 1;
    renderQuickVerse();
    setMessage(dashboardStatus, data.message, "success");
  } catch (error) {
    setMessage(dashboardStatus, error.message, "error");
  }
}

async function saveVerse(verse) {
  if (!verse) {
    setMessage(dashboardStatus, "Choose a verse first.", "error");
    return;
  }

  const data = await requestJson("/api/library/verses", {
    method: "POST",
    body: JSON.stringify({
      reference: verse.reference,
      translationId: verse.translationId || "BSB",
      bookId: verse.bookId,
      chapter: verse.chapter,
      verse: verse.verse,
      text: verse.text
    })
  });

  if (!state.savedVerses.find((entry) => entry.id === data.savedVerse.id)) {
    state.savedVerses = [data.savedVerse, ...state.savedVerses];
    renderSavedVerses();
    renderStats();
  }

  setMessage(dashboardStatus, data.message, "success");
}

async function handleDashboardLogout() {
  try {
    await requestJson("/api/logout", {
      method: "POST",
      body: JSON.stringify({})
    });
  } finally {
    redirectToLogin();
  }
}

async function handleResendEmail() {
  dashboardResendEmail.disabled = true;
  setMessage(dashboardStatus, "Sending the welcome email again...", "neutral");

  try {
    const data = await requestJson("/api/welcome-email/resend", {
      method: "POST",
      body: JSON.stringify({})
    });
    applyUser(data.user);
    setMessage(dashboardStatus, data.emailStatus?.message || data.message, data.emailStatus?.mode === "smtp" ? "success" : "neutral");
  } catch (error) {
    setMessage(dashboardStatus, error.message, "error");
  } finally {
    dashboardResendEmail.disabled = false;
  }
}

async function handleSaveReadingPosition() {
  browserSavePositionButton.disabled = true;

  try {
    const data = await requestJson("/api/bible/reading-position", {
      method: "POST",
      body: JSON.stringify({
        translationId: browserTranslation.value,
        bookId: browserBook.value,
        chapter: Number(browserChapter.value || 1)
      })
    });

    applyUser(data.user);
    setMessage(browserStatus, data.message, "success");
  } catch (error) {
    setMessage(browserStatus, error.message, "error");
  } finally {
    browserSavePositionButton.disabled = false;
  }
}

function handleBookListClick(event) {
  const button = event.target.closest("[data-book-id]");

  if (!button) {
    return;
  }

  browserBook.value = button.dataset.bookId;
  generatorBook.value = button.dataset.bookId;
  browserChapter.value = "1";
  updateChapterLimit();
  void loadChapter({
    translationId: browserTranslation.value,
    bookId: button.dataset.bookId,
    chapter: 1
  });
}

function handleVerseListClick(event) {
  const button = event.target.closest("[data-verse-reference]");

  if (!button || !state.currentChapter) {
    return;
  }

  setContextVerse({
    reference: button.dataset.verseReference,
    translationId: state.currentChapter.translation.id,
    bookId: state.currentChapter.book.id,
    chapter: state.currentChapter.chapter.number,
    verse: Number(button.dataset.verseNumber),
    text: button.dataset.verseText,
    testament: getBookMeta(state.currentChapter.book.id)?.testament || null
  });
}

function focusNoteForm() {
  setActiveTab("browser");
  studyNoteTitle.focus();
}

async function handleStudyNoteSubmit(event) {
  event.preventDefault();
  const submitButton = studyNoteForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  setMessage(studyNoteStatus, "Saving note...", "neutral");

  try {
    const payload = Object.fromEntries(new FormData(studyNoteForm).entries());
    const data = await requestJson("/api/study-notes", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    state.studyNotes = [data.note, ...state.studyNotes];
    renderStudyNotes();
    renderStats();
    studyNoteTitle.value = "";
    studyNoteBody.value = "";
    setMessage(studyNoteStatus, data.message, "success");
  } catch (error) {
    setMessage(studyNoteStatus, error.message, "error");
  } finally {
    submitButton.disabled = false;
  }
}

async function handleProfileSubmit(event) {
  event.preventDefault();
  const submitButton = profileForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  setMessage(profileFormStatus, "Updating profile...", "neutral");

  try {
    const payload = Object.fromEntries(new FormData(profileForm).entries());
    const data = await requestJson("/api/account/profile", {
      method: "PATCH",
      body: JSON.stringify(payload)
    });

    applyUser(data.user);
    setMessage(profileFormStatus, data.message, "success");
  } catch (error) {
    setMessage(profileFormStatus, error.message, "error");
  } finally {
    submitButton.disabled = false;
  }
}

async function handleSettingsSubmit(event) {
  event.preventDefault();
  const submitButton = settingsForm.querySelector('button[type="submit"]');
  const preferredTranslationId = settingsPreferredTranslation.value || state.readingPosition.translationId;

  submitButton.disabled = true;
  setMessage(settingsFormStatus, "Saving settings...", "neutral");

  try {
    const data = await requestJson("/api/account/settings", {
      method: "PATCH",
      body: JSON.stringify({
        startTab: settingsStartTab.value,
        preferredTranslationId,
        defaultGeneratorMode: settingsDefaultGeneratorMode.value,
        aiVoice: settingsAiVoice.value,
        reminderTime: settingsReminderTime.value,
        weeklyDigest: settingsWeeklyDigest.checked,
        showVerseReason: settingsShowVerseReason.checked,
        compactBookCards: settingsCompactBookCards.checked
      })
    });

    applyUser(data.user);

    if (state.currentChapter && state.currentChapter.translation.id !== preferredTranslationId) {
      await loadChapter({
        translationId: preferredTranslationId,
        bookId: state.readingPosition.bookId,
        chapter: state.readingPosition.chapter,
        highlightVerse: state.currentContextVerse?.verse
      });
    }

    setMessage(settingsFormStatus, data.message, "success");
  } catch (error) {
    setMessage(settingsFormStatus, error.message, "error");
  } finally {
    submitButton.disabled = false;
  }
}

async function handlePasswordSubmit(event) {
  event.preventDefault();
  const submitButton = passwordForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  setMessage(passwordFormStatus, "Updating password...", "neutral");

  try {
    const payload = Object.fromEntries(new FormData(passwordForm).entries());
    const data = await requestJson("/api/account/password", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    passwordForm.reset();
    setMessage(passwordFormStatus, data.message, "success");
  } catch (error) {
    setMessage(passwordFormStatus, error.message, "error");
  } finally {
    submitButton.disabled = false;
  }
}

async function handleSavedVersesClick(event) {
  const openButton = event.target.closest("[data-open-saved-verse]");

  if (openButton) {
    const verse = state.savedVerses.find((entry) => entry.id === openButton.dataset.openSavedVerse);

    if (verse) {
      await openPassage(verse);
    }
    return;
  }

  const removeButton = event.target.closest("[data-remove-saved-verse]");

  if (!removeButton) {
    return;
  }

  try {
    await requestJson(`/api/library/verses/${removeButton.dataset.removeSavedVerse}`, {
      method: "DELETE"
    });
    state.savedVerses = state.savedVerses.filter((entry) => entry.id !== removeButton.dataset.removeSavedVerse);
    renderSavedVerses();
    renderStats();
  } catch (error) {
    setMessage(dashboardStatus, error.message, "error");
  }
}

async function handleStudyNotesClick(event) {
  const openButton = event.target.closest("[data-open-study-note]");

  if (openButton) {
    const note = state.studyNotes.find((entry) => entry.id === openButton.dataset.openStudyNote);

    if (note?.bookId && note?.chapter) {
      setContextVerse({
        reference: note.reference,
        translationId: note.translationId || "BSB",
        bookId: note.bookId,
        chapter: note.chapter,
        verse: note.verse,
        text: note.verseText || note.body,
        testament: getBookMeta(note.bookId)?.testament || null
      });
      await openPassage({
        translationId: note.translationId || "BSB",
        bookId: note.bookId,
        chapter: note.chapter,
        verse: note.verse
      });
    }
    return;
  }

  const removeButton = event.target.closest("[data-remove-study-note]");

  if (!removeButton) {
    return;
  }

  try {
    await requestJson(`/api/study-notes/${removeButton.dataset.removeStudyNote}`, {
      method: "DELETE"
    });
    state.studyNotes = state.studyNotes.filter((entry) => entry.id !== removeButton.dataset.removeStudyNote);
    renderStudyNotes();
    renderStats();
  } catch (error) {
    setMessage(dashboardStatus, error.message, "error");
  }
}

async function loadWorkspace() {
  try {
    const sessionData = await requestJson("/api/session");

    if (!sessionData.authenticated || !sessionData.user) {
      redirectToLogin();
      return;
    }

     if (sessionData.needsEmailVerification) {
      redirectToEmailVerification();
      return;
    }

    applyUser(sessionData.user);

    const results = await Promise.allSettled([
      loadBootstrap(),
      loadSavedVerses(),
      loadStudyNotes()
    ]);

    if (results[0].status === "fulfilled") {
      await loadChapter(state.readingPosition);
    }

    setActiveTab(normalizeWorkspaceTab(window.location.hash) || getPreferredStartTab());

    const firstFailure = results.find((result) => result.status === "rejected");

    if (firstFailure) {
      setMessage(dashboardStatus, firstFailure.reason?.message || "Part of the browser failed to load.", "error");
    }
  } catch (error) {
    if (error?.status === 401) {
      redirectToLogin();
      return;
    }

    if (error?.status === 403 && error?.message?.toLowerCase().includes("verify your email")) {
      redirectToEmailVerification();
      return;
    }

    setMessage(dashboardStatus, error.message || "The browser failed to load.", "error");
  }
}

dashboardLogout.addEventListener("click", handleDashboardLogout);
dashboardResendEmail.addEventListener("click", handleResendEmail);
tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveTab(button.dataset.tabTarget);
  });
  button.addEventListener("keydown", handleTabKeydown);
});
tabShortcutButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveTab(button.dataset.openTab);
  });
});
window.addEventListener("hashchange", () => {
  const requestedTab = normalizeWorkspaceTab(window.location.hash);

  if (requestedTab) {
    setActiveTab(requestedTab, { updateHash: false });
  }
});

quickVerseSaveButton.addEventListener("click", () => {
  void saveVerse(state.quickVerse);
});
quickVerseOpenButton.addEventListener("click", () => {
  void openPassage(state.quickVerse);
});
quickVerseNoteButton.addEventListener("click", () => {
  setContextVerse(state.quickVerse);
  focusNoteForm();
});
quickGenerateAnotherButton.addEventListener("click", () => {
  void runQuickGenerator();
});

continueReadingButton.addEventListener("click", () => {
  setActiveTab("browser");
  void loadChapter(state.readingPosition);
});

browserTranslation.addEventListener("change", () => {
  state.readingPosition.translationId = browserTranslation.value;
});
browserBook.addEventListener("change", () => {
  state.readingPosition.bookId = browserBook.value;
  generatorBook.value = browserBook.value;
  updateChapterLimit();
  renderBookList();
  renderStats();
});
browserChapter.addEventListener("change", () => {
  state.readingPosition.chapter = Math.max(1, Number(browserChapter.value || 1));
});
browserSearch.addEventListener("input", () => {
  state.bookSearch = browserSearch.value || "";
  renderBookList();
});
browserLoadButton.addEventListener("click", () => {
  void loadChapter({
    translationId: browserTranslation.value,
    bookId: browserBook.value,
    chapter: Number(browserChapter.value || 1)
  });
});
browserSavePositionButton.addEventListener("click", handleSaveReadingPosition);
browserBookList.addEventListener("click", handleBookListClick);
chapterVerseList.addEventListener("click", handleVerseListClick);

saveSelectedVerseButton.addEventListener("click", () => {
  void saveVerse(state.currentContextVerse);
});
generateFromSelectionButton.addEventListener("click", () => {
  if (!state.currentContextVerse) {
    setMessage(dashboardStatus, "Choose a verse first.", "error");
    return;
  }

  setGeneratorMode("chapter");
  state.generatorOffset = 0;
  void runGenerator({
    mode: "chapter",
    bookId: state.currentContextVerse.bookId,
    chapter: state.currentContextVerse.chapter,
    offset: 0
  });
  setActiveTab("generator");
});
selectedVerseToNoteButton.addEventListener("click", focusNoteForm);
studyNoteForm.addEventListener("submit", handleStudyNoteSubmit);

generatorModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setGeneratorMode(button.dataset.generatorMode || "random");
  });
});

generatorTopicList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-generator-topic]");

  if (!button) {
    return;
  }

  generatorTopic.value = button.dataset.generatorTopic || "";
  setGeneratorMode("topic");
});

generatorForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state.generatorOffset = 0;
  void runGenerator({
    mode: state.generatorMode,
    offset: state.generatorOffset
  });
});

generatedVerseSaveButton.addEventListener("click", () => {
  void saveVerse(state.generatedVerse);
});
generatedVerseOpenButton.addEventListener("click", () => {
  void openPassage(state.generatedVerse);
});
generatedVerseNoteButton.addEventListener("click", () => {
  setContextVerse(state.generatedVerse);
  focusNoteForm();
});
generatedVerseRefreshButton.addEventListener("click", () => {
  state.generatorOffset += 1;
  void runGenerator({
    mode: state.generatedVerse?.mode || state.generatorMode,
    topic: generatorTopic.value,
    testament: generatorTestament.value,
    bookId: generatorBook.value || state.readingPosition.bookId,
    chapter: state.currentChapter?.chapter?.number || state.readingPosition.chapter,
    offset: state.generatorOffset
  });
});

savedVersesList.addEventListener("click", (event) => {
  void handleSavedVersesClick(event);
});
studyNotesList.addEventListener("click", (event) => {
  void handleStudyNotesClick(event);
});

profileForm.addEventListener("submit", handleProfileSubmit);
settingsForm.addEventListener("submit", handleSettingsSubmit);
passwordForm.addEventListener("submit", handlePasswordSubmit);

setGeneratorMode(state.generatorMode);
renderQuickVerse();
renderGeneratedVerse();
renderContextVerse();
initializeBrandLogo();
loadWorkspace();
