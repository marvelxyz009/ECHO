'use client';

import { motion } from 'framer-motion';

const HeartbeatLight = () => (
  <motion.div
    className="pointer-events-none absolute inset-0 -z-10"
    initial={{ opacity: 0.2 }}
    animate={{ opacity: [0.2, 0.4, 0.22] }}
    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
  >
    <div className="absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-echo-accent/15 blur-3xl" />
    <div className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-echo-glow/15 blur-2xl" />
  </motion.div>
);

export default HeartbeatLight;

