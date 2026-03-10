const dashboardGreeting = document.querySelector("#dashboard-greeting");
const dashboardMemberName = document.querySelector("#dashboard-member-name");
const dashboardStatus = document.querySelector("#dashboard-status");
const dashboardLogout = document.querySelector("#dashboard-logout");
const dashboardResendEmail = document.querySelector("#dashboard-resend-email");

const statSavedVerses = document.querySelector("#stat-saved-verses");
const statStudyNotes = document.querySelector("#stat-study-notes");
const statPrayers = document.querySelector("#stat-prayers");
const statAiGuides = document.querySelector("#stat-ai-guides");
const statActivePrayers = document.querySelector("#stat-active-prayers");

const verseOfDayReference = document.querySelector("#verse-of-day-reference");
const verseOfDayText = document.querySelector("#verse-of-day-text");
const verseOfDayTranslation = document.querySelector("#verse-of-day-translation");
const continueReadingReference = document.querySelector("#continue-reading-reference");
const continueReadingCopy = document.querySelector("#continue-reading-copy");
const continueReadingButton = document.querySelector("#continue-reading-button");

const memberEmailValue = document.querySelector("#member-email-value");
const memberFocusValue = document.querySelector("#member-focus-value");
const memberSinceValue = document.querySelector("#member-since-value");
const memberReminderValue = document.querySelector("#member-reminder-value");
const memberVoiceValue = document.querySelector("#member-voice-value");

const readerTranslation = document.querySelector("#reader-translation");
const readerChapter = document.querySelector("#reader-chapter");
const bookSearch = document.querySelector("#book-search");
const bookGroupFilter = document.querySelector("#book-group-filter");
const readerLoadButton = document.querySelector("#reader-load-button");
const saveReadingPositionButton = document.querySelector("#save-reading-position");
const testamentFilterButtons = document.querySelectorAll("[data-testament-filter]");
const bookCountCopy = document.querySelector("#book-count-copy");
const bookGrid = document.querySelector("#book-grid");
const bookSpotlightName = document.querySelector("#book-spotlight-name");
const bookSpotlightMeta = document.querySelector("#book-spotlight-meta");
const bookSpotlightSummary = document.querySelector("#book-spotlight-summary");
const bookSpotlightReference = document.querySelector("#book-spotlight-reference");
const bookChapterJump = document.querySelector("#book-chapter-jump");
const bookSpotlightOpen = document.querySelector("#book-spotlight-open");
const readerHeading = document.querySelector("#reader-heading");
const readerMeta = document.querySelector("#reader-meta");
const readerSourcePill = document.querySelector("#reader-source-pill");
const readerStatus = document.querySelector("#reader-status");
const chapterHeadingList = document.querySelector("#chapter-heading-list");
const chapterVerseList = document.querySelector("#chapter-verse-list");
const selectedVerseReference = document.querySelector("#selected-verse-reference");
const selectedVerseText = document.querySelector("#selected-verse-text");
const saveSelectedVerseButton = document.querySelector("#save-selected-verse");
const sendSelectedToAiButton = document.querySelector("#send-selected-to-ai");

const topicCollectionList = document.querySelector("#topic-collection-list");
const studyNoteForm = document.querySelector("#study-note-form");
const studyNoteReference = document.querySelector("#study-note-reference");
const studyNoteVerseText = document.querySelector("#study-note-verse-text");
const studyNoteTranslationId = document.querySelector("#study-note-translation-id");
const studyNoteBookId = document.querySelector("#study-note-book-id");
const studyNoteChapter = document.querySelector("#study-note-chapter");
const studyNoteVerse = document.querySelector("#study-note-verse");
const studyNoteStatus = document.querySelector("#study-note-status");

const aiStudioForm = document.querySelector("#ai-studio-form");
const aiPrompt = document.querySelector("#ai-prompt");
const studioModeButtons = document.querySelectorAll("[data-ai-mode]");
const aiSeedButtons = document.querySelectorAll("[data-ai-seed]");
const studioTitle = document.querySelector("#studio-title");
const studioSummary = document.querySelector("#studio-summary");
const studioResponseCopy = document.querySelector("#studio-response-copy");
const studioPrayerCopy = document.querySelector("#studio-prayer-copy");
const studioScriptureCopy = document.querySelector("#studio-scripture-copy");
const studioActionList = document.querySelector("#studio-action-list");
const studioFollowUpList = document.querySelector("#studio-follow-up-list");
const studioLog = document.querySelector("#studio-log");
const studioModeLabel = document.querySelector("#studio-mode-label");
const studioSourcePill = document.querySelector("#studio-source-pill");

const prayerForm = document.querySelector("#prayer-form");
const prayerFormStatus = document.querySelector("#prayer-form-status");
const prayerSearch = document.querySelector("#prayer-search");
const prayerCategoryFilter = document.querySelector("#prayer-category-filter");
const filterResultCopy = document.querySelector("#filter-result-copy");
const activePrayerList = document.querySelector("#active-prayer-list");
const answeredPrayerList = document.querySelector("#answered-prayer-list");
const activePrayerCount = document.querySelector("#active-prayer-count");
const answeredPrayerCount = document.querySelector("#answered-prayer-count");

const savedVersesList = document.querySelector("#saved-verses-list");
const studyNotesList = document.querySelector("#study-notes-list");
const readingPlanList = document.querySelector("#reading-plan-list");
const planStatus = document.querySelector("#plan-status");

const accountEmail = document.querySelector("#account-email");
const accountJoined = document.querySelector("#account-joined");
const accountEmailState = document.querySelector("#account-email-state");

const profileForm = document.querySelector("#profile-form");
const profileName = document.querySelector("#profile-name");
const profileFocus = document.querySelector("#profile-focus");
const profileSeason = document.querySelector("#profile-season");
const profileBio = document.querySelector("#profile-bio");
const profileFormStatus = document.querySelector("#profile-form-status");

