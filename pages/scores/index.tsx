/**
 * @file 积分记录列表
 */

import { useCallback, useEffect, useState } from "react";

import { fetchScoreRecordsService } from "@/services";
import Layout from "@/layouts";

const ScoreRecordsPage = () => {
  const [records, setRecords] = useState([]);

  const fetchScoreRecordsAndSet = useCallback(async () => {
    const response = await fetchScoreRecordsService();
    // @ts-ignore
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
            const { created_at, desc, type, number } = record;
            return (
              <div className="py-2 px-4">
                <div className="flex items-center justify-between">
                  <div className="text-gray-500">{created_at}</div>
                  <div className="text-2xl">{number}</div>
                </div>
                <div className="mt-2 text-gray-300 text-sm">{desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default ScoreRecordsPage;
