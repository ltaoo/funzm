import "@/lib/utils/polyfill";
import * as User from "@/lib/models/user";
import * as Email from "@/lib/models/email";

/**
 * 新增用户
 */
export default async function addUserAPI(req, res) {
  // const input = await utils.body<Credentials>(req);
  const { body: input } = req;

  if (!input || !input.email || !input.password) {
    res
      .status(200)
      .json({ code: 100, msg: "port over validation lib", data: null });
    return;
  }

  // Check for existing user email
  const { email, password } = input;
  const userUid = await Email.findEmailService(email);
  if (userUid) {
    res.status(200).json({
      code: 100,
      msg: "An account already exists for this address",
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