const settingsForm = document.querySelector("#settings-form");
const settingsDefaultMode = document.querySelector("#settings-default-mode");
const settingsAiVoice = document.querySelector("#settings-ai-voice");
const settingsReminderTime = document.querySelector("#settings-reminder-time");
const settingsWeeklyDigest = document.querySelector("#settings-weekly-digest");
const settingsExperimentalLayout = document.querySelector("#settings-experimental-layout");
const settingsFormStatus = document.querySelector("#settings-form-status");

const passwordForm = document.querySelector("#password-form");
const passwordFormStatus = document.querySelector("#password-form-status");

const state = {
  user: null,
  books: [],
  translations: [],
  topics: [],
  plans: [],
  readingPosition: {
    translationId: "BSB",
    bookId: "JHN",
    chapter: 1
  },
  currentChapter: null,
  currentBookFilter: "all",
  currentBookGroup: "all",
  currentBookSearch: "",
  activeBookId: "JHN",
  selectedVerse: null,
  savedVerses: [],
  studyNotes: [],
  prayers: [],
  aiSessions: [],
  prayerFilters: {
    search: "",
    category: "all"
  },
  studioMode: "companion"
};

const categoryLabels = {
  general: "General",
  family: "Family",
  gratitude: "Gratitude",
  guidance: "Guidance",
  health: "Health",
  church: "Church",
  work: "Work"
};

const aiVoiceLabels = {
  grounded: "Grounded",
  gentle: "Gentle",
  courageous: "Courageous",
  poetic: "Poetic"
};

const groupSummaries = {
  Law: "Foundations, covenant, and the early story of God's people.",
  History: "Narrative books that show faithfulness, failure, kings, exile, and return.",
  Wisdom: "Poetry and reflection for worship, suffering, love, and daily wisdom.",
  Prophets: "Calls to repentance, justice, hope, and the promise of restoration.",
  Gospels: "The life, teaching, death, and resurrection of Jesus.",
  Letters: "Pastoral and theological guidance for the early church and believers.",
  Apocalyptic: "Vision, endurance, and hope in the final victory of God."
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

function formatDate(value, options = {}) {
  if (!value) {
    return "None yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options
  }).format(new Date(value));
}

function formatTime(value) {
  if (!value) {
    return "7:30 AM";
  }

  const [hoursText, minutesText] = String(value).split(":");
  const hours = Number(hoursText);
  const minutes = Number(minutesText);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(2026, 0, 1, hours, minutes));
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
      message: "Your earlier welcome email had a delivery problem. You can resend it from this library.",
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

function redirectToLogin() {
  window.location.replace("/?auth=login");
}

function getBookName(bookId) {
  return state.books.find((entry) => entry.id === bookId)?.name || bookId;
}

function getBookMeta(bookId) {
  return state.books.find((entry) => entry.id === bookId) || null;
}

function getBookCollectionOptions() {
  return [...new Set(state.books.map((book) => book.group))].sort((left, right) => left.localeCompare(right));
}

function getBookSpotlightSummary(book) {
  if (!book) {
    return "Select a book to see its shape, its place in Scripture, and quick chapter jumps.";
  }

  const testamentLabel = book.testament === "old" ? "Old Testament" : "New Testament";
  const groupSummary = groupSummaries[book.group] || "A part of the biblical story worth reading slowly and in context.";
  return `${book.name} sits in the ${testamentLabel} ${book.group.toLowerCase()} collection. ${groupSummary}`;
}

function getBookChapterJumpOptions(book) {
  if (!book) {
    return [];
  }

  if (book.numberOfChapters <= 6) {
    return Array.from({ length: book.numberOfChapters }, (_, index) => index + 1);
  }

  const values = new Set([
    1,
    2,
    3,
    Math.max(1, Math.ceil(book.numberOfChapters / 2)),
    Math.max(1, book.numberOfChapters - 1),
    book.numberOfChapters
  ]);

  return [...values].sort((left, right) => left - right);
}

function getPlanCurrentStep(plan) {
  const matchedIndex = plan.steps.findIndex((step) => (
    step.bookId === state.readingPosition.bookId &&
    step.chapter === state.readingPosition.chapter
  ));

  if (matchedIndex >= 0) {
    return {
      step: plan.steps[matchedIndex],
      label: `Continue with day ${plan.steps[matchedIndex].day}`
    };
  }

  return {
    step: plan.steps[0],
    label: "Start this plan"
  };
}

function getSelectedVersePayload() {
  if (!state.selectedVerse) {
    return null;
  }

  return {
    reference: state.selectedVerse.reference,
    translationId: state.currentChapter?.translation?.id || state.readingPosition.translationId,
    bookId: state.currentChapter?.book?.id || state.readingPosition.bookId,
    chapter: state.currentChapter?.chapter?.number || state.readingPosition.chapter,
    verse: state.selectedVerse.verse,
    text: state.selectedVerse.text
  };
}

function applyUser(user) {
  state.user = user;
  const firstName = user.name.split(/\s+/)[0] || user.name;
  const status = getDashboardStatus(user);

  dashboardGreeting.textContent = `${firstName}, welcome to your Bible library.`;
  dashboardMemberName.textContent = user.name;
  memberEmailValue.textContent = user.email;
  memberFocusValue.textContent = user.profile?.focus || "Presence over performance";
  memberSinceValue.textContent = formatDate(user.createdAt);
  memberReminderValue.textContent = formatTime(user.settings?.reminderTime || "07:30");
  memberVoiceValue.textContent = aiVoiceLabels[user.settings?.aiVoice] || "Grounded";
  accountEmail.textContent = user.email;
  accountJoined.textContent = formatDate(user.createdAt);
  accountEmailState.textContent = getEmailStateLabel(user);

  profileName.value = user.name || "";
  profileFocus.value = user.profile?.focus || "";
  profileSeason.value = user.profile?.currentSeason || "";
  profileBio.value = user.profile?.bio || "";
  settingsDefaultMode.value = user.settings?.defaultAiMode || "companion";
  settingsAiVoice.value = user.settings?.aiVoice || "grounded";
  settingsReminderTime.value = user.settings?.reminderTime || "07:30";
  settingsWeeklyDigest.checked = Boolean(user.settings?.weeklyDigest);
  settingsExperimentalLayout.checked = Boolean(user.settings?.experimentalLayout);

  state.readingPosition = {
    ...state.readingPosition,
    ...(user.settings?.readingPosition || {})
  };
  state.activeBookId = state.readingPosition.bookId;

  setStudioMode(user.settings?.defaultAiMode || state.studioMode);
  setMessage(dashboardStatus, status.message, status.tone);
  renderContinueReading();
}

