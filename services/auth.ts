/**
 * @file 用户登录、授权相关
 */
import request from "@/utils/request";

/**
 * 注册用户
 */
export async function register({ email, password }) {
  return request.post("/api/auth/register", {
    email,
    password,
  });
}

/**
 * 用户登录
 */
export async function login({ email, password, csrfToken }) {
  return request.post("/api/auth/credentials/login", {
    email,
    password,
    // csrfToken,
  });
}

/**
 * 用户登录
 */
 export async function logout() {
  return request.post("/api/auth/logout");
}

export function fetchCsrf() {
  return request.get("/api/auth/csrf");
}

/**
 * 获取用户信息
 */
export async function fetchUser() {
  return request.post("/api/user");
}
