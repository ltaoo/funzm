// 请求原始响应
export interface RequestResponse {
  [key: string]: any;
}
// 查询参数
export interface Search {
  [key: string]: any;
}
// 对外暴露的响应值
export interface Response<T> {
  dataSource: T[];
  page: number;
  pageSize: number;
  total: number;
  // 查询参数
  search: Search;
  // 状态参数
  initial: boolean;
  noMore: boolean;
  loading: boolean;
  refreshing?: boolean;
  error?: Error;
  [key: string]: any;
}

export type OriginalResponseProcessor = <T>(
  originalResponse: RequestResponse
) => Omit<Response<T>, "dataSource" | "page" | "pageSize" | "noMore" | "error">;
// 响应处理器
export type ResponseProcessor = <T>(
  response: Omit<
    Response<T>,
    "dataSource" | "page" | "pageSize" | "noMore" | "error"
  >,
  originalResponse: RequestResponse
) => Omit<Response<T>, "dataSource" | "page" | "pageSize" | "noMore" | "error">;
// 参数处理器
export type ParamsProcessor = (
  params: FetchParams,
  currentParams: any
) => FetchParams;
// 请求参数
export interface FetchParams extends Search {
  page?: number;
  pageSize?: number;
}

export type ListHelperPlugin<T = any> = (
  api: PluginAPI,
  helper: Helper<T>
) => void;

export interface InitialOptions {
  debug?: boolean;
  plugins?: ListHelperPlugin[];

  rowKey?: string;

  beforeRequest?: ParamsProcessor;
  processor?: ResponseProcessor;
  dataSource?: any[];
  search?: Search;
  page?: number;
  pageSize?: number;

  extraDefaultResponse?: Record<string, any>;

  [key: string]: any;
}
export interface IExtraOptions {
  // 是否初始化请求
  init?: boolean;
  // 是否是无限加载请求
  concat?: boolean;
}

import { EnableBy } from "./enums";
import PluginAPI from "./plugin";
import Helper from "./core";

export type IServicePathKeys =
  | "cwd"
  | "absNodeModulesPath"
  | "absOutputPath"
  | "absSrcPath"
  | "absPagesPath"
  | "absTmpPath";

export type IServicePaths = {
  [key in IServicePathKeys]: string;
};

export interface IDep {
  [name: string]: string;
}

export interface IPackage {
  name?: string;
  dependencies?: IDep;
  devDependencies?: IDep;
  [key: string]: any;
}

export interface IPlugin {
  id: string;
  // Currently only used for config
  key: string;
  path: string;
  apply: Function;

  config?: IPluginConfig;
  isPreset?: boolean;
  enableBy?: EnableBy | Function;
}

export interface IPluginConfig {
  default?: any;
  // schema?: {
  //   (joi: joi.Root): joi.Schema;
  // };
  onChange?: string | Function;
}

export interface IPreset extends IPlugin {}

export interface IHook {
  // PluginName 标志来源
  name?: string;
  key: string;
  fn: Function;
  pluginId?: string;
  before?: string;
  stage?: number;
}

export interface ICommand {
  name: string;
  alias?: string;
  description?: string;
  details?: string;
  // fn: {
  //   ({ args }: { args: yargs.Arguments }): void;
  // };
}
