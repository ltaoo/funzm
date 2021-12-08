import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/outline";

import Exam from "@/domains/exam";

const Playground = () => {
  const examRef = useRef<Exam>(null);
  const [text1, setText1] = useState("");
  const [words, setWords] = useState([]);
  const [visible, setVisible] = useState(false);

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
          setVisible(true);
          setTimeout(() => {
            setVisible(false);
          }, 1000);
        }}
      >
        skip
      </button>
      <Transition.Root show={visible} as={Fragment}>
        <div>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <p className="absolute right-10 top-10 text-4xl text-green-500 transform -rotate-6">
              CORRECT!
            </p>
          </Transition.Child>
        </div>
      </Transition.Root>
    </div>
  );
};

export default Playground;
