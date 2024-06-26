import { qs } from "@list/core";

function a(r, o) {
  for (var t = 0; t < o.length - 2; t += 3) {
    var a = o.charAt(t + 2);
    (a = a >= "a" ? a.charCodeAt(0) - 87 : Number(a)),
      (a = "+" === o.charAt(t + 1) ? r >>> a : r << a),
      (r = "+" === o.charAt(t) ? (r + a) & 4294967295 : r ^ a);
  }
  return r;
}
var C = null;
var t = function (r, _gtk) {
  var o = r.length;
  o > 30 &&
    (r =
      "" +
      r.substr(0, 10) +
      r.substr(Math.floor(o / 2) - 5, 10) +
      r.substring(r.length, r.length - 10));
  var t = void 0,
    t = null !== C ? C : (C = _gtk || "") || "";
  for (
    var e = t.split("."),
      h = Number(e[0]) || 0,
      i = Number(e[1]) || 0,
      d = [],
      f = 0,
      g = 0;
    g < r.length;
    g++
  ) {
    var m = r.charCodeAt(g);
    128 > m
      ? (d[f++] = m)
      : (2048 > m
          ? (d[f++] = (m >> 6) | 192)
          : (55296 === (64512 & m) &&
            g + 1 < r.length &&
            56320 === (64512 & r.charCodeAt(g + 1))
              ? ((m = 65536 + ((1023 & m) << 10) + (1023 & r.charCodeAt(++g))),
                (d[f++] = (m >> 18) | 240),
                (d[f++] = ((m >> 12) & 63) | 128))
              : (d[f++] = (m >> 12) | 224),
            (d[f++] = ((m >> 6) & 63) | 128)),
        (d[f++] = (63 & m) | 128));
  }
  for (var S = h, u = "+-a^+6", l = "+-3^+b+-f", s = 0; s < d.length; s++)
    (S += d[s]), (S = a(S, u));
  return (
    (S = a(S, l)),
    (S ^= i),
    0 > S && (S = (2147483647 & S) + 2147483648),
    (S %= 1e6),
    S.toString() + "." + (S ^ h)
  );
};

let cachedToken = null;
let cachedGtk = null;
let cachedCookie = null;
const TOKEN_REGEXP = /token: '(.+)',/;
const GTK_REGEXP = /window\.gtk = '(.+)'/;
async function getTokenAndGTK(opts: { force?: boolean } = {}) {
  const { force = false } = opts;
  console.log(
    "[BAIDU]getTokenAndGTK check match cache",
    cachedToken && cachedGtk && cachedCookie
  );
  if (cachedToken && cachedGtk && cachedCookie && !force) {
    return {
      token: cachedToken,
      gtk: cachedGtk,
      cookie: cachedCookie,
    };
  }
  const headers = {
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "cache-control": "max-age=0",
    "sec-ch-ua":
      '" Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "upgrade-insecure-requests": "1",
    Cookie: undefined,
    Referer: "https://fanyi.baidu.com/translate",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  };
  // console.log("[]Do not matched the cache, request again.", c);
  let resp = await fetch("https://fanyi.baidu.com/translate", {
    headers,
    body: null,
    method: "GET",
  });
  const cookie = resp.headers.get("set-cookie");
  console.log("[BAIDU]initialize request to get cookie", cookie);

  if (cookie) {
    const ttt = cookie.split(";")[0];
    headers.Cookie = ttt;
  }
  // console.log("[]Do not matched the cache, request again.", c);
  resp = await fetch("https://fanyi.baidu.com/translate", {
    headers,
    body: null,
    method: "GET",
  });
  const data = await resp.text();
  const token = data.match(TOKEN_REGEXP);
  const gtk = data.match(GTK_REGEXP);

  console.log(
    "[BAIDU]request baidu with cookie, then get token and gtk",
    !!token,
    !!gtk
  );

  if (token !== null && gtk !== null) {
    const tt = token[1];
    const gg = gtk[1];
    cachedToken = tt;
    cachedGtk = gg;
    cachedCookie = headers.Cookie;
    // console.log("[]cache token and gtk", cachedToken, cachedGtk);
    return {
      token: tt,
      gtk: gg,
      cookie: headers.Cookie,
    };
  }
  return null;
}

let count = 0;
export async function translate(word, force = false) {
  // const tokenAndGTK = await getTokenAndGTK({ force });

  // if (tokenAndGTK === null) {
  //   return null;
  // }

  // const { token, gtk, cookie } = tokenAndGTK;
  const cookie = "BAIDUID=6137ECF8D1F677814796CDCFF4D9485E:FG=1;";
  const token = "982b29a4f0a7492370855353bae10c4e";
  const gtk = "320305.131321201";
  const sign = t(word, gtk);
  console.log(
    "[BAIDU]invoke translate api with cookie",
    cookie,
    token,
    gtk,
    sign,
    word
  );
  const body = qs.stringify({
    from: "zh",
    to: "en",
    query: word,
    transtype: "translang",
    simple_means_flag: 3,
    sign,
    token,
    domain: "common",
  });
  const resp = await fetch("https://fanyi.baidu.com/v2transapi?from=zh&to=en", {
    headers: {
      accept: "*/*",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "sec-ch-ua":
        '" Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest",
      Cookie: cookie,
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body,
    method: "POST",
  });
  const data = await resp.json();
  if (data.errno) {
    if (count >= 2) {
      count = 0;
      return data;
    }
    count += 1;
    return translate(word, true);
  }
  return parseBaiduResult(data);
}

function parseBaiduResult(result) {
  if (result === null) {
    return null;
  }
  if (result.trans_result === undefined) {
    return null;
  }
  // dict_result 不一定有，如果输入的单词拼写有问题，查询不出来，就没有 dict_result
  const { trans_result, dict_result } = result;
  if (dict_result === undefined) {
    // if (trans_result.data && trans_result.data.length > 0) {
    //   console.log(trans_result.data[0]);
    //   return {
    //     word: trans_result.data[0].src,
    //     memory_skill: "",
    //     explains: [trans_result.data[0].dst],
    //   };
    // }
    return null;
  }
  const { simple_means } = dict_result;
  const { exchange, collins, memory_skill, symbols } = simple_means;
  const symbol = symbols[0];
  return {
    word: simple_means.word_name,
    memory_skill,
    explains: (() => {
      if (simple_means.word_means) {
        return simple_means.word_means;
      }
      if (symbol?.parts && symbol?.parts[0]) {
        return symbol.parts[0].means;
      }
    })(),
    speeches: {
      en: symbol.ph_en,
      am: symbol.ph_am,
    },
    parts: symbol.parts.map((p) => {
      const { part, means } = p;
      return {
        type: part,
        means: means.join("；"),
      };
    }),
  };
}
