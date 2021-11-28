/**
 * @file 用户服务
 */
import "@/lib/utils/polyfill";

import { HS256 } from "worktop/jwt";

import prisma from "@/lib/client";
import * as utils from "@/lib/utils";
import { UID } from "@/lib/utils";

import type { Handler } from "@/lib/context";

import * as Password from "./password";
import * as Email from "./email";
import { PASSWORD, SALT } from "./password";

export type UserID = UID<16>;
export interface User {
  id?: number;
  uid: UserID;
  email: string;
  nickname: Nullable<string>;
  avatar: Nullable<string>;
  created_at: TIMESTAMP;
  last_updated: Nullable<TIMESTAMP>;
  password: PASSWORD;
  salt: SALT;
}

// Authentication attributes
export interface Credentials {
  email: string;
  password: string;
}

// ID helpers to normalize ID types/values
export const toUID = () => utils.uid(16) as UserID;
export const toKID = (uid: UserID) => `users::${uid}`;
export const isUID = (x: string | UserID): x is UserID => x.length === 16;

export interface TokenData {
  uid: User["uid"];
  salt: User["salt"];
}

// The JWT factory
// NOTE: tokens expire in 24 hours
export const JWT = HS256<TokenData>({
  key: JWT_SECRET,
  expires: 24 * 60 * 60, // 24 hours
});

/**
 * Find a `User` document by its `uid` value.
 */
export function findUserService(uid: UserID) {
  return prisma.user.findUnique({
    where: { uid },
  });
}

/**
 * Save/Overwrite the `User` document.
 */
export async function saveUserService(user: User): Promise<boolean> {
  await prisma.user.create({
    data: user,
  });
  return true;
}

/**
 * Create a new `User` document from a `Credentials` set.
 * @NOTE Handles `password`, `salt`, and `uid` values.
 * @TODO throw w/ message instead of early returns?
 */
type Insert = Omit<Partial<User>, "email" | "password"> & Credentials;
export async function addUserService(values: Insert): Promise<User | void> {
  // Generate a new salt & hash the original password
  const { password, salt } = await Password.prepare(values.password);

  // Create new `UserID`s until available
  const nxtUID = await utils.until(toUID, findUserService);

  const user: User = {
    uid: nxtUID,
    email: values.email,
    nickname: values.nickname || values.email,
    avatar: null,
    password,
    salt,
    created_at: utils.seconds(),
    last_updated: null,
  };

  // Create the new User record
  if (!(await saveUserService(user))) return;

  // Create public-facing "emails::" key for login
  if (!(await Email.saveEmailService(user))) return;

  return user;
}

/**
 * Format a User's full name
 */
export function fullname(user: User): string {
  let name = user.nickname || "";
  // if (user.lastname) name += " " + user.lastname;
  return name;
}

/**
 * Update a `User` document with the given `changes`.
 * @NOTE Handles `password`, `salt`, and `uid` values.
 * @TODO Implement email sender for email/password changes.
 */
type UserChanges = Partial<Omit<User, "password"> & { password: string }>;
export async function update(
  user: User,
  changes: UserChanges
): Promise<User | void> {
  const hasPassword = changes.password && changes.password !== user.password;
  const prevFullname = fullname(user);
  const prevEmail = user.email;

  // Explicitly choose properties to update
  // ~> AKA, do not allow `uid` or `created_at` updates
  user.nickname = changes.nickname || user.nickname;
  // user.lastname = changes.lastname || user.lastname;
  user.email = changes.email || user.email;
  user.last_updated = utils.seconds();

  if (hasPassword) {
    const sanitized = await Password.prepare(changes.password!);
    user.password = sanitized.password;
    user.salt = sanitized.salt;
  }

  if (!(await saveUserService(user))) return;

  if (user.email !== prevEmail) {
    await Promise.all([
      Email.removeEmailService(prevEmail),
      Email.saveEmailService(user),
    ]);

    // Send "email changed" alert
    // await emails.contact(prevEmail);
  }

  if (hasPassword) {
    // send "password changed" alert
    // await emails.password(prevEmail);
  }

  // Forward any display details to Stripe
  // if (user.email !== prevEmail || prevFullname !== fullname(user)) {
  //   await Customers.update(user.stripe.customer, {
  //     email: user.email,
  //     name: fullname(user),
  //   });
  // }

  return user;
}

/**
 * Format a `User` document for public display
 * @NOTE Ensures `password` & `salt` are never public!
 */
export function output(user: User) {
  const { uid, nickname, avatar, email, created_at, last_updated } = user;
  return { uid, nickname, avatar, email, created_at, last_updated };
}

/**
 * Format a `User` document for Auth response
 */
export async function respond(code: number, user: User): Promise<Response> {
  return utils.send(code, {
    token: await JWT.sign(user),
    user: output(user),
  });
}

/**
 * Authentication middleware
 * Identifies a User via incoming `Authorization` header.
 */
export const authenticate: Handler = async function (req, context) {
  let auth = req.headers.get("authorization");
  if (!auth) return utils.send(401, "Missing Authorization header");

  let [schema, token] = auth.split(/\s+/);
  if (!token || schema.toLowerCase() !== "bearer") {
    return utils.send(401, "Invalid Authorization format");
  }

  try {
    var payload = await JWT.verify(token);
  } catch (err) {
    return utils.send(401, (err as Error).message);
  }

  // Does `user.uid` exist?
  let user = await findUserService(payload.uid);
  // NOTE: user salt changes w/ password
  // AKA, mismatched salt is forgery or pre-reset token
  if (!user || payload.salt !== user.salt) {
    return utils.send(401, "Invalid token");
  }

  context.user = user;
};
