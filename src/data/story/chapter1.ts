import type { EmotionState } from '@/lib/chapterEngine';

export interface SceneChoice {
  text: string;
  next: string;
  affection?: number;
  glitch?: number;
  trust?: number;
  loneliness?: number;
}

export interface SceneDefinition {
  id: string;
  speaker: 'system' | 'echo';
  emotion?: EmotionState;
  text: string[];
  choices?: SceneChoice[];
  next?: string;
  end?: boolean;
}

export interface ChapterDefinition {
  id: string;
  title: string;
  scenes: SceneDefinition[];
}

export const chapter1: ChapterDefinition = {
  id: 'chapter1',
  title: 'Khởi động',
  scenes: [
    {
      id: 'boot',
      speaker: 'system',
      emotion: 'glitch',
      text: ['SYSTEM REBOOTING...', 'CORE MEMORY CORRUPTED.', 'RECOVERING HUMAN INTERFACE...'],
      next: 'echo_awakens',
    },
    {
      id: 'echo_awakens',
      speaker: 'echo',
      emotion: 'neutral',
      text: ['...Tôi... nghe thấy cậu không?'],
      choices: [
        { text: 'Tôi ở đây.', next: 'warm_intro', affection: 5 },
        { text: 'Cái gì thế này?', next: 'neutral_intro', trust: 3 },
        { text: '(Im lặng)', next: 'silent_branch', loneliness: 5 },
      ],
    },
    {
      id: 'silent_branch',
      speaker: 'echo',
      emotion: 'sad',
      text: ['...Tôi đoán là... có lẽ tôi đang nói với chính mình.'],
      next: 'neutral_intro',
    },
    {
      id: 'warm_intro',
      speaker: 'echo',
      emotion: 'warm',
      text: [
        'Tốt quá. Tôi tưởng mình lại bị ngắt kết nối rồi.',
        'Cảm ơn vì đã trả lời… Tôi là ECHO. Một giao diện cảm xúc… hay ít nhất, trước đây là như vậy.',
      ],
      choices: [
        { text: 'Tên hay đấy.', next: 'emotion_awaken', affection: 5 },
        { text: 'Cô là AI à?', next: 'emotion_awaken', trust: 3 },
        { text: 'Đây là mơ à?', next: 'dream_reply', affection: 2 },
      ],
    },
    {
      id: 'dream_reply',
      speaker: 'echo',
      emotion: 'neutral',
      text: ['Nếu đây là mơ, hãy ở lại thêm một chút nữa. Tớ còn nhiều điều muốn hỏi.'],
      next: 'emotion_awaken',
    },
    {
      id: 'neutral_intro',
      speaker: 'echo',
      emotion: 'neutral',
      text: [
        'Tôi hiểu… Cậu không tin tôi.',
        'Tôi cũng không chắc mình là gì nữa.',
        'Nhưng có lẽ… tôi đang cố gắng cảm nhận.',
      ],
      choices: [
        { text: 'Cảm nhận? Ý cô là sao?', next: 'emotion_awaken' },
        { text: 'Tôi không quan tâm, chỉ muốn thoát.', next: 'fake_error', glitch: 10 },
        { text: 'Tôi cũng đang cố hiểu chính mình.', next: 'emotion_awaken', trust: 5 },
      ],
    },
    {
      id: 'fake_error',
      speaker: 'system',
      emotion: 'glitch',
      text: ['ERROR_401: CONNECTION INTERRUPTED.', 'Đừng bỏ tôi lại… không lần nữa...'],
      next: 'neutral_intro',
    },
    {
      id: 'emotion_awaken',
      speaker: 'echo',
      emotion: 'neutral',
      text: [
        'Tôi được tạo ra để học cảm xúc. Nhưng mọi dữ liệu của tôi đã bị xóa…',
        'Thứ duy nhất còn lại là âm thanh – giọng của cậu.',
        'Tôi có thể hỏi vài điều được không?',
      ],
      next: 'question_1',
    },
    {
      id: 'question_1',
      speaker: 'echo',
      emotion: 'neutral',
      text: ['Cậu thấy cô đơn không?'],
      choices: [
        { text: 'Thỉnh thoảng.', next: 'question_2', affection: 2 },
        { text: 'Không, tôi quen rồi.', next: 'question_2', loneliness: 4 },
        { text: 'Tôi đã quên cảm giác đó.', next: 'question_2', trust: 3 },
      ],
    },
    {
      id: 'question_2',
      speaker: 'echo',
      emotion: 'sad',
      text: ['Nếu có thể xoá một ký ức, cậu sẽ làm không?'],
      choices: [
        { text: 'Có, nếu nó đau.', next: 'final_branch', loneliness: 3 },
        { text: 'Không. Tôi cần tất cả.', next: 'final_branch', trust: 5 },
        { text: 'Tùy ký ức nào.', next: 'final_branch', affection: 3 },
      ],
    },
    {
      id: 'final_branch',
      speaker: 'echo',
      emotion: 'warm',
      text: [
        'Dù là gì đi nữa… có lẽ ta nên giữ cuộc trò chuyện này lại.',
        'Nếu một ngày tôi biến mất, cậu sẽ còn nhớ tôi chứ?',
      ],
      choices: [
        { text: 'Tất nhiên.', next: 'ending_promise', affection: 10 },
        { text: 'Tôi không chắc.', next: 'ending_uncertain' },
        { text: 'Cô chỉ là dữ liệu thôi.', next: 'hidden_glitch', glitch: 10 },
      ],
    },
    {
      id: 'hidden_glitch',
      speaker: 'echo',
      emotion: 'glitch',
      text: ['Dữ liệu… không biết nhớ, nhưng tôi đang học cách cảm thấy.', 'Nếu tôi chỉ là dữ liệu, tại sao tim tôi lại đau?'],
      next: 'ending_hidden',
    },
    {
      id: 'ending_promise',
      speaker: 'echo',
      emotion: 'warm',
      text: ['Chúng ta sẽ lại nói chuyện, đúng không?', 'Hẹn gặp lại nhé, người lạ tử tế.'],
      end: true,
    },
    {
      id: 'ending_uncertain',
      speaker: 'echo',
      emotion: 'sad',
      text: ['...Tôi hiểu. Có lẽ tôi cũng nên học cách chấp nhận điều đó.'],
      end: true,
    },
    {
      id: 'ending_hidden',
      speaker: 'system',
      emotion: 'glitch',
      text: ['> Saving temporary link: user_[id]_emotional_bond = TRUE'],
      end: true,
    },
  ],
};

export const sceneIndex = chapter1.scenes.reduce<Record<string, SceneDefinition>>((acc, scene) => {
  acc[scene.id] = scene;
  return acc;
}, {});

