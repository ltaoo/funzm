import crypto from "crypto";

import axios from "axios";

const appId = process.env.YOU_DAO_APP_KEY;
const secretKey = process.env.YOU_DAO_SECRET_KEY;
const from = "en";
const to = "zh-CHS";

function truncate(q) {
  var len = q.length;
  if (len <= 20) return q;
  return q.substring(0, 10) + len + q.substring(len - 10, len);
}

function getRandomN(roundTo) {
  return Math.round(Math.random() * roundTo);
}

function md5(str) {
  var crypto_md5 = crypto.createHash("md5");
  crypto_md5.update(str);
  return crypto_md5.digest("hex");
}

function generateUrlParams(_params) {
  const paramsData = [];
  for (const key in _params) {
    if (_params.hasOwnProperty(key)) {
      paramsData.push(key + "=" + _params[key]);
    }
  }
  const result = paramsData.join("&");
  return result;
}

// 发音，后面加单词即可
// http://dict.youdao.com/dictvoice?type=0&audio=table

export async function translate(word) {
  let youdaoHost = "http://openapi.youdao.com/api";
  // 在get请求中，中文需要进行uri编码
  let encodeURIWord = encodeURI(word);
  let salt = getRandomN(1000);
  let sign = md5(appId + word + salt + secretKey);
  let paramsJson = {
    q: encodeURIWord,
    from,
    to,
    appKey: appId,
    salt: salt,
    sign: sign,
  };
  // let url = `http://openapi.youdao.com/api?q=${encodeURI(q)}&from=${from}&to=${to}&appKey=${appKey}&salt=${salt}&sign=${sign}`;
  let url = youdaoHost + "?" + generateUrlParams(paramsJson);
  let result = await axios.get(url);
  const { tSpeakUrl, basic } = result.data;
  return {
    word,
    explains: basic.explains,
    speeches: [
      {
        text: basic["us-phonetic"],
        voice: basic["us-speech"],
      },
      // { text: basic["phonetic"] },
      { text: basic["uk-phonetic"], voice: basic["uk-speech"] },
    ],
  };
}

export function translat(word) {
  const salt = new Date().getTime();
  const curtime = Math.round(new Date().getTime() / 1000);
  const str1 = appId + truncate(word) + salt + curtime + secretKey;
  const sign = crypto.createHash("md5").update(str1).digest("hex");
  //   const sign = SHA256(str1);
  //   var sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex);
  //   console.log(salt, str1, sign);
  return axios
    .post("https://openapi.youdao.com/api", {
      method: "POST",
      //       dataType: "jsonp",
      body: {
        q: encodeURI(word),
        appKey: appId,
        salt,
        from,
        to,
        sign,
        signType: "v3",
        curtime,
      },
    })
    .then(({ data }) => {
      console.log(data);
      return {
        word,
      };
    });
}
