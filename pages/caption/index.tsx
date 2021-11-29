/**
 * @file 字幕展示
 */

import React, { useCallback, useState } from "react";
import { Button, Upload } from "antd";

import { parseCaptionFile, stringifyCaption } from "@/domains/caption";
import { fetchCaptionsService } from "@/lib/caption";

import { addCaption } from "@/services/caption";

const CaptionPreviewPage = (props) => {
  const [caption, setCaption] = useState(null);

  // console.log("[PAGE]CaptionManagePage - render", props.data);

  const saveCaption = useCallback(() => {
    addCaption(stringifyCaption(caption));
  }, [caption]);

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
        <div className="mx-auto w-180 pb-20 space-y-2">
          <h2 className="text-2xl mt-10">{caption.name}</h2>
          <div className="mt-10 ">
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
        <button className="btn" onClick={saveCaption}>
          保存
        </button>
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

export async function getStaticProps({ preview = null }) {
  const data = await fetchCaptionsService();
  return {
    props: { data },
  };
}
