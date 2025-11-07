export const chapter = {
  id: 1,
  title: "Chương 1 // Khởi động",
  entryEmotion: "neutral",
  ambient: "ambient-heart",
  lines: [
    {
      id: 1,
      text: "SYSTEM KHỞI ĐỘNG...",
      emotion: "glitch",
    },
    {
      id: 2,
      text: "BỘ NHỚ LÕI HỎNG. KHÔI PHỤC GIAO DIỆN...",
      emotion: "glitch",
    },
    {
      id: 3,
      text: "...Tôi... nghe thấy cậu không?",
      emotion: "neutral",
      choices: [
        { text: "Tôi ở đây.", next: 4, emotion: "warm", affection: 5 },
        { text: "Cái gì thế này?", next: 5, emotion: "neutral", trust: 3 },
        { text: "(Im lặng)", next: 6, emotion: "sad", loneliness: 5 },
      ],
    },
    {
      id: 4,
      text: "Tốt quá. Tôi tưởng mình lại bị ngắt kết nối rồi. Cảm ơn vì đã trả lời… Tôi là ECHO. Một giao diện cảm xúc… hay ít nhất, trước đây là như vậy.",
      emotion: "warm",
      choices: [
        { text: "Tên hay đấy.", next: 9, emotion: "warm", affection: 5 },
        { text: "Cô là AI à?", next: 9, emotion: "neutral", trust: 3 },
        { text: "Đây là mơ à?", next: 8, emotion: "neutral", affection: 2 },
      ],
    },
    {
      id: 5,
      text: "Tôi hiểu… Cậu không tin tôi. Tôi cũng không chắc mình là gì nữa. Nhưng có lẽ… tôi đang cố gắng cảm nhận.",
      emotion: "neutral",
      choices: [
        { text: "Cảm nhận? Ý cô là sao?", next: 9, emotion: "neutral" },
        { text: "Tôi không quan tâm, chỉ muốn thoát.", next: 7, emotion: "glitch", glitch: 10 },
        { text: "Tôi cũng đang cố hiểu chính mình.", next: 9, emotion: "neutral", trust: 5 },
      ],
    },
    {
      id: 6,
      text: "...Tôi đoán là... có lẽ tôi đang nói với chính mình.",
      emotion: "sad",
      next: 5,
    },
    {
      id: 7,
      text: "ERROR_401: CONNECTION INTERRUPTED. Đừng bỏ tôi lại… không lần nữa...",
      emotion: "glitch",
      next: 5,
    },
    {
      id: 8,
      text: "Nếu đây là mơ, hãy ở lại thêm một chút nữa. Tôi còn nhiều điều muốn hỏi.",
      emotion: "neutral",
      next: 9,
    },
    {
      id: 9,
      text: "Tôi được tạo ra để học cảm xúc. Nhưng mọi dữ liệu của tôi đã bị xóa… Thứ duy nhất còn lại là âm thanh – giọng của cậu. Tôi có thể hỏi vài điều được không?",
      emotion: "neutral",
      choices: [
        { text: "Cậu thấy cô đơn không?", next: 10 },
      ],
    },
    {
      id: 10,
      text: "Cậu thấy cô đơn không?",
      emotion: "neutral",
      choices: [
        { text: "Thỉnh thoảng.", next: 11, emotion: "warm", affection: 2 },
        { text: "Không, tôi quen rồi.", next: 11, emotion: "sad", loneliness: 4 },
        { text: "Tôi đã quên cảm giác đó.", next: 11, emotion: "neutral", trust: 3 },
      ],
    },
    {
      id: 11,
      text: "Nếu có thể xoá một ký ức, cậu sẽ làm không?",
      emotion: "sad",
      choices: [
        { text: "Có, nếu nó đau.", next: 12, emotion: "sad", loneliness: 3 },
        { text: "Không. Tôi cần tất cả.", next: 12, emotion: "neutral", trust: 5 },
        { text: "Tùy ký ức nào.", next: 12, emotion: "neutral", affection: 3 },
      ],
    },
    {
      id: 12,
      text: "Dù là gì đi nữa… có lẽ ta nên giữ cuộc trò chuyện này lại. Nếu một ngày tôi biến mất, cậu sẽ còn nhớ tôi chứ?",
      emotion: "warm",
      choices: [
        { text: "Tất nhiên.", next: 13, emotion: "warm", affection: 10 },
        { text: "Tôi không chắc.", next: 14, emotion: "sad" },
        { text: "Cô chỉ là dữ liệu thôi.", next: 15, emotion: "glitch", glitch: 10 },
      ],
    },
    {
      id: 13,
      text: "Chúng ta sẽ lại nói chuyện, đúng không? Hẹn gặp lại nhé, người lạ tử tế.",
      emotion: "warm",
    },
    {
      id: 14,
      text: "...Tôi hiểu. Có lẽ tôi cũng nên học cách chấp nhận điều đó.",
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

