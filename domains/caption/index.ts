/**
 * @file 字幕领域
 */
import { CaptionFile } from "./types";

/**
 * 获取文件拓展
 * @param name
 * @returns
 */
export function getExt(name) {
  const segments = name.split(".");
  const ext = segments.pop();
  return ext;
}

function invertText(text, invert) {
  if (!invert) return text;
  return text
    .split("\n\n")
    .map((item) =>
      item
        .split("\n")
        .reduce((rst, p) => [p, ...rst], [])
        .join("\n")
    )
    .join("\n\n");
}

const CAPTION_PARSER_MAP = {
  srt: (content) => {
    const oriParagraphs = content.split("\r\n\r\n").filter(Boolean);
    return oriParagraphs.map((paragraph) => {
      const [line, startAndEnd, text1, text2] = paragraph.split("\r\n");
      const [start, end] = startAndEnd.split(" --> ");
      return {
        line,
        start: start.split(",")[0],
        end: end.split(",")[0],
        text1,
        text2,
      };
    });
  },
  ass: (content) => {
    const lines = content.match(/Dialogue:.*\n?/g);
    return lines.map((line, index) => {
      const removeTextModifier = line.replace(/{.*?}/g, "");
      const [, start, end, style, name, ml, mr, mv, effect, ...text] =
        removeTextModifier.split(",");
      const [text1 = "", text2 = ""] = text.join(",").split("\\N");
      return {
        line: index,
        start,
        end,
        text1,
        text2,
      };
    });
  },
  txt: (content) => {
    return content.replace(/(，|。|\.)+/g, "\n");
  },
};
/**
 * 解析字幕内容
 */
export function parseCaptionContent(
  content: string,
  format?: CaptionFileType
): CaptionFile["paragraphs"] {
  const parser = CAPTION_PARSER_MAP[format];
  if (parser) {
    return parser(content);
  }
  return [
    {
      id: 1,
      line: "1",
      start: "",
      end: "",
      text1: content,
      text2: undefined,
      valid: false,
    },
  ];
}

/**
 * 序列化字幕对象
 * @param caption
 * @returns
 */
export function stringifyCaption(caption: CaptionFile) {
  const { title, paragraphs } = caption;
  return {
    title,
    content: paragraphs
      .map((paragraph) => {
        const { text1 = "", text2 = "" } = paragraph;
        return `${text1}\n${text2}`;
      })
      .join("\n\n"),
  };
}

export default class Caption {
  constructor(options) {
    const { title, type, content } = options;
  }

  /**
   * 将段落切割成多个场景
   */
  splitParagraphsAsScene(paragraphs) {
    const total = paragraphs.length;
    // 一个场景建议 50 个段落
  }
}
