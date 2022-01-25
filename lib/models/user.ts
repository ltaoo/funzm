/**
 * @file 用户服务
 */
import Joi from "joi";
import { User } from ".prisma/client";

import prisma from "@/lib/prisma";
import * as utils from "@/lib/utils";

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

/**
 * @param {string} email - 邮箱
 * @returns
 */
export function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      // profile: true,
      credential: true,
    },
  });
}

/**
 * Create a new `User` document from a `Credentials` set.
 * @NOTE Handles `password`, `salt`, and `uid` values.
 * @TODO throw w/ message instead of early returns?
 */
type UserValues = Omit<Partial<User>, "email" | "password"> & Credentials;
export async function addUser(values: UserValues): Promise<User> {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{8,30}$"))
      .required(),
  });
  const { email, password: pw } = values;
  await schema.validateAsync(values);
  const { password, salt } = await Password.prepare(pw);
  const createdUser = await prisma.user.create({
    data: {
      email,
    },
  });
  await prisma.credential.create({
    data: {
      user_id: createdUser.id,
      password,
      salt,
    },
  });
  await prisma.profile.create({
    data: {
      user_id: createdUser.id,
      nickname: email.split("@").shift(),
    },
  });
  await prisma.score.create({
    data: {
      user_id: createdUser.id,
      value: 0,
    },
  });
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
