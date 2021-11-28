/**
 * @file 字幕文件上传
 */
import { useCallback, useEffect, useRef } from "react";
import { Button, Upload } from "antd";

import { getExt, readTextFromFile } from "@/domains/caption";

const CaptionUpload = (props) => {
  const { onChange } = props;

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
    const content = await readTextFromFile(file);
    if (onChangeRef.current) {
      onChangeRef.current({
        name: file.namek,
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
      <p>拖动字幕文件到这里</p>
      <Button type="primary" className="mt-10">
        点击选择字幕
      </Button>
    </Upload.Dragger>
  );
};

export default CaptionUpload;
