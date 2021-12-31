/**
 * @file 将静态资源上传至 cdn
 * https://developer.qiniu.com/kodo/sdk/nodejs
 */
const fs = require("fs");
const cp = require("child_process");
const path = require("path");

const qiniu = require("qiniu");

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
config.zone = qiniu.zone.Zone_z2;
const formUploader = new qiniu.form_up.FormUploader(config);

/**
 * 添加域名
 * @param body
 * @returns
 */
function addUrl(body) {
  console.log("[addUrl]", body.key);
  return { ...body, url: `//static.funzm.com/${body.key}` };
}

/**
 * 上传文件
 * @param filepath
 * @param extraOptions
 * @returns
 */
function upload(filepath, extraOptions = {}) {
  return uploadFile(filepath, extraOptions);
}
/**
 * 上传文件
 * @param filepath
 * @param extraOptions
 * @returns
 */
function uploadFile(filepath, extraOptions = {}) {
  const { hash, replacement } = extraOptions;
  return new Promise((resolve, reject) => {
    const { dir, base } = path.parse(filepath);
    const putExtra = new qiniu.form_up.PutExtra();
    const key = `${hash}${dir.replace(ROOT, "")}/${base}`;
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

function resolve(...paths) {
  return path.resolve(ROOT, ...paths);
}

function isFile(dir) {
  try {
    const stats = fs.statSync(dir);
    if (stats.isFile()) {
      return true;
    }
  } catch (err) {
    // ...
  }
  return false;
}

const ignore = [".DS_Store"];

function getFiles(dir) {
  const files = fs
    .readdirSync(dir)
    .filter((file) => !ignore.includes(file))
    .map((file) => `${dir}/${file}`);
  let result = [];
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    if (isFile(file)) {
      result.push(file);
    } else {
      result = result.concat(getFiles(file));
    }
  }
  return result;
}

(async () => {
  const dir = resolve("./.next/static");
  const commit = cp.execSync('git log -1 --pretty=format:"%H"');
  const files = getFiles(dir);
  for (let i = 0; i < files.length; i += 1) {
    const { url } = await upload(files[i], {
      hash: commit.toString(),
      replacement: (filename) => filename.replace(/\.next/, "_next"),
    });
    console.log(url);
  }
})();
