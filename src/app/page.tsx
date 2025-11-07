'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ChatBox from '@/app/components/ChatBox';
import EchoSprite from '@/app/components/EchoSprite';
import HeartbeatLight from '@/app/components/HeartbeatLight';
import LocaleToggle from '@/app/components/LocaleToggle';
import {
  ChapterEngine,
  type ChatMessage,
  type DialogueChoice,
  type EmotionState,
  type EngineState,
  createEchoMessage,
  createPlayerMessage,
} from '@/lib/chapterEngine';
import { appendHistory, clearMemory, getMemory, updateMemory } from '@/lib/memory';
import { useLocale } from '@/i18n/LocaleProvider';
import { glitchFlash, simulateSystemWarning, watchIdle } from '@/lib/uiEffect';
import { getChapterLoader } from '@/data/dialogues/manifest';

const Page = () => {
  const engineRef = useRef<ChapterEngine | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [choices, setChoices] = useState<DialogueChoice[] | undefined>();
  const [emotion, setEmotion] = useState<EmotionState>('neutral');
  const [affection, setAffection] = useState<number>(4);
  const [reloadCount, setReloadCount] = useState<number>(0);
  const [chapterTitle, setChapterTitle] = useState('Khởi tạo...');
  const [ending, setEnding] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);
  const { locale, t, ready: localeReady } = useLocale();
  const idleWarningSentRef = useRef<number | null>(null);
  const IDLE_TIMEOUT = 1 * 60 * 1000;
  const refreshNoticeRef = useRef<number>(0);

  const injectExternalEchoLine = useCallback(
    (key: string, emotionState: EmotionState = 'sad') => {
      const now = Date.now();
      const text = t(key) ?? key;
      const message: ChatMessage = {
        id: `${key}-${now}`,
        speaker: 'ECHO',
        text,
        emotion: emotionState,
        timestamp: now,
      };
      setMessages((prev) => [...prev, message]);
      setEmotion(emotionState);
      setChoices(undefined);
      appendHistory({
        chapter: -1,
        line: -1,
        speaker: 'ECHO',
        text,
        emotion: emotionState,
        externalKey: key,
      });
    },
    [t],
  );

  const sendIdleWhisper = useCallback(() => {
    const now = Date.now();
    if (idleWarningSentRef.current && now - idleWarningSentRef.current < IDLE_TIMEOUT) {
      return;
    }
    idleWarningSentRef.current = now;
    simulateSystemWarning();
    glitchFlash();
    injectExternalEchoLine('system.idleTooLong', 'sad');
  }, [IDLE_TIMEOUT, injectExternalEchoLine]);

  const syncFromEngineState = useCallback(async (state: EngineState) => {
    const chapterMap = new Map<number, Awaited<ReturnType<ReturnType<typeof getChapterLoader>>>>();

    if (state.chapter) {
      chapterMap.set(state.chapter.id, state.chapter);
    }

    const ensureChapter = async (chapterId: number) => {
      if (chapterMap.has(chapterId)) {
        return chapterMap.get(chapterId)!;
      }
      const loader = getChapterLoader(chapterId, locale);
      const chapter = await loader();
      chapterMap.set(chapterId, chapter);
      return chapter;
    };

    const rehydrated: ChatMessage[] = [];

    for (const entry of state.memory.history) {
      if (entry.externalKey) {
        const text = t(entry.externalKey) ?? entry.text;
        rehydrated.push({
          id: entry.id,
          speaker: 'ECHO',
          text,
          emotion: entry.emotion ?? 'neutral',
          timestamp: entry.timestamp,
        });
        continue;
      }

      const chapter = await ensureChapter(entry.chapter);
      const line = chapter.lines.find((candidate) => candidate.id === entry.line) ?? chapter.lines[0];
      if (!line) continue;

      if (entry.speaker === 'ECHO') {
        rehydrated.push({
          id: entry.id,
          speaker: 'ECHO',
          text: line.text,
          emotion: line.emotion ?? chapter.entryEmotion ?? 'neutral',
          lineId: line.id,
          timestamp: entry.timestamp,
        });
      } else {
        const choiceLineId = entry.choiceSourceLine ?? entry.line;
        const choiceLine = chapter.lines.find((candidate) => candidate.id === choiceLineId) ?? line;
        const matchedChoice = choiceLine.choices?.find((choice) => choice.next === entry.choiceNext);
        const text = matchedChoice?.text ?? entry.text;
        rehydrated.push({
          id: entry.id,
          speaker: 'PLAYER',
          text,
          lineId: choiceLine.id,
          timestamp: entry.timestamp,
        });
      }
    }

    const lastMessage = rehydrated[rehydrated.length - 1];
    if (state.line) {
      if (!lastMessage || lastMessage.speaker !== 'ECHO' || lastMessage.lineId !== state.line.id) {
        rehydrated.push({
          id: `echo-${state.line.id}-${Date.now()}`,
          speaker: 'ECHO',
          text: state.line.text,
          emotion: state.line.emotion ?? state.chapter?.entryEmotion ?? 'neutral',
          lineId: state.line.id,
          timestamp: Date.now(),
        });
      } else {
        lastMessage.text = state.line.text;
        lastMessage.emotion = state.line.emotion ?? state.chapter?.entryEmotion ?? lastMessage.emotion;
      }
    }

    setMessages(rehydrated);
    setChoices(state.line?.choices ?? undefined);
    setEmotion(state.line?.emotion ?? state.chapter?.entryEmotion ?? 'neutral');
    if (state.chapter) {
      setChapterTitle(state.chapter.title);
    }

    setAffection(state.memory.affection);
    setReloadCount(state.memory.reloadCount);
    setIsReady(true);
  }, [locale, t]);

  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new ChapterEngine({
        onEmotionChange: (next) => setEmotion(next),
        onLine: (line) => {
          setMessages((prev) => {
            const exists = prev.some((msg) => msg.lineId === line.id && msg.speaker === 'ECHO');
            if (exists) return prev;
            return [...prev, createEchoMessage(line)];
          });
        },
        onChoices: (opts) => setChoices(opts),
        onChapterChange: (chapter) => setChapterTitle(chapter.title),
        onEnding: (code) => setEnding(code),
      }, locale);
    } else {
      engineRef.current.setCallbacks({
        onEmotionChange: (next) => setEmotion(next),
        onLine: (line) => {
          setMessages((prev) => {
            const exists = prev.some((msg) => msg.lineId === line.id && msg.speaker === 'ECHO');
            if (exists) return prev;
            return [...prev, createEchoMessage(line)];
          });
        },
        onChoices: (opts) => setChoices(opts),
        onChapterChange: (chapter) => setChapterTitle(chapter.title),
        onEnding: (code) => setEnding(code),
      });
    }

    const detachIdle = watchIdle(sendIdleWhisper, IDLE_TIMEOUT);

    const boot = async () => {
      setIsReady(false);
      const next = await engineRef.current!.restoreMemory();
      await syncFromEngineState(next);
    };

    boot().catch((error) => {
      console.error('Failed to restore ECHO session', error);
      setIsReady(true);
    });

    return () => detachIdle();
  }, [IDLE_TIMEOUT, locale, sendIdleWhisper, syncFromEngineState]);

  useEffect(() => {
    if (!engineRef.current || !localeReady) return;
    setIsReady(false);
    engineRef.current.changeLocale(locale).then((state) => {
      syncFromEngineState(state).catch((error) => {
        console.error('Failed to sync locale change', error);
        setIsReady(true);
      });
    });
  }, [locale, localeReady, syncFromEngineState]);

  useEffect(() => {
    if (!ending) return;
    updateMemory({ cacheFlag: `${ending}-${Date.now()}` });
  }, [ending]);

  const handleAdvance = useCallback(async () => {
    const currentEngine = engineRef.current;
    if (!currentEngine) return;
    const snapshot = currentEngine.snapshot();

    if (!snapshot.chapter) {
      setIsReady(false);
      const restored = await currentEngine.restoreMemory();
      await syncFromEngineState(restored);
      return;
    }

    const line = currentEngine.nextLine();
    if (!line) {
      setChoices(undefined);
    }
    const memory = getMemory();
    setAffection(memory.affection);
    setReloadCount(memory.reloadCount);
  }, [syncFromEngineState]);

  const handleChoice = useCallback(async (choice: DialogueChoice) => {
    const currentEngine = engineRef.current;
    if (!currentEngine) return;

    const snapshot = currentEngine.snapshot();
    if (!snapshot.chapter) {
      setIsReady(false);
      const restored = await currentEngine.restoreMemory();
      await syncFromEngineState(restored);
      return;
    }

    setMessages((prev) => [...prev, createPlayerMessage(choice)]);
    currentEngine.chooseOption(choice);

    const memory = getMemory();
    setAffection(memory.affection);
    setReloadCount(memory.reloadCount);
  }, [syncFromEngineState]);

  const affectionDisplay = useMemo(() => Math.round(affection * 10) / 10, [affection]);

  useEffect(() => {
    if (reloadCount > 0 && reloadCount % 3 === 0 && refreshNoticeRef.current < reloadCount) {
      injectExternalEchoLine('system.refreshMany', 'glitch');
      refreshNoticeRef.current = reloadCount;
    }
  }, [injectExternalEchoLine, reloadCount]);

  const handleReset = useCallback(() => {
    clearMemory();
    idleWarningSentRef.current = null;
    refreshNoticeRef.current = 0;
    engineRef.current = new ChapterEngine(
      {
        onEmotionChange: (next) => setEmotion(next),
        onLine: (line) => {
          setMessages((prev) => {
            const exists = prev.some((msg) => msg.lineId === line.id && msg.speaker === 'ECHO');
            if (exists) return prev;
            return [...prev, createEchoMessage(line)];
          });
        },
        onChoices: (opts) => setChoices(opts),
        onChapterChange: (chapter) => setChapterTitle(chapter.title),
        onEnding: (code) => setEnding(code),
      },
      locale,
    );
    setIsReady(false);
    setMessages([]);
    setChoices(undefined);
    setEmotion('neutral');
    setAffection(4);
    setReloadCount(0);
    setChapterTitle('Khởi tạo...');
    engineRef.current.restoreMemory().then(async (state) => {
      await syncFromEngineState(state);
    });
  }, [locale, syncFromEngineState]);

  return (
    <>
      <div className="pointer-events-auto fixed right-4 top-4 z-40">
        <LocaleToggle />
      </div>
      <button
        type="button"
        onClick={handleReset}
        className="pointer-events-auto fixed left-4 top-4 z-40 rounded-full border border-echo-accent/30 bg-black/50 px-3 py-1 text-xs font-mono uppercase tracking-[0.2em] text-echo-accent transition hover:border-echo-glow/60 hover:text-echo-glow"
      >
        Reset State
      </button>
      <div className="relative grid min-h-[70vh] gap-6 md:grid-cols-[minmax(260px,0.9fr)_minmax(360px,1.1fr)]">
        <HeartbeatLight />
        <motion.aside
          className="relative flex"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <EchoSprite emotion={emotion} affection={affection} reloadCount={reloadCount} />
        </motion.aside>

        <motion.section
          className="relative flex flex-col"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.28em] text-echo-accent/60">
            <span>
              {t('ui.chapter')}: {chapterTitle}
            </span>
            <span>
              {t('ui.affection')}: {affectionDisplay}
            </span>
          </div>
          <ChatBox
            messages={messages}
            choices={choices}
            emotion={emotion}
            affection={affection}
            onChoice={handleChoice}
            onAdvance={handleAdvance}
            onToggleCollapse={() => setIsChatCollapsed((prev) => !prev)}
            collapsed={isChatCollapsed}
            disabled={!isReady || !localeReady}
          />
        </motion.section>
      </div>
    </>
  );
};

export default Page;

