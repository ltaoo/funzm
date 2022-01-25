import * as diff from "diff";

import { INoteValues } from "@/domains/note/types";

import { DiffNode, IParagraphValues } from "./types";

/**
 * 将一段英文分割成单词
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

/**
 * 打乱数组顺序
 */
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

/**
 * 将一段文本按空格切割并打乱顺序
 */
export function splitAndRandomTextSegments(text2) {
  if (!text2) {
    return [];
  }
  const segments = text2.split(" ");
  return shuffle(segments).map((str) => {
    return {
      uid: uid(),
      text: str,
    };
  });
}

export function mergeMultipleLines(prevParagraph, cur) {
  const { line: prevLine, text1: prevText1, text2: prevText2 } = prevParagraph;
  const { line, start, end, text1, text2 } = cur;
  // const lastChar = prevText2.charAt(prevText2.length - 1);
  const copy = { ...prevParagraph };
  copy.line = `${prevLine}+${line}`;
  copy.end = end;
  copy.text1 = prevText1 + ` ${text1}`;
  copy.text2 = prevText2 + ` ${text2}`;
  // copy.indexes = [].join(',');
  return copy;
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

function isBetween(value, range) {
  if (value >= range[0] && value <= range[1]) {
    return true;
  }
  return false;
}

interface TmpNode {
  text: string;
  type: "text" | "note";
  range: [number, number];
  note?: INoteValues;
  children?: TmpNode[];
}

/**
 * 解析文本，转换成抽象对象，能够渲染出高亮标签
 */
export function splitTextHasNotes(content, notes) {
  const result: TmpNode[] = [
    {
      type: "text",
      text: content,
      range: [0, content.length],
    },
  ];

  let startANote = false;

  for (let i = 0; i < notes.length; i += 1) {
    const note = notes[i];
    const { start, end } = note;
    for (let j = 0; j < result.length; j += 1) {
      const { type, text, range, note: prevNote } = result[j];
      if (isBetween(start, range) && isBetween(end, range)) {
        // 最普通的场景，在普通文本内添加笔记
        if (type === "text") {
          result.splice(
            j,
            1,
            {
              type: "text",
              text: text.slice(0, start - range[0]),
              range: [range[0], start],
            },
            {
              type: "note",
              text: text.slice(start - range[0], end - range[0]),
              range: [start, end],
              note: notes[i],
            },
            {
              type: "text",
              text: text.slice(end - range[0]),
              range: [end, range[1]],
            }
          );
          j += 2;
        }
        // 在笔记内添加笔记
        if (type === "note") {
          result.splice(
            j,
            1,
            ...[
              {
                type: "note" as const,
                text: text.slice(0, start - range[0]),
                range: [range[0], start] as [number, number],
                note: prevNote,
                children: [
                  {
                    type: "note" as const,
                    text: text.slice(start - range[0], end - range[0]),
                    range: [start, end] as [number, number],
                    note,
                  },
                ],
              },
              {
                type: "note" as const,
                text: text.slice(end - range[1]),
                range: [end, range[1]] as [number, number],
                note: prevNote,
              },
            ]
          );
          j += 1;
        }
      } else if (isBetween(start, range) && start !== range[1]) {
        // start !== range[1] 是为了避免 if my career in 有 my career 笔记包含在 my career in，但先被 `if ` 这个节点捕获的情况
        startANote = true;
        if (type === "text") {
          result.splice(
            j,
            1,
            ...[
              {
                type: "text" as const,
                text: text.slice(0, start - range[0]),
                range: [range[0], start] as [number, number],
              },
              {
                type: "note" as const,
                text: text.slice(end - range[1]),
                range: [end, range[1]] as [number, number],
                note,
              },
            ]
          );
          j += 1;
        }
        if (type === "note") {
          result.splice(
            j,
            1,
            ...[
              {
                type: "note" as const,
                text: text.slice(0, start - range[0]),
                range: [range[0], range[1]] as [number, number],
                note: prevNote,
                children: [
                  {
                    type: "note" as const,
                    text: text.slice(start - range[0], end - range[0]),
                    range: [start, range[1]] as [number, number],
                    note,
                  },
                ],
              },
              // {
              //   type: "note" as const,
              //   text: text.slice(end - range[1]),
              //   range: [end, range[1]] as [number, number],
              //   note,
              // },
            ]
          );
          // j += 1;
        }
      } else if (isBetween(end, range)) {
        if (!startANote) {
          continue;
        }
        if (type === "text") {
          result.splice(
            j,
            1,
            ...[
              {
                type: "note" as const,
                text: text.slice(0, end - range[0]),
                range: [range[0], end] as [number, number],
                note,
              },
              {
                type: "text" as const,
                text: text.slice(end - range[0]),
                range: [end, range[1]] as [number, number],
              },
            ]
          );
          j += 1;
        }
      } else {
        if (startANote) {
          //
        }
      }
    }
    startANote = false;
  }
  return result;
}

export function hasTowLanguage(paragraph: IParagraphValues) {
  const { text1, text2 } = paragraph;

  if (text1 === undefined) {
    return false;
  }
  if (text2 === undefined) {
    return false;
  }

  if (!/[a-z]/.test(text2)) {
    return false;
  }

  return true;
}
