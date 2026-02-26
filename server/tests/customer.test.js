import request from "supertest";
import app from "../app.js";
import prisma from "../prisma.js";
import { generateTestToken } from "./helpers/auth.js";
import { resetCatalogFixtures } from "./helpers/fixtures.js";

let customerToken;
let sellerToken;
let fixtures;

beforeAll(() => {
  customerToken = generateTestToken({
    id: global.testCustomer.id,
    role: global.testCustomer.role,
    verified: global.testCustomer.verified,
  });
  sellerToken = generateTestToken({
    id: global.testSeller.id,
    role: global.testSeller.role,
    verified: global.testSeller.verified,
  });
});

beforeEach(async () => {
  fixtures = await resetCatalogFixtures();
});

describe("customer endpoints", () => {
  it("POST /api/customer/order creates an order at the current product price", async () => {
    const res = await request(app)
      .post("/api/customer/order")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ productId: fixtures.productA2.id, amount: 3 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      customerId: global.testCustomer.id,
      productId: fixtures.productA2.id,
      amount: 3,
      priceAtPurchase: fixtures.productA2.price,
      status: "PENDING",
    });
  });

  it("GET /api/customer/order filters by customer and product", async () => {
    const res = await request(app)
      .get(`/api/customer/order?productId=${fixtures.productB1.id}`)
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].id).toBe(fixtures.sellerBOrder.id);
    expect(res.body.meta).toEqual({ total: 1, page: 1, limit: 10, totalPages: 1 });
  });

  it("PATCH /api/customer/order lets a customer cancel their own order", async () => {
    const res = await request(app)
      .patch("/api/customer/order")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ id: fixtures.customerAOrder.id, status: "CANCELLED" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      id: fixtures.customerAOrder.id,
      status: "CANCELLED",
    });
  });

  it("PATCH /api/customer/order cannot update another customer's order", async () => {
    const res = await request(app)
      .patch("/api/customer/order")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ id: fixtures.customerBOrder.id, status: "CANCELLED" });

    expect(res.statusCode).toBe(400);
    const order = await prisma.order.findUnique({
      where: { id: fixtures.customerBOrder.id },
    });
    expect(order.status).toBe("PENDING");
  });

  it("GET /api/customer/product combines seller and category filters", async () => {
    const res = await request(app)
      .get(
        `/api/customer/product?sellerId=${global.testSeller.id}&categoryName=${encodeURIComponent(fixtures.categoryB.name)}`,
      )
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].id).toBe(fixtures.productA2.id);
    expect(res.body.meta).toEqual({ total: 1, page: 1, limit: 10, totalPages: 1 });
  });

  it("GET /api/customer/product/:id returns a product detail", async () => {
    const res = await request(app)
      .get(`/api/customer/product/${fixtures.productA1.id}`)
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      id: fixtures.productA1.id,
      name: fixtures.productA1.name,
      price: fixtures.productA1.price,
    });
    expect(res.body.categories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: fixtures.categoryA.name }),
        expect.objectContaining({ name: fixtures.featuredCategory.name }),
      ]),
    );
  });

  it("rejects non-customers across customer routes", async () => {
    const res = await request(app)
      .get("/api/customer/product")
      .set("Authorization", `Bearer ${sellerToken}`);

    expect(res.statusCode).toBe(403);
  });
});
