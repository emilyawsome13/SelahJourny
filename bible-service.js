const DEFAULT_TRANSLATIONS = [
  {
    id: "BSB",
    shortName: "BSB",
    englishName: "Berean Standard Bible",
    languageName: "English"
  },
  {
    id: "KJV",
    shortName: "KJV",
    englishName: "King James Bible",
    languageName: "English"
  },
  {
    id: "WEB",
    shortName: "WEB",
    englishName: "World English Bible",
    languageName: "English"
  }
];

const DEFAULT_BOOKS = [
  { id: "GEN", name: "Genesis", order: 1, testament: "old", numberOfChapters: 50, group: "Law" },
  { id: "EXO", name: "Exodus", order: 2, testament: "old", numberOfChapters: 40, group: "Law" },
  { id: "LEV", name: "Leviticus", order: 3, testament: "old", numberOfChapters: 27, group: "Law" },
  { id: "NUM", name: "Numbers", order: 4, testament: "old", numberOfChapters: 36, group: "Law" },
  { id: "DEU", name: "Deuteronomy", order: 5, testament: "old", numberOfChapters: 34, group: "Law" },
  { id: "JOS", name: "Joshua", order: 6, testament: "old", numberOfChapters: 24, group: "History" },
  { id: "JDG", name: "Judges", order: 7, testament: "old", numberOfChapters: 21, group: "History" },
  { id: "RUT", name: "Ruth", order: 8, testament: "old", numberOfChapters: 4, group: "History" },
  { id: "1SA", name: "1 Samuel", order: 9, testament: "old", numberOfChapters: 31, group: "History" },
  { id: "2SA", name: "2 Samuel", order: 10, testament: "old", numberOfChapters: 24, group: "History" },
  { id: "1KI", name: "1 Kings", order: 11, testament: "old", numberOfChapters: 22, group: "History" },
  { id: "2KI", name: "2 Kings", order: 12, testament: "old", numberOfChapters: 25, group: "History" },
  { id: "1CH", name: "1 Chronicles", order: 13, testament: "old", numberOfChapters: 29, group: "History" },
  { id: "2CH", name: "2 Chronicles", order: 14, testament: "old", numberOfChapters: 36, group: "History" },
  { id: "EZR", name: "Ezra", order: 15, testament: "old", numberOfChapters: 10, group: "History" },
  { id: "NEH", name: "Nehemiah", order: 16, testament: "old", numberOfChapters: 13, group: "History" },
  { id: "EST", name: "Esther", order: 17, testament: "old", numberOfChapters: 10, group: "History" },
  { id: "JOB", name: "Job", order: 18, testament: "old", numberOfChapters: 42, group: "Wisdom" },
  { id: "PSA", name: "Psalms", order: 19, testament: "old", numberOfChapters: 150, group: "Wisdom" },
  { id: "PRO", name: "Proverbs", order: 20, testament: "old", numberOfChapters: 31, group: "Wisdom" },
  { id: "ECC", name: "Ecclesiastes", order: 21, testament: "old", numberOfChapters: 12, group: "Wisdom" },
  { id: "SNG", name: "Song of Songs", order: 22, testament: "old", numberOfChapters: 8, group: "Wisdom" },
  { id: "ISA", name: "Isaiah", order: 23, testament: "old", numberOfChapters: 66, group: "Prophets" },
  { id: "JER", name: "Jeremiah", order: 24, testament: "old", numberOfChapters: 52, group: "Prophets" },
  { id: "LAM", name: "Lamentations", order: 25, testament: "old", numberOfChapters: 5, group: "Prophets" },
  { id: "EZK", name: "Ezekiel", order: 26, testament: "old", numberOfChapters: 48, group: "Prophets" },
  { id: "DAN", name: "Daniel", order: 27, testament: "old", numberOfChapters: 12, group: "Prophets" },
  { id: "HOS", name: "Hosea", order: 28, testament: "old", numberOfChapters: 14, group: "Prophets" },
  { id: "JOL", name: "Joel", order: 29, testament: "old", numberOfChapters: 3, group: "Prophets" },
  { id: "AMO", name: "Amos", order: 30, testament: "old", numberOfChapters: 9, group: "Prophets" },
  { id: "OBA", name: "Obadiah", order: 31, testament: "old", numberOfChapters: 1, group: "Prophets" },
  { id: "JON", name: "Jonah", order: 32, testament: "old", numberOfChapters: 4, group: "Prophets" },
  { id: "MIC", name: "Micah", order: 33, testament: "old", numberOfChapters: 7, group: "Prophets" },
  { id: "NAM", name: "Nahum", order: 34, testament: "old", numberOfChapters: 3, group: "Prophets" },
  { id: "HAB", name: "Habakkuk", order: 35, testament: "old", numberOfChapters: 3, group: "Prophets" },
  { id: "ZEP", name: "Zephaniah", order: 36, testament: "old", numberOfChapters: 3, group: "Prophets" },
  { id: "HAG", name: "Haggai", order: 37, testament: "old", numberOfChapters: 2, group: "Prophets" },
  { id: "ZEC", name: "Zechariah", order: 38, testament: "old", numberOfChapters: 14, group: "Prophets" },
  { id: "MAL", name: "Malachi", order: 39, testament: "old", numberOfChapters: 4, group: "Prophets" },
  { id: "MAT", name: "Matthew", order: 40, testament: "new", numberOfChapters: 28, group: "Gospels" },
  { id: "MRK", name: "Mark", order: 41, testament: "new", numberOfChapters: 16, group: "Gospels" },
  { id: "LUK", name: "Luke", order: 42, testament: "new", numberOfChapters: 24, group: "Gospels" },
  { id: "JHN", name: "John", order: 43, testament: "new", numberOfChapters: 21, group: "Gospels" },
  { id: "ACT", name: "Acts", order: 44, testament: "new", numberOfChapters: 28, group: "History" },
  { id: "ROM", name: "Romans", order: 45, testament: "new", numberOfChapters: 16, group: "Letters" },
  { id: "1CO", name: "1 Corinthians", order: 46, testament: "new", numberOfChapters: 16, group: "Letters" },
  { id: "2CO", name: "2 Corinthians", order: 47, testament: "new", numberOfChapters: 13, group: "Letters" },
  { id: "GAL", name: "Galatians", order: 48, testament: "new", numberOfChapters: 6, group: "Letters" },
  { id: "EPH", name: "Ephesians", order: 49, testament: "new", numberOfChapters: 6, group: "Letters" },
  { id: "PHP", name: "Philippians", order: 50, testament: "new", numberOfChapters: 4, group: "Letters" },
  { id: "COL", name: "Colossians", order: 51, testament: "new", numberOfChapters: 4, group: "Letters" },
  { id: "1TH", name: "1 Thessalonians", order: 52, testament: "new", numberOfChapters: 5, group: "Letters" },
  { id: "2TH", name: "2 Thessalonians", order: 53, testament: "new", numberOfChapters: 3, group: "Letters" },
  { id: "1TI", name: "1 Timothy", order: 54, testament: "new", numberOfChapters: 6, group: "Letters" },
  { id: "2TI", name: "2 Timothy", order: 55, testament: "new", numberOfChapters: 4, group: "Letters" },
  { id: "TIT", name: "Titus", order: 56, testament: "new", numberOfChapters: 3, group: "Letters" },
  { id: "PHM", name: "Philemon", order: 57, testament: "new", numberOfChapters: 1, group: "Letters" },
  { id: "HEB", name: "Hebrews", order: 58, testament: "new", numberOfChapters: 13, group: "Letters" },
  { id: "JAS", name: "James", order: 59, testament: "new", numberOfChapters: 5, group: "Letters" },
  { id: "1PE", name: "1 Peter", order: 60, testament: "new", numberOfChapters: 5, group: "Letters" },
  { id: "2PE", name: "2 Peter", order: 61, testament: "new", numberOfChapters: 3, group: "Letters" },
  { id: "1JN", name: "1 John", order: 62, testament: "new", numberOfChapters: 5, group: "Letters" },
  { id: "2JN", name: "2 John", order: 63, testament: "new", numberOfChapters: 1, group: "Letters" },
  { id: "3JN", name: "3 John", order: 64, testament: "new", numberOfChapters: 1, group: "Letters" },
  { id: "JUD", name: "Jude", order: 65, testament: "new", numberOfChapters: 1, group: "Letters" },
  { id: "REV", name: "Revelation", order: 66, testament: "new", numberOfChapters: 22, group: "Apocalyptic" }
];

