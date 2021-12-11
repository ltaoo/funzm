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
