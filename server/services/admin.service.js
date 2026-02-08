import * as categoryRespository from "../repositories/category.db.js";
import * as userRepository from "../repositories/user.db.js";

export async function createCategory(data) {
  return await categoryRespository.createCategory(data);
}

export async function verifyUser(email) {
  const user = await userRepository.getUserByEmail(email.toLowerCase());
  if (!user) {
    throw new Error("User not found");
  }

  const data = {
    verified: true,
  };
  const updatedUser = await userRepository.updateUser(user.id, data);
  const { passwordHash, ...safeUser } = updatedUser;
  return safeUser;
}
