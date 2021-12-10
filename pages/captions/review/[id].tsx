/**
 * @file 字幕展示
 */
import { useRef, useCallback, useEffect, useState } from "react";
import cx from "classnames";
import Head from "next/head";
// import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";

import Modal from "@/components/Modal";
import { fetchCaptionService } from "@/services/caption";
import { compareLine, compareInputting } from "@/domains/caption/utils";

const CaptionExamPage = () => {
  const router = useRouter();

  const [visible, setVisible] = useState(false);
  const [caption, setCaption] = useState(null);
  const [inputting, setInputting] = useState({});
  const [errors, setErrors] = useState({});
  const [curErrorLine, setCurErrorLine] = useState(null);
  const [validatedLines, setValidatedLines] = useState({});
  const curInputRef = useRef<HTMLDivElement>(null);

  const fetchCaptionAndSave = useCallback(async (id) => {
    const response = await fetchCaptionService({ id });
    setCaption(response);
  }, []);

  useEffect(() => {
    fetchCaptionAndSave(router.query.id);
  }, []);

  const compareOneLine = useCallback(
    (clickedLine) => {
      if (!inputting[clickedLine]) {
        return;
      }
      setValidatedLines((prev) => {
        prev[clickedLine] = null;
        return prev;
      });
      const { paragraphs } = caption;
      const originalContent = paragraphs
        .filter((paragraph) => {
          return !!paragraph.text2;
        })
        .reduce((total, cur) => {
          const { line } = cur;
          return {
            ...total,
            [line]: cur.text2,
          };
        });
      const diffNodes = compareLine(
        originalContent[clickedLine],
        inputting[clickedLine]
      );
      if (diffNodes) {
        errors[clickedLine] = errors[clickedLine] || [];
        setVisible(true);
        setCurErrorLine(clickedLine);
      }
      if (diffNodes === null) {
        // 表示成功吗？
        setValidatedLines((prevLines) => ({
          ...prevLines,
          [clickedLine]: true,
        }));
      }
      errors[clickedLine] = diffNodes;
      setErrors({ ...errors });
    },
    [inputting, caption]
  );

  const compare = useCallback(() => {
    const { paragraphs } = caption;
    const originalContent = paragraphs
      .filter((paragraph) => {
        return !!paragraph.text2;
      })
      .reduce((total, cur) => {
        const { line } = cur;
        return {
          ...total,
          [line]: cur.text2,
        };
      });
    const errors = compareInputting(inputting, originalContent);
    setErrors(errors);
  }, [inputting, caption]);

  const saveParagraph = useCallback(() => {
    // save to database.
  }, []);

  // console.log(errors);

  if (!caption) {
    return null;
  }
  const { title, paragraphs } = caption;
  return (
    <div className="bg-cool-gray-50 dark:bg-gray-800">
      <Head>
        <title>{caption.title}</title>
      </Head>
      <div className="overflow-hidden pb-20 space-y-2 xl:mx-auto xl:w-180 ">
        <h2 className="mt-6 px-4 text-2xl break-all text-black dark:text-white break-all">
          {title}
        </h2>
        <div className="mt-10 px-4 space-y-6">
          {paragraphs.map((caption) => {
            const { line, text1, text2 } = caption;
            return (
              <div key={line}>
                <p className="text-xs text-black dark:text-white">{text1}</p>
                <div className="relative mt-2 break-all text-lg font-serif text-black dark:text-white">
                  <div
                    className={cx(
                      "w-full border-b-1 outline-none bg-transparent",
                      errors[line] ? "!border-red-500" : "",
                      validatedLines[line] ? "!border-green-500" : ""
                    )}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(event) => {
                      // @ts-ignore
                      const { innerText } = event.target;
                      setInputting((prev) => {
                        return {
                          ...prev,
                          [line]: innerText,
                        };
                      });
                    }}
                    onKeyPress={(event) => {
                      const { code } = event;
                      if (code === "Enter") {
                        curInputRef.current = event.target as HTMLDivElement;
                        event.preventDefault();
                        compareOneLine(line);
                      }
                    }}
                  />
                  <span className={cx("flex absolute top-0 right-0 space-x-2")}>
                    {validatedLines[line] ? (
                      <span className={cx("text-green-500 cursor-pointer")}>
                        yes
                      </span>
                    ) : (
                      <span
                        className={cx("text-gray-400 cursor-pointer")}
                        onClick={() => {
                          compareOneLine(line);
                        }}
                      >
                        check
                      </span>
                    )}
                    <span
                      className={cx(
                        "text-red-500 cursor-pointer",
                        errors[line] ? "block" : "hidden"
                      )}
                      onClick={() => {
                        setCurErrorLine(line);
                        setVisible(true);
                      }}
                    >
                      error
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-end sticky bottom-0 py-4 px-4 bg-white dark:bg-black space-x-2 border-t-1 dark:border-gray-800">
        <p className="text-base text-sm cursor-pointer text-black dark:text-white">
          {Object.keys(inputting).pop() ?? 0}/{paragraphs.length}
        </p>
        <p
          className="text-base text-sm cursor-pointer text-black dark:text-white"
          onClick={compare}
        >
          Check
        </p>
      </div>
      <Modal
        visible={visible}
        onCancel={() => {
          if (curInputRef.current) {
            const obj = curInputRef.current!;
            if (window.getSelection) {
              obj.focus();
              const range = window.getSelection();
              range.selectAllChildren(obj);
              range.collapseToEnd();
            }
          }
          setVisible(false);
        }}
      >
        <div className="p-4">
          {(() => {
            if (curErrorLine === null) {
              return null;
            }
            if (errors[curErrorLine] === null) {
              return null;
            }
            const errNodes = errors[curErrorLine];
            const elms = [];
            for (let i = 0; i < errNodes.length; i += 1) {
              const { added, updated, removed, value } = errNodes[i];
              elms.push(
                <span
                  className={cx(
                    "text-base text-xl",
                    added
                      ? "!text-green-500 bg-green-100"
                      : removed
                      ? "!text-red-500 bg-red-100"
                      : "!text-gray-500"
                  )}
                >
                  {value}
                </span>
              );
            }
            return (
              <p className="">
                {elms}
                <div onClick={saveParagraph}>
                  <p>保存该句</p>
                </div>
                <div onClick={saveParagraph}>
                  <p>修改原句</p>
                </div>
              </p>
            );
          })()}
        </div>
      </Modal>
    </div>
  );
};

// export const getStaticPaths: GetStaticPaths = async () => {
//   const paths = getAllPostIds();
//   return {
//     paths,
//     fallback: false,
//   };
// };

// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   console.log('getStaticProps', params);
//   const caption = await fetchCaptionById({ id: params.id as string });
//   return {
//     props: {
//       data: caption,
//     },
//   };
// };

export default CaptionExamPage;
