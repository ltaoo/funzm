import { NextApiRequest, NextApiResponse } from "next";

export default async function provideAuthSessionService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json({
    code: 0,
    msg: "",
    data: {},
  });
}
