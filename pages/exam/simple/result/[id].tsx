/**
 * @file 低难度字幕测验结果
 */
import { useRef, useCallback, useEffect, useState } from "react";
import cx from "classnames";
import { useRouter } from "next/router";

import {
  createExamSceneService,
  fetchExamSceneProfileService,
} from "@/services/exam";
import { ExamStatus } from "@/domains/exam/constants";
import SimpleExamStats from "@/components/SimpleExamStats";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  ReplyIcon,
  XIcon,
} from "@ltaoo/icons/outline";
import { examSceneRes2Ins } from "@/domains/exam/transformer";
import IconWithTxt from "@/components/IconWithTxt";
import { ExamSceneValues } from "@/domains/exam/types";

const SimpleCaptionExamPage = () => {
  const router = useRouter();

  const [examScene, setExamScene] = useState<ExamSceneValues>(null);

  const init = useCallback(async () => {
    const id = router.query.id as string;
    const res = await fetchExamSceneProfileService({ id });
    setExamScene(examSceneRes2Ins(res));
  }, []);

  useEffect(() => {
    init();
  }, []);

  const nextExamScene = useCallback(async () => {
    // startRef.current = stats.paragraphs[stats.paragraphs.length - 1].id;
    // const response = await fetchParagraphsService({
    //   captionId: idRef.current,
    //   start: startRef.current,
    //   pageSize: 21,
    //   page: 1,
    // });
    // const remainingParagraphs = response.list;
    // if (remainingParagraphs.length === 1) {
    //   // is end
    //   return;
    // }
    // const { id } = await createExamSceneService({
    //   captionId: idRef.current,
    //   examId: examIdRef.current,
    //   // @ts-ignore
    //   start: remainingParagraphs[1].id,
    // });
    // router.replace({
    //   pathname: `/exam/simple/${id}`,
    // });
  }, []);

  const replay = useCallback(async () => {
    if (examScene === null) {
      alert("异常操作，请等待页面加载完成");
      return;
    }
    const { examId, captionId, start } = examScene;
    const { id } = await createExamSceneService({
      captionId,
      examId,
      start,
    });
    router.push({
      pathname: `/exam/simple/${id}`,
    });
  }, [examScene]);

  console.log("[PAGE]exam/simple/[id] - render", examScene);

  if (examScene === null) {
    return null;
  }

  return (
    <div className="overflow-hidden px-4 pb-12 bg-gray-100">
      <div className="mt-12 text-center">
        <div className="inline-flex items-center text-3xl bg-white">
          {examScene.status === ExamStatus.Completed && (
            <CheckIcon className="w-10 h-10 text-green-500" />
          )}
          {examScene.status === ExamStatus.Failed && (
            <XIcon className="w-10 h-10 text-red-500" />
          )}
          <span
            className={cx(
              "inline-block mx-4",
              examScene.status === ExamStatus.Completed
                ? "text-green-500"
                : "text-red-500"
            )}
          >
            {examScene.status === ExamStatus.Completed ? "完成" : "失败"}
          </span>
        </div>
        <div className="mt-18 py-4 bg-white rounded">
          <SimpleExamStats data={examScene.stats} />
        </div>
        <div className="flex justify-evenly mt-10 space-x-8 md:mx-auto md:w-240">
          <IconWithTxt
            icon={ArrowLeftIcon}
            size="large"
            onClick={() => {
              router.push({
                pathname: "/dashboard",
              });
            }}
          >
            返回
          </IconWithTxt>
          <IconWithTxt icon={ReplyIcon} size="large" onClick={replay}>
            重来
          </IconWithTxt>
          <IconWithTxt
            icon={ArrowRightIcon}
            size="large"
            onClick={nextExamScene}
          >
            下一幕
          </IconWithTxt>
        </div>
        <div className="mt-10 py-4 text-left">
          <div className="text-xl text-gray-800">错误句子</div>
          <div className="mt-2 space-y-4">
            {examScene.incorrectSpellings.map((spelling) => {
              const {
                id,
                input,
                paragraph: { text2 },
              } = spelling;
              return (
                <div key={id} className="p-4 shadow bg-white">
                  <p className="text-gray-500 text-md">原句</p>
                  <div className="text-gray-800 text-lg">{text2}</div>
                  <p className="mt-4 text-gray-500 text-md">你的输入</p>
                  <div className="text-gray-800 text-lg">{input}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-6 py-4 text-left">
          <div className="text-xl text-gray-800">跳过句子</div>
          <div className="mt-2 space-y-4">
            {examScene.skippedSpellings.map((spelling) => {
              const {
                id,
                paragraph: { text2 },
              } = spelling;
              return (
                <div key={id} className="p-4 shadow bg-white">
                  <div className="text-gray-800 text-lg">{text2}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleCaptionExamPage;
