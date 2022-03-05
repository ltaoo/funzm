import cx from "classnames";

import { LinkIcon } from "@ltaoo/icons/outline";

import { splitTextHasNotes } from "@/domains/caption/utils";
import GraphCanvas from "../GraphCanvas";

const table = {
  单字: "单词",
  文法: "语法",
  代名词: "代词",
  对等连接词: "并列连词",
  连接词: "连词",
  所有格代名词: "物主代词",
  介系词: "介词",
  片语: "短语",
  // 名词片语: "名词短语",
  // 动词片语: "动词短语",
  // 介系词片语: "介词短语",
  主词: "主语",
  受词: "宾语",
  子句: "从句",
  受格: "宾格",
  // 主词子句: '主语从句',
  // 受词子句: '宾语从句',
  形容词子句: "表语从句",
  副词子句: "状语从句",
  连缀动词: "系动词",
  行动动词: "行为动词",
  个别动词: "单个动词",
  简单式: "一般时",
  进行式: "进行时",
  完成式: "完成时",
  简单现在式: "一般现在时",
  简单未来式: "一般将来时",
  过去未来式: "过去将来时",
  现在进行式: "现在进行时",
  过去进行式: "过去进行时",
  现在完成式: "现在完成时",
  过去完成式: "过去完成时",
  是否疑问句: "一般疑问句",
  讯息疑问句: "特殊疑问句",
  不定词: "不定式",
  母音: "元音",
  子音: "辅音",
  无声子音: "清辅音",
  有声子音: "浊辅音",
};
const words = Object.keys(table);
function convert(content) {
  let res = content;
  words.forEach((word) => {
    if (res.includes(word)) {
      res = res.replace(word, table[word]);
    }
  });
  return res;
}

const renderText2HasNotes = (text2, nts) => {
  const nodes = splitTextHasNotes(text2, nts);

  return nodes.map((node, i) => {
    const { type, text } = node;
    if (type === "text") {
      return text;
    }
    return (
      <span key={i} className="underline underline-1 underline-offset-5">
        {text}
      </span>
    );
  });
};

export function renderer(node, i) {
  const [type, children = [], options = {}] = node;
  if (type === "h") {
    const { uid, level } = options;
    if (level === 1) {
      return (
        <h1 key={i} id={children}>
          {children}
        </h1>
      );
    }
    if (level === 2) {
      return (
        <h2 key={i} id={uid} className="py-4 text-3xl text-center">
          <a href={`#${uid}`} className="hover:no-underline">
            {children}
          </a>
        </h2>
      );
    }
    if (level === 3) {
      return (
        <h3 key={i} id={uid} className="py-4 mt-8 text-2xl">
          <a href={`#${uid}`} className="float ml-[-20px] pr-2">
            <LinkIcon className="inline-block w-5 h-5 text-gray-300" />
          </a>
          {children}
        </h3>
      );
    }
    if (level === 4) {
      return (
        <h4
          key={i}
          id={uid}
          className="py-4 mt-8 text-xl"
          onClick={() => {
            console.log(node);
          }}
        >
          <a href={`#${uid}`} className="float ml-[-20px] pr-2">
            <LinkIcon className="inline-block w-4 h-4 text-gray-300" />
          </a>
          {children}
        </h4>
      );
    }
  }
  if (type === "p") {
    return (
      <p key={i} className={cx("text-gray-500 my-4")}>
        {children.map(renderer)}
      </p>
    );
  }
  if (type === "b") {
    return (
      <span key={i} className={"font-bold text-gray-600"}>
        {(() => {
          if (Array.isArray(children)) {
            return children.map(renderer);
          }
          return children;
        })()}
      </span>
    );
  }
  if (type === "blockquote") {
    return (
      <div key={i} className="flex items-center ml-4 mt-4 bg-gray-50">
        <div className="w-4 h-8 mr-4 bg-gray-200"></div>
        {children.map(renderer)}
      </div>
    );
  }
  if (type === "ol") {
    return (
      <ol key={i} className="mt-4 ml-4">
        {children.map(renderer)}
      </ol>
    );
  }
  if (type === "ul") {
    return (
      <ul key={i} className="mt-4 ml-4">
        {children.map(renderer)}
      </ul>
    );
  }
  if (type === "li") {
    return (
      <li key={i} className="my-2">
        {children.map(renderer)}
      </li>
    );
  }
  if (type === "table") {
    return (
      <table key={i} className="my-4">
        <tbody>{children.map(renderer)}</tbody>
      </table>
    );
  }
  if (type === "row") {
    // if (options.head) {
    //   return <th key={i}>{children.map(renderer)}</th>;
    // }
    return (
      <tr key={i} className="border-b-1">
        {children.map(renderer)}
      </tr>
    );
  }
  if (type === "col") {
    return (
      <td key={i} className="py-2 px-4 text-gray-500">
        {children.map(renderer)}
      </td>
    );
  }
  if (type === "example") {
    const { flag, translate, analysis } = options;
    return (
      <p
        key={i}
        className={cx(
          "p-4 my-4 text-gray-500 text-xl font-serif rounded",
          flag === 1 ? "bg-red-50" : "",
          flag === 2 ? "bg-orange-50" : "",
          flag === 3 ? "bg-gray-50" : ""
        )}
      >
        {renderText2HasNotes(children, options.underlines)}
        {translate && (
          <span className="ml-4 text-gray-400 text-sm">({translate})</span>
        )}
        {analysis && (
          <span className="ml-4 text-gray-400 text-sm">{analysis}</span>
        )}
      </p>
    );
  }
  if (type === "graph") {
    return <GraphCanvas key={i} times={options.chars} />;
  }
  return (() => {
    if (typeof children === "string") {
      return convert(children);
    }
    return children;
  })();
}

export const renderToc = (headings) => {
  return (
    <div className="">
      {headings.map((heading, i) => {
        const { uid, level, page, text, children } = heading;
        return (
          <div
            key={i}
            className={cx(
              "text-gray-500",
              level === 2 ? "text-sm" : "text-xs",
              level === 2 ? "mb-4" : ""
            )}
            style={{
              marginLeft: (level - 2) * 10,
            }}
          >
            <a
              href={(() => {
                if (level === 2) {
                  if (page) {
                    return `/resources/english/${page}`;
                  }
                  return "";
                }
                if (page) {
                  return `/resources/english/${page}#${uid}`;
                }
                return `#${uid}`;
              })()}
              className=""
            >
              {text}
            </a>
            {renderToc(children)}
          </div>
        );
      })}
    </div>
  );
};
