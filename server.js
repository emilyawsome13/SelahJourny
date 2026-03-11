const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const path = require("node:path");

const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const express = require("express");
const session = require("express-session");
const nodemailer = require("nodemailer");

const {
  getBooks,
  getTranslations,
  getBookById,
  getTranslationById,
  getChapter,
  getVerseOfDay,
  getTopicCollections,
  getReadingPlans,
  getGeneratorPresets,
  generateVerse
} = require("./bible-service");

dotenv.config({ quiet: true });

function normalizeName(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function buildWelcomeEmailRecord(emailStatus) {
  return {
    mode: emailStatus.mode,
    lastSentAt: new Date().toISOString(),
    messageId: emailStatus.messageId || null,
    error: emailStatus.error || null
  };
}

function sha256(value) {
  return crypto.createHash("sha256").update(String(value || "")).digest("hex");
}

function maskEmail(value) {
  const email = String(value || "").trim();
  const [localPart, domain] = email.split("@");

  if (!localPart || !domain) {
    return email;
  }

  if (localPart.length <= 2) {
    return `${localPart[0] || ""}*@${domain}`;
  }

  return `${localPart.slice(0, 2)}${"*".repeat(Math.max(2, localPart.length - 2))}@${domain}`;
}

const PRAYER_CATEGORIES = new Set([
  "general",
  "family",
  "gratitude",
  "guidance",
  "health",
  "church",
  "work"
]);

const REFLECTION_PROFILES = [
  {
    theme: "peace",
    matchers: ["anxious", "stress", "worried", "panic", "overwhelmed", "fear", "afraid"],
    scripture: "Philippians 4:6-7",
    headline: "Slow the moment down before it carries you.",
    reflection: "God often meets anxious moments by giving peace before He gives full answers.",
    prayerPrompt: "Name what feels heavy, then ask for peace strong enough to guard your thoughts.",
    nextStep: "Take one slow breath, then write one sentence you can trust God with today."
  },
  {
    theme: "gratitude",
    matchers: ["grateful", "thanks", "thankful", "praise", "joy", "celebrate"],
    scripture: "Psalm 100:4",
    headline: "Turn gratitude into memory, not just a passing feeling.",
    reflection: "Thanksgiving becomes stronger when you record it clearly and revisit it later.",
    prayerPrompt: "Thank God for one specific gift from today and ask Him to keep your heart awake to grace.",
    nextStep: "Capture the exact moment that made you grateful so it becomes part of your testimony."
  },
  {
    theme: "guidance",
    matchers: ["decision", "direction", "guidance", "wisdom", "confused", "uncertain", "choice"],
    scripture: "James 1:5",
    headline: "Clarity usually grows through faithful next steps.",
    reflection: "God often gives enough light for obedience before He gives the whole map.",
    prayerPrompt: "Ask for wisdom, surrender your preferred outcome, and look for the next right step.",
    nextStep: "Write the decision in plain words and list the next obedient action you can take this week."
  },
  {
    theme: "rest",
    matchers: ["tired", "exhausted", "burned out", "weary", "drained", "rest"],
    scripture: "Matthew 11:28",
    headline: "Weariness is not failure; it is a signal to return.",
    reflection: "Jesus invites tired people to come close, not to perform harder.",
    prayerPrompt: "Tell God where you feel depleted and ask Him for rest that reaches your mind, body, and spirit.",
    nextStep: "Choose one thing you can release today so your soul has room to breathe."
  },
  {
    theme: "family",
    matchers: ["family", "marriage", "kids", "home", "parent", "spouse"],
    scripture: "Joshua 24:15",
    headline: "Faithfulness at home grows through small steady prayers.",
    reflection: "God often works in families through patient consistency rather than one dramatic moment.",
    prayerPrompt: "Pray for gentleness, honest conversation, and a home shaped by peace.",
    nextStep: "Write one concrete blessing you want to speak over your family this week."
  },
  {
    theme: "hope",
    matchers: ["hope", "waiting", "delay", "longing", "discouraged", "sad", "hard"],
    scripture: "Romans 15:13",
    headline: "Waiting does not mean God has gone silent.",
    reflection: "Hope grows when you let God hold both the delay and your expectation.",
    prayerPrompt: "Bring the ache honestly to God and ask Him to keep hope alive while you wait.",
    nextStep: "Write one way God has been faithful before so your present waiting has a memory to stand on."
  }
];

const DEFAULT_USER_SETTINGS = {
  defaultAiMode: "companion",
  aiVoice: "grounded",
  reminderTime: "07:30",
  weeklyDigest: true,
  experimentalLayout: true,
  startTab: "browser",
  preferredTranslationId: "BSB",
  defaultGeneratorMode: "random",
  showVerseReason: true,
  compactBookCards: false,
  readingPosition: {
    translationId: "BSB",
    bookId: "JHN",
    chapter: 1
  }
};

const DEFAULT_SPIRITUAL_PROFILE = {
  focus: "Presence over performance",
  currentSeason: "",
  bio: ""
};

const AI_VOICES = new Set([
  "grounded",
  "gentle",
  "courageous",
  "poetic"
]);

const CHECKIN_MOODS = new Set([
  "steady",
  "hopeful",
  "grateful",
  "tired",
  "anxious",
  "heavy"
]);

const CHECKIN_MOOD_META = {
  steady: {
    label: "Steady",
    description: "You feel stable enough to build small faithful momentum."
  },
  hopeful: {
    label: "Hopeful",
    description: "There is light in view, even if the whole path is not visible."
  },
  grateful: {
    label: "Grateful",
    description: "Your attention is catching real grace instead of only pressure."
  },
  tired: {
    label: "Tired",
    description: "Your soul is asking for gentleness, margin, and slower expectations."
  },
  anxious: {
    label: "Anxious",
    description: "You need grounding, clarity, and a smaller next step."
  },
  heavy: {
    label: "Heavy",
    description: "Something important is weighing on you and needs honest language."
  }
};

function hydrateUserRecord(user) {
  const mergedSettings = {
    ...DEFAULT_USER_SETTINGS,
    ...(user.settings || {})
  };

  return {
    ...user,
    profile: {
      ...DEFAULT_SPIRITUAL_PROFILE,
      ...(user.profile || {})
    },
    settings: {
      ...mergedSettings,
      readingPosition: {
        ...DEFAULT_USER_SETTINGS.readingPosition,
        ...(mergedSettings.readingPosition || {})
      }
    },
    welcomeEmail: user.welcomeEmail || null,
    passwordReset: user.passwordReset || null
  };
}

function publicUser(user) {
  const hydratedUser = hydrateUserRecord(user);

  return {
    id: hydratedUser.id,
    name: hydratedUser.name,
    email: hydratedUser.email,
    createdAt: hydratedUser.createdAt,
    welcomeEmail: hydratedUser.welcomeEmail || null,
    profile: hydratedUser.profile,
    settings: hydratedUser.settings
  };
}

function publicPrayer(prayer) {
  return {
    id: prayer.id,
    title: prayer.title,
    body: prayer.body,
    category: prayer.category,
    createdAt: prayer.createdAt,
    answeredAt: prayer.answeredAt || null,
    answeredNote: prayer.answeredNote || null
  };
}

function publicCheckin(checkin) {
  return {
    id: checkin.id,
    mood: checkin.mood,
    energy: checkin.energy,
    gratitude: checkin.gratitude,
    challenge: checkin.challenge,
    createdAt: checkin.createdAt
  };
}

function publicAiSession(sessionEntry) {
  return {
    id: sessionEntry.id,
    mode: sessionEntry.mode,
    prompt: sessionEntry.prompt,
    promptPreview: sessionEntry.promptPreview,
    title: sessionEntry.title,
    summary: sessionEntry.summary,
    responsePreview: sessionEntry.responsePreview,
    scripture: sessionEntry.scripture,
    source: sessionEntry.source,
    createdAt: sessionEntry.createdAt
  };
}

function publicSavedVerse(savedVerse) {
  return {
    id: savedVerse.id,
    reference: savedVerse.reference,
    translationId: savedVerse.translationId,
    bookId: savedVerse.bookId,
    chapter: savedVerse.chapter,
    verse: savedVerse.verse,
    text: savedVerse.text,
    createdAt: savedVerse.createdAt
  };
}

function publicStudyNote(note) {
  return {
    id: note.id,
    title: note.title,
    body: note.body,
    reference: note.reference,
    verseText: note.verseText,
    translationId: note.translationId || null,
    bookId: note.bookId || null,
    chapter: note.chapter || null,
    verse: note.verse || null,
    createdAt: note.createdAt
  };
}

function sessionRegenerate(request) {
  return new Promise((resolve, reject) => {
    request.session.regenerate((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

function sessionDestroy(request) {
  return new Promise((resolve, reject) => {
    request.session.destroy((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

function normalizePrayerTitle(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function normalizePrayerBody(value) {
  return String(value || "").replace(/\r\n/g, "\n").trim();
}

function normalizeStudyNoteTitle(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function normalizeAccountLine(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function normalizeAccountBio(value) {
  return String(value || "").replace(/\r\n/g, "\n").trim();
}

function normalizePrayerCategory(value) {
  const category = String(value || "").trim().toLowerCase();
  return PRAYER_CATEGORIES.has(category) ? category : "general";
}

function normalizeReflectionPrompt(value) {
  return String(value || "").replace(/\r\n/g, "\n").trim();
}

function getReflectionProfile(prompt, prayers) {
  const text = [
    prompt,
    prayers.map((entry) => `${entry.category} ${entry.title} ${entry.body}`).join(" ")
  ].join(" ").toLowerCase();

  return REFLECTION_PROFILES.find((profile) => (
    profile.matchers.some((matcher) => text.includes(matcher))
  )) || REFLECTION_PROFILES[0];
}

function buildReflectionResponse({ user, prompt, prayers }) {
  const profile = getReflectionProfile(prompt, prayers);
  const firstName = user.name.split(/\s+/)[0] || user.name;
  const activePrayers = prayers.filter((entry) => !entry.answeredAt).length;
  const answeredPrayers = prayers.filter((entry) => entry.answeredAt).length;
  const promptSummary = prompt.split(/\s+/).slice(0, 18).join(" ");
  const momentumLine = activePrayers > 0
    ? `You currently have ${activePrayers} active prayer${activePrayers === 1 ? "" : "s"} in your journal, so this moment belongs in a larger story of persistence.`
    : "This is a fresh place to begin, and small faithful entries matter.";
  const answeredLine = answeredPrayers > 0
    ? `You also have ${answeredPrayers} answered prayer${answeredPrayers === 1 ? "" : "s"} recorded, which means you already have evidence of God's faithfulness to revisit.`
    : "As answers come, record them so hope has something concrete to look back on.";

  return {
    source: "selah-server",
    theme: profile.theme,
    headline: `${firstName}, ${profile.headline.charAt(0).toLowerCase()}${profile.headline.slice(1)}`,
    reflection: `${profile.reflection} ${momentumLine} ${answeredLine}`,
    prayerPrompt: profile.prayerPrompt,
    scripture: profile.scripture,
    nextStep: profile.nextStep,
    echo: promptSummary
  };
}

const AI_STUDIO_MODES = new Set([
  "companion",
  "reframe",
  "plan",
  "scripture",
  "experiment"
]);

const WORKSPACE_TABS = new Set([
  "overview",
  "browser",
  "generator",
  "library",
  "account"
]);

const VERSE_GENERATOR_MODES = new Set([
  "random",
  "daily",
  "topic",
  "testament",
  "book",
  "chapter"
]);

const URGENT_SUPPORT_KEYWORDS = [
  "suicide",
  "kill myself",
  "hurt myself",
  "self harm",
  "end my life",
  "want to die"
];

function formatCategoryLabel(category) {
  return String(category || "general")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function normalizeAiMode(value) {
  const mode = String(value || "").trim().toLowerCase();
  return AI_STUDIO_MODES.has(mode) ? mode : "companion";
}

function normalizeAiVoice(value) {
  const voice = String(value || "").trim().toLowerCase();
  return AI_VOICES.has(voice) ? voice : DEFAULT_USER_SETTINGS.aiVoice;
}

function normalizeReminderTime(value) {
  const reminderTime = String(value || "").trim();
  return /^\d{2}:\d{2}$/.test(reminderTime) ? reminderTime : DEFAULT_USER_SETTINGS.reminderTime;
}

function normalizeWorkspaceTab(value) {
  const tab = String(value || "").trim().toLowerCase();
  return WORKSPACE_TABS.has(tab) ? tab : DEFAULT_USER_SETTINGS.startTab;
}

function normalizeGeneratorModePreference(value) {
  const mode = String(value || "").trim().toLowerCase();
  return VERSE_GENERATOR_MODES.has(mode) ? mode : DEFAULT_USER_SETTINGS.defaultGeneratorMode;
}

function normalizeBoolean(value, fallback = false) {
  if (typeof value === "boolean") {
    return value;
  }

  const normalized = String(value || "").trim().toLowerCase();

  if (["true", "1", "yes", "on"].includes(normalized)) {
    return true;
  }

  if (["false", "0", "no", "off"].includes(normalized)) {
    return false;
  }

  return fallback;
}

function normalizeCheckinMood(value) {
  const mood = String(value || "").trim().toLowerCase();
  return CHECKIN_MOODS.has(mood) ? mood : "steady";
}

function normalizeTranslationId(value) {
  return getTranslationById(value).id;
}

function normalizeBookId(value) {
  const book = getBookById(value);
  return book ? book.id : DEFAULT_USER_SETTINGS.readingPosition.bookId;
}

function normalizeChapter(value, fallback = 1) {
  const number = Number.parseInt(value, 10);

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return Math.max(1, number);
}

function normalizeEnergy(value) {
  const number = Number.parseInt(value, 10);

  if (!Number.isFinite(number)) {
    return 3;
  }

  return Math.min(5, Math.max(1, number));
}

function getMoodMeta(mood) {
  return CHECKIN_MOOD_META[mood] || CHECKIN_MOOD_META.steady;
}

function formatMoodLabel(mood) {
  return getMoodMeta(mood).label;
}

function hasUrgentSupportLanguage(value) {
  const text = String(value || "").toLowerCase();
  return URGENT_SUPPORT_KEYWORDS.some((keyword) => text.includes(keyword));
}

function buildPrayerAnalytics(prayers) {
  const now = Date.now();
  const sevenDaysAgo = now - (1000 * 60 * 60 * 24 * 7);
  const categoryCounts = prayers.reduce((counts, prayer) => {
    counts[prayer.category] = (counts[prayer.category] || 0) + 1;
    return counts;
  }, {});
  const total = prayers.length;
  const activeCount = prayers.filter((entry) => !entry.answeredAt).length;
  const answeredCount = prayers.filter((entry) => entry.answeredAt).length;
  const recentCount = prayers.filter((entry) => new Date(entry.createdAt).getTime() >= sevenDaysAgo).length;
  const topThemes = Object.entries(categoryCounts)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 3)
    .map(([theme, count]) => ({
      theme,
      label: formatCategoryLabel(theme),
      count
    }));

  return {
    total,
    activeCount,
    answeredCount,
    answeredRatio: total ? Math.round((answeredCount / total) * 100) : 0,
    recentCount,
    topThemes,
    latestPrayer: prayers[0] || null
  };
}

function buildCheckinAnalytics(checkins) {
  const sorted = [...checkins].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
  const latest = sorted[0] || null;
  const sevenDaysAgo = Date.now() - (1000 * 60 * 60 * 24 * 7);
  const recent = sorted.filter((entry) => new Date(entry.createdAt).getTime() >= sevenDaysAgo);
  const uniqueDays = [...new Set(sorted.map((entry) => new Date(entry.createdAt).toISOString().slice(0, 10)))];
  let streakDays = 0;

  for (let index = 0; index < uniqueDays.length; index += 1) {
    const date = new Date(uniqueDays[index]);
    const nextDate = uniqueDays[index + 1] ? new Date(uniqueDays[index + 1]) : null;

    streakDays += 1;

    if (!nextDate) {
      break;
    }

    const difference = Math.round((date.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24));

    if (difference !== 1) {
      break;
    }
  }

  const averageEnergy = recent.length
    ? Math.round((recent.reduce((sum, entry) => sum + entry.energy, 0) / recent.length) * 10) / 10
    : 0;

  return {
    latest,
    recentCount: recent.length,
    averageEnergy,
    streakDays,
    moods: sorted.reduce((counts, entry) => {
      counts[entry.mood] = (counts[entry.mood] || 0) + 1;
      return counts;
    }, {})
  };
}

function buildLocalAiBriefing({ user, prayers, checkins }) {
  const prayerAnalytics = buildPrayerAnalytics(prayers);
  const checkinAnalytics = buildCheckinAnalytics(checkins);
  const firstName = user.name.split(/\s+/)[0] || user.name;
  const latestMood = checkinAnalytics.latest?.mood || "steady";
  const moodMeta = getMoodMeta(latestMood);
  const topTheme = prayerAnalytics.topThemes[0]?.label || "General";
  const reminderTime = user.settings?.reminderTime || DEFAULT_USER_SETTINGS.reminderTime;
  const latestGratitude = checkinAnalytics.latest?.gratitude || "Name one concrete grace from today.";
  const challenge = checkinAnalytics.latest?.challenge || `Notice how ${topTheme.toLowerCase()} keeps resurfacing.`;

  return {
    source: "selah-local-ai",
    headline: `${firstName}, here is your next rhythm.`,
    summary: `${moodMeta.description} ${prayerAnalytics.activeCount > 0 ? `You still have ${prayerAnalytics.activeCount} open prayer${prayerAnalytics.activeCount === 1 ? "" : "s"} in motion.` : "This is a clean day to begin a new prayer rhythm."}`,
    focus: user.profile?.focus || DEFAULT_SPIRITUAL_PROFILE.focus,
    ritualSteps: [
      `At ${reminderTime}, pause for 90 seconds before you open anything loud or distracting.`,
      `Write one honest sentence about ${challenge.charAt(0).toLowerCase()}${challenge.slice(1)}`,
      `End the day by recording one proof of grace: ${latestGratitude}`
    ],
    journalPrompt: `What feels most alive in your ${topTheme.toLowerCase()} story right now, and what would faithfulness look like before the day ends?`,
    encouragement: `Your current emotional signal is ${moodMeta.label.toLowerCase()}. Let today's prayers be specific enough to measure and gentle enough to repeat.`
  };
}

function buildLocalAiSnapshot({ user, prayers }) {
  const analytics = buildPrayerAnalytics(prayers);
  const firstName = user.name.split(/\s+/)[0] || user.name;
  const topTheme = analytics.topThemes[0]?.label || "General";
  const emotionalSignal = analytics.activeCount > analytics.answeredCount
    ? "stretched"
    : analytics.answeredCount > 0
      ? "hopeful"
      : "quiet";
  const summary = analytics.total
    ? `${firstName}, your journal is currently ${emotionalSignal}. ${topTheme} is your strongest theme, and ${analytics.answeredRatio}% of your recorded prayers have an answered marker.`
    : `${firstName}, you have a blank canvas right now. Use the studio to turn one raw thought into a prayer, plan, and next faithful step.`;

  return {
    source: "selah-local-ai",
    headline: `${firstName}, your prayer life has a visible pattern.`,
    summary,
    signalCards: [
      {
        label: "Answered ratio",
        value: `${analytics.answeredRatio}%`,
        detail: "of your saved prayers have been marked answered"
      },
      {
        label: "Open focus",
        value: String(analytics.activeCount),
        detail: "prayers are still active in your journal"
      },
      {
        label: "Top theme",
        value: topTheme,
        detail: "appears most often in your recent writing"
      },
      {
        label: "Recent momentum",
        value: String(analytics.recentCount),
        detail: "entries were written in the last 7 days"
      }
    ],
    topThemes: analytics.topThemes.length
      ? analytics.topThemes.map((entry) => ({
        label: entry.label,
        count: entry.count
      }))
      : [
        { label: "General", count: 0 }
      ],
    experiments: [
      {
        title: "Unfiltered unload",
        detail: "Dump one unedited paragraph into Companion mode and let Selah turn it into a prayer."
      },
      {
        title: "Reframe the loudest fear",
        detail: `Run Reframe mode on your strongest theme right now: ${topTheme}.`
      },
      {
        title: "Evidence pass",
        detail: analytics.answeredCount
          ? "Pick one answered prayer and convert it into a testimony sentence."
          : "Mark the first answer you notice this week so hope becomes trackable."
      }
    ]
  };
}

function buildLocalAiSnapshotWithPulse({ user, prayers, checkins }) {
  const snapshot = buildLocalAiSnapshot({ user, prayers });
  const checkinAnalytics = buildCheckinAnalytics(checkins);

  if (!checkinAnalytics.latest) {
    return snapshot;
  }

  const latestMood = getMoodMeta(checkinAnalytics.latest.mood);

  return {
    ...snapshot,
    summary: `${snapshot.summary} Your latest pulse reads ${latestMood.label.toLowerCase()} with energy ${checkinAnalytics.latest.energy}/5.`,
    signalCards: [
      snapshot.signalCards[0],
      snapshot.signalCards[1],
      snapshot.signalCards[2],
      {
        label: "Daily pulse",
        value: latestMood.label,
        detail: `Energy ${checkinAnalytics.latest.energy}/5 across ${checkinAnalytics.recentCount} check-in${checkinAnalytics.recentCount === 1 ? "" : "s"} this week`
      }
    ],
    experiments: [
      {
        title: "Pulse translation",
        detail: `Translate your ${latestMood.label.toLowerCase()} state into one honest prayer before you do anything performative.`
      },
      ...snapshot.experiments.slice(0, 2)
    ]
  };
}

function buildUrgentSupportResponse() {
  return {
    source: "selah-local-ai",
    mode: "companion",
    title: "Get human support right now",
    summary: "Selah can encourage reflection, but this needs immediate human help and direct support.",
    response: "Please stop here and contact a trusted person, a local emergency service, or 988 right now if you are in the United States. Do not stay alone with this.",
    prayer: "God, bring immediate protection, calm, and people who can stay present right now.",
    scripture: "Psalm 34:18",
    actions: [
      "Call or text 988 right now if you are in the United States.",
      "Tell one trusted person exactly what is happening right now.",
      "Move away from anything you could use to hurt yourself."
    ],
    followUps: [
      "Who can you contact in the next 5 minutes?",
      "Can you move into the same room as another person right now?"
    ]
  };
}

function buildLocalAiStudioResponse({ user, prayers, checkins, prompt, mode }) {
  if (hasUrgentSupportLanguage(prompt)) {
    return buildUrgentSupportResponse();
  }

  const analytics = buildPrayerAnalytics(prayers);
  const checkinAnalytics = buildCheckinAnalytics(checkins);
  const reflection = buildReflectionResponse({ user, prompt, prayers });
  const topTheme = analytics.topThemes[0]?.label || "General";
  const firstName = user.name.split(/\s+/)[0] || user.name;
  const selectedVoice = normalizeAiVoice(user.settings?.aiVoice);
  const voiceLine = {
    grounded: "Keep it concrete and usable.",
    gentle: "Keep it soft enough to tell the truth without forcing yourself.",
    courageous: "Do not hide behind vagueness. Name the next brave step.",
    poetic: "Notice the image, not just the information, so the prayer stays memorable."
  }[selectedVoice];
  const latestMood = checkinAnalytics.latest ? formatMoodLabel(checkinAnalytics.latest.mood).toLowerCase() : null;

  const byMode = {
    companion: {
      title: "AI companion read",
      summary: "A calm, direct reading of what your words are carrying.",
      response: `${reflection.reflection} The core pressure under your words sounds like ${reflection.theme}.${latestMood ? ` Your latest daily pulse also reads ${latestMood}, which gives this moment a clearer emotional frame.` : ""}`,
      prayer: `${reflection.prayerPrompt} Let the prayer stay honest and specific, not polished.`,
      scripture: reflection.scripture,
      actions: [
        "Name the real pressure in one sentence without softening it.",
        "Write one thing you cannot control and one thing you can surrender.",
        "Save a prayer entry before you leave this page."
      ],
      followUps: [
        "What part of this feels loudest right now?",
        "What would peace look like in the next 24 hours instead of someday?"
      ]
    },
    reframe: {
      title: "Reframe the moment",
      summary: "Turn a spiraling thought into a truer and steadier frame.",
      response: `The first frame says everything depends on you. The better frame says God is present, your next step can be small, and this moment does not need to be solved all at once.`,
      prayer: `Pray this plainly: God, take this distorted pressure and teach me to see ${topTheme.toLowerCase()} through Your truth instead of fear.`,
      scripture: reflection.scripture,
      actions: [
        "Write the fear in plain language.",
        "Rewrite it as a truer sentence rooted in God's character.",
        "Turn that sentence into the first line of your next prayer."
      ],
      followUps: [
        "What assumption in your thinking needs to be challenged?",
        "What would faithfulness look like if urgency stopped driving the story?"
      ]
    },
    plan: {
      title: "Next faithful plan",
      summary: "A practical sequence so your journal creates movement, not just emotion.",
      response: `Your next plan should be measured, not dramatic. Use today's pressure as input for a 3-step rhythm: notice, pray, act.`,
      prayer: `Ask for courage to move one obedient step at a time instead of demanding instant clarity.`,
      scripture: reflection.scripture,
      actions: [
        "Capture the issue in one saved prayer entry.",
        "Choose one concrete conversation, decision, or act of service for this week.",
        "Set one check-in point to revisit what changed."
      ],
      followUps: [
        "What one action would make this prayer measurable by the end of the week?",
        "What needs to be scheduled instead of merely hoped for?"
      ]
    },
    scripture: {
      title: "Scripture lens",
      summary: "A scriptural angle for reading the moment instead of only reacting to it.",
      response: `Use ${reflection.scripture} as your anchor verse for this situation. Let scripture set the emotional temperature before you decide what the moment means.`,
      prayer: `Pray through ${reflection.scripture} line by line and ask God which phrase He wants to press deeper into you.`,
      scripture: reflection.scripture,
      actions: [
        "Read the verse out loud twice.",
        "Write one phrase from it beside your current prayer.",
        "Record how that phrase changes the way you interpret today's problem."
      ],
      followUps: [
        "What part of this verse confronts your default reaction?",
        "Which line could become a daily repetition this week?"
      ]
    },
    experiment: {
      title: "Experimental prayer loop",
      summary: "A small creative practice to test today instead of repeating the same routine.",
      response: `${firstName}, experiment with prayer as a loop: voice the tension, write the truth, then make one act of alignment before the day ends.`,
      prayer: `Ask God to make this experiment more than novelty. Ask Him to use it to reveal what is actually shaping your inner life.`,
      scripture: reflection.scripture,
      actions: [
        "Speak your raw thought aloud before you edit it.",
        "Write a 3-line prayer: ache, truth, request.",
        "Do one physical action that matches the prayer you just wrote."
      ],
      followUps: [
        "What would make prayer feel less passive for you today?",
        "Which small experiment would you actually repeat tomorrow if it helped?"
      ]
    }
  };

  return {
    source: "selah-local-ai",
    mode,
    ...byMode[mode],
    summary: `${byMode[mode].summary} ${voiceLine}`,
    echo: prompt
  };
}

function buildVoiceInstructions(voice) {
  const selectedVoice = normalizeAiVoice(voice);
  const byVoice = {
    grounded: "Keep the tone clear, calm, and practical.",
    gentle: "Keep the tone soft, reassuring, and non-performative.",
    courageous: "Keep the tone direct, bracing, and action-oriented.",
    poetic: "Keep the tone vivid, reflective, and slightly more lyrical."
  };

  return byVoice[selectedVoice] || byVoice.grounded;
}

const AI_BRIEFING_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    headline: { type: "string" },
    summary: { type: "string" },
    focus: { type: "string" },
    ritualSteps: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: { type: "string" }
    },
    journalPrompt: { type: "string" },
    encouragement: { type: "string" }
  },
  required: ["headline", "summary", "focus", "ritualSteps", "journalPrompt", "encouragement"]
};

const AI_SNAPSHOT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    headline: { type: "string" },
    summary: { type: "string" },
    signalCards: {
      type: "array",
      minItems: 4,
      maxItems: 4,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          label: { type: "string" },
          value: { type: "string" },
          detail: { type: "string" }
        },
        required: ["label", "value", "detail"]
      }
    },
    topThemes: {
      type: "array",
      minItems: 1,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          label: { type: "string" },
          count: { type: "number" }
        },
        required: ["label", "count"]
      }
    },
    experiments: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          detail: { type: "string" }
        },
        required: ["title", "detail"]
      }
    }
  },
  required: ["headline", "summary", "signalCards", "topThemes", "experiments"]
};

const AI_STUDIO_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    response: { type: "string" },
    prayer: { type: "string" },
    scripture: { type: "string" },
    actions: {
      type: "array",
      minItems: 3,
      maxItems: 4,
      items: { type: "string" }
    },
    followUps: {
      type: "array",
      minItems: 2,
      maxItems: 3,
      items: { type: "string" }
    }
  },
  required: ["title", "summary", "response", "prayer", "scripture", "actions", "followUps"]
};

