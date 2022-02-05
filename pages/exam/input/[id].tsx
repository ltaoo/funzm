/**
 * @file 拼写模式测验
 */
import React, { useRef, useCallback, useEffect, useState } from "react";
import cx from "classnames";
import { useRouter } from "next/router";
import hotkeys from "hotkeys-js";

import {
  createExamSpellingService,
  fetchExamSceneService,
  updateExamSceneService,
} from "@/domains/exam/services";
import { SpellingResultType } from "@/domains/exam/constants";
import InputExam from "@/domains/exam/input";
import { ExamStatus } from "@/domains/exam/constants";
import { IExamSceneDomain } from "@/domains/exam/types";
import SimpleExamOperator from "@/components/SimpleExamOperator";

const InputtingExamScenePage = () => {
  const router = useRouter();

  const examRef = useRef(null);
  const [exam, setExam] = useState<IExamSceneDomain>(null);
  const [correctVisible, setCorrectVisible] = useState(false);
  const [incorrectVisible, setIncorrectVisible] = useState(false);
  const [text2, setText2] = useState(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pressRef = useRef(false);

  const init = useCallback(async () => {
    const id = router.query.id as string;
    // console.log("[PAGE]exam/simple/[id] - init", id);
    const res = await fetchExamSceneService({ id });
    const { status, paragraphs, start_id, cur } = res;

    if ([ExamStatus.Completed, ExamStatus.Failed].includes(status)) {
      router.replace({
        pathname: `/exam/result/${id}`,
      });
      return;
    }
    const curParagraphIndex = cur
      ? paragraphs.findIndex((paragraph) => paragraph.id === cur)
      : undefined;
    examRef.current = new InputExam({
      title: "",
      status: ExamStatus.Started,
      secondsPerParagraph: 30,
      curParagraphId: (() => {
        if (curParagraphIndex && curParagraphIndex !== -1) {
          return paragraphs[curParagraphIndex + 1].id;
        }
        return start_id;
      })(),
      canComplete: true,
      paragraphs,
      onChange: async (nextExam) => {
        setExam(nextExam);
      },
      onCorrect({ curParagraphId }) {
        setCorrectVisible(true);
        createExamSpellingService({
          examSceneId: id,
          paragraphId: curParagraphId,
          type: SpellingResultType.Correct,
        });
        setTimeout(() => {
          setCorrectVisible(false);
        }, 800);
      },
      onIncorrect({ curParagraphId, inputting }) {
        setIncorrectVisible(true);
        createExamSpellingService({
          examSceneId: id,
          paragraphId: curParagraphId,
          type: SpellingResultType.Incorrect,
          input: inputting,
        });
        setTimeout(() => {
          setIncorrectVisible(false);
        }, 800);
      },
      onSkip({ curParagraphId }) {
        createExamSpellingService({
          examSceneId: id,
          paragraphId: curParagraphId,
          type: SpellingResultType.Skipped,
        });
      },
      async onComplete() {
        await updateExamSceneService({
          id,
        });
        router.replace({
          pathname: `/exam/result/${id}`,
        });
      },
      async onFailed() {
        await updateExamSceneService({
          id,
        });
        alert("测验失败");
        router.replace({
          pathname: `/exam/result/${id}`,
        });
      },
    });
    setExam(examRef.current.toJSON());
  }, []);

  useEffect(() => {
    init();
    // hotkeys("ctrl+k, command+k", function (event, handler) {
    //   event.preventDefault();
    //   showText2();
    // });
    return () => {
      // hotkeys.unbind("ctrl+k, command+k");
      if (examRef.current) {
        examRef.current.clearTimer();
      }
    };
  }, []);

  const focusInput = useCallback(() => {
    if (inputRef.current === null) {
      return;
    }
    inputRef.current.focus();
  }, []);

  const handlePressEnter = useCallback(
    (event: React.KeyboardEvent) => {
      const { keyCode } = event;
      if (keyCode === 91) {
        pressRef.current = true;
      }
      if (keyCode === 75 && pressRef.current) {
        showText2();
        return;
      }
      if (keyCode === 13) {
        event.preventDefault();
        examRef.current.compare();
        focusInput();
      }
    },
    [exam]
  );
  const handleKeyUp = useCallback((event: React.KeyboardEvent) => {
    const { keyCode } = event;
    if (keyCode === 91) {
      pressRef.current = false;
    }
  }, []);

  const showText2 = useCallback(() => {
    setText2(exam.curParagraph.text2);
    setTimeout(() => {
      setText2(null);
    }, 2000);
  }, [exam]);

  if (exam === null) {
    return null;
  }

  return (
    <div className="h-screen">
      <div className="relative mx-auto w-240 h-full px-4">
        <div className="mt-8 min-h-56">
          <div className="text1">{exam.curParagraph.text1}</div>
          <textarea
            ref={inputRef}
            // key={exam.curParagraph.text1}
            autoFocus
            value={examRef.current.inputting}
            className="mt-12 p-2 w-full text2 text-3xl border border-gray-500 rounded placeholder-gray-300 outline-none"
            placeholder="请输入英文翻译"
            onKeyDown={handlePressEnter}
            onKeyUp={handleKeyUp}
            onChange={(event) => {
              const {
                target: { value },
              } = event;
              examRef.current.write(value);
            }}
          ></textarea>
        </div>
        <div className="relative">
          <div
            className={cx(
              "absolute w-2 h-2 bg-gray-800",
              correctVisible ? "bg-green-500" : "",
              incorrectVisible ? "bg-red-500" : ""
            )}
            style={{
              left: `${exam.countdown}%`,
              transform: `translateX(-${exam.countdown}%)`,
            }}
          ></div>
          <hr />
        </div>
        <div className="flex items-center justify-between mt-6 px-4">
          <div className="text-xl text-gray-400">
            {exam.index}/{exam.paragraphs.length}
          </div>
          <SimpleExamOperator
            instance={examRef.current}
            onTip={showText2}
            onClear={() => {
              focusInput();
            }}
          />
        </div>
        <div className="text-gray-300 mt-4 px-4">
          <div className="text-xl">Tip</div>
          <div className="m-2">
            <div>1、「回车键」提交当前输入内容并对比是否正确</div>
            <div>2、无论正确与否，都会进入下一句</div>
            <div>3、Ctrl + k 显示英文原文 2s</div>
          </div>
        </div>
        {text2 && (
          <div className="mt-8 text-3xl font-serif text-gray-300">{text2}</div>
        )}
      </div>
    </div>
  );
};

export default InputtingExamScenePage;
