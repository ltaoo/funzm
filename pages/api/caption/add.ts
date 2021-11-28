/**
 * @file 新增字幕
 */
import { addCaptionService } from "@/lib/caption";

export default async function addCaption(req, res) {
  const { body } = req;
  console.log("[API]addCaption", body);
  try {
    await addCaptionService(body);
    res.status(200).json({ code: 0, msg: "", data: null });
  } catch (err) {
    res.status(200).json({ code: 100, msg: err.message, data: null });
  }
}
