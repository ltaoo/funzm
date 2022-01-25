/**
 * @file 测验类
 * 1、数据由外部传入
 * 2、已结束状态由外部决定
 */
import dayjs, { Dayjs } from "dayjs";

import { IParagraphValues } from "@/domains/caption/types";

import { arr2map } from "./utils";
import { ExamStatus, EXPECTED_SECONDS_PER_PARAGRAPH } from "./constants";
import { IExamBaseParams, IExamSceneDomain } from "./types";

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
  startedAt: Dayjs;
  /**
   * 结束/完成时间
   */
  endedAt: Dayjs;
  /**
   * 当前句子处于第几个
   */
  index: number = 1;
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

  constructor(params: IExamBaseParams) {
    const {
      title,
      status = ExamStatus.Prepare,
      curParagraphId,
      combo = 0,
      maxCombo = 0,
      paragraphs = [],
      canComplete = false,

      secondsPerParagraph = EXPECTED_SECONDS_PER_PARAGRAPH,

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

    this.status = status;
    this.curParagraph = null;
    this.skippedParagraphs = [];
    this.correctParagraphs = [];
    this.incorrectParagraphs = [];
    this.startedAt = dayjs();

    this.title = title;
    this.paragraphs = filterEmptyTextParagraphs(paragraphs);
    this.paragraphMap = arr2map(this.paragraphs, "id");

    const curParagraphIndex = paragraphs.findIndex(
      (paragraph) => paragraph.id === curParagraphId
    );
    this.index = curParagraphIndex + 1;

    this.curParagraphId = curParagraphId;

    // 无限模式
    this.needMoreParagraphs = 2;
    this.canComplete = canComplete;
    // 限时模式
    this.remainingParagraphsCount =
      this.paragraphs.slice(curParagraphIndex).length;
    const expectedSeconds = this.paragraphs.length * secondsPerParagraph;
    let countdown =
      expectedSeconds -
      (expectedSeconds - this.remainingParagraphsCount * secondsPerParagraph);

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
      this.curParagraph = this.paragraphMap[this.curParagraphId];
      if (!this.curParagraph) {
        this.curParagraph = this.paragraphMap[this.paragraphs[0].id];
      }
    }

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
    const response = this.toJSON();
    this.onChange(response);
    return response;
  }

  setA() {
    throw new Error("子类需要实现该方法");
  }

  next(isSkip?: boolean) {
    if (this.onBeforeNext) {
      const canContinue = this.onBeforeNext(this.toJSON());
      if (canContinue === false) {
        return;
      }
    }
    if (this.status === ExamStatus.Completed) {
      console.log("[DOMAIN]exam - next", this.status === ExamStatus.Completed);
      return;
    }
    const matchedIndex = this.paragraphs.findIndex(
      (paragraph) => paragraph.id === this.curParagraphId
    );
    const remainingParagraphsCount =
      this.paragraphs.length - (matchedIndex + 1);

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
      this.setA();
    }
    this.index += 1;
    if (!nextParagraph && this.canComplete) {
      this.status = ExamStatus.Completed;
      this.endedAt = dayjs();
      if (this.onComplete) {
        clearInterval(this.countdownTimer);
        const res = this.toJSON();
        this.onComplete(res);
      }
    }
    const res = this.toJSON();
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
        console.log("中断跳过。");
        return;
      }
    }
    if (this.status === ExamStatus.Completed) {
      return new Error("测验已结束。");
    }
    if (this.status !== ExamStatus.Started) {
      return new Error("测验还未开始。");
    }
    this.skippedParagraphs.push(this.curParagraph);
    this.next(true);
  }

  write(...params: any[]) {
    throw new Error("子类需要实现该方法。");
  }

  diff(...params: any[]): string | null {
    throw new Error("子类需要实现该方法。");
  }

  clear() {
    this.onChange(this.toJSON());
  }

  compare(...params: any[]) {
    const diffContent = this.diff(...params);

    if (diffContent === null) {
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
      input: diffContent,
    });
    // console.log("Incorrect!");
    this.combo = 0;
    this.onIncorrect(this.toJSON());

    this.next();
  }

  enableComplete() {
    this.canComplete = true;
  }

  // 改变句子列表值
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

  clearTimer() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
  }

  toJSON() {
    return {} as IExamSceneDomain;
  }
}

export default Exam;
