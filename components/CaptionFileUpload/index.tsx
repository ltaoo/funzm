/**
 * @file 字幕文件上传
 */
import { useCallback } from "react";
import Upload from "rc-upload";

import { getExt } from "@/domains/caption";
import { readContentFromFile } from "@/utils/bom";

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

  const handleUploadFile = useCallback(
    async ({ file }) => {
      const content = await readContentFromFile(file);
      if (onChange) {
        const segments = file.name.split(".");
        onChange({
          title: segments.slice(0, -1).join("."),
          type: getExt(file.name),
          content,
        });
      }
    },
    [onChange]
  );
  return <Upload customRequest={handleUploadFile}>{children}</Upload>;
};

export default CaptionUpload;
