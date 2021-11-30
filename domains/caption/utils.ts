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
