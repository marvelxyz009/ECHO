"use client";

import {
  adjustAffection,
  appendHistory,
  getMemory,
  initializeMemory,
  updateMemory,
  type EchoMemory,
} from "@/lib/memory";
import { getChapterLoader } from "@/data/dialogues/manifest";
import { playAmbient, playVoice, stopAll } from "@/lib/sound";
import { glitch, glitchFlash, heartbeat } from "@/lib/uiEffect";

export type EmotionState = "neutral" | "warm" | "sad" | "glitch";

export interface DialogueChoice {
  text: string;
  next: number;
  mood?: EmotionState;
  affection?: number;
  trust?: number;
  loneliness?: number;
  glitch?: number;
  note?: string;
}

export interface DialogueLine {
  id: number;
  text: string;
  emotion?: EmotionState;
  voice?: string;
  ambient?: string | null;
  choices?: DialogueChoice[];
  tag?: "ending" | "hidden";
  meta?: Record<string, string | number | boolean>;
}

export interface ChapterData {
  id: number;
  title: string;
  entryEmotion?: EmotionState;
  ambient?: string | null;
  lines: DialogueLine[];
  hidden?: boolean;
}

const chapterCache = new Map<string, ChapterData>();

const loadChapterModule = async (chapterId: number, locale: string): Promise<ChapterData> => {
  const cacheKey = `${locale}:${chapterId}`;
  if (chapterCache.has(cacheKey)) {
    return chapterCache.get(cacheKey)!;
  }

  try {
    const loader = getChapterLoader(chapterId, locale);
    const fallbackChapter = await loader();
    chapterCache.set(cacheKey, fallbackChapter);
    return fallbackChapter;
  } catch (error) {
    throw new Error(`Chapter ${chapterId} failed to load: ${(error as Error).message}`);
  }
};

export interface EngineCallbacks {
  onEmotionChange?: (emotion: EmotionState) => void;
  onLine?: (line: DialogueLine) => void;
  onChoices?: (choices?: DialogueChoice[]) => void;
  onChapterChange?: (chapter: ChapterData) => void;
  onEnding?: (ending: "hope" | "oblivion" | "hidden") => void;
}

export interface EngineState {
  chapter: ChapterData | null;
  line: DialogueLine | null;
  memory: EchoMemory;
}

const EMOTION_TRIGGER: Record<EmotionState, () => void> = {
  neutral: () => undefined,
  warm: () => heartbeat(),
  sad: () => glitch(),
  glitch: () => glitchFlash(),
};

export class ChapterEngine {
  private chapter: ChapterData | null = null;
  private lineIndexMap = new Map<number, number>();
  private currentLineId: number | null = null;
  private callbacks: EngineCallbacks;
  private memory: EchoMemory;
  private locale: string;

  constructor(callbacks: EngineCallbacks = {}, locale = "vi") {
    this.callbacks = callbacks;
    this.locale = locale;
    this.memory = initializeMemory();
  }

  setCallbacks(callbacks: EngineCallbacks) {
    this.callbacks = callbacks;
  }

  private emitEmotion(emotion?: EmotionState) {
    if (!emotion) return;
    EMOTION_TRIGGER[emotion]?.();
    this.callbacks.onEmotionChange?.(emotion);
  }

  private deliverLine(line: DialogueLine | null, { recordHistory = true }: { recordHistory?: boolean } = {}) {
    if (!line) return null;

    this.emitEmotion(line.emotion ?? this.chapter?.entryEmotion);
    if (line.voice) playVoice(line.voice).catch(() => undefined);
    if (line.ambient) {
      playAmbient(line.ambient).catch(() => undefined);
    }
    if (line.ambient === null) {
      stopAll();
    }

    if (recordHistory && this.chapter) {
      appendHistory({
        chapter: this.chapter.id,
        line: line.id,
        speaker: "ECHO",
        text: line.text,
        emotion: line.emotion,
      });
    }

    this.callbacks.onLine?.(line);
    this.callbacks.onChoices?.(line.choices);
    this.evaluateEndings();
    return line;
  }

  private ensureChapter() {
    if (!this.chapter) {
      throw new Error("Chapter not loaded");
    }
    return this.chapter;
  }

  private indexChapter(chapter: ChapterData) {
    this.chapter = chapter;
    this.lineIndexMap = new Map();
    chapter.lines.forEach((line, index) => {
      this.lineIndexMap.set(line.id, index);
    });
    this.callbacks.onChapterChange?.(chapter);
    if (chapter.ambient) {
      playAmbient(chapter.ambient).catch(() => undefined);
    }
    this.emitEmotion(chapter.entryEmotion);
  }

