import { Crypto } from "@peculiar/webcrypto";

import type { Algorithms } from "@/lib/utils/types";

import { encode } from "./index";

const crypto = new Crypto();

export function keyload(
  algo: Algorithms.Keying,
  secret: string,
  scopes: KeyUsage[]
): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", encode(secret), algo, false, scopes);
}

export async function PBKDF2(
  digest: Algorithms.Digest,
  password: string,
  salt: string,
  iters: number,
  length: number
): Promise<ArrayBuffer> {
  const key = await keyload("PBKDF2", password, ["deriveBits"]);

  const algo: Pbkdf2Params = {
    name: "PBKDF2",
    salt: encode(salt),
    iterations: iters,
    hash: digest,
  };

  return crypto.subtle.deriveBits(algo, key, length << 3);
}
