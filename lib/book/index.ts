import fs from "fs";
import path from "path";

import { unified } from "unified";
import parse from "remark-parse";
import gfm from "remark-gfm";
import frontmatter from "remark-frontmatter";
import toc from "remark-toc";
// import rehype from "remark-rehype";
import { visit } from "unist-util-visit";

import { splitEnglish } from "./utils";

function createToc() {}

function debug(options: { name: string }) {
  const { name } = options;
  return function debugPlugin() {
    // console.log(name);
  };
}
function wordConvert(content) {}

const errorParagraphFlags = ["误", "不佳"];
function exampleNodeToParagraphNode(node) {
  const { lang, value } = node;
  if (lang !== "e") {
    return node;
  }
  // node.type = "example";
  const { english, flag, translate, analysis } = (() => {
    const lines = value.split("\n");
    let flag = {
      [errorParagraphFlags[0]]: 1,
      [errorParagraphFlags[1]]: 2,
    };
    const result = {
      english: lines[0],
      flag: 3,
      translate: null,
      analysis: null,
    };
    if (errorParagraphFlags.includes(lines[1])) {
      result.flag = flag[lines[1]];
    } else if (lines[1] === "") {
      // ignore
    } else {
      result.translate = lines[1];
    }
    const thirdLine = lines[2];
    if (thirdLine) {
      result.analysis = thirdLine;
    }
    return result;
  })();
  const { text, underlines } = splitEnglish(english);
  node.meta = {
    text,
    underlines,
    flag,
    translate,
    analysis,
  };
  node.type = "example";
  node.children = [
    {
      type: "text",
      value: text,
    },
  ];
  return node;
}

function parseTimeline(content) {
  let i = 0;
  let t = content[i];

  const tokens = [];

  let isTop = false;
  let isUnder = false;
  let isArrow = false;
  let isNow = false;

  let isEnter = false;
  let token = {
    type: undefined,
    top: "",
    text: "",
    under: "",
  };

  function walk() {
    i += 1;
    t = content[i];
    if (t === undefined) {
      tokens.push(token);
    }
  }

  while (t) {
    if (t === "(") {
      if (!isNow) {
        isTop = true;
        token.type = "simple";
        walk();
        continue;
      }
    }
    if (t === ")") {
      isTop = false;
      walk();
      continue;
    }
    if (t === "{") {
      isTop = true;
      token.type = "completed";
      walk();
      continue;
    }
    if (t === "}") {
      isTop = false;
      walk();
      continue;
    }
    if (t === "[") {
      isUnder = true;
      walk();
      continue;
    }
    if (t === "]") {
      isUnder = false;
      walk();
      continue;
    }
    if (t === "\\") {
      isEnter = true;
      walk();
      continue;
    }
    if (t === "n" && isEnter) {
      isEnter = false;
      t = "\n";
    }
    if (t === " ") {
      if (!isTop && !isUnder && !isArrow && !isNow && !isTop) {
        tokens.push({ ...token });
        token.type = undefined;
        token.top = "";
        token.text = "";
        token.under = "";
        walk();
        continue;
      }
    }
    if (t === "-") {
      if (!isUnder && !isNow && !isTop) {
        isArrow = true;
        walk();
        continue;
      }
    }
    if (t === ">") {
      if (isArrow) {
        token.type = "right-arrow";
        isArrow = false;
      }
      walk();
      continue;
    }
    if (isTop) {
      token.top += t;
      walk();
      continue;
    }
    if (isUnder) {
      token.under += t;
      walk();
      continue;
    }
    token.text += t;
    walk();
  }
  return tokens;
}
function timeNodeTransform(node) {
  const { lang, value } = node;
  if (lang !== "graph") {
    return node;
  }
  node.meta = {
    chars: parseTimeline(value),
  };
  node.type = "graph";
  node.children = [];
  return node;
}

let isTable = false;
function rehype(ast) {
  const { type, meta, value, children } = ast;
  if (type === "root") {
    return children.map(rehype);
  }
  if (type === "heading") {
    const { depth } = ast;
    if (children.length === 1 && children[0].type === "text") {
      return [
        "h",
        children[0].value,
        {
          level: depth,
        },
      ];
    }
    return [
      "h",
      children.map(rehype),
      {
        level: depth,
      },
    ];
  }
  if (type === "paragraph") {
    return ["p", children.map(rehype)];
  }
  if (type === "text") {
    return ["span", value];
  }
  if (type === "strong") {
    return ["b", children.map(rehype)];
  }
  if (type === "blockquote") {
    return ["blockquote", children.map(rehype)];
  }
  if (type === "list") {
    const { ordered } = ast;
    return [ordered ? "ol" : "ul", children.map(rehype)];
  }
  if (type === "listItem") {
    return ["li", children.map(rehype)];
  }
  if (type === "table") {
    isTable = true;
    return [
      "table",
      children.map(rehype),
      {
        align: ast.align,
      },
    ];
  }
  if (type === "tableRow") {
    // console.log(JSON.stringify(ast, null, 2));
    return [
      "row",
      children.map(rehype),
      {
        head: (() => {
          if (isTable) {
            isTable = false;
            return true;
          }
          return false;
        })(),
      },
    ];
  }
  if (type === "tableCell") {
    return ["col", children.map(rehype)];
  }

  if (type === "example") {
    const { text, ...props } = meta;
    return ["example", text, props];
  }
  if (type === "graph") {
    const { text, ...props } = meta;
    return ["graph", "", props];
  }
  // console.log(JSON.stringify(ast, null, 2));
  // return ["p", ast];
  return [];
}

const RESOURCE_ROOT_DIR = path.join(process.cwd(), "posts");
export function readMarkdown(filepath) {
  const content = fs.readFileSync(
    path.resolve(RESOURCE_ROOT_DIR, filepath),
    "utf-8"
  );
  return content;
}

export function transform(filepath) {
  const content = readMarkdown(filepath);

  return unified()
    .use(parse)
    .use(debug, { name: "parse" })
    .use(gfm)
    .use(frontmatter)
    .use(toc)
    .use(function () {
      return (tree) => {
        visit(tree, "code", (node) => {
          exampleNodeToParagraphNode(node);
        });
        visit(tree, "code", (node) => {
          timeNodeTransform(node);
        });
      };
    })
    .use(function () {
      function compiler(ast) {
        const result = rehype(ast).filter((node) => node.length !== 0);
        return JSON.stringify(result, null, 2);
      }
      Object.assign(this, { Compiler: compiler });
    })
    .process(content)
    .then(
      (file) => {
        return String(file);
      },
      (error) => {
        // Handle your error here!
        throw error;
      }
    );
}
