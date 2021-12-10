const key = "tmp-caption";

class CaptionTempStorage {
  constructor() {}

  save(caption) {
    localStorage.setItem(key, JSON.stringify(caption));
  }
  read() {
    try {
      const content = localStorage.getItem(key);
      const caption = JSON.parse(content || "null");
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
