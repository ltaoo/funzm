import { useCallback, useEffect, useRef, useState } from "react";

import { splitTextHasNotes } from "@/domains/caption/utils";
import { PencilIcon, XIcon } from "@ltaoo/icons/outline";
import { useVisible } from "@/hooks";
import { addNoteService, updateNoteService } from "@/services/note";

function getXAndY(event) {
  const { x, y } = event;
  return {
    x,
    y,
  };
}
function findParagraphNode(node) {
  if (node.tagName === "P") {
    return node;
  }
  return findParagraphNode(node.parentElement);
}

interface IProps {
  highlights?: {
    start: number;
    end: number;
  }[];
  children: string;
  onSubmit?: (value: {
    id?: number;
    // 笔记内容
    content: string;
    // 高亮文本
    text: string;
    start: number;
    end: number;
  }) => void;
}
const HighlightContent: React.FC<IProps> = (props) => {
  const { children, highlights = [], onSubmit } = props;

  const [visible, show, hide] = useVisible();

  const [count, setCount] = useState(0);
  const downPosRef = useRef<null | { x: number; y: number }>(null);
  const upPosRef = useRef<null | { x: number; y: number }>(null);
  const isMouseDownRef = useRef(false);
  const isMouseMoveRef = useRef(false);
  const highlightedNodeRef = useRef(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const notePosRef = useRef(null);
  const selectedTextRef = useRef(null);
  const curParagraphRef = useRef(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const editingNoteRef = useRef<null | { id: number }>(null);
  const innerHighlightRef = useRef(null);

  useEffect(() => {
    if (contentRef.current === null) {
      return;
    }
    const mouseDownHandler = (event) => {
      const curTarget = event.target as HTMLElement;
      upPosRef.current = null;
      setCount((prev) => (prev += 1));
      //       if (curTarget.className?.indexOf("text2") === -1) {
      //         return;
      //       }
      const { x, y } = getXAndY(event);
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
        isMouseMoveRef.current = true;
      }
    };
    contentRef.current.addEventListener("mousemove", mouseMoveHandler);

    const mouseUpHandler = (event) => {
      if (!isMouseMoveRef.current) {
        return;
      }
      isMouseMoveRef.current = false;
      isMouseDownRef.current = false;
      const curTarget = event.target;
      if (curTarget !== highlightedNodeRef.current) {
        return;
      }
      const { x, y } = getXAndY(event);

      const { commonAncestorContainer, startOffset, endOffset } = window
        .getSelection()
        .getRangeAt(0);

      const text = commonAncestorContainer.textContent.slice(
        startOffset,
        endOffset
      );
      const paragraphNode = findParagraphNode(commonAncestorContainer);
      selectedTextRef.current = {
        text,
        start: paragraphNode.innerText.indexOf(text),
        end: paragraphNode.innerText.indexOf(text) + text.length,
      };
      const pNode =
        commonAncestorContainer.nodeType === 1
          ? commonAncestorContainer
          : commonAncestorContainer.parentElement;
      if (!text) {
        return;
      }
      const posX = (x - downPosRef.current.x) / 2 + downPosRef.current.x;
      // const posX = downPosRef.current.x;
      // @ts-ignore
      const posY = pNode.offsetTop;
      //       console.log("[]mouseUpHandler - tooltip pos is:", posX, posY);
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

  const renderText2HasNotes = useCallback((text2, nts) => {
    const nodes = splitTextHasNotes(text2, nts);

    return nodes.map((node) => {
      const { type, text, note } = node;
      if (type === "text") {
        return text;
      }
      return (
        <span
          key={text}
          className={"cursor-pointer bg-green-500"}
          onClick={() => {
            show();
            setTimeout(() => {
              inputRef.current.value = note.content;
              editingNoteRef.current = note;
              setCount((prev) => (prev += 1));
            }, 200);
          }}
        >
          {text}
        </span>
      );
    });
  }, []);

  const showNoteInput = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      notePosRef.current = upPosRef.current
        ? upPosRef.current
        : {
            x: 0,
            y: 0,
          };
      upPosRef.current = null;

      //       console.log(selectedTextRef.current);
      innerHighlightRef.current = selectedTextRef.current;

      if (visible) {
        hide();
        setTimeout(() => {
          show();
        }, 200);
        return;
      }
      show();
    },
    [visible]
  );

  //   const { id, line, text1, text2 } = paragraph;
  //   const tmpNodes =
  //     tmpNoteRef.current && curParagraphRef.current
  //       ? {
  //           ...notes,
  //           [curParagraphRef.current.id]: (
  //             notes[curParagraphRef.current.id] || []
  //           )
  //             .concat({
  //               ...tmpNoteRef.current,
  //             })
  //             .filter(Boolean),
  //         }
  //       : notes;
  //   const hasNotes = tmpNodes[id];

  return (
    <>
      <div ref={contentRef}>
        <p>
          {renderText2HasNotes(
            children,
            (() => {
              return highlights
                .concat([innerHighlightRef.current])
                .filter(Boolean);
            })()
          )}
        </p>
      </div>
      {upPosRef.current && (
        <div
          className="#tooltip inline absolute left-0 top-0"
          style={{
            left: `${upPosRef.current.x}px`,
            top: `${upPosRef.current.y}px`,
            // transform: `translate(${upPosRef.current.x}px, ${upPosRef.current.y}px)`,
          }}
        >
          <div className="#inner tooltip relative top-[-60px] inline-block rounded bg-gray-800 transform -translate-x-2/4">
            <div className="#arrow absolute left-[50%] bottom-[-8px] w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-transparent border-t-gray-800 transform -translate-x-2/4" />
            <button
              className="#btn flex items-center py-2 px-4 text-sm text-gray-500 space-x-2 cursor-pointer"
              onMouseDown={(event) => {
                event.stopPropagation();
              }}
              onClick={showNoteInput}
            >
              <PencilIcon className="w-4 h-4 text-gray-200" />
              <span className="text-gray-200">笔记</span>
            </button>
          </div>
        </div>
      )}

      {visible && (
        <div
          className="inline overflow-hidden z-index-10 fixed border-1 border-right-0 bg-white shadow-lg rounded"
          style={{
            right: "0px",
            // bottom: `${notePosRef.current.y}px`,
            bottom: 120,
          }}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <XIcon
            className="absolute right-4 top-4 w-4 h-4 text-gray-800 cursor-pointer"
            onClick={() => {
              selectedTextRef.current = null;
              curParagraphRef.current = null;
              editingNoteRef.current = null;
              innerHighlightRef.current = null;
              hide();
            }}
          />
          <div className="h-1 bg-gray-800" />
          <div className="mt-6 relative">
            <div className="p-4">
              <textarea
                className="py-1 px-2 border border-solid border-gray-800 text-md rounded outline-0"
                ref={inputRef}
                rows={6}
                autoFocus
                placeholder="请输入笔记内容"
              />
              <div className="mt-2 space-x-2">
                <button
                  className="inline-block py-1 px-4 text-sm text-gray-100 border border-solid border-gray-800 rounded bg-gray-800 cursor-pointer"
                  onClick={async () => {
                    if (onSubmit) {
                      const content = inputRef.current.value;
                      const created = await onSubmit({
                        id: editingNoteRef.current?.id,
                        content,
                        text: selectedTextRef.current?.text,
                        start: selectedTextRef.current?.start,
                        end: selectedTextRef.current?.end,
                      });
                    }
                    selectedTextRef.current = null;
                    curParagraphRef.current = null;
                    editingNoteRef.current = null;
                    innerHighlightRef.current = null;
                    hide();
                  }}
                >
                  保存
                </button>
                {/* {editingNoteRef.current?.id && (
                  <button
                    className="inline-block py-1 px-4 text-sm border border-solid text-gray-800 border-gray-800 rounded cursor-pointer"
                    onClick={async () => {
                      const i =
                        tmpNoteRef.current?.id || editingNoteRef.current?.id;
                      await deleteNote(i);
                      setNotes((prevNotes) => {
                        return {
                          ...prevNotes,
                          [curParagraphRef.current.id]: (
                            notes[curParagraphRef.current.id] || []
                          ).filter((note) => note.id !== i),
                        };
                      });
                      selectedTextRef.current = null;
                      curParagraphRef.current = null;
                      editingNoteRef.current = null;
                      tmpNoteRef.current = null;
                      hide();
                    }}
                  >
                    删除
                  </button>
                )} */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HighlightContent;
