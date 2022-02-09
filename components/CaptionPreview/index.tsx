/**
 * @file 字幕查看
 */
import React, { useRef, useState } from "react";
import { CalendarIcon, UserIcon } from "@ltaoo/icons/outline";

import { ICaptionValues } from "@/domains/caption/types";
import HighlightContent from "@/components/HighlightContent";

interface IProps extends ICaptionValues {
  onUpdateNote?: (note, paragraph) => void;
}
const CaptionPreview: React.FC<IProps> = (props) => {
  const {
    id,
    title,
    paragraphs = [],
    author = "unknown",
    createdAt,
    onUpdateNote,
  } = props;

  const contentRef = useRef<HTMLDivElement>(null);
  const curParagraphRef = useRef(null);

  console.log("[COMPONENT]CaptionPreview - render");

  return (
    <div>
      <div ref={contentRef}>
        <div className="#title pb-10 border-b">
          <h2 className="text-5xl bold break-all">{title}</h2>
          <div className="flex items-center mt-4 space-x-8">
            <div className="flex items-center">
              <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-gray-400">{author}</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-gray-400">{createdAt}</span>
            </div>
          </div>
        </div>
        <div className="#paragraphs mt-10 pb-20 space-y-6">
          {paragraphs.map((paragraph) => {
            const { line, text1, text2, notes = [] } = paragraph;
            return (
              <div
                className="paragraph"
                key={line}
                onClick={() => {
                  curParagraphRef.current = paragraph;
                }}
              >
                <p className="text1">{text1}</p>
                <div className="text2">
                  <HighlightContent
                    highlights={notes}
                    onSubmit={(note) => {
                      if (onUpdateNote) {
                        onUpdateNote(note, paragraph);
                      }
                    }}
                  >
                    {text2}
                  </HighlightContent>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CaptionPreview;
