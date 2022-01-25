import request from "@/utils/request";

/**
 * 获取小程序登录二维码
 */
export function fetchWeappLoginQrcodeService() {
  return request.get("/api/auth/wx/qrcode");
}

/**
 * 检查小程序登录二维码状态（是否点击确认登录）
 */
export function fetchWeappLoginQrcodeStatusService() {
  return request.get("/api/auth/wx/check") as Promise<{ status: number }>;
}
