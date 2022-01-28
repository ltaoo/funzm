export const SLOGAN = "让你看过的每一集美剧都帮助你学好英语";
export const TAB_TITLE_SUFFIX = `趣字幕 ${SLOGAN}`;

export const isProd = (() => {
  if (typeof window === "object") {
    if (window && window.location.href.includes("funzm.com")) {
      return true;
    }
  }
  if (process.env.prod) {
    return true;
  }
  return true;
})();

export enum WeappQrcodeStatus {
  Wait = 1,
  Confirmed = 2,
  Expired = 3,
}
