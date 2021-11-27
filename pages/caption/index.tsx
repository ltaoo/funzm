/**
 * @file 字幕展示
 */

import React, { useCallback, useState } from "react";
import { Button, Upload } from "antd";

import {
  parseCaptionContent,
  parseCaptionFile,
  readTextFromFile,
} from "../../domains/caption";

const CaptionPreviewPage = () => {
  const [caption, setCaption] = useState(null);
  const preventUpload = useCallback(() => {
    return false;
  }, []);
  const handleUploadFile = useCallback(async (event) => {
    const { file } = event;
    const result = await parseCaptionFile(file);
    console.log(result);
    setCaption(result);
  }, []);

  if (caption) {
    return (
      <div>
        <div className="mx-auto w-180 space-y-2">
          <h2 className="text-2xl mt-10">{caption.name}</h2>
          <div className="mt-10 ">
            {caption.paragraphs.map((caption) => {
              const { text1, text2 } = caption;
              return (
                <div>
                  <p className="text-xs m-0">{text1}</p>
                  <p className="text-lg font-serif">{text2}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <h2 className="text-lg">Caption</h2>
      <Upload.Dragger
        beforeUpload={preventUpload}
        showUploadList={false}
        onChange={handleUploadFile}
      >
        <p>Drop File To Here</p>
        <Button>Upload File</Button>
      </Upload.Dragger>
    </div>
  );
};

export default CaptionPreviewPage;
