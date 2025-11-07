'use client';

import type { CSSProperties } from 'react';
import type { EmotionState } from '@/lib/chapterEngine';

interface TextLineProps {
  text: string;
  emotion?: EmotionState;
  isPlayer?: boolean;
  animateTypewriter?: boolean;
  className?: string;
}

const emotionClassMap: Record<EmotionState, string> = {
  neutral: 'echo-text-neutral',
  warm: 'echo-text-warm',
  sad: 'echo-text-sad',
  glitch: 'echo-text-glitch',
};

const TextLine = ({
  text,
  emotion = 'neutral',
  isPlayer = false,
  animateTypewriter = false,
  className,
}: TextLineProps) => {
  const classes = [
    'echo-text-base',
    emotionClassMap[emotion],
    isPlayer ? 'echo-text-player' : undefined,
    animateTypewriter ? 'typewriter' : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const inlineStyle: CSSProperties = {
    // expose character count for CSS-driven effects if needed
    ['--character-count' as '--character-count']: text.length,
  };

  return (
    <span className={classes} style={inlineStyle} data-text={text}>
      {text}
    </span>
  );
};

export default TextLine;

