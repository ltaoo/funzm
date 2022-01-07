import prisma from "@/lib/prisma";
import { getSession } from "@/next-auth/client";

export default async function updateExamAPI(req, res) {
  const session = await getSession({ req });
  if (!session) {
    res.status(200).json({ code: 401, msg: "请先登录", data: null });
    return;
  }
  try {
    const { id, status, curParagraphId, combo, maxCombo } = req.body;
    await prisma.exam.update({
      where: { id },
      data: {
        // combo,
        // maxCombo,
        status,
        // curParagraphId,
      },
    });

    res.status(200).json({ code: 0, msg: "", data: { id } });
  } catch (err) {
    res.status(200).json({ code: 100, msg: err.message, data: null });
  }
}
