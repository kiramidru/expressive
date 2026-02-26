import prisma from "../prisma.js";

const productInclude = {
  categories: {
    orderBy: { name: "asc" },
  },
};

export async function createProduct(data) {
  return await prisma.product.create({ data, include: productInclude });
}

export async function getFilteredProducts(where, skip, take) {
  return await prisma.product.findMany({
    where,
    skip,
    take,
    include: productInclude,
    orderBy: { id: "asc" },
  });
}

export async function getProductById(id) {
  return await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });
}

export async function getProductPriceByID(id) {
  return await prisma.product.findUnique({
    where: { id },
    select: { price: true },
  });
}

export async function getProductCount(where) {
  return await prisma.product.count({ where });
}
