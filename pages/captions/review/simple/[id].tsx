/**
 * @file 低难度字幕测验
 */
import { useRef, useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import {
  fetchCaptionWithoutParagraphs,
  fetchParagraphsService,
} from "@/services/caption";
import Exam from "@/domains/exam";
import { createExamService } from "@/services/exam";

const SimpleCaptionExamPage = () => {
  const router = useRouter();

  const [caption, setCaption] = useState(null);
  const idRef = useRef<string>(router.query.id as string);
  useEffect(() => {
    idRef.current = router.query.id as string;
  }, [router]);
  const pageRef = useRef<number>(1);

  const fetchCaptionAndSave = useCallback(async (id) => {
    const response = await fetchCaptionWithoutParagraphs({ id });
    // @ts-ignore
    const { exams } = response;
    if (Array.isArray(exams) && exams.length > 0) {
      const { id } = exams[0];
      router.replace({
        pathname: `/exam/simple/${id}`,
      });
      return;
    }
    setCaption(response);
  }, []);

  const fetchParagraphs = useCallback(async () => {
    const response = await fetchParagraphsService({
      captionId: idRef.current,
      page: pageRef.current,
    });
    pageRef.current += 1;
    return response.list;
  }, []);

  useEffect(() => {
    const { id } = router.query;
    fetchCaptionAndSave(id);
  }, []);

  const startExam = useCallback(async () => {
    const instance = new Exam({});
    const paragraphs = await fetchParagraphs();
    const {
      status,
      combo,
      maxCombo,
      curParagraphId,
      correctParagraphs,
      incorrectParagraphs,
      skippedParagraphs,
    } = instance.start(paragraphs);
    const { id } = await createExamService({
      captionId: idRef.current,
      status,
      combo,
      maxCombo,
      curParagraphId,
      correctParagraphs,
      incorrectParagraphs,
      skippedParagraphs,
    });
    router.replace({
      pathname: `/exam/simple/${id}`,
    });
  }, []);

  if (!caption) {
    return null;
  }

  const { title, count } = caption;

  return (
    <div className="h-screen bg-cool-gray-50 dark:bg-gray-800">
      <Head>
        <title>{title}</title>
      </Head>
      <div className="h-full overflow-hidden pb-20 xl:mx-auto xl:w-180">
        <div className="text-center">
          <h2 className="mt-6 px-4 text-2xl break-all text-black dark:text-white break-all">
            {title}
          </h2>
          <div className="mt-12 mx-auto w-80 p-4 bg-white rounded shadow-md">
            共{count}句
          </div>
          <div className="mt-12 btn mx-auto" onClick={startExam}>
            开始
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleCaptionExamPage;
