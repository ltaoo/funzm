const { Client } = require("ssh2");

/**
 * 初始化 ssh 连接
 * @param {{ username: string; password: string; host: string; port: number }} config
 * @returns
 */
function initSSH(config) {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn
      .on("ready", () => {
        function exec(command, { onError, onMessage, onComplete } = {}) {
          return new Promise((res, rej) => {
            let result = "";
            conn.exec(command, (err, stream) => {
              if (err) {
                if (onError) {
                  onError(err);
                }
                return;
              }
              stream
                .on("close", (code, signal) => {
                  //   console.log("[]close");
                  if (onComplete) {
                    onComplete(result);
                  }
                  res(result);
                  result = "";
                })
                .on("data", (data) => {
                  result += String(data);
                  if (onMessage) {
                    onMessage(data);
                  }
                })
                .stderr.on("data", (data) => {
                  result += String(data);
                  if (onMessage) {
                    onMessage(data);
                  }
                  console.log("[]err data", String(data));
                  // if (onError) {
                  //   onError(data);
                  // }
                  // rej(data);
                });
            });
          });
        }
        conn.run = exec;
        resolve(conn);
      })
      .on("error", (err) => {
        console.log("Connect ssh failed, because ", err.message);
        reject(err);
      })
      .connect(config);

    return conn;
  });
}

async function deploy() {
  const client = await initSSH({
    host: "120.26.201.239",
    username: "root",
    password: "Li1218040201.",
  });
  await client.run(
    "cd ~/Documents/funzm && git pull && yarn && yarn start && node ./scripts/qiniu && pm2 restart funzm"
  );
  process.exit(0);
}

deploy();
