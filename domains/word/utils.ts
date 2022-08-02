const text = ``;

// // 元音
const a = [/ɑ:/, /ʌ/, /ɔ:/, /ɒ/, /ə/, / ɜ:/, /i:/, /ɪ/, /u:/, /ʊ/, /e/, /æ/];
const b = [/eɪ/, /aɪ/, /ɒɪ/, /ɪə/, /eə/, /ʊə/, /əʊ/, /aʊ/];

function splitEnglishAndChinese(text) {
  const lines = text
    .split("\n")
    .filter(Boolean)
    .filter((line) => {
      if (/[a-z]/.test(line[0])) {
        return true;
      }
      return false;
    })
    .map((line) => {
      const res = line.match(/([a-z]+)/);
      if (res) {
        return res[0];
      }
      return null;
    })
    .filter(Boolean);

  for (let i = 0; i < lines.length; i += 1) {
    const word = lines[i];
  }
  console.log(lines);
}

/**
 * 是否为辅音
 * @param str
 * @returns
 */
function isHelpChar(str) {
  if (
    [
      "b",
      "c",
      "d",
      "f",
      "g",
      "h",
      "j",
      "k",
      "l",
      "m",
      "n",
      "p",
      "q",
      "r",
      "s",
      "t",
      "v",
      "w",
      "x",
      // 暂且 y 视为辅音
      "y",
      "z",
    ].includes(str)
  ) {
    return true;
  }
  return false;
}
function isMainChar(str) {
  // 这是 5 个
  if (["a", "e", "i", "o", "u"].includes(str)) {
    return true;
  }
  return false;
}
/**
 * 该字符串内是否有元音
 */
function hasMainChar(str) {
  if (str === undefined) {
    return false;
  }
  return !!str.split("").find((char) => isMainChar(char));
}
/**
 * 该字符串内是否有辅音
 */
function hasHelpChar(str) {
  if (str === undefined) {
    return false;
  }
  return !!str.split("").find((char) => isHelpChar(char));
}
/**
 * 是否为开音节
 */
function isOpen(char, index, word) {
  if (!isMainChar(char)) {
    return false;
  }
  const last = word.slice(index + 1);
  // 单个元音字母后面没有辅音字母的音节
  if (!hasHelpChar(last)) {
    return true;
  }
  return false;
}
/**
 * 是否为闭音节
 */
function isClose(char, index, word) {
  if (!isMainChar(char)) {
    return false;
  }
  const last = word.slice(index + 1);
  if (!hasMainChar(last)) {
    return true;
  }
  return false;
}
/**
 * 是否为浊辅音
 */
function isDirty(char) {
  if (!a.includes(char) && !b.includes(char)) {
    return true;
  }
  return false;
}
/**
 * 前面是否已经有重音
 * 表示当前就不可能是重音
 * 当然这个方法
 */
function isNotWeight(i, word) {
  const prev = word.slice(0, i);
  if (hasMainChar(prev)) {
    return true;
  }
  return false;
}

