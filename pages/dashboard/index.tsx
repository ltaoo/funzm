/**
 * @file 个人中心
 */
import React, { useEffect, useState } from "react";

import Layout from "@/layouts";
import CaptionUpload from "@/components/CaptionFileUpload";
import CaptionPreview from "@/components/CaptionPreview";
import request from "@/services/request";

const Dashboard = (props) => {
  const { user } = props;

  const [caption, setCaption] = useState(null);

  // console.log("[PAGE]PersonDashboard - render", user);

  if (user === null) {
    return null;
  }

  if (caption) {
    return (
      <Layout>
        <div>
          <CaptionPreview {...caption} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="">
        <CaptionUpload />
      </div>
      <button
        onClick={() => {
          request.post("/api/caption/add");
        }}
      >测试</button>
    </Layout>
  );
};

export default Dashboard;

// export async function getServerSideProps(context) {
//   const session = await getSession(context);
//   return {
//     props: { user: session?.user },
//   };
// }
