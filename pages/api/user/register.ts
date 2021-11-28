import { addUserService } from "@/lib/models/user";

/**
 * 新增用户
 */
export default async function addUserAPI(req, res) {
  const { body } = req;
  // console.log("[API]addUserAPI", body);
  try {
    await addUserService(body);
    //   res.status(200).json({ code: 0, msg: "", data: null });
  } catch (err) {
    res.status(200).json({ code: 100, msg: err.message, data: null });
  }
}
