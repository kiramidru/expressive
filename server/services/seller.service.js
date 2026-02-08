import prisma from "../prisma.js";
import * as productRepository from "../repositories/product.db.js";
import * as brandRepository from "../repositories/brand.db.js";
import * as categoryRepository from "../repositories/category.db.js";
import * as orderRepository from "../repositories/order.db.js";

export async function createProduct(data) {
  if (data.brandId) {
    const brand = await brandRepository.getBrandByID(data.brandId);
    if (!brand || brand.sellerId !== data.sellerId) {
      throw new Error("Brand does not belong to this seller");
    }
  }

  if (data.categoryId) {
    const category = await categoryRepository.getCategoryById(data.categoryId);
    if (!category) {
      throw new Error("Category does not exist");
    }
  }

  return await productRepository.createProduct(data);
}

export async function getFilteredProducts(data) {
  const { sellerId, categoryId, page, limit } = data;
  const where = {
    sellerId,
    ...(categoryId && { categoryId: Number(categoryId) }),
  };

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;
  const take = limitNumber;

  const products = await productRepository.getFilteredProducts(
    where,
    skip,
    take,
  );

  const total = await productRepository.getProductCount(where);
  return {
    data: products,
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
}

export async function getFilteredOrders(data) {
  const { sellerId, productId, page, limit } = data;
  const where = {
    product: { sellerId },
    ...(productId && { productId: Number(productId) }),
  };
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;
  const take = limitNumber;

  const total = await orderRepository.getOrderCount(where);
  const totalPages = Math.ceil(total / limitNumber);

  const orders = await orderRepository.getFilteredOrders(where, skip, take);

  return {
    data: orders,
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages,
    },
  };
}

export async function getProductById(id) {
  return await prisma.product.findUnique({ where: { id } });
}

export async function createBrand(data) {
  return await brandRepository.createBrand(data);
}

export async function updateOrder(sellerId, id, data) {
  const order = await orderRepository.getOrder({
    id,
    product: { sellerId },
  });
  if (!order) {
    throw new Error("Order not found for this seller");
  }

  return await orderRepository.updateOrder(id, data);
}
