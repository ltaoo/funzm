/**
 * 从本地文件中读取文本内容
 * @param file
 * @param encoding
 * @returns
 */
export function readContentFromFile(
  file: File,
  encoding = "utf-8"
): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target.result instanceof ArrayBuffer) {
        resolve(String(e.target.result));
        return;
      }
      resolve(e.target.result);
    };
    reader.readAsText(file, encoding);
  });
}
