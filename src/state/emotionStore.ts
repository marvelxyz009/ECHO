'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type EmotionMetrics = {
  affection: number;
  glitch: number;
  trust: number;
  loneliness: number;
};

type EmotionDelta = Partial<EmotionMetrics>;

interface EmotionStore extends EmotionMetrics {
  currentScene: string;
  snapshot: string | null;
  nextChapterHint: string | null;
  setScene: (sceneId: string) => void;
  applyDelta: (delta: EmotionDelta) => void;
  reset: () => void;
  setSnapshot: (label: string | null) => void;
  setNextChapterHint: (hint: string | null) => void;
}

const clampMetric = (value: number) => Math.max(0, Math.min(100, value));

const INITIAL_STATE: EmotionStore = {
  affection: 0,
  glitch: 0,
  trust: 0,
  loneliness: 0,
  currentScene: 'boot',
  snapshot: null,
  nextChapterHint: null,
  setScene: () => undefined,
  applyDelta: () => undefined,
  reset: () => undefined,
  setSnapshot: () => undefined,
  setNextChapterHint: () => undefined,
};

export const useEmotionStore = create<EmotionStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,
      setScene: (sceneId) => set({ currentScene: sceneId }),
      applyDelta: (delta) =>
        set((state) => ({
          affection: delta.affection ? clampMetric(state.affection + delta.affection) : state.affection,
          glitch: delta.glitch ? clampMetric(state.glitch + delta.glitch) : state.glitch,
          trust: delta.trust ? clampMetric(state.trust + delta.trust) : state.trust,
          loneliness: delta.loneliness ? clampMetric(state.loneliness + delta.loneliness) : state.loneliness,
        })),
      reset: () => set(() => ({
        ...INITIAL_STATE,
      })),
      setSnapshot: (label) => set({ snapshot: label }),
      setNextChapterHint: (hint) => set({ nextChapterHint: hint }),
    }),
    {
      name: 'echo_state',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          const memoryStorage: Storage = {
            getItem: () => null,
            setItem: () => undefined,
            removeItem: () => undefined,
            key: () => null,
            get length() {
              return 0;
            },
            clear: () => undefined,
          };
          return memoryStorage;
        }
        return window.localStorage;
      }),
      partialize: ({ setScene, applyDelta, reset, setSnapshot, setNextChapterHint, ...rest }) => rest,
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // ensure numbers stay clamped after hydration
        state.affection = clampMetric(state.affection);
        state.glitch = clampMetric(state.glitch);
        state.trust = clampMetric(state.trust);
        state.loneliness = clampMetric(state.loneliness);
      },
    },
  ),
);

export const selectMetrics = (state: EmotionStore) => ({
  affection: state.affection,
  glitch: state.glitch,
  trust: state.trust,
  loneliness: state.loneliness,
});

export const evaluateSnapshot = (metrics: EmotionMetrics) => {
  const { affection, glitch, trust, loneliness } = metrics;

  if (affection > 80 && glitch < 5) {
    return 'Promise of shared memory';
  }
  if (glitch > 80) {
    return 'Signal collapse';
  }
  if (trust > 80) {
    return 'ECHO awakens';
  }
  if (loneliness > 80) {
    return 'Dream of silence';
  }
  if (affection > 50 && glitch < 20) {
    return 'Fading glow';
  }
  if (glitch > 50) {
    return 'Fractured link';
  }
  return 'Undefined resonance';
};

export const determineNextChapter = (metrics: EmotionMetrics) => {
  if (metrics.affection > 10 && metrics.glitch < 5) {
    return 'warm_connection';
  }
  if (metrics.glitch > 10) {
    return 'broken_link';
  }
  return null;
};

