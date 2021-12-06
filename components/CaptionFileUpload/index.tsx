/**
 * @file 字幕文件上传
 */
import { useCallback, useEffect, useRef } from "react";
import Button from "antd/lib/button";
import "antd/lib/button/style/index.css";
import Upload from "antd/lib/upload";
import "antd/lib/upload/style/index.css";

import { getExt, readTextFromFile } from "@/domains/caption";

const CaptionUpload = (props) => {
  const { children, onChange } = props;

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    if (onChange && onChangeRef.current !== onChange) {
      onChangeRef.current = onChange;
    }
  }, [onChange]);

  const preventUpload = useCallback(() => {
    return false;
  }, []);
  const handleUploadFile = useCallback(async (event) => {
    const { file } = event;
    // console.log('handle upload file', file.name)
    const content = await readTextFromFile(file);
    if (onChangeRef.current) {
      const segments = file.name.split(".");
      onChangeRef.current({
        title: segments.slice(0, -1).join("."),
        ext: getExt(file.name),
        content,
      });
    }
  }, []);
  return (
    <Upload.Dragger
      className="h-60"
      beforeUpload={preventUpload}
      showUploadList={false}
      onChange={handleUploadFile}
    >
      {children || (
        <>
          <p>拖动字幕文件到这里</p>
          <Button type="primary" className="mt-10">
            点击选择字幕
          </Button>
        </>
      )}
    </Upload.Dragger>
  );
};

export default CaptionUpload;
