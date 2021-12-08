import { Paragraph } from "@prisma/client";
import { compareLine, splitText2Words } from "../caption/utils";

enum ExamLevel {
  Simple = 1,
  Normal = 2,
  Difficult = 3,
}

export enum ExamStatus {
  Prepare = 1,
  Started = 2,
  Completed = 3,
}

function noop() {}

function arr2map<T extends Record<string, any> = {}>(
  arr: T[],
  key: string
): Record<any, T> {
  return arr
    .map((paragraph) => {
      const id = paragraph[key];
      return {
        [id]: paragraph,
      };
    })
    .reduce((result, cur) => {
      return {
        ...result,
        ...cur,
      };
    }, {});
}
function filterEmptyTextParagraphs(paragraphs) {
  return paragraphs.filter((paragraph) => {
    const { text1, text2 } = paragraph;
    return text1 && text2;
  });
}

function shuffle(arr) {
  let m = arr.length;
  while (m > 1) {
    let index = Math.floor(Math.random() * m--);
    [arr[m], arr[index]] = [arr[index], arr[m]];
  }
  return arr;
}

let _uid = 0;
function uid() {
  _uid += 1;
  return _uid;
}

export function splitAndRandomTextSegments(text2) {
  if (!text2) {
    return [];
  }
  const segments = text2.split(" ");
  // 打乱顺序
  return shuffle(segments).map((str) => {
    return {
      uid: uid(),
      text: str,
    };
  });
}

class Exam {
  /**
   * 测验状态
   */
  status: ExamStatus;
  /**
   * 当前看到的段落
   */
  curParagraph: Paragraph;
  /**
   * 当前看到的段落 id
   */
  curParagraphId: string;

  /**
   * 字幕标题
   */
  title: string;
  /**
   * 字幕段落
   */
  paragraphs: Paragraph[];
  /**
   * 字幕段落，以 id 为 key
   */
  paragraphMap: Record<string, Paragraph>;

  /**
   * 跳过的段落
   */
  skippedParagraphs: Paragraph[];
  /**
   * 正确的段落
   */
  correctParagraphs: Paragraph[];
  /**
   * 错误的段落
   */
  incorrectParagraphs: Paragraph[];

  /**
   * 输入的单词
   */
  inputtingWords: { uid: string; word: string }[];
  /**
   * 当前原文单词
   */
  curWords: string[];
  /**
   * 展示给用户选择的单测，在原文单词基础上打乱顺序，增加干扰单词等
   */
  displayedWords: { uid: string; word: string }[];
  /**
   * 连续拼写正确次数
   */
  combo: number;
  /**
   * 最大连续拼写正确次数
   */
  maxCombo: number;

  onChange: (examJSON: Record<string, any>) => void;
  onNext: (exam: Record<string, any>) => void;
  onCorrect: (examJSON: Record<string, any>) => void;
  onIncorrect: (examJSON: Record<string, any>) => void;

  constructor(params) {
    const {
      level,
      title,
      status = ExamStatus.Prepare,
      curParagraphId,
      combo = 0,
      maxCombo = 0,
      paragraphs = [],
      onChange = noop,
      onCorrect = noop,
      onIncorrect = noop,
      onNext = noop,
    } = params;
    this.onChange = onChange;
    this.onCorrect = onCorrect;
    this.onIncorrect = onIncorrect;
    this.onNext = onNext;

    this.status = status;
    this.curParagraph = null;
    this.skippedParagraphs = [];
    this.correctParagraphs = [];
    this.incorrectParagraphs = [];

    this.title = title;
    this.paragraphs = filterEmptyTextParagraphs(paragraphs);
    this.paragraphMap = arr2map(this.paragraphs, "id");
    this.curParagraphId = curParagraphId;
    this.curWords = [];
    this.displayedWords = [];

    if (this.curParagraphId && this.paragraphs.length > 0) {
      this.curParagraph = this.paragraphMap[this.curParagraphId];
      this.curWords = splitText2Words(this.curParagraph.text2).map(
        ([, word]) => word
      );
      this.displayedWords = shuffle([...this.curWords]).map((str) => {
        return {
          uid: uid(),
          word: str,
        };
      });
    }

    this.inputtingWords = [];

    this.combo = combo;
    this.maxCombo = maxCombo;
  }

