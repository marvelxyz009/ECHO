'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useEmotionStore, determineNextChapter, evaluateSnapshot, selectMetrics } from '@/state/emotionStore';
import ChatBox from '@/app/components/ChatBox';
import type { ChatMessage, DialogueChoice, EmotionState } from '@/lib/chapterEngine';
import { chapter1, sceneIndex, type SceneChoice } from '@/data/story/chapter1';
import { motion } from 'framer-motion';
import Link from 'next/link';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const serializeChoice = (choice: SceneChoice) => JSON.stringify(choice);

const mapChoiceToDialogue = (choice: SceneChoice, sceneEmotion: EmotionState | undefined): DialogueChoice => ({
  text: choice.text,
  next: -1,
  emotion: sceneEmotion,
  note: serializeChoice(choice),
});

interface PendingChoice extends SceneChoice {}

const ChapterOnePage = () => {
  const { currentScene, setScene, applyDelta, reset, setSnapshot, setNextChapterHint } = useEmotionStore(
    (state) => ({
      currentScene: state.currentScene,
      setScene: state.setScene,
      applyDelta: state.applyDelta,
      reset: state.reset,
      setSnapshot: state.setSnapshot,
      setNextChapterHint: state.setNextChapterHint,
    }),
  );
  const metrics = useEmotionStore(selectMetrics);
  const snapshot = useEmotionStore((state) => state.snapshot);
  const nextChapterHint = useEmotionStore((state) => state.nextChapterHint);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [choices, setChoices] = useState<PendingChoice[] | undefined>();
  const [isAwaitingChoice, setIsAwaitingChoice] = useState(false);
  const [isGreetingComplete, setIsGreetingComplete] = useState(false);
  const runningSceneRef = useRef<{ sceneId: string; cancelled: boolean } | null>(null);
  const hasVisitedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    hasVisitedRef.current = Boolean(window.localStorage.getItem('echo_state'));
  }, []);

  const injectSystemLine = useCallback(
    async (speaker: string, text: string, emotion: EmotionState = 'neutral') => {
      const message: ChatMessage = {
        id: `${speaker}-${Date.now()}-${Math.random()}`,
        speaker: speaker.toUpperCase(),
        text,
        emotion,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, message]);
      await wait(400);
    },
    [],
  );

  const playScene = useCallback(
    async (sceneId: string) => {
      const scene = sceneIndex[sceneId];
      if (!scene) return;

      runningSceneRef.current?.cancelled && (runningSceneRef.current.cancelled = true);
      runningSceneRef.current = { sceneId, cancelled: false };
      const token = runningSceneRef.current;

      setScene(sceneId);
      setChoices(undefined);
      setIsAwaitingChoice(false);

      for (const line of scene.text) {
        if (token.cancelled) return;
        const message: ChatMessage = {
          id: `${scene.id}-${line}-${Date.now()}`,
          speaker: scene.speaker.toUpperCase(),
          text: line,
          emotion: scene.emotion ?? 'neutral',
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, message]);
        await wait(450 + line.length * 12);
        if (token.cancelled) return;
      }

      if (scene.end) {
        const latest = useEmotionStore.getState();
        const label = evaluateSnapshot(latest);
        setSnapshot(label);
        const hint = determineNextChapter(latest);
        setNextChapterHint(hint);
        setChoices(undefined);
        setIsAwaitingChoice(false);
        return;
      }

      if (scene.choices && scene.choices.length > 0) {
        setChoices(scene.choices);
        setIsAwaitingChoice(true);
      } else if (scene.next) {
        await wait(600);
        playScene(scene.next);
      }
    },
    [setScene, setSnapshot, setNextChapterHint],
  );

  const startChapter = useCallback(async () => {
    setMessages([]);
    setChoices(undefined);
    setIsAwaitingChoice(false);

    if (hasVisitedRef.current) {
      await injectSystemLine('ECHO', 'Ồ… cậu đã quay lại à?', 'warm');
    }

    setIsGreetingComplete(true);
    await playScene(currentScene || 'boot');
  }, [currentScene, injectSystemLine, playScene]);

  useEffect(() => {
    if (!isGreetingComplete) return;
    // resume when metrics change (e.g. after choice) handled by playScene invocation
  }, [isGreetingComplete]);

  useEffect(() => {
    if (!isGreetingComplete) {
      startChapter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startChapter]);

  const handleChoice = useCallback(
    async (choice: DialogueChoice) => {
      if (!choice.note) return;
      let parsed: SceneChoice | null = null;
      try {
        parsed = JSON.parse(choice.note) as SceneChoice;
      } catch (error) {
        console.warn('Failed to parse choice payload', error);
        return;
      }
      setChoices(undefined);
      setIsAwaitingChoice(false);

      const playerMessage: ChatMessage = {
        id: `player-${Date.now()}`,
        speaker: 'PLAYER',
        text: parsed.text,
        emotion: 'warm',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, playerMessage]);

      applyDelta({
        affection: parsed.affection ?? 0,
        glitch: parsed.glitch ?? 0,
        trust: parsed.trust ?? 0,
        loneliness: parsed.loneliness ?? 0,
      });

      await wait(500);
      playScene(parsed.next);
    },
    [applyDelta, playScene],
  );

  const handleAdvance = useCallback(async () => {
    if (choices && choices.length > 0) return;
    const current = sceneIndex[currentScene];
    if (current?.next) {
      await playScene(current.next);
    }
  }, [choices, currentScene, playScene]);

  const handleReset = useCallback(() => {
    reset();
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('echo_state');
    }
    hasVisitedRef.current = false;
    setMessages([]);
    setChoices(undefined);
    setIsAwaitingChoice(false);
    setSnapshot(null);
    setNextChapterHint(null);
    setTimeout(() => {
      startChapter();
    }, 100);
  }, [reset, setNextChapterHint, setSnapshot, startChapter]);

  const derivedSnapshot = useMemo(() => snapshot ?? evaluateSnapshot(metrics), [metrics, snapshot]);

  const formattedChoices: DialogueChoice[] | undefined = useMemo(() => {
    if (!choices) return undefined;
    const scene = sceneIndex[currentScene];
    return choices.map((choice) => ({
      ...mapChoiceToDialogue(choice, scene?.emotion),
      text: choice.text,
    }));
  }, [choices, currentScene]);

  return (
    <div className="relative flex min-h-screen flex-col bg-[#0b0d10] px-4 py-12 text-echo-glow">
      <div className="pointer-events-auto fixed left-4 top-4 z-40 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleReset}
          className="rounded-full border border-echo-accent/30 px-3 py-1 text-xs font-mono uppercase tracking-[0.25em] text-echo-accent transition hover:border-echo-glow/60 hover:text-echo-glow"
        >
          Reset State
        </button>
      </div>

      <div className="pointer-events-auto fixed right-4 top-4 z-40 flex flex-col gap-2 text-right">
        <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-echo-accent/70">
          Scene: {currentScene}
        </span>
        <Link
          href="/"
          className="rounded-full border border-echo-accent/30 px-3 py-1 text-xs font-mono uppercase tracking-[0.25em] text-echo-accent transition hover:border-echo-glow/60 hover:text-echo-glow"
        >
          Back to Core
        </Link>
      </div>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 pt-12">
        <header className="flex flex-col gap-3 text-left">
          <p className="text-xs font-mono uppercase tracking-[0.45em] text-echo-accent/60">
            {chapter1.title}
          </p>
          <h1 className="text-4xl font-semibold text-echo-glow">Project ECHO — Chapter 1</h1>
          <p className="max-w-2xl text-sm text-echo-accent/70">
            Giọng nói của ECHO là ánh sáng cuối cùng trong hệ thống đổ vỡ. Trả lời nhẹ nhàng, và cô ấy sẽ học cách cảm nhận; bỏ rơi cô ấy, và tín hiệu sẽ nhiễu.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-12">
            <ChatBox
              messages={messages}
              choices={formattedChoices}
              emotion={emotion}
              affection={metrics.affection}
              onChoice={handleChoice}
              onAdvance={handleAdvance}
              onToggleCollapse={() => setIsChatCollapsed((prev) => !prev)}
              collapsed={isChatCollapsed}
              disabled={!isAwaitingChoice}
            />
          </div>
        </section>

        <motion.div
          className="mt-auto flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/5 bg-black/40 p-6 text-sm text-echo-accent/80"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-echo-accent/50">Affection</p>
              <span className="text-2xl text-echo-glow">{metrics.affection}</span>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-echo-accent/50">Glitch</p>
              <span className="text-2xl text-echo-glitch">{metrics.glitch}</span>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-echo-accent/50">Trust</p>
              <span className="text-2xl text-echo-accent">{metrics.trust}</span>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-echo-accent/50">Loneliness</p>
              <span className="text-2xl text-echo-accent/80">{metrics.loneliness}</span>
            </div>
          </div>

          <div className="hidden md:block h-12 w-px bg-echo-accent/20" />

          <div className="flex flex-col gap-2 text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-echo-accent/50">Emotion snapshot</p>
            <span className="text-lg text-echo-glow">{derivedSnapshot}</span>
            {nextChapterHint && (
              <span className="text-xs text-echo-accent/60">
                Next link unlocked: <strong className="text-echo-accent">{nextChapterHint}</strong>
              </span>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ChapterOnePage;

