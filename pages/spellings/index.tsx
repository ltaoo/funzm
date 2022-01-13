/**
 * @file 积分记录列表
 */

import { useCallback, useEffect, useState } from "react";

import Layout from "@/layouts";
import { fetchSpellingsService } from "@/services/spellings";
import { SpellingResultType } from "@/domains/exam/constants";
import { ISpellingRes } from "@/domains/exam/types";

const ScoreRecordsPage = () => {
  const [records, setRecords] = useState<ISpellingRes[]>([]);

  const fetchScoreRecordsAndSet = useCallback(async () => {
    const response = await fetchSpellingsService({ page: 1, status: SpellingResultType.Incorrect });
    setRecords(response.list);
  }, []);

  useEffect(() => {
    fetchScoreRecordsAndSet();
  }, []);

  return (
    <Layout>
      <div className="px-2">
        <div className="bg-white rounded space-y-4 divide-y-1">
          {records.map((record) => {
            const { created_at, type, input, paragraph } = record;
            return (
              <div className="py-2 px-4">
                <div>
                  <div className="text1">{paragraph.text2}</div>
                  <div className="text1">{input}</div>
                </div>
                <div className="flex items-center justify-between"></div>
                <div>{type}</div>
                <div>{created_at}</div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default ScoreRecordsPage;