function renderVerseOfDay(verse) {
  verseOfDayReference.textContent = verse.reference;
  verseOfDayText.textContent = verse.text;
  verseOfDayTranslation.textContent = `${verse.reference} - Daily selection`;
}

function renderContinueReading() {
  const book = getBookMeta(state.readingPosition.bookId);
  const translation = state.translations.find((entry) => entry.id === state.readingPosition.translationId);
  const reference = `${book?.name || state.readingPosition.bookId} ${state.readingPosition.chapter}`;

  continueReadingReference.textContent = reference;
  continueReadingCopy.textContent = translation
    ? `${translation.shortName} saved place. Open this chapter and keep moving.`
    : "Open your saved place and keep moving.";
}

function renderBookFilters() {
  bookGroupFilter.innerHTML = [
    '<option value="all">All collections</option>',
    ...getBookCollectionOptions().map((group) => (
      `<option value="${escapeHtml(group)}">${escapeHtml(group)}</option>`
    ))
  ].join("");
  bookGroupFilter.value = state.currentBookGroup;
}

function renderStats() {
  const prayerCount = state.prayers.length;
  const activePrayerTotal = state.prayers.filter((entry) => !entry.answeredAt).length;

  statSavedVerses.textContent = String(state.savedVerses.length);
  statStudyNotes.textContent = String(state.studyNotes.length);
  statPrayers.textContent = String(prayerCount);
  statAiGuides.textContent = String(state.aiSessions.length);
  statActivePrayers.textContent = String(activePrayerTotal);
}

function renderTranslationSelect() {
  readerTranslation.innerHTML = state.translations.map((translation) => (
    `<option value="${escapeHtml(translation.id)}">${escapeHtml(translation.shortName)} - ${escapeHtml(translation.englishName)}</option>`
  )).join("");
  readerTranslation.value = state.readingPosition.translationId;
}

function renderBookGrid() {
  const filteredBooks = state.books.filter((book) => (
    (state.currentBookFilter === "all" || book.testament === state.currentBookFilter) &&
    (state.currentBookGroup === "all" || book.group === state.currentBookGroup) &&
    (
      !state.currentBookSearch ||
      book.name.toLowerCase().includes(state.currentBookSearch) ||
      book.group.toLowerCase().includes(state.currentBookSearch)
    )
  ));

  if (!filteredBooks.length) {
    bookCountCopy.textContent = "No books match this filter yet.";
    bookGrid.innerHTML = `<article class="library-empty">Try a different search or collection filter.</article>`;
    renderBookSpotlight();
    return;
  }

  bookCountCopy.textContent = `Showing ${filteredBooks.length} book${filteredBooks.length === 1 ? "" : "s"} in this view.`;
  bookGrid.innerHTML = filteredBooks.map((book) => {
    const isActive = book.id === state.activeBookId;
    return `
      <button
        class="book-card${isActive ? " is-active" : ""}"
        type="button"
        data-book-id="${escapeHtml(book.id)}"
      >
        <strong>${escapeHtml(book.name)}</strong>
        <span>${escapeHtml(book.group)} - ${escapeHtml(book.numberOfChapters)} chapters</span>
      </button>
    `;
  }).join("");
  renderBookSpotlight();
}

function renderBookSpotlight() {
  const book = getBookMeta(state.activeBookId || state.readingPosition.bookId);

  if (!book) {
    bookSpotlightName.textContent = "Choose a book";
    bookSpotlightMeta.textContent = "Scripture collection";
    bookSpotlightSummary.textContent = "Select a book to see its shape, its place in Scripture, and quick chapter jumps.";
    bookSpotlightReference.textContent = "Current place: none selected";
    bookChapterJump.innerHTML = "";
    return;
  }

  const testamentLabel = book.testament === "old" ? "Old Testament" : "New Testament";
  const spotlightChapter = book.id === state.readingPosition.bookId ? state.readingPosition.chapter : 1;

  bookSpotlightName.textContent = book.name;
  bookSpotlightMeta.textContent = `${testamentLabel} - ${book.group} - ${book.numberOfChapters} chapters`;
  bookSpotlightSummary.textContent = getBookSpotlightSummary(book);
  bookSpotlightReference.textContent = `Current place: ${book.name} ${spotlightChapter}`;
  bookChapterJump.innerHTML = getBookChapterJumpOptions(book).map((chapterNumber) => `
    <button
      class="theme-chip${chapterNumber === spotlightChapter ? " is-selected" : ""}"
      type="button"
      data-spotlight-chapter="${escapeHtml(chapterNumber)}"
    >
      Chapter ${escapeHtml(chapterNumber)}
    </button>
  `).join("");
}

function renderReadingPlans() {
  if (!state.plans.length) {
    readingPlanList.innerHTML = `<article class="library-empty">Reading plans will appear here.</article>`;
    return;
  }

  readingPlanList.innerHTML = state.plans.map((plan) => {
    const current = getPlanCurrentStep(plan);
    return `
      <article class="plan-card">
        <p class="card-label">${escapeHtml(plan.duration)} - ${escapeHtml(plan.emphasis)}</p>
        <h3>${escapeHtml(plan.title)}</h3>
        <p class="dashboard-card-copy">${escapeHtml(plan.summary)}</p>
        <div class="plan-step-stack">
          ${plan.steps.slice(0, 3).map((step) => `
            <div class="plan-step-row">
              <strong>Day ${escapeHtml(step.day)}</strong>
              <span>${escapeHtml(step.reference)} - ${escapeHtml(step.focus)}</span>
            </div>
          `).join("")}
        </div>
        <p class="inline-note">${escapeHtml(current.label)}: ${escapeHtml(current.step.reference)}</p>
        <button class="button button-primary" type="button" data-plan-open="${escapeHtml(plan.id)}">
          ${escapeHtml(current.label)}
        </button>
      </article>
    `;
  }).join("");
}

