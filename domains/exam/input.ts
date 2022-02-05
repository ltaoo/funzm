import { compareLine, splitText2Words } from "@/domains/caption/utils";

import Exam from "./base";
import { ExamStatus } from "./constants";
import { IExamSceneDomain, IInputExamParams } from "./types";

export default class InputExam extends Exam {
  /**
   * 正在输入的字符串
   */
  inputting: string;

  constructor(props: IInputExamParams) {
    super({
      ...props,
      onBeforeNext: () => {
        this.inputting = "";
        return true;
      },
    });

    this.inputting = "";
  }

  write(word) {
    if (this.status === ExamStatus.Completed) {
      return;
    }
    this.inputting = word;
    this.onChange(this.toJSON());
  }

  setA() {
    this.inputting = "";
  }

  diff() {
    const { inputting, curParagraph } = this;
    const theContentRemovedChar = curParagraph.text2;
    //     const words = splitText2Words(curParagraph.text2);
    //     const theContentRemovedChar = words.map(([, text]) => text).join(' ');
    const diffNodes = compareLine(theContentRemovedChar, inputting);
    if (diffNodes === null) {
      return null;
    }
    const errorInputting = inputting;
    return errorInputting;
  }

  toJSON() {
    const {
      paragraphs,
      status,
      inputting,
      countdown,
      index,
      curParagraph,
      curParagraphId,
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
      inputting,
      curParagraph,
      curParagraphId,
      correctParagraphs,
      incorrectParagraphs,
      skippedParagraphs,
      remainingParagraphsCount,
    } as IExamSceneDomain;
  }
}
