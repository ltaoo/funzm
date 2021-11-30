/**
 * @file 字幕分页
 */
import * as utils from "@/lib/utils";

import prisma from "./prisma";

/**
 * 获取字幕列表
 */
export async function fetchCaptionsService(
  params?: {
    page?: number;
    pageSize?: number;
  },
  extra?
) {
  console.log("[SERVICE]fetchCaptionsService", extra);
  if (!extra?.id) {
    return null;
  }
  return prisma.caption.findMany({
    where: {
      publisherId: extra?.id,
    },
    take: params?.pageSize ?? 5,
  });
}

/**
 * 新增字幕
 */
export async function addCaptionService({ title, paragraphs, publisherId }) {
  // console.log("[]addCaptionService", publisherId);
  return prisma.caption.create({
    data: {
      title,
      paragraphs: {
        create: paragraphs,
      },
      publisherId,
      created_at: utils.seconds(),
      last_updated: null,
    },
  });
}

/**
 * 根据 id 获取指定字幕
 * @returns
 */
export async function fetchCaptionById({ id }) {
  return prisma.caption.findUnique({
    where: {
      id,
    },
    include: {
      paragraphs: true,
    },
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