function sanitizeAiSnapshotResponse(local, remote) {
  if (!remote || typeof remote !== "object") {
    return local;
  }

  return {
    source: "openai",
    headline: String(remote.headline || local.headline),
    summary: String(remote.summary || local.summary),
    signalCards: Array.isArray(remote.signalCards) && remote.signalCards.length
      ? remote.signalCards.slice(0, 4).map((entry, index) => ({
        label: String(entry?.label || local.signalCards[index]?.label || "Signal"),
        value: String(entry?.value || local.signalCards[index]?.value || "0"),
        detail: String(entry?.detail || local.signalCards[index]?.detail || "")
      }))
      : local.signalCards,
    topThemes: Array.isArray(remote.topThemes) && remote.topThemes.length
      ? remote.topThemes.slice(0, 3).map((entry) => ({
        label: String(entry?.label || "Theme"),
        count: Number(entry?.count || 0)
      }))
      : local.topThemes,
    experiments: Array.isArray(remote.experiments) && remote.experiments.length
      ? remote.experiments.slice(0, 3).map((entry) => ({
        title: String(entry?.title || "Experiment"),
        detail: String(entry?.detail || "")
      }))
      : local.experiments
  };
}

function sanitizeAiStudioResponse(local, remote) {
  if (!remote || typeof remote !== "object") {
    return local;
  }

  return {
    ...local,
    source: "openai",
    title: String(remote.title || local.title),
    summary: String(remote.summary || local.summary),
    response: String(remote.response || local.response),
    prayer: String(remote.prayer || local.prayer),
    scripture: String(remote.scripture || local.scripture),
    actions: Array.isArray(remote.actions) && remote.actions.length
      ? remote.actions.slice(0, 4).map((entry) => String(entry))
      : local.actions,
    followUps: Array.isArray(remote.followUps) && remote.followUps.length
      ? remote.followUps.slice(0, 3).map((entry) => String(entry))
      : local.followUps
  };
}

