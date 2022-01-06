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
      // @ts-ignore
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
 * @param {string} id - 字幕 id
 * @param {boolean} paragraph - 是否包含句子
 */
export async function fetchCaptionById({ id, paragraph }) {
  const countTask = !paragraph
    ? prisma.paragraph.count({
        where: {
          captionId: id,
        },
      })
    : undefined;
  const result = await prisma.$transaction(
    [
      countTask,
      prisma.caption.findUnique({
        where: {
          id,
        },
        include: {
          paragraphs: paragraph,
          // @ts-ignore
          exams: true,
        },
      }),
    ].filter(Boolean)
  );
  if (result.length === 1) {
    const { paragraphs } = result[0] as Caption & { paragraphs: Paragraph[] };
    return {
      ...(result[0] as Caption),
      count: paragraphs.length,
    };
  }
  return {
    ...(result[1] as Caption),
    count: result[0],
  };
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
