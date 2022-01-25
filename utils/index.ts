import { Packer, Document, Paragraph, TextRun } from "docx";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import { TAB_TITLE_SUFFIX } from "@/constants";
import dayjs from "dayjs";

export function sleep(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

let insertedStyle: HTMLStyleElement | null = null;
/**
 * 插入一段 style 到页面
 */
export function insertStyle(css) {
  if (insertedStyle === null) {
    const head = document.head || document.getElementsByTagName("head")[0];
    insertedStyle = document.createElement("style");
    insertedStyle.type = "text/css";

    head.appendChild(insertedStyle);
  }

  // @ts-ignore
  if (insertedStyle.styleSheet) {
    // This is required for IE8 and below.
    // @ts-ignore
    insertedStyle.styleSheet.cssText = css;
  } else {
    insertedStyle.appendChild(document.createTextNode(css));
  }
}

/**
 * 生成 txt 并下载
 */
export function downloadTxt(caption) {
  const { title, paragraphs } = caption;
  const content = new Blob(
    [`${title}\n\n\n`].concat(
      paragraphs.map((paragraph) => {
        const { text1, text2 } = paragraph;
        return `${text1}\n${text2}\n\n`;
      })
    )
  );
  saveAs(content, `${title}.txt`);
}

/**
 * 生成 docx 并下载
 * @param paragraphs
 */
export function downloadDocx(
  caption,
  styles?: {
    text1: {
      fontSize?: number;
      color: string;
    };
    text2: {
      fontSize?: number;
      color: string;
    };
  }
) {
  const { title, paragraphs } = caption;
  const {
    text1: text1Style = {
      fontSize: 24,
      color: "#9da3ae",
    },
    text2: text2Style = {
      fontSize: 36,
    },
  } = styles || {};

  const texts = paragraphs
    .map((paragraph, index) => {
      const { text1 = "", text2 = "" } = paragraph;
      return [
        // 中文
        new Paragraph({
          children: [
            new TextRun({
              text: text1,
              color: text1Style.color,
              size: text1Style.fontSize,
            }),
          ],
        }),
        // 英文
        new Paragraph({
          children: [
            new TextRun({
              text: text2,
              size: text2Style.fontSize,
            }),
          ],
        }),
        index === paragraphs.length - 1
          ? null
          : new Paragraph({
              text: "\n",
            }),
      ];
    })
    .reduce((result, cur) => result.concat(cur), [])
    .filter(Boolean);
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            // 字幕标题
            children: [
              new TextRun({
                text: title,
                size: 48,
              }),
            ],
          }),
          // 换行
          new Paragraph({
            text: "\n",
          }),
          ...texts,
        ],
      },
    ],
  });
  return Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `${title}.docx`);
    return true;
  });
}

/**
 * 生成 pdf 并下载
 * @param title
 * @param paragraphs
 */
export function downloadPdf(caption, styles?: {}) {
  const { title, paragraphs } = caption;
  const doc = new jsPDF();
  doc.addFont(
    "https://static.ltaoo.work/SourceHanSans-Normal.ttf",
    "SourceHanSans",
    "normal"
  );
  const paddingX = 12;
  const WIDTH = 206;
  const maxWidth = WIDTH - paddingX - paddingX;
  const x = 12;
  let y = 28;
  doc.setFontSize(24);
  doc.text(title, x, y, {
    maxWidth,
  });

  y += 42;

  paragraphs.forEach((paragraph) => {
    const { text1 = "", text2 = "" } = paragraph;
    doc.setTextColor("#9da3ae");
    doc.setFontSize(12);

    doc.setFont("SourceHanSans");
    if (y > 294 - paddingX) {
      doc.addPage();
      y = 24;
    }
    doc.text(text1, x, y, {
      maxWidth,
    });
    const { h: text1h, lines: text1l } = getWidthAndHeight(text1, doc, {
      maxWidth,
    });
    // 中英文边距
    y += 4 + text1h + (text1l > 1 ? 4 : 0);
    doc.setFontSize(18);
    doc.setTextColor("#000000");
    doc.setFont("Helvetica");
    if (y > 294 - paddingX) {
      doc.addPage();
      y = 24;
    }
    doc.text(text2, x, y, {
      maxWidth,
    });
    const { h: text2h, lines: text2l } = getWidthAndHeight(text2, doc, {
      maxWidth,
    });
    y += 12 + text2h + (text2l > 1 ? 4 : 0);
  });

  doc.setProperties({
    title,
    author: "funzm",
    keywords: "caption, funzm",
    creator: "funzm",
  });
  doc.save(`${title}.pdf`);
  return Promise.resolve(true);
}

function getWidthAndHeight(text, doc, { maxWidth }) {
  // const size = doc.getFontSize();
  // 检测中英文？
  const { w, h } = doc.getTextDimensions(text.slice(0, 1));
  if (text.length * w > maxWidth) {
    let lines = Math.floor((text.length * w) / maxWidth);
    if ((text.length * w) % maxWidth !== 0) {
      lines += 1;
    }
    // console.log("lines", w, h, maxWidth, text, lines);
    return {
      w: maxWidth,
      h: lines * h,
      lines,
    };
  }
  return {
    w: text.length * w,
    h,
    lines: 1,
  };
  // text.length * w
}

export function tabTitle(title) {
  return `${title} - ${TAB_TITLE_SUFFIX}`;
}

export function buffer2ImgUrl(buffer) {
  const bytes = new Uint8Array(buffer.data);
  let data = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    data += String.fromCharCode(bytes[i]);
  }

  return "data:image/png;base64," + window.btoa(data);
}

/**
 * 时间格式化
 * @param time
 * @param short
 * @returns
 */
export function df(time, short: boolean = false) {
  if (short) {
    return dayjs(time).format("MM-DD HH:mm:ss");
  }
  return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
}
