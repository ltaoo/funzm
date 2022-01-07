/**
 * @file 低难度字幕预备
 */
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import Layout from "@/layouts";
import {
  fetchCurExamSceneByCaption,
  fetchExamScenesByCaptionService,
} from "@/services/exam";
import { ExamStatus, examStatusTexts } from "@/domains/exam/constants";
import { IPartialExamSceneValues } from "@/domains/exam/types";

const SimpleCaptionExamPage = () => {
  const router = useRouter();

  const [examScenes, setExamScenes] = useState<IPartialExamSceneValues[]>(null);
  const [startedScene, setStartedScene] =
    useState<IPartialExamSceneValues>(null);

  const init = useCallback(async () => {
    const id = router.query.id as string;
    console.log("[PAGE]exam/simple/prepare/[id] - init", id);
    const examScenesResponse = await fetchExamScenesByCaptionService({ id });

    let startedExamScene = examScenesResponse.find((scene) =>
      [ExamStatus.Prepare, ExamStatus.Started].includes(scene.status)
    );
    if (startedExamScene) {
      setStartedScene(startedExamScene);
      setExamScenes(
        examScenesResponse.filter((scene) => scene.id !== startedExamScene.id)
      );
      return;
    }
    startedExamScene = await fetchCurExamSceneByCaption({
      captionId: id,
    });
    setStartedScene(startedExamScene);
    setExamScenes(examScenesResponse);
    // console.log("[PAGE]exam/simple/[id] - init result", res);
  }, []);

  useEffect(() => {
    init();
  }, []);

  console.log("[PAGE]exam/simple/[id] - render", examScenes);

  if (examScenes === null) {
    return null;
  }

  return (
    <Layout>
      <div className="bg-gray-100">
        <Link href={`/exam/simple/${startedScene.id}`}>
          <div className="py-4 text-center text-xl rounded bg-white cursor-pointer shadow">
            {startedScene.start}
          </div>
        </Link>
        <Link href={`/captions/${startedScene.captionId}`}>
          <div className="mt-4 py-4 text-center text-xl rounded bg-white cursor-pointer shadow">
            复习
          </div>
        </Link>
        <div className="mt-8 text-gray-800">历史({examScenes.length})</div>
        <div className="mt-2 space-y-4">
          {examScenes.map((scene) => {
            const { id, start, score, status, startedAt, endedAt } = scene;
            return (
              <div
                key={id}
                className="p-4 rounded shadow bg-white"
                onClick={() => {
                  router.push({
                    pathname: `/exam/simple/result/${id}`,
                  });
                }}
              >
                <div className="text-gray-300">{start}</div>
                <div className="flex justify-between items-center mt-2">
                  <div className="text-gray-300">{examStatusTexts[status]}</div>
                  {status === ExamStatus.Completed && <span>{score}</span>}
                </div>
                <div className="flex text-sm text-gray-300">
                  <div className="">{startedAt}</div>
                  {endedAt && <div className="text-gray-300"> - {endedAt}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default SimpleCaptionExamPage;
