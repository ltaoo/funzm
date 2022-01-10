/**
 * @file 字幕查看
 */
import React, { useEffect, useRef, useState } from "react";
import {
  CalendarIcon,
  MusicNoteIcon,
  PencilIcon,
  UserIcon,
} from "@ltaoo/icons/outline";

import { ICaptionValues } from "@/domains/caption/types";

interface IProps extends ICaptionValues {}
const CaptionPreview: React.FC<IProps> = (props) => {
  const { title, paragraphs = [], author = "unknown", createdAt } = props;

  const [count, setCount] = useState(0);
  const downPosRef = useRef<null | { x: number; y: number }>(null);
  const upPosRef = useRef<null | { x: number; y: number }>(null);
  const isMouseDownRef = useRef(false);
  const isMouseMoveRef = useRef(false);
  const highlightedNodeRef = useRef(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current === null) {
      return;
    }
    const mouseDownHandler = (event) => {
      const curTarget = event.target as HTMLElement;
      upPosRef.current = null;
      setCount((prev) => (prev += 1));
      // console.log(curTarget);
      if (curTarget.className?.indexOf("text2") === -1) {
        return;
      }
      // console.log(event);
      const { x, y } = event;
      downPosRef.current = {
        x,
        y,
      };
      isMouseDownRef.current = true;
      highlightedNodeRef.current = curTarget;
    };
    contentRef.current.addEventListener("mousedown", mouseDownHandler);

    const mouseMoveHandler = (event) => {
      if (isMouseDownRef.current) {
        console.log("[LOG]is select words", isMouseDownRef.current);
        isMouseMoveRef.current = true;
      }
    };
    contentRef.current.addEventListener("mousemove", mouseMoveHandler);

    const mouseUpHandler = (event) => {
      console.log("[]mouseUpHandler - start", isMouseMoveRef.current, event);
      if (!isMouseMoveRef.current) {
        return;
      }
      isMouseMoveRef.current = false;
      isMouseDownRef.current = false;
      const curTarget = event.target;
      if (curTarget !== highlightedNodeRef.current) {
        return;
      }
      const { x, y } = event;
      console.log("[]mouseUpHandler - mouse pos is: ", x, y);

      const { commonAncestorContainer, startOffset, endOffset } = window
        .getSelection()
        .getRangeAt(0);
      const text = commonAncestorContainer.textContent.slice(
        startOffset,
        endOffset
      );
      const pNode =
        commonAncestorContainer.nodeType === 1
          ? commonAncestorContainer
          : commonAncestorContainer.parentElement;
      // console.dir(commonAncestorContainer);
      // const textNodeOffsetTop = commonAncestorContainer.offsetTop;
      // console.log("[]mouseUpHandler - selected words is: ", text);
      // console.dir(pNode);
      if (!text) {
        return;
      }
      const posX = (x - downPosRef.current.x) / 2 + downPosRef.current.x;
      // @ts-ignore
      const posY = pNode.offsetTop;
      console.log("[]mouseUpHandler - tooltip pos is:", posX, posY);
      upPosRef.current = {
        x: posX,
        y: posY,
      };
      setCount((prev) => prev + 1);
    };
    contentRef.current.addEventListener("mouseup", mouseUpHandler);

    return () => {
      if (contentRef.current === null) {
        return;
      }
      contentRef.current.removeEventListener("mousedown", mouseDownHandler);
      contentRef.current.removeEventListener("mousemove", mouseMoveHandler);
      contentRef.current.removeEventListener("mouseup", mouseUpHandler);
    };
  }, []);

  return (
    <div ref={contentRef} className="relative">
      <div className="py-10 px-4 bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-600">
        <div className="mx-auto md:w-180">
          <h2 className="text-3xl break-all dark:text-gray-400">{title}</h2>
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
      </div>
      {upPosRef.current && (
        <div
          className="#tooltip inline absolute left-0 top-0"
          style={{
            transform: `translate(${upPosRef.current.x}px, ${upPosRef.current.y}px)`,
          }}
        >
          <div className="#inner tooltip relative top-[-60px] inline-block rounded bg-white transform -translate-x-2/4">
            <div className="#arrow absolute left-[50%] bottom-[-8px] w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-transparent border-t-white transform -translate-x-2/4" />
            <button className="#btn flex items-center py-2 px-4 text-gray-500 space-x-2 cursor-pointer">
              <PencilIcon className="w-4 h-4 text-gray-500" />
              <span>笔记</span>
            </button>
          </div>
        </div>
      )}

      <div className="mt-10 px-4 pb-20 space-y-6 md:mx-auto md:w-180 md:px-0">
        {paragraphs.map((caption) => {
          const { line, text1, text2 } = caption;
          return (
            <div className="paragraph" key={line}>
              <p className="text1">{text1}</p>
              <p className="text2">{text2}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CaptionPreview;
