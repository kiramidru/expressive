import bcrypt from "bcrypt";
import prisma from "../prisma.js";

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: { passwordHash: hashedPassword },
    create: {
      email: "admin@example.com",
      passwordHash: hashedPassword,
      firstName: "Jane",
      lastName: "Doe",
      role: "ADMIN",
      verified: true,
    },
  });

  const seller = await prisma.user.upsert({
    where: { email: "seller@example.com" },
    update: { passwordHash: hashedPassword },
    create: {
      email: "seller@example.com",
      passwordHash: hashedPassword,
      firstName: "Jane",
      lastName: "Doe",
      role: "SELLER",
      verified: true,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: { passwordHash: hashedPassword },
    create: {
      email: "customer@example.com",
      passwordHash: hashedPassword,
      firstName: "Jane",
      lastName: "Doe",
      role: "CUSTOMER",
      verified: true,
    },
  });

  const category = await prisma.category.upsert({
    where: { name: "test_category" },
    update: {},
    create: {
      name: "test_category",
    },
  });

  const subCategory = await prisma.category.upsert({
    where: { name: "test2_category" },
    update: {},
    create: {
      name: "test2_category",
      parentId: category.id,
    },
  });

  const brand = await prisma.brand.upsert({
    where: { name: "test_brand" },
    update: {},
    create: {
      name: "test_brand",
      description: "testing",
      logoUrl: "www.google.com",
      websiteUrl: "www.google.com",
      sellerId: seller.id,
    },
  });

  const product = await prisma.product.upsert({
    where: { name: "test_product" },
    update: {
      categories: { set: [{ id: category.id }, { id: subCategory.id }] },
    },
    create: {
      name: "test_product",
      description: "testing",
      brandId: brand.id,
      sellerId: seller.id,
      categories: { connect: [{ id: category.id }, { id: subCategory.id }] },
      amount: 10,
      price: 100,
    },
  });

  const order = await prisma.order.create({
    data: {
      customerId: customer.id,
      productId: product.id,
      amount: 1,
      priceAtPurchase: 100,
    },
  });

  console.log("✅ Seed data created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
