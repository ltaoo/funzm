/**
 * 
 * 
```e
The (only thing) [\(that\) I can do] (is) (\(to\) hope).

S 关系⼦句 V C
```

4 15
37 40
42 54

The only thing [(that) I can do] is (to) hope.

4 14
33 35
36 45

4-0     15-1
37-4    40-5
42-6    54-9
 */
import fs from "fs";
import path from "path";

import { unified } from "unified";
import parse from "remark-parse";
import frontmatter from "remark-frontmatter";
import yaml from "js-yaml";

import { transform } from ".";

export function splitEnglish(paragraph) {
  let i = 0;
  let t = paragraph[i];
  let text = "";
  const underlines = [];
  let isEscape = false;
  let underline = false;
  const node = {
    start: 0,
    end: 0,
  };
  let specialCharsCount = 0;
  while (t) {
    if (t === "\\") {
      isEscape = true;
      specialCharsCount += 1;
    } else if (t === "(") {
      if (isEscape) {
        text += "(";
        isEscape = false;
      } else {
        node.start = (() => {
          if (i - specialCharsCount === 0) {
            return 0;
          }
          return i - specialCharsCount;
        })();
        specialCharsCount += 1;
        underline = true;
      }
    } else if (t === ")") {
      if (isEscape) {
        text += ")";
        isEscape = false;
      } else {
        specialCharsCount += 1;
        node.end = i - specialCharsCount + 1;
        underlines.push({ ...node });
        node.start = 0;
        node.end = 0;
      }
      underline = false;
    } else {
      text += t;
    }
    i += 1;
    t = paragraph[i];
  }
  return {
    text,
    underlines,
  };
}

function findSameLevelNode(node, lv) {
  const { level } = node;
  if (level !== lv) {
    return findSameLevelNode(node.parent, lv);
  }
  if (node.parent === undefined) {
    return node.children.find((n) => findSameLevelNode(n, level));
  }
  return node;
}
export function collectToc(paragraphs, toc) {
  if (!Array.isArray(paragraphs)) {
  } else {
    paragraphs.forEach((node) => {
      const [type, children, options = {}] = node;
      if (type === "h") {
        const { level } = options;
        if (toc.level === 0) {
          toc.level = level;
          toc.root = {
            level,
            text: children,
            children: [],
            ...options,
          };
          toc.cur = toc.root;
        } else if (toc.level < level) {
          const node = {
            level,
            text: children,
            parent: toc.cur,
            children: [],
            ...options,
          };
          toc.level = level;
          toc.cur.children.push(node);
          toc.cur = node;
        } else {
          toc.level = level;
          const sameLevelNode = findSameLevelNode(toc.cur, level);
          const node = {
            level,
            text: children,
            parent: sameLevelNode.parent,
            children: [],
            ...options,
          };
          sameLevelNode.parent.children.push(node);
          toc.cur = node;
        }
      } else {
        collectToc(children, toc);
      }
    });
  }
}

export function removeParentKey(arr) {
  return arr.map((node) => {
    const { parent, children, ...rest } = node;
    return {
      ...rest,
      children: removeParentKey(children),
    };
  });
}

function collectHeading(ast) {
  const { type, meta, value, children } = ast;
  if (type === "root") {
    return children.map(collectHeading);
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
      children.map(collectHeading),
      {
        level: depth,
      },
    ];
  }
  return [];
}
const RESOURCE_ROOT_DIR = path.join(process.cwd(), "posts");

async function getTocFormMarkdownDirectly(markdown) {
  const file = await unified()
    .use(parse)
    .use(frontmatter)
    .use(function () {
      function compiler(ast) {
        const result = collectHeading(ast).filter((node) => node.length !== 0);
        return JSON.stringify(result, null, 2);
      }
      Object.assign(this, { Compiler: compiler });
    })
    .process(markdown);
  const result = JSON.parse(String(file));
  return result;
}
function addPageKey(node, page) {
  console.log("invoke add apge key", node[0], page);
  const [type, children, options = {}] = node;
  return [type, children, { ...options, page }];
}
let cache = null;
export async function getWholeToc(filepath) {
  if (cache) {
    return cache;
  }
  const { name, dir } = path.parse(filepath);
  if (name === "index") {
    const content = fs.readFileSync(
      path.resolve(RESOURCE_ROOT_DIR, filepath),
      "utf-8"
    );
    const configStr = content.match(/---(.|\s)+---/);
    let extraMarkdowns = [];
    if (configStr) {
      const lines = configStr[0].split("\n");
      const str = lines.slice(1, -1).join("\n");
      const { book } = yaml.load(str);
      extraMarkdowns = book.orders;
    }
    const chapters = fs
      .readdirSync(path.resolve(RESOURCE_ROOT_DIR, dir))
      .filter((name) => {
        const [index] = name.split(".");
        return !Number.isNaN(Number(index));
      });
    // const result = await getTocFormMarkdownDirectly(content);
    // console.log(result, extraMarkdowns, dir, chapters);
    let tocs = [];
    for (let i = 0; i < extraMarkdowns.length; i += 1) {
      const name = extraMarkdowns[i];
      const a = path.resolve(RESOURCE_ROOT_DIR, dir, `${name}.md`);
      if (fs.statSync(a)) {
        const c = fs.readFileSync(a, "utf-8");
        const d = await getTocFormMarkdownDirectly(c);
        tocs = tocs.concat(d);
        tocs.forEach((node) => {
          if (node[2].page === undefined) {
            node[2].page = name;
          }
        });
      }
    }
    for (let i = 1; i < chapters.length + 1; i += 1) {
      const a = path.resolve(RESOURCE_ROOT_DIR, dir, `${i}.md`);
      if (fs.statSync(a)) {
        const c = fs.readFileSync(a, "utf-8");
        const d = await getTocFormMarkdownDirectly(c);
        tocs = tocs.concat(d);
        // console.log(tocs);
        tocs.forEach((node) => {
          if (node[2].page === undefined) {
            node[2].page = i;
          }
        });
      }
    }
    cache = tocs;
    return tocs;
  }
  return [];
}

export async function getPagePropsFormMarkdown(filepath: string) {
  const resp = JSON.parse(await transform(filepath));
  const toc = {
    level: 0,
    root: null,
    cur: null,
  };
  collectToc(resp, toc);

  const wholeToc = await getWholeToc(filepath);

  const wtoc = {
    level: 0,
    root: null,
    cur: null,
  };

  collectToc([["h", "", { level: 1, page: "/" }]].concat(wholeToc), wtoc);
  delete wtoc.cur;

  const { name } = path.parse(filepath);

  return {
    content: resp,
    isIndex: name === "index",
    wholeToc: wtoc.root ? removeParentKey([wtoc.root]) : [],
    toc: {
      ...toc.root,
      children: toc.root ? removeParentKey(toc.root.children) : [],
    },
  };
}
