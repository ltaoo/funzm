/**
 * @file 字幕分页
 */
import { Caption, Paragraph } from ".prisma/client";

import * as utils from "@/lib/utils";

import prisma from "./prisma";

/**
 * 获取字幕列表
 */
export async function fetchCaptionsServer(
  params?: {
    page?: number;
    pageSize?: number;
  },
  extra?
) {
  // console.log("[SERVICE]fetchCaptionsService", extra);
  if (!extra?.id) {
    return null;
  }
  return prisma.caption.findMany({
    where: {
      user_id: extra?.id,
    },
    take: params?.pageSize ?? 5,
  });
}

/**
 * 根据 id 删除字幕
 * @param param
 * @returns
 */
export async function deleteCaptionById({ id }) {
  return prisma.caption.delete({
    where: {
      id,
    },
  });
}