function sanitizeAiBriefingResponse(local, remote) {
  if (!remote || typeof remote !== "object") {
    return local;
  }

  return {
    source: "openai",
    headline: String(remote.headline || local.headline),
    summary: String(remote.summary || local.summary),
    focus: String(remote.focus || local.focus),
    ritualSteps: Array.isArray(remote.ritualSteps) && remote.ritualSteps.length
      ? remote.ritualSteps.slice(0, 3).map((entry) => String(entry))
      : local.ritualSteps,
    journalPrompt: String(remote.journalPrompt || local.journalPrompt),
    encouragement: String(remote.encouragement || local.encouragement)
  };
}

async function requestOpenAiJson({ env, schemaName, schema, instructions, input }) {
  const apiKey = String(env.OPENAI_API_KEY || "").trim();

  if (!apiKey) {
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${env.OPENAI_BASE_URL || "https://api.openai.com/v1"}/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: env.OPENAI_MODEL || "gpt-5-mini",
        instructions,
        input,
        text: {
          format: {
            type: "json_schema",
            name: schemaName,
            schema,
            strict: true
          }
        }
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return JSON.parse(data.output_text || "{}");
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function buildAiSnapshotResponse({ env, user, prayers, checkins }) {
  const local = buildLocalAiSnapshotWithPulse({ user, prayers, checkins });

  const remote = await requestOpenAiJson({
    env,
    schemaName: "selah_snapshot",
    schema: AI_SNAPSHOT_SCHEMA,
    instructions: "You are Selah AI, an experimental spiritual reflection assistant. Be concise, insightful, practical, and non-clinical. Summarize the user's prayer journal into a useful dashboard snapshot. Do not mention that you are an AI model.",
    input: `User: ${user.name}\nProfile focus: ${user.profile?.focus || ""}\nJournal analytics: ${JSON.stringify(buildPrayerAnalytics(prayers))}\nCheck-in analytics: ${JSON.stringify(buildCheckinAnalytics(checkins))}\nRecent prayer titles: ${JSON.stringify(prayers.slice(0, 5).map((entry) => entry.title))}`
  });

  return sanitizeAiSnapshotResponse(local, remote);
}

async function buildAiStudioResponse({ env, user, prayers, checkins, prompt, mode }) {
  const local = buildLocalAiStudioResponse({ user, prayers, checkins, prompt, mode });

  if (local.title === "Get human support right now") {
    return local;
  }

  const remote = await requestOpenAiJson({
    env,
    schemaName: "selah_studio",
    schema: AI_STUDIO_SCHEMA,
    instructions: `You are Selah AI, an experimental spiritual reflection assistant. The current mode is "${mode}". Be direct, useful, pastoral, creative, and grounded in practical next steps. ${buildVoiceInstructions(user.settings?.aiVoice)} Do not mention being an AI model. Avoid therapy language, diagnosis, or certainty about God's will.`,
    input: `User: ${user.name}\nMode: ${mode}\nPrompt: ${prompt}\nProfile focus: ${user.profile?.focus || ""}\nCheck-in analytics: ${JSON.stringify(buildCheckinAnalytics(checkins))}\nJournal analytics: ${JSON.stringify(buildPrayerAnalytics(prayers))}\nRecent prayers: ${JSON.stringify(prayers.slice(0, 5).map((entry) => ({
      title: entry.title,
      category: entry.category,
      body: entry.body,
      answeredAt: entry.answeredAt
    })))}`
  });

  return sanitizeAiStudioResponse(local, remote);
}

async function buildAiBriefingResponse({ env, user, prayers, checkins }) {
  const local = buildLocalAiBriefing({ user, prayers, checkins });

  const remote = await requestOpenAiJson({
    env,
    schemaName: "selah_briefing",
    schema: AI_BRIEFING_SCHEMA,
    instructions: `You are Selah AI, an experimental spiritual reflection assistant. Build a focused daily briefing for the member with a practical spiritual rhythm. ${buildVoiceInstructions(user.settings?.aiVoice)} Do not mention being an AI model.`,
    input: `User: ${user.name}\nProfile focus: ${user.profile?.focus || ""}\nCurrent season: ${user.profile?.currentSeason || ""}\nAI settings: ${JSON.stringify(user.settings || {})}\nPrayer analytics: ${JSON.stringify(buildPrayerAnalytics(prayers))}\nCheck-in analytics: ${JSON.stringify(buildCheckinAnalytics(checkins))}`
  });

  return sanitizeAiBriefingResponse(local, remote);
}

function escapeEmailHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildWelcomeEmailHtml(displayName, appUrl) {
  const safeDisplayName = escapeEmailHtml(displayName || "there");
  const safeAppUrl = escapeEmailHtml(appUrl || "");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Selah</title>
</head>
<body style="margin:0;padding:0;background:#f4ede0;font-family:Arial,sans-serif;color:#1f2b24;">
  <table role="presentation" style="width:100%;border-collapse:collapse;background:#f4ede0;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" style="width:100%;max-width:620px;border-collapse:collapse;background:#fffaf1;border:1px solid #e3d7c3;border-radius:24px;overflow:hidden;">
          <tr>
            <td style="padding:36px 36px 24px;background:linear-gradient(135deg,#24382e 0%,#314a3d 100%);color:#fffaf1;">
              <p style="margin:0 0 12px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#dbc18e;">Selah</p>
              <h1 style="margin:0;font-size:34px;line-height:1.05;font-family:Georgia,serif;">Your account is ready.</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 36px;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">Hi ${safeDisplayName},</p>
              <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">
                Thank you for creating a Selah account. Selah is a focused Bible browser built for
                reading scripture clearly, generating a verse when you need direction, and saving
                the passages worth returning to.
              </p>
              <p style="margin:0 0 24px;font-size:16px;line-height:1.7;">
                You can jump in right away: open a book, load a chapter, generate a verse by topic
                or book, and build a personal library of saved verses and study notes.
              </p>
              <div style="padding:18px 20px;border-radius:18px;background:#f3ecdf;border:1px solid #e3d7c3;">
                <p style="margin:0 0 10px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#b86e4b;">What to do next</p>
                <ul style="margin:0;padding-left:18px;color:#455148;">
                  <li style="margin:0 0 8px;font-size:15px;line-height:1.6;">Browse by book, chapter, and translation.</li>
                  <li style="margin:0 0 8px;font-size:15px;line-height:1.6;">Use the verse generator for daily or topic-based prompts.</li>
                  <li style="margin:0;font-size:15px;line-height:1.6;">Save verses and notes you want to revisit later.</li>
                </ul>
              </div>
              ${safeAppUrl ? `
              <p style="margin:24px 0 0;">
                <a href="${safeAppUrl}" style="display:inline-block;padding:14px 22px;border-radius:999px;background:#24382e;color:#fffaf1;text-decoration:none;font-weight:700;">
                  Open Selah
                </a>
              </p>
              <p style="margin:14px 0 0;font-size:14px;line-height:1.7;color:#5d685f;">
                If the button does not work, copy and paste this link into your browser:<br>${safeAppUrl}
              </p>
              ` : ""}
              <p style="margin:24px 0 0;font-size:15px;line-height:1.7;color:#5d685f;">
                If you did not create this account, you can safely ignore this email.<br><br>
                Selah
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildPasswordResetEmailHtml(displayName, resetUrl) {
  const safeDisplayName = escapeEmailHtml(displayName || "there");
  const safeResetUrl = escapeEmailHtml(resetUrl || "");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your Selah password</title>
</head>
<body style="margin:0;padding:0;background:#f4ede0;font-family:Arial,sans-serif;color:#1f2b24;">
  <table role="presentation" style="width:100%;border-collapse:collapse;background:#f4ede0;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" style="width:100%;max-width:620px;border-collapse:collapse;background:#fffaf1;border:1px solid #e3d7c3;border-radius:24px;overflow:hidden;">
          <tr>
            <td style="padding:36px 36px 24px;background:linear-gradient(135deg,#24382e 0%,#314a3d 100%);color:#fffaf1;">
              <p style="margin:0 0 12px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#dbc18e;">Selah</p>
              <h1 style="margin:0;font-size:34px;line-height:1.05;font-family:Georgia,serif;">Reset your password.</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 36px;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">Hi ${safeDisplayName},</p>
              <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">
                A request came in to reset your Selah password. Use the button below to choose a new one.
              </p>
              <p style="margin:0 0 20px;font-size:16px;line-height:1.7;">
                This link expires in 1 hour. If you did not request it, you can safely ignore this email.
              </p>
              <p style="margin:0 0 24px;">
                <a href="${safeResetUrl}" style="display:inline-block;padding:14px 22px;border-radius:999px;background:#24382e;color:#fffaf1;text-decoration:none;font-weight:700;">
                  Reset Password
                </a>
              </p>
              <p style="margin:0;font-size:14px;line-height:1.7;color:#5d685f;">
                If the button does not work, copy and paste this link into your browser:<br>${safeResetUrl}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildWelcomeEmailText(displayName, appUrl) {
  return [
    `Hi ${displayName},`,
    "",
    "Your Selah account is ready.",
    "",
    "Selah is a focused Bible browser where you can read scripture clearly,",
    "generate a verse when you need direction, and save notes worth returning to.",
    "",
    "What to do next:",
    "- Browse by book, chapter, and translation.",
    "- Use the verse generator for daily or topic-based prompts.",
    "- Save verses and study notes to your library.",
    "",
    "Open Selah:",
    appUrl || "",
    "",
    "If you did not create this account, you can safely ignore this email.",
    "",
    "Selah"
  ].join("\n");
}

function buildPasswordResetEmailText(displayName, resetUrl) {
  return [
    `Hi ${displayName},`,
    "",
    "A request came in to reset your Selah password.",
    "",
    "Use this link to choose a new password:",
    resetUrl,
    "",
    "This link expires in 1 hour. If you did not request it, you can ignore this email.",
    "",
    "Selah"
  ].join("\n");
}

function createStorage({
  usersFile,
  emailDir,
  prayersFile,
  checkinsFile,
  aiSessionsFile,
  savedVersesFile,
  studyNotesFile
}) {
  async function ensureInitialized() {
    await fs.mkdir(path.dirname(usersFile), { recursive: true });
    await fs.mkdir(path.dirname(prayersFile), { recursive: true });
    await fs.mkdir(path.dirname(checkinsFile), { recursive: true });
    await fs.mkdir(path.dirname(aiSessionsFile), { recursive: true });
    await fs.mkdir(path.dirname(savedVersesFile), { recursive: true });
    await fs.mkdir(path.dirname(studyNotesFile), { recursive: true });
    await fs.mkdir(emailDir, { recursive: true });

    try {
      await fs.access(usersFile);
    } catch {
      await fs.writeFile(usersFile, "[]\n", "utf8");
    }

    try {
      await fs.access(prayersFile);
    } catch {
      await fs.writeFile(prayersFile, "[]\n", "utf8");
    }

    try {
      await fs.access(checkinsFile);
    } catch {
      await fs.writeFile(checkinsFile, "[]\n", "utf8");
    }

    try {
      await fs.access(aiSessionsFile);
    } catch {
      await fs.writeFile(aiSessionsFile, "[]\n", "utf8");
    }

    try {
      await fs.access(savedVersesFile);
    } catch {
      await fs.writeFile(savedVersesFile, "[]\n", "utf8");
    }

    try {
      await fs.access(studyNotesFile);
    } catch {
      await fs.writeFile(studyNotesFile, "[]\n", "utf8");
    }
  }

  async function readUsers() {
    await ensureInitialized();
    const raw = await fs.readFile(usersFile, "utf8");
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed.map(hydrateUserRecord) : [];
  }

  async function writeUsers(users) {
    await ensureInitialized();
    await fs.writeFile(usersFile, `${JSON.stringify(users.map(hydrateUserRecord), null, 2)}\n`, "utf8");
  }

  async function readPrayers() {
    await ensureInitialized();
    const raw = await fs.readFile(prayersFile, "utf8");
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  }

  async function writePrayers(prayers) {
    await ensureInitialized();
    await fs.writeFile(prayersFile, `${JSON.stringify(prayers, null, 2)}\n`, "utf8");
  }

  async function readCheckins() {
    await ensureInitialized();
    const raw = await fs.readFile(checkinsFile, "utf8");
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  }

  async function writeCheckins(checkins) {
    await ensureInitialized();
    await fs.writeFile(checkinsFile, `${JSON.stringify(checkins, null, 2)}\n`, "utf8");
  }

  async function readAiSessions() {
    await ensureInitialized();
    const raw = await fs.readFile(aiSessionsFile, "utf8");
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  }

  async function writeAiSessions(aiSessions) {
    await ensureInitialized();
    await fs.writeFile(aiSessionsFile, `${JSON.stringify(aiSessions, null, 2)}\n`, "utf8");
  }

  async function readSavedVerses() {
    await ensureInitialized();
    const raw = await fs.readFile(savedVersesFile, "utf8");
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  }

  async function writeSavedVerses(savedVerses) {
    await ensureInitialized();
    await fs.writeFile(savedVersesFile, `${JSON.stringify(savedVerses, null, 2)}\n`, "utf8");
  }

  async function readStudyNotes() {
    await ensureInitialized();
    const raw = await fs.readFile(studyNotesFile, "utf8");
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  }

  async function writeStudyNotes(studyNotes) {
    await ensureInitialized();
    await fs.writeFile(studyNotesFile, `${JSON.stringify(studyNotes, null, 2)}\n`, "utf8");
  }

  async function saveEmailPreview({ prefix = "email", email, subject, html }) {
    await fs.mkdir(emailDir, { recursive: true });
    const safeEmail = email.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "") || "member";
    const safePrefix = String(prefix || "email").replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "") || "email";
    const fileName = `${safePrefix}-${Date.now()}-${safeEmail}.html`;
    const filePath = path.join(emailDir, fileName);

    await fs.writeFile(filePath, html, "utf8");

    return {
      fileName,
      filePath,
      subject
    };
  }

  return {
    ensureInitialized,
    readUsers,
    writeUsers,
    readPrayers,
    writePrayers,
    readCheckins,
    writeCheckins,
    readAiSessions,
    writeAiSessions,
    readSavedVerses,
    writeSavedVerses,
    readStudyNotes,
    writeStudyNotes,
    saveEmailPreview
  };
}

function createMailer({ env, storage }) {
  let transporterPromise = null;

  function validateSmtpConfig() {
    const smtpHost = String(env.SMTP_HOST || "").trim();

    if (isValidEmail(smtpHost)) {
      const domain = smtpHost.split("@")[1] || "";
      let suggestion = "Use your mail provider's SMTP hostname instead.";

      if (domain === "gmail.com" || domain === "googlemail.com") {
        suggestion = "For Gmail, set SMTP_HOST=smtp.gmail.com and use an app password for SMTP_PASS.";
      }

      throw new Error(`SMTP_HOST must be a mail server hostname, not an email address. ${suggestion}`);
    }
  }

  function buildSentMessage(user, phase) {
    return phase === "signup"
      ? `Account created. Welcome email sent to ${user.email}.`
      : `Welcome email sent to ${user.email}.`;
  }

  function buildPreviewMessage(preview, phase, reason) {
    const prefix = phase === "signup" ? "Account created. " : "";

    if (reason === "missing-config") {
      return `${prefix}SMTP is not configured yet, so a welcome email preview was saved in emails/${preview.fileName}.`;
    }

    return `${prefix}Email delivery failed, so a preview was saved in emails/${preview.fileName}.`;
  }

  async function getTransporter() {
    const hasSmtpConfig = Boolean(
      env.SMTP_HOST &&
      env.SMTP_PORT &&
      env.SMTP_USER &&
      env.SMTP_PASS
    );

    if (!hasSmtpConfig) {
      return null;
    }

    validateSmtpConfig();

    if (!transporterPromise) {
      const transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: Number(env.SMTP_PORT),
        secure: String(env.SMTP_SECURE).toLowerCase() === "true" || Number(env.SMTP_PORT) === 465,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS
        }
      });

      transporterPromise = transporter.verify()
        .then(() => transporter)
        .catch((error) => {
          transporterPromise = null;
          throw error;
        });
    }

    return transporterPromise;
  }

  async function deliverEmail({
    prefix,
    to,
    subject,
    html,
    text,
    onSentMessage,
    onMissingConfigMessage,
    onFailureMessage
  }) {
    const message = {
      from: env.EMAIL_FROM || env.SMTP_USER || "Selah <welcome@selah.local>",
      to,
      subject,
      html,
      text
    };

    try {
      const transporter = await getTransporter();

      if (!transporter) {
        const preview = await storage.saveEmailPreview({
          prefix,
          email: to,
          subject,
          html
        });

        return {
          mode: "preview",
          message: onMissingConfigMessage(preview),
          previewFile: preview.fileName
        };
      }

      const info = await transporter.sendMail(message);
      return {
        mode: "smtp",
        message: onSentMessage(),
        messageId: info.messageId || null
      };
    } catch (error) {
      const preview = await storage.saveEmailPreview({
        prefix,
        email: to,
        subject,
        html
      });

      return {
        mode: "preview",
        message: onFailureMessage(preview),
        error: error.message,
        previewFile: preview.fileName
      };
    }
  }

  async function sendWelcomeEmail(user, options = {}) {
    const phase = options.phase === "resend" ? "resend" : "signup";
    const subject = "Your Selah account is ready";
    const appUrl = String(options.appUrl || env.APP_BASE_URL || env.RENDER_EXTERNAL_URL || "").trim();
    const html = buildWelcomeEmailHtml(user.name, appUrl);
    const text = buildWelcomeEmailText(user.name, appUrl);
    return deliverEmail({
      prefix: "welcome",
      to: user.email,
      subject,
      html,
      text,
      onSentMessage: () => buildSentMessage(user, phase),
      onMissingConfigMessage: (preview) => buildPreviewMessage(preview, phase, "missing-config"),
      onFailureMessage: (preview) => buildPreviewMessage(preview, phase, "delivery-error")
    });
  }

  async function sendPasswordResetEmail(user, options = {}) {
    const subject = "Reset your Selah password";
    const html = buildPasswordResetEmailHtml(user.name, options.resetUrl);
    const text = buildPasswordResetEmailText(user.name, options.resetUrl);

    return deliverEmail({
      prefix: "password-reset",
      to: user.email,
      subject,
      html,
      text,
      onSentMessage: () => `Password reset email sent to ${user.email}.`,
      onMissingConfigMessage: (preview) => `SMTP is not configured yet, so a password reset preview was saved in emails/${preview.fileName}.`,
      onFailureMessage: (preview) => `Password reset delivery failed, so a preview was saved in emails/${preview.fileName}.`
    });
  }

  return {
    sendWelcomeEmail,
    sendPasswordResetEmail
  };
}

