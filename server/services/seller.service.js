import * as productRepository from "../repositories/product.db.js";
import * as brandRepository from "../repositories/brand.db.js";
import * as orderRepository from "../repositories/order.db.js";

function normalizeCategoryNames(categoryNames = []) {
  if (!Array.isArray(categoryNames)) {
    return [];
  }

  const names = new Map();
  for (const categoryName of categoryNames) {
    const name = categoryName.trim();
    if (name) {
      names.set(name.toLowerCase(), name);
    }
  }

  return [...names.values()];
}

export async function createProduct(data) {
  const { categoryNames, ...productData } = data;

  if (data.brandId) {
    const brand = await brandRepository.getBrandByID(data.brandId);
    if (!brand || brand.sellerId !== data.sellerId) {
      throw new Error("Brand does not belong to this seller");
    }
  }

  const names = normalizeCategoryNames(categoryNames);

  return await productRepository.createProduct({
    ...productData,
    ...(names.length > 0 && {
      categories: {
        connectOrCreate: names.map((name) => ({
          where: { name },
          create: { name },
        })),
      },
    }),
  });
}

export async function getFilteredProducts(data) {
  const { sellerId, categoryName, page, limit } = data;
  const normalizedCategoryName = categoryName?.trim();
  const where = {
    sellerId,
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

export async function createBrand(data) {
  return await brandRepository.createBrand(data);
}

export async function getBrands(sellerId) {
  return await brandRepository.getFilteredBrand(
    { sellerId },
    undefined,
    undefined,
  );
}

export async function getSellerProductById(sellerId, id) {
  const product = await productRepository.getProductById(id);
  if (!product || product.sellerId !== sellerId) {
    throw new Error("Product not found for this seller");
  }

  return product;
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
