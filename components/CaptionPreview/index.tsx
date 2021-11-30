/**
 * @file 字幕预览
 */
import React from "react";

const CaptionPreview = (props) => {
  const { title, paragraphs = [] } = props;
  return (
    <div className="2xl:mx-auto sm:w-180 pb-20 space-y-2">
      <h2 className="mt-6 px-4 text-2xl break-all">{title}</h2>
      <div className="mt-10 px-4 space-y-6">
        {paragraphs.map((caption) => {
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
  );
};

export default React.memo(CaptionPreview);