function createApp(options = {}) {
  const rootDir = options.rootDir || __dirname;
  const env = options.env || process.env;

  function resolveRuntimePath(value, fallback) {
    const raw = String(value || "").trim();

    if (!raw) {
      return fallback;
    }

    return path.isAbsolute(raw) ? raw : path.join(rootDir, raw);
  }

  const dataDir = options.dataDir || resolveRuntimePath(env.DATA_DIR, path.join(rootDir, "data"));
  const emailDir = options.emailDir || resolveRuntimePath(env.EMAIL_DIR, path.join(rootDir, "emails"));
  const usersFile = options.usersFile || path.join(dataDir, "users.json");
  const prayersFile = options.prayersFile || path.join(dataDir, "prayers.json");
  const checkinsFile = options.checkinsFile || path.join(dataDir, "checkins.json");
  const aiSessionsFile = options.aiSessionsFile || path.join(dataDir, "ai-sessions.json");
  const savedVersesFile = options.savedVersesFile || path.join(dataDir, "saved-verses.json");
  const studyNotesFile = options.studyNotesFile || path.join(dataDir, "study-notes.json");
  const port = Number(options.port || env.PORT || 3000);
  const host = options.host || env.HOST || "0.0.0.0";
  const sessionSecret = String(env.SESSION_SECRET || "").trim();

  const storage = createStorage({
    usersFile,
    emailDir,
    prayersFile,
    checkinsFile,
    aiSessionsFile,
    savedVersesFile,
    studyNotesFile
  });
  const mailer = createMailer({ env, storage });
  const app = express();

  if (String(env.NODE_ENV || "").toLowerCase() === "production" && !sessionSecret) {
    throw new Error("SESSION_SECRET is required in production.");
  }

  async function findSessionUser(request) {
    if (!request.session.userId) {
      return { user: null, users: null };
    }

    const users = await storage.readUsers();
    const user = users.find((entry) => entry.id === request.session.userId) || null;
    return { user, users };
  }

  function getBaseUrl(request) {
    return String(env.APP_BASE_URL || env.RENDER_EXTERNAL_URL || "").trim() || `${request.protocol}://${request.get("host")}`;
  }

  function getWorkspaceUrl(request) {
    return `${getBaseUrl(request).replace(/\/$/, "")}/app`;
  }

  function createPasswordResetRecord(token, emailStatus) {
    return {
      tokenHash: sha256(token),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
      lastSentAt: new Date().toISOString(),
      mode: emailStatus.mode,
      messageId: emailStatus.messageId || null,
      error: emailStatus.error || null,
      previewFile: emailStatus.previewFile || null
    };
  }

  async function getUserWorkspaceData(userId) {
    const [prayers, checkins, aiSessions, savedVerses, studyNotes] = await Promise.all([
      storage.readPrayers(),
      storage.readCheckins(),
      storage.readAiSessions(),
      storage.readSavedVerses(),
      storage.readStudyNotes()
    ]);

    return {
      prayers: prayers
        .filter((entry) => entry.userId === userId)
        .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt)),
      checkins: checkins
        .filter((entry) => entry.userId === userId)
        .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt)),
      aiSessions: aiSessions
        .filter((entry) => entry.userId === userId)
        .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
      ,
      savedVerses: savedVerses
        .filter((entry) => entry.userId === userId)
        .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt)),
      studyNotes: studyNotes
        .filter((entry) => entry.userId === userId)
        .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    };
  }

  function findUserByResetToken(users, token) {
    const tokenHash = sha256(token);
    const now = Date.now();

    return users.find((entry) => {
      if (!entry.passwordReset?.tokenHash || !entry.passwordReset?.expiresAt) {
        return false;
      }

      if (entry.passwordReset.tokenHash !== tokenHash) {
        return false;
      }

      return new Date(entry.passwordReset.expiresAt).getTime() > now;
    }) || null;
  }

  app.set("trust proxy", 1);
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.get("/healthz", (request, response) => {
    response.status(200).json({
      ok: true,
      service: "selah",
      timestamp: new Date().toISOString()
    });
  });
  app.use(session({
    name: "selah.sid",
    secret: sessionSecret || "replace-this-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: String(env.NODE_ENV || "").toLowerCase() === "production" ? "auto" : false,
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  }));

  app.get("/", async (request, response, next) => {
    try {
      const { user } = await findSessionUser(request);

      if (user) {
        response.redirect("/app");
        return;
      }

      response.sendFile(path.join(rootDir, "index.html"));
    } catch (error) {
      next(error);
    }
  });

  app.get("/app", async (request, response, next) => {
    try {
      const { user } = await findSessionUser(request);

      if (!user) {
        response.redirect("/?auth=login");
        return;
      }

      response.sendFile(path.join(rootDir, "dashboard.html"));
    } catch (error) {
      next(error);
    }
  });

  app.get("/reset-password", (request, response) => {
    response.sendFile(path.join(rootDir, "reset-password.html"));
  });

  app.get("/styles.css", (request, response) => {
    response.sendFile(path.join(rootDir, "styles.css"));
  });

  app.get("/script.js", (request, response) => {
    response.sendFile(path.join(rootDir, "script.js"));
  });

  app.get("/dashboard.js", (request, response) => {
    response.sendFile(path.join(rootDir, "dashboard.js"));
  });

  app.get("/reset-password.js", (request, response) => {
    response.sendFile(path.join(rootDir, "reset-password.js"));
  });

  app.get("/api/session", async (request, response, next) => {
    try {
      const { user } = await findSessionUser(request);
      const users = await storage.readUsers();

      if (!user) {
        response.json({
          authenticated: false,
          hasUsers: users.length > 0
        });
        return;
      }

      response.json({
        authenticated: true,
        user: publicUser(user)
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/bible/bootstrap", async (request, response, next) => {
    try {
      const { user } = await findSessionUser(request);

      if (!user) {
        response.status(401).json({ message: "Please log in to open your Bible workspace." });
        return;
      }

      response.json({
        verseOfDay: getVerseOfDay(),
        translations: getTranslations(),
        books: getBooks(),
        topics: getTopicCollections(),
        plans: getReadingPlans(),
        generator: getGeneratorPresets(),
        readingPosition: {
          ...DEFAULT_USER_SETTINGS.readingPosition,
          ...(user.settings?.readingPosition || {})
        }
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/bible/chapter", async (request, response, next) => {
    try {
      const { user } = await findSessionUser(request);

      if (!user) {
        response.status(401).json({ message: "Please log in to read scripture." });
        return;
      }

      const translationId = normalizeTranslationId(request.query.translationId);
      const bookId = normalizeBookId(request.query.bookId);
      const bookMeta = getBookById(bookId);
      const chapter = Math.min(
        normalizeChapter(request.query.chapter, 1),
        bookMeta?.numberOfChapters || 1
      );

      response.json({
        chapter: await getChapter({
          env,
          translationId,
          bookId,
          chapterNumber: chapter
        })
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/bible/generate", async (request, response, next) => {
    try {
      const { user } = await findSessionUser(request);

      if (!user) {
        response.status(401).json({ message: "Please log in to generate a verse." });
        return;
      }

      const rawMode = String(request.body.mode || "random").trim().toLowerCase();
      const bookId = request.body.bookId ? normalizeBookId(request.body.bookId) : "";
      const chapter = request.body.chapter ? normalizeChapter(request.body.chapter, 1) : null;
      const testament = String(request.body.testament || "all").trim().toLowerCase();
      const topic = String(request.body.topic || "").trim();
      const offset = Math.max(0, Number(request.body.offset || 0));

      const result = generateVerse({
        mode: rawMode,
        topic,
        testament,
        bookId,
        chapter,
        offset
      });

      response.json({
        message: "Verse generated.",
        result
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/bible/reading-position", async (request, response, next) => {
    try {
      const { user, users } = await findSessionUser(request);

      if (!user || !users) {
        response.status(401).json({ message: "Please log in to save your reading position." });
        return;
      }

      const translationId = normalizeTranslationId(request.body.translationId);
      const bookId = normalizeBookId(request.body.bookId);
      const bookMeta = getBookById(bookId);
      const chapter = Math.min(
        normalizeChapter(request.body.chapter, 1),
        bookMeta?.numberOfChapters || 1
      );

      user.settings = {
        ...user.settings,
        readingPosition: {
          translationId,
          bookId,
          chapter
        }
      };
      await storage.writeUsers(users);

      response.json({
        message: "Reading position saved.",
        readingPosition: user.settings.readingPosition,
        user: publicUser(user)
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/library/verses", async (request, response, next) => {
    try {
      const { user } = await findSessionUser(request);

      if (!user) {
        response.status(401).json({ message: "Please log in to view your saved verses." });
        return;
      }

      const savedVerses = await storage.readSavedVerses();
      const userSavedVerses = savedVerses
        .filter((entry) => entry.userId === user.id)
        .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
        .map(publicSavedVerse);

      response.json({ savedVerses: userSavedVerses });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/library/verses", async (request, response, next) => {
    try {
      const { user } = await findSessionUser(request);

      if (!user) {
        response.status(401).json({ message: "Please log in to save a verse." });
        return;
      }

      const reference = normalizeAccountLine(request.body.reference);
      const text = normalizeAccountBio(request.body.text);
      const translationId = normalizeTranslationId(request.body.translationId);
      const bookId = normalizeBookId(request.body.bookId);
      const chapter = normalizeChapter(request.body.chapter, 1);
      const verse = normalizeChapter(request.body.verse, 1);

      if (!reference || !text) {
        response.status(400).json({ message: "A saved verse needs both a reference and verse text." });
        return;
      }

      const savedVerses = await storage.readSavedVerses();
      const existing = savedVerses.find((entry) => (
        entry.userId === user.id &&
        entry.reference === reference &&
        entry.translationId === translationId
      ));

      if (existing) {
        response.json({
          message: "That verse is already in your library.",
          savedVerse: publicSavedVerse(existing)
        });
        return;
      }

      const savedVerse = {
        id: crypto.randomUUID(),
        userId: user.id,
        reference,
        translationId,
        bookId,
        chapter,
        verse,
        text,
        createdAt: new Date().toISOString()
      };

      savedVerses.push(savedVerse);
      await storage.writeSavedVerses(savedVerses);

      response.status(201).json({
        message: "Verse saved to your library.",
        savedVerse: publicSavedVerse(savedVerse)
      });
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/library/verses/:savedVerseId", async (request, response, next) => {
    try {
      const { user } = await findSessionUser(request);

      if (!user) {
        response.status(401).json({ message: "Please log in to update your library." });
        return;
      }

      const savedVerses = await storage.readSavedVerses();
      const index = savedVerses.findIndex((entry) => (
        entry.id === request.params.savedVerseId &&
        entry.userId === user.id
      ));

      if (index === -1) {
        response.status(404).json({ message: "Saved verse not found." });
        return;
      }

      savedVerses.splice(index, 1);
      await storage.writeSavedVerses(savedVerses);

      response.json({ message: "Saved verse removed." });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/study-notes", async (request, response, next) => {
    try {
      const { user } = await findSessionUser(request);

      if (!user) {
        response.status(401).json({ message: "Please log in to view your study notes." });
        return;
      }

      const studyNotes = await storage.readStudyNotes();
      const userNotes = studyNotes
        .filter((entry) => entry.userId === user.id)
        .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
        .map(publicStudyNote);

      response.json({ notes: userNotes });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/study-notes", async (request, response, next) => {
    try {
      const { user } = await findSessionUser(request);

      if (!user) {
        response.status(401).json({ message: "Please log in to save a study note." });
        return;
      }

      const title = normalizeStudyNoteTitle(request.body.title);
      const body = normalizeAccountBio(request.body.body);
      const reference = normalizeAccountLine(request.body.reference);
      const verseText = normalizeAccountBio(request.body.verseText);
      const translationId = request.body.translationId
        ? normalizeTranslationId(request.body.translationId)
        : null;
      const bookId = request.body.bookId
        ? normalizeBookId(request.body.bookId)
        : null;
      const chapter = request.body.chapter
        ? normalizeChapter(request.body.chapter, 1)
        : null;
      const verse = request.body.verse
        ? normalizeChapter(request.body.verse, 1)
        : null;

      if (title.length < 2) {
        response.status(400).json({ message: "Give your study note a short title." });
        return;
      }

      if (body.length < 10) {
        response.status(400).json({ message: "Write a little more so your study note is useful later." });
        return;
      }

      if (body.length > 1600) {
        response.status(400).json({ message: "Keep study notes under 1600 characters." });
        return;
      }

      const studyNotes = await storage.readStudyNotes();
      const note = {
        id: crypto.randomUUID(),
        userId: user.id,
        title,
        body,
        reference,
        verseText,
        translationId,
        bookId,
        chapter,
        verse,
        createdAt: new Date().toISOString()
      };

      studyNotes.push(note);
      await storage.writeStudyNotes(studyNotes);

      response.status(201).json({
        message: "Study note saved.",
        note: publicStudyNote(note)
      });
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/study-notes/:noteId", async (request, response, next) => {
    try {
      const { user } = await findSessionUser(request);

      if (!user) {
        response.status(401).json({ message: "Please log in to update your study notes." });
        return;
      }

      const studyNotes = await storage.readStudyNotes();
      const index = studyNotes.findIndex((entry) => (
        entry.id === request.params.noteId &&
        entry.userId === user.id
      ));

      if (index === -1) {
        response.status(404).json({ message: "Study note not found." });
        return;
      }

      studyNotes.splice(index, 1);
      await storage.writeStudyNotes(studyNotes);

      response.json({ message: "Study note removed." });
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/account/profile", async (request, response, next) => {
    try {
      const { user, users } = await findSessionUser(request);

      if (!user || !users) {
        response.status(401).json({ message: "Please log in to update your profile." });
        return;
      }

      const name = normalizeName(request.body.name);
      const focus = normalizeAccountLine(request.body.focus);
      const currentSeason = normalizeAccountLine(request.body.currentSeason);
      const bio = normalizeAccountBio(request.body.bio);

      if (name.length < 2) {
        response.status(400).json({ message: "Please enter a name with at least 2 characters." });
        return;
      }

      if (focus && focus.length > 80) {
        response.status(400).json({ message: "Keep your spiritual focus under 80 characters." });
        return;
      }

      if (currentSeason.length > 80) {
        response.status(400).json({ message: "Keep your current season under 80 characters." });
        return;
      }

      if (bio.length > 280) {
        response.status(400).json({ message: "Keep your bio under 280 characters." });
        return;
      }

      user.name = name;
      user.profile = {
        ...user.profile,
        focus: focus || DEFAULT_SPIRITUAL_PROFILE.focus,
        currentSeason,
        bio
      };
      await storage.writeUsers(users);

      response.json({
        message: "Profile updated.",
        user: publicUser(user)
      });
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/account/settings", async (request, response, next) => {
    try {
      const { user, users } = await findSessionUser(request);

      if (!user || !users) {
        response.status(401).json({ message: "Please log in to update your settings." });
        return;
      }

      const currentSettings = hydrateUserRecord(user).settings;
      const preferredTranslationId = normalizeTranslationId(
        request.body.preferredTranslationId || currentSettings.preferredTranslationId || currentSettings.readingPosition.translationId
      );

      user.settings = {
        ...currentSettings,
        defaultAiMode: normalizeAiMode(request.body.defaultAiMode || currentSettings.defaultAiMode),
        aiVoice: normalizeAiVoice(request.body.aiVoice || currentSettings.aiVoice),
        reminderTime: normalizeReminderTime(request.body.reminderTime || currentSettings.reminderTime),
        weeklyDigest: normalizeBoolean(request.body.weeklyDigest, currentSettings.weeklyDigest),
        experimentalLayout: normalizeBoolean(request.body.experimentalLayout, currentSettings.experimentalLayout),
        startTab: normalizeWorkspaceTab(request.body.startTab || currentSettings.startTab),
        preferredTranslationId,
        defaultGeneratorMode: normalizeGeneratorModePreference(
          request.body.defaultGeneratorMode || currentSettings.defaultGeneratorMode
        ),
        showVerseReason: normalizeBoolean(request.body.showVerseReason, currentSettings.showVerseReason),
        compactBookCards: normalizeBoolean(request.body.compactBookCards, currentSettings.compactBookCards),
        readingPosition: {
          ...currentSettings.readingPosition,
          translationId: preferredTranslationId
        }
      };
      await storage.writeUsers(users);

      response.json({
        message: "Account settings updated.",
        user: publicUser(user)
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/account/password", async (request, response, next) => {
    try {
      const { user, users } = await findSessionUser(request);

      if (!user || !users) {
        response.status(401).json({ message: "Please log in to change your password." });
        return;
      }

      const currentPassword = String(request.body.currentPassword || "");
      const newPassword = String(request.body.newPassword || "");

      if (newPassword.length < 8) {
        response.status(400).json({ message: "Use a password with at least 8 characters." });
        return;
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);

      if (!isPasswordValid) {
        response.status(401).json({ message: "Your current password is incorrect." });
        return;
      }

      user.passwordHash = await bcrypt.hash(newPassword, 12);
      await storage.writeUsers(users);

      response.json({ message: "Password updated." });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/signup", async (request, response, next) => {
    try {
      const name = normalizeName(request.body.name);
      const email = normalizeEmail(request.body.email);
      const password = String(request.body.password || "");

      if (name.length < 2) {
        response.status(400).json({ message: "Please enter a name with at least 2 characters." });
        return;
      }

      if (!isValidEmail(email)) {
        response.status(400).json({ message: "Please enter a valid email address." });
        return;
      }

      if (password.length < 8) {
        response.status(400).json({ message: "Use a password with at least 8 characters." });
        return;
      }

      const users = await storage.readUsers();
      const existingUser = users.find((entry) => entry.email === email);

      if (existingUser) {
        response.status(409).json({ message: "An account with that email already exists." });
        return;
      }

      const user = {
        id: crypto.randomUUID(),
        name,
        email,
        passwordHash: await bcrypt.hash(password, 12),
        createdAt: new Date().toISOString(),
        welcomeEmail: null,
        passwordReset: null
      };

      users.push(user);
      await storage.writeUsers(users);

      await sessionRegenerate(request);
      request.session.userId = user.id;

      const emailStatus = await mailer.sendWelcomeEmail(user, {
        phase: "signup",
        appUrl: getWorkspaceUrl(request)
      });
      user.welcomeEmail = buildWelcomeEmailRecord(emailStatus);
      await storage.writeUsers(users);

      response.status(201).json({
        message: "Your account is ready.",
        user: publicUser(user),
        emailStatus,
        redirectTo: "/app"
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", async (request, response, next) => {
    try {
      const email = normalizeEmail(request.body.email);
      const password = String(request.body.password || "");
      const users = await storage.readUsers();
      const user = users.find((entry) => entry.email === email);

      if (!user) {
        response.status(401).json({
          message: "Invalid email or password.",
          hasUsers: users.length > 0
        });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        response.status(401).json({
          message: "Invalid email or password.",
          hasUsers: users.length > 0
        });
        return;
      }

      await sessionRegenerate(request);
      request.session.userId = user.id;

      response.json({
        message: `Welcome back, ${user.name}.`,
        user: publicUser(user),
        redirectTo: "/app"
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/prayers", async (request, response, next) => {
    try {
      const { user } = await findSessionUser(request);

      if (!user) {
        response.status(401).json({ message: "Please log in to view your prayer journal." });
        return;
      }

      const prayers = await storage.readPrayers();
      const userPrayers = prayers
        .filter((entry) => entry.userId === user.id)
        .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
        .map(publicPrayer);

      response.json({
        prayers: userPrayers
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/prayers", async (request, response, next) => {
    try {
      const { user } = await findSessionUser(request);

      if (!user) {
        response.status(401).json({ message: "Please log in to add a prayer." });
        return;
      }

      const title = normalizePrayerTitle(request.body.title);
      const body = normalizePrayerBody(request.body.body);
      const category = normalizePrayerCategory(request.body.category);

      if (title.length < 2) {
        response.status(400).json({ message: "Give this prayer a short title." });
        return;
      }

      if (title.length > 80) {
        response.status(400).json({ message: "Keep the prayer title under 80 characters." });
        return;
      }

      if (body.length < 10) {
        response.status(400).json({ message: "Write at least 10 characters for your prayer entry." });
        return;
      }

      if (body.length > 1500) {
        response.status(400).json({ message: "Keep prayer entries under 1500 characters." });
        return;
      }

      const prayers = await storage.readPrayers();
      const prayer = {
        id: crypto.randomUUID(),
        userId: user.id,
        title,
        body,
        category,
        createdAt: new Date().toISOString(),
        answeredAt: null,
        answeredNote: null
      };

      prayers.push(prayer);
      await storage.writePrayers(prayers);

      response.status(201).json({
        message: "Prayer saved.",
        prayer: publicPrayer(prayer)
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/prayers/:prayerId/answer", async (request, response, next) => {
    try {
      const { user } = await findSessionUser(request);

      if (!user) {
        response.status(401).json({ message: "Please log in to update your prayer journal." });
        return;
      }

      const answeredNote = normalizePrayerBody(request.body.answeredNote);

      if (answeredNote.length < 4) {
        response.status(400).json({ message: "Add a short note about how this prayer was answered." });
        return;
      }

      if (answeredNote.length > 500) {
        response.status(400).json({ message: "Keep answered notes under 500 characters." });
        return;
      }

      const prayers = await storage.readPrayers();
      const prayer = prayers.find((entry) => entry.id === request.params.prayerId && entry.userId === user.id);

      if (!prayer) {
        response.status(404).json({ message: "Prayer entry not found." });
        return;
      }

      prayer.answeredAt = new Date().toISOString();
      prayer.answeredNote = answeredNote;
      await storage.writePrayers(prayers);

      response.json({
        message: "Prayer marked as answered.",
        prayer: publicPrayer(prayer)
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/checkins", async (request, response, next) => {
    try {
      const { user } = await findSessionUser(request);

      if (!user) {
        response.status(401).json({ message: "Please log in to view your daily pulse." });
        return;
      }

      const checkins = await storage.readCheckins();
      const userCheckins = checkins
        .filter((entry) => entry.userId === user.id)
        .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
        .map(publicCheckin);

      response.json({ checkins: userCheckins });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/checkins", async (request, response, next) => {
    try {
      const { user } = await findSessionUser(request);

      if (!user) {
        response.status(401).json({ message: "Please log in to save your daily pulse." });
        return;
      }

      const mood = normalizeCheckinMood(request.body.mood);
      const energy = normalizeEnergy(request.body.energy);
      const gratitude = normalizeAccountBio(request.body.gratitude);
      const challenge = normalizeAccountBio(request.body.challenge);

      if (gratitude.length < 4) {
        response.status(400).json({ message: "Add a short gratitude note so this check-in means something later." });
        return;
      }

      if (gratitude.length > 220) {
        response.status(400).json({ message: "Keep gratitude notes under 220 characters." });
        return;
      }

      if (challenge.length < 4) {
        response.status(400).json({ message: "Add a short challenge note for your daily pulse." });
        return;
      }

      if (challenge.length > 220) {
        response.status(400).json({ message: "Keep challenge notes under 220 characters." });
        return;
      }

      const checkins = await storage.readCheckins();
      const checkin = {
        id: crypto.randomUUID(),
        userId: user.id,
        mood,
        energy,
        gratitude,
        challenge,
        createdAt: new Date().toISOString()
      };

      checkins.push(checkin);
      await storage.writeCheckins(checkins);

      response.status(201).json({
        message: "Daily pulse saved.",
        checkin: publicCheckin(checkin)
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/ai/sessions", async (request, response, next) => {
    try {
      const { user } = await findSessionUser(request);

      if (!user) {
        response.status(401).json({ message: "Please log in to view your AI session history." });
        return;
      }

      const aiSessions = await storage.readAiSessions();
      const userSessions = aiSessions
        .filter((entry) => entry.userId === user.id)
        .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
        .slice(0, 8)
        .map(publicAiSession);

      response.json({ sessions: userSessions });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/password/forgot", async (request, response, next) => {
    try {
      const email = normalizeEmail(request.body.email);
      const genericMessage = "If that email exists, a password reset link has been sent.";

      if (!isValidEmail(email)) {
        response.json({ message: genericMessage });
        return;
      }

      const users = await storage.readUsers();
      const user = users.find((entry) => entry.email === email);

      if (!user) {
        response.json({ message: genericMessage });
        return;
      }

      const token = crypto.randomBytes(32).toString("hex");
      const resetUrl = new URL("/reset-password", getBaseUrl(request));
      resetUrl.searchParams.set("token", token);

      const emailStatus = await mailer.sendPasswordResetEmail(user, {
        resetUrl: resetUrl.toString()
      });

      user.passwordReset = createPasswordResetRecord(token, emailStatus);
      await storage.writeUsers(users);

      response.json({ message: genericMessage });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/password/reset/validate", async (request, response, next) => {
    try {
      const token = String(request.query.token || "").trim();

      if (!token) {
        response.status(400).json({ message: "This reset link is invalid or expired." });
        return;
      }

      const users = await storage.readUsers();
      const user = findUserByResetToken(users, token);

      if (!user) {
        response.status(400).json({ message: "This reset link is invalid or expired." });
        return;
      }

      response.json({
        valid: true,
        email: maskEmail(user.email),
        expiresAt: user.passwordReset.expiresAt
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/password/reset", async (request, response, next) => {
    try {
      const token = String(request.body.token || "").trim();
      const password = String(request.body.password || "");

      if (!token) {
        response.status(400).json({ message: "This reset link is invalid or expired." });
        return;
      }

      if (password.length < 8) {
        response.status(400).json({ message: "Use a password with at least 8 characters." });
        return;
      }

      const users = await storage.readUsers();
      const user = findUserByResetToken(users, token);

      if (!user) {
        response.status(400).json({ message: "This reset link is invalid or expired." });
        return;
      }

      user.passwordHash = await bcrypt.hash(password, 12);
      user.passwordReset = null;
      await storage.writeUsers(users);

      await sessionRegenerate(request);
      request.session.userId = user.id;

      response.json({
        message: "Password updated. Opening your prayer journal...",
        user: publicUser(user),
        redirectTo: "/app"
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/welcome-email/resend", async (request, response, next) => {
    try {
      if (!request.session.userId) {
        response.status(401).json({ message: "Please log in to resend your welcome email." });
        return;
      }

      const users = await storage.readUsers();
      const user = users.find((entry) => entry.id === request.session.userId);

      if (!user) {
        response.status(401).json({ message: "Your session is no longer valid. Please log in again." });
        return;
      }

      const emailStatus = await mailer.sendWelcomeEmail(user, {
        phase: "resend",
        appUrl: getWorkspaceUrl(request)
      });
      user.welcomeEmail = buildWelcomeEmailRecord(emailStatus);
      await storage.writeUsers(users);

      response.json({
        message: emailStatus.message,
        user: publicUser(user),
        emailStatus
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/ai/briefing", async (request, response, next) => {
    try {
      const { user } = await findSessionUser(request);

      if (!user) {
        response.status(401).json({ message: "Please log in to view your AI briefing." });
        return;
      }

      const workspace = await getUserWorkspaceData(user.id);

      response.json({
        message: "Briefing ready.",
        briefing: await buildAiBriefingResponse({
          env,
          user,
          prayers: workspace.prayers,
          checkins: workspace.checkins
        })
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/ai/snapshot", async (request, response, next) => {
    try {
      const { user } = await findSessionUser(request);

      if (!user) {
        response.status(401).json({ message: "Please log in to view your AI workspace." });
        return;
      }

      const workspace = await getUserWorkspaceData(user.id);

      response.json({
        message: "Snapshot ready.",
        snapshot: await buildAiSnapshotResponse({
          env,
          user,
          prayers: workspace.prayers,
          checkins: workspace.checkins
        })
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/ai/studio", async (request, response, next) => {
    try {
      const { user } = await findSessionUser(request);

      if (!user) {
        response.status(401).json({ message: "Please log in to use the AI studio." });
        return;
      }

      const prompt = normalizeReflectionPrompt(request.body.prompt);
      const mode = normalizeAiMode(request.body.mode);

      if (prompt.length < 12) {
        response.status(400).json({ message: "Write a little more so Selah AI has something real to work with." });
        return;
      }

      if (prompt.length > 1000) {
        response.status(400).json({ message: "Keep your AI studio prompt under 1000 characters." });
        return;
      }

      const workspace = await getUserWorkspaceData(user.id);
      const result = await buildAiStudioResponse({
        env,
        user,
        prayers: workspace.prayers,
        checkins: workspace.checkins,
        prompt,
        mode
      });
      const aiSessions = await storage.readAiSessions();
      const sessionEntry = {
        id: crypto.randomUUID(),
        userId: user.id,
        mode: result.mode,
        prompt,
        promptPreview: prompt.split(/\s+/).slice(0, 18).join(" "),
        title: result.title,
        summary: result.summary,
        responsePreview: result.response.split(/\s+/).slice(0, 28).join(" "),
        scripture: result.scripture,
        source: result.source,
        createdAt: new Date().toISOString()
      };

      aiSessions.push(sessionEntry);
      await storage.writeAiSessions(aiSessions);

      response.json({
        message: "AI studio response ready.",
        result,
        session: publicAiSession(sessionEntry)
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/reflection", async (request, response, next) => {
    try {
      const { user } = await findSessionUser(request);

      if (!user) {
        response.status(401).json({ message: "Please log in to use the reflection studio." });
        return;
      }

      const prompt = normalizeReflectionPrompt(request.body.prompt);

      if (prompt.length < 12) {
        response.status(400).json({ message: "Write a little more so Selah can shape a meaningful reflection." });
        return;
      }

      if (prompt.length > 600) {
        response.status(400).json({ message: "Keep your reflection request under 600 characters." });
        return;
      }

      const workspace = await getUserWorkspaceData(user.id);

      response.json({
        message: "Reflection ready.",
        reflection: await buildAiStudioResponse({
          env,
          user,
          prayers: workspace.prayers,
          checkins: workspace.checkins,
          prompt,
          mode: "companion"
        })
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/logout", async (request, response, next) => {
    try {
      if (!request.session.userId) {
        response.json({ message: "You are already signed out." });
        return;
      }

      await sessionDestroy(request);
      response.clearCookie("selah.sid");
      response.json({ message: "You have been signed out." });
    } catch (error) {
      next(error);
    }
  });

  app.use("/api", (request, response) => {
    response.status(404).json({ message: "API route not found." });
  });

  app.use((error, request, response, next) => {
    console.error(error);
    response.status(500).json({ message: "Something went wrong on the server." });
  });

  return {
    app,
    host,
    port,
    storage
  };
}

async function start() {
  const { app, host, port, storage } = createApp();
  await storage.ensureInitialized();

  app.listen(port, host, () => {
    const publicUrl = String(process.env.APP_BASE_URL || process.env.RENDER_EXTERNAL_URL || "").trim();
    console.log(`Selah is running on ${host}:${port}${publicUrl ? ` (${publicUrl})` : ""}`);
  });
}

if (require.main === module) {
  start().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = {
  createApp
};
