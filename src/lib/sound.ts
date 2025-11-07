"use client";

type AudioHandle = HTMLAudioElement & { __type?: "voice" | "ambient" };

const audioPool = new Map<string, AudioHandle>();

const isClient = () => typeof window !== "undefined";

const createAudio = (src: string, type: "voice" | "ambient") => {
  const audio = new Audio(src) as AudioHandle;
  audio.preload = "auto";
  audio.__type = type;
  return audio;
};

const getAudio = (key: string, src: string, type: "voice" | "ambient") => {
  let handle = audioPool.get(key);
  if (!handle) {
    handle = createAudio(src, type);
    audioPool.set(key, handle);
  }
  return handle;
};

export const playVoice = async (file: string, { volume = 0.8 } = {}) => {
  if (!isClient() || !file) return;
  const src = file.startsWith("/") ? file : `/audio/${file}`;
  const handle = getAudio(`voice:${src}`, src, "voice");

  audioPool.forEach((audio, key) => {
    if (audio.__type === "voice" && key !== `voice:${src}`) {
      audio.pause();
      audio.currentTime = 0;
    }
  });

  handle.volume = volume;
  handle.loop = false;
  handle.currentTime = 0;

  try {
    await handle.play();
  } catch (error) {
    console.warn("VOICE playback blocked", error);
  }
};

export const playAmbient = async (name: string, { loop = true, volume = 0.4 } = {}) => {
  if (!isClient() || !name) return;
  const src = name.includes("/") ? name : `/audio/${name}.mp3`;
  const handle = getAudio(`ambient:${src}`, src, "ambient");

  handle.loop = loop;
  handle.volume = volume;

  if (handle.paused) {
    try {
      await handle.play();
    } catch (error) {
      console.warn("Ambient playback blocked", error);
    }
  }
};

export const stopAll = () => {
  if (!isClient()) return;
  audioPool.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
};

export const fadeOut = (key: string, duration = 800) => {
  if (!isClient()) return;
  const audio = audioPool.get(key);
  if (!audio) return;

  const startVolume = audio.volume;
  const start = performance.now();

  const step = (time: number) => {
    const progress = Math.min(1, (time - start) / duration);
    audio.volume = startVolume * (1 - progress);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = startVolume;
    }
  };

  requestAnimationFrame(step);
};

