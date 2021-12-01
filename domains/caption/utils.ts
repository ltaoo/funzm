const key = "tmp-caption";
class CaptionTempStorage {
  constructor() {}

  save(caption) {
    localStorage.setItem(key, JSON.stringify(caption));
  }
  read() {
    try {
      const caption = JSON.parse(localStorage.getItem(key) || "null");
      //       localStorage.removeItem(key);
      return caption;
    } catch (err) {
      return null;
    }
  }

  clear() {
    localStorage.removeItem(key);
  }
}

export default new CaptionTempStorage();

/**
 * 将一段英文分割成单词
 * @param text2
 */
export function splitText2(text2: string): string[][] {
  const words = text2.split(" ");
  const result = [];
  for (let i = 0; i < words.length; i += 1) {
    const word = words[i];
    const matched = word.match(/(^[^\w\s]*)(.*?)([^\w\s]*?$)/);
    if (matched === null) {
      result.push([word]);
    } else {
      const [, prefix, w, suffix] = matched;
      result.push([prefix, w, suffix]);
    }
  }
  return result;
}
