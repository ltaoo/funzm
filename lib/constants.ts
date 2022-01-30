export const INCORRECT_PASSWORD = 402;

export const SERVER_ERROR_CODES = {
  300: "记录不存在",
  400: "邮箱不存在",
  401: "请先登录",
  [INCORRECT_PASSWORD]: "密码错误",
  403: "邮箱已存在",
  404: "注册失败",

  // 通用错误
  10001: "参数类型错误",
  10002: "请求过于频繁",
  10003: "数据不存在",
  10004: "时间范围不能超过一个月",
  10005: "结束时间不能小于开始时间",

  // 用户相关错误
  11000: "账号已存在，不能重复注册",
  11001: "未知用户，请退出重新登录",
  11002: "该二维码已过期",

  // 字幕相关错误
  12000: "",
  12001: "没有权限查看该字幕",

  // 测验相关错误
  13000: "测验数据不存在，请确认 id 是否正确",
  13001: "存在进行中的测验，无法开始新测验",
  13002: "测验已结束，无法再次结束",

  // 翻译
  14000: "请输入要翻译的内容",
};
