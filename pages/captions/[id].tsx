/**
 * @file 字幕展示
 */
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import {
  CogIcon,
  DocumentIcon,
  HomeIcon,
  MoonIcon,
  SunIcon,
  TrashIcon,
  XIcon,
} from "@heroicons/react/outline";
import debounce from "lodash.debounce";
import { saveAs } from "file-saver";
import { Packer, Document, Paragraph, TextRun } from "docx";
import { jsPDF } from "jspdf";

import * as themeToggle from "@/utils/dark";
import {
  deleteCaptionService,
  fetchCaptionWithoutParagraphsService,
  fetchParagraphsService,
} from "@/services/caption";
import CaptionPreview from "@/components/CaptionPreview";
import Drawer from "@/components/Drawer";
import { parseCaptionContent } from "@/domains/caption";
import { localdb } from "@/utils/db";
import { parseLocalId } from "@/utils/db/utils";

function getWidthAndHeight(text, doc, { maxWidth }) {
  // const size = doc.getFontSize();
  // 检测中英文？
  const { w, h } = doc.getTextDimensions(text.slice(0, 1));
  if (text.length * w > maxWidth) {
    let lines = Math.floor((text.length * w) / maxWidth);
    if ((text.length * w) % maxWidth !== 0) {
      lines += 1;
    }
    // console.log("lines", w, h, maxWidth, text, lines);
    return {
      w: maxWidth,
      h: lines * h,
      lines,
    };
  }
  return {
    w: text.length * w,
    h,
    lines: 1,
  };
  // text.length * w
}

const CaptionPreviewPage = () => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [settingVisible, setSettingVisible] = useState<boolean>(false);
  const [caption, setCaption] = useState(null);
  const [paragraphs, setParagraphs] = useState([]);
  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const wordLoadingRef = useRef<boolean>(false);
  const pdfLoadingRef = useRef<boolean>(false);

  const id = router.query.id as string;

  const fetchCaptionAndSave = useCallback(async (id) => {
    const response = await fetchCaptionWithoutParagraphsService({ id });
    setCaption(response);
    // @ts-ignore
    if (response.content) {
      const paragraphs = parseCaptionContent(
        response.content,
        // @ts-ignore
        response.type
      ).map((paragraph) => {
        return {
          ...paragraph,
          captionId: parseLocalId(id),
        };
      });
      localdb.table("paragraphs").bulkAdd(paragraphs);
      const newCaption = { ...response };
      delete newCaption.content;
      localdb.table("captions").put(newCaption, parseLocalId(id));
      setParagraphs(paragraphs);
      return { idEnd: true };
    }
    loadingRef.current = true;
    const { list: paragraphs, isEnd } = await fetchParagraphsService({
      captionId: id,
      page: pageRef.current,
    });
    loadingRef.current = false;
    pageRef.current += 1;
    setParagraphs(paragraphs);
    return { isEnd };
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
    fetchCaptionAndSave(id).then(({ isEnd }) => {
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

  const downloadDocx = useCallback((title, paragraphs) => {
    if (wordLoadingRef.current) {
      return;
    }
    wordLoadingRef.current = true;
    const texts = paragraphs
      .map((paragraph, index) => {
        const { text1 = "", text2 = "" } = paragraph;
        return [
          // 中文
          new Paragraph({
            children: [
              new TextRun({
                text: text1,
                color: "#9da3ae",
                size: 24,
              }),
            ],
          }),
          // 英文
          new Paragraph({
            children: [
              new TextRun({
                text: text2,
                size: 36,
              }),
            ],
          }),
          index === paragraphs.length - 1
            ? null
            : new Paragraph({
                text: "\n",
              }),
        ];
      })
      .reduce((result, cur) => result.concat(cur), [])
      .filter(Boolean);
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              // 字幕标题
              children: [
                new TextRun({
                  text: title,
                  size: 48,
                }),
              ],
            }),
            // 换行
            new Paragraph({
              text: "\n",
            }),
            ...texts,
          ],
        },
      ],
    });
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `${title}.docx`);
      wordLoadingRef.current = false;
    });
  }, []);

  const downloadPDF = useCallback(async (title, paragraphs) => {
    // console.log(response);
    if (pdfLoadingRef.current) {
      return;
    }
    pdfLoadingRef.current = true;
    const doc = new jsPDF();
    doc.addFont(
      "https://static.ltaoo.work/SourceHanSans-Normal.ttf",
      "SourceHanSans",
      "normal"
    );
    const paddingX = 12;
    const WIDTH = 206;
    const maxWidth = WIDTH - paddingX - paddingX;
    const x = 12;
    let y = 28;
    doc.setFontSize(24);
    doc.text(title, x, y, {
      maxWidth,
    });

    y += 42;

    paragraphs.forEach((paragraph) => {
      const { text1 = "", text2 = "" } = paragraph;
      doc.setTextColor("#9da3ae");
      doc.setFontSize(12);

      doc.setFont("SourceHanSans");
      if (y > 294 - paddingX) {
        doc.addPage();
        y = 24;
      }
      doc.text(text1, x, y, {
        maxWidth,
      });
      const { h: text1h, lines: text1l } = getWidthAndHeight(text1, doc, {
        maxWidth,
      });
      // 中英文边距
      y += 4 + text1h + (text1l > 1 ? 4 : 0);
      doc.setFontSize(18);
      doc.setTextColor("#000000");
      doc.setFont("Helvetica");
      if (y > 294 - paddingX) {
        doc.addPage();
        y = 24;
      }
      doc.text(text2, x, y, {
        maxWidth,
      });
      const { h: text2h, lines: text2l } = getWidthAndHeight(text2, doc, {
        maxWidth,
      });
      y += 12 + text2h + (text2l > 1 ? 4 : 0);
    });

    doc.setProperties({
      title,
      author: "funzm",
      keywords: "caption, funzm",
      creator: "funzm",
    });
    doc.save(`${title}.pdf`);
    pdfLoadingRef.current = false;
  }, []);

  if (!caption) {
    return null;
  }
  const { title } = caption;
  return (
    <div className="h-full">
      <Head>
        <title>{title}</title>
      </Head>
      <div className="relative dark:bg-gray-800">
        <CaptionPreview {...caption} paragraphs={paragraphs} />
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
          <hr className="mt-8" />
          <div className="text-xl my-4">文件下载</div>
          <div className="section flex space-x-6">
            <div
              className="flex items-center text-base text-gray-600 cursor-pointer hover:text-green-500"
              onClick={() => {
                downloadDocx(title, paragraphs);
              }}
            >
              <DocumentIcon className="w-4 h-4 mr-2" />
              docx
            </div>
            <div
              className="flex items-center text-base text-gray-600 cursor-pointer hover:text-green-500"
              onClick={() => {
                downloadPDF(title, paragraphs);
              }}
            >
              <DocumentIcon className="w-4 h-4 mr-2" />
              pdf
            </div>
          </div>
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

export default CaptionPreviewPage;
