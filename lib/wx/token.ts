import axios from "axios";
import dayjs from "dayjs";

export const WEAPP_ID = "wx8c1c3e9e6bb5f673";
export const WEAPP_SECRET = process.env.SECRET;

let ACCESS_TOKEN: string | null = null;
let EXPIRES_TIME = null;

let retryTimes = 0;

/**
 * 获取 access token
 * @url https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/access-token/auth.getAccessToken.html
 */
async function fetchAccessToken() {
  if (!WEAPP_SECRET) {
    throw new Error("缺少小程序 Secret");
  }
  const resp = await axios.get(
    `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${WEAPP_ID}&secret=${WEAPP_SECRET}`
  );
  const { data } = resp;
  const { access_token, expires_in, errcode, errmsg } = data;
  if (!access_token) {
    if (retryTimes < 5) {
      retryTimes += 1;
      return await fetchAccessToken();
    }
    retryTimes = 0;
    return Promise.reject(new Error(errmsg));
  }

  retryTimes = 0;
  //   console.log('[]return access token');
  return [access_token, expires_in];
}

export async function getAccessToken() {
  if (ACCESS_TOKEN && dayjs().unix() < EXPIRES_TIME) {
    return ACCESS_TOKEN;
  }
  try {
    const [accessToken, expiresIn] = await fetchAccessToken();
    ACCESS_TOKEN = accessToken;
    EXPIRES_TIME = dayjs().unix() + expiresIn;

    return ACCESS_TOKEN;
  } catch (err) {
    return Promise.reject(err);
  }
}
