/**
 * @file 临时字幕预览
 */

import React, { useCallback, useEffect, useState } from "react";

import { parseCaptionContent } from "@/domains/caption";
import CaptionUpload from "@/components/CaptionFileUpload";
import CaptionPreview from "@/components/CaptionPreview";

import tmpCaptionStorage from "@/domains/caption/utils";
import { addCaption } from "@/services/caption";
import router from "next/router";

const TempCaptionPreviewPage = (props) => {
  const [caption, setCaption] = useState(null);
  const [error, setError] = useState<boolean>(false);

  const renderCaption = useCallback(async ({ title, content, ext }) => {
    const result = await parseCaptionContent(content, ext);
    setCaption({
      title,
      paragraphs: result,
    });
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

  const saveCaption = useCallback(async () => {
    const savedCaption = await addCaption(caption);
    const { id } = savedCaption;
    router.replace({
      pathname: `/captions/${id}`,
    });
  }, [caption]);

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

  const { title, paragraphs } = caption;

  return (
    <div className="">
      <div className="flex justify-end sticky top-0 py-2 px-4 shadow-md bg-white">
        <p className="text-base text-sm" onClick={saveCaption}>
          保存
        </p>
      </div>
      <div className="mx-auto sm:w-180 pb-20 space-y-2">
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
              <div key={line}>
                <p
                  className="text-xs m-0 hover:shadow-lg"
                  contentEditable
                  suppressContentEditableWarning
                >
                  {text1}
                </p>
                <p
                  className="break-all text-lg font-serif hover:shadow-lg"
                  suppressContentEditableWarning
                  contentEditable
                >
                  {text2}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TempCaptionPreviewPage;
