/**
 * @file 临时字幕预览
 */

import React, { useCallback, useEffect, useState } from "react";

import { parseCaptionContent } from "@/domains/caption";
import CaptionUpload from "@/components/CaptionFileUpload";

const TempCaptionPreviewPage = (props) => {
  const [caption, setCaption] = useState(null);
  const [error, setError] = useState<boolean>(false);

  const renderCaption = useCallback(async ({ name, content, ext }) => {
    const result = await parseCaptionContent(content, ext);
    setCaption({
      name,
      paragraphs: result,
    });
  }, []);

  const uploadCaption = useCallback(async ({ name, content, ext }) => {
    const paragraphs = await parseCaptionContent(content, ext);
    setCaption({
      name,
      paragraphs,
    });
    setError(null);
  }, []);

  useEffect(() => {
    const captionFile = JSON.parse(
      localStorage.getItem("tmp-caption") || "null"
    );
    if (captionFile) {
      renderCaption(captionFile);
      return;
    }
    setError(true);
  }, []);

  if (error) {
    return (
      <div>
        <div className="mx-auto w-160">
          <div className="mt-10">
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

  return (
    <div className="">
      <div className="2xl:mx-auto sm:w-180 pb-20 space-y-2">
        <h2 className="text-2xl mt-10">{caption.name}</h2>
        <div className="mt-10 px-4 space-y-6">
          {caption.paragraphs.map((caption) => {
            const { line, text1, text2 } = caption;
            return (
              <div key={line}>
                <p className="text-xs m-0">{text1}</p>
                <p className="text-lg font-serif">{text2}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TempCaptionPreviewPage;
