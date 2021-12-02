/**
 * @file 字幕展示
 */
import { Fragment, useCallback, useEffect, useState } from "react";
import cx from "classnames";
import Head from "next/head";
import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/outline";
import * as diff from "diff";

import { fetchCaptionById } from "@/lib/caption";
import { fetchCaption } from "@/services/caption";
import CaptionPreview from "@/components/CaptionPreview";

import { splitText2 } from "@/domains/caption/utils";

function findMaxLengthArr(arr1, arr2) {
  const l1 = arr1.length;
  const l2 = arr2.length;
  if (l1 > l2) {
    return arr1;
  }
  return arr2;
}

interface DiffNode {
  count: number;
  value: string;
  removed?: boolean;
  added?: boolean;
}
function compareInputting(inputting, originalContent) {
  const cleanInputting = Object.keys(inputting)
    .filter((line) => {
      return !!inputting[line];
    })
    .map((line) => {
      return {
        [line]: inputting[line],
      };
    })
    .reduce((total, cur) => ({ ...total, ...cur }), {});

  const errors = {};

  const lines = Object.keys(cleanInputting);
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    errors[line] = null;
    const inputtingParagraph = inputting[line];
    const content = originalContent[line];

    const diffNodes: DiffNode[] = diff.diffWords(
      content.trimRight(),
      inputtingParagraph.trimRight(),
      {
        newlineIsToken: true,
        ignoreWhitespace: false,
        ignoreCase: false,
      }
    );

    if (diffNodes !== null) {
      const errorNodes = diffNodes.filter((node) => {
        const { added, removed } = node;
        return added === true || removed === true;
      });
      if (errorNodes.length !== 0) {
        errors[line] = errors[line] || [];
        errors[line] = diffNodes;
      }
    }

    // const words = splitText2(inputtingParagraph);
    // const originalWords = splitText2(content);
    // const maxLengthWords = findMaxLengthArr(words, originalWords);
    // maxLengthWords.map(([, word1], i) => {
    //   const [, word2] = words[i] || [];
    //   errors[line] = errors[line] || [];

    //   // 输入的比原文更长
    //   if (word2 === undefined && maxLengthWords === words) {
    //     // 此时 word2 是输入
    //     errors[line].push({
    //       added: true,
    //       // inputting: word1,
    //       word1,
    //       word2,
    //     });
    //   }
    //   // 输入的比原文更短
    //   if (word2 === undefined && maxLengthWords === originalWords) {
    //     // 此时 word2 是原文
    //     errors[line].push({
    //       removed: true,
    //       word1,
    //       word2,
    //     });
    //   }

    //   // 和原文不同
    //   if (word1 !== word2) {
    //     errors[line].push({
    //       updated: true,
    //       word1,
    //       word2,
    //     });
    //     return;
    //   }
    //   errors[line].push({
    //     word1,
    //     word2,
    //   });
    // });
  }
  return errors;
}

const CaptionPreviewPage = () => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [caption, setCaption] = useState(null);
  const [inputting, setInputting] = useState({});
  const [errors, setErrors] = useState({});
  const [curErrorLine, setCurErrorLine] = useState(null);

  const fetchCaptionAndSave = useCallback(async (id) => {
    const response = await fetchCaption({ id });
    setCaption(response);
  }, []);

  useEffect(() => {
    fetchCaptionAndSave(router.query.id);
  }, []);

  const compare = useCallback(() => {
    const { paragraphs } = caption;
    const originalContent = paragraphs
      .filter((paragraph) => {
        return !!paragraph.text2;
      })
      .reduce((total, cur) => {
        const { line } = cur;
        return {
          ...total,
          [line]: cur.text2,
        };
      });
    const errors = compareInputting(inputting, originalContent);
    console.log(errors);
    setErrors(errors);
  }, [inputting, caption]);

  if (!caption) {
    return null;
  }
  const { title, paragraphs } = caption;
  return (
    <div className="bg-cool-gray-50 dark:bg-gray-800">
      <Head>
        <title>{caption.title}</title>
      </Head>
      <div className="overflow-hidden pb-20 space-y-2 xl:mx-auto xl:w-180 ">
        <h2 className="mt-6 px-4 text-2xl break-all text-black dark:text-white break-all">
          {title}
        </h2>
        <div className="mt-10 px-4 space-y-6">
          {paragraphs.map((caption) => {
            const { line, text1, text2 } = caption;
            return (
              <div key={line}>
                <p className="text-xs text-black dark:text-white">{text1}</p>
                <p className="relative mt-2 break-all text-lg font-serif text-black dark:text-white">
                  <input
                    className={cx(
                      "w-full border-b-1 outline-none bg-transparent",
                      errors[line] ? "!border-red-500" : ""
                    )}
                    onChange={(event) => {
                      const { value } = event.target;
                      setInputting((prev) => {
                        return {
                          ...prev,
                          [line]: value,
                        };
                      });
                    }}
                  />
                  <div
                    className={cx(
                      errors[line] ? "block" : "hidden",
                      "absolute top-0 right-0"
                    )}
                  >
                    <span
                      className="text-red-500 cursor-pointer"
                      onClick={() => {
                        setOpen(true);
                        setCurErrorLine(line);
                      }}
                    >
                      error
                    </span>
                  </div>
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-end sticky bottom-0 py-4 px-4 bg-white dark:bg-black space-x-2 border-t-1 dark:border-gray-800">
        <p
          className="text-base text-sm cursor-pointer text-black dark:text-white"
          onClick={compare}
        >
          Submit
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
                    {(() => {
                      if (curErrorLine === null) {
                        return null;
                      }
                      if (errors[curErrorLine] === null) {
                        return null;
                      }
                      const errNodes = errors[curErrorLine];
                      const elms = [];
                      for (let i = 0; i < errNodes.length; i += 1) {
                        const { added, updated, removed, value } = errNodes[i];
                        elms.push(
                          <span
                            className={cx(
                              "text-base text-xl",
                              added
                                ? "!text-green-500"
                                : removed
                                ? "!text-red-500"
                                : "!text-gray-500"
                            )}
                          >
                            {value}
                          </span>
                        );
                      }
                      return <p className="">{elms}</p>;
                    })()}
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
