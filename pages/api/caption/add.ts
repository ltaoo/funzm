/**
 * @file 新增字幕
 */
import { getSession } from "@/next-auth/client";
import * as utils from "@/lib/utils";
import prisma from "@/lib/prisma";

export default async function addCaptionAPI(req, res) {
  const session = await getSession({ req });
  if (!session) {
    res.status(200).json({
      code: 401,
      msg: "Please complete authorize before save caption",
      data: null,
    });
    return;
  }
  try {
    const { body } = req;
    const { title, paragraphs, force } = body;
    const {
      // @ts-ignore
      user: { id: publisherId },
    } = session;

    if (!force) {
      const existing = await prisma.caption.findFirst({
        where: {
          title,
          publisherId,
        },
      });
      if (existing) {
        res.status(200).json({ code: 100, msg: "已存在同名字幕", data: null });
        return;
      }
    }
    console.log("[]addCaptionAPI", publisherId, paragraphs.length);
    const { id } = await prisma.caption.create({
      data: {
        title,
        paragraphs: {
          create: paragraphs,
        },
        publisherId,
        created_at: utils.seconds(),
        last_updated: null,
      },
    });
    res.status(200).json({ code: 0, msg: "", data: { id } });
  } catch (err) {
    res.status(200).json({ code: 100, msg: err.message, data: null });
  }
}
