import Head from "next/head";

import { renderToc, renderer } from "./utils";

const BookPageLayout = (props) => {
  const { title = "", paragraphs = [], toc } = props;

  return (
    <div className="flex mt-4 px-8 pb-12 text-gray-800">
      <Head>
        <title>《旋元佑文法进阶》- {title}</title>
      </Head>
      <div className="fixed left-4 overflow-y-auto top-8 p-8 w-60 h-160">
        <div className="mt-2">
          <a href="/resources/english">《旋元佑文法进阶》</a>
        </div>
        <div className="mt-4">{renderToc(toc.children)}</div>
      </div>
      <div className="pl-60">
        {paragraphs.map((node, i) => {
          return renderer(node, i);
        })}
      </div>
    </div>
  );
};

export default BookPageLayout;
