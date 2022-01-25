import prisma from "@/lib/prisma";
import { PriceInterval, PriceType } from "@prisma/client";

const products = [
  {
    name: "免费版",
    description:
      "大部分功能可用，某些功能限制使用次数如测验次数。适合轻度使用（每天一小时内）用户",
    features: [
      "在线解析字幕",
      "转换成 pdf、word 或 txt 格式",
      "下载转换后的文档",
      "无解析、下载次数限制",
      "保存、编辑字幕",
      "最多5个字幕",
      "PC端移动端(小程序)字幕数据同步",
      "字幕笔记",
      "每天20测验次数",
      "选择测验模式",
      "拼写测验模式",
      "测验错误统计",
      "签到获取积分",
      "积分兑换道具",
    ],
  },
  {
    name: "无限版",
    description: "全部功能可用，无任何使用限制。适合重度使用用户。",
    features: ["免费版所有功能", "无限上传字幕", "无限测验次数"],
    prices: [
      {
        price: "12￥/月",
        interval: PriceInterval.month,
        type: PriceType.one_time,
        interval_count: 1,
        // mark: "18￥/月",
      },
      {
        price: "108￥/年",
        interval: PriceInterval.year,
        type: PriceType.one_time,
        interval_count: 1,
        // mark: "132￥/年",
      },
    ],
  },
];

const items = [
  {
    name: "无限版月卡",
    desc: "延长无限版时间一个自然月。购买后即生效",
    price: 2048,
  },
  {
    name: "月卡8折优惠券",
    desc: "八折购买无限版月卡，购买后将获得兑换码，下单时填入该兑换码即可",
    price: 256,
  },
  {
    name: "字幕扩容槽",
    desc: "免费版用户可上传字幕数 +1，购买后即生效",
    price: 512,
  },
  {
    name: "精力恢复药剂",
    desc: "当天测验次数 +20，购买后即生效",
    price: 64,
  },
];

const caption = {
  title: "Test Caption",
  public: true,
  paragraphs: [
    {
      text1: "a",
      text2: "a",
    },
    {
      text1: "b",
      text2: "b",
    },
    {
      text1: "c",
      text2: "c",
    },
    {
      text1: "d",
      text2: "d",
    },
    {
      text1: "e",
      text2: "e",
    },
    {
      text1: "f",
      text2: "f",
    },
    {
      text1: "g",
      text2: "g",
    },
    {
      text1: "h",
      text2: "h",
    },
    {
      text1: "i",
      text2: "i",
    },
    {
      text1: "j",
      text2: "j",
    },
    {
      text1: "k",
      text2: "k",
    },
    {
      text1: "l",
      text2: "l",
    },
    {
      text1: "m",
      text2: "m",
    },
    {
      text1: "n",
      text2: "n",
    },
    {
      text1: "o",
      text2: "o",
    },
    {
      text1: "p",
      text2: "p",
    },
    {
      text1: "q",
      text2: "q",
    },
    {
      text1: "r",
      text2: "r",
    },
    {
      text1: "s",
      text2: "s",
    },
    {
      text1: "t",
      text2: "t",
    },
    {
      text1: "u",
      text2: "u",
    },
    {
      text1: "v",
      text2: "v",
    },
    {
      text1: "w",
      text2: "w",
    },
    {
      text1: "x",
      text2: "x",
    },
    {
      text1: "y",
      text2: "y",
    },
    {
      text1: "z",
      text2: "z",
    },
    {
      text1: "aa",
      text2: "aa",
    },
    {
      text1: "bb",
      text2: "bb",
    },
    {
      text1: "cc",
      text2: "cc",
    },
    {
      text1: "dd",
      text2: "dd",
    },
    {
      text1: "ee",
      text2: "ee",
    },
    {
      text1: "ff",
      text2: "ff",
    },
    {
      text1: "gg",
      text2: "gg",
    },
    {
      text1: "hh",
      text2: "hh",
    },
    {
      text1: "ii",
      text2: "ii",
    },
    {
      text1: "jj",
      text2: "jj",
    },
    {
      text1: "kk",
      text2: "kk",
    },
    {
      text1: "ll",
      text2: "ll",
    },
    {
      text1: "mm",
      text2: "mm",
    },
    {
      text1: "nn",
      text2: "nn",
    },
    {
      text1: "oo",
      text2: "oo",
    },
    {
      text1: "pp",
      text2: "pp",
    },
    {
      text1: "qq",
      text2: "qq",
    },
    {
      text1: "rr",
      text2: "rr",
    },
    {
      text1: "ss",
      text2: "ss",
    },
    {
      text1: "tt",
      text2: "tt",
    },
    {
      text1: "uu",
      text2: "uu",
    },
    {
      text1: "vv",
      text2: "vv",
    },
    {
      text1: "ww",
      text2: "ww",
    },
    {
      text1: "xx",
      text2: "xx",
    },
    {
      text1: "yy",
      text2: "yy",
    },
    {
      text1: "zz",
      text2: "zz",
    },
  ],
};

(async () => {
  await Promise.all(
    products.map((product) => {
      const { prices, ...rest } = product;
      return prisma.product.create({
        data: {
          ...rest,
          prices: {
            createMany: {
              data: prices,
            },
          },
        },
      });
    })
  );
  await Promise.all(
    items.map((item) => {
      return prisma.item.create({
        data: {
          ...item,
        },
      });
    })
  );
})().catch((e) => {
  console.log("[prisma]initialize", e);
});
