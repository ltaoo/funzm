import Exam from "@/domains/exam";
import { useEffect, useRef, useState } from "react";

const Playground = () => {
  const examRef = useRef<Exam>(null);
  const [text1, setText1] = useState("");
  const [words, setWords] = useState([]);

  useEffect(() => {
    examRef.current = new Exam({
      title: "测试",
      paragraphs: [
        {
          id: "1",
          text1: "我一直喜欢火车",
          text2: "I've always loved trains.",
        },
        {
          id: "2",
          text1: "事实上",
          text2: "In fact,",
        },
        {
          id: "3",
          text1: "如果我在理论物理上的事业没有成果",
          text2: "if my career in theoretical hadn't worked out.",
        },
        {
          id: "4",
          text1: "我的后备计划是",
          text2: "my backup plan",
        },
        {
          id: "5",
          text1: "成为一个职业检票员",
          text2: "was to become a professional ticket taker.",
        },
        {
          id: "6",
          text1: "或者流浪汉",
          text2: "Or hobo.",
        },
        {
          id: "7",
          text1: "谢礼，晚饭好了",
          text2: "Shelly, dinner's ready!",
        },
      ],
    });
    //     setText1(examRef.current.curParagraph.text1);
    // @ts-ignore
    window._exam = examRef.current;
  }, []);

  return (
    <div>
      {text1}
      <button
        onClick={() => {
          if (!examRef.current) {
            return;
          }
          examRef.current.start([]);
          setText1(examRef.current.curParagraph.text1);
        }}
      >
        Start
      </button>
      <button
        onClick={() => {
          if (!examRef.current) {
            return;
          }
          const error = examRef.current.skip();
          console.log(error);
          if (error) {
            return;
          }
          setText1(examRef.current.curParagraph.text1);
          setWords(examRef.current.curWords);
        }}
      >
        skip
      </button>
    </div>
  );
};

export default Playground;
