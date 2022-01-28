/**
 * @file 生成小程序码
 * // https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=ACCESS_TOKEN
 * https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/qr-code/wxacode.getUnlimited.html
 */
import axios from "axios";

import { isProd } from "@/constants";

import { getAccessToken } from "./token";

export async function generateWeappQrcode({ scene, page }) {
  const token = await getAccessToken();

  console.log('[]generateWeappQrcode', isProd);

  const resp = await axios.post(
    `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${token}`,
    {
      scene,
      page,
      check_path: false,
      env_version: isProd ? "release" : "develop",
    },
    {
      responseType: "arraybuffer",
    }
  );
  const { data } = resp;
  const { errcode, errmsg } = data;
  if (errcode && errcode !== 0) {
    return Promise.reject(new Error(errmsg));
  }

  // console.log("data type is:", typeof data);
  const buffer = data as Buffer;

  return buffer.toJSON();
}
