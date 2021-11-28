import { Caption } from "./types";

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
/**
 * 解析字幕文件
 */
export async function parseCaptionFile(file) {
  const segments = file.name.split(".");
  const ext = getExt(file.name);
  const content = await readTextFromFile(file);
  const result = parseCaptionContent(content, ext);
  return {
    title: segments.slice(0, -1).join("."),
    type: ext,
    paragraphs: result,
  };
}

/**
 * 从本地文件中读取文本内容
 * @param file
 * @param encoding
 * @returns
 */
export function readTextFromFile(file, encoding = "utf-8"): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target.result instanceof ArrayBuffer) {
        resolve(String(e.target.result));
        return;
      }
      resolve(e.target.result);
    };
    reader.readAsText(file, encoding);
  });
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
    const result = content
      .replace(/\d+\s*(\d+:?){3},\d* --> (\d+:?){3},\d*/g, "")
      .replace(/{\\an.*}/g, "")
      .replace(/{\\pos.*}/g, "")
      .replace(/(\s*\n){3,}/g, "\n\n")
      .trim();
    return result;
  },
  ass: (content) => {
    const lines = content.match(/Dialogue:.*\n?/g);
    return lines.map((line, index) => {
      const removeTextModifier = line.replace(/{.*?}/g, "");
      const [, start, end, style, name, ml, mr, mv, effect, ...text] =
        removeTextModifier.split(",");
      const [text1, text2] = text.join(",").split("\\N");
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
  format?: "srt" | "ass" | "txt"
): Caption["paragraphs"] {
  //   console.log("[]parseCaptionContent", format);
  const parser = CAPTION_PARSER_MAP[format];
  if (parser) {
    return parser(content);
  }
  return [
    {
      line: 1,
      start: 0,
      end: 0,
      text1: content,
      text2: undefined,
    },
  ];
}

/**
 * 序列化字幕对象
 * @param caption
 * @returns
 */
export function stringifyCaption(caption: Caption) {
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
