import { INoteRes, INoteValues } from "@/domains/note/types";
import request from "@/utils/request";
import dayjs from "dayjs";

/**
 * 获取笔记列表
 */
export async function fetchNotesService({ page, pageSize }) {
  const resp = (await request.get("/api/notes", {
    page,
    pageSize,
  })) as { list: INoteRes[] };
  return {
    ...resp,
    dataSource: resp.list.map((note) => {
      const { id, start, content, end, paragraph_id, paragraph, created_at } =
        note;
      return {
        id,
        paragraphId: paragraph_id,
        content,
        start,
        end,
        paragraph,
        createdAt: dayjs(created_at).format("MM-DD HH:mm"),
      };
    }),
  };
}

/**
 * 新增笔记
 * @returns
 */
export async function addNoteService({
  content,
  text,
  start,
  end,
  captionId,
  paragraphId,
}: {
  // 笔记内容
  content: string;
  // 标记的文本
  text: string;
  // 开始下标
  start: number;
  // 结束下标
  end: number;
  // 笔记的字幕
  captionId?: number;
  // 笔记的段落
  paragraphId?: number;
}) {
  const data = (await request.post("/api/notes/add", {
    content,
    text,
    start,
    end,
    caption_id: captionId,
    paragraph_id: paragraphId,
  })) as INoteValues;
  return data as INoteValues;
}

/**
 * 更新笔记
 */
export async function updateNoteService({ id, content }) {
  const data = await request.post(`/api/notes/update/${id}`, {
    content,
  });
  return data as INoteValues;
}

/**
 * 根据字幕 id 搜索该字幕关联的所有笔记
 */
export async function fetchNotesByCaptionIdService(id) {
  const data = (await request.get("/api/notes/search", {
    caption_id: id,
  })) as INoteRes[];
  return data.map((note) => {
    const { id, content, start, end, paragraph_id } = note;
    return {
      id,
      paragraphId: paragraph_id,
      content,
      start,
      end,
    };
  });
}

/**
 * 根据给定的段落 id 获取笔记
 * @param ids
 */
export async function fetchNotesByParagraphsService(ids: number[]) {
  const data = (await request.post("/api/notes/search", {
    paragraph_ids: ids,
  })) as INoteRes[];
  return data.map((note) => {
    const { id, content, start, end, paragraph_id } = note;
    return {
      id,
      paragraphId: paragraph_id,
      content,
      start,
      end,
    };
  });
}

/**
 * 删除笔记
 */
export function deleteNote(id) {
  return request.get("/api/notes/delete", {
    id,
  });
}