  private evaluateEndings() {
    const memory = getMemory();
    if (memory.affection >= 8 && !memory.endings.hope) {
      updateMemory({ endings: { ...memory.endings, hope: true } });
      this.callbacks.onEnding?.("hope");
    }
    if (memory.affection <= 2 && memory.reloadCount >= 5 && !memory.endings.oblivion) {
      updateMemory({ endings: { ...memory.endings, oblivion: true } });
      this.callbacks.onEnding?.("oblivion");
    }
  }

  private saveMemory() {
    if (!this.chapter || this.currentLineId == null) return;
    this.memory = updateMemory({
      currentChapter: this.chapter.id,
      currentLine: this.currentLineId,
      memoryMissing: false,
    });
  }

  async loadChapter(chapterId: number, startLineId?: number): Promise<DialogueLine | null> {
    const chapter = await loadChapterModule(chapterId, this.locale);
    this.indexChapter(chapter);

    const firstLine = typeof startLineId === "number" && this.lineIndexMap.has(startLineId)
      ? chapter.lines[this.lineIndexMap.get(startLineId)!]
      : chapter.lines[0] ?? null;

    this.currentLineId = firstLine?.id ?? null;
    this.saveMemory();

    return this.deliverLine(firstLine, { recordHistory: false });
  }

  private getCurrentLine(): DialogueLine | null {
    if (!this.chapter || this.currentLineId == null) return null;
    const index = this.lineIndexMap.get(this.currentLineId);
    if (index == null) return null;
    return this.chapter.lines[index] ?? null;
  }

  nextLine(): DialogueLine | null {
    const chapter = this.ensureChapter();
    if (this.currentLineId == null) {
      const first = chapter.lines[0] ?? null;
      this.currentLineId = first?.id ?? null;
      this.saveMemory();
      return this.deliverLine(first);
    }

    const currentIndex = this.lineIndexMap.get(this.currentLineId);
    if (currentIndex == null) return null;

    const currentLine = chapter.lines[currentIndex];
    if (currentLine?.choices?.length) {
      this.callbacks.onChoices?.(currentLine.choices);
      return currentLine;
    }

    const next = chapter.lines[currentIndex + 1] ?? null;
    if (!next) return null;

    this.currentLineId = next.id;
    this.saveMemory();
    return this.deliverLine(next);
  }

  chooseOption(choice: DialogueChoice): DialogueLine | null {
    if (!choice) return this.getCurrentLine();
    if (typeof choice.affection === "number") {
      adjustAffection(choice.affection);
      if (choice.affection > 0) heartbeat(undefined, 1200);
    }
    if (choice.mood) {
      this.emitEmotion(choice.mood);
    }

    const chapter = this.ensureChapter();
    appendHistory({
      chapter: chapter.id,
      line: this.currentLineId ?? choice.next,
      speaker: "PLAYER",
      text: choice.text,
      choiceNext: choice.next,
      choiceSourceLine: this.currentLineId ?? undefined,
    });

    const targetLine = this.lineIndexMap.has(choice.next)
      ? chapter.lines[this.lineIndexMap.get(choice.next)!]
      : null;

    if (!targetLine) {
      console.warn(`Choice leads to missing line ${choice.next}`);
      return null;
    }

    this.currentLineId = targetLine.id;
    this.saveMemory();
    return this.deliverLine(targetLine);
  }

  async restoreMemory(): Promise<EngineState> {
    const memory = getMemory();
    this.memory = memory;

    if (memory.memoryMissing) {
      const hidden = await this.loadChapter(0);
      updateMemory({ memoryMissing: false });
      this.callbacks.onEnding?.("hidden");
      return { chapter: this.chapter, line: hidden, memory: getMemory() };
    }

    const chapterId = memory.currentChapter || 1;
    const line = await this.loadChapter(chapterId, memory.currentLine || undefined);
    return { chapter: this.chapter, line, memory: getMemory() };
  }

  snapshot(): EngineState {
    return {
      chapter: this.chapter,
      line: this.getCurrentLine(),
      memory: getMemory(),
    };
  }

  async changeLocale(locale: string): Promise<EngineState> {
    if (this.locale === locale) {
      return this.snapshot();
    }
    this.locale = locale;
    this.chapter = null;
    this.lineIndexMap.clear();
    return this.restoreMemory();
  }
}

export interface ChatMessage {
  id: string;
  speaker: "ECHO" | "PLAYER";
  text: string;
  emotion?: EmotionState;
  lineId?: number;
  timestamp: number;
}

export const createEchoMessage = (line: DialogueLine): ChatMessage => ({
  id: `echo-${line.id}-${Date.now()}`,
  speaker: "ECHO",
  text: line.text,
  emotion: line.emotion,
  lineId: line.id,
  timestamp: Date.now(),
});

export const createPlayerMessage = (choice: DialogueChoice): ChatMessage => ({
  id: `player-${choice.next}-${Date.now()}`,
  speaker: "PLAYER",
  text: choice.text,
  timestamp: Date.now(),
});

