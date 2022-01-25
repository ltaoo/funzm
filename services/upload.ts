import request from "@/utils/request";

/**
 * 上传文件
 * @param body
 * @returns
 */
export function uploadFileService(body: FormData) {
  return request.post("/api/upload", body) as Promise<{ url: string }>;
}
