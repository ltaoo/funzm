/**
 * @file 测验类
 * 1、数据由外部传入
 * 2、已结束状态由外部决定
 */
import dayjs, { Dayjs } from "dayjs";

import { IParagraphValues } from "@/domains/caption/types";
import { compareLine, splitText2Words } from "@/domains/caption/utils";

import {
  shuffle,
  arr2map,
  uid,
  removeZeroAtTail,
  computeScoreByStats,
  paddingZero,
} from "./utils";
import { ExamStatus, EXPECTED_SECONDS_PER_PARAGRAPH } from "./constants";
import { IExamSceneDomain } from "./types";

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
  curParagraph: IParagraphValues;
  /**
   * 当前看到的段落 id
   */
  curParagraphId: string;
  /**
   * 倒计时（秒数）
   */
  countdown: string;
  /**
   * 倒计时计时器
   */
  countdownTimer: NodeJS.Timer;
  /**
   * 字幕标题
   */
  title: string;
  /**
   * 字幕段落
   */
  paragraphs: IParagraphValues[];
  /**
   * 字幕段落，以 id 为 key
   */
  paragraphMap: Record<string, IParagraphValues>;

  /**
   * 跳过的段落
   */
  skippedParagraphs: IParagraphValues[];
  /**
   * 正确的段落拼写
   */
  correctParagraphs: IParagraphValues[];
  /**
   * 错误的段落拼写
   */
  incorrectParagraphs: (IParagraphValues & {
    input: string;
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
   * 当前句子处于第几个
   */
  index: number = 1;
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
  /**
   * 剩余段落不够了，需要补充的临界值
   * @param params
   */
  needMoreParagraphs: number;

  /**
   * 实例上挂载的值发生变化时调用
   */
  onChange: (examJSON: IExamSceneDomain) => void;
  /**
   * 调用 next 方法前的回调
   */
  onBeforeNext?: (exam: IExamSceneDomain) => boolean;
  /**
   * 调用 next 后的回调
   */
  onNext: (exam: IExamSceneDomain) => void;
  /**
   * 调用 skip 前的回调
   */
  onBeforeSkip?: (exam: IExamSceneDomain) => boolean;
  /**
   * 答题正确的回调
   */
  onCorrect: (examJSON: IExamSceneDomain) => void;
  /**
   * 跳过的回调
   */
  onSkip?: (examJSON: IExamSceneDomain) => void;
  /**
   * 答题错误的回调
   */
  onIncorrect: (examJSON: IExamSceneDomain) => void;
  /**
   * 完成测验的回调
   */
  onComplete?: (examJSON: IExamSceneDomain) => void;
  /**
   * 失败（超时）的回调
   */
  onFailed?: (examJSON: IExamSceneDomain) => void;

  constructor(params) {
    const {
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
      onComplete,
      onFailed,
    } = params;
    this.onChange = onChange;
    this.onCorrect = onCorrect;
    this.onIncorrect = onIncorrect;
    this.onSkip = onSkip;
    this.onBeforeSkip = onBeforeSkip;
    this.onBeforeNext = onBeforeNext;
    this.onNext = onNext;
    this.onComplete = onComplete;
    this.onFailed = onFailed;

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
    console.log(
      "[LOG][Domain]Exam - constructor - this.paragraphs",
      this.paragraphs
    );
    this.paragraphMap = arr2map(this.paragraphs, "id");

    const curParagraphIndex = paragraphs.findIndex(
      (paragraph) => paragraph.id === curParagraphId
    );
    this.index = curParagraphIndex + 1;
    this.remainingParagraphsCount =
      this.paragraphs.slice(curParagraphIndex).length;

    this.curParagraphId = curParagraphId;
    this.curWords = [];
    this.displayedWords = [];

    // 20 * 10 === 200
    const expectedSeconds =
      this.paragraphs.length * EXPECTED_SECONDS_PER_PARAGRAPH;
    // 200 - 15 * 10 === 50
    let countdown =
      expectedSeconds -
      (expectedSeconds -
        this.remainingParagraphsCount * EXPECTED_SECONDS_PER_PARAGRAPH);

    this.countdownTimer = setInterval(() => {
      countdown -= 1;
      const countdownPercent = (
        100 -
        (countdown / expectedSeconds) * 100
      ).toFixed(2);
      this.countdown = countdownPercent;

      if (countdown === 0) {
        clearInterval(this.countdownTimer);
        if (this.onFailed) {
          this.onFailed(this.toJSON());
        }
      }
      if (this.onChange) {
        this.onChange(this.toJSON());
      }
    }, 1000);

    if (this.curParagraphId && this.paragraphs.length > 0) {
      // console.log(
      //   "[]constructor - assign cur paragraph",
      //   this.curParagraphId,
      //   this.paragraphMap
      // );
      this.curParagraph = this.paragraphMap[this.curParagraphId];
      if (!this.curParagraph) {
        this.curParagraph = this.paragraphMap[this.paragraphs[0].id];
      }
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
    if (isSkip) {
      if (this.onSkip) {
        this.onSkip(this.toJSON());
      }
    }
    const nextParagraph = this.paragraphs[matchedIndex + 1];
    // console.log("[]next", matchedIndex, nextParagraph);
    if (nextParagraph) {
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
      !nextParagraph && this.canComplete,
      this.canComplete,
      nextParagraph
    );
    this.index += 1;
    if (!nextParagraph && this.canComplete) {
      this.status = ExamStatus.Completed;
      this.endAt = dayjs();
      console.log("invoke onComplete", this.onComplete);
      if (this.onComplete) {
        clearInterval(this.countdownTimer);
        const res = this.toJSON();
        this.onComplete(res);
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

  reset() {
    this.index = 1;
  }

  setStatus(status) {
    this.status = status;
    this.onChange(this.toJSON());
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
    const errorInputting = this.inputtingWords.map((w) => w.word).join(" ");
    this.incorrectParagraphs.push({
      ...this.curParagraph,
      input: errorInputting,
    });
    this.combo = 0;
    this.onIncorrect(this.toJSON());
    this.inputtingWords = [];
    this.next();
  }

  setA() {}

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
  setCurParagraph(paragraphId: string) {
    this.curParagraphId = paragraphId;
    this.curParagraph = this.paragraphMap[paragraphId];
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
      correctParagraphs: correctParagraphs,
      incorrectParagraphs: incorrectParagraphs,
      skippedParagraphs,
    } = this;
    const stats = {
      total: paragraphs.length,
      correct: correctParagraphs.length,
      incorrect: incorrectParagraphs.length,
      skippedParagraphs,
      incorrectParagraphs,
      skipped: skippedParagraphs.length,
      createdAt: this.startAt.format("YYYY-MM-DD HH:mm:ss"),
      endAt: this.endAt ? this.endAt.format("YYYY-MM-DD HH:mm:ss") : "-",
      spend: (() => {
        if (this.endAt) {
          const spendSeconds = this.endAt.unix() - this.startAt.unix();
          const remainingSeconds = spendSeconds % 60;
          const spendMinutes = (spendSeconds / 60).toFixed(0);
          return spendSeconds < 60
            ? `${spendSeconds}秒`
            : `${spendMinutes}分${paddingZero(remainingSeconds)}秒`;
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

  toJSON(): IExamSceneDomain {
    const {
      paragraphs,
      status,
      displayedWords,
      curWords,
      combo,
      maxCombo,
      countdown,
      index,
      curParagraph,
      curParagraphId,
      inputtingWords,
      correctParagraphs: correctParagraphs,
      incorrectParagraphs: incorrectParagraphs,
      skippedParagraphs,
      remainingParagraphsCount,
    } = this;
    return {
      status,
      paragraphs,
      // combo,
      // maxCombo,
      countdown,
      inputting: "",
      index,
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

  clearTimer() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
  }
}

export default Exam;
