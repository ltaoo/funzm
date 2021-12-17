import Dexie, { Table } from "dexie";
import { Paragraph } from "@prisma/client";

interface LocalCaption {
  title: string;
  type: string;
  content: string;
  rid?: string;
}
interface LocalParagraph extends Paragraph {
  rid?: string;
}

export class FunzmStore extends Dexie {
  captions: Table<LocalCaption>;
  paragraphs: Table<LocalParagraph, number>;

  constructor() {
    super("FunzmStore");

    this.version(1).stores({
      captions: "++id",
      paragraphs: "++id, captionId",
    });
  }
}

export const localdb = new FunzmStore();

// db.on("populate", populate);

// export function resetDatabase() {
//   return db.transaction("rw", db.todoLists, db.todoItems, async () => {
//     await Promise.all(db.tables.map((table) => table.clear()));
//     await populate();
//   });
// }
