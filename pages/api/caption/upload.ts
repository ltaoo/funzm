import path from "path";

import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

import { ensureLogin, resp } from "@/lib/utils";
import { parseCaptionContent } from "@/domains/caption";

export default async function provideAddCaptionFromCaptionUrlService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await ensureLogin(req, res);

  const { url } = req.query as { url: string };

  const { data } = await axios.get(url);

  const { ext } = path.parse(url);
  const caption = await parseCaptionContent(
    data,
    ext.replace(".", "") as CaptionFileType
  );

  resp(caption, res);
  //   fs.mkdtempSync(tmpdir + sep)

  //   fs.unlinkSync();
}
