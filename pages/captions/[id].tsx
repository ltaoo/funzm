/**
 * @file 字幕详情
 */
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import {
  CogIcon,
  DocumentPdfIcon,
  DocumentDocxIcon,
  DocumentTxtIcon,
  HomeIcon,
  MoonIcon,
  SunIcon,
  TrashIcon,
  XIcon,
  BookOpenIcon,
} from "@ltaoo/icons/outline";
import debounce from "lodash.debounce";

import * as themeToggle from "@/utils/dark";
import { downloadTxt, downloadDocx, downloadPdf } from "@/utils";
import { localdb } from "@/utils/db";
import { parseLocalId } from "@/utils/db/utils";
import { parseCaptionContent } from "@/domains/caption";
import {
  deleteCaptionService,
  fetchCaptionWithoutParagraphsService,
  fetchParagraphsService,
} from "@/services/caption";
import CaptionPreview from "@/components/CaptionPreview";
import Drawer from "@/components/Drawer";
import IconWithTxt from "@/components/IconWithTxt";
import { fetchCurExamSceneByCaption } from "@/services/exam";
import CaptionPreviewSkeleton from "@/components/CaptionPreview/skeleton";

const CaptionProfilePage = () => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [settingVisible, setSettingVisible] = useState<boolean>(false);
  const [caption, setCaption] = useState(null);
  const [paragraphs, setParagraphs] = useState([]);
  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const totalRef = useRef(0);

  const id = parseLocalId(router.query.id) as string;
  const idRef = useRef(id);

  useEffect(() => {
    idRef.current = id;
  }, [id]);

  const fetchCaptionAndSet = useCallback(async (id) => {
    const response = await fetchCaptionWithoutParagraphsService({ id });
    // @ts-ignore
    if (response.content) {
      const paragraphs = parseCaptionContent(
        response.content,
        // @ts-ignore
        response.type
      ).map((paragraph) => {
        return {
          ...paragraph,
          captionId: id,
        };
      });
      localdb.table("paragraphs").bulkAdd(paragraphs);
      const newCaption = { ...response };
      delete newCaption.content;
      localdb.table("captions").put(newCaption, id);
      setParagraphs(paragraphs);
      totalRef.current = paragraphs.length;
      return { idEnd: true, total: paragraphs.length };
    }
    loadingRef.current = true;
    const {
      list: paragraphs,
      total,
      isEnd,
    } = await fetchParagraphsService({
      captionId: id,
      page: pageRef.current,
    });
    loadingRef.current = false;
    pageRef.current += 1;
    totalRef.current = total;
    setCaption(response);
    setParagraphs(paragraphs);
    return { isEnd, total };
  }, []);

  const removeCaption = useCallback(async () => {
    await deleteCaptionService({ id });
    router.replace({
      pathname: "/tip/success",
    });
  }, []);

  useEffect(() => {
    const handler = debounce(async (event) => {
      if (
        document.documentElement.scrollTop +
          document.documentElement.clientHeight +
          200 >=
        document.body.clientHeight
      ) {
        // console.log("load more", loadingRef.current, pageRef.current);
        if (loadingRef.current) {
          return;
        }
        loadingRef.current = true;
        const { isEnd, list: paragraphs } = await fetchParagraphsService({
          captionId: id,
          page: pageRef.current,
        });
        loadingRef.current = false;
        pageRef.current += 1;
        setParagraphs((prev) => {
          return prev.concat(paragraphs);
        });
        if (isEnd) {
          document.removeEventListener("scroll", handler);
          return;
        }
      }
    }, 400);

    fetchCaptionAndSet(id).then(({ isEnd }) => {
      if (isEnd) {
        return;
      }
      document.addEventListener("scroll", handler);
    });
    pageRef.current = 1;
    return () => {
      document.removeEventListener("scroll", handler);
    };
  }, []);

  const startExam = useCallback(async () => {
    const existing = await fetchCurExamSceneByCaption({
      captionId: idRef.current,
    });
    router.push({
      pathname: `/exam/simple/${existing.id}`,
    });
  }, []);

  return (
    <div className="min-h-screen h-full">
      <Head>
        <title>{caption?.title}</title>
      </Head>
      <div className="relative dark:bg-gray-800">
        {caption === null ? (
          <CaptionPreviewSkeleton />
        ) : (
          <CaptionPreview {...caption} paragraphs={paragraphs} />
        )}
        <div className="fixed bottom-40 right-0 hidden space-y-4 md:block">
          <div
            className="group flex items-center py-2 px-4 rounded-l-lg bg-gray-100 cursor-pointer hover:bg-gray-200"
            onClick={() => {
              setSettingVisible(true);
            }}
          >
            {settingVisible ? (
              <XIcon className="w-6 h-6 text-gray-400 group-hover:text-gray-800" />
            ) : (
              <CogIcon className="w-6 h-6 text-gray-400 group-hover:text-gray-800" />
            )}
          </div>
        </div>
        <div className="fixed bottom-26 right-0 hidden space-y-4 md:block">
          <div
            className="group flex items-center py-2 px-4 rounded-l-lg bg-gray-100 cursor-pointer hover:bg-gray-200"
            onClick={() => {
              router.push({
                pathname: "/",
              });
            }}
          >
            <HomeIcon className="w-6 h-6 text-gray-400 group-hover:text-gray-800" />
          </div>
        </div>
        <div className="fixed bottom-12 right-0 hidden space-y-4 md:block">
          <div
            className="group flex items-center py-2 px-4 rounded-l-lg bg-gray-100 cursor-pointer hover:bg-gray-200"
            onClick={startExam}
          >
            <BookOpenIcon className="w-6 h-6 text-gray-400 group-hover:text-gray-800" />
          </div>
        </div>
      </div>
      <Drawer
        visible={settingVisible}
        onCancel={() => {
          setSettingVisible(false);
        }}
      >
        <div>
          <div className="text-xl my-4">主题切换</div>
          <div className="section flex space-x-6">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => {
                themeToggle.lightTheme();
              }}
            >
              <SunIcon className="w-4 h-4 mr-2" />
              浅色
            </div>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => {
                themeToggle.darkTheme();
              }}
            >
              <MoonIcon className="w-4 h-4 mr-2" />
              深色
            </div>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => {
                themeToggle.autoTheme();
              }}
            >
              <MoonIcon className="w-4 h-4 mr-2" />
              自动
            </div>
          </div>
          <hr className="my-8" />
          <div className="text-xl my-4">文件下载</div>
          <div className="section flex space-x-6">
            <IconWithTxt
              icon={DocumentTxtIcon}
              txt="docx"
              onClick={() => {
                downloadTxt({ title: caption?.title, paragraphs });
              }}
            />
            <IconWithTxt
              icon={DocumentDocxIcon}
              txt="docx"
              onClick={() => {
                downloadDocx({ title: caption?.title, paragraphs });
              }}
            />
            <IconWithTxt
              icon={DocumentPdfIcon}
              txt="pdf"
              onClick={() => {
                downloadPdf({ title: caption?.title, paragraphs });
              }}
            />
          </div>
          <hr className="my-8" />
          <div className="text-xl my-4">字幕编辑</div>
        </div>
      </Drawer>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={setOpen}
        >
          <div
            className="min-h-screen text-center md:block md:px-2 lg:px-4"
            style={{ fontSize: 0 }}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>
            <span
              className="hidden md:inline-block md:align-middle md:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              enterTo="opacity-100 translate-y-0 md:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 md:scale-100"
              leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            >
              <div className="absolute bottom-0 md:relative text-base text-left transform transition w-full md:inline-block md:max-w-2xl md:px-4 md:my-8 md:align-middle lg:max-w-4xl">
                <div className="w-full relative items-center rounded-t-xl pt-4 bg-white dark:bg-black pb-8 overflow-hidden sm:px-6 sm:pt-8 md:p-6 md:rounded-md lg:p-8">
                  <div className="w-full min-h-60">
                    <div
                      className="flex items-center py-4 px-6 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                      onClick={removeCaption}
                    >
                      <TrashIcon className="w-6 h-6 mr-2 text-black dark:text-white" />
                      <p className="text-base text-md text-black dark:text-white">
                        Delete
                      </p>
                    </div>
                    <div
                      className="flex items-center py-4 px-6 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                      onClick={() => {
                        themeToggle.toggleTheme();
                      }}
                    >
                      <TrashIcon className="w-6 h-6 mr-2 text-black dark:text-white" />
                      <p className="text-base text-md text-black dark:text-white">
                        Toggle Theme
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default CaptionProfilePage;
