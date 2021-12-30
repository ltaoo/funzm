import { NextApiRequest, NextApiResponse } from "next";

import { getSession } from "@/next-auth/client";
import prisma from "@/lib/prisma";

export default async function provideScoreRecordsService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) {
    res.status(200).json({
      code: 401,
      msg: "please login",
      data: null,
    });
    return;
  }
  const userId = session.userId as string;
  const scoreRecords = await prisma.scoreRecord.findMany({
    where: {
      userId,
    },
  });
  return res.status(200).json({
    code: 0,
    msg: "",
    data: {
      page: 1,
      pageSize: 10,
      list: scoreRecords,
    },
  });
}
