/**
 * @file 字幕编辑
 */
import React, { useCallback, useEffect, useState } from "react";
import cx from "classnames";
import { useRouter } from "next/router";
import { TrashIcon } from "@ltaoo/icons/outline";

import { addCaptionService } from "@/services/caption";
import tmpCaptionStorage from "@/domains/caption/storage";
import {
  optimizeParagraphs,
  splitMergedParagraphs,
} from "@/domains/caption/utils";
import { parseCaptionContent } from "@/domains/caption";
import FixedFooter from "@/components/FixedFooter";
import CaptionUpload from "@/components/CaptionFileUpload";

const TempCaptionPreviewPage = (props) => {
  const [caption, setCaption] = useState(null);
  const [error, setError] = useState<boolean>(false);
  const [invalidParagraphs, setInvalidParagraphs] = useState([]);

  const router = useRouter();

  const renderCaption = useCallback(
    async ({ title, paragraphs, content, ext }) => {
      if (paragraphs) {
        setCaption({ title, paragraphs });
        return;
      }
      const p = await parseCaptionContent(content, ext);
      const captionResult = {
        title,
        paragraphs: p,
      };
      tmpCaptionStorage.save(captionResult);
      setCaption(captionResult);
    },
    []
  );

  useEffect(() => {
    const tmpCaption = tmpCaptionStorage.read();
    if (tmpCaption) {
      renderCaption(tmpCaption);
      return;
    }
    setError(true);
  }, []);

  const autoOptimizeCaption = useCallback(() => {
    const { title, paragraphs } = caption;
    const nextParagraphs = optimizeParagraphs(paragraphs);
    setCaption({
      title,
      paragraphs: nextParagraphs,
    });
    tmpCaptionStorage.save({
      title,
      paragraphs: nextParagraphs,
    });
  }, [caption]);

  const findInvalidParagraphs = useCallback((paragraphs) => {
    const invalidParagraphs = paragraphs.filter((paragraph) => {
      const { text1, text2 } = paragraph;
      return !text1 || !text2;
    });
    setInvalidParagraphs(invalidParagraphs);
  }, []);

  const uploadCaption = useCallback(async ({ title, content, ext }) => {
    const paragraphs = await parseCaptionContent(content, ext);
    tmpCaptionStorage.save({ title, paragraphs });
    setCaption({
      title,
      paragraphs,
    });
    setError(null);
  }, []);

  const deleteParagraph = useCallback(
    (deletedLine) => {
      const { paragraphs } = caption || caption;
      const nextParagraphs = paragraphs.filter((paragraph) => {
        return paragraph.line !== deletedLine;
      });
      setCaption({
        ...caption,
        paragraphs: nextParagraphs,
      });
      tmpCaptionStorage.save({
        ...caption,
        paragraphs: nextParagraphs,
      });
    },
    [caption, caption]
  );

  const splitMergedLines = useCallback(
    (mergedLine) => {
      if (!caption) {
        return;
      }
      const nextOptimizedParagraphs = splitMergedParagraphs(
        caption.paragraphs,
        mergedLine
      );
      setCaption({
        ...caption,
        paragraphs: nextOptimizedParagraphs,
      });
    },
    [caption, caption]
  );
  const saveCaption = useCallback(async () => {
    const savedCaption = await addCaptionService({
      ...caption,
      paragraphs: caption.paragraphs.map((p) => {
        return {
          ...p,
          line: String(p.line),
        };
      }),
    });
    const { id } = savedCaption;
    router.replace({
      pathname: `/captions/${id}`,
    });
  }, [caption]);

  const resetCaption = useCallback(() => {
    // setCaption(null);
  }, []);

  const updateTitle = useCallback((event) => {
    setCaption((prev) => {
      return {
        ...prev,
        title: event.target.innerHTML,
      };
    });
  }, []);
  const updateText1 = useCallback((line) => {
    return (event) => {
      setCaption((prev) => {
        const { title, paragraphs } = prev;
        return {
          title,
          paragraphs: paragraphs.map((p) => {
            if (p.line === line) {
              return {
                ...p,
                text1: event.target.innerHTML,
              };
            }
            return p;
          }),
        };
      });
    };
  }, []);
  const updateText2 = useCallback((line) => {
    return (event) => {
      setCaption((prev) => {
        const { title, paragraphs } = prev;
        return {
          title,
          paragraphs: paragraphs.map((p) => {
            if (p.line === line) {
              return {
                ...p,
                text2: event.target.innerHTML,
              };
            }
            return p;
          }),
        };
      });
    };
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
      <div className="h-screen mx-auto w-180 text-center">
        <span className="mt-10">Loading</span>
      </div>
    );
  }

  const { title, paragraphs } = caption;

  return (
    <div className="relative">
      {/* {invalidParagraphs.length !== 0 && (
          <div className="z-10 fixed top-[40%] right-10 p-4 rounded-md shadow-md bg-white hidden sm:block">
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
        )} */}

      {/* title section */}
      <div className="py-10 px-4 bg-gray-100 border-b">
        <div className="mx-auto sm:w-180">
          <h2
            className="text-2xl break-all"
            contentEditable
            suppressContentEditableWarning
            onBlur={updateTitle}
          >
            {title}
          </h2>
        </div>
      </div>

      {/* paragraphs section */}
      <div className="mx-auto mt-20 px-4 space-y-6 pb-20 sm:w-180">
        {paragraphs.map((caption) => {
          const { line, text1, text2 } = caption;
          return (
            <div
              key={line}
              className={cx(
                "relative group",
                String(line).includes("+")
                  ? "border-1 border-dashed border-gray-500"
                  : "",
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
              <div>
                <p
                  className="p-2 text-xs m-0"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={updateText1(line)}
                >
                  {text1}
                </p>
                <p
                  className="p-2 break-all text-lg font-serif"
                  suppressContentEditableWarning
                  contentEditable
                  onBlur={updateText2(line)}
                >
                  {text2}
                </p>
              </div>
            </div>
          );
        })}
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
