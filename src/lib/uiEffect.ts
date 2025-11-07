"use client";

type Cleanup = () => void;

const isClient = () => typeof window !== "undefined";

const withElement = (element?: HTMLElement | null) =>
  element ?? (isClient() ? (document.querySelector("[data-echo-root]") as HTMLElement | null) : null);

export const glitch = (element?: HTMLElement | null, duration = 550) => {
  const target = withElement(element);
  if (!target) return;
  target.classList.add("animate-glitch");
  window.setTimeout(() => target.classList.remove("animate-glitch"), duration);
};

export const fadeIn = (element?: HTMLElement | null, duration = 420) => {
  const target = withElement(element);
  if (!target) return;
  target.animate(
    [
      { opacity: 0, filter: "blur(6px)" },
      { opacity: 1, filter: "blur(0px)" },
    ],
    {
      duration,
      easing: "ease-out",
      fill: "forwards",
    },
  );
};

export const fadeOut = (element?: HTMLElement | null, duration = 420) => {
  const target = withElement(element);
  if (!target) return;
  target.animate(
    [
      { opacity: 1, filter: "blur(0px)" },
      { opacity: 0, filter: "blur(8px)" },
    ],
    {
      duration,
      easing: "ease-in",
      fill: "forwards",
    },
  );
};

export const shakeCursor = (intensity = 10) => {
  if (!isClient()) return;
  const cursor = document.createElement("div");
  cursor.className = "pointer-events-none fixed z-[999] h-3 w-3 rounded-full bg-echo-glitch/80 shadow-glow";
  document.body.appendChild(cursor);

  const startX = window.innerWidth / 2;
  const startY = window.innerHeight / 2;

  const animation = cursor.animate(
    [
      { transform: `translate(${startX}px, ${startY}px)` },
      { transform: `translate(${startX + intensity}px, ${startY - intensity / 2}px)` },
      { transform: `translate(${startX - intensity}px, ${startY + intensity / 2}px)` },
      { transform: `translate(${startX}px, ${startY}px)` },
    ],
    {
      duration: 640,
      easing: "ease-in-out",
    },
  );

  animation.onfinish = () => cursor.remove();
};

export const heartbeat = (element?: HTMLElement | null, duration = 1800) => {
  const target = withElement(element);
  if (!target) return;
  target.animate(
    [
      { transform: "scale(1)", filter: "drop-shadow(0 0 0 rgba(255,226,159,0.15))" },
      { transform: "scale(1.06)", filter: "drop-shadow(0 0 20px rgba(255,226,159,0.45))" },
      { transform: "scale(1)", filter: "drop-shadow(0 0 0 rgba(255,226,159,0.2))" },
    ],
    {
      duration,
      easing: "ease-in-out",
    },
  );
};

export const watchIdle = (onIdle: () => void, timeout = 20000): Cleanup => {
  if (!isClient()) return () => undefined;

  let timer = window.setTimeout(onIdle, timeout);

  const resetTimer = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(onIdle, timeout);
  };

  const events = ["mousemove", "keydown", "mousedown", "touchstart"] as const;

  events.forEach((event) => window.addEventListener(event, resetTimer));

  return () => {
    window.clearTimeout(timer);
    events.forEach((event) => window.removeEventListener(event, resetTimer));
  };
};

export const glitchFlash = () => {
  glitch(document.body, 480);
  shakeCursor();
};

export const simulateSystemWarning = () => {
  if (!isClient()) return;
  const warning = document.createElement("div");
  warning.textContent = "ECHO // SIGNAL DESYNC";
  warning.className = "pointer-events-none fixed left-1/2 top-8 -translate-x-1/2 rounded border border-echo-glitch/40 bg-echo-surface/60 px-4 py-2 font-mono text-sm uppercase tracking-[0.3em] text-echo-glitch shadow-glow backdrop-blur";
  document.body.appendChild(warning);

  window.setTimeout(() => {
    warning.classList.add("opacity-0", "transition-opacity", "duration-500");
    window.setTimeout(() => warning.remove(), 600);
  }, 1400);
};