const VERSE_OF_DAY_ROTATION = [
  { reference: "Psalm 23:1", bookId: "PSA", chapter: 23, verse: 1, text: "The LORD is my shepherd; I shall not want." },
  { reference: "John 14:27", bookId: "JHN", chapter: 14, verse: 27, text: "Peace I leave with you; My peace I give to you." },
  { reference: "Romans 8:28", bookId: "ROM", chapter: 8, verse: 28, text: "And we know that God works all things together for the good of those who love Him." },
  { reference: "Lamentations 3:22-23", bookId: "LAM", chapter: 3, verse: 22, text: "Because of the LORD’s loving devotion we are not consumed, for His mercies never fail. They are new every morning." },
  { reference: "Philippians 4:6-7", bookId: "PHP", chapter: 4, verse: 6, text: "Be anxious for nothing, but in everything, by prayer and petition, with thanksgiving, present your requests to God." },
  { reference: "Isaiah 40:31", bookId: "ISA", chapter: 40, verse: 31, text: "But those who wait upon the LORD will renew their strength." }
];

const TOPIC_COLLECTIONS = [
  {
    topic: "Peace",
    summary: "Verses for anxiety, rest, and steady trust.",
    verses: [
      { reference: "Philippians 4:6-7", bookId: "PHP", chapter: 4, verse: 6, text: "Be anxious for nothing, but in everything, by prayer and petition, with thanksgiving, present your requests to God." },
      { reference: "John 14:27", bookId: "JHN", chapter: 14, verse: 27, text: "Peace I leave with you; My peace I give to you." },
      { reference: "Psalm 46:10", bookId: "PSA", chapter: 46, verse: 10, text: "Be still, and know that I am God." }
    ]
  },
  {
    topic: "Hope",
    summary: "Verses for waiting, endurance, and confidence.",
    verses: [
      { reference: "Romans 15:13", bookId: "ROM", chapter: 15, verse: 13, text: "Now may the God of hope fill you with all joy and peace as you believe in Him." },
      { reference: "Isaiah 40:31", bookId: "ISA", chapter: 40, verse: 31, text: "But those who wait upon the LORD will renew their strength." },
      { reference: "Lamentations 3:22-23", bookId: "LAM", chapter: 3, verse: 22, text: "Because of the LORD’s loving devotion we are not consumed, for His mercies never fail." }
    ]
  },
  {
    topic: "Wisdom",
    summary: "Verses for decisions, discernment, and guidance.",
    verses: [
      { reference: "James 1:5", bookId: "JAS", chapter: 1, verse: 5, text: "Now if any of you lacks wisdom, he should ask God, who gives generously to all without finding fault." },
      { reference: "Proverbs 3:5-6", bookId: "PRO", chapter: 3, verse: 5, text: "Trust in the LORD with all your heart, and lean not on your own understanding." },
      { reference: "Psalm 119:105", bookId: "PSA", chapter: 119, verse: 105, text: "Your word is a lamp to my feet and a light to my path." }
    ]
  },
  {
    topic: "Strength",
    summary: "Verses for courage, pressure, and perseverance.",
    verses: [
      { reference: "Joshua 1:9", bookId: "JOS", chapter: 1, verse: 9, text: "Be strong and courageous. Do not be afraid or discouraged, for the LORD your God is with you." },
      { reference: "2 Corinthians 12:9", bookId: "2CO", chapter: 12, verse: 9, text: "My grace is sufficient for you, for My power is perfected in weakness." },
      { reference: "Psalm 27:1", bookId: "PSA", chapter: 27, verse: 1, text: "The LORD is my light and my salvation; whom shall I fear?" }
    ]
  },
  {
    topic: "Love",
    summary: "Verses for relationships, grace, and service.",
    verses: [
      { reference: "1 Corinthians 13:4-5", bookId: "1CO", chapter: 13, verse: 4, text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud." },
      { reference: "John 13:34", bookId: "JHN", chapter: 13, verse: 34, text: "Love one another. As I have loved you, so you also must love one another." },
      { reference: "Romans 12:10", bookId: "ROM", chapter: 12, verse: 10, text: "Be devoted to one another in brotherly love. Outdo yourselves in honoring one another." }
    ]
  }
];

const READING_PLANS = [
  {
    id: "start-in-john",
    title: "Start In John",
    summary: "A seven-day path through the opening movement of John's Gospel.",
    duration: "7 days",
    emphasis: "Identity of Jesus",
    steps: [
      { day: 1, reference: "John 1", bookId: "JHN", chapter: 1, focus: "The Word and the Light" },
      { day: 2, reference: "John 2", bookId: "JHN", chapter: 2, focus: "First sign at Cana" },
      { day: 3, reference: "John 3", bookId: "JHN", chapter: 3, focus: "New birth and belief" },
      { day: 4, reference: "John 4", bookId: "JHN", chapter: 4, focus: "Living water" },
      { day: 5, reference: "John 5", bookId: "JHN", chapter: 5, focus: "Healing and authority" },
      { day: 6, reference: "John 6", bookId: "JHN", chapter: 6, focus: "Bread of life" },
      { day: 7, reference: "John 7", bookId: "JHN", chapter: 7, focus: "Rivers of living water" }
    ]
  },
  {
    id: "psalms-for-peace",
    title: "Psalms For Peace",
    summary: "Five Psalms for anxiety, trust, rest, and renewed steadiness.",
    duration: "5 days",
    emphasis: "Peace and trust",
    steps: [
      { day: 1, reference: "Psalm 23", bookId: "PSA", chapter: 23, focus: "The Shepherd's care" },
      { day: 2, reference: "Psalm 27", bookId: "PSA", chapter: 27, focus: "Confidence in fear" },
      { day: 3, reference: "Psalm 46", bookId: "PSA", chapter: 46, focus: "Stillness in chaos" },
      { day: 4, reference: "Psalm 91", bookId: "PSA", chapter: 91, focus: "Shelter and refuge" },
      { day: 5, reference: "Psalm 121", bookId: "PSA", chapter: 121, focus: "Help from the Lord" }
    ]
  },
  {
    id: "romans-foundation",
    title: "Romans Foundation",
    summary: "A six-day track through grace, identity, life in the Spirit, and hope.",
    duration: "6 days",
    emphasis: "Grace and identity",
    steps: [
      { day: 1, reference: "Romans 1", bookId: "ROM", chapter: 1, focus: "The gospel revealed" },
      { day: 2, reference: "Romans 3", bookId: "ROM", chapter: 3, focus: "Righteousness by faith" },
      { day: 3, reference: "Romans 5", bookId: "ROM", chapter: 5, focus: "Peace with God" },
      { day: 4, reference: "Romans 6", bookId: "ROM", chapter: 6, focus: "Alive to God" },
      { day: 5, reference: "Romans 8", bookId: "ROM", chapter: 8, focus: "Life in the Spirit" },
      { day: 6, reference: "Romans 12", bookId: "ROM", chapter: 12, focus: "A renewed life" }
    ]
  }
];

const GENERATOR_PRESETS = [
  {
    id: "daily",
    label: "Verse of the day",
    description: "Use today's featured verse as a simple starting point."
  },
  {
    id: "random",
    label: "Random verse",
    description: "Pull a curated verse from the full Selah collection."
  },
  {
    id: "topic",
    label: "By topic",
    description: "Generate a verse around a theme like peace, hope, or wisdom."
  },
  {
    id: "testament",
    label: "By testament",
    description: "Stay inside either the Old Testament or New Testament."
  },
  {
    id: "book",
    label: "From a book",
    description: "Generate a verse from a specific book you want to stay in."
  },
  {
    id: "chapter",
    label: "From current chapter",
    description: "Generate a verse from the chapter you are browsing right now."
  }
];

const FALLBACK_CHAPTERS = {
  "BSB:GEN:1": {
    headings: ["The Creation", "The First Day"],
    verses: [
      { verse: 1, text: "In the beginning God created the heavens and the earth." },
      { verse: 2, text: "Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters." },
      { verse: 3, text: "And God said, “Let there be light,” and there was light." },
      { verse: 4, text: "And God saw that the light was good, and He separated the light from the darkness." },
      { verse: 5, text: "God called the light day, and the darkness He called night. And there was evening, and there was morning, the first day." }
    ]
  },
  "BSB:JHN:1": {
    headings: ["The Beginning", "The Word Became Flesh"],
    verses: [
      { verse: 1, text: "In the beginning was the Word, and the Word was with God, and the Word was God." },
      { verse: 2, text: "He was with God in the beginning." },
      { verse: 3, text: "Through Him all things were made, and without Him nothing was made that has been made." },
      { verse: 4, text: "In Him was life, and that life was the light of men." },
      { verse: 5, text: "The Light shines in the darkness, and the darkness has not overcome it." },
      { verse: 14, text: "The Word became flesh and made His dwelling among us. We have seen His glory, the glory of the one and only Son from the Father, full of grace and truth." }
    ]
  },
  "BSB:JHN:3": {
    headings: ["Jesus and Nicodemus"],
    verses: [
      { verse: 16, text: "For God so loved the world that He gave His one and only Son, that everyone who believes in Him shall not perish but have eternal life." },
      { verse: 17, text: "For God did not send His Son into the world to condemn the world, but to save the world through Him." },
      { verse: 18, text: "Whoever believes in Him is not condemned, but whoever does not believe has already been condemned." }
    ]
  },
  "BSB:PSA:23": {
    headings: ["The LORD Is My Shepherd"],
    verses: [
      { verse: 1, text: "The LORD is my shepherd; I shall not want." },
      { verse: 2, text: "He makes me lie down in green pastures; He leads me beside quiet waters." },
      { verse: 3, text: "He restores my soul; He guides me in the paths of righteousness for the sake of His name." },
      { verse: 4, text: "Even though I walk through the valley of the shadow of death, I will fear no evil, for You are with me." },
      { verse: 5, text: "You prepare a table before me in the presence of my enemies. You anoint my head with oil; my cup overflows." },
      { verse: 6, text: "Surely goodness and loving devotion will follow me all the days of my life, and I will dwell in the house of the LORD forever." }
    ]
  },
  "BSB:ROM:8": {
    headings: ["Life Through the Spirit", "More than Conquerors"],
    verses: [
      { verse: 1, text: "Therefore, there is now no condemnation for those who are in Christ Jesus." },
      { verse: 2, text: "For in Christ Jesus the law of the Spirit of life set you free from the law of sin and death." },
      { verse: 5, text: "Those who live according to the flesh set their minds on the things of the flesh, but those who live according to the Spirit set their minds on the things of the Spirit." },
      { verse: 6, text: "The mind of the flesh is death, but the mind of the Spirit is life and peace." },
      { verse: 28, text: "And we know that God works all things together for the good of those who love Him, who are called according to His purpose." },
      { verse: 38, text: "For I am convinced that neither death nor life, neither angels nor principalities, neither the present nor the future, nor any powers..." },
      { verse: 39, text: "...nor height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord." }
    ]
  }
};

function getBooks() {
  return DEFAULT_BOOKS.map((book) => ({ ...book }));
}

function getTranslations() {
  return DEFAULT_TRANSLATIONS.map((translation) => ({ ...translation }));
}

function getBookById(bookId) {
  return DEFAULT_BOOKS.find((entry) => entry.id === String(bookId || "").toUpperCase()) || null;
}

function getTranslationById(translationId) {
  return DEFAULT_TRANSLATIONS.find((entry) => entry.id === String(translationId || "").toUpperCase()) || DEFAULT_TRANSLATIONS[0];
}

function flattenRichContent(parts) {
  if (!Array.isArray(parts)) {
    return "";
  }

  return parts.map((part) => {
    if (typeof part === "string") {
      return part;
    }

    if (part && typeof part === "object" && Array.isArray(part.content)) {
      return flattenRichContent(part.content);
    }

    return "";
  }).join("").replace(/\s+/g, " ").trim();
}

function normalizeRemoteChapterPayload(payload, translationId, bookId, chapterNumber) {
  const bookMeta = getBookById(bookId);
  const headings = [];
  const verses = [];

  for (const item of payload?.chapter?.content || []) {
    if (item?.type === "heading") {
      const text = flattenRichContent(item.content);
      if (text) {
        headings.push(text);
      }
      continue;
    }

    if (item?.type === "verse") {
      const text = flattenRichContent(item.content);
      if (text) {
        verses.push({
          verse: Number(item.number),
          text
        });
      }
    }
  }

  return {
    source: "remote",
    translation: {
      id: payload?.translation?.id || translationId,
      shortName: payload?.translation?.shortName || translationId,
      englishName: payload?.translation?.englishName || getTranslationById(translationId).englishName
    },
    book: {
      id: payload?.book?.id || bookId,
      name: payload?.book?.name || bookMeta?.name || bookId,
      order: payload?.book?.order || bookMeta?.order || 0,
      numberOfChapters: payload?.book?.numberOfChapters || bookMeta?.numberOfChapters || 1
    },
    chapter: {
      number: Number(payload?.chapter?.number || chapterNumber),
      headings,
      verses
    }
  };
}

function buildFallbackChapter(translationId, bookId, chapterNumber) {
  const fallback = FALLBACK_CHAPTERS[`${translationId}:${bookId}:${chapterNumber}`];

  if (!fallback) {
    return null;
  }

  const bookMeta = getBookById(bookId);
  const translation = getTranslationById(translationId);

  return {
    source: "fallback",
    translation: {
      id: translation.id,
      shortName: translation.shortName,
      englishName: translation.englishName
    },
    book: {
      id: bookMeta?.id || bookId,
      name: bookMeta?.name || bookId,
      order: bookMeta?.order || 0,
      numberOfChapters: bookMeta?.numberOfChapters || 1
    },
    chapter: {
      number: chapterNumber,
      headings: [...fallback.headings],
      verses: fallback.verses.map((verse) => ({ ...verse }))
    }
  };
}

async function fetchJson(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}.`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function getChapter({ env, translationId, bookId, chapterNumber }) {
  const safeTranslationId = getTranslationById(translationId).id;
  const safeBookId = String(bookId || "").toUpperCase();
  const safeChapterNumber = Math.max(1, Number(chapterNumber || 1));
  const baseUrl = String(env?.BIBLE_API_BASE_URL || "https://bible.helloao.org").replace(/\/+$/, "");

  try {
    const payload = await fetchJson(`${baseUrl}/api/${safeTranslationId}/${safeBookId}/${safeChapterNumber}.json`);
    return normalizeRemoteChapterPayload(payload, safeTranslationId, safeBookId, safeChapterNumber);
  } catch {
    const fallback = buildFallbackChapter(safeTranslationId, safeBookId, safeChapterNumber);

    if (fallback) {
      return fallback;
    }

    throw new Error("This chapter could not be loaded right now. Try another book, another translation, or check your internet connection.");
  }
}

function getVerseOfDay(date = new Date()) {
  const daySeed = Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / (1000 * 60 * 60 * 24));
  const verse = VERSE_OF_DAY_ROTATION[daySeed % VERSE_OF_DAY_ROTATION.length];
  return { ...verse };
}

function getTopicCollections() {
  return TOPIC_COLLECTIONS.map((collection) => ({
    ...collection,
    verses: collection.verses.map((verse) => ({ ...verse }))
  }));
}

function getReadingPlans() {
  return READING_PLANS.map((plan) => ({
    ...plan,
    steps: plan.steps.map((step) => ({ ...step }))
  }));
}

function normalizeTopicName(value) {
  return String(value || "").trim().toLowerCase();
}

function buildReference(bookId, chapter, verse) {
  const book = getBookById(bookId);
  return `${book?.name || bookId} ${chapter}:${verse}`;
}

function buildCatalogVerse(entry, extras = {}) {
  const translationId = extras.translationId || entry.translationId || "BSB";
  const book = getBookById(entry.bookId);

  return {
    reference: entry.reference || buildReference(entry.bookId, entry.chapter, entry.verse),
    translationId,
    bookId: entry.bookId,
    chapter: Number(entry.chapter),
    verse: Number(entry.verse),
    text: entry.text,
    testament: book?.testament || "new",
    group: book?.group || "Letters",
    topics: [...new Set((extras.topics || entry.topics || []).filter(Boolean).map((topic) => String(topic)))],
    source: extras.source || entry.source || "curated"
  };
}

function buildCuratedVerseCatalog() {
  const verseMap = new Map();

  function upsertVerse(entry, extras = {}) {
    const verse = buildCatalogVerse(entry, extras);
    const key = `${verse.translationId}:${verse.reference}`;
    const existing = verseMap.get(key);

    if (!existing) {
      verseMap.set(key, verse);
      return;
    }

    existing.topics = [...new Set([...existing.topics, ...verse.topics])];
    if (existing.source === "chapter" && verse.source !== "chapter") {
      existing.source = verse.source;
    }
  }

  for (const verse of VERSE_OF_DAY_ROTATION) {
    upsertVerse(verse, {
      source: "daily",
      topics: ["Daily", "Featured"]
    });
  }

  for (const collection of TOPIC_COLLECTIONS) {
    for (const verse of collection.verses) {
      upsertVerse(verse, {
        source: "topic",
        topics: [collection.topic]
      });
    }
  }

  for (const [key, chapter] of Object.entries(FALLBACK_CHAPTERS)) {
    const [translationId, bookId, chapterText] = key.split(":");
    const chapterNumber = Number(chapterText);

    for (const verse of chapter.verses) {
      upsertVerse({
        bookId,
        chapter: chapterNumber,
        verse: verse.verse,
        text: verse.text
      }, {
        translationId,
        source: "chapter"
      });
    }
  }

  return [...verseMap.values()].sort((left, right) => left.reference.localeCompare(right.reference));
}

const CURATED_VERSE_CATALOG = buildCuratedVerseCatalog();

function getCuratedVerseCatalog() {
  return CURATED_VERSE_CATALOG.map((entry) => ({
    ...entry,
    topics: [...entry.topics]
  }));
}

function getGeneratorPresets() {
  return {
    modes: GENERATOR_PRESETS.map((preset) => ({ ...preset })),
    topics: TOPIC_COLLECTIONS.map((collection) => ({
      topic: collection.topic,
      summary: collection.summary
    })),
    testaments: [
      { id: "all", label: "Whole Bible" },
      { id: "old", label: "Old Testament" },
      { id: "new", label: "New Testament" }
    ]
  };
}

function getCatalogVerseForDay(date = new Date()) {
  const verseOfDay = getVerseOfDay(date);
  const matched = CURATED_VERSE_CATALOG.find((entry) => (
    entry.bookId === verseOfDay.bookId &&
    entry.chapter === verseOfDay.chapter &&
    entry.verse === verseOfDay.verse
  ));

  return matched ? { ...matched, topics: [...matched.topics] } : buildCatalogVerse(verseOfDay, {
    source: "daily",
    topics: ["Daily", "Featured"]
  });
}

function simpleHash(value) {
  const text = String(value || "");
  let hash = 0;

  for (let index = 0; index < text.length; index += 1) {
    hash = ((hash * 31) + text.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function buildGeneratorReason(mode, verse, options) {
  if (mode === "daily") {
    return "This is today's featured verse inside Selah.";
  }

  if (mode === "topic") {
    const topic = String(options.topic || verse.topics[0] || "this theme").trim();
    return `This verse was generated from the ${topic.toLowerCase()} theme collection.`;
  }

  if (mode === "testament") {
    return verse.testament === "old"
      ? "This verse was generated from the Old Testament."
      : "This verse was generated from the New Testament.";
  }

  if (mode === "book") {
    return `This verse was generated from ${getBookById(verse.bookId)?.name || verse.bookId}.`;
  }

  if (mode === "chapter") {
    return `This verse was generated from ${getBookById(verse.bookId)?.name || verse.bookId} ${verse.chapter}.`;
  }

  return "This verse was generated from Selah's curated verse collection.";
}

function generateVerse(options = {}) {
  const mode = new Set(GENERATOR_PRESETS.map((preset) => preset.id)).has(String(options.mode || "").toLowerCase())
    ? String(options.mode || "").toLowerCase()
    : "random";
  const topicQuery = String(options.topic || "").trim();
  const normalizedTopic = normalizeTopicName(topicQuery);
  const testament = String(options.testament || "all").trim().toLowerCase();
  const bookId = options.bookId ? String(options.bookId).trim().toUpperCase() : "";
  const chapter = Number(options.chapter || 0);
  const offset = Math.max(0, Number(options.offset || 0));

  if (mode === "daily") {
    const verse = getCatalogVerseForDay();
    return {
      ...verse,
      mode,
      reason: buildGeneratorReason(mode, verse, options)
    };
  }

  const catalog = getCuratedVerseCatalog();
  let pool = catalog;

  if (mode === "topic") {
    const matchingCollection = TOPIC_COLLECTIONS.find((collection) => normalizeTopicName(collection.topic) === normalizedTopic);

    if (matchingCollection) {
      pool = matchingCollection.verses.map((verse) => buildCatalogVerse(verse, {
        source: "topic",
        topics: [matchingCollection.topic]
      }));
    } else if (normalizedTopic) {
      pool = catalog.filter((verse) => (
        verse.topics.some((topic) => normalizeTopicName(topic).includes(normalizedTopic)) ||
        verse.text.toLowerCase().includes(normalizedTopic) ||
        verse.reference.toLowerCase().includes(normalizedTopic)
      ));
    }
  } else if (mode === "testament" && (testament === "old" || testament === "new")) {
    pool = catalog.filter((verse) => verse.testament === testament);
  } else if (mode === "book" && bookId) {
    pool = catalog.filter((verse) => verse.bookId === bookId);
  } else if (mode === "chapter" && bookId && Number.isFinite(chapter) && chapter > 0) {
    pool = catalog.filter((verse) => verse.bookId === bookId && verse.chapter === chapter);
  }

  if (!pool.length && bookId) {
    pool = catalog.filter((verse) => verse.bookId === bookId);
  }

  if (!pool.length && (testament === "old" || testament === "new")) {
    pool = catalog.filter((verse) => verse.testament === testament);
  }

  if (!pool.length) {
    pool = catalog;
  }

  const seed = `${mode}|${normalizedTopic}|${testament}|${bookId}|${chapter}`;
  const index = (simpleHash(seed) + offset) % pool.length;
  const verse = {
    ...pool[index],
    topics: [...pool[index].topics]
  };

  return {
    ...verse,
    mode,
    reason: buildGeneratorReason(mode, verse, {
      ...options,
      topic: topicQuery
    })
  };
}

module.exports = {
  getBooks,
  getTranslations,
  getBookById,
  getTranslationById,
  getChapter,
  getVerseOfDay,
  getTopicCollections,
  getReadingPlans,
  getCuratedVerseCatalog,
  getGeneratorPresets,
  generateVerse
};
