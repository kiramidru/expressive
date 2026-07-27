import prisma from "../../prisma.js";

export async function resetCatalogFixtures() {
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();

  const [categoryA, categoryB] = await Promise.all([
    prisma.category.create({ data: { name: "Category A" } }),
    prisma.category.create({ data: { name: "Category B" } }),
  ]);

  const [brandA, brandB] = await Promise.all([
    prisma.brand.create({
      data: { name: "Brand A", sellerId: global.testSeller.id },
    }),
    prisma.brand.create({
      data: { name: "Brand B", sellerId: global.testSellerB.id },
    }),
  ]);

  const [productA1, productA2, productB1] = await Promise.all([
    prisma.product.create({
      data: {
        name: "Seller A Product 1",
        description: "Category A product",
        sellerId: global.testSeller.id,
        brandId: brandA.id,
        categoryId: categoryA.id,
        amount: 10,
        price: 12.5,
      },
    }),
    prisma.product.create({
      data: {
        name: "Seller A Product 2",
        description: "Category B product",
        sellerId: global.testSeller.id,
        brandId: brandA.id,
        categoryId: categoryB.id,
        amount: 5,
        price: 20,
      },
    }),
    prisma.product.create({
      data: {
        name: "Seller B Product 1",
        description: "Other seller product",
        sellerId: global.testSellerB.id,
        brandId: brandB.id,
        categoryId: categoryA.id,
        amount: 8,
        price: 30,
      },
    }),
  ]);

  const [customerAOrder, customerBOrder, sellerBOrder] = await Promise.all([
    prisma.order.create({
      data: {
        customerId: global.testCustomer.id,
        productId: productA1.id,
        amount: 1,
        priceAtPurchase: productA1.price,
      },
    }),
    prisma.order.create({
      data: {
        customerId: global.testCustomerB.id,
        productId: productA2.id,
        amount: 2,
        priceAtPurchase: productA2.price,
      },
    }),
    prisma.order.create({
      data: {
        customerId: global.testCustomer.id,
        productId: productB1.id,
        amount: 1,
        priceAtPurchase: productB1.price,
      },
    }),
  ]);

  return {
    categoryA,
    categoryB,
    brandA,
    brandB,
    productA1,
    productA2,
    productB1,
    customerAOrder,
    customerBOrder,
    sellerBOrder,
  };
}
