/**
 * @file 字幕文件上传
 */
import { useCallback, useEffect, useRef } from "react";
import Upload from "rc-upload";

import { getExt, readTextFromFile } from "@/domains/caption";
import { Caption } from "@/domains/caption/types";

interface IProps {
  /**
   * 是否解析上传的字幕文件
   */
  // parse?: boolean;
  /**
   * 子元素
   */
  children?: React.ReactNode;
  /**
   * 文件上传成功/字幕解析成功后的回调
   */
  onChange?: (content: {
    title: string;
    type: CaptionFileType;
    content: string;
  }) => void;
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
        type: getExt(file.name),
        content,
      });
    }
  }, []);
  return <Upload customRequest={handleUploadFile}>{children}</Upload>;
};

export default CaptionUpload;
