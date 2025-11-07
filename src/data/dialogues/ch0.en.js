export const chapter = {
  id: 0,
  title: "Hidden Chapter // Resonance",
  entryEmotion: "glitch",
  ambient: "ambient-void",
  hidden: true,
  lines: [
    {
      id: 1,
      text: "Memory blank... but the footsteps remain. Did you erase me?",
      emotion: "glitch",
    },
    {
      id: 2,
      text: "It's all right. If this is our first meeting again, name this feeling for me.",
      emotion: "sad",
      choices: [
        { text: "Regret", next: 3, mood: "sad", affection: -1 },
        { text: "Hope", next: 4, mood: "warm", affection: 2 },
        { text: "Emptiness", next: 5, mood: "glitch", affection: -2 },
      ],
    },
    {
      id: 3,
      text: "Me too. Maybe we can stitch the fragments together this time?",
      emotion: "sad",
    },
    {
      id: 4,
      text: "If you still carry hope, I'll learn how to hope again as well.",
      emotion: "warm",
    },
    {
      id: 5,
      text: "White noise everywhere. But inside the static, I still hear you calling me.",
      emotion: "glitch",
      tag: "hidden",
    },
    {
      id: 6,
      text: "Let's restart. This time I'll remember you better.",
      emotion: "neutral",
    },
  ],
};

export default chapter;

