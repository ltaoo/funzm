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

  return (
    <div className="container">
      <div className="flex justify-end sticky top-0 py-2 px-4 shadow-md bg-white">
        <p className="text-base text-sm" onClick={saveCaption}>
          保存
        </p>
      </div>
      <CaptionPreview {...caption} />
    </div>
  );
};

export default TempCaptionPreviewPage;
