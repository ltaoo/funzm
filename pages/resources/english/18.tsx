import { getPagePropsFormMarkdown } from "@/lib/book/utils";

import BookPageLayout from "@/components/EnglishBook";

const EnglishGookPage = (props) => {
  const { content: paragraphs = [], toc } = props;
  return <BookPageLayout toc={toc} paragraphs={paragraphs} />;
};

export default EnglishGookPage;

export async function getStaticProps() {
  const filepath = "english/18.md";
  // const filepath = "english/demo.md";
  const props = await getPagePropsFormMarkdown(filepath);
  return {
    props,
  };
}