import { useCallback, useEffect, useRef, useState } from "react";

import { DocumentAddIcon } from "@ltaoo/icons/outline";

import { addWordService } from "@/services/word";
import { translateService } from "@/services/youdao";
import Modal from "@/components/Modal";

const cachedTranslateResult = {};

const WordCard = (props) => {
  const { keyword, extraBody = {}, visible, onCancel } = props;

  const [resp, setResp] = useState<null | {
    word: string;
    parts: {
      type: string;
      means: string;
    }[];
    speeches: {
      en: string;
      am: string;
    };
    memory_skill: string;
  }>(null);
  const [error, setError] = useState(false);
  const loadingRef = useRef(false);

  const translate = useCallback(async (keyword) => {
    if (loadingRef.current) {
      return;
    }
    loadingRef.current = true;
    if (cachedTranslateResult[keyword]) {
      setResp(cachedTranslateResult[keyword]);
      return;
    }
    const resp = await translateService(keyword);
    loadingRef.current = false;
    if (resp === null) {
      setResp(null);
      return setError(true);
    }
    cachedTranslateResult[keyword] = resp;
    setResp(resp);
    setError(false);
  }, []);

  useEffect(() => {
    if (visible) {
      translate(keyword);
    }
  }, [visible, keyword]);

  const addToNote = useCallback(
    (w) => {
      return async () => {
        if (loadingRef.current) {
          return;
        }
        loadingRef.current = true;
        setTimeout(() => {
          loadingRef.current = false;
        }, 1000);
        await addWordService({ ...extraBody, word: w });
        alert("加入生词本成功");
      };
    },
    [extraBody]
  );
  return (
    <Modal visible={visible} onCancel={onCancel}>
      <div className="w-120">
        {error && <div>搜索结果为空，请检查单词是否拼写正确</div>}
        {resp && (
          <div>
            <div className="flex items-center justify-between relative">
              <div className="flex-1 w-48 break-all text-3xl text-gray-800">
                {resp.word}
              </div>
              <div className="w-8" onClick={() => {}}>
                <DocumentAddIcon
                  className="mt-1 w-6 h-6"
                  color="#212936"
                  onClick={addToNote(resp.word)}
                />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-gray-500">英 [{resp.speeches.en}]</div>
              <div className="text-gray-500">美 [{resp.speeches.am}]</div>
            </div>
            {resp.parts.map((p, index) => {
              return (
                <div key={index} className="flex mt-2">
                  <div className="mr-2 text-gray-300">{p.type}</div>
                  <div className="text-gray-500">{p.means}</div>
                </div>
              );
            })}
            <div className="mt-4 text-gray-500">{resp.memory_skill}</div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default WordCard;
