import axios from "axios";
import { getSession } from "@/next-auth/client";

const request = axios.create({
  timeout: 12000,
});

let cachedToken = null;
function getToken() {
  // getSession().then((token) => {
  //   cachedToken = token;
  // });
}
export function refreshToken() {
  cachedToken = getToken();
}
getToken();

request.interceptors.request.use(
  (config) => {
    if (cachedToken) {
      config.headers["authorization"] = `Bearer ${cachedToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    const { code } = response.data;
    if (code === 401) {
      console.log("登录状态已过期");
      return Promise.reject({
        code: response.data.code,
        message: response.data.msg,
      });
    }
    if (code !== 0) {
      return Promise.reject({
        code: response.data.code,
        message: response.data.msg,
      });
    }
    return response.data.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default request;
