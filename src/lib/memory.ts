"use client";

import type { EmotionState } from "@/lib/chapterEngine";
import { nanoid } from "nanoid";

export interface MemoryMessage {
  id: string;
  chapter: number;
  line: number;
  speaker: "ECHO" | "PLAYER";
  text: string;
  emotion?: EmotionState;
  timestamp: number;
  choiceNext?: number;
  choiceSourceLine?: number;
  externalKey?: string;
}

export interface EchoMemory {
  affection: number;
  currentChapter: number;
  currentLine: number;
  reloadCount: number;
  lastVisit: number;
  cacheFlag: string | null;
  memoryMissing: boolean;
  history: MemoryMessage[];
  endings: Record<string, boolean>;
}

const MEMORY_KEY = "project-echo-memory";
const SESSION_KEY = "project-echo-session-init";

const isBrowser = () => typeof window !== "undefined";

const createDefaultMemory = (): EchoMemory => ({
  affection: 4,
  currentChapter: 1,
  currentLine: 0,
  reloadCount: 0,
  lastVisit: Date.now(),
  cacheFlag: null,
  memoryMissing: false,
  history: [],
  endings: {},
});

export const getMemory = (): EchoMemory => {
  if (!isBrowser()) return createDefaultMemory();

  const session = window.sessionStorage;
  const hasSession = session.getItem(SESSION_KEY) === "1";
  if (!hasSession) {
    session.setItem(SESSION_KEY, "1");
  }

  try {
    const cached = window.localStorage.getItem(MEMORY_KEY);
    if (!cached) {
      const fallback = createDefaultMemory();
      return {
        ...fallback,
        memoryMissing: hasSession,
      } satisfies EchoMemory;
    }

    const parsed = JSON.parse(cached) as Partial<EchoMemory>;
    const memo = {
      ...createDefaultMemory(),
      ...parsed,
      history: Array.isArray(parsed.history) ? parsed.history.slice(-50) : [],
      endings: parsed.endings ?? {},
      cacheFlag: parsed.cacheFlag ?? null,
      memoryMissing: Boolean(parsed.memoryMissing && parsed.memoryMissing !== false),
    } satisfies EchoMemory;

    return memo;
  } catch (error) {
    console.warn("ECHO memory parse failed", error);
    return createDefaultMemory();
  }
};

const persistMemory = (memory: EchoMemory) => {
  if (!isBrowser()) return memory;
  try {
    const payload = {
      ...memory,
      history: memory.history.slice(-50),
    } satisfies EchoMemory;
    window.localStorage.setItem(MEMORY_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn("ECHO memory save failed", error);
  }
  return memory;
};

const isReloadNavigation = () => {
  if (!isBrowser() || typeof performance === "undefined") return false;

  const navEntries = (performance.getEntriesByType?.("navigation") ?? []) as PerformanceNavigationTiming[];
  if (navEntries.length > 0) {
    return navEntries[0].type === "reload";
  }

  const legacyNav = (performance as Performance & { navigation?: { type?: number } }).navigation;
  return legacyNav?.type === 1;
};

export function updateMemory<K extends keyof EchoMemory>(key: K, value: EchoMemory[K]): EchoMemory;
export function updateMemory(updates: Partial<EchoMemory>): EchoMemory;
export function updateMemory(arg1: unknown, arg2?: unknown): EchoMemory {
  const current = getMemory();
  let next: EchoMemory;

  if (typeof arg1 === "string") {
    next = {
      ...current,
      [arg1]: arg2,
    } as EchoMemory;
  } else {
    next = {
      ...current,
      ...(arg1 as Partial<EchoMemory>),
    } as EchoMemory;
  }

  if (!next.cacheFlag) {
    next.cacheFlag = nanoid(8);
  }

  next.lastVisit = Date.now();
  return persistMemory(next);
}

export const appendHistory = (
  entry: Omit<MemoryMessage, "id" | "timestamp"> & Partial<Pick<MemoryMessage, "timestamp">>,
) => {
  const current = getMemory();
  const message: MemoryMessage = {
    id: nanoid(10),
    timestamp: entry.timestamp ?? Date.now(),
    ...entry,
  };

  const history = [...current.history, message].slice(-50);
  return updateMemory({ history });
};

export const clearMemory = () => {
  if (!isBrowser()) return createDefaultMemory();
  try {
    window.localStorage.removeItem(MEMORY_KEY);
  } catch (error) {
    console.warn("ECHO memory clear failed", error);
  }
  return createDefaultMemory();
};

export const initializeMemory = (): EchoMemory => {
  const memory = getMemory();
  if (!isBrowser()) return memory;

  if (isReloadNavigation()) {
    const next: EchoMemory = {
      ...createDefaultMemory(),
      reloadCount: memory.reloadCount + 1,
      lastVisit: Date.now(),
    };
    return persistMemory(next);
  }

  return memory;
};

export const adjustAffection = (delta: number) => {
  const current = getMemory();
  const affection = Math.max(0, Math.min(10, current.affection + delta));
  return updateMemory({ affection });
};

