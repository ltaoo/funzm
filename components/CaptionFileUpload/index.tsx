/**
 * @file 字幕文件上传
 */
import { useCallback, useEffect, useRef } from "react";

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
    const { files } = event.target;
    // console.log('handle upload file', files)
    const file = files[0];
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
    <div className=""><input className="w-12" type="file" onChange={handleUploadFile} /></div>
  );
};

export default CaptionUpload;
