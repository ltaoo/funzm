/**
 * @file 数据库连接
 */
import * as utils from "@/lib/utils";

import prisma from "./client";

/**
 * 获取字幕列表
 */
export function fetchCaptionsService() {
  return prisma.caption.findMany();
}

/**
 * 新增字幕
 */
export async function addCaptionService({ title, paragraphs }) {
  return prisma.caption.create({
    data: {
      title,
      paragraphs: {
        create: paragraphs,
      },
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
