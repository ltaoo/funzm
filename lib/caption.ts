/**
 * @file 字幕相关的工具方法
 */

import prisma from "@/lib/prisma";

export async function addDefaultCaptionToUser(user_id: number) {
  const createdCaption = await prisma.caption.create({
    data: {
      user_id,
      title: "《小谢尔顿》第一季第一集节选",
    },
  });
  const paragraphs = [
    {
      // user: { connect: user_id },
      line: "1",
      text1: "我从小喜欢火车",
      text2: "I've always loved trains.",
      start: "0:00:10.84",
      end: "0:00:13.23",
    },
    {
      // user: { connect: user_id },
      line: "2",
      text1: "事实上",
      text2: "In fact,",
      start: "0:00:14.94",
      end: "0:00:16.01",
    },
    {
      // user_id,
      // user: { connect: user_id },
      line: "3",
      text1: "如果我理论物理学的工作没成",
      text2: "if my career in theoretical physics hadn't worked out,",
      start: "0:00:16.01",
      end: "0:00:19.21",
    },
    {
      // user: { connect: user_id },
      line: "4",
      text1: "我的后备计划 是打算当一个职业检票员",
      text2: "my backup plan was to become a professional ticket taker.",
      start: "0:00:19.21",
      end: "0:00:20.54",
    },
    {
      // user: { connect: user_id },
      // user_id,
      line: "5",
      text1: "或者是流浪汉",
      text2: "Or hobo.",
      start: "0:00:22.98",
      end: "0:00:24.77",
    },
    {
      // user: { connect: user_id },
      // user_id,
      line: "6",
      text1: "而当我发现火车能让我 证明牛顿第一定律...",
      text2:
        "And when I figured out that trains allowed me to prove Newton's first law--",
      start: "0:00:31.64",
      end: "0:00:34.57",
    },
    {
      // user: { connect: user_id },
      // user_id,
      line: "7",
      text1: "任何物体都要保持 匀速直线运动或静止状态",
      text2:
        "an object in motion stays in motion with the same speed and in the same direction",
      start: "0:00:36.63",
      end: "0:00:39.13",
    },
    {
      // user: { connect: user_id },
      // user_id,
      line: "8",
      text1: "直到外力迫使它改变运动状态为止",
      text2: "unless acted upon by an unbalanced force--",
      start: "0:00:41.65",
      end: "0:00:44.33",
    },
    {
      // user: { connect: user_id },
      // user_id,
      line: "9",
      text1: "我感到了尼尔·阿姆斯特朗登月时",
      text2: "I felt like Neil Armstrong on the moon,",
      start: "0:00:44.33",
      end: "0:00:47.75",
    },
    {
      // user: { connect: user_id },
      // user_id,
      line: "10",
      text1: "那孤独又快乐的感觉",
      text2: "alone and happy.",
      start: "0:00:47.75",
      end: "0:00:49.53",
    },
    {
      // user: { connect: user_id },
      // user_id,
      line: "11",
      text1: "谢利 晚饭做好了",
      text2: "Shelly, dinner's ready!",
      start: "0:00:49.53",
      end: "0:00:51.43",
    },
    {
      // user: { connect: user_id },
      // user_id,
      line: "12",
      text1: "我不管你有多笨",
      text2: "I don't care how dimwitted you are.",
      start: "0:00:54.20",
      end: "0:00:56.40",
    },
    {
      // user: { connect: user_id },
      // user_id,
      line: "13",
      text1: "但科学原理肯定能让你笑开怀",
      text2: "Scientific principles have to make you smile.",
      start: "0:00:56.40",
      end: "0:00:59.58",
    },
    {
      // user: { connect: user_id },
      // user_id,
      line: "14",
      text1: "当然 我1989年在德州东部",
      text2: "Of course, nobody I knew in East Texas",
      start: "0:00:59.58",
      end: "0:01:02.31",
    },
    {
      // user: { connect: user_id },
      // user_id,
      line: "15",
      text1: "所认识的人中 没人在乎牛顿物理学",
      text2: "in 1989 cared about Newtonian physics.",
      start: "0:01:02.31",
      end: "0:01:06.38",
    },
    {
      // user: { connect: user_id },
      // user_id,
      line: "16",
      text1: "他们唯一在意的「牛顿」是艺人维恩·牛顿与牛顿饼干",
      text2: "The only Newtons they cared about were Wayne and Fig.",
      start: "0:01:06.38",
      end: "0:01:10.09",
    },
    {
      // user: { connect: user_id },
      // user_id,
      line: "17",
      text1: "谢尔顿 你再不来",
      text2: "Sheldon, if you don't get in here,",
      start: "0:01:10.09",
      end: "0:01:11.41",
    },
    {
      // user: { connect: user_id },
      // user_id,
      line: "18",
      text1: "-我就去舔你的牙刷 -马上来",
      text2: "I'm gonna lick your toothbrush! Coming!",
      start: "0:01:11.41",
      end: "0:01:14.14",
    },
    {
      // user: { connect: user_id },
      // user_id,
      line: "19",
      text1: "那是我姐姐",
      text2: "That's my sister.",
      start: "0:01:14.14",
      end: "0:01:15.48",
    },
    {
      // user: { connect: user_id },
      // user_id,
      line: "20",
      text1: "而她真的做过这事了",
      text2: "And she's done it before.",
      start: "0:01:15.48",
      end: "0:01:17.90",
    },
  ];
  await prisma.paragraph.createMany({
    data: paragraphs.map((p) => {
      return {
        ...p,
        caption_id: createdCaption.id,
        // caption: createdCaption,
      };
    }),
  });

  const matchedParagraph = await prisma.paragraph.findFirst({
    where: {
      caption_id: createdCaption.id,
      line: "16",
    },
  });
  if (matchedParagraph) {
    await prisma.note.create({
      data: {
        user: { connect: { id: user_id } },
        caption: { connect: { id: createdCaption.id } },
        paragraph: { connect: { id: matchedParagraph.id } },
        content:
          "`Fig` 意为「无花果」，19世纪末 `Charles Roser` 发明了将无花果酱插入糕点面团中的机器。肯尼迪饼干公司批量生产该饼干，以城市「马萨诸塞州牛顿」命名，所以称为「牛顿饼干」，商标为 `Fig Newtons`；自2012年以来，产品名称删除 `Fig`，仅保留 `Newtons`。",
        text: "Fig",
        start: 49,
        end: 52,
      },
    });
  }
}
