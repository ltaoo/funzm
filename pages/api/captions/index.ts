import prisma from "@/lib/prisma";
import { getSession } from "@/next-auth/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function provideCaptions(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) {
    return;
  }
  const userId = session.user.id as string;
  const captions = await prisma.caption.findMany({
    where: {
      publisherId: userId,
    },
  });
  res.status(200).json({
    code: 0,
    msg: "",
    data: {
      page: 1,
      pageSize: 10,
      total: 0,
      list: captions,
    },
  });
}
