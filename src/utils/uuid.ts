import crypto from "crypto";

/**
 * Creates a RFC-compliant v4 uuid string.
 * @see https://github.com/kelektiv/node-uuid/
 */
export function uuid(): string {
  let rng = crypto.randomBytes(16);

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rng[6] = (rng[6] & 0x0f) | 0x40;
  rng[8] = (rng[8] & 0x3f) | 0x80;

  let i = 0;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return [
    byteToHex[rng[i++]],
    byteToHex[rng[i++]],
    byteToHex[rng[i++]],
    byteToHex[rng[i++]],
    "-",
    byteToHex[rng[i++]],
    byteToHex[rng[i++]],
    "-",
    byteToHex[rng[i++]],
    byteToHex[rng[i++]],
    "-",
    byteToHex[rng[i++]],
    byteToHex[rng[i++]],
    "-",
    byteToHex[rng[i++]],
    byteToHex[rng[i++]],
    byteToHex[rng[i++]],
    byteToHex[rng[i++]],
    byteToHex[rng[i++]],
    byteToHex[rng[i++]]
  ].join("");
}

var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}
