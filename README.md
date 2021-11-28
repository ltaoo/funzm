This is a starter template for [Learn Next.js](https://nextjs.org/learn).

## 创建 Mysql 表

```sql
/* 请确认以下SQL符合您的变更需求，务必确认无误后再提交执行 */

CREATE TABLE `caption` (
	`id` int NOT NULL COMMENT '自增id',
	`uid` linestring NOT NULL COMMENT '外部查询id',
	`name` linestring NOT NULL COMMENT '字幕名',
	`content` multilinestring NOT NULL COMMENT '字幕内容',
	`created` datetime NOT NULL COMMENT '创建时间',
	PRIMARY KEY (`id`,`uid`),
	KEY `name`(`name`)
) ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8
COMMENT='字幕';
```
