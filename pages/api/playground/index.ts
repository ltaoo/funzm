import { addDefaultCaptionToUser } from "@/lib/caption";
import { ensureLogin, resp } from "@/lib/utils";

export default async function provideTestService(req, res) {
  const user_id = await ensureLogin(req, res);

  await addDefaultCaptionToUser(user_id);

  resp(null, res);
}
