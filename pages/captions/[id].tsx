/**
 * @file 字幕详情
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  CogIcon,
  DocumentPdfIcon,
  DocumentDocxIcon,
  DocumentTxtIcon,
  TrashIcon,
  XIcon,
  BookOpenIcon,
  PencilAltIcon,
} from "@ltaoo/icons/outline";

import useHelper from "@list/hooks";

import Layout from "@/layouts";
import { downloadTxt, downloadDocx, downloadPdf } from "@/utils";
import {
  deleteCaptionService,
  fetchCaptionProfileService,
  fetchParagraphsService,
} from "@/domains/caption/services";
import CaptionPreview from "@/components/CaptionPreview";
import CaptionPreviewSkeleton from "@/components/CaptionPreview/skeleton";
import Drawer from "@/components/Drawer";
import IconWithTxt from "@/components/IconWithTxt";
import ScrollView from "@/components/ScrollView";
import Confirm from "@/components/Confirm";
import { addNoteService, updateNoteService } from "@/services/note";

const CaptionProfilePage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const [{ dataSource, initial, noMore }, helper] = useHelper(
    fetchParagraphsService,
    {
      search: {
        with_notes: true,
      },
    }
  );
  const [settingVisible, setSettingVisible] = useState<boolean>(false);
  const [caption, setCaption] = useState(null);

  const idRef = useRef(id);

  useEffect(() => {
    idRef.current = id;
  }, [id]);

  useEffect(() => {
    if (id && initial) {
      fetchCaptionProfileService({ id }).then((resp) => {
        setCaption(resp);
      });
      helper.init({
        captionId: id,
      });
    }
  }, [id]);

  const startExam = useCallback(async () => {
    router.push({
      pathname: `/exam/prepare/${id}`,
    });
  }, [id]);

  const deleteCaption = useCallback(async () => {
    await deleteCaptionService({ id });
    router.replace({
      pathname: "/tip/success",
    });
  }, []);

  return (
    <Layout title={caption?.title}>
      <ScrollView noMore={noMore} onLoadMore={helper.loadMore}>
        <div className="">
          {(() => {
            if (initial) {
              return <CaptionPreviewSkeleton />;
            }
            return (
              <CaptionPreview
                {...caption}
                paragraphs={dataSource}
                onUpdateNote={async (
                  { id: i, content, text, start, end },
                  record
                ) => {
                  if (i) {
                    await updateNoteService({
                      id: i,
                      content,
                    });
                    helper.modifyItem({
                      ...record,
                      ...record,
                      notes: record.notes?.map((n) => {
                        if (n.id === i) {
                          return {
                            ...n,
                            content,
                          };
                        }
                        return n;
                      }),
                    });
                  } else {
                    const created = await addNoteService({
                      content,
                      text,
                      start,
                      end,
                      paragraphId: record.id,
                    });
                    helper.modifyItem({
                      ...record,
                      notes: record.notes?.concat(created),
                    });
                  }
                }}
              />
            );
          })()}

          <div className="fixed bottom-20 right-10 py-4 space-y-2 bg-gray-800 rounded-xl shadow-xl">
            <a href={`/captions/editor/${id}`}>
              <div className="group flex items-center py-2 px-4 cursor-pointer">
                <PencilAltIcon className="w-6 h-6 text-gray-200" />
              </div>
            </a>
            <div
              className="group flex items-center py-2 px-4 cursor-pointer"
              onClick={startExam}
            >
              <BookOpenIcon className="w-6 h-6 text-gray-200" />
            </div>
            <div className="group flex items-center py-2 px-4 cursor-pointer">
              <Confirm
                title="提示"
                content="确认删除该字幕吗？"
                onOk={deleteCaption}
              >
                <TrashIcon className="w-6 h-6 text-gray-200" />
              </Confirm>
            </div>
            <div
              className="group flex items-center py-2 px-4 cursor-pointer"
              onClick={() => {
                setSettingVisible(true);
              }}
            >
              {settingVisible ? (
                <XIcon className="w-6 h-6 text-gray-200" />
              ) : (
                <CogIcon className="w-6 h-6 text-gray-200" />
              )}
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
            <div className="text-xl my-4">文件下载</div>
            <div className="section flex space-x-6">
              <IconWithTxt
                icon={DocumentTxtIcon}
                txt="docx"
                onClick={() => {
                  downloadTxt({
                    title: caption?.title,
                    paragraphs: dataSource,
                  });
                }}
              />
              <IconWithTxt
                icon={DocumentDocxIcon}
                txt="docx"
                onClick={() => {
                  downloadDocx({
                    title: caption?.title,
                    paragraphs: dataSource,
                  });
                }}
              />
              <IconWithTxt
                icon={DocumentPdfIcon}
                txt="pdf"
                onClick={() => {
                  downloadPdf({
                    title: caption?.title,
                    paragraphs: dataSource,
                  });
                }}
              />
            </div>
          </div>
        </Drawer>
      </ScrollView>
    </Layout>
  );
};

export default CaptionProfilePage;
