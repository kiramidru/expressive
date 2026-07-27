import request from "supertest";
import app from "../app.js";
import prisma from "../prisma.js";
import { generateTestToken } from "./helpers/auth.js";

let adminToken;
let customerToken;

beforeAll(() => {
  adminToken = generateTestToken({
    id: global.testAdmin.id,
    role: global.testAdmin.role,
    verified: global.testAdmin.verified,
  });
  customerToken = generateTestToken({
    id: global.testCustomer.id,
    role: global.testCustomer.role,
    verified: global.testCustomer.verified,
  });
});

beforeEach(async () => {
  await prisma.category.deleteMany();
  await prisma.user.update({
    where: { id: global.testCustomerB.id },
    data: { verified: false },
  });
});

describe("POST /admin/category", () => {
  it("allows an admin to create a category", async () => {
    const res = await request(app)
      .post("/api/admin/category")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "food",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("name");
  });

  it("allows an admin to create a child category", async () => {
    const parent = await prisma.category.create({ data: { name: "parent" } });
    const res = await request(app)
      .post("/api/admin/category")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "child", parentId: String(parent.id) });

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ name: "child", parentId: parent.id });
  });

  it("returns validation errors when required fields are missing", async () => {
    const res = await request(app)
      .post("/api/admin/category")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it("rejects requests without an access token", async () => {
    const res = await request(app)
      .post("/api/admin/category")
      .send({ name: "unauthorized" });

    expect(res.statusCode).toBe(401);
  });

  it("rejects authenticated non-admin users", async () => {
    const res = await request(app)
      .post("/api/admin/category")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ name: "forbidden" });

    expect(res.statusCode).toBe(403);
  });
});

describe("POST /admin/verify", () => {
  it("verifies a user without exposing the password hash", async () => {
    const res = await request(app)
      .post("/api/admin/verify")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ email: " TESTCUSTOMERB@GMAIL.COM " });

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      id: global.testCustomerB.id,
      email: "testcustomerb@gmail.com",
      verified: true,
    });
    expect(res.body).not.toHaveProperty("passwordHash");
  });

  it("validates the email payload", async () => {
    const res = await request(app)
      .post("/api/admin/verify")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ email: "not-an-email" });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});
