import { NextApiRequest, NextApiResponse } from "next";

import { ensureLogin, resp } from "@/lib/utils";
import prisma from "@/lib/prisma";

export default async function provideCaptionStarService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);

  const { id: i } = req.query as { id: string };
  const id = Number(i);

  if (Number.isNaN(id)) {
    return resp(10001, res);
  }

  await prisma.starRecord.create({
    data: {
      user_id,
      caption_id: id,
    },
  });

  return resp(null, res);
}
