import * as crypto from "node:crypto";

export const hashEmail = (email: string) => {
  return crypto.createHash("sha256").update(email).digest("base64");
};
