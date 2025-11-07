import type { ChapterData } from "@/lib/chapterEngine";

type ChapterModule = { chapter?: ChapterData; default?: ChapterData };
type ChapterLoader = () => Promise<ChapterData>;

const toLoader = (importer: () => Promise<ChapterModule>): ChapterLoader => {
  return async () => {
    const mod = await importer();
    const chapter = mod.chapter ?? mod.default;
    if (!chapter) {
      throw new Error("Chapter module did not export a chapter payload");
    }
    return chapter;
  };
};

const chaptersByLocale: Record<string, Record<number, ChapterLoader>> = {
  vi: {
    0: toLoader(() => import("./ch0.js")),
    1: toLoader(() => import("./ch1.js")),
    2: toLoader(() => import("./ch2.js")),
  },
  en: {
    0: toLoader(() => import("./ch0.en.js")),
    1: toLoader(() => import("./ch1.en.js")),
    2: toLoader(() => import("./ch2.en.js")),
  },
};

const normalizeLocale = (locale: string) => locale.toLowerCase().slice(0, 2);

export const getChapterLoader = (chapterId: number, locale: string): ChapterLoader => {
  const normalized = normalizeLocale(locale);
  const localeMap = chaptersByLocale[normalized] ?? chaptersByLocale.vi;

  if (localeMap[chapterId]) {
    return localeMap[chapterId];
  }

  if (chaptersByLocale.vi[chapterId]) {
    return chaptersByLocale.vi[chapterId];
  }

  throw new Error(`Chapter ${chapterId} is not registered`);
};

export const availableChapterIds = Object.keys(chaptersByLocale.vi).map((id) => Number(id));

