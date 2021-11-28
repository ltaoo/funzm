/**
 * Post `/user/login`
 */
import * as Email from "@/lib/models/email";
import * as User from "@/lib/models/user";
import * as Password from "@/lib/models/password";

export default async function login(req, res) {
  const { body: input } = req;
  //   const input = await utils.body<Credentials>(req);

  if (!input || !input.email || !input.password) {
    res
      .status(200)
      .json({ code: 100, msg: "port over validation lib", data: null });
  }

  // the amibiguous error message to send
  const ambiguous = "Invalid credentials";

  // Check for existing user email
  const { email, password } = input;
  const userUid = await Email.findEmailService(email);
  console.log("finded user uid", userUid);
  if (!userUid) {
    res
      .status(200)
      .json({ code: 100, msg: "Account not existing", data: null });
    return;
  }

  const user = await User.findUserService(userUid);
  if (!user) {
    res.status(200).json({ code: 100, msg: ambiguous, data: null });
    return;
  }

  const isMatch = await Password.compare(user, password);
  if (!isMatch) {
    res.status(200).json({ code: 100, msg: ambiguous, data: null });
    return;
  }

  return res.status(200).json({ code: 0, msg: "", data: User.respond(user) });
}
