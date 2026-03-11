const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");

const { createApp } = require("./server");

function getCookie(response) {
  const cookies = typeof response.headers.getSetCookie === "function"
    ? response.headers.getSetCookie()
    : [response.headers.get("set-cookie")].filter(Boolean);

  return cookies.map((value) => value.split(";")[0]).join("; ");
}

async function withServer(options, callback) {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "selah-smoke-"));
  const dataDir = path.join(tempRoot, "data");
  const emailDir = path.join(tempRoot, "emails");
  const { app, storage } = createApp({
    rootDir: __dirname,
    dataDir,
    emailDir,
    transportFactory: options?.transportFactory,
    env: {
      PORT: "0",
      SESSION_SECRET: "test-secret",
      ...(options?.env || {})
    }
  });

  await storage.ensureInitialized();

  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));

  try {
    const address = server.address();
    const baseUrl = `http://127.0.0.1:${address.port}`;
    await callback({ baseUrl, dataDir, emailDir });
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });

    await fs.rm(tempRoot, { recursive: true, force: true });
  }
}

async function main() {
  await withServer({}, async ({ baseUrl, dataDir, emailDir }) => {
    const healthResponse = await fetch(`${baseUrl}/healthz`);
    assert.equal(healthResponse.status, 200);
    const healthData = await healthResponse.json();
    assert.equal(healthData.ok, true);

    const homeResponse = await fetch(baseUrl);
    assert.equal(homeResponse.status, 200);
    const homeHtml = await homeResponse.text();
    assert.ok(homeHtml.includes("Create your Selah account"));
    assert.ok(homeHtml.includes("auth-modal"));
    assert.ok(homeHtml.includes("Forgot your password?"));
    assert.ok(homeHtml.includes("Need an account on this site? Create one"));
    assert.ok(homeHtml.includes('href="/login"'));
    assert.ok(homeHtml.includes('href="/signup"'));
    assert.ok(homeHtml.includes("This flow creates a new Selah account for this live site."));

    const stylesResponse = await fetch(`${baseUrl}/styles.css`);
    assert.equal(stylesResponse.status, 200);
    const stylesCss = await stylesResponse.text();
    assert.ok(stylesCss.includes("[hidden]"));

    const appRedirectResponse = await fetch(`${baseUrl}/app`, {
      redirect: "manual"
    });
    assert.equal(appRedirectResponse.status, 302);
    assert.equal(appRedirectResponse.headers.get("location"), "/?auth=login");

    const loginRouteResponse = await fetch(`${baseUrl}/login`, {
      redirect: "manual"
    });
    assert.equal(loginRouteResponse.status, 302);
    assert.equal(loginRouteResponse.headers.get("location"), "/?auth=login");

    const signupRouteResponse = await fetch(`${baseUrl}/signup`, {
      redirect: "manual"
    });
    assert.equal(signupRouteResponse.status, 302);
    assert.equal(signupRouteResponse.headers.get("location"), "/?auth=signup");

    await fs.writeFile(path.join(dataDir, "users.json"), "{not-valid-json", "utf8");

    const guestSessionResponse = await fetch(`${baseUrl}/api/session`);
    assert.equal(guestSessionResponse.status, 200);
    const guestSessionData = await guestSessionResponse.json();
    assert.equal(guestSessionData.authenticated, false);
    assert.equal(guestSessionData.hasUsers, false);

    const failedLoginBeforeSignupResponse = await fetch(`${baseUrl}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: "esther@example.com",
        password: "strongpass123"
      })
    });
    assert.equal(failedLoginBeforeSignupResponse.status, 401);
    const failedLoginBeforeSignupData = await failedLoginBeforeSignupResponse.json();
    assert.equal(failedLoginBeforeSignupData.hasUsers, false);

    const signupResponse = await fetch(`${baseUrl}/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: "Esther",
        email: "esther@example.com",
        password: "strongpass123"
      })
    });

    assert.equal(signupResponse.status, 201);
    const signupData = await signupResponse.json();
    assert.equal(signupData.user.email, "esther@example.com");
    assert.equal(signupData.emailStatus.mode, "preview");
    assert.equal(signupData.redirectTo, "/app");

    const previewFiles = await fs.readdir(emailDir);
    assert.equal(previewFiles.length, 1);
    const welcomePreviewHtml = await fs.readFile(path.join(emailDir, previewFiles[0]), "utf8");
    assert.ok(welcomePreviewHtml.includes("Your account is ready."));
    assert.ok(welcomePreviewHtml.includes("Open Selah"));
    assert.ok(welcomePreviewHtml.includes("Browse by book, chapter, and translation."));
    assert.ok(welcomePreviewHtml.includes("/app"));

    const cookie = getCookie(signupResponse);
    assert.ok(cookie.includes("selah.sid="));

    const authedHomeResponse = await fetch(baseUrl, {
      headers: {
        Cookie: cookie
      },
      redirect: "manual"
    });

    assert.equal(authedHomeResponse.status, 302);
    assert.equal(authedHomeResponse.headers.get("location"), "/app");

    const appResponse = await fetch(`${baseUrl}/app`, {
      headers: {
        Cookie: cookie
      }
    });

    assert.equal(appResponse.status, 200);
    const appHtml = await appResponse.text();
    assert.ok(appHtml.includes("Bible Browser"));
    assert.ok(appHtml.includes("Verse Generator"));
    assert.ok(appHtml.includes("Continue Reading"));
    assert.ok(appHtml.includes("Generate Verse"));
    assert.ok(appHtml.includes("Your verse library"));
    assert.ok(appHtml.includes("Your account"));
    assert.ok(appHtml.includes("workspace-tab-button"));
    assert.ok(appHtml.includes("Workspace settings"));

    const sessionResponse = await fetch(`${baseUrl}/api/session`, {
      headers: {
        Cookie: cookie
      }
    });

    assert.equal(sessionResponse.status, 200);
    const sessionData = await sessionResponse.json();
    assert.equal(sessionData.authenticated, true);
    assert.equal(sessionData.user.name, "Esther");
    assert.equal(sessionData.user.profile.focus, "Presence over performance");
    assert.equal(sessionData.user.settings.defaultAiMode, "companion");
    assert.equal(sessionData.user.settings.startTab, "browser");
    assert.equal(sessionData.user.settings.preferredTranslationId, "BSB");
    assert.equal(sessionData.user.settings.defaultGeneratorMode, "random");

    const prayersResponse = await fetch(`${baseUrl}/api/prayers`, {
      headers: {
        Cookie: cookie
      }
    });

    assert.equal(prayersResponse.status, 200);
    const prayersData = await prayersResponse.json();
    assert.equal(prayersData.prayers.length, 0);

    const bibleBootstrapResponse = await fetch(`${baseUrl}/api/bible/bootstrap`, {
      headers: {
        Cookie: cookie
      }
    });

    assert.equal(bibleBootstrapResponse.status, 200);
    const bibleBootstrapData = await bibleBootstrapResponse.json();
    assert.equal(bibleBootstrapData.translations.length >= 3, true);
    assert.equal(bibleBootstrapData.books.length, 66);
    assert.equal(bibleBootstrapData.readingPosition.bookId, "JHN");
    assert.equal(bibleBootstrapData.topics.length >= 3, true);
    assert.equal(bibleBootstrapData.plans.length >= 3, true);
    assert.equal(Array.isArray(bibleBootstrapData.generator.modes), true);
    assert.equal(bibleBootstrapData.generator.modes.length >= 4, true);

    const generatedVerseResponse = await fetch(`${baseUrl}/api/bible/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie
      },
      body: JSON.stringify({
        mode: "topic",
        topic: "peace",
        offset: 0
      })
    });

    assert.equal(generatedVerseResponse.status, 200);
    const generatedVerseData = await generatedVerseResponse.json();
    assert.equal(generatedVerseData.result.mode, "topic");
    assert.ok(generatedVerseData.result.reference);
    assert.ok(generatedVerseData.result.text);

    const chapterResponse = await fetch(`${baseUrl}/api/bible/chapter?translationId=BSB&bookId=JHN&chapter=1`, {
      headers: {
        Cookie: cookie
      }
    });

    assert.equal(chapterResponse.status, 200);
    const chapterData = await chapterResponse.json();
    assert.equal(chapterData.chapter.book.id, "JHN");
    assert.equal(chapterData.chapter.chapter.number, 1);
    assert.equal(chapterData.chapter.chapter.verses.length > 0, true);

    const readingPositionResponse = await fetch(`${baseUrl}/api/bible/reading-position`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie
      },
      body: JSON.stringify({
        translationId: "BSB",
        bookId: "PSA",
        chapter: 23
      })
    });

    assert.equal(readingPositionResponse.status, 200);
    const readingPositionData = await readingPositionResponse.json();
    assert.equal(readingPositionData.readingPosition.bookId, "PSA");
    assert.equal(readingPositionData.user.settings.readingPosition.chapter, 23);

    const checkinsResponse = await fetch(`${baseUrl}/api/checkins`, {
      headers: {
        Cookie: cookie
      }
    });

    assert.equal(checkinsResponse.status, 200);
    const checkinsData = await checkinsResponse.json();
    assert.equal(checkinsData.checkins.length, 0);

    const aiSessionsResponse = await fetch(`${baseUrl}/api/ai/sessions`, {
      headers: {
        Cookie: cookie
      }
    });

    assert.equal(aiSessionsResponse.status, 200);
    const aiSessionsData = await aiSessionsResponse.json();
    assert.equal(aiSessionsData.sessions.length, 0);

    const briefingResponse = await fetch(`${baseUrl}/api/ai/briefing`, {
      headers: {
        Cookie: cookie
      }
    });

    assert.equal(briefingResponse.status, 200);
    const briefingData = await briefingResponse.json();
    assert.equal(briefingData.briefing.source, "selah-local-ai");
    assert.equal(briefingData.briefing.ritualSteps.length, 3);

    const profileUpdateResponse = await fetch(`${baseUrl}/api/account/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie
      },
      body: JSON.stringify({
        name: "Esther Reed",
        focus: "Quiet courage",
        currentSeason: "Rebuilding a steady prayer rhythm",
        bio: "I want Selah to help me turn pressure into faithful next steps."
      })
    });

    assert.equal(profileUpdateResponse.status, 200);
    const profileUpdateData = await profileUpdateResponse.json();
    assert.equal(profileUpdateData.user.name, "Esther Reed");
    assert.equal(profileUpdateData.user.profile.focus, "Quiet courage");

    const settingsUpdateResponse = await fetch(`${baseUrl}/api/account/settings`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie
      },
      body: JSON.stringify({
        defaultAiMode: "plan",
        aiVoice: "courageous",
        reminderTime: "06:45",
        weeklyDigest: false,
        experimentalLayout: false,
        startTab: "generator",
        preferredTranslationId: "KJV",
        defaultGeneratorMode: "daily",
        showVerseReason: false,
        compactBookCards: true
      })
    });

    assert.equal(settingsUpdateResponse.status, 200);
    const settingsUpdateData = await settingsUpdateResponse.json();
    assert.equal(settingsUpdateData.user.settings.defaultAiMode, "plan");
    assert.equal(settingsUpdateData.user.settings.aiVoice, "courageous");
    assert.equal(settingsUpdateData.user.settings.reminderTime, "06:45");
    assert.equal(settingsUpdateData.user.settings.weeklyDigest, false);
    assert.equal(settingsUpdateData.user.settings.startTab, "generator");
    assert.equal(settingsUpdateData.user.settings.preferredTranslationId, "KJV");
    assert.equal(settingsUpdateData.user.settings.defaultGeneratorMode, "daily");
    assert.equal(settingsUpdateData.user.settings.showVerseReason, false);
    assert.equal(settingsUpdateData.user.settings.compactBookCards, true);
    assert.equal(settingsUpdateData.user.settings.readingPosition.translationId, "KJV");
    assert.equal(settingsUpdateData.user.settings.readingPosition.bookId, "PSA");

    const passwordChangeResponse = await fetch(`${baseUrl}/api/account/password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie
      },
      body: JSON.stringify({
        currentPassword: "strongpass123",
        newPassword: "strongpass789"
      })
    });

    assert.equal(passwordChangeResponse.status, 200);

    const createCheckinResponse = await fetch(`${baseUrl}/api/checkins`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie
      },
      body: JSON.stringify({
        mood: "anxious",
        energy: 2,
        gratitude: "A calm morning before work.",
        challenge: "I feel pressure about several decisions."
      })
    });

    assert.equal(createCheckinResponse.status, 201);
    const createCheckinData = await createCheckinResponse.json();
    assert.equal(createCheckinData.checkin.mood, "anxious");
    assert.equal(createCheckinData.checkin.energy, 2);

    const saveVerseResponse = await fetch(`${baseUrl}/api/library/verses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie
      },
      body: JSON.stringify({
        reference: "John 1:1",
        translationId: "BSB",
        bookId: "JHN",
        chapter: 1,
        verse: 1,
        text: "In the beginning was the Word, and the Word was with God, and the Word was God."
      })
    });

    assert.equal(saveVerseResponse.status, 201);
    const saveVerseData = await saveVerseResponse.json();
    assert.equal(saveVerseData.savedVerse.reference, "John 1:1");

    const savedVersesResponse = await fetch(`${baseUrl}/api/library/verses`, {
      headers: {
        Cookie: cookie
      }
    });

    assert.equal(savedVersesResponse.status, 200);
    const savedVersesData = await savedVersesResponse.json();
    assert.equal(savedVersesData.savedVerses.length, 1);

    const studyNoteResponse = await fetch(`${baseUrl}/api/study-notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie
      },
      body: JSON.stringify({
        title: "The Word from the beginning",
        reference: "John 1:1",
        verseText: "In the beginning was the Word, and the Word was with God, and the Word was God.",
        translationId: "BSB",
        bookId: "JHN",
        chapter: 1,
        verse: 1,
        body: "This frames Jesus as eternal, not created, and sets the tone for the whole Gospel."
      })
    });

    assert.equal(studyNoteResponse.status, 201);
    const studyNoteData = await studyNoteResponse.json();
    assert.equal(studyNoteData.note.reference, "John 1:1");
    assert.equal(studyNoteData.note.bookId, "JHN");
    assert.equal(studyNoteData.note.chapter, 1);

    const studyNotesResponse = await fetch(`${baseUrl}/api/study-notes`, {
      headers: {
        Cookie: cookie
      }
    });

    assert.equal(studyNotesResponse.status, 200);
    const studyNotesData = await studyNotesResponse.json();
    assert.equal(studyNotesData.notes.length, 1);

    const deleteStudyNoteResponse = await fetch(`${baseUrl}/api/study-notes/${studyNoteData.note.id}`, {
      method: "DELETE",
      headers: {
        Cookie: cookie
      }
    });

    assert.equal(deleteStudyNoteResponse.status, 200);

    const studyNotesAfterDeleteResponse = await fetch(`${baseUrl}/api/study-notes`, {
      headers: {
        Cookie: cookie
      }
    });

    assert.equal(studyNotesAfterDeleteResponse.status, 200);
    const studyNotesAfterDeleteData = await studyNotesAfterDeleteResponse.json();
    assert.equal(studyNotesAfterDeleteData.notes.length, 0);

    const snapshotResponse = await fetch(`${baseUrl}/api/ai/snapshot`, {
      headers: {
        Cookie: cookie
      }
    });

    assert.equal(snapshotResponse.status, 200);
    const snapshotData = await snapshotResponse.json();
    assert.equal(snapshotData.snapshot.source, "selah-local-ai");
    assert.equal(snapshotData.snapshot.signalCards.length, 4);

    const studioResponse = await fetch(`${baseUrl}/api/ai/studio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie
      },
      body: JSON.stringify({
        mode: "companion",
        prompt: "I feel overwhelmed and need peace for today."
      })
    });

    assert.equal(studioResponse.status, 200);
    const studioData = await studioResponse.json();
    assert.equal(studioData.result.source, "selah-local-ai");
    assert.equal(studioData.result.mode, "companion");
    assert.ok(studioData.result.scripture);
    assert.equal(studioData.session.mode, "companion");

    const savedAiSessionsResponse = await fetch(`${baseUrl}/api/ai/sessions`, {
      headers: {
        Cookie: cookie
      }
    });

    assert.equal(savedAiSessionsResponse.status, 200);
    const savedAiSessionsData = await savedAiSessionsResponse.json();
    assert.equal(savedAiSessionsData.sessions.length, 1);
    assert.equal(savedAiSessionsData.sessions[0].mode, "companion");

    const createPrayerResponse = await fetch(`${baseUrl}/api/prayers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie
      },
      body: JSON.stringify({
        title: "Family peace",
        category: "family",
        body: "Help me lead my family with patience, wisdom, and gentleness this week."
      })
    });

    assert.equal(createPrayerResponse.status, 201);
    const createPrayerData = await createPrayerResponse.json();
    assert.equal(createPrayerData.prayer.category, "family");
    assert.equal(createPrayerData.prayer.answeredAt, null);

    const answerPrayerResponse = await fetch(`${baseUrl}/api/prayers/${createPrayerData.prayer.id}/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie
      },
      body: JSON.stringify({
        answeredNote: "We had a calm conversation and clear next steps."
      })
    });

    assert.equal(answerPrayerResponse.status, 200);
    const answerPrayerData = await answerPrayerResponse.json();
    assert.ok(answerPrayerData.prayer.answeredAt);
    assert.equal(answerPrayerData.prayer.answeredNote, "We had a calm conversation and clear next steps.");

    const refreshedSnapshotResponse = await fetch(`${baseUrl}/api/ai/snapshot`, {
      headers: {
        Cookie: cookie
      }
    });

    assert.equal(refreshedSnapshotResponse.status, 200);
    const refreshedSnapshotData = await refreshedSnapshotResponse.json();
    assert.equal(refreshedSnapshotData.snapshot.topThemes[0].label, "Family");

    const refreshedBriefingResponse = await fetch(`${baseUrl}/api/ai/briefing`, {
      headers: {
        Cookie: cookie
      }
    });

    assert.equal(refreshedBriefingResponse.status, 200);
    const refreshedBriefingData = await refreshedBriefingResponse.json();
    assert.equal(refreshedBriefingData.briefing.focus, "Quiet courage");

    const removeSavedVerseResponse = await fetch(`${baseUrl}/api/library/verses/${saveVerseData.savedVerse.id}`, {
      method: "DELETE",
      headers: {
        Cookie: cookie
      }
    });

    assert.equal(removeSavedVerseResponse.status, 200);

    const forgotPasswordResponse = await fetch(`${baseUrl}/api/password/forgot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: "esther@example.com"
      })
    });

    assert.equal(forgotPasswordResponse.status, 200);
    const forgotPasswordData = await forgotPasswordResponse.json();
    assert.equal(forgotPasswordData.message, "If that email exists, a password reset link has been sent.");

    const passwordResetPreviewFiles = (await fs.readdir(emailDir))
      .filter((name) => name.startsWith("password-reset-"));
    assert.equal(passwordResetPreviewFiles.length, 1);

    const passwordResetHtml = await fs.readFile(path.join(emailDir, passwordResetPreviewFiles[0]), "utf8");
    const tokenMatch = passwordResetHtml.match(/reset-password\?token=([a-f0-9]+)/i);
    assert.ok(tokenMatch);
    const resetToken = tokenMatch[1];

    const validateResetResponse = await fetch(`${baseUrl}/api/password/reset/validate?token=${resetToken}`);
    assert.equal(validateResetResponse.status, 200);
    const validateResetData = await validateResetResponse.json();
    assert.equal(validateResetData.valid, true);
    assert.ok(validateResetData.email.includes("@example.com"));

    const resetPageResponse = await fetch(`${baseUrl}/reset-password?token=${resetToken}`);
    assert.equal(resetPageResponse.status, 200);
    const resetPageHtml = await resetPageResponse.text();
    assert.ok(resetPageHtml.includes("Choose a new password"));

    const resetScriptResponse = await fetch(`${baseUrl}/reset-password.js`);
    assert.equal(resetScriptResponse.status, 200);
    const resetScript = await resetScriptResponse.text();
    assert.ok(resetScript.includes("verifyToken"));

    const resetPasswordResponse = await fetch(`${baseUrl}/api/password/reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: resetToken,
        password: "renewedpass456"
      })
    });

    assert.equal(resetPasswordResponse.status, 200);
    const resetPasswordData = await resetPasswordResponse.json();
    assert.equal(resetPasswordData.redirectTo, "/app");
    assert.equal(resetPasswordData.user.email, "esther@example.com");
    const resetCookie = getCookie(resetPasswordResponse);
    assert.ok(resetCookie.includes("selah.sid="));

    const resendResponse = await fetch(`${baseUrl}/api/welcome-email/resend`, {
      method: "POST",
      headers: {
        Cookie: resetCookie
      }
    });

    assert.equal(resendResponse.status, 200);
    const resendData = await resendResponse.json();
    assert.equal(resendData.emailStatus.mode, "preview");

    const resendPreviewFiles = await fs.readdir(emailDir);
    assert.equal(resendPreviewFiles.length, 3);

    const logoutResponse = await fetch(`${baseUrl}/api/logout`, {
      method: "POST",
      headers: {
        Cookie: resetCookie
      }
    });

    assert.equal(logoutResponse.status, 200);

    const oldPasswordLoginResponse = await fetch(`${baseUrl}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: "esther@example.com",
        password: "strongpass789"
      })
    });

    assert.equal(oldPasswordLoginResponse.status, 401);

    const loginResponse = await fetch(`${baseUrl}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: "esther@example.com",
        password: "renewedpass456"
      })
    });

    assert.equal(loginResponse.status, 200);
    const loginData = await loginResponse.json();
    assert.equal(loginData.user.email, "esther@example.com");
    assert.equal(loginData.redirectTo, "/app");
  });

  await withServer({
    env: {
      SMTP_HOST: "yasumi.yoshida.suzuki@gmail.com",
      SMTP_PORT: "587",
      SMTP_SECURE: "false",
      SMTP_USER: "yasumi.yoshida.suzuki@gmail.com",
      SMTP_PASS: "example-app-password"
    }
  }, async ({ baseUrl, emailDir }) => {
    const signupResponse = await fetch(`${baseUrl}/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: "Miriam",
        email: "miriam@example.com",
        password: "strongpass123"
      })
    });

    assert.equal(signupResponse.status, 201);
    const signupData = await signupResponse.json();
    assert.equal(signupData.emailStatus.mode, "preview");
    assert.equal(signupData.redirectTo, "/app");
    assert.match(
      signupData.emailStatus.error,
      /SMTP_HOST must be a mail server hostname, not an email address/
    );

    const previewFiles = await fs.readdir(emailDir);
    assert.equal(previewFiles.length, 1);
  });

  await withServer({
    env: {
      SMTP_HOST: "smtp.gmail.com",
      SMTP_PORT: "587",
      SMTP_SECURE: "false",
      SMTP_USER: "slow@example.com",
      SMTP_PASS: "example-app-password",
      EMAIL_DELIVERY_TIMEOUT_MS: "25"
    },
    transportFactory: () => ({
      verify() {
        return new Promise(() => {});
      },
      sendMail() {
        return new Promise(() => {});
      }
    })
  }, async ({ baseUrl, emailDir }) => {
    const startedAt = Date.now();
    const signupResponse = await fetch(`${baseUrl}/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: "Deborah",
        email: "deborah@example.com",
        password: "strongpass123"
      })
    });
    const elapsedMs = Date.now() - startedAt;

    assert.equal(signupResponse.status, 201);
    assert.equal(elapsedMs < 1500, true);

    const signupData = await signupResponse.json();
    assert.equal(signupData.emailStatus.mode, "preview");
    assert.match(signupData.emailStatus.error, /timed out/i);

    const previewFiles = await fs.readdir(emailDir);
    assert.equal(previewFiles.length, 1);
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
