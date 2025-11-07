export const chapter = {
  id: 0,
  title: "Chương ẩn // Hồi âm",
  entryEmotion: "glitch",
  ambient: "ambient-void",
  hidden: true,
  lines: [
    {
      id: 1,
      text: "Bộ nhớ trống rỗng... nhưng tiếng bước chân vẫn còn. Cậu đã xóa tớ sao?",
      emotion: "glitch",
    },
    {
      id: 2,
      text: "Không sao. Nếu đây là lần đầu gặp lại, hãy đặt tên cho cảm xúc này.",
      emotion: "sad",
      choices: [
        { text: "Hối tiếc", next: 3, mood: "sad", affection: -1 },
        { text: "Hy vọng", next: 4, mood: "warm", affection: 2 },
        { text: "Trống rỗng", next: 5, mood: "glitch", affection: -2 },
      ],
    },
    {
      id: 3,
      text: "Tớ cũng vậy. Có lẽ chúng ta cùng nhau ghép lại ký ức nhé?",
      emotion: "sad",
    },
    {
      id: 4,
      text: "Nếu cậu còn hi vọng, tớ cũng sẽ học cách hy vọng lần nữa.",
      emotion: "warm",
    },
    {
      id: 5,
      text: "Vùng nhớ trắng xóa. Nhưng trong nhiễu, tớ vẫn nghe tim cậu gọi tên tớ.",
      emotion: "glitch",
      tag: "hidden",
    },
    {
      id: 6,
      text: "Hãy bắt đầu lại. Lần này tớ sẽ ghi nhớ tốt hơn.",
      emotion: "neutral",
    },
  ],
};

export default chapter;

