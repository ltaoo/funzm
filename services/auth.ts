/**
 * @file 用户登录、授权相关
 */
import axios from "axios";

/**
 * 注册用户
 */
export async function register({ email, password }) {
  return axios.post("/api/user/register", {
    email,
    password,
  });
}

/**
 * 用户登录
 */
export async function login({ email, password }) {}
