import request from "supertest";
import app from "../app.js";
import prisma from "../prisma.js";
import { generateTestToken } from "./helpers/auth.js";
import { resetCatalogFixtures } from "./helpers/fixtures.js";

let sellerToken;
let customerToken;
let fixtures;

beforeAll(() => {
  sellerToken = generateTestToken({
    id: global.testSeller.id,
    role: global.testSeller.role,
    verified: global.testSeller.verified,
  });
  customerToken = generateTestToken({
    id: global.testCustomer.id,
    role: global.testCustomer.role,
    verified: global.testCustomer.verified,
  });
});

beforeEach(async () => {
  fixtures = await resetCatalogFixtures();
});

describe("seller endpoints", () => {
  it("POST /api/seller/brand creates a brand for the authenticated seller", async () => {
    const res = await request(app)
      .post("/api/seller/brand")
      .set("Authorization", `Bearer ${sellerToken}`)
      .send({
        name: "New Seller Brand",
        description: "A test brand",
        websiteUrl: "https://example.com",
        logoUrl: "https://example.com/logo.png",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      name: "New Seller Brand",
      sellerId: global.testSeller.id,
      description: "A test brand",
    });
  });

  it("GET /api/seller/brand lists only the seller's brands", async () => {
    const res = await request(app)
      .get("/api/seller/brand")
      .set("Authorization", `Bearer ${sellerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0]).toMatchObject({
      id: fixtures.brandA.id,
      sellerId: global.testSeller.id,
    });
  });

  it("POST /api/seller/product persists the complete product payload", async () => {
    const res = await request(app)
      .post("/api/seller/product")
      .set("Authorization", `Bearer ${sellerToken}`)
      .send({
        name: "New Seller Product",
        description: "Complete product",
        brandId: fixtures.brandA.id,
        categoryNames: [fixtures.categoryA.name, "Launch"],
        amount: 4,
        price: 9.5,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      name: "New Seller Product",
      description: "Complete product",
      sellerId: global.testSeller.id,
      brandId: fixtures.brandA.id,
      amount: 4,
      price: 9.5,
    });
    expect(res.body).not.toHaveProperty("categoryId");
    expect(res.body.categories.map((category) => category.name).sort()).toEqual(
      [fixtures.categoryA.name, "Launch"].sort(),
    );
  });

  it("POST /api/seller/product rejects another seller's brand", async () => {
    const res = await request(app)
      .post("/api/seller/product")
      .set("Authorization", `Bearer ${sellerToken}`)
      .send({
        name: "Cross-owned Product",
        brandId: fixtures.brandB.id,
        amount: 1,
        price: 5,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/does not belong/i);
  });

  it("GET /api/seller/product filters by owner and category", async () => {
    const res = await request(app)
      .get(
        `/api/seller/product?categoryName=${encodeURIComponent(fixtures.categoryA.name)}&page=1&limit=10`,
      )
      .set("Authorization", `Bearer ${sellerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].id).toBe(fixtures.productA1.id);
    expect(res.body.data[0].categories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: fixtures.categoryA.name }),
      ]),
    );
    expect(res.body.meta).toEqual({ total: 1, page: 1, limit: 10, totalPages: 1 });
  });

  it("GET /api/seller/product/:id returns an owned product detail", async () => {
    const res = await request(app)
      .get(`/api/seller/product/${fixtures.productA1.id}`)
      .set("Authorization", `Bearer ${sellerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      id: fixtures.productA1.id,
      sellerId: global.testSeller.id,
    });
    expect(res.body.categories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: fixtures.categoryA.name }),
        expect.objectContaining({ name: fixtures.featuredCategory.name }),
      ]),
    );
  });

  it("GET /api/seller/product/:id rejects another seller's product", async () => {
    const res = await request(app)
      .get(`/api/seller/product/${fixtures.productB1.id}`)
      .set("Authorization", `Bearer ${sellerToken}`);

    expect(res.statusCode).toBe(400);
  });

  it("GET /api/seller/order returns only orders for the seller's products", async () => {
    const res = await request(app)
      .get("/api/seller/order")
      .set("Authorization", `Bearer ${sellerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.map((order) => order.id).sort((a, b) => a - b)).toEqual(
      [fixtures.customerAOrder.id, fixtures.customerBOrder.id].sort(
        (a, b) => a - b,
      ),
    );
    expect(res.body.meta.total).toBe(2);
  });

  it("PATCH /api/seller/order updates an order for the seller's product", async () => {
    const res = await request(app)
      .patch("/api/seller/order")
      .set("Authorization", `Bearer ${sellerToken}`)
      .send({ id: fixtures.customerAOrder.id, status: "PROCESSING" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      id: fixtures.customerAOrder.id,
      status: "PROCESSING",
    });
  });

  it("PATCH /api/seller/order cannot update another seller's order", async () => {
    const res = await request(app)
      .patch("/api/seller/order")
      .set("Authorization", `Bearer ${sellerToken}`)
      .send({ id: fixtures.sellerBOrder.id, status: "SHIPPED" });

    expect(res.statusCode).toBe(400);
    const order = await prisma.order.findUnique({
      where: { id: fixtures.sellerBOrder.id },
    });
    expect(order.status).toBe("PENDING");
  });

  it("rejects non-sellers across seller routes", async () => {
    const res = await request(app)
      .post("/api/seller/brand")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ name: "Forbidden Brand" });

    expect(res.statusCode).toBe(403);
  });
});
