/**
 * @file 单词翻译面板
 */
import { useCallback, useState } from "react";

import { translateService } from "@/services/youdao";
import Modal from "@/components/Modal";
import SoundPlay from "@/components/SoundPlay";

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

  return (
    <Modal visible={visible} onCancel={onCancel}>
      <div className="w-120">
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
      {/* <div className="mt-4">
        <div className="inline-block space-x-4 text-gray-800">
          {speeches.map((sp) => {
            const { text } = sp;
            return (
              <span>
                {keyword}[{text}]
              </span>
            );
          })}
        </div>
        <div className="inline-block ml-6 mt-2 text-gray-800 cursor-pointer">
          加入生词本
        </div>
      </div> */}
      {error && (
        <div className="mt-8 text-gray-500">
          查询结果为空，请检查单词是否拼写正确
        </div>
      )}
      {resp !== null && (
        <div className="mt-8">
          <div className="text-gray-800">{resp.memory_skill}</div>
          <div className="mt-4 space-y-2">
            {resp.explains.map((explain, i) => {
              return (
                <div
                  key={i}
                  className="py-2 px-4 text-sm text-gray-500 bg-gray-100 rounded"
                >
                  {explain}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default TranslatePanel;
