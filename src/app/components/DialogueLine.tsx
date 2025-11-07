'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { ChatMessage, EmotionState } from '@/lib/chapterEngine';
import TextLine from '@/app/components/TextLine';

type DialogueLineProps = {
  message: ChatMessage;
  isActive: boolean;
  onComplete?: () => void;
};

const bubbleVariants = {
  initial: { opacity: 0, y: 8, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -6, filter: 'blur(6px)' },
};

const baseBubbleClasses = 'max-w-[75%] rounded-2xl border px-4 py-3 text-sm leading-relaxed shadow-lg backdrop-blur';

const palettes: Record<EmotionState, { bubble: string; speaker: string }> = {
  neutral: {
    bubble: `${baseBubbleClasses} border-white/10 bg-white/5 text-echo-glow`,
    speaker: 'text-white/50',
  },
  warm: {
    bubble: `${baseBubbleClasses} border-echo-glow/40 bg-echo-glow/10 text-echo-glow`,
    speaker: 'text-echo-glow/70',
  },
  sad: {
    bubble: `${baseBubbleClasses} border-echo-accent/20 bg-echo-accent/10 text-echo-accent`,
    speaker: 'text-echo-accent/60',
  },
  glitch: {
    bubble: `${baseBubbleClasses} border-echo-glitch/40 bg-echo-glitch/15 text-echo-glitch`,
    speaker: 'text-echo-glitch/70',
  },
};

const getStyleBySpeaker = (message: ChatMessage) => {
  if (message.speaker === 'PLAYER') {
    return {
      container: 'items-end',
      bubble: `${baseBubbleClasses} border-echo-accent/40 bg-echo-accent/10 text-right text-echo-accent`,
      speaker: 'text-echo-accent/70',
    } as const;
  }

  const emotion = message.emotion ?? 'neutral';
  return {
    container: 'items-start',
    bubble: palettes[emotion].bubble,
    speaker: palettes[emotion].speaker,
  } as const;
};

const DialogueLine = ({ message, isActive, onComplete }: DialogueLineProps) => {
  const { container, bubble, speaker } = getStyleBySpeaker(message);
  const [displayText, setDisplayText] = useState(message.speaker === 'ECHO' ? '' : message.text);
  const resolvedEmotion: EmotionState = message.emotion ?? (message.speaker === 'PLAYER' ? 'warm' : 'neutral');

  useEffect(() => {
    if (message.speaker !== 'ECHO') {
      setDisplayText(message.text);
      return;
    }

    if (!isActive) {
      setDisplayText(message.text);
      return;
    }

    setDisplayText('');

    const interval = window.setInterval(() => {
      setDisplayText((prev) => {
        const nextLength = Math.min(message.text.length, prev.length + 1);
        const next = message.text.slice(0, nextLength);
        if (nextLength === message.text.length) {
          window.clearInterval(interval);
          if (onComplete) {
            queueMicrotask(() => onComplete());
          }
        }
        return next;
      });
    }, 28 + Math.random() * 14);

    return () => {
      window.clearInterval(interval);
    };
  }, [isActive, message.id, message.speaker, message.text, onComplete]);

  return (
    <motion.div
      layout
      variants={bubbleVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`mb-3 flex flex-col gap-1 ${container}`}
    >
      <span className={`font-mono text-[10px] uppercase tracking-[0.4em] ${speaker}`}>
        {message.speaker}
      </span>
      <p className={bubble}>
        <TextLine
          text={displayText}
          emotion={resolvedEmotion}
          isPlayer={message.speaker === 'PLAYER'}
          animateTypewriter={message.speaker === 'ECHO' && isActive}
        />
      </p>
    </motion.div>
  );
};

export default DialogueLine;