const handlerMap = {
  a: ({ pp, p, n, nn, nnt, i, word, pn }) => {
    if (n === "r") {
      if (nn === "e") {
        // care dare share
        return ["eə", 2];
      }
      if (p === "w") {
        // warm towards
        return ["ɔ:", 1];
      }
      if (p === "u" && pp === "q") {
        // quarter
        return ["ɔ:", 1];
      }
      // arm art car farm park start
      return ["ɑ:", 1];
    }
    if (pn === "w") {
      // want what watch wash quality
      return ["ɒ"];
    }
    if (isNotWeight(i, word)) {
      // about breakfast orange village cabbage
      return [["ə", "ɪ"]];
    }
    if (["n", "f"].includes(n)) {
      // plant after
      return ["ɑ:"];
    }
    if (["ph", "sp", "sk", "ss", "st", "th"].includes(nnt)) {
      // graph grasp ask glass fast father bath
      return ["ɑ:"];
    }
    // name cake
    if (isClose("a", i, word)) {
      return ["eɪ"];
    }
    // bag dad
    return ["æ"];
  },
  e: ({ n, nn, i, word }) => {
    if (n === "r") {
      if (nn === "e") {
        if (["there", "where"].includes("word")) {
          // there where
          return ["eə"];
        }
        // here mere
        return ["ɪə", 2];
      }
      // certainly
      return ["ə:", 1];
    }
    if (isNotWeight(i, word)) {
      if (n === "n") {
        // dimensional
        return ["e"];
      }
      // hundred student open weekend before begin children
      return [["ə", "ɪ"]];
    }
    // he me
    if (isClose("e", i, word)) {
      return ["e"];
    }
    // bed egg
    return ["i:"];
  },
  i: ({ n, nn, nnt, i, word }) => {
    if (n === "r") {
      if (nn === "e") {
        // fire hire wire
        return ["aɪə", 2];
      }
      // bird
      return ["ə:", 1];
    }
    if (["nd", "ld", "gh"].includes(nnt)) {
      // find child light high
      return ["aɪ"];
    }
    if (isNotWeight(i, word)) {
      // April holiday beautiful animal
      return [["ə", "ɪ"]];
    }
    if (isClose("i", i, word)) {
      // fish big sit milk swim
      return ["ɪ"];
    }
    // bike time nice smile line Mike
    return ["aɪ"];
  },
  o: ({ p, n, nn, i, word }) => {
    if (n === "r") {
      if (nn === "e") {
        // more score before
        return ["ɔ:", 2];
      }
      if (p === "w") {
        // word world worse work
        return ["ə:", 1];
      }
      // forty morning short born
      return ["ɔ:", 1];
    }
    if (isNotWeight(i, word)) {
      if (["also", "zero", "photo"].includes(word)) {
        // oʊ
        return ["əʊ"];
      }
      // 或者 ɪ
      return ["ə"];
    }
    // 额外规则
    // most old cold
    if ((n === "s" && nn === "t") || (n === "l" && nn === "d")) {
      return ["əʊ"];
    }
    if (["m", "n", "v"].includes(n)) {
      // come love mother
      return ["ʌ"];
    }
    // close home
    if (!isClose("o", i, word)) {
      return ["əʊ"];
    }
    // not
    return ["ɒ"];
  },
  u: ({ p, token, n, nn, i, word }) => {
    if (isNotWeight(i, word)) {
      if (n === "r" && nn === "e") {
        // picture pleasure
        return ["ə", 2];
      }
      // 非重音特殊读音
      if (["popular", "congratulation", "January"].includes(word)) {
        return ["juː"];
      }
      // 非重音通用读音
      return [["ə", "ɪ"]];
    }
    // 重音元音字母组合发音
    if (n === "r") {
      if (nn === "e") {
        // pure cure
        return ["jʊə", 2];
      }
      // Thursday nurse
      return ["ɜː", 1];
    }
    if (isOpen(token, i, word)) {
      // 开音节
      if (["j", "l", "r", "s"].includes(p)) {
        // 辅音字母后
        // June blue ruler super
        return ["uː"];
      }
      // student excuse duty
      return ["juː"];
    }
    // bus cup jump much lunch
    return ["ʌ"];
  },
  b: ({ p, n, nn, i, word }) => {
    if (i === word.length - 1) {
      // climb bomb
      return [""];
    }
    // boy bus bike
    return ["b"];
  },
  c: ({ p, n, nn, i, word }) => {
    const isLast = n === undefined;
    /* 构成 ch 字母组合，会有三种读音 辅音字母组合 c 开头 start */
    if (n === "h") {
      // teacher much chick rich
      // tʃ

      // school headache chemistry
      // k

      // machine check
      // ʃ
      return ["ʃ", 1];
    }
    if (n === "k" && p !== undefined && nn === undefined) {
      // cock black knock
      return ["k", 1];
    }
    /* 辅音字母组合 c 开头 end */
    // 1、词尾
    if (isLast) {
      return ["k"];
    }
    // 3、a o u 前
    // 2、辅音字母前
    if (
      ["a", "o", "u"].includes(n) ||
      (isHelpChar(n) && !["h", "y"].includes(n))
    ) {
      return ["k"];
    }
    if (n === "y") {
      // cyber cylinder mercy juicy policy cyan
      return ["s"];
    }
    // 并且剩下的不是元音或者直接没有
    if (["e", "i"].includes(n) && !hasMainChar(word.slice(2)[0])) {
      // race cancel cinema recite exciting vaccine certain concern producer
      return ["s"];
    }
    // 重音落在 c 后面的元音上
    if (["e", "i"].includes(n) && hasMainChar(word.slice(2)[0])) {
      // cease decease panacea conceal proceed receive pharmaceutical society scion
      return ["s"];
    }
    // 重音不落在 c 后面的元音上 c[2]
    // fascia social appreciation sufficient conscience coercion delicious precious curvaceous 例外 glacier calcium pronunciation
    // if (["e", "i"].includes(n) && hasMainChar(work.slice(2)[0])) {
    //   return c[2];
    // }
    // 不发声
    // soccer
    return [""];
  },
  d: ({ n, nn, i, word }) => {
    /* d 开头的字母组合 start */
    if (n === "g" && nn === "e") {
      // bridge
      return ["dʒ", 2];
    }
    if (n === "r") {
      // children driver drink
      return ["dr", 1];
    }
    /* d 开头的字母组合 end */
    // day doctor bread hand
    return ["d"];
  },
  f: () => {
    // four five breakfast
    return ["f"];
  },
  g: ({ p, n, nn, i, word }) => {
    /* g 开头的字母组合 start */
    if (n === "h") {
      // light daughter high [''] - 不发音
      if (nn === "t") {
        return ["", 1];
      }
      if (nn === undefined) {
        return ["", 1];
      }
      // @todo sing g 在结尾也可能不发音，如果前面是 n，会被 ng 组合给跳过，有其他 g 结尾的例子吗？ dialog 不是
      // cough enough
      return ["f", 1];
    }
    if (i === 0 && n === "u" && nn !== undefined) {
      if (isNotWeight(i, word)) {
        // language anguish
        return ["gw"];
      }
      // guess
      return ["g", 1];
    }
    if (p !== undefined && n === "u" && nn === "e") {
      // dialogue
      return ["g", 2];
    }
    /* g 开头的字母组合 end */
    if (["e", "i", "y"].includes(n)) {
      // german orange rigid oxygen energy gym
      return ["dʒ"];
    }
    // go big bag
    return ["g"];
  },
  h: ({ n, word }) => {
    if (word === "hour") {
      // hour
      return [""];
    }
    // he house head rehearsal
    return ["h"];
  },
  j: () => {
    // July jeep job jump
    return ["dʒ"];
  },
  k: ({ n, nn, i, word }) => {
    if (n === "n" && nn !== undefined) {
      // know knife knock knowledge
      return ["n", 1];
    }
    // kind make week
    return ["k"];
  },
  l: () => {
    // like late ball
    return ["l"];
  },
  m: ({ p, n, nn }) => {
    if (p !== undefined && n === "n" && nn === undefined) {
      // autumn column solemn
      return ["m", 1];
    }
    // miss meet come
    return ["m"];
  },
  n: ({ p, n, nn }) => {
    if (p !== undefined && n === "g" && nn === undefined) {
      // morning sing young wrong
      return ["ŋ", 1];
    }
    if (["k", "g"].includes(n)) {
      // uncle thank sing
      return ["ŋ"];
    }
    return ["n"];
  },
  p: ({ n }) => {
    if (n === "h") {
      // elephant photo telephone
      return ["f", 1];
    }
    // pen pig ship paper plane
    return ["p"];
  },
  q: ({ n, nn }) => {
    if (n === "u" && nn !== undefined) {
      return ["kw", 1];
    }
    // Iraq
    return ["k"];
  },
  r: ({ pp, p, i, word }) => {
    // red read bread
    return ["r"];
  },
  s: ({ p, n, nn, i, word }) => {
    if (n === "c" && nn !== undefined) {
      // scare scarlet ['sk']
      if (nn === "a") {
        return ["sk", 1];
      }
      // muscle science
      return ["s", 1];
    }
    if (n === "h") {
      // she fish shirt wash
      return ["ʃ", 1];
    }
    if (n === "i") {
      return ["ʃ", 1];
    }
    if (i === 0) {
      // 词首
      // sit sleep
      return ["s"];
    }
    if (false) {
      // 清辅音前
      // desk last
      return ["s"];
    }
    if (isMainChar(p) && isMainChar(n)) {
      // 元音字母间
      // music museum
      return ["z"];
    }
    if (isDirty(addPhonetic(n))) {
      // 浊辅音前
      // husband
      return ["z"];
    }
    return ["s"];
  },
  t: ({ p, n, nn, i, word }) => {
    // @todo picture
    if (n === "c" && nn === "h" && word[i + 3] === undefined) {
      // watch
      return ["tʃ", 2];
    }
    if (n === "h") {
      if (["the", "these", "with", "than"].includes(word)) {
        // 在介词、代词、冠词、连词中
        // the these with than
        return ["ð", 1];
      }
      if (nn === "e" && p !== undefined) {
        // clothe
        return ["ð", 2];
      }
      if (nn === "e" && p !== undefined && word[i + 3] === "r") {
        // father weather
        return ["ð", 3];
      }
      // thin thirty third
      return ["θ", 1];
    }
    if (n === "r") {
      // tree train country truck
      return ["tr", 1];
    }
    if (n === "i") {
      // 自己猜测的
      // patient nation
      return ["ʃ"];
    }
    // table letter
    return ["t"];
  },
  v: () => {
    // very love
    return ["v"];
  },
  w: ({ n, nn, i, word }) => {
    if (n === "h" && nn !== undefined) {
      if (word[i + 3] === "o") {
        // who whose whole
        return ["h", 1];
      }
      // what when why white whale
      return ["w", 1];
    }
    if (n === "r") {
      // wrong write
      return ["r", 1];
    }
    if (["tow", "answer"].includes(word)) {
      return [""];
    }
    //
    return ["w"];
  },
  x: ({ n, word }) => {
    if (["example", "exist"].includes(word)) {
      // 在重读元音前
      // example exist
      return ["gz"];
    }
    // box text excuse
    return ["ks"];
  },
  y: ({ p }) => {
    if (p === "t") {
      return ["i"];
    }
    // yes yellow young
    return ["j"];
  },
  z: () => {
    // zoo zero lazy
    return ["z"];
  },
};

