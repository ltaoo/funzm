/**
 * @file 字幕文件上传
 */
import { useCallback, useEffect, useRef } from "react";
import Upload from "rc-upload";

import { getExt, readTextFromFile } from "@/domains/caption";

interface IProps {
  onChange?: (caption) => void;
  children?: React.ReactNode;
}
const CaptionUpload: React.FC<IProps> = (props) => {
  const { children, onChange } = props;

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    if (onChange && onChangeRef.current !== onChange) {
      onChangeRef.current = onChange;
    }
  }, [onChange]);

  const handleUploadFile = useCallback(async ({ file }) => {
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
  return <Upload customRequest={handleUploadFile}>{children}</Upload>;
};

export default CaptionUpload;