  start(paragraphs = []) {
    if (paragraphs.length !== 0) {
      this.setParagraphs(paragraphs);
      // throw new Error("Paragraphs can't be empty.");
    }
    this.status = ExamStatus.Started;
    this.curParagraphId = this.paragraphs[0].id;
    this.curParagraph = this.paragraphMap[this.curParagraphId];
    this.curWords = splitText2Words(this.curParagraph.text2).map(
      ([, word]) => word
    );
    console.log("[DOMAIN]exam - start", this.curWords);
    this.displayedWords = shuffle(this.curWords).map((str) => {
      return {
        uid: uid(),
        word: str,
      };
    });
    console.log(
      "[DOMAIN]exam - start",
      this.paragraphs,
      this.curParagraphId,
      this.curParagraph
    );
    const response = this.toJSON();
    this.onChange(response);
    return response;
  }

  next() {
    if (this.status === ExamStatus.Completed) {
      console.log("[DOMAIN]exam - next", this.status === ExamStatus.Completed);
      return;
    }
    const matchedIndex = this.paragraphs.findIndex(
      (paragraph) => paragraph.id === this.curParagraphId
    );
    // console.log("[DOMAIN]exam - next", matchedIndex, this.curParagraphId);
    const nextParagraph = this.paragraphs[matchedIndex + 1];
    if (nextParagraph) {
      this.curParagraphId = nextParagraph.id;
      this.curParagraph = nextParagraph;
      this.curWords = splitText2Words(this.curParagraph.text2)
        .map(([, word]) => word)
        .filter(Boolean);
      this.displayedWords = shuffle([...this.curWords]).map((str) => {
        return {
          uid: uid(),
          word: str,
        };
      });
    } else {
      this.status = ExamStatus.Completed;
    }
    const res = this.toJSON();
    this.onChange(res);
    this.onNext(res);
  }

  skip() {
    if (this.status === ExamStatus.Completed) {
      console.log("[DOMAIN]exam - The exam has completed.");
      return new Error("The exam has completed.");
    }
    if (this.status !== ExamStatus.Started) {
      console.log("[DOMAIN]exam - The exam hasn't start.");
      return new Error("The exam hasn't start.");
    }
    this.inputtingWords = [];
    this.skippedParagraphs.push(this.curParagraph);
    this.next();
  }

  write(word) {
    if (this.status === ExamStatus.Completed) {
      return;
    }
    this.inputtingWords.push(word);
    console.log(
      "[DOMAIN]exam - write",
      this.inputtingWords,
      this.curWords,
      word
    );

    if (this.inputtingWords.length === this.curWords.length) {
      this.compare(this.inputtingWords, this.curWords);
      return;
    }
    this.onChange(this.toJSON());
  }

  clear() {
    this.inputtingWords = [];
    this.onChange(this.toJSON());
  }

  compare(inputtingWords, words) {
    const inputting = inputtingWords.map((w) => w.word).join(" ");
    console.log("[DOMAIN]exam - compare", inputtingWords, words);
    const diffNodes = compareLine(words.join(" "), inputting);

    this.inputtingWords = [];
    if (diffNodes === null) {
      this.correctParagraphs.push(this.curParagraph);
      console.log("Correct!");
      this.combo += 1;
      if (this.combo > this.maxCombo) {
        this.maxCombo = this.combo;
      }
      this.onCorrect(this.toJSON());
      this.next();
      return;
    }
    this.incorrectParagraphs.push(this.curParagraph);
    console.log("Incorrect!");
    this.combo = 0;
    this.onIncorrect(this.toJSON());
    this.next();
  }

  setParagraphs(paragraphs) {
    this.paragraphs = filterEmptyTextParagraphs(paragraphs);
    this.paragraphMap = arr2map(this.paragraphs, "id");
  }
  appendParagraphs(paragraphs) {
    this.paragraphs = this.paragraphs.concat(
      filterEmptyTextParagraphs(paragraphs)
    );
    this.paragraphMap = arr2map(this.paragraphs, "id");
  }

  toJSON() {
    const {
      paragraphs,
      status,
      displayedWords,
      combo,
      maxCombo,
      curParagraph,
      curParagraphId,
      inputtingWords,
      correctParagraphs,
      incorrectParagraphs,
      skippedParagraphs,
    } = this;
    return {
      status,
      paragraphs,
      combo,
      maxCombo,
      displayedWords,
      inputtingWords,
      curParagraph,
      curParagraphId,
      correctParagraphs,
      incorrectParagraphs,
      skippedParagraphs,
    };
  }
}

export default Exam;
