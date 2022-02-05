import { useState, useCallback } from "react";

import { IParagraphValues } from "@/domains/caption/types";
import { splitText2Words } from "@/domains/caption/utils";
import { useVisible } from "@/hooks";
import TranslateModal from "@/components/TranslatePanel";

interface IProps {
  dataSource?: (IParagraphValues & { input?: string })[];
}
const Paragraphs: React.FC<IProps> = (props) => {
  const { dataSource = [] } = props;

  const [visible, show, hide] = useVisible();
  const [keyword, setKeyword] = useState<string | null>(null);
  const [curParagraph, setParagraph] = useState<IParagraphValues | null>(null);

  const splitText2 = useCallback((paragraph: IParagraphValues) => {
    const { text2 } = paragraph;
    const elements = splitText2Words(text2);
    return elements.map(([prefix, word, suffix], index) => {
      return (
        <>
          <div className="inline-block">{prefix}</div>
          <div
            className="inline-block"
            onClick={() => {
              setKeyword(word);
              setParagraph(paragraph);
              show();
            }}
          >
            {word}
          </div>
          <div className="inline-block">{suffix}</div>
          {index !== elements.length - 1 && (
            <div className="inline-block" style={{ marginRight: 5 }}></div>
          )}
        </>
      );
    });
  }, []);

  return (
    <div className="">
      {dataSource.map((paragraph) => {
        const { line, input, text1 } = paragraph;
        return (
          <div className="mb-6" key={line}>
            <div className="text-sm text-gray-400">{text1}</div>
            <div className="text-2xl font-serif text-gray-800">
              {splitText2(paragraph)}
            </div>
            {input && (
              <div className="text-gray-500">
                <span className="text-sm text-gray-300">你的输入：</span>
                {input}
              </div>
            )}
          </div>
        );
      })}

      <TranslateModal
        visible={visible}
        extraBody={{
          paragraph_id: curParagraph?.id,
        }}
        keyword={keyword}
        onCancel={hide}
      />
    </div>
  );
};

export default Paragraphs;
