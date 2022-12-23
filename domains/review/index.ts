import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

class Memory {
  createdAt: Dayjs = dayjs();
  nextReviewTime: Dayjs | null;
  step: number = 1;
  times: number[] = [];

  constructor() {
    this.nextReviewTime = this.createdAt.clone().add(this.step, "day");
  }

  /**
   * 更新该记忆内容复习时间
   */
  update() {
    this.step = (() => {
      if (this.step === 1) {
        return 2;
      }
      if (this.step === 2) {
        return 4;
      }
      if (this.step === 4) {
        return 7;
      }
      if (this.step === 15) {
        return 30;
      }
      return 0;
    })();
    if (this.step === 0) {
      this.nextReviewTime = null;
      return;
    }
    this.nextReviewTime = this.createdAt.clone().add(this.step, "day");
  }
}

function sleep(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}
/**
 * 移除对象中指定字段
 * @param {Record<string, any>} data
 * @param {string[]} keys
 */

function omit(data, keys) {
  return Object.keys(data)
    .filter((key) => {
      return !keys.includes(key);
    })
    .map((key) => {
      return {
        [key]: data[key],
      };
    })
    .reduce((whole, next) => {
      return {
        ...whole,
        ...next,
      };
    }, {});
}

function f(d) {
  return d.format("YYYY-MM-DD");
}
const content = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "&",
  "@",
  "#",
  "$",
  "*",
  "+",
  "=",
];
function g(i) {
  const c = content[i];
  return [`${c}0`, `${c}1`, `${c}2`];
}
function removeUnlessKeysDeeply(arr) {
  return arr.map((item) => {
    const { reviewed, nextDay, step, ...restItem } = item;
    return {
      ...restItem,
      reviewed: reviewed.map((c) => {
        return omit(c, ["reviewed", "nextDay", "step"]);
      }),
    };
  });
}

const days = [];
const initialDay = dayjs("2021/09/15");

function findReviewInToday(today) {
  return days.filter((d) => {
    const { nextDay } = d;
    if (today === nextDay) {
      return true;
    }
    return false;
  });
}

async function main() {
  for (let i = 0; i < 31; i += 1) {
    const today = initialDay.clone().add(i, "day");
    console.log("--------");
    console.log("today is", f(today));
    console.log("find need reviewed records...");
    // eslint-disable-next-line no-await-in-loop
    await sleep(1000);
    const step = 1;
    const needToReviews = findReviewInToday(f(today));
    // console.log(days.map((d) => ({ day: d.day, nextDay: d.nextDay })));
    const payload = {
      day: f(today),
      reviewed: [...needToReviews],
      step,
      nextDay: f(today.clone().add(step, "day")),
      learned: (() => {
        if (today.isAfter("2021/09/30")) {
          return [];
        }
        return g(i);
      })(),
    };
    console.log(
      "find result is",
      needToReviews.map((d) => ({ day: d.day, nextDay: d.nextDay }))
    );
    needToReviews.forEach((d) => {
      if (today.isAfter("2021/09/30")) {
        d.nextDay = f(today.clone().add(1, "day"));
        return;
      }
      d.step = (() => {
        if (d.step === 1) {
          return 2;
        }
        if (d.step === 2) {
          return 4;
        }
        if (d.step === 4) {
          return 7;
        }
        if (d.step === 7) {
          return 15;
        }
        return 0;
      })();
      d.nextDay = f(dayjs(d.day).add(d.step, "day"));
    });
    days.push(payload);
    console.log();
    console.log();
    console.log();
  }
  console.log(JSON.stringify(removeUnlessKeysDeeply(days), null, 2));
}

main();
