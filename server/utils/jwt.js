import "../env.js";
import jwt from "jsonwebtoken";

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  return process.env.JWT_SECRET;
}

export function signToken(payload, expiresIn = "1h") {
  return jwt.sign(payload, getJwtSecret(), { expiresIn });
}
