import * as diff from "diff";

import { DiffNode } from "./types";

/**
 * 将一段英文分割成单词
 * @param text2
 */
export function splitText2Words(text2: string): string[][] {
  const words = text2.split(" ");
  const result = [];
  for (let i = 0; i < words.length; i += 1) {
    const word = words[i];
    const matched = word.match(/(^[^\w\s]*)(.*?)([^\w\s]*?$)/);
    if (matched === null) {
      result.push([word]);
    } else {
      const [, prefix, w, suffix] = matched;
      result.push([prefix, w, suffix]);
    }
  }
  return result;
}

/**
 * 比较两段文本
 * @param {string} content - 原文
 * @param {string} inputtingParagraph - 输入的内容
 * @returns
 */
export function compareLine(content, inputtingParagraph) {
  if (!content) {
    //
    return;
  }
  const diffNodes: DiffNode[] = diff.diffWords(
    content.trimRight(),
    inputtingParagraph.trimRight(),
    {
      newlineIsToken: true,
      ignoreWhitespace: false,
      ignoreCase: false,
    }
  );

  if (diffNodes !== null) {
    const errorNodes = diffNodes.filter((node) => {
      const { added, removed } = node;
      return added === true || removed === true;
    });
    if (errorNodes.length !== 0) {
      return diffNodes;
    }
  }
  return null;
}

/**
 * 比较整篇字幕和输入的内容
 * @param {Paragraph[]} inputting - 原文全部段落
 * @param {Paragraph[]} originalContent - 输入的全部段落
 * @returns
 */
export function compareInputting(inputting, originalContent) {
  const cleanInputting = Object.keys(inputting)
    .filter((line) => {
      return !!inputting[line];
    })
    .map((line) => {
      return {
        [line]: inputting[line],
      };
    })
    .reduce((total, cur) => ({ ...total, ...cur }), {});

  const errors = {};

  const lines = Object.keys(cleanInputting);
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    errors[line] = null;
    const inputtingParagraph = inputting[line];
    const content = originalContent[line];

    const diffNodes = compareLine(content, inputtingParagraph);
    if (diffNodes) {
      errors[line] = errors[line] || [];
      errors[line] = diffNodes;
    }
  }
  return errors;
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

/**
 * 优化段落，将多句合并成一句
 * @param paragraphs
 * @returns
 */
export function optimizeParagraphs(paragraphs) {
  const nextParagraphs = paragraphs.reduce((result, cur) => {
    const prevParagraph = result[result.length - 1];
    if (prevParagraph) {
      const {
        line: prevLine,
        text1: prevText1,
        text2: prevText2,
      } = prevParagraph;
      const { line, start, end, text1, text2 } = cur;
      const lastChar = prevText2.charAt(prevText2.length - 1);
      if ([","].includes(lastChar) || /[a-z]/.test(lastChar)) {
        const copy = { ...prevParagraph };
        copy.line = `${prevLine}+${line}`;
        copy.end = end;
        copy.text1 = prevText1 + ` ${text1}`;
        copy.text2 = prevText2 + ` ${text2}`;
        result[result.length - 1] = copy;
        return result;
      }
    }
    return result.concat(cur);
  }, []);
  return nextParagraphs;
}

/**
 * 将合并的段落拆分出来
 * @param paragraphs
 * @param mergedLine
 * @returns
 */
export function splitMergedParagraphs(paragraphs, mergedLine) {
  const matchedLineIndex = paragraphs.findIndex((paragraph) => {
    return paragraph.line === mergedLine;
  });
  if (matchedLineIndex !== -1) {
    const originalLines = mergedLine.split("+").map(Number);
    const originalParagraphs = paragraphs.filter((paragraph) => {
      return originalLines.includes(paragraph.line);
    });
    const nextOptimizedParagraphs = [...paragraphs];
    nextOptimizedParagraphs.splice(matchedLineIndex, 1, ...originalParagraphs);
    return nextOptimizedParagraphs;
  }
  return paragraphs;
}
