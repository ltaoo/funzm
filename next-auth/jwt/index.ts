import { EncryptJWT, jwtDecrypt } from "jose";
import { NextApiRequest } from "next";
import hkdf from "@panva/hkdf";
import dayjs from "dayjs";
import { v4 as uuid } from "uuid";

import {
  JWTDecodeParams,
  JWTEncodeParams,
  JWT,
  Secret,
  JWTOptions,
} from "./types";

const DEFAULT_MAX_AGE = 30 * 24 * 60 * 60; // 30 days
const now = () => dayjs().unix();

/** Issues a JWT. By default, the JWT is encrypted using "A256GCM". */
/**
 *
 * @param {{}} params.token
 * @param {string} params.secret
 * @param {number} params.maxAge
 */
export async function encode({
  token = {},
  secret,
  maxAge = DEFAULT_MAX_AGE,
}: JWTEncodeParams) {
  const encryptionSecret = await getDerivedEncryptionKey(secret);
  return await new EncryptJWT(token)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(now() + maxAge)
    .setJti(uuid())
    .encrypt(encryptionSecret);
}

/** Decodes a NextAuth.js issued JWT. */
export async function decode({
  token,
  secret,
}: JWTDecodeParams): Promise<JWT | null> {
  if (!token) return null;
  const encryptionSecret = await getDerivedEncryptionKey(secret);
  const { payload } = await jwtDecrypt(token, encryptionSecret, {
    clockTolerance: 15,
  });
  return payload;
}

export interface GetTokenParams<R extends boolean = false> {
  /** The request containing the JWT either in the cookies or in the `Authorization` header. */
  req: NextApiRequest;
  /**
   * Use secure prefix for cookie name, unless URL in `NEXTAUTH_URL` is http://
   * or not set (e.g. development or test instance) case use unprefixed name
   */
  secureCookie?: boolean;
  /** If the JWT is in the cookie, what name `getToken()` should look for. */
  cookieName?: string;
  /**
   * `getToken()` will return the raw JWT if this is set to `true`
   * @default false
   */
  raw?: R;
  secret?: string;
  decode?: JWTOptions["decode"];
  logger?: Console;
}

/**
 * Takes a NextAuth.js request (`req`) and returns either the NextAuth.js issued JWT's payload,
 * or the raw JWT string. We look for the JWT in the either the cookies, or the `Authorization` header.
 * [Documentation](https://next-auth.js.org/tutorials/securing-pages-and-api-routes#using-gettoken)
 */
export async function getToken<R extends boolean = false>(
  params?: GetTokenParams<R>
): Promise<R extends true ? string : JWT | null> {
  const {
    req,
    cookieName = "token",
    raw,
    decode: _decode = decode,
    logger = console,
  } = params ?? {};

  if (!req) throw new Error("Must pass `req` to JWT getToken()");

  //   const sessionStore = new SessionStore(
  //     { name: cookieName, options: { secure: secureCookie } },
  //     { cookies: req.cookies, headers: req.headers },
  //     logger
  //   );

  //   let token = sessionStore.value;
  let token = req.cookies[cookieName];

  if (!token && req.headers.authorization?.split(" ")[0] === "Bearer") {
    const urlEncodedToken = req.headers.authorization.split(" ")[1];
    token = decodeURIComponent(urlEncodedToken);
  }

  if (!token) return null;

  // @ts-expect-error
  if (raw) return token;

  try {
    // @ts-expect-error
    return await _decode({ token, secret: process.env.SECRET });
  } catch {
    return null;
  }
}

async function getDerivedEncryptionKey(secret: Secret) {
  return await hkdf(
    "sha256",
    secret,
    "",
    "NextAuth.js Generated Encryption Key",
    32
  );
}
