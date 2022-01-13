/**
 * @file 新增字幕
 */
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { ensureLogin } from "@/lib/utils";

export default async function addCaptionAPI(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const publisherId = await ensureLogin(req, res);
  const { body } = req;
  const { title, paragraphs, force = false } = body;

  if (!force) {
    const existing = await prisma.caption.findFirst({
      where: {
        title,
        publisher_id: publisherId,
      },
    });
    if (existing) {
      res.status(200).json({ code: 100, msg: "已存在同名字幕", data: null });
      return;
    }
  }
  const { id } = await prisma.caption.create({
    data: {
      title,
      paragraphs: {
        create: paragraphs,
      },
      publisher_id: publisherId,
      created_at: dayjs().unix(),
    },
  });
  res.status(200).json({ code: 0, msg: "", data: { id } });
}
