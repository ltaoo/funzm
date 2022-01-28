import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon } from "@ltaoo/icons/outline";

import { jsPDF } from "jspdf";

import axios from "axios";

const Playground = () => {
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
      <button onClick={createPdf}>create</button>
    </div>
  );
};

export default Playground;
