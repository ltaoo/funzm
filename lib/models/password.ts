import { User, Credential } from ".prisma/client";

import * as utils from "@/lib/utils";
import { PBKDF2 } from "@/lib/utils/crypto";
import type { UID } from "@/lib/utils";

export type SALT = UID<128>;
export type PASSWORD = UID<64>;
export type TOKEN = UID<100>;

/**
 * Generate a new `UID<128>` value.
 * @NOTE This is a `user`-specific password salter.
 */
export const salt = () => utils.uid(128) as SALT;

/**
 * Hash a raw `password` string.
 * Applies `PBKDF2` with a SHA256 hexadecimal digest.
 */
export function hash(password: string, salt: SALT): Promise<PASSWORD> {
  return PBKDF2("SHA-256", password, salt, 1000, 64).then(
    utils.toHEX
  ) as Promise<PASSWORD>;
}

/**
 * Determine if the incoming `password` matches the `User.password` value.
 */
export async function compare(
  user: Credential,
  password: PASSWORD | string
): Promise<boolean> {
  return (await hash(password, user.salt as SALT)) === user.password;
}

/**
 * Prepare a new password for storage
 */
export async function prepare(password: string) {
  const token = salt();
  const hashed = await hash(password, token);
  return { salt: token, password: hashed };
}

/**
 * 开始「忘记密码」流程
 * Insert a new `reset::{token}` document.
 * @NOTE Initiates the "Password Reset" pipeline.
 */
export async function forgot(user: User): Promise<boolean> {
  // Create new TOKENs until find unused value
  //   const token = await utils.until(toUID, find);

  // Persist the TOKEN value to storage; auto-expire after 12 hours (in secs)
  //   await database.write(toKID(token), user.uid, { expirationTtl: 12 * 60 * 60 });
  //   await client.

  // TODO: send email to `user.email` with reset link

  return true;
}
