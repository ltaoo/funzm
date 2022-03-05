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

import { readMarkdown, transform } from ".";

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
    const r = node.children.find((n) => findSameLevelNode(n, level));
    if (r === undefined) {
      return node;
    }
    return r;
  }
  return node;
}

const m = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
};
export function collectToc(paragraphs, toc, name = "root") {
  if (!Array.isArray(paragraphs)) {
  } else {
    paragraphs.forEach((node) => {
      const [type, children] = node;
      const options = node[2] || {};
      if (type === "h") {
        const { level } = options;
        if (toc.level === 0) {
          options.uid = name;
          toc.level = level;
          toc.root = {
            uid: options.uid,
            level,
            text: children,
            children: [],
            ...options,
          };
          toc.cur = toc.root;
        } else if (toc.level < level) {
          m[level] += 1;
          const num = m[level];
          options.uid = `${toc.cur.uid}.${num}`;
          // 2 -> 3 这种情况
          const n = {
            uid: options.uid,
            level,
            text: children,
            parent: toc.cur,
            children: [],
            ...options,
          };
          toc.level = level;
          toc.cur.children.push(n);
          toc.cur = n;
        } else {
          // 3 -> 2 / 3 -> 3 这两种情况
          if (toc.level > level) {
            m[toc.level] = 0;
          }
          toc.level = level;
          m[level] += 1;
          const num = m[level];
          const sameLevelNode = findSameLevelNode(toc.cur, level);
          options.uid = `${sameLevelNode.parent.uid}.${num}`;
          const n = {
            uid: options.uid,
            level,
            text: children,
            parent: sameLevelNode.parent,
            children: [],
            ...options,
          };
          sameLevelNode.parent.children.push(n);
          toc.cur = n;
        }
      } else {
        collectToc(children, toc);
      }
    });
  }
}

function getSimpleParentKeys(obj) {
  if (obj === undefined) {
    return null;
  }
  const { level, text, parent, children } = obj;
  return {
    level,
    text,
    parent: getSimpleParentKeys(parent),
  };
}
/**
 * 简化 parent 字段使其不包含自引用
 */
export function simplifyParentKey(arr) {
  return arr.map((node, i) => {
    const { parent, children, ...rest } = node;
    return {
      ...rest,
      parent: getSimpleParentKeys(parent),
      children: simplifyParentKey(children),
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
function parseYaml(content) {
  const configStr = content.match(/---(.|\s)+---/);
  if (configStr) {
    const lines = configStr[0].split("\n");
    const str = lines.slice(1, -1).join("\n");
    return yaml.load(str);
  }
  return {};
}

async function getTocFormMarkdownDirectly(markdown) {
  const file = await unified()
    .use(parse)
    .use(frontmatter)
    .use(function () {
      function compiler(ast) {
        const result = collectHeading(ast).filter((node) => node.length !== 0);
        // .map((node) => {
        //   return {
        //     ...node,
        //     index,
        //     title,
        //   };
        // });
        return JSON.stringify(result, null, 2);
      }
      Object.assign(this, { Compiler: compiler });
    })
    .process(markdown);
  const result = JSON.parse(String(file));
  return result;
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
        // const info = c.match(/---(.|\s)+---/);
        // let title = "";
        // if (info) {
        //   const lines = info[0].split("\n");
        //   const str = lines.slice(1, -1).join("\n");
        //   title = yaml.load(str);
        // }
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
        // const info = c.match(/---(.|\s)+---/);
        // let title = "";
        // if (info) {
        //   const lines = info[0].split("\n");
        //   const str = lines.slice(1, -1).join("\n");
        //   title = yaml.load(str);
        // }
        const d = await getTocFormMarkdownDirectly(c);
        tocs = tocs.concat(d);
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
  const { name } = path.parse(filepath);
  // const c = readMarkdown(filepath);
  // const yaml = parseYaml(c);
  const resp = JSON.parse(await transform(filepath));
  const toc = {
    level: 0,
    root: null,
    cur: null,
  };

  const paragraphs = resp;
  collectToc(paragraphs, toc);

  const wholeToc = await getWholeToc(filepath);

  const wtoc = {
    level: 0,
    root: null,
    cur: null,
  };

  collectToc([["h", "", { level: 1, page: "/" }]].concat(wholeToc), wtoc);
  delete wtoc.cur;

  return {
    // ...yaml,
    content: paragraphs,
    isIndex: name === "index",
    wholeToc: wtoc.root ? simplifyParentKey([wtoc.root]) : [],
    toc: {
      ...toc.root,
      children: toc.root ? simplifyParentKey(toc.root.children) : [],
    },
  };
}
