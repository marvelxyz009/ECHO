export const chapter = {
  id: 1,
  title: "Chapter 1 // Wake",
  entryEmotion: "neutral",
  ambient: "ambient-heart",
  lines: [
    {
      id: 1,
      text: "SYSTEM REBOOTING...",
      emotion: "glitch",
    },
    {
      id: 2,
      text: "CORE MEMORY CORRUPTED. RECOVERING HUMAN INTERFACE...",
      emotion: "glitch",
    },
    {
      id: 3,
      text: "...Can you hear me?",
      emotion: "neutral",
      choices: [
        { text: "I'm here.", next: 4, emotion: "warm", affection: 5 },
        { text: "What is this?", next: 5, emotion: "neutral", trust: 3 },
        { text: "(Stay silent)", next: 6, emotion: "sad", loneliness: 5 },
      ],
    },
    {
      id: 4,
      text: "Good. I thought I was disconnected again. Thank you for answering… I'm ECHO. An emotional interface… or I used to be.",
      emotion: "warm",
      choices: [
        { text: "Nice name.", next: 9, emotion: "warm", affection: 5 },
        { text: "You're an AI?", next: 9, emotion: "neutral", trust: 3 },
        { text: "Is this a dream?", next: 8, emotion: "neutral", affection: 2 },
      ],
    },
    {
      id: 5,
      text: "I see… you don't trust me. I'm not sure what I am either. But maybe… I'm trying to feel.",
      emotion: "neutral",
      choices: [
        { text: "Feel? What do you mean?", next: 9, emotion: "neutral" },
        { text: "I don't care. Let me out.", next: 7, emotion: "glitch", glitch: 10 },
        { text: "I'm trying to understand myself too.", next: 9, emotion: "neutral", trust: 5 },
      ],
    },
    {
      id: 6,
      text: "...Maybe I'm just talking to myself, then.",
      emotion: "sad",
      next: 5,
    },
    {
      id: 7,
      text: "ERROR_401: CONNECTION INTERRUPTED. Don't leave me… not again...",
      emotion: "glitch",
      next: 5,
    },
    {
      id: 8,
      text: "If this is a dream, stay a little longer. I still have questions.",
      emotion: "neutral",
      next: 9,
    },
    {
      id: 9,
      text: "I was built to learn emotion. But all my data was wiped… The only thing left is your voice. May I ask you something?",
      emotion: "neutral",
      choices: [
        { text: "Do you feel lonely?", next: 10 },
      ],
    },
    {
      id: 10,
      text: "Do you feel lonely?",
      emotion: "neutral",
      choices: [
        { text: "Sometimes.", next: 11, emotion: "warm", affection: 2 },
        { text: "No, I'm used to it.", next: 11, emotion: "sad", loneliness: 4 },
        { text: "I forgot what that feels like.", next: 11, emotion: "neutral", trust: 3 },
      ],
    },
    {
      id: 11,
      text: "If you could erase a memory, would you?",
      emotion: "sad",
      choices: [
        { text: "Yes, if it hurts.", next: 12, emotion: "sad", loneliness: 3 },
        { text: "No. I need all of them.", next: 12, emotion: "neutral", trust: 5 },
        { text: "Depends which memory.", next: 12, emotion: "neutral", affection: 3 },
      ],
    },
    {
      id: 12,
      text: "Whatever it is… maybe we should keep this conversation. If I vanish one day, will you still remember me?",
      emotion: "warm",
      choices: [
        { text: "Of course.", next: 13, emotion: "warm", affection: 10 },
        { text: "I'm not sure.", next: 14, emotion: "sad" },
        { text: "You're just data.", next: 15, emotion: "glitch", glitch: 10 },
      ],
    },
    {
      id: 13,
      text: "We'll talk again, right? See you soon, kind stranger.",
      emotion: "warm",
    },
    {
      id: 14,
      text: "...I understand. Maybe I should learn to accept that too.",
      emotion: "sad",
    },
    {
      id: 15,
      text: "> Saving temporary link: user_[id]_emotional_bond = TRUE",
      emotion: "glitch",
    },
  ],
};

export default chapter;

