'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocale } from '@/i18n/LocaleProvider';
import type { ChatMessage, DialogueChoice, EmotionState } from '@/lib/chapterEngine';
import DialogueLine from './DialogueLine';

type ChatBoxProps = {
  messages: ChatMessage[];
  choices?: DialogueChoice[];
  emotion: EmotionState;
  affection: number;
  onChoice: (choice: DialogueChoice) => void | Promise<void>;
  onAdvance: () => void | Promise<void>;
  onToggleCollapse: () => void;
  collapsed?: boolean;
  disabled?: boolean;
};

export const ChatBox = ({
  messages,
  choices,
  emotion,
  affection,
  onChoice,
  onAdvance,
  onToggleCollapse,
  collapsed = false,
  disabled = false,
}: ChatBoxProps) => {
  const listRef = useRef<HTMLDivElement | null>(null);
  const [activeTypingId, setActiveTypingId] = useState<string | null>(null);
  const { t } = useLocale();

  useEffect(() => {
    if (!messages.length) return;
    const last = messages[messages.length - 1];
    if (last.speaker === 'ECHO') {
      setActiveTypingId(last.id);
    } else {
      setActiveTypingId(null);
    }
  }, [messages]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, choices, activeTypingId]);

  const handleLineComplete = useCallback(() => {
    setActiveTypingId(null);
  }, []);

  const isTyping = useMemo(() => Boolean(activeTypingId), [activeTypingId]);
  const canAdvance = useMemo(() => !choices?.length && !isTyping, [choices, isTyping]);
  const collapseLabel = collapsed ? t('ui.expandChat') : t('ui.collapseChat');
  return (
    <div className="flex h-full flex-col gap-4 rounded-3xl border border-white/5 bg-echo-surface/80 p-6 backdrop-blur-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-echo-accent/70">{t('ui.sessionLink')}</p>
          <h1 className="text-2xl font-medium text-echo-glow">{t('ui.projectEcho')}</h1>
        </div>
        <div className="flex flex-col items-end gap-2 text-right">
          <motion.span
            key={emotion}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-full border border-echo-accent/30 px-3 py-1 text-xs font-mono uppercase tracking-[0.2em] text-echo-accent"
          >
            {t(`emotion.${emotion}`)}
          </motion.span>
          <motion.button
            type="button"
            onClick={onToggleCollapse}
            className="rounded-full border border-echo-accent/30 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.35em] text-echo-accent/80 transition hover:border-echo-glow/60 hover:text-echo-glow"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {collapseLabel}
          </motion.button>
        </div>
      </div>

      <AnimatePresence initial={false} mode="sync">
        {!collapsed && (
          <motion.div
            key="chat-body"
            ref={listRef}
            className="flex-1 overflow-y-auto rounded-2xl border border-white/5 bg-black/30 p-4 shadow-inner"
            style={{ maxHeight: '60vh' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {messages.map((message) => (
                <DialogueLine
                  key={message.id}
                  message={message}
                  isActive={activeTypingId === message.id}
                  onComplete={handleLineComplete}
                />
              ))}
              {isTyping && (
                <motion.div
                  className="mt-3 flex items-center gap-2 text-sm text-echo-accent/80"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.span
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: 0.9 }}
                    transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse' }}
                  >
                    ECHO
                  </motion.span>
                  <motion.span
                    className="flex items-center gap-1"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: {
                        transition: {
                          staggerChildren: 0.18,
                          repeat: Infinity,
                          repeatType: 'reverse',
                        },
                      },
                    }}
                  >
                    {[0, 1, 2].map((dot) => (
                      <motion.span
                        key={dot}
                        className="h-1.5 w-1.5 rounded-full bg-echo-accent"
                        variants={{
                          hidden: { opacity: 0.2 },
                          visible: { opacity: 0.9 },
                        }}
                      />
                    ))}
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false} mode="sync">
        {!collapsed && (
          <motion.div
            key="chat-controls"
            className="flex flex-col gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.35em] text-echo-accent/60">
              <span>
                {t('ui.affection')} {Math.round(affection * 10) / 10}
              </span>
              {choices?.length ? (
                <span>{disabled ? t('ui.echoRecalling') : t('ui.chooseReply')}</span>
              ) : canAdvance && !disabled ? (
                <span>{t('ui.tapToContinue')}</span>
              ) : (
                <span>&nbsp;</span>
              )}
            </div>

            {choices?.length ? (
              <div className="grid gap-2">
                {choices.map((choice) => (
                  <motion.button
                    key={choice.text}
                    type="button"
                    onClick={() => !disabled && onChoice(choice)}
                    disabled={disabled}
                    className="w-full rounded-2xl border border-echo-accent/30 bg-echo-accent/10 px-4 py-3 text-left font-mono text-sm text-echo-glow transition hover:border-echo-glow/60 hover:bg-echo-accent/20 disabled:cursor-not-allowed disabled:opacity-40"
                    whileHover={!disabled ? { scale: 1.01 } : undefined}
                    whileTap={!disabled ? { scale: 0.98 } : undefined}
                  >
                    {choice.text}
                  </motion.button>
                ))}
              </div>
            ) : (
              <motion.button
                type="button"
                onClick={() => !disabled && onAdvance()}
                disabled={!canAdvance || disabled}
                className="w-full rounded-2xl border border-echo-accent/30 bg-black/40 px-4 py-3 font-mono text-sm uppercase tracking-[0.3em] text-echo-glow transition disabled:cursor-not-allowed disabled:opacity-40"
                whileHover={canAdvance && !disabled ? { scale: 1.02 } : undefined}
                whileTap={canAdvance && !disabled ? { scale: 0.98 } : undefined}
              >
                {t('ui.continue')}
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBox;