function renderChapter(chapterData) {
  state.currentChapter = chapterData;
  state.readingPosition = {
    translationId: chapterData.translation.id,
    bookId: chapterData.book.id,
    chapter: chapterData.chapter.number
  };
  state.activeBookId = chapterData.book.id;
  if (state.selectedVerse && !state.selectedVerse.reference.startsWith(`${chapterData.book.name} ${chapterData.chapter.number}:`)) {
    state.selectedVerse = null;
  }

  readerHeading.textContent = `${chapterData.book.name} ${chapterData.chapter.number}`;
  readerMeta.textContent = `${chapterData.translation.englishName} - ${chapterData.book.numberOfChapters} chapters in ${chapterData.book.name}`;
  readerSourcePill.textContent = chapterData.source === "remote" ? "Live chapter" : "Fallback chapter";
  readerChapter.value = String(chapterData.chapter.number);
  readerChapter.max = String(chapterData.book.numberOfChapters || 1);
  readerTranslation.value = chapterData.translation.id;
  chapterHeadingList.innerHTML = chapterData.chapter.headings.map((heading) => (
    `<span class="theme-chip">${escapeHtml(heading)}</span>`
  )).join("");
  chapterVerseList.innerHTML = chapterData.chapter.verses.map((verse) => {
    const reference = `${chapterData.book.name} ${chapterData.chapter.number}:${verse.verse}`;
    const isActive = state.selectedVerse?.reference === reference;
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
  renderBookGrid();
  renderContinueReading();
  setMessage(readerStatus, `Loaded ${chapterData.book.name} ${chapterData.chapter.number}.`, "success");
}

function renderTopicCollections() {
  topicCollectionList.innerHTML = state.topics.map((topic) => `
    <article class="topic-card">
      <p class="card-label">${escapeHtml(topic.topic)}</p>
      <h3>${escapeHtml(topic.summary)}</h3>
      <div class="topic-verse-stack">
        ${topic.verses.map((verse) => `
          <button
            class="topic-verse-button"
            type="button"
            data-topic-reference="${escapeHtml(verse.reference)}"
            data-topic-text="${escapeHtml(verse.text)}"
            data-topic-book-id="${escapeHtml(verse.bookId)}"
            data-topic-chapter="${escapeHtml(verse.chapter)}"
            data-topic-verse="${escapeHtml(verse.verse)}"
          >
            <strong>${escapeHtml(verse.reference)}</strong>
            <span>${escapeHtml(verse.text)}</span>
          </button>
        `).join("")}
      </div>
    </article>
  `).join("");
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
          <button
            class="button button-secondary library-action"
            type="button"
            data-open-saved-verse="${escapeHtml(entry.id)}"
          >
            Open
          </button>
          <button
            class="button button-ghost library-action"
            type="button"
            data-remove-saved-verse="${escapeHtml(entry.id)}"
          >
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
        ${entry.bookId && entry.chapter ? `
          <button
            class="button button-secondary library-action"
            type="button"
            data-open-study-note="${escapeHtml(entry.id)}"
          >
            Open
          </button>
        ` : ""}
      </div>
      ${entry.verseText ? `<p class="library-verse-text">${escapeHtml(entry.verseText)}</p>` : ""}
      <p>${escapeHtml(entry.body)}</p>
      <p class="inline-note">Saved ${escapeHtml(formatDate(entry.createdAt))}</p>
    </article>
  `).join("");
}

function renderSelectedVerse() {
  if (!state.selectedVerse) {
    selectedVerseReference.textContent = "Choose a verse";
    selectedVerseText.textContent = "Click a verse in the reader to save it, study it, or send it into the AI guide.";
    studyNoteReference.value = "";
    studyNoteVerseText.value = "";
    studyNoteTranslationId.value = "";
    studyNoteBookId.value = "";
    studyNoteChapter.value = "";
    studyNoteVerse.value = "";
    return;
  }

  selectedVerseReference.textContent = state.selectedVerse.reference;
  selectedVerseText.textContent = state.selectedVerse.text;
  studyNoteReference.value = state.selectedVerse.reference;
  studyNoteVerseText.value = state.selectedVerse.text;
  studyNoteTranslationId.value = state.currentChapter?.translation?.id || state.readingPosition.translationId;
  studyNoteBookId.value = state.currentChapter?.book?.id || state.readingPosition.bookId;
  studyNoteChapter.value = String(state.currentChapter?.chapter?.number || state.readingPosition.chapter);
  studyNoteVerse.value = String(state.selectedVerse.verse || "");
}

function renderStudioResult(result) {
  studioTitle.textContent = result.title;
  studioSummary.textContent = result.summary;
  studioResponseCopy.textContent = result.response;
  studioPrayerCopy.textContent = result.prayer;
  studioScriptureCopy.textContent = result.scripture;
  studioModeLabel.textContent = `${result.mode} mode`;
  studioSourcePill.textContent = result.source === "openai" ? "OpenAI live" : "Server fallback";
  studioActionList.innerHTML = result.actions.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  studioFollowUpList.innerHTML = result.followUps.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderStudioHistory() {
  if (!state.aiSessions.length) {
    studioLog.innerHTML = `
      <article class="studio-log-card studio-log-empty">
        Run the AI guide once and your recent prompts will appear here.
      </article>
    `;
    return;
  }

  studioLog.innerHTML = state.aiSessions.map((entry) => `
    <article class="studio-log-card">
      <p class="card-label">${escapeHtml(entry.mode)} mode</p>
      <h3>${escapeHtml(entry.title)}</h3>
      <p>${escapeHtml(entry.promptPreview)}</p>
      <button class="studio-log-button" type="button" data-session-id="${escapeHtml(entry.id)}">
        Reuse Prompt
      </button>
    </article>
  `).join("");
}

function getFilteredPrayers() {
  const search = state.prayerFilters.search.trim().toLowerCase();
  const category = state.prayerFilters.category;

  return state.prayers.filter((entry) => {
    if (category !== "all" && entry.category !== category) {
      return false;
    }

    if (!search) {
      return true;
    }

    return [entry.title, entry.body, entry.answeredNote]
      .some((part) => String(part || "").toLowerCase().includes(search));
  });
}

function renderPrayerCard(prayer) {
  const isAnswered = Boolean(prayer.answeredAt);
  const answerMeta = isAnswered
    ? `<p class="answer-meta">Answered ${escapeHtml(formatDate(prayer.answeredAt, { hour: "numeric", minute: "2-digit" }))}</p>`
    : "";
  const answerNote = prayer.answeredNote ? `<p class="answer-note">${escapeHtml(prayer.answeredNote)}</p>` : "";
  const answerForm = isAnswered ? "" : `
    <div class="prayer-actions">
      <button class="button button-secondary prayer-action-button" type="button" data-answer-toggle="${escapeHtml(prayer.id)}">
        Mark Answered
      </button>
    </div>
    <form class="answer-form" data-answer-form="${escapeHtml(prayer.id)}" hidden>
      <label class="form-field">
        <span>Answered note</span>
        <textarea name="answeredNote" rows="3" maxlength="500" placeholder="How was this prayer answered?" required></textarea>
      </label>
      <div class="answer-form-actions">
        <button class="button button-primary prayer-action-button" type="submit">Save Answer</button>
        <button class="button button-ghost prayer-action-button" type="button" data-answer-cancel="${escapeHtml(prayer.id)}">Cancel</button>
      </div>
    </form>
  `;

  return `
    <article class="prayer-card">
      <div class="prayer-card-top">
        <div>
          <p class="card-label">${escapeHtml(categoryLabels[prayer.category] || "General")}</p>
          <h3>${escapeHtml(prayer.title)}</h3>
        </div>
        <span class="prayer-date">${escapeHtml(formatDate(prayer.createdAt))}</span>
      </div>
      <p class="prayer-body">${escapeHtml(prayer.body).replace(/\n/g, "<br>")}</p>
      ${answerMeta}
      ${answerNote}
      ${answerForm}
    </article>
  `;
}

function renderPrayerLists() {
  const filtered = getFilteredPrayers();
  const active = filtered.filter((entry) => !entry.answeredAt);
  const answered = filtered.filter((entry) => entry.answeredAt);

  activePrayerCount.textContent = String(active.length);
  answeredPrayerCount.textContent = String(answered.length);
  filterResultCopy.textContent = `Showing ${filtered.length} prayer${filtered.length === 1 ? "" : "s"} in this view.`;
  activePrayerList.innerHTML = active.length ? active.map(renderPrayerCard).join("") : `<article class="prayer-empty">No active prayers match this view yet.</article>`;
  answeredPrayerList.innerHTML = answered.length ? answered.map(renderPrayerCard).join("") : `<article class="prayer-empty">No answered prayers match this view yet.</article>`;
}

function setStudioMode(mode) {
  state.studioMode = mode;
  studioModeButtons.forEach((button) => {
    const isActive = button.dataset.aiMode === mode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  studioModeLabel.textContent = `${mode} mode`;
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

async function openPassage(passage, options = {}) {
  const translationId = passage.translationId || state.readingPosition.translationId || "BSB";
  const bookId = passage.bookId || state.activeBookId || state.readingPosition.bookId;
  const chapter = Math.max(1, Number(passage.chapter || 1));

  state.readingPosition = {
    translationId,
    bookId,
    chapter
  };
  state.activeBookId = bookId;
  readerTranslation.value = translationId;
  readerChapter.value = String(chapter);

  const loadedChapter = await loadChapter({
    translationId,
    bookId,
    chapter
  });

  if (!loadedChapter) {
    return;
  }

  if (passage.verse) {
    const verseNumber = Number(passage.verse);
    const matchedVerse = state.currentChapter?.chapter?.verses.find((entry) => Number(entry.verse) === verseNumber);
    const reference = passage.reference || `${state.currentChapter?.book?.name || getBookName(bookId)} ${chapter}:${verseNumber}`;
    state.selectedVerse = {
      reference,
      verse: verseNumber,
      text: passage.text || matchedVerse?.text || ""
    };
    renderSelectedVerse();
    if (state.currentChapter) {
      renderChapter(state.currentChapter);
    }
  }

  if (options.hash) {
    window.location.hash = options.hash;
  }
}

async function loadBootstrap() {
  const data = await requestJson("/api/bible/bootstrap");
  state.books = data.books;
  state.translations = data.translations;
  state.topics = data.topics;
  state.plans = data.plans || [];
  state.readingPosition = {
    ...state.readingPosition,
    ...(data.readingPosition || {})
  };
  state.activeBookId = state.readingPosition.bookId;

  renderVerseOfDay(data.verseOfDay);
  renderContinueReading();
  renderTranslationSelect();
  renderBookFilters();
  renderBookGrid();
  renderReadingPlans();
  renderTopicCollections();
}

async function loadChapter(options = {}) {
  const translationId = options.translationId || readerTranslation.value || state.readingPosition.translationId;
  const bookId = options.bookId || state.activeBookId || state.readingPosition.bookId;
  const chapter = options.chapter || Number(readerChapter.value || state.readingPosition.chapter || 1);

  readerLoadButton.disabled = true;
  setMessage(readerStatus, "Loading chapter...", "neutral");

  try {
    const query = new URLSearchParams({
      translationId,
      bookId,
      chapter: String(chapter)
    });
    const data = await requestJson(`/api/bible/chapter?${query.toString()}`);
    renderChapter(data.chapter);
    renderSelectedVerse();
    return data.chapter;
  } catch (error) {
    setMessage(readerStatus, error.message, "error");
    return null;
  } finally {
    readerLoadButton.disabled = false;
  }
}

async function loadSavedVerses() {
  const data = await requestJson("/api/library/verses");
  state.savedVerses = data.savedVerses;
  renderSavedVerses();
  renderStats();
}

async function loadStudyNotes() {
  const data = await requestJson("/api/study-notes");
  state.studyNotes = data.notes;
  renderStudyNotes();
  renderStats();
}

async function loadPrayers() {
  const data = await requestJson("/api/prayers");
  state.prayers = data.prayers;
  renderPrayerLists();
  renderStats();
}

async function loadAiSessions() {
  const data = await requestJson("/api/ai/sessions");
  state.aiSessions = data.sessions;
  renderStudioHistory();
  renderStats();
}

function buildDefaultStudioResult() {
  return {
    mode: state.studioMode,
    source: "selah-local-ai",
    title: "Waiting for your first prompt",
    summary: "Use the AI guide when you want help understanding a passage, framing a prayer, or turning a reading into action.",
    response: "Select a verse, load a topic collection, or write your own prompt to start.",
    prayer: "A prayer draft will appear here.",
    scripture: "A supporting passage will appear here.",
    actions: [
      "Select a verse or chapter.",
      "Describe what you want help with.",
      "Run the guide and keep what is useful."
    ],
    followUps: [
      "What is this passage asking of you today?",
      "What would obedience look like in the next 24 hours?"
    ]
  };
}

async function loadWorkspace() {
  try {
    const sessionData = await requestJson("/api/session");

    if (!sessionData.authenticated || !sessionData.user) {
      redirectToLogin();
      return;
    }

    applyUser(sessionData.user);
    renderStudioResult(buildDefaultStudioResult());

    const results = await Promise.allSettled([
      loadBootstrap(),
      loadSavedVerses(),
      loadStudyNotes(),
      loadPrayers(),
      loadAiSessions()
    ]);

    const bootstrapFailed = results[0].status === "rejected";

    if (!bootstrapFailed) {
      await loadChapter(state.readingPosition);
    }

    const firstFailure = results.find((result) => result.status === "rejected");

    if (firstFailure) {
      setMessage(dashboardStatus, firstFailure.reason?.message || "Part of the library failed to load.", "error");
    }
  } catch (error) {
    if (error?.status === 401) {
      redirectToLogin();
      return;
    }

    setMessage(dashboardStatus, error.message || "The library failed to load.", "error");
  }
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

function handleTestamentFilterClick(event) {
  state.currentBookFilter = event.currentTarget.dataset.testamentFilter || "all";
  testamentFilterButtons.forEach((button) => {
    const isActive = button.dataset.testamentFilter === state.currentBookFilter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  renderBookGrid();
}

function handleBookGridClick(event) {
  const button = event.target.closest("[data-book-id]");

  if (!button) {
    return;
  }

  state.activeBookId = button.dataset.bookId;
  state.readingPosition.bookId = button.dataset.bookId;
  state.readingPosition.chapter = 1;
  readerChapter.value = "1";
  renderBookGrid();
  void openPassage({
    translationId: readerTranslation.value || state.readingPosition.translationId,
    bookId: button.dataset.bookId,
    chapter: 1
  }, { hash: "books" });
}

function handleBookSearch(event) {
  state.currentBookSearch = String(event.currentTarget.value || "").trim().toLowerCase();
  renderBookGrid();
}

function handleBookGroupChange(event) {
  state.currentBookGroup = event.currentTarget.value || "all";
  renderBookGrid();
}

function handleContinueReadingClick() {
  void openPassage({
    translationId: state.readingPosition.translationId,
    bookId: state.readingPosition.bookId,
    chapter: state.readingPosition.chapter
  }, { hash: "books" });
}

function handleBookSpotlightOpen() {
  const bookId = state.activeBookId || state.readingPosition.bookId;
  const chapter = Math.max(1, Number(readerChapter.value || state.readingPosition.chapter || 1));
  void openPassage({
    translationId: readerTranslation.value || state.readingPosition.translationId,
    bookId,
    chapter
  }, { hash: "books" });
}

function handleBookSpotlightJump(event) {
  const button = event.target.closest("[data-spotlight-chapter]");

  if (!button) {
    return;
  }

  const bookId = state.activeBookId || state.readingPosition.bookId;
  const chapter = Number(button.dataset.spotlightChapter || 1);
  readerChapter.value = String(chapter);
  void openPassage({
    translationId: readerTranslation.value || state.readingPosition.translationId,
    bookId,
    chapter
  }, { hash: "books" });
}

async function handleSaveReadingPosition() {
  saveReadingPositionButton.disabled = true;

  try {
    const readingPosition = {
      translationId: readerTranslation.value || state.readingPosition.translationId,
      bookId: state.activeBookId || state.readingPosition.bookId,
      chapter: Math.max(1, Number(readerChapter.value || state.readingPosition.chapter || 1))
    };
    const data = await requestJson("/api/bible/reading-position", {
      method: "POST",
      body: JSON.stringify(readingPosition)
    });

    applyUser(data.user);
    setMessage(readerStatus, data.message, "success");
  } catch (error) {
    setMessage(readerStatus, error.message, "error");
  } finally {
    saveReadingPositionButton.disabled = false;
  }
}

function handleVerseListClick(event) {
  const button = event.target.closest("[data-verse-reference]");

  if (!button) {
    return;
  }

  state.selectedVerse = {
    reference: button.dataset.verseReference,
    verse: Number(button.dataset.verseNumber),
    text: button.dataset.verseText
  };
  renderSelectedVerse();
  renderChapter(state.currentChapter);
}

async function handleSaveSelectedVerse() {
  const payload = getSelectedVersePayload();

  if (!payload) {
    setMessage(dashboardStatus, "Select a verse first.", "error");
    return;
  }

  saveSelectedVerseButton.disabled = true;

  try {
    const data = await requestJson("/api/library/verses", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    if (!state.savedVerses.find((entry) => entry.id === data.savedVerse.id)) {
      state.savedVerses = [data.savedVerse, ...state.savedVerses];
      renderSavedVerses();
      renderStats();
    }

    setMessage(dashboardStatus, data.message, "success");
  } catch (error) {
    setMessage(dashboardStatus, error.message, "error");
  } finally {
    saveSelectedVerseButton.disabled = false;
  }
}

function handleSendSelectedToAi() {
  const payload = getSelectedVersePayload();

  if (!payload) {
    setMessage(dashboardStatus, "Select a verse first.", "error");
    return;
  }

  setStudioMode(state.user?.settings?.defaultAiMode || "scripture");
  aiPrompt.value = `${payload.reference} (${payload.translationId})\n${payload.text}\n\nHelp me understand how this passage speaks to what I am carrying today.`;
  aiPrompt.focus();
  window.location.hash = "study";
}

function handleTopicCollectionClick(event) {
  const button = event.target.closest("[data-topic-reference]");

  if (!button) {
    return;
  }

  void openPassage({
    translationId: readerTranslation.value || state.readingPosition.translationId,
    bookId: button.dataset.topicBookId,
    chapter: Number(button.dataset.topicChapter),
    verse: Number(button.dataset.topicVerse),
    reference: button.dataset.topicReference,
    text: button.dataset.topicText
  }, { hash: "study" });
}

function handleReadingPlanClick(event) {
  const button = event.target.closest("[data-plan-open]");

  if (!button) {
    return;
  }

  const plan = state.plans.find((entry) => entry.id === button.dataset.planOpen);

  if (!plan) {
    return;
  }

  const current = getPlanCurrentStep(plan);
  setMessage(planStatus, `Opening ${current.step.reference} from ${plan.title}.`, "success");
  void openPassage({
    translationId: state.readingPosition.translationId,
    bookId: current.step.bookId,
    chapter: current.step.chapter
  }, { hash: "books" });
}

async function handleStudyNoteSubmit(event) {
  event.preventDefault();

  const submitButton = studyNoteForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  setMessage(studyNoteStatus, "Saving study note...", "neutral");

  try {
    const payload = Object.fromEntries(new FormData(studyNoteForm).entries());
    const data = await requestJson("/api/study-notes", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    state.studyNotes = [data.note, ...state.studyNotes];
    renderStudyNotes();
    renderStats();
    studyNoteForm.reset();
    if (state.selectedVerse) {
      renderSelectedVerse();
    }
    setMessage(studyNoteStatus, data.message, "success");
  } catch (error) {
    setMessage(studyNoteStatus, error.message, "error");
  } finally {
    submitButton.disabled = false;
  }
}

async function handleAiStudioSubmit(event) {
  event.preventDefault();

  const submitButton = aiStudioForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  setMessage(dashboardStatus, "Selah is thinking...", "neutral");

  try {
    const payload = Object.fromEntries(new FormData(aiStudioForm).entries());
    const data = await requestJson("/api/ai/studio", {
      method: "POST",
      body: JSON.stringify({
        prompt: payload.prompt,
        mode: state.studioMode
      })
    });

    renderStudioResult(data.result);
    if (data.session) {
      state.aiSessions = [data.session, ...state.aiSessions.filter((entry) => entry.id !== data.session.id)].slice(0, 8);
      renderStudioHistory();
      renderStats();
    }
    setMessage(dashboardStatus, data.message, "success");
  } catch (error) {
    setMessage(dashboardStatus, error.message, "error");
  } finally {
    submitButton.disabled = false;
  }
}

function handleSeedClick(event) {
  aiPrompt.value = event.currentTarget.dataset.aiSeed || "";
  aiPrompt.focus();
}

function handleStudioLogClick(event) {
  const button = event.target.closest("[data-session-id]");

  if (!button) {
    return;
  }

  const session = state.aiSessions.find((entry) => entry.id === button.dataset.sessionId);

  if (!session) {
    return;
  }

  setStudioMode(session.mode);
  aiPrompt.value = session.prompt;
  aiPrompt.focus();
}

async function handlePrayerSubmit(event) {
  event.preventDefault();

  const submitButton = prayerForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  setMessage(prayerFormStatus, "Saving your prayer...", "neutral");

  try {
    const payload = Object.fromEntries(new FormData(prayerForm).entries());
    const data = await requestJson("/api/prayers", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    state.prayers = [data.prayer, ...state.prayers];
    renderPrayerLists();
    renderStats();
    prayerForm.reset();
    setMessage(prayerFormStatus, data.message, "success");
  } catch (error) {
    setMessage(prayerFormStatus, error.message, "error");
  } finally {
    submitButton.disabled = false;
  }
}

function toggleAnswerForm(prayerId, shouldShow) {
  const form = activePrayerList.querySelector(`[data-answer-form="${prayerId}"]`);

  if (!form) {
    return;
  }

  form.hidden = !shouldShow;

  if (shouldShow) {
    form.querySelector("textarea")?.focus();
  } else {
    form.reset();
  }
}

function handlePrayerListClick(event) {
  const toggleButton = event.target.closest("[data-answer-toggle]");

  if (toggleButton) {
    toggleAnswerForm(toggleButton.dataset.answerToggle, true);
    return;
  }

  const cancelButton = event.target.closest("[data-answer-cancel]");

  if (cancelButton) {
    toggleAnswerForm(cancelButton.dataset.answerCancel, false);
  }
}

async function handlePrayerListSubmit(event) {
  const form = event.target.closest("[data-answer-form]");

  if (!form) {
    return;
  }

  event.preventDefault();
  const prayerId = form.dataset.answerForm;
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;

  try {
    const answeredNote = new FormData(form).get("answeredNote");
    const data = await requestJson(`/api/prayers/${prayerId}/answer`, {
      method: "POST",
      body: JSON.stringify({ answeredNote })
    });

    state.prayers = state.prayers.map((entry) => (entry.id === prayerId ? data.prayer : entry));
    renderPrayerLists();
    renderStats();
    setMessage(dashboardStatus, data.message, "success");
  } catch (error) {
    setMessage(dashboardStatus, error.message, "error");
  } finally {
    submitButton.disabled = false;
  }
}

function handlePrayerSearch(event) {
  state.prayerFilters.search = event.currentTarget.value || "";
  renderPrayerLists();
}

function handleCategoryFilter(event) {
  state.prayerFilters.category = event.currentTarget.value || "all";
  renderPrayerLists();
}

async function handleSavedVersesClick(event) {
  const openButton = event.target.closest("[data-open-saved-verse]");

  if (openButton) {
    const entry = state.savedVerses.find((item) => item.id === openButton.dataset.openSavedVerse);

    if (!entry) {
      return;
    }

    void openPassage({
      translationId: entry.translationId,
      bookId: entry.bookId,
      chapter: entry.chapter,
      verse: entry.verse,
      reference: entry.reference,
      text: entry.text
    }, { hash: "books" });
    return;
  }

  const button = event.target.closest("[data-remove-saved-verse]");

  if (!button) {
    return;
  }

  try {
    await requestJson(`/api/library/verses/${button.dataset.removeSavedVerse}`, {
      method: "DELETE"
    });

    state.savedVerses = state.savedVerses.filter((entry) => entry.id !== button.dataset.removeSavedVerse);
    renderSavedVerses();
    renderStats();
  } catch (error) {
    setMessage(dashboardStatus, error.message, "error");
  }
}

function handleStudyNotesClick(event) {
  const button = event.target.closest("[data-open-study-note]");

  if (!button) {
    return;
  }

  const entry = state.studyNotes.find((item) => item.id === button.dataset.openStudyNote);

  if (!entry?.bookId || !entry?.chapter) {
    setMessage(dashboardStatus, "This note does not have a passage attached yet.", "error");
    return;
  }

  void openPassage({
    translationId: entry.translationId || state.readingPosition.translationId,
    bookId: entry.bookId,
    chapter: entry.chapter,
    verse: entry.verse,
    reference: entry.reference,
    text: entry.verseText
  }, { hash: "books" });
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
  submitButton.disabled = true;
  setMessage(settingsFormStatus, "Updating settings...", "neutral");

  try {
    const data = await requestJson("/api/account/settings", {
      method: "PATCH",
      body: JSON.stringify({
        defaultAiMode: settingsDefaultMode.value,
        aiVoice: settingsAiVoice.value,
        reminderTime: settingsReminderTime.value,
        weeklyDigest: settingsWeeklyDigest.checked,
        experimentalLayout: settingsExperimentalLayout.checked
      })
    });

    applyUser(data.user);
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

dashboardLogout.addEventListener("click", handleDashboardLogout);
dashboardResendEmail.addEventListener("click", handleResendEmail);
continueReadingButton.addEventListener("click", handleContinueReadingClick);
readerLoadButton.addEventListener("click", () => loadChapter({
  translationId: readerTranslation.value,
  bookId: state.activeBookId || state.readingPosition.bookId,
  chapter: Number(readerChapter.value || state.readingPosition.chapter || 1)
}));
saveReadingPositionButton.addEventListener("click", handleSaveReadingPosition);
bookSearch.addEventListener("input", handleBookSearch);
bookGroupFilter.addEventListener("change", handleBookGroupChange);
bookGrid.addEventListener("click", handleBookGridClick);
bookChapterJump.addEventListener("click", handleBookSpotlightJump);
bookSpotlightOpen.addEventListener("click", handleBookSpotlightOpen);
chapterVerseList.addEventListener("click", handleVerseListClick);
saveSelectedVerseButton.addEventListener("click", handleSaveSelectedVerse);
sendSelectedToAiButton.addEventListener("click", handleSendSelectedToAi);
readingPlanList.addEventListener("click", handleReadingPlanClick);
topicCollectionList.addEventListener("click", handleTopicCollectionClick);
studyNoteForm.addEventListener("submit", handleStudyNoteSubmit);
aiStudioForm.addEventListener("submit", handleAiStudioSubmit);
prayerForm.addEventListener("submit", handlePrayerSubmit);
activePrayerList.addEventListener("click", handlePrayerListClick);
activePrayerList.addEventListener("submit", handlePrayerListSubmit);
prayerSearch.addEventListener("input", handlePrayerSearch);
prayerCategoryFilter.addEventListener("change", handleCategoryFilter);
savedVersesList.addEventListener("click", handleSavedVersesClick);
studyNotesList.addEventListener("click", handleStudyNotesClick);
profileForm.addEventListener("submit", handleProfileSubmit);
settingsForm.addEventListener("submit", handleSettingsSubmit);
passwordForm.addEventListener("submit", handlePasswordSubmit);
studioLog.addEventListener("click", handleStudioLogClick);
readerTranslation.addEventListener("change", (event) => {
  state.readingPosition.translationId = event.currentTarget.value;
  renderContinueReading();
});
readerChapter.addEventListener("change", (event) => {
  state.readingPosition.chapter = Math.max(1, Number(event.currentTarget.value || 1));
  renderBookSpotlight();
});
testamentFilterButtons.forEach((button) => button.addEventListener("click", handleTestamentFilterClick));
studioModeButtons.forEach((button) => button.addEventListener("click", (event) => {
  setStudioMode(event.currentTarget.dataset.aiMode || "companion");
}));
aiSeedButtons.forEach((button) => button.addEventListener("click", handleSeedClick));

setStudioMode(state.studioMode);
loadWorkspace();
