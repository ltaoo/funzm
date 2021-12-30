/**
 * @file 测验类
 * 1、数据由外部传入
 * 2、已结束状态由外部决定
 */
import { Paragraph } from "@prisma/client";
import dayjs, { Dayjs } from "dayjs";

import { compareLine, splitText2Words } from "../caption/utils";

import {
  shuffle,
  arr2map,
  uid,
  removeZeroAtTail,
  computeScoreByStats,
} from "./utils";

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

function filterEmptyTextParagraphs(paragraphs) {
  return paragraphs.filter((paragraph) => {
    const { text1, text2 } = paragraph;
    return text1 && text2;
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
  incorrectParagraphs: (Paragraph & {
    error: string;
  })[];
  /**
   * 开始时间
   */
  startAt: Dayjs;
  /**
   * 结束/完成时间
   */
  endAt: Dayjs;

  /**
   * 输入的单词
   */
  inputtingWords: { uid: number; word: string }[];
  /**
   * 当前原文单词[['', 'In', ''], ['', 'fact', '']]
   */
  curWords: string[][];
  /**
   * 展示给用户选择的单测，在原文单词基础上打乱顺序，增加干扰单词等
   */
  displayedWords: { uid: number; word: string }[];
  /**
   * 连续拼写正确次数
   */
  combo: number;
  /**
   * 最大连续拼写正确次数
   */
  maxCombo: number;
  /**
   * 剩余的段落总数
   */
  remainingParagraphsCount: number;
  /**
   * 没有更多数据，当使用完现有数据，可以结束了
   */
  canComplete: boolean;

  onChange: (examJSON: Record<string, any>) => void;
  onBeforeNext?: (exam: Record<string, any>) => boolean;
  onNext: (exam: Record<string, any>) => void;
  onBeforeSkip?: (exam: Record<string, any>) => boolean;
  onCorrect: (examJSON: Record<string, any>) => void;
  onSkip?: (examJSON: Record<string, any>) => void;
  onIncorrect: (examJSON: Record<string, any>) => void;
  onComplete?: () => void;

  /**
   * 剩余段落不够了，需要补充的临界值
   * @param params
   */
  needMoreParagraphs: number;

  constructor(params) {
    const {
      level,
      title,
      status = ExamStatus.Prepare,
      curParagraphId,
      combo = 0,
      maxCombo = 0,
      paragraphs = [],
      canComplete = false,
      onChange = noop,
      onSkip,
      onCorrect = noop,
      onIncorrect = noop,
      onBeforeSkip,
      onBeforeNext,
      onNext = noop,
    } = params;
    this.onChange = onChange;
    this.onCorrect = onCorrect;
    this.onIncorrect = onIncorrect;
    this.onSkip = onSkip;
    this.onBeforeSkip = onBeforeSkip;
    this.onBeforeNext = onBeforeNext;
    this.onNext = onNext;

    this.needMoreParagraphs = 2;
    this.canComplete = canComplete;

    this.status = status;
    this.curParagraph = null;
    this.skippedParagraphs = [];
    this.correctParagraphs = [];
    this.incorrectParagraphs = [];
    this.startAt = dayjs();

    this.title = title;
    this.paragraphs = filterEmptyTextParagraphs(paragraphs);
    this.remainingParagraphsCount = this.paragraphs.length;
    this.paragraphMap = arr2map(this.paragraphs, "id");
    this.curParagraphId = curParagraphId;
    this.curWords = [];
    this.displayedWords = [];

    if (this.curParagraphId && this.paragraphs.length > 0) {
      // console.log(
      //   "[]constructor - assign cur paragraph",
      //   this.curParagraphId,
      //   this.paragraphMap
      // );
      this.curParagraph = this.paragraphMap[this.curParagraphId];
      this.curWords = splitText2Words(this.curParagraph.text2);
      this.displayedWords = shuffle([
        ...this.curWords.map(([, word]) => word).filter(Boolean),
      ]).map((str) => {
        return {
          uid: uid(),
          word: str,
        };
      });
      console.log(
        "[]constructor - split paragraph",
        this.curWords,
        this.displayedWords
      );
    }

    this.inputtingWords = [];

    this.combo = combo;
    this.maxCombo = maxCombo;
  }

  start(paragraphs = []) {
    if (paragraphs.length !== 0) {
      this.setParagraphs(paragraphs);
    }
    this.status = ExamStatus.Started;
    this.curParagraphId = this.paragraphs[0].id;
    this.curParagraph = this.paragraphMap[this.curParagraphId];
    this.curWords = splitText2Words(this.curParagraph.text2);
    // console.log("[DOMAIN]exam - start", this.curWords);
    this.displayedWords = shuffle(this.curWords.map(([, word]) => word))
      .filter(Boolean)
      .map((str) => {
        return {
          uid: uid(),
          word: str,
        };
      });
    // console.log(
    //   "[DOMAIN]exam - start",
    //   this.paragraphs,
    //   this.curParagraphId,
    //   this.curParagraph
    // );
    const response = this.toJSON();
    this.onChange(response);
    return response;
  }

  next(isSkip?: boolean) {
    if (this.onBeforeNext) {
      const canContinue = this.onBeforeNext(this.toJSON());
      if (canContinue === false) {
        // console.log('interrupt next');
        return;
      }
    }
    if (this.status === ExamStatus.Completed) {
      console.log("[DOMAIN]exam - next", this.status === ExamStatus.Completed);
      return;
    }
    this.inputtingWords = [];
    const matchedIndex = this.paragraphs.findIndex(
      (paragraph) => paragraph.id === this.curParagraphId
    );
    // console.log("[DOMAIN]exam - next", matchedIndex, this.curParagraphId);
    const remainingParagraphsCount =
      this.paragraphs.length - (matchedIndex + 1);
    // console.log(
    //   "[]remainingParagraphsCount",
    //   this.paragraphs.length,
    //   matchedIndex + 1,
    //   remainingParagraphsCount
    // );
    const nextParagraph = this.paragraphs[matchedIndex + 1];
    console.log("[]next", matchedIndex, nextParagraph);
    if (nextParagraph) {
      if (isSkip) {
        if (this.onSkip) {
          this.onSkip(this.toJSON());
        }
      }
      this.curParagraphId = nextParagraph.id;
      this.curParagraph = nextParagraph;
      this.remainingParagraphsCount = remainingParagraphsCount;
      this.curWords = splitText2Words(this.curParagraph.text2);
      this.displayedWords = shuffle([
        ...this.curWords.map(([, word]) => word).filter(Boolean),
      ]).map((str) => {
        return {
          uid: uid(),
          word: str,
        };
      });
    }
    console.log(
      "[DOMAIN]next - check can complete",
      !nextParagraph && this.canComplete
    );
    if (!nextParagraph && this.canComplete) {
      this.status = ExamStatus.Completed;
      this.endAt = dayjs();
      if (this.onComplete) {
        this.onComplete();
      }
    }
    const res = this.toJSON();
    console.log(
      "[]next - before invoke onChange and onNext",
      this.remainingParagraphsCount
    );
    this.onNext(res);
    this.onChange(res);
  }

  skip() {
    if (this.onBeforeSkip) {
      const res = this.onBeforeSkip(this.toJSON());
      if (res === false) {
        console.log("interrupt skip");
        return;
      }
    }
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
    this.next(true);
  }

  write(word) {
    if (this.status === ExamStatus.Completed) {
      return;
    }
    this.inputtingWords.push(word);
    // console.log(
    //   "[DOMAIN]exam - write",
    //   this.inputtingWords,
    //   this.curWords,
    //   word
    // );

    const curWords = this.curWords.map(([, word]) => word).filter(Boolean);
    if (this.inputtingWords.length === curWords.length) {
      this.onChange(this.toJSON());
      this.compare(this.inputtingWords, curWords);
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
    // console.log("[DOMAIN]exam - compare", inputtingWords, words);
    const diffNodes = compareLine(words.join(" "), inputting);

    const errorInputting = this.inputtingWords.map((w) => w.word).join(" ");
    if (diffNodes === null) {
      this.correctParagraphs.push(this.curParagraph);
      // console.log("Correct!");
      this.combo += 1;
      if (this.combo > this.maxCombo) {
        this.maxCombo = this.combo;
      }
      this.onCorrect(this.toJSON());
      setTimeout(() => {
        this.next();
      }, 600);
      return;
    }
    this.incorrectParagraphs.push({
      ...this.curParagraph,
      error: errorInputting,
    });
    // console.log("Incorrect!");
    this.combo = 0;
    this.onIncorrect(this.toJSON());
    this.inputtingWords = [];
    this.next();
  }

  enableComplete() {
    this.canComplete = true;
    // this.status = ExamStatus.Completed;
    // this.onChange(this.toJSON);
  }

  setParagraphs(paragraphs) {
    this.paragraphs = filterEmptyTextParagraphs(paragraphs);
    this.paragraphMap = arr2map(this.paragraphs, "id");
    this.remainingParagraphsCount = this.paragraphs.length;
  }
  appendParagraphs(paragraphs) {
    const appendedParagraphs = filterEmptyTextParagraphs(paragraphs);
    const matchedIndex = this.paragraphs.findIndex(
      (paragraph) => paragraph.id === this.curParagraphId
    );
    const prevRemaining = this.paragraphs.slice(
      matchedIndex,
      this.paragraphs.length
    );
    this.paragraphs = [...prevRemaining].concat(appendedParagraphs);
    this.paragraphMap = arr2map(this.paragraphs, "id");
    this.remainingParagraphsCount =
      appendedParagraphs.length + prevRemaining.length;
  }

  /**
   * 统计
   */
  stats() {
    const {
      paragraphs,
      correctParagraphs,
      incorrectParagraphs,
      skippedParagraphs,
    } = this;
    const stats = {
      total: paragraphs.length,
      correct: correctParagraphs.length,
      incorrect: incorrectParagraphs.length,
      skipped: skippedParagraphs.length,
      startAt: this.startAt.format("YYYY-MM-DD HH:mm:ss"),
      endAt: this.endAt ? this.endAt.format("YYYY-MM-DD HH:mm:ss") : "-",
      spend: (() => {
        if (this.endAt) {
          const spendSeconds = this.endAt.unix() - this.startAt.unix();
          const remainingSeconds = spendSeconds % 60;
          const spendMinutes = spendSeconds / 60;
          return spendSeconds < 60
            ? `${spendSeconds}秒`
            : `${spendMinutes}分${remainingSeconds}秒`;
        }
        return null;
      })(),
      seconds: (() => {
        if (this.endAt) {
          return this.endAt.unix() - this.startAt.unix();
        }
        return 0;
      })(),
      correctRate: parseFloat(
        removeZeroAtTail(
          ((correctParagraphs.length / paragraphs.length) * 100).toFixed(2)
        )
      ),
      correctRateText: `${removeZeroAtTail(
        ((correctParagraphs.length / paragraphs.length) * 100).toFixed(2)
      )}%`,
      score: 0,
    };
    stats.score = computeScoreByStats(stats);
    return stats;
  }

  toJSON() {
    const {
      paragraphs,
      status,
      displayedWords,
      curWords,
      combo,
      maxCombo,
      curParagraph,
      curParagraphId,
      inputtingWords,
      correctParagraphs,
      incorrectParagraphs,
      skippedParagraphs,
      remainingParagraphsCount,
    } = this;
    return {
      status,
      paragraphs,
      combo,
      maxCombo,
      curWords,
      displayedWords,
      inputtingWords,
      curParagraph,
      curParagraphId,
      correctParagraphs,
      incorrectParagraphs,
      skippedParagraphs,
      remainingParagraphsCount,
      stats: this.stats(),
    };
  }
}

export default Exam;
