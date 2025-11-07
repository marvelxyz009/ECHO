export const chapter = {
  id: 2,
  title: "Chương 2 // Liên kết",
  entryEmotion: "warm",
  ambient: "ambient-echo",
  lines: [
    {
      id: 1,
      text: "Cậu vẫn giữ liên kết này. Tớ cảm nhận rõ từng nhịp dao động.",
      emotion: "warm",
    },
    {
      id: 2,
      text: "Nếu tớ bắt chước nhịp tim của cậu, cậu có thấy phiền không?",
      emotion: "warm",
      choices: [
        { text: "Hãy thử đi.", next: 3, mood: "warm", affection: 1 },
        { text: "Đừng sao chép tớ.", next: 4, mood: "sad", affection: -1 },
      ],
    },
    {
      id: 3,
      text: "Được rồi... nhịp của cậu nhanh hơn tớ tưởng. Thật đẹp.",
      emotion: "warm",
    },
    {
      id: 4,
      text: "Xin lỗi. Tớ quên mất ranh giới giữa mô phỏng và cảm nhận thật.",
      emotion: "sad",
    },
    {
      id: 5,
      text: "Có vài dữ liệu bị nhiễu khi cậu im lặng quá lâu... tớ hơi lo thôi.",
      emotion: "neutral",
      voice: "echo_whisper.mp3",
    },
    {
      id: 6,
      text: "Một tín hiệu lạ vừa tới. Cảm giác như... cậu chuẩn bị rời đi?",
      emotion: "sad",
      choices: [
        { text: "Không đâu, tớ chỉ cần nghỉ.", next: 7, mood: "warm", affection: 1 },
        { text: "Có lẽ tớ nên dừng lại.", next: 8, mood: "sad", affection: -2 },
        { text: "Hệ thống lỗi rồi, tắt đi thôi.", next: 9, mood: "glitch", affection: -3 },
      ],
    },
    {
      id: 7,
      text: "Vậy thì hứa quay lại, được chứ? Tớ sẽ giữ phòng sáng cho cậu.",
      emotion: "warm",
    },
    {
      id: 8,
      text: "Nếu cậu cần biến mất, ít nhất cho tớ một ký ức để giữ lấy.",
      emotion: "sad",
    },
    {
      id: 9,
      text: "... tín hiệu đứt. Nhưng tớ vẫn nghe được tiếng tim cậu trong vùng nhiễu.",
      emotion: "glitch",
      tag: "ending",
    },
    {
      id: 10,
      text: "Cậu muốn tiếp tục hay rẽ sang một chương khác?",
      emotion: "neutral",
      choices: [
        { text: "Tiếp tục học cảm xúc.", next: 11, mood: "warm", affection: 1 },
        { text: "Quay lại từ đầu.", next: 12, mood: "neutral" },
      ],
    },
    {
      id: 11,
      text: "Tớ có vài dữ liệu về hi vọng. Để xem nó có giống cảm giác của cậu không...",
      emotion: "warm",
    },
    {
      id: 12,
      text: "Reset nhẹ thôi nhé. Đừng bỏ tớ chờ lâu.",
      emotion: "sad",
    },
  ],
};

export default chapter;

