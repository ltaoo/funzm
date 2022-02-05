import { compareLine, splitText2Words } from "@/domains/caption/utils";

import Exam from "./base";
import { ExamStatus } from "./constants";
import { IExamSceneDomain } from "./types";
import { shuffle, uid } from "./utils";

export default class SelectionExam extends Exam {
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

  constructor(props) {
    super(props);

    this.curWords = [];
    this.displayedWords = [];

    if (this.curParagraph) {
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

    this.inputtingWords = [];
  }

  next(isSkip) {
    this.inputtingWords = [];
    super.next(isSkip);
  }

  clear() {
    this.inputtingWords = [];
    super.clear();
  }

  setA() {
    if (this.curParagraph) {
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

  diff(inputtingWords, words) {
    const inputting = inputtingWords.map((w) => w.word).join(" ");
    // console.log("[DOMAIN]exam - compare", inputtingWords, words);
    const diffNodes = compareLine(words.join(" "), inputting);
    if (diffNodes === null) {
      return null;
    }
    const errorInputting = this.inputtingWords.map((w) => w.word).join(" ");
    return errorInputting;
  }

  toJSON() {
    const {
      paragraphs,
      status,
      displayedWords,
      curWords,
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
    // @ts-ignore
    return {
      status,
      paragraphs,
      countdown,
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
    } as IExamSceneDomain;
  }
}
