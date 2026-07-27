import prisma from "../prisma.js";

export async function createUser(data) {
  return await prisma.user.create({ data });
}

export async function getUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function getUserById(id) {
  return await prisma.user.findUnique({ where: { id } });
}

export async function updateUser(id, data) {
  return await prisma.user.update({
    where: { id },
    data,
  });
}
