import prisma from "../prisma.js";

export const createCategory = async (data) => {
  return await prisma.category.create({ data });
};

export async function getCategoryById(id) {
  return await prisma.category.findUnique({ where: { id } });
}
