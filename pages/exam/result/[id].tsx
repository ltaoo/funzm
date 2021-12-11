import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

import {
  fetchExamResultByTypeService,
  fetchExamResultStatsService,
  fetchExamService,
} from "@/services/exam";
import { SpellingResultType } from "@/domains/exam/constants";

const ExamResultPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const [exam, setExam] = useState(null);
  const [spellings, setSpellings] = useState([]);

  const init = useCallback(async () => {
    const exam = await fetchExamService({ id });
    setExam(exam);

    const dataSource = await fetchExamResultStatsService({ id });
    setSpellings(dataSource);
  }, [id]);

  useEffect(() => {
    init();
  }, []);

  const fetchIncorrectSpellings = useCallback(async () => {
    const dataSource = await fetchExamResultByTypeService({
      id,
      type: SpellingResultType.Incorrect,
    });
    console.log(dataSource);
  }, [id]);

  if (exam === null) {
    return (
      <div className="flex items-center justify-center pt-12 text-center">
        <span>Loading</span>
      </div>
    );
  }

  const correct = spellings.filter(
    (spelling) => spelling.type === SpellingResultType.Correct
  );
  const incorrect = spellings.filter(
    (spelling) => spelling.type === SpellingResultType.Incorrect
  );
  const skipped = spellings.filter(
    (spelling) => spelling.type === SpellingResultType.Skipped
  );

  return (
    <div>
      <div className="bg-gray-100">
        <div className="p-4 sm:mx-auto sm:w-180">
          <p className="text-2xl">{exam.caption.title}</p>
          <div className="mt-2">
            <time className="text-gray-500">Begin: {exam.created_at}</time>
          </div>
        </div>
      </div>
      <div className="mt-10 p-4 space-y-4 sm:mx-auto sm:w-180">
        <div className="p-2 px-4 rounded border">
          <h3 className="text-xl text-gray-800">正确句子</h3>
          <div className="mt-4">
            <span className="text-2xl">{correct.length}</span>
          </div>
        </div>
        <div className="p-2 px-4 rounded border">
          <h3 className="text-xl text-gray-800">错误句子</h3>
          <div className="mt-4">
            <span
              className="text-2xl cursor-pointer"
              onClick={fetchIncorrectSpellings}
            >
              {incorrect.length}
            </span>
          </div>
        </div>
        <div className="p-2 px-4 rounded border">
          <h3 className="text-xl text-gray-800">跳过句子</h3>
          <div className="mt-4 ">
            <span className="text-2xl">{skipped.length}</span>
          </div>
        </div>
        <div className="p-2 px-4 rounded border">
          <h3 className="text-xl text-gray-800">最大连击</h3>
          <div className="mt-4 ">
            <span className="text-2xl">{exam.maxCombo}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamResultPage;
