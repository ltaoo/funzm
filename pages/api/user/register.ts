import "@/lib/utils/polyfill";
import { addUserService } from "@/lib/models/user";

/**
 * 新增用户
 */
export default async function addUserAPI(req, res) {
  const { body } = req;
  try {
    const data = await addUserService(body);
    res.status(200).json({ code: 0, msg: "", data });
  } catch (err) {
    res.status(200).json({ code: 100, msg: err.message, data: null });
  }
}
