'use client';

import { motion } from 'framer-motion';
import type { EmotionState } from '@/lib/chapterEngine';
import { useLocale } from '@/i18n/LocaleProvider';
import GlitchEffect from './GlitchEffect';

type EchoSpriteProps = {
  emotion: EmotionState;
  affection: number;
  reloadCount: number;
};

const emotionVariants: Record<EmotionState, { eye: string; mouth: string; aura: string; auraOverlay: string }> = {
  neutral: {
    eye: 'bg-echo-glow/70',
    mouth: 'bg-echo-glow/40',
    aura: 'shadow-[0_0_35px_rgba(166,208,255,0.35)]',
    auraOverlay: 'from-echo-surface/40 via-black/70 to-black/80',
  },
  warm: {
    eye: 'bg-echo-glow',
    mouth: 'bg-echo-glow/80',
    aura: 'shadow-[0_0_55px_rgba(255,226,159,0.45)]',
    auraOverlay: 'from-echo-glow/20 via-black/65 to-black/85',
  },
  sad: {
    eye: 'bg-echo-accent/50',
    mouth: 'bg-echo-accent/30',
    aura: 'shadow-[0_0_45px_rgba(86,125,191,0.35)]',
    auraOverlay: 'from-[#1d2542]/60 via-black/80 to-black/90',
  },
  glitch: {
    eye: 'bg-echo-glitch',
    mouth: 'bg-echo-glitch/80',
    aura: 'shadow-[0_0_65px_rgba(255,77,141,0.55)]',
    auraOverlay: 'from-echo-glitch/40 via-black/80 to-black',
  },
};

const statusDialogue = (emotion: EmotionState, reloadCount: number, affection: number, t: (key: string) => string) => {
  if (reloadCount > 3) {
    return t('sprite.reload');
  }
  if (emotion === 'glitch') {
    return t('sprite.glitch');
  }
  if (emotion === 'sad') {
    return t('sprite.sad');
  }
  if (emotion === 'warm' && affection >= 8) {
    return t('sprite.warmHope');
  }
  if (emotion === 'warm') {
    return t('sprite.warm');
  }
  return t('sprite.neutral');
};

const EchoSprite = ({ emotion, affection, reloadCount }: EchoSpriteProps) => {
  const { t } = useLocale();
  const palette = emotionVariants[emotion];
  const dialogue = statusDialogue(emotion, reloadCount, affection, t);

  return (
    <motion.div
      data-echo-root
      className={`relative flex h-full w-full max-w-sm flex-col items-center justify-center rounded-[2.5rem] border border-white/5 bg-black/40 p-10 backdrop-blur-xl ${palette.aura}`}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle_at_top,_rgba(166,208,255,0.2),_transparent_55%)]" />
      <div className="relative flex flex-col items-center gap-6">
        <motion.div
          key={emotion}
          className={`relative flex h-52 w-52 flex-col items-center justify-center rounded-full border border-echo-accent/30 bg-gradient-to-b ${palette.auraOverlay}`}
          initial={{ opacity: 0.7, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_rgba(166,208,255,0.25)_0%,_transparent_72%)]" />
          <motion.div
            className="relative mt-6 flex items-center gap-8"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.span
              className={`h-6 w-10 rounded-full ${palette.eye} blur-[1px]`}
              animate={{ scaleY: [1, 0.2, 1] }}
              transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
            />
            <motion.span
              className={`h-6 w-10 rounded-full ${palette.eye} blur-[1px]`}
              animate={{ scaleY: [1, 0.15, 1] }}
              transition={{ duration: 5, repeat: Infinity, repeatDelay: 3.2, ease: 'easeInOut' }}
            />
          </motion.div>
          <motion.span
            key={`${emotion}-mouth`}
            className={`absolute bottom-12 h-2 w-20 rounded-full ${palette.mouth}`}
            initial={{ scaleX: 0.6 }}
            animate={{
              scaleX: emotion === 'glitch' ? [0.7, 1.25, 0.6] : emotion === 'sad' ? [0.5, 0.6, 0.5] : [0.6, 0.9, 0.6],
            }}
            transition={{ duration: emotion === 'glitch' ? 0.25 : 1.8, repeat: Infinity, repeatType: 'mirror' }}
          />
          <motion.div
            className="absolute bottom-2 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.4em] text-echo-accent/70"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <span>echo</span>
            <span>listening</span>
          </motion.div>
        </motion.div>

        <motion.p
          className="relative text-center text-sm text-echo-accent/70"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          key={dialogue}
        >
          {dialogue}
        </motion.p>
      </div>
      <GlitchEffect active={emotion === 'glitch'} />
    </motion.div>
  );
};

export default EchoSprite;

