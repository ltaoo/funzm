/**
 * @file 简单测验展示、输入组件
 */
import cx from "classnames";

import Exam from "@/domains/exam";

interface IProps extends Omit<Exam, "onNext"> {
  className?: string;
  onClick?: (word: { uid: number; word: string }) => void;
}
const SimpleExamInput: React.FC<IProps> = (props) => {
  const {
    className,
    curParagraph,
    inputtingWords,
    curWords,
    displayedWords,
    onClick,
  } = props;

  return (
    <div className={cx("text-left", className)}>
      <div className="py-8 px-4 text-xl text-gray-800">
        <div className="">{curParagraph.text1}</div>
      </div>
      <div className="py-6 px-4">
        <div className="text-3xl font-serif text-black min-h-36">
          {(() => {
            const result = [];
            const elms = [...inputtingWords];
            for (let i = 0; i < curWords.length; i += 1) {
              const [prefix, word, suffix] = curWords[i];
              let w = word;
              if (word) {
                w = elms.shift()?.word;
              }
              result.push(
                <span key={i}>
                  {w ? prefix : ""}
                  {w}
                  {w ? suffix : ""}{" "}
                </span>
              );
            }
            return result;
          })()}
        </div>
      </div>
      <div className="min-h-48 px-4">
        <div className="flex flex-wrap h-full overflow-auto">
          {displayedWords.map((segment) => {
            const { uid, word } = segment;
            const existing = inputtingWords.map((t) => t.uid).includes(uid);
            return (
              <div
                key={uid}
                className={cx(
                  "inline mr-2 mb-2 px-4 py-1 text-white rounded-md bg-green-500 cursor-pointer hover:shadow",
                  existing
                    ? "!bg-green-100 !hover:shadow-none dark:!bg-gray-800"
                    : ""
                )}
                onClick={() => {
                  if (existing) {
                    return;
                  }
                  if (onClick) {
                    onClick(segment);
                  }
                }}
              >
                {word}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SimpleExamInput;
