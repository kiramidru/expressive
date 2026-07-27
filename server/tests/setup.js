import prisma from "../prisma.js";
import { hashData } from "../utils/bcrypt.js";

const testAdminData = {
  email: "testadmin@gmail.com",
  firstName: "Admin",
  role: "ADMIN",
  verified: true,
};

const testSellerData = {
  email: "testseller@gmail.com",
  firstName: "Seller",
  role: "SELLER",
  verified: true,
};

const testCustomerData = {
  email: "testcustomer@gmail.com",
  firstName: "Customer",
  role: "CUSTOMER",
  verified: true,
};

const testSellerBData = {
  email: "testsellerb@gmail.com",
  firstName: "Seller B",
  role: "SELLER",
  verified: true,
};

const testCustomerBData = {
  email: "testcustomerb@gmail.com",
  firstName: "Customer B",
  role: "CUSTOMER",
  verified: true,
};

if (process.env.DATABASE_URL !== "file:./test.db") {
  throw new Error("Tests must use an isolated test database");
}

async function clearDatabase() {
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
}

beforeAll(async () => {
  await clearDatabase();

  const passwordHash = await hashData("testing123", 4);

  const [admin, seller, sellerB, customer, customerB] = await Promise.all([
    prisma.user.create({ data: { ...testAdminData, passwordHash } }),
    prisma.user.create({ data: { ...testSellerData, passwordHash } }),
    prisma.user.create({ data: { ...testSellerBData, passwordHash } }),
    prisma.user.create({ data: { ...testCustomerData, passwordHash } }),
    prisma.user.create({ data: { ...testCustomerBData, passwordHash } }),
  ]);

  global.testAdmin = admin;
  global.testSeller = seller;
  global.testSellerB = sellerB;
  global.testCustomer = customer;
  global.testCustomerB = customerB;
});

afterAll(async () => {
  await clearDatabase();
  await prisma.$disconnect();
});
