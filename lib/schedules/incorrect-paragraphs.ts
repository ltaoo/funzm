import { SpellingResultType } from "@/domains/exam/constants";
import prisma from "@/lib/prisma";

export async function runIncorrectParagraphsStatsJob() {
  let flag = await prisma.flag.findFirst();

  if (flag === null) {
    await prisma.flag.create({
      data: {},
    });
  }
  flag = await prisma.flag.findFirst();
  const { spelling_flag_id } = flag;
  const fetchArgs = {
    where: {},
    take: 20,
  };
  if (spelling_flag_id) {
    // @ts-ignore
    fetchArgs.cursor = {
      id: spelling_flag_id,
    };
    // @ts-ignore
    fetchArgs.skip = 1;
  }
  const spellings = await prisma.spellingResult.findMany(fetchArgs);

  console.log(
    "[]start incorrect paragraphs stats job and spellings total:",
    spellings.length
  );
  const incorrect_spellings = spellings.filter((spelling) => {
    return spelling.type === SpellingResultType.Incorrect;
  });
  // console.log("and incorrect spellings is", incorrect_spellings.length);

  if (spellings.length === 0) {
    return;
  }

  const map = {};
  for (let i = 0; i < incorrect_spellings.length; i += 1) {
    const { id, user_id, paragraph_id, created_at } = incorrect_spellings[i];
    // console.log("[]incorrect spelling id is", id);
    const key = `${user_id}-${paragraph_id}`;
    if (map[key]) {
      map[key] = {
        user_id,
        paragraph_id,

        updated_at: created_at,
      };
    } else {
      map[key] = {
        user_id,
        paragraph_id,

        created_at,
      };
    }
  }

  const keys = Object.keys(map);
  for (let i = 0; i < keys.length; i += 1) {
    const { user_id, paragraph_id, updated_at, created_at } = map[keys[i]];
    const e = await prisma.incorrectParagraph.findFirst({
      where: { user_id, id: paragraph_id },
    });
    if (e) {
      await prisma.incorrectParagraph.update({
        where: {
          id: paragraph_id,
        },
        data: {
          updated_at,
        },
      });
    } else {
      await prisma.incorrectParagraph.create({
        data: {
          user_id,
          id: paragraph_id,
          created_at,
        },
      });
    }
  }

  await prisma.flag.update({
    where: {
      id: flag.id,
    },
    data: {
      spelling_flag_id: (() => {
        const lastOne = spellings.pop();
        if (lastOne) {
          return lastOne.id;
        }
        return flag.spelling_flag_id;
      })(),
    },
  });

  runIncorrectParagraphsStatsJob();
}
