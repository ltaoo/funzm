/**
 * @file 字幕展示
 */
import { Fragment, useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/outline";

import { fetchCaptionById } from "@/lib/caption";
import { fetchCaption } from "@/services/caption";
import CaptionPreview from "@/components/CaptionPreview";
import * as themeToggle from "@/utils/dark";

const CaptionPreviewPage = () => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [caption, setCaption] = useState(null);

  const { id } = router.query;

  const fetchCaptionAndSave = useCallback(async (id) => {
    const response = await fetchCaption({ id });
    setCaption(response);
  }, []);

  useEffect(() => {
    fetchCaptionAndSave(id);
  }, []);

  if (!caption) {
    return null;
  }
  return (
    <div className="bg-cool-gray-50 dark:bg-gray-800">
      <Head>
        <title>{caption.title}</title>
      </Head>
      <CaptionPreview {...caption} />
      <div className="flex justify-end sticky bottom-0 py-4 px-4 bg-white dark:bg-black space-x-2 border-t-1 dark:border-gray-800">
        <p
          className="text-base text-sm cursor-pointer text-black dark:text-white"
          onClick={() => {
            router.push({
              pathname: `/captions/review/${id}`,
            });
          }}
        >
          Review
        </p>
        <p
          className="text-base text-sm cursor-pointer text-black dark:text-white"
          onClick={() => {
            setOpen(true);
          }}
        >
          More
        </p>
      </div>
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
                    <div className="flex items-center py-4 px-6 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
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

// export const getStaticPaths: GetStaticPaths = async () => {
//   const paths = getAllPostIds();
//   return {
//     paths,
//     fallback: false,
//   };
// };

// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   console.log('getStaticProps', params);
//   const caption = await fetchCaptionById({ id: params.id as string });
//   return {
//     props: {
//       data: caption,
//     },
//   };
// };

export default CaptionPreviewPage;
