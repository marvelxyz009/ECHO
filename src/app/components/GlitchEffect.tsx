'use client';

import { AnimatePresence, motion } from 'framer-motion';

type GlitchEffectProps = {
  active: boolean;
};

const GlitchEffect = ({ active }: GlitchEffectProps) => {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="glitch"
          className="pointer-events-none absolute inset-0 rounded-[2.5rem] mix-blend-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 0.45, 0.1] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.1, repeatType: 'mirror' }}
        >
          <div className="absolute inset-0 animate-pulse rounded-[2.5rem] bg-[linear-gradient(90deg,rgba(255,77,141,0.35)_0%,transparent_40%,rgba(166,208,255,0.25)_80%)]" />
          <div className="absolute inset-0 animate-glitch rounded-[2.5rem] bg-[repeating-linear-gradient(0deg,rgba(255,77,141,0.15)_0px,rgba(255,77,141,0.15)_1px,transparent_1px,transparent_3px)]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlitchEffect;

