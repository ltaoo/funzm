import { getPagePropsFormMarkdown } from "@/lib/book/utils";

import BookPageLayout from "@/components/EnglishBook";

const EnglishGookPage = (props) => {
  const { title, content: paragraphs = [], toc } = props;
  return <BookPageLayout title={title} toc={toc} paragraphs={paragraphs} />;
};

export default EnglishGookPage;

export async function getStaticProps() {
  const filepath = "english/8.md";
  // const filepath = "english/demo.md";
  const props = await getPagePropsFormMarkdown(filepath);
  return {
    props,
  };
}
