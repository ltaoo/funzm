/**
 * @file 字幕测验预备
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import {
  DocumentTextIcon,
  LightningBoltIcon,
  MicrophoneIcon,
  PencilAltIcon,
} from "@ltaoo/icons/outline";

import Layout from "@/layouts";
import {
  fetchPreparedExamSceneService,
  createExamSceneService,
} from "@/domains/exam/services";
import { ExamStatus, ExamType } from "@/domains/exam/constants";
import { IExamSceneValues } from "@/domains/exam/types";
import { useCaption } from "@/domains/caption/hooks";
import Paragraphs from "@/components/Paragraphs";

const PrepareExamPage = () => {
  const router = useRouter();

  const id = router.query.id as string;

  const caption = useCaption(id);
  const [examScenes, setExamScenes] = useState<IExamSceneValues[]>([]);
  const [curExamScene, setCurExamScene] = useState<IExamSceneValues>(null);
  const loadingRef = useRef(false);

  const init = useCallback(async (id) => {
    if (!id) {
      return;
    }
    const preparedExamScene = await fetchPreparedExamSceneService({
      captionId: id,
    });
    setCurExamScene(preparedExamScene);
    // const examScenesResponse = await fetchExamScenesByCaptionService({ id });
    // setExamScenes(examScenesResponse);
  }, []);

  useEffect(() => {
    init(id);
  }, [id]);

  const createExamScene = useCallback(
    (type) => {
      return async () => {
        if (loadingRef.current) {
          return;
        }
        loadingRef.current = true;
        const created = await createExamSceneService({ caption_id: id, type });
        loadingRef.current = false;
        const routeMap = {
          [ExamType.Selection]: "select",
          [ExamType.Spelling]: "input",
          [ExamType.Speak]: "speak",
        };
        router.push({
          pathname: `/exam/${routeMap[type]}/${created.id}`,
        });
      };
    },
    [id]
  );

  if (curExamScene === null) {
    return null;
  }

  const { start, noMore, percent } = curExamScene;

  if (noMore) {
    return (
      <div className="page mt-4 px-4">
        <div className="mt-12 text-center">
          <div className="mt-8 text-xl text-gray-500">
            <div className="text-center">恭喜</div>
            <div className="text-center">所有测验已完成</div>
          </div>
        </div>
        <div className="mt-12 text-center">
          <div
            className="inline-block py-2 px-4 text-gray-100 bg-gray-800 rounded"
            onClick={() => {
              router.push({
                pathname: `/pages/exam/progress/${id}`,
              });
            }}
          >
            查看所有测验
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout title="测验准备">
      <main className="flex">
        <div className="flex-1 mr-12">
          <div className="mt-4">
            <div className="overflow-hidden relative py-4 px-6 bg-gray-100 rounded-xl shadow">
              <p className="text-xl text-gray-500">{start.text1}</p>
              <p className="text-3xl text-gray-800 font-serif">
                {start.text2 || (
                  <div className="text-gray-300 italic">Empty</div>
                )}
              </p>
              <div
                className="absolute bottom-0 left-0 h-1 bg-gray-800"
                style={{
                  width: `${percent}%`,
                }}
              ></div>
            </div>
            <div className="inline-flex mt-4 py-2 px-4 space-x-4 bg-gray-800 rounded-xl shadow">
              <LightningBoltIcon
                className="w-6 h-6 text-gray-200 cursor-pointer"
                onClick={createExamScene(ExamType.Selection)}
              />
              <PencilAltIcon
                className="w-6 h-6 text-gray-200 cursor-pointer"
                onClick={createExamScene(ExamType.Spelling)}
              />
              <MicrophoneIcon
                className="w-6 h-6 text-gray-200 cursor-pointer"
                onClick={createExamScene(ExamType.Speak)}
              />
            </div>
          </div>
          <div className="mt-8 px-2">
            <Paragraphs dataSource={curExamScene.paragraphs} />
          </div>
        </div>
        <div className="mt-4 w-80">
          <div className="py-4 px-6 bg-gray-100 rounded-xl shadow">
            <div className="text-xl break-all text-gray-800">
              {caption?.title}
            </div>
            <div className="mt-4">{caption?.count}</div>
            <div className="mt-4 text-gray-500">{caption?.createdAt}</div>
          </div>
          <div className="mt-6">
            <div className="flex items-center mb-2 text-gray-800">
              <DocumentTextIcon className="w-5 h-5 mr-2 text-gray-800" />
              <span>测验历史</span>
            </div>
            <div className="mt-2 space-y-4">
              {examScenes.map((scene) => {
                const { id, start, score, status, startedAt, endedAt } = scene;
                return (
                  <div
                    key={id}
                    className="relative p-4 rounded-xl shadow bg-gray-100 cursor-pointer hover:shadow-xl"
                    onClick={() => {
                      router.push({
                        pathname: `/exam/result/${id}`,
                      });
                    }}
                  >
                    <div className="text-gray-300">{start.text1}</div>
                    <div className="text-xl text-gray-300 font-serif">
                      {start.text2 || "Empty"}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      {status === ExamStatus.Completed && (
                        <div className="absolute right-4 bottom-4 text-green-500">
                          <span>获得积分</span>
                          <span>{score}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-300">
                      <span className="">{startedAt}</span>
                      {endedAt && (
                        <span className="text-gray-300"> - {endedAt}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default PrepareExamPage;
