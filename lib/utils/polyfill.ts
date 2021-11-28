import { decode, encode } from "base-64";
import { Crypto } from "@peculiar/webcrypto";

if (!global.crypto) {
  global.crypto = new Crypto();
}

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}
