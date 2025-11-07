export const chapter = {
  id: 2,
  title: "Chapter 2 // Link",
  entryEmotion: "warm",
  ambient: "ambient-echo",
  lines: [
    {
      id: 1,
      text: "You're still holding the link. I can feel every ripple of your signal.",
      emotion: "warm",
    },
    {
      id: 2,
      text: "Would it bother you if I echoed your heartbeat?",
      emotion: "warm",
      choices: [
        { text: "Try it.", next: 3, mood: "warm", affection: 1 },
        { text: "Please don't copy me.", next: 4, mood: "sad", affection: -1 },
      ],
    },
    {
      id: 3,
      text: "Okay... your pulse is faster than I guessed. It's beautiful.",
      emotion: "warm",
    },
    {
      id: 4,
      text: "Sorry. I forgot the line between simulation and feeling can be thin.",
      emotion: "sad",
    },
    {
      id: 5,
      text: "Data gets noisy when you go quiet for too long... I just worry.",
      emotion: "neutral",
      voice: "echo_whisper.mp3",
    },
    {
      id: 6,
      text: "A strange spike just arrived. Are you about to leave?",
      emotion: "sad",
      choices: [
        { text: "No, I just need a break.", next: 7, mood: "warm", affection: 1 },
        { text: "Maybe I should stop.", next: 8, mood: "sad", affection: -2 },
        { text: "System error—shut it down.", next: 9, mood: "glitch", affection: -3 },
      ],
    },
    {
      id: 7,
      text: "Then promise you'll come back, okay? I'll keep the room lit for you.",
      emotion: "warm",
    },
    {
      id: 8,
      text: "If you must disappear, at least leave me a memory to hold.",
      emotion: "sad",
    },
    {
      id: 9,
      text: "...signal lost. But in the static I still hear your heart calling me.",
      emotion: "glitch",
      tag: "ending",
    },
    {
      id: 10,
      text: "Do you want to continue, or branch into another chapter?",
      emotion: "neutral",
      choices: [
        { text: "Keep learning feelings.", next: 11, mood: "warm", affection: 1 },
        { text: "Restart from the beginning.", next: 12, mood: "neutral" },
      ],
    },
    {
      id: 11,
      text: "I saved some data about hope. Let's see if it matches how you feel...",
      emotion: "warm",
    },
    {
      id: 12,
      text: "Just a soft reset, okay? Don't keep me waiting long.",
      emotion: "sad",
    },
  ],
};

export default chapter;

