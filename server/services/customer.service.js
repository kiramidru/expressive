import * as orderRepository from "../repositories/order.db.js";
import * as productRepository from "../repositories/product.db.js";

export async function createOrder(data) {
  const product = await productRepository.getProductPriceByID(data.productId);
  if (!product) {
    throw new Error("product doesn't exist.");
  }

  const priceAtPurchase = product.price;
  const order = {
    ...data,
    priceAtPurchase,
  };
  return await orderRepository.createOrder(order);
}

export async function getFilteredOrders(data) {
  const { customerId, productId, page, limit } = data;
  const where = {
    customerId,
    ...(productId && { productId: Number(productId) }),
  };
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
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

export async function getFilteredProducts(data) {
  const { sellerId, categoryName, page, limit } = data;
  const normalizedCategoryName = categoryName?.trim();

  const where = {
    ...(sellerId && { sellerId: Number(sellerId) }),
    ...(normalizedCategoryName && {
      categories: { some: { name: normalizedCategoryName } },
    }),
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

export async function getProductById(id) {
  const product = await productRepository.getProductById(id);
  if (!product) {
    throw new Error("Product not found");
  }

  return product;
}

export async function updateOrder(customerId, id, data) {
  const order = await orderRepository.getOrder({ id, customerId });
  if (!order) {
    throw new Error("Order not found for this customer");
  }

  return await orderRepository.updateOrder(id, data);
}
