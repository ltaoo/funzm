import * as res from "worktop/response";
import type { ULID } from "worktop/utils";

export * from "worktop/utils";
export { until } from "worktop/kv";

export function isULID(x?: string): x is ULID {
  return !!x && x.length === 26;
}

// @ts-ignore
export const send: typeof res.send = function (code, data, headers) {
  if (code >= 400 && typeof data === "string") {
    data = { status: code, error: data };
  }
  // @ts-ignore
  return res.send(code, data, headers);
};

export const seconds = (): TIMESTAMP => (Date.now() / 1e3) | 0;
