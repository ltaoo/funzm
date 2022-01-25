/**
 * @file 将静态资源上传至 cdn
 * https://developer.qiniu.com/kodo/sdk/nodejs
 */
import path from "path";

import qiniu from "qiniu";
import { v4 as uuid } from "uuid";

const ROOT = path.resolve(__dirname, "../");

const accessKey = "HriJcPNneVwy8gZWB_QAB-hxswRtk1zFWSbYVlUu";
const secretKey = "Ku0DYLqYWO6GLhKiixvTLFeluU0hSc7itJvc6eIJ";
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const options = {
  scope: "funzm-static",
};
const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);
const config = new qiniu.conf.Config();

// @ts-ignore
config.zone = qiniu.zone.Zone_z2;

const formUploader = new qiniu.form_up.FormUploader(config);

/**
 * 添加域名
 * @param body
 * @returns
 */
function addUrl(body) {
  return { ...body, url: `//static.funzm.com/${body.key}` };
}

/**
 * 上传文件
 * @param filepath
 * @param extraOptions
 * @returns
 */
export function upload(filepath, extraOptions = {}) {
  return uploadFile(filepath, extraOptions);
}
/**
 * 上传本地文件
 * @param filepath
 * @param extraOptions
 * @returns
 */
export function uploadFile(
  filepath,
  extraOptions: { key?: string; replacement?: (key?: string) => string } = {}
) {
  const { key, replacement } = extraOptions;
  return new Promise((resolve, reject) => {
    const putExtra = new qiniu.form_up.PutExtra();

    formUploader.putFile(
      uploadToken,
      replacement ? replacement(key) : key,
      filepath,
      putExtra,
      (respErr, respBody, respInfo) => {
        if (respErr) {
          reject(respErr);
          return;
        }
        if (respInfo.statusCode == 200) {
          resolve(addUrl(respBody));
          return;
        }
        reject(respBody);
      }
    );
  });
}

const putExtra = new qiniu.form_up.PutExtra();

export function uploadStream(readableStream) {
  const key = uuid();
  return new Promise((resolve, reject) => {
    formUploader.putStream(
      key,
      uploadToken,
      readableStream,
      putExtra,
      (respErr, respBody, respInfo) => {
        if (respErr) {
          return reject(respErr);
        }
        const { statusCode } = respInfo;
        if (statusCode == 200) {
          resolve(respBody);
          return;
        }
        reject(new Error(respBody));
      }
    );
  });
}
