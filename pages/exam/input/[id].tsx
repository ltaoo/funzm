/**
 * @file 全局拼写字幕测验
 */
import { Fragment, useRef, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Transition } from "@headlessui/react";

import {
  createExamSpellingService,
  fetchExamSceneService,
  updateExamSceneService,
} from "@/domains/exam/services";
import { SpellingResultType } from "@/domains/exam/constants";
import InputExam from "@/domains/exam/input";
import { ExamStatus } from "@/domains/exam/constants";
import { IExamSceneDomain } from "@/domains/exam/types";
import Loading from "@/components/Loading";
import Modal from "@/components/Modal";
import SimpleExamOperator from "@/components/SimpleExamOperator";

const SimpleCaptionExamPage = () => {
  const router = useRouter();

  const examRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [exam, setExam] = useState<IExamSceneDomain>(null);
  const [correctVisible, setCorrectVisible] = useState(false);
  const [incorrectVisible, setIncorrectVisible] = useState(false);
  const [text2, setText2] = useState(null);
  const [tipVisible, setTipVisible] = useState(false);

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
    return () => {
      if (examRef.current) {
        examRef.current.clearTimer();
      }
    };
  }, []);

  const handlePressEnter = useCallback((event) => {
    if (event.keyCode === 13) {
      examRef.current.compare();
    }
  }, []);

  const showText2 = useCallback((paragraph) => {
    return () => {
      setText2(paragraph.text2);
      setTipVisible(true);
    };
  }, []);

  console.log("[PAGE]exam/simple/[id] - render", exam);

  if (exam === null) {
    return null;
  }

  return (
    <div className="h-screen">
      {exam?.status === ExamStatus.Started && (
        <div className="relative h-full px-4 md:mx-auto md:w-240">
          <div className="mt-24 min-h-56">
            <div className="text1">{exam.curParagraph.text1}</div>
            <textarea
              autoFocus
              value={examRef.current.inputting}
              className="mt-8 w-full text2 text-3xl outline-none border-0 placeholder-gray-300"
              placeholder="请输入英文翻译"
              onKeyDown={handlePressEnter}
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
              className="absolute w-2 h-2 bg-green-500"
              style={{
                left: `${exam.countdown}%`,
                transform: `translateX(-${exam.countdown}%)`,
              }}
            ></div>
            <hr />
          </div>
          <div className="flex items-center justify-between mt-6 px-4 sm:mx-auto sm:w-180 sm:px-0">
            <div className="text-xl text-gray-400">
              {exam.index}/{exam.paragraphs.length}
            </div>
            <SimpleExamOperator instance={examRef.current} />
          </div>
          <div className="text-gray-300">
            <div className="text-xl">Tip</div>
            <div className="m-4">
              <div>1、「回车键」提交当前输入内容并对比是否正确</div>
              <div>2、无论正确与否，都会进入下一句</div>
            </div>
          </div>
        </div>
      )}
      <Transition
        show={correctVisible}
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enterTo="opacity-100 translate-y-0 sm:scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      >
        <div className="absolute right-10 top-16 transform -rotate-6">
          <p className="text-4xl text-green-500">CORRECT!</p>
        </div>
      </Transition>
      <Transition
        show={incorrectVisible}
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enterTo="opacity-100 translate-y-0 sm:scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      >
        <div className="absolute right-10 top-16 transform -rotate-6">
          <p className="text-4xl text-red-300">INCORRECT!</p>
        </div>
      </Transition>
      <Loading visible={loading} />
      <Modal
        visible={tipVisible}
        onCancel={() => {
          setTipVisible(false);
        }}
      >
        <div className="text-center">{text2}</div>
      </Modal>
    </div>
  );
};

export default SimpleCaptionExamPage;
