import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon } from "@ltaoo/icons/outline";

import { jsPDF } from "jspdf";

import Exam from "@/domains/exam";
import axios from "axios";

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

  const createPdf = useCallback(async () => {
    const doc = new jsPDF();
    const paddingX = 12;
    const WIDTH = 206;
    const maxWidth = WIDTH - paddingX - paddingX;
    const x = 12;
    let y = 28;
    doc.setFontSize(24);
    // @ts-ignore
    // await import("https://static.ltaoo.work/SourceHanSansCN-Medium-normal");
    // const font2 = await import("./SourceHanSansCN-Medium-normal");
    const { data: font } = await axios.get(
      "https://static.ltaoo.work/SourceHanSans-Normal.ttf",
      // "https://static.ltaoo.work/simsun.ttf",
      {
        responseType: "stream",
      }
    );
    // var callAddFont = function (name, type = "normal") {
    //   this.addFileToVFS(`SourceHanSansCN-Medium-normal.ttf`, font);
    //   this.addFont(`SourceHanSansCN-Medium-normal.ttf`, name, type);
    //   this.addFileToVFS(`${name}-${type}.ttf`, font);
    //   this.addFont(`${name}-${type}.ttf`, name, type);
    // };
    var callAddFont = function () {
      this.addFileToVFS("SourceHanSansCN-Medium-normal.ttf", font);
      this.addFont(
        "SourceHanSansCN-Medium-normal.ttf",
        "SourceHanSansCN-Medium",
        "normal"
      );
    };
    jsPDF.API.events.push(["addFonts", callAddFont]);
    const fonts = doc.getFontList();
    console.log(fonts);
    // jsPDF.API.events.push([
    //   "addFonts",
    //   () => {
    //     callAddFont("SourceHanSansCN-Medium", "normal");
    //   },
    // ]);
    doc.setFont("SourceHanSansCN-Medium", "normal");

    doc.text("中文", x, y);

    // doc.text("This is the default font.", x, y);
    // y += 12;

    // doc.setFont("courier");
    // doc.text("This is courier normal.", x, y);
    // y += 12;

    // doc.setFont("times", "italic");
    // doc.text("This is times italic.", x, y);
    // y += 12;

    // doc.setFont("helvetica", "bold");
    // doc.text("This is helvetica bold.", x, y);
    // y += 12;

    // doc.setFont("courier", "bolditalic");
    // doc.text("This is courier bolditalic.", x, y);
    // y += 12;
    // doc.text("Hello world", x, y, {
    //   maxWidth,
    // });
    doc.save(`test.pdf`);
  }, []);

  return (
    <div>
      {text1}
      <button onClick={createPdf}>create</button>
    </div>
  );
};

export default Playground;
