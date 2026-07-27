import bcrypt from "bcrypt";

export async function hashData(data, rounds = 12) {
  return await bcrypt.hash(data, rounds);
}

export async function verifyHash(data, hashedData) {
  return await bcrypt.compare(data, hashedData);
}
