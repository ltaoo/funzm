import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { ensureLogin, resp } from "@/lib/utils";

export default async function provideWordAddingService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);

  const { word, paragraphId } = req.body;

  await prisma.word.create({
    data: {
      user_id,
      text: word,
      paragraph_id: paragraphId ? Number(paragraphId) : undefined,
    },
  });

  return resp(null, res);
}
