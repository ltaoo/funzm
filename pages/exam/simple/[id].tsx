/**
 * @file 低难度字幕测验
 */
import { Fragment, useRef, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Transition } from "@headlessui/react";

import {
  createExamSpellingService,
  fetchExamSceneService,
  updateExamSceneService,
} from "@/services/exam";
import { fetchParagraphsService } from "@/services/caption";
import {
  PARAGRAPH_COUNT_PER_EXAM_SCENE,
  SpellingResultType,
} from "@/domains/exam/constants";
import Exam from "@/domains/exam";
import { ExamStatus } from "@/domains/exam/constants";
import Loading from "@/components/Loading";
import Modal from "@/components/Modal";
import SimpleExamInput from "@/components/SimpleExamInput";
import SimpleExamOperator from "@/components/SimpleExamOperator";

const SimpleCaptionExamPage = () => {
  const router = useRouter();

  const examRef = useRef(null);
  const loadingRef = useRef(false);
  const idRef = useRef<string>(null);
  const sceneIdRef = useRef<string>(null);
  const examIdRef = useRef<string>(null);
  const [loading, setLoading] = useState(false);
  const [curCombo, setCurCombo] = useState(0);
  const [exam, setExam] = useState<Exam>(null);
  const [correctVisible, setCorrectVisible] = useState(false);
  const [incorrectVisible, setIncorrectVisible] = useState(false);
  const [text2, setText2] = useState(null);
  const [tipVisible, setTipVisible] = useState(false);

  const init = useCallback(async () => {
    const id = router.query.id as string;
    console.log("[PAGE]exam/simple/[id] - init", id);
    const res = await fetchExamSceneService({ id });
    const { examId, captionId, status, start, cur } = res;

    if ([ExamStatus.Completed, ExamStatus.Failed].includes(status)) {
      router.replace({
        pathname: `/exam/simple/result/${id}`,
      });
      return;
    }
    sceneIdRef.current = id;
    examIdRef.current = examId;
    idRef.current = captionId;
    const { list: paragraphs } = await fetchParagraphsService({
      captionId: idRef.current,
      start,
      pageSize: PARAGRAPH_COUNT_PER_EXAM_SCENE,
      page: 1,
    });
    const curParagraphIndex = cur
      ? paragraphs.findIndex((paragraph) => paragraph.id === cur)
      : undefined;
    console.log(
      "[PAGE]exam/simple/[id] - init result",
      paragraphs,
      cur,
      curParagraphIndex
    );
    examRef.current = new Exam({
      title: "",
      status: ExamStatus.Started,
      curParagraphId: (() => {
        if (curParagraphIndex && curParagraphIndex !== -1) {
          return paragraphs[curParagraphIndex + 1].id;
        }
        return start;
      })(),
      canComplete: true,
      paragraphs,
      onChange: async (nextExam) => {
        setExam(nextExam);
      },
      onCorrect({ combo, curParagraphId }) {
        setCorrectVisible(true);
        createExamSpellingService({
          examId: id,
          paragraphId: curParagraphId,
          type: SpellingResultType.Correct,
        });
        setTimeout(() => {
          setCorrectVisible(false);
        }, 800);
      },
      onIncorrect({ curParagraphId, inputtingWords }) {
        setIncorrectVisible(true);
        createExamSpellingService({
          examId: id,
          paragraphId: curParagraphId,
          type: SpellingResultType.Incorrect,
          input: inputtingWords.map((w) => w.word).join(" "),
        });
        setTimeout(() => {
          setIncorrectVisible(false);
        }, 800);
      },
      onSkip({ curParagraphId }) {
        createExamSpellingService({
          // examSceneId
          examId: id,
          paragraphId: curParagraphId,
          type: SpellingResultType.Skipped,
        });
      },
      async onComplete() {
        await updateExamSceneService({
          id,
          status: ExamStatus.Completed,
        });
        router.replace({
          pathname: `/exam/simple/result/${id}`,
        });
      },
      async onFailed() {
        await updateExamSceneService({
          id,
          status: ExamStatus.Failed,
        });
        alert("测验失败");
        router.replace({
          pathname: `/exam/simple/result/${id}`,
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

  const showText2 = useCallback((paragraph) => {
    return () => {
      setText2(paragraph.text2);
      setTipVisible(true);
    };
  }, []);

  // console.log("[PAGE]exam/simple/[id] - render", exam);

  if (exam === null) {
    return null;
  }

  return (
    <div className="h-screen">
      {exam?.status === ExamStatus.Started && (
        <div className="relative h-full md:mx-auto md:w-240">
          {/* @ts-ignore */}
          <SimpleExamInput
            {...exam}
            onClick={(segment) => {
              if (!examRef.current) {
                return;
              }
              examRef.current.write(segment);
            }}
          />
          <div className="relative">
            <div
              className="absolute w-2 h-2 bg-green-500"
              style={{ left: `${exam.countdown}%` }}
            ></div>
            <hr />
          </div>
          <div className="flex items-center justify-between mt-6 px-4 sm:mx-auto sm:w-180 sm:px-0">
            <div className="text-xl text-gray-400">
              {exam.index}/{exam.paragraphs.length}
            </div>
            <SimpleExamOperator instance={examRef.current} />
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