/**
 * 获取指定单词音标
 * @param {*} word
 * @returns
 */
export function addPhonetic(word) {
  if (word === undefined) {
    return "";
  }
  let i = 0;
  let token = word[i];
  let nextToken = word[i + 1];
  let prevToken = word[i - 1];
  let ppToken = word[i - 2];
  let nnToken = word[i + 2];
  let result = "";

  function n(extraStep = 0) {
    i += 1 + extraStep;
    token = word[i];
    nextToken = word[i + 1];
    ppToken = word[i - 2];
    prevToken = word[i - 1];
    nnToken = word[i + 2];
  }

  while (token) {
    // console.log(token);
    const handler = handlerMap[token];
    const [a, b = 0] = handler({
      // 当前字符
      token,
      // 当前字符前两个
      pp: ppToken,
      // 当前字符前一个
      p: prevToken,
      // 当前字符后面第一个
      n: nextToken,
      // 当前字符后面第二个
      nn: nnToken,
      // 当前字符后面第一个与第二个
      nnt: nextToken + nnToken,
      // 当前字符在单词的下标
      i,
      // 完整单词
      word,
      // 当前字符前一个音标
      pn: result.slice(-1)[0],
    });
    if (Array.isArray(a)) {
      result += "?";
    } else {
      result += a;
    }
    n(b);
  }

  return replaceMagicStr(result);
}
function replaceMagicStr(str) {
  const segments = str.split("?");
  if (segments.length === 1) {
    return str;
  }
  return [str.replace("?", "ə"), str.replace("?", "ɪ")];
}

// https://zhuanlan.zhihu.com/p/364365898

const result = addPhonetic("dimensional");

console.log(result);
