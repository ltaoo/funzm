import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { resp } from "@/lib/utils";
import { SpellingResultType } from "@/domains/exam/constants";
import dayjs from "dayjs";

export default async function provideIncorrectSpellingStatsService(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
  }
  const spellings = await prisma.spellingResult.findMany(fetchArgs);
  //   console.log(spellings);
  const incorrect_spellings = spellings.filter((spelling) => {
    return spelling.type === SpellingResultType.Incorrect;
  });
  //   console.log(incorrect_spellings);
  for (let i = 0; i < incorrect_spellings.length; i += 1) {
    const { user_id, paragraph_id } = incorrect_spellings[i];
    const e = await prisma.incorrectParagraph.findFirst({
      where: { id: paragraph_id },
    });
    if (e) {
      await prisma.incorrectParagraph.update({
        where: {
          id: paragraph_id,
        },
        data: {
          updated_at: dayjs().toDate(),
        },
      });
    } else {
      await prisma.incorrectParagraph.create({
        data: {
          user_id,
          id: paragraph_id,
        },
      });
    }
  }

  await prisma.flag.update({
    where: {
      id: flag.id,
    },
    data: {
      spelling_flag_id: spellings.pop().id,
    },
  });

  return resp(flag, res);
}
