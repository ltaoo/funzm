/**
 * @file 新增测验
 */
import { getSession } from "@/next-auth/client";
import prisma from "@/lib/prisma";
import * as utils from "@/lib/utils";

export default async function provideExamAddingService(req, res) {
  // const session = await getSession({ req });
  // if (!session) {
  //   res.status(200).json({
  //     code: 401,
  //     msg: "请先登录",
  //     data: null,
  //   });
  //   return;
  // }
  // const { body } = req;
  // const { captionId, scenes } = body;
  // const userId = session.user.id as string;
  // try {
  //   console.log("[API]exam create", scenes);
  //   const result = await prisma.exam.create({
  //     data: {
  //       userId: userId,

  //       captionId: captionId,
  //       scenes: {
  //         create: scenes.map((scene) => {
  //           return {
  //             ...scene,
  //             created_at: utils.seconds(),
  //           };
  //         }),
  //       },

  //       created_at: utils.seconds(),
  //       last_updated: null,
  //     },
  //     include: {
  //       scenes: true,
  //     },
  //   });
  //   res.status(200).json({ code: 0, msg: "", data: result });
  // } catch (err) {
  //   res.status(200).json({ code: 100, msg: err.message, data: null });
  // }
    res.status(200).json({ code: 0, msg: "", data: null });
}
