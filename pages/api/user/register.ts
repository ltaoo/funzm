/**
 * @file 新用户注册
 * POST `/api/user/register`
 */
import "@/lib/utils/polyfill";
import * as User from "@/lib/models/user";

export default async function addUserPoint(req, res) {
  const { body } = req;
  const { email, password } = body;

  if (!body || !body.email || !body.password) {
    res
      .status(200)
      .json({ code: 100, msg: "Missing required fields.", data: null });
    return;
  }

  const existing = await User.findUserByEmailService(email);
  if (existing) {
    res.status(200).json({
      code: 100,
      msg: "An account already exists for this email.",
      data: null,
    });
    return;
  }

  const user = await User.addUserService({ email, password });
  if (!user) {
    res
      .status(200)
      .json({ code: 100, msg: "Error creating account", data: null });
    return;
  }

  return res.status(200).json({ code: 0, msg: "", data: null });
}
