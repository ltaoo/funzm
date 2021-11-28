/**
 * @file 用户登录、授权相关
 */
import axios from "axios";

/**
 * 注册用户
 */
export async function register({ email, password }) {
  return axios
    .post("/api/user/register", {
      email,
      password,
    })
    .then((response) => {
      console.log(response);
      if (response.data.code !== 0) {
        return Promise.reject({
          message: response.data.msg,
        });
      }
      return response;
    });
}

/**
 * 用户登录
 */
export async function login({ email, password }) {}
