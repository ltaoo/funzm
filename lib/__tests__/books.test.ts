import { describe, expect, it } from "vitest";

import { splitEnglish, collectToc, simplifyParentKey } from "../book/utils";

// describe("english splitting", () => {
//   it("1", () => {
//     const english = `(His wife), who keeps a singing canary and two talking parrots, \(doesn’t love\) (the cat) so much.`;

//     const res = splitEnglish(english);
//     expect(res).toStrictEqual({
//       text: "His wife, who keeps a singing canary and two talking parrots, (doesn’t love) the cat so much.",
//       underlines: [
//         {
//           start: 0,
//           end: 8,
//         },
//         {
//           start: 77,
//           end: 84,
//         },
//       ],
//     });
//   });
// });

describe("generate toc", () => {
  it("1", () => {
    const data = [
      ["h", "旋元佑文法进阶", { level: 1 }],
      ["h", "第一章 基本句型", { level: 2 }],
      ["h", "单句：五种基本句型", { level: 3 }],
      ["h", "主部与述部", { level: 3 }],
      ["h", "补语的词类", { level: 3 }],
      ["h", "⼀. 名词补语", { level: 4 }],
      ["h", "⼆. 形容词补语", { level: 4 }],
      ["h", "基本句型分辨", { level: 3 }],
      ["h", "⼀. 两个元素的句型", { level: 4 }],
      ["h", "结语", { level: 3 }],
      ["h", "第二章 名词片语", { level: 2 }],
      ["h", "名词", { level: 3 }],
      ["h", "⼀．可数名词", { level: 4 }],
    ];
    const toc = {
      level: 0,
      root: null,
      cur: null,
    };

    collectToc(data, toc);

    delete toc.cur;
    const res = simplifyParentKey([toc.root]);
    expect(res[0]).toStrictEqual({
      level: 1,
      text: "旋元佑文法进阶",
      children: [
        {
          level: 2,
          text: "第一章 基本句型",
          children: [
            {
              level: 3,
              text: "单句：五种基本句型",
              children: [],
            },
            {
              level: 3,
              text: "主部与述部",
              children: [],
            },
            {
              level: 3,
              text: "补语的词类",
              children: [
                {
                  level: 4,
                  text: "⼀. 名词补语",
                  children: [],
                },
                {
                  level: 4,
                  text: "⼆. 形容词补语",
                  children: [],
                },
              ],
            },
            {
              level: 3,
              text: "基本句型分辨",
              children: [
                {
                  level: 4,
                  text: "⼀. 两个元素的句型",
                  children: [],
                },
              ],
            },
            {
              level: 3,
              text: "结语",
              children: [],
            },
          ],
        },
        {
          level: 2,
          text: "第二章 名词片语",
          children: [
            {
              level: 3,
              text: "名词",
              children: [
                {
                  level: 4,
                  text: "⼀．可数名词",
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    });
  });
});
