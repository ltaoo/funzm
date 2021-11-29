/**
 * @file 临时字幕预览
 */

import React, { useCallback, useEffect, useState } from "react";

import { parseCaptionContent } from "@/domains/caption";
import CaptionUpload from "@/components/CaptionFileUpload";
import CaptionPreview from "@/components/CaptionPreview";

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
    const paragraphs = await parseCaptionContent(content, ext);
    setCaption({
      title,
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
      <CaptionPreview {...caption} />
    </div>
  );
};

export default TempCaptionPreviewPage;
