/**
 * @file 单词翻译面板
 */
import { useCallback, useState } from "react";

import { translateService } from "@/services/youdao";
import Modal from "@/components/Modal";
import SoundPlay from "@/components/SoundPlay";
import { DocumentAddIcon } from "@ltaoo/icons/outline";
import { addWordService } from "@/services/word";

const TranslatePanel = (props) => {
  const { visible, onCancel } = props;

  const [keyword, setKeyword] = useState("");
  const [resp, setResp] = useState(null);
  const [error, setError] = useState(false);

  const translate = useCallback(async () => {
    const resp = await translateService(keyword);
    if (resp === null) {
      return setError(true);
    }
    setResp(resp);
    setError(false);
  }, [keyword]);

  const addToNote = useCallback((w) => {
    return async () => {
      await addWordService({ word: w });
      alert("添加成功");
    };
  }, []);

  return (
    <Modal visible={visible} onCancel={onCancel}>
      <div className="w-160">
        <input
          className="py-1 px-2 border border-solid border-gray-800 rounded-l outline-0"
          value={keyword}
          placeholder="请输入要翻译的单词"
          onChange={(event) => setKeyword(event.target.value)}
        />
        <button
          className="py-1 px-4 border border-solid border-gray-800 text-gray-100 bg-gray-800 rounded-r"
          onClick={translate}
        >
          翻译
        </button>
      </div>
      {error && (
        <div className="mt-8 text-gray-500">
          查询结果为空，请检查单词是否拼写正确
        </div>
      )}
      {resp !== null && (
        <div className="min-h-32">
          <div className="flex items-center relative mt-8 pr-12">
            <div className="break-all text-3xl font-serif text-gray-800">
              {resp.word}
            </div>
            <DocumentAddIcon
              className="inline-block mt-1 ml-4 w-5 h-5 text-gray-500 cursor-pointer"
              onClick={addToNote(resp.word)}
            />
          </div>
          <div className="mt-2 text-sm">
            <div className="text-gray-500">英 [{resp.speeches.en}]</div>
            <div className="text-gray-500">美 [{resp.speeches.am}]</div>
          </div>
          <div className="w-160">
            {resp.parts.map((p) => {
              const { type, means } = p;
              return (
                <div className="flex mt-2">
                  <div className="mr-2 text-gray-300">{type}</div>
                  <div className="text-gray-500 break-all">{means}</div>
                </div>
              );
            })}
          </div>
          <hr className="mt-4" />
          <div className="mt-4 text-gray-500">{resp.memory_skill}</div>
        </div>
      )}
    </Modal>
  );
};

export default TranslatePanel;
