import "@/lib/utils/polyfill";

import prisma from "@/lib/client";

import type { User, UserID } from "./user";

// NOTE: "emails::{email}" keys point to `User.uid` values
export const toKID = (email: string) => `emails::${email}`;

/**
 * Find the `UserID` associated with an `User.email` value.
 * @NOTE A `User` only has one "emails::{email}" document associated.
 */
export function findEmailService(email: string) {
  const key = toKID(email);
  // return database.read<UserID>(key);
}

/**
 * Create an `Email` record for the current `User` document.
 */
export function saveEmailService(user: User) {
  return prisma.email.create({
    data: {
      email: user.email,
      userId: user.id,
    },
  });
}

/**
 * Remove an existing `Email` record for an email.
 */
export function removeEmailService(email: string) {
  const key = toKID(email);
  //   return database.remove(key);
}
