/**
 * @file 低难度字幕测验结果
 */
import { useCallback, useEffect, useState } from "react";
import cx from "classnames";
import { useRouter } from "next/router";

import {
  fetchPreparedExamService,
  fetchExamSceneProfileService,
  replayExamScene,
} from "@/services/exam";
import { ExamStatus, ExamTypePathMap } from "@/domains/exam/constants";
import SimpleExamStats from "@/components/SimpleExamStats";
import {
  ArrowRightIcon,
  CheckIcon,
  DocumentTextIcon,
  ReplyIcon,
  XIcon,
} from "@ltaoo/icons/outline";
import { examSceneRes2Ins } from "@/domains/exam/transformer";
import IconWithTxt from "@/components/IconWithTxt";
import { IExamSceneValues } from "@/domains/exam/types";
import Layout from "@/layouts";

const SimpleCaptionExamPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const [examScene, setExamScene] = useState<IExamSceneValues>(null);

  const init = useCallback(async (id) => {
    const res = await fetchExamSceneProfileService({ id });
    setExamScene(examSceneRes2Ins(res));
  }, []);

  useEffect(() => {
    init(id);
  }, [id]);

  const nextExamScene = useCallback(async () => {
    const { captionId } = examScene;
    const { id } = await fetchPreparedExamService({ captionId });
    router.push({
      pathname: `/exam/simple/${id}`,
    });
  }, [examScene]);

  const replay = useCallback(async () => {
    if (examScene === null) {
      alert("异常操作，请等待页面加载完成");
      return;
    }
    const { captionId, startId, type } = examScene;
    const { id: i, type: t } = await replayExamScene({
      id,
    });
    const path = ExamTypePathMap[t];
    router.push({
      pathname: `/exam/${path}/${i}`,
    });
  }, [examScene]);

  console.log("[PAGE]exam/simple/[id] - render", examScene);

  if (examScene === null) {
    return null;
  }

  return (
    <Layout title="测验结果">
      <div className="flex">
        <div className="flex-1 mr-12 mt-4">
          <div className="flex justify-center py-4 text-3xl">
            <div className="inline-flex items-center">
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
          </div>
          <div className="mt-6 py-4 bg-gray-100 rounded-xl shadow">
            <SimpleExamStats data={examScene} />
          </div>
          <div className="inline-flex mt-10 py-2 px-4 space-x-8 bg-gray-800 rounded-xl shadow-xl">
            <IconWithTxt
              className="text-gray-200"
              icon={ReplyIcon}
              onClick={replay}
            ></IconWithTxt>
            <IconWithTxt
              className="text-gray-200"
              icon={ArrowRightIcon}
              onClick={nextExamScene}
            ></IconWithTxt>
          </div>
        </div>
        <div className="w-80">
          {examScene.incorrectSpellings.length !== 0 && (
            <div className="mt-10 py-4 text-left">
              <div className="flex items-center mb-2 text-gray-800">
                <DocumentTextIcon className="w-5 h-5 mr-2 text-gray-800" />
                <span>错误句子</span>
              </div>
              <div className="mt-2 space-y-4">
                {examScene.incorrectSpellings.map((spelling) => {
                  const {
                    id,
                    input,
                    paragraph: { text2 },
                  } = spelling;
                  return (
                    <div key={id} className="p-4 rounded-xl shadow bg-gray-100">
                      <p className="text-gray-500 text-md">原句</p>
                      <div className="text-gray-800 text-lg">{text2}</div>
                      <p className="mt-4 text-gray-500 text-md">你的输入</p>
                      <div className="text-gray-800 text-lg">{input}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {examScene.skippedSpellings.length !== 0 && (
            <div className="mt-6 py-4 text-left">
              <div className="flex items-center mb-2 text-gray-800">
                <DocumentTextIcon className="w-5 h-5 mr-2 text-gray-800" />
                <span>跳过句子</span>
              </div>
              <div className="mt-2 space-y-4">
                {examScene.skippedSpellings.map((spelling) => {
                  const {
                    id,
                    paragraph: { text2 },
                  } = spelling;
                  return (
                    <div key={id} className="p-4 shadow rounded-xl bg-gray-100">
                      <div className="text-gray-800 text-lg">{text2}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {examScene.remainingParagraphs.length !== 0 && (
            <div className="mt-6 py-4 text-left">
              <div className="flex items-center mb-2 text-gray-800">
                <DocumentTextIcon className="w-5 h-5 mr-2 text-gray-800" />
                <span>剩余句子</span>
              </div>
              <div className="mt-2 space-y-4">
                {examScene.remainingParagraphs.map((paragraph) => {
                  const { id, text2 } = paragraph;
                  return (
                    <div key={id} className="p-4 shadow rounded-xl bg-gray-100">
                      <div className="text-gray-800 text-lg">{text2}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {examScene.correctSpellings.length !== 0 && (
            <div className="mt-6 py-4 text-left">
              <div className="flex items-center mb-2 text-gray-800">
                <DocumentTextIcon className="w-5 h-5 mr-2 text-gray-800" />
                <span>正确句子</span>
              </div>
              <div className="mt-2 space-y-4">
                {examScene.correctSpellings.map((spelling) => {
                  const {
                    id,
                    paragraph: { text2 },
                  } = spelling;
                  return (
                    <div key={id} className="p-4 shadow rounded-xl bg-gray-100">
                      <div className="text-gray-800 text-lg">{text2}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SimpleCaptionExamPage;
