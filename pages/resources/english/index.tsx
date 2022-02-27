import { getPagePropsFormMarkdown, getWholeToc } from "@/lib/book/utils";

import BookPageLayout from "@/components/EnglishBook";

const EnglishGookPage = (props) => {
  const { content: paragraphs = [], toc, isIndex, wholeToc } = props;
  return (
    <BookPageLayout
      toc={isIndex ? { children: wholeToc } : toc}
      paragraphs={paragraphs}
    />
  );
};

export default EnglishGookPage;

export async function getStaticProps() {
  const filepath = "english/index.md";
  // const filepath = "english/demo.md";
  const props = await getPagePropsFormMarkdown(filepath);
  return {
    props,
  };
}
