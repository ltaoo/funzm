import { Awaitable } from "../core/types";

export interface DefaultJWT extends Record<string, unknown> {
  name?: string | null;
  email?: string | null;
  picture?: string | null;
  sub?: string;
}

export interface JWT extends Record<string, unknown>, DefaultJWT {}

// 编码参数
export interface JWTEncodeParams {
  /** The JWT payload. */
  token?: JWT;
  /** The secret used to encode the NextAuth.js issued JWT. */
  secret: string | Buffer;
  /**
   * The maximum age of the NextAuth.js issued JWT in seconds.
   * @default 30 * 24 * 30 * 60 // 30 days
   */
  maxAge?: number;
}

// 解码参数
export interface JWTDecodeParams {
  /** The NextAuth.js issued JWT to be decoded */
  token?: string;
  /** The secret used to decode the NextAuth.js issued JWT. */
  secret: string | Buffer;
}

export interface JWTOptions {
  /** The secret used to encode/decode the NextAuth.js issued JWT. */
  secret: string;
  /**
   * The maximum age of the NextAuth.js issued JWT in seconds.
   * @default 30 * 24 * 30 * 60 // 30 days
   */
  maxAge: number;
  /** Override this method to control the NextAuth.js issued JWT encoding. */
  encode: (params: JWTEncodeParams) => Awaitable<string>;
  /** Override this method to control the NextAuth.js issued JWT decoding. */
  decode: (params: JWTDecodeParams) => Awaitable<JWT | null>;
}

export type Secret = string | Buffer;
