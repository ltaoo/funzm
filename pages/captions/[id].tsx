/**
 * @file 字幕展示
 */
import { Fragment, useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import {
  CogIcon,
  DotsHorizontalIcon,
  DotsVerticalIcon,
  TrashIcon,
  XIcon,
} from "@heroicons/react/outline";
import { Paragraph } from ".prisma/client";

import * as themeToggle from "@/utils/dark";
import { fetchCaptionById } from "@/lib/caption";
import {
  fetchCaptionService,
  deleteCaptionService,
  fetchCaptionWithoutParagraphsService,
  fetchParagraphsService,
} from "@/services/caption";
import CaptionPreview from "@/components/CaptionPreview";
import Drawer from "@/components/Drawer";

const CaptionPreviewPage = () => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [settingVisible, setSettingVisible] = useState<boolean>(false);
  const [caption, setCaption] = useState(null);
  const [paragraphs, setParagraphs] = useState([]);

  const { id } = router.query;

  const fetchCaptionAndSave = useCallback(async (id) => {
    const response = await fetchCaptionWithoutParagraphsService({ id });
    setCaption(response);
    const { list: paragraphs } = await fetchParagraphsService({
      captionId: id,
    });
    setParagraphs(paragraphs);
    // setCaption({

    // });
  }, []);

  const removeCaption = useCallback(async () => {
    await deleteCaptionService({ id });
    router.replace({
      pathname: "/tip/success",
    });
  }, []);

  useEffect(() => {
    fetchCaptionAndSave(id);
    const handler = (event) => {
      console.log(document.documentElement.scrollTop);
      console.log(document.documentElement.clientHeight);
      console.log(document.body.clientHeight);
    };
    document.addEventListener("scroll", handler);
    return () => {
      document.removeEventListener("scroll", handler);
    };
  }, []);

  if (!caption) {
    return null;
  }
  return (
    <div className="h-full">
      <Head>
        <title>{caption.title}</title>
      </Head>
      <div className="relative">
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
          {/* <div className="cursor-pointer">
            <DotsHorizontalIcon className="w-6 h-6 text-gray-400 hover:text-gray-800" />
          </div> */}
        </div>
      </div>
      <Drawer
        visible={settingVisible}
        onCancel={() => {
          setSettingVisible(false);
        }}
      >
        <div>
          <div className="section"></div>
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
