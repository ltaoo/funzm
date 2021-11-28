/**
 * @file 数据库连接
 */
// import mysql from "mysql2";
import prisma from "./client";

// const pendingQueue: (() => void)[] = [];
// // create the connection to database
// let connection = null;
// (() => {
//   connection = mysql.createConnection({
//     host: "rm-bp1rzk2qoex2351o6vo.mysql.rds.aliyuncs.com",
//     user: "litao",
//     password: "Li1218040201",
//     database: "caption-learning",
//   });
//   if (pendingQueue.length === 0) {
//     return;
//   }
//   while (pendingQueue.length) {
//     const curJob = pendingQueue.pop();
//     curJob();
//   }
// })();

/**
 * sql 执行
 * @param sql
 * @returns
 */
// export function request(sql: string) {
//   return new Promise((resolve, reject) => {
//     const job = async () => {
//       connection.query(sql, (err, results, fields) => {
//         if (err) {
//           reject(err);
//           return;
//         }
//         // results contains rows returned by server
//         resolve(results);
//         // fields contains extra meta data about results, if available
//       });
//     };
//     if (connection === null) {
//       pendingQueue.push(job);
//       return;
//     }
//     job();
//   });
// }

// export function login() {
//   connection.query(
//     'SELECT * FROM `caption-leraning` WHERE `name` = "Page" AND `age` > 45',
//     function (err, results, fields) {
//       console.log(results); // results contains rows returned by server
//       console.log(fields); // fields contains extra meta data about results, if available
//     }
//   );
// }

/**
 * 获取字幕列表
 */
export function fetchCaptionsService() {
  return prisma.caption.findMany();
}

/**
 * 新增字幕
 */
export function addCaptionService({ title, content }) {
  // const timestamp = new Date().valueOf();
  return prisma.caption.create({
    data: {
      title,
      content,
    },
  });
}
