import { NextApiRequest, NextApiResponse } from "next";

import { ensureLogin, resp } from "@/lib/utils";
import prisma from "@/lib/prisma";

export default async function provideNoteSearchingService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);

  const { caption_id } = req.query as { caption_id: string };

  const notes = await prisma.note.findMany({
    where: {
      caption_id: Number(caption_id),
    },
  });

  resp(notes, res);
}
