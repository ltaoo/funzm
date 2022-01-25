import { useCallback, useState } from "react";

import Modal from "@/components/Modal";
import { useVisible } from "@/hooks";
import { translateService } from "@/services/youdao";

const TranslatePanel = (props) => {
  const { children } = props;

  const [keyword, setKeyword] = useState("");
  const [explains, setExplains] = useState([]);
  const [speeches, setSpeeches] = useState([]);
  const [visible, show, hide] = useVisible();

  const translate = useCallback(async () => {
    const resp = await translateService(keyword);
    //     console.log(resp);
    setExplains(resp.explains);
    setSpeeches(resp.speeches);
  }, [keyword]);

  return (
    <span>
      <span onClick={show}>{children}</span>
      <Modal visible={visible} onCancel={hide}>
        <div>
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
        <div className="mt-4">
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
        </div>
        <div className="mt-4 space-y-2">
          {explains.map((explain, i) => {
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
      </Modal>
    </span>
  );
};

export default TranslatePanel;
