import "server-only";
import crypto from "crypto";

export const SESSION_SECRET_KEY = getSessionSecretKey();

function getSessionSecretKey(): string {
  let key = process.env.SESSION_SECRET_KEY;
  if (!key) {
    const msg =
      "SESSION_SECRET_KEY not set, generateing and using a random key";
    if (process.env.NODE_ENV === "production") {
      console.error(msg);
    } else {
      console.warn(msg);
    }
    key = crypto.randomBytes(32).toString("base64");
  }
  return key;
}
