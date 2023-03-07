/**
 * @file 用户服务
 */
import Joi from "joi";
// import { User } from ".prisma/client";

import prisma from "@/lib/prisma";
import * as utils from "@/lib/utils";

import * as Password from "./password";

// Authentication attributes
export interface Credentials {
  email: string;
  password: string;
}

/**
 * @param {string} email - 邮箱
 * @returns
 */
export function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      credential: true,
    },
  });
}

type User = {
  id: number;
};
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
