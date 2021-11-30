/**
 * @file 字幕预览
 */
import React, { useCallback, useMemo } from "react";

import Popover from "antd/lib/popover";
import "antd/lib/popover/style/index.css";

/**
 * 清洗单词，移除两边符号等无用字符
 */
function cleanWord(word) {
  return word;
}
/**
 * 将一段英文分割成单词
 * @param text2
 */
function splitParagraph(text2: string): string[][] {
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

const CaptionPreview = (props) => {
  const { title, paragraphs = [] } = props;

  const viewWord = useCallback((word) => {
    console.log(word);
  }, []);

  return (
    <div className="2xl:mx-auto sm:w-180 pb-20 space-y-2">
      <h2 className="mt-6 px-4 text-2xl break-all">{title}</h2>
      <div className="mt-10 px-4 space-y-6">
        {paragraphs.map((caption) => {
          const { line, text1, text2 } = caption;
          return (
            <div key={line}>
              <p className="text-xs m-0">{text1}</p>
              <p className="break-all">
                {(() => {
                  const words = splitParagraph(text2);
                  return words.map((word, i) => {
                    return (
                      <span className="text-lg font-serif" key={i}>
                        {word[0]}
                        <span
                          className="cursor-pointer"
                          onClick={(event) => {
                            event.preventDefault();
                            viewWord(word[1]);
                          }}
                        >
                          {word[1]}
                        </span>
                        {word[2]}
                        {i === words.length - 1 ? "" : " "}
                      </span>
                    );
                  });
                })()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(CaptionPreview);
