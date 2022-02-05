import {
  DECREMENT_SCORES_FOR_INCORRECT_SPELLING,
  ExamType,
  ExamTypePathMap,
  EXPECTED_SECONDS_PER_PARAGRAPH,
  REWARD_SCORES_FOR_CORRECT_SPELLING,
  REWARD_SCORES_FOR_REMAINING_PER_SECOND,
  SpellingResultType,
} from "./constants";

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
  if (!string) {
    return "";
  }
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

/**
 * 根据测验结果计算获得积分数
 * @param stats
 * @returns
 */
export function computeScoreByStats(stats) {
  const { correct, incorrect, correctRate, total, seconds } = stats;
  // console.log(
  //   "[LOG][utils]computeScoreByStats - data",
  //   total,
  //   seconds,
  //   correct,
  //   incorrect,
  //   correctRate
  // );
  let score = correct * REWARD_SCORES_FOR_CORRECT_SPELLING;
  if (correctRate >= 60 && correctRate < 70) {
    score += 4;
  } else if (correctRate >= 70 && correctRate < 80) {
    score += 6;
  } else if (correctRate >= 80) {
    score += 10;
  }
  const estimated = total * EXPECTED_SECONDS_PER_PARAGRAPH;
  const remainingSeconds = seconds ? estimated - seconds : 0;
  score += remainingSeconds * REWARD_SCORES_FOR_REMAINING_PER_SECOND;
  score -= incorrect * DECREMENT_SCORES_FOR_INCORRECT_SPELLING;

  if (score < 0) {
    return 0;
  }

  return score;
}

export function paddingZero(num) {
  const number = parseInt(num, 10);
  if (number < 10) {
    return `0${number}`;
  }
  return number;
}

/**
 * 区分类型
 */
export function getMultipleTypeSpellings(spellings) {
  const skippedSpellings = [];
  const correctSpellings = [];
  const incorrectSpellings = [];
  for (let i = 0; i < spellings.length; i += 1) {
    const { type } = spellings[i];
    if (type === SpellingResultType.Skipped) {
      skippedSpellings.push(spellings[i]);
      continue;
    }
    if (type === SpellingResultType.Correct) {
      correctSpellings.push(spellings[i]);
      continue;
    }
    if (type === SpellingResultType.Incorrect) {
      incorrectSpellings.push(spellings[i]);
      continue;
    }
  }

  return {
    correctSpellings,
    incorrectSpellings,
    skippedSpellings,
  };
}

export function getMatchedPagePath(t: ExamType) {
  const p = ExamTypePathMap[t || ExamType.Selection] || "select";
  return p;
}
