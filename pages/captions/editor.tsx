/**
 * @file 临时字幕预览
 */

import React, { useCallback, useEffect, useState } from "react";
import cx from "classnames";
import { TrashIcon } from "@heroicons/react/outline";
import router, { useRouter } from "next/router";

import { parseCaptionContent } from "@/domains/caption";
import CaptionUpload from "@/components/CaptionFileUpload";
import CaptionPreview from "@/components/CaptionPreview";

import tmpCaptionStorage from "@/domains/caption/utils";
import { addCaption } from "@/services/caption";
import FixedFooter from "@/components/FixedFooter";

const TempCaptionPreviewPage = (props) => {
  const [caption, setCaption] = useState(null);
  const [optimizedCaption, setOptimizedCaption] = useState(null);
  const [error, setError] = useState<boolean>(false);
  const [invalidParagraphs, setInvalidParagraphs] = useState([]);

  const router = useRouter();

  const renderCaption = useCallback(async ({ title, content, ext }) => {
    const result = await parseCaptionContent(content, ext);
    setCaption({
      title,
      paragraphs: result,
    });
    const invalidParagraphs = result.filter((paragraph) => {
      const { text1, text2 } = paragraph;
      return !text1 || !text2;
    });
    setInvalidParagraphs(invalidParagraphs);
  }, []);

  const uploadCaption = useCallback(async ({ title, content, ext }) => {
    tmpCaptionStorage.save({ title, content, ext });
    const paragraphs = await parseCaptionContent(content, ext);
    setCaption({
      title,
      paragraphs,
    });
    setError(null);
  }, []);

  const deleteParagraph = useCallback(
    (deletedLine) => {
      const { paragraphs } = optimizedCaption || caption;
      const nextParagraphs = paragraphs.filter((paragraph) => {
        return paragraph.line !== deletedLine;
      });
      if (optimizedCaption) {
        setOptimizedCaption({
          ...caption,
          paragraphs: nextParagraphs,
        });
      }
      setOptimizedCaption({
        ...caption,
        paragraphs: nextParagraphs,
      });
    },
    [optimizedCaption, caption]
  );

  const splitMergedLines = useCallback(
    (mergedLine) => {
      if (!optimizedCaption) {
        return;
      }
      const matchedLineIndex = optimizedCaption.paragraphs.findIndex(
        (paragraph) => {
          return paragraph.line === mergedLine;
        }
      );
      if (matchedLineIndex !== -1) {
        const originalLines = mergedLine.split("+").map(Number);
        const originalParagraphs = caption.paragraphs.filter((paragraph) => {
          return originalLines.includes(paragraph.line);
        });
        const nextOptimizedParagraphs = [...optimizedCaption.paragraphs];
        nextOptimizedParagraphs.splice(
          matchedLineIndex,
          1,
          ...originalParagraphs
        );
        setOptimizedCaption({
          ...optimizedCaption,
          paragraphs: nextOptimizedParagraphs,
        });
      }
    },
    [optimizedCaption, caption]
  );

  const autoOptimizeCaption = useCallback(() => {
    console.log(caption);
    const { title, paragraphs } = caption;
    const nextParagraphs = paragraphs.reduce((result, cur) => {
      const prevParagraph = result[result.length - 1];
      if (prevParagraph) {
        const {
          line: prevLine,
          // start: prevStart,
          // end: prevEnd,
          text1: prevText1,
          text2: prevText2,
        } = prevParagraph;
        const { line, start, end, text1, text2 } = cur;
        const lastChar = prevText2.charAt(prevText2.length - 1);
        if ([","].includes(lastChar) || /[a-z]/.test(lastChar)) {
          const copy = { ...prevParagraph };
          copy.line = `${prevLine}+${line}`;
          copy.end = end;
          copy.text1 = prevText1 + ` ${text1}`;
          copy.text2 = prevText2 + ` ${text2}`;
          result[result.length - 1] = copy;
          return result;
        }
      }
      return result.concat(cur);
    }, []);
    setOptimizedCaption({
      title,
      paragraphs: nextParagraphs,
    });
  }, [caption]);

  const saveCaption = useCallback(async () => {
    const savedCaption = await addCaption(caption);
    const { id } = savedCaption;
    router.replace({
      pathname: `/captions/${id}`,
    });
  }, [caption]);

  const resetCaption = useCallback(() => {
    setOptimizedCaption(null);
  }, []);

  useEffect(() => {
    const tmpCaption = tmpCaptionStorage.read();
    if (tmpCaption) {
      renderCaption(tmpCaption);
      return;
    }
    setError(true);
  }, []);

  const updateTitle = useCallback((event) => {
    setCaption((prev) => {
      return {
        ...prev,
        title: event.target.innerHTML,
      };
    });
  }, []);

  if (error) {
    return (
      <div>
        <div className="mx-auto w-160 pt-4">
          <div className="">
            <CaptionUpload onChange={uploadCaption} />
          </div>
        </div>
      </div>
    );
  }

  if (caption === null) {
    return (
      <div className="mx-auto w-180">
        <span>Loading</span>
      </div>
    );
  }

  const { title, paragraphs } = optimizedCaption || caption;

  return (
    <div className="">
      <div className="relative mx-auto sm:w-180 pb-20 space-y-2">
        {invalidParagraphs.length !== 0 && (
          <div className="fixed top-4 right-10 p-4 rounded-md shadow-md bg-white">
            <div className="text-sm">共计 {paragraphs.length} 句</div>
            <div className="mt-4 space-y-2">
              {invalidParagraphs.map((invalidParagraph) => {
                return (
                  <div
                    className="text-sm cursor-pointer"
                    key={invalidParagraph.line}
                  >
                    <a
                      href={`${router.pathname}/#${invalidParagraph.line}`}
                      className="text-red-500 "
                    >
                      {invalidParagraph.line}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <h2
          className="mt-6 ml-4 text-2xl break-all"
          contentEditable
          suppressContentEditableWarning
          onBlur={updateTitle}
        >
          {title}
        </h2>
        <div className="mt-10 ml-4 space-y-6">
          {paragraphs.map((caption) => {
            const { line, text1, text2 } = caption;
            return (
              <div
                key={line}
                className={cx(
                  "relative group",
                  String(line).includes("+") ? "border-1 border-dashed" : "",
                  !text2 ? "border-1 border-dashed border-red-500" : "",
                  "rounded-md"
                )}
              >
                <div className="absolute top-2 left-[-36px] hidden space-y-2 group-hover:block">
                  <p
                    className="text-sm px-2"
                    onClick={() => {
                      deleteParagraph(line);
                    }}
                  >
                    <TrashIcon className="w-4 h-4 text-gray-500 cursor-pointer" />
                  </p>
                  <p
                    className={cx(
                      "text-sm px-2",
                      String(line).includes("+") ? "block" : "hidden"
                    )}
                    onClick={() => {
                      splitMergedLines(line);
                    }}
                  >
                    <TrashIcon className="w-4 h-4 text-gray-500 cursor-pointer" />
                  </p>
                </div>
                <div id={`/#${line}`}>
                  <p
                    className="p-2 text-xs m-0 hover:shadow-lg"
                    contentEditable
                    suppressContentEditableWarning
                  >
                    {text1}
                  </p>
                  <p
                    className="p-2 break-all text-lg font-serif hover:shadow-lg"
                    suppressContentEditableWarning
                    contentEditable
                  >
                    {text2}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <FixedFooter
        dataSource={[
          {
            id: 3,
            text: "Cancel Optimize",
            onClick: resetCaption,
          },
          {
            id: 2,
            text: "Auto Optimize",
            onClick: autoOptimizeCaption,
          },
          {
            id: 1,
            text: "Save",
            onClick: saveCaption,
          },
        ]}
      />
    </div>
  );
};

export default TempCaptionPreviewPage;
