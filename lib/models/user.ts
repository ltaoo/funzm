/**
 * @file 用户服务
 */
import { User } from ".prisma/client";

import prisma from "@/lib/prisma";
import * as utils from "@/lib/utils";

import { getSession } from "next-auth/client";

import * as Password from "./password";

// Authentication attributes
export interface Credentials {
  email: string;
  password: string;
}

/**
 * Find a `User` document by its `uid` value.
 */
export function findUserService(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}
export function findUserByEmailService(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}

/**
 * Create a new `User` document from a `Credentials` set.
 * @NOTE Handles `password`, `salt`, and `uid` values.
 * @TODO throw w/ message instead of early returns?
 */
type UserValues = Omit<Partial<User>, "email" | "password"> & Credentials;
export async function addUserService(values: UserValues): Promise<User> {
  const { password, salt } = await Password.prepare(values.password);

  const user = {
    email: values.email,
    emailVerified: values.emailVerified,
    name: values.name || values.email,
    avatar: null,
    password,
    salt,
    created_at: utils.seconds(),
    last_updated: null,
  };

  // Create the new User record
  const createdUser = await prisma.user.create({
    data: user,
  });
  // if (!createdUser) return;

  return createdUser;
}

/**
 * Format a User's full name
 */
export function fullname(user: User): string {
  let name = user.name || "";
  // if (user.lastname) name += " " + user.lastname;
  return name;
}

/**
 * Update a `User` document with the given `changes`.
 * @NOTE Handles `password`, `salt`, and `uid` values.
 * @TODO Implement email sender for email/password changes.
 */
type UserChanges = Partial<Omit<User, "password"> & { password: string }>;
export async function updateUserService(
  user: User,
  changes: UserChanges
): Promise<User | void> {
  const hasPassword = changes.password && changes.password !== user.password;
  const prevEmail = user.email;

  // Explicitly choose properties to update
  // ~> AKA, do not allow `uid` or `created_at` updates
  user.name = changes.name || user.name;
  // user.lastname = changes.lastname || user.lastname;
  user.email = changes.email || user.email;
  user.last_updated = utils.seconds();

  if (hasPassword) {
    const sanitized = await Password.prepare(changes.password!);
    user.password = sanitized.password;
    user.salt = sanitized.salt;
  }

  // if (!(await saveUserService(user))) return;

  // if (user.email !== prevEmail) {
  //   await Promise.all([
  //     Email.removeEmailService(prevEmail),
  //     Email.saveEmailService(user),
  //   ]);
  // }

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
 * Format a `User` document for Auth response
 */
export async function respond(user: User): Promise<{}> {
  const {
    id: uid,
    name: nickname,
    avatar,
    email,
    created_at,
    last_updated,
  } = user;
  // console.log("response user after login", user);
  const responseUser = {
    uid,
    nickname,
    avatar,
    email,
    created_at,
  };
  return responseUser;
  // return {
  //   token: await JWT.sign(user),
  //   user: responseUser,
  // };
}

/**
 * 认证中间件
 * Authentication middleware
 * Identifies a User via incoming `Authorization` header.
 */
export const authenticate = async function (req, res) {
  // let auth = req.headers.get("authorization");
  const session = await getSession({ req });
  if (!session) {
    return res
      .status(200)
      .json({ code: 401, msg: "Invalid Authorization header", data: null });
  }

  // console.log(session);
  const { user } = session;
  // Does `user.uid` exist?
  const wholeUser = await findUserService(user.id);
  // NOTE: user salt changes w/ password
  // AKA, mismatched salt is forgery or pre-reset token
  if (!user) {
    return res
      .status(200)
      .json({ code: 401, msg: "Invalid token", data: null });
  }

  res.user = wholeUser;
};
