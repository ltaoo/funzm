/**
 * @file 字幕展示
 */
import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";

import { fetchCaptionById } from "@/lib/caption";
import { fetchCaption } from "@/services/caption";
import CaptionPreview from "@/components/CaptionPreview";

const CaptionPreviewPage = () => {
  const router = useRouter();

  const [caption, setCaption] = useState(null);

  const fetchCaptionAndSave = useCallback(async (id) => {
    const response = await fetchCaption({ id });
    setCaption(response);
  }, []);

  useEffect(() => {
    fetchCaptionAndSave(router.query.id);
  }, []);

  if (!caption) {
    return null;
  }
  return (
    <div>
      <Head>
        <title>{caption.title}</title>
      </Head>
      <CaptionPreview {...caption} />
    </div>
  );
};

// export const getStaticPaths: GetStaticPaths = async () => {
//   const paths = getAllPostIds();
//   return {
//     paths,
//     fallback: false,
//   };
// };

// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   console.log('getStaticProps', params);
//   const caption = await fetchCaptionById({ id: params.id as string });
//   return {
//     props: {
//       data: caption,
//     },
//   };
// };

export default CaptionPreviewPage;
