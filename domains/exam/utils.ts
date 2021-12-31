/**
 * 打乱数组顺序，会改变原始数组
 * @param arr
 * @returns
 */
export function shuffle(arr) {
  let m = arr.length;
  while (m > 1) {
    let index = Math.floor(Math.random() * m--);
    [arr[m], arr[index]] = [arr[index], arr[m]];
  }
  return arr;
}

/**
 * 按指定 key，将数组转换成对象
 * @param arr
 * @param key
 * @returns
 */
export function arr2map<T extends Record<string, any> = {}>(
  arr: T[],
  key: string
): Record<any, T> {
  return arr
    .map((paragraph) => {
      const id = paragraph[key];
      return {
        [id]: paragraph,
      };
    })
    .reduce((result, cur) => {
      return {
        ...result,
        ...cur,
      };
    }, {});
}

let _uid = 0;
export function uid() {
  _uid += 1;
  return _uid;
}

function removeZero(string: string) {
  const segments = string.split("");
  const last = segments.pop();
  if (last === "0") {
    return removeZero(segments.join());
  }
  return string;
}
export function removeZeroAtTail(string: string) {
  if (!string) {
    return "";
  }
  const [int, float] = string.split(".");
  const processedFloat = removeZero(float);
  if (processedFloat) {
    return `${int}.${processedFloat}`;
  }
  return int;
}

export function computeScoreByStats(stats) {
  const { correct, correctRate, spend, total, seconds } = stats;
  let score = correct * 6;
  if (correctRate >= 60 && correctRate < 70) {
    score += 4;
  } else if (correctRate >= 70 && correctRate < 80) {
    score += 6;
  } else if (correctRate >= 80) {
    score += 10;
  }
  const estimated = total * 8;
  const remainingSeconds = seconds ? estimated - seconds : 0;
  score += remainingSeconds;
  return score;
}

export function paddingZero(num) {
  const number = parseInt(num, 10);
  if (number < 10) {
    return `0${number}`;
  }
  return number;
}
