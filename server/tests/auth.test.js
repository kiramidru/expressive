import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app.js";

describe("POST /signup", () => {
  it("creates an account and returns a safe authentication response", async () => {
    const res = await request(app).post("/api/signup").send({
      email: "  NewUser@Example.com ",
      password: "random123",
      firstName: "New",
      lastName: "User",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({
      email: "newuser@example.com",
      firstName: "New",
      lastName: "User",
      role: "CUSTOMER",
    });
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).not.toHaveProperty("passwordHash");

    const payload = jwt.decode(res.body.accessToken);
    expect(payload).toMatchObject({ id: res.body.id, role: "CUSTOMER" });
    expect(payload).not.toHaveProperty("passwordHash");
  });

  it("returns validation errors when required fields are missing", async () => {
    const res = await request(app).post("/api/signup");

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it("rejects duplicate emails regardless of case", async () => {
    const res = await request(app).post("/api/signup").send({
      email: "TESTADMIN@GMAIL.COM",
      password: "random123",
      firstName: "Another Admin",
    });

    expect(res.statusCode).toBe(409);
    expect(res.body.error).toMatch(/already exists/i);
  });

  it("does not allow public admin registration", async () => {
    const res = await request(app).post("/api/signup").send({
      email: "admin2@example.com",
      password: "random123",
      firstName: "Admin",
      role: "ADMIN",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});

describe("POST /login", () => {
  it("returns an access token for valid credentials", async () => {
    const res = await request(app).post("/api/login").send({
      email: "testadmin@gmail.com",
      password: "testing123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toMatchObject({
      email: "testadmin@gmail.com",
      role: "ADMIN",
    });
    expect(res.body).not.toHaveProperty("passwordHash");
  });

  it("returns the same error for an incorrect password", async () => {
    const res = await request(app).post("/api/login").send({
      email: "testadmin@gmail.com",
      password: "incorrect-password",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: "Invalid email or password" });
  });

  it("does not reveal whether an email is registered", async () => {
    const res = await request(app).post("/api/login").send({
      email: "missing@example.com",
      password: "incorrect-password",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: "Invalid email or password" });
  });

  it("returns validation errors when required fields are missing", async () => {
    const res = await request(app).post("/api/login");

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});

describe("GET /profile", () => {
  it("returns the authenticated user without credentials", async () => {
    const login = await request(app).post("/api/login").send({
      email: "testadmin@gmail.com",
      password: "testing123",
    });

    const res = await request(app)
      .get("/api/profile")
      .set("Authorization", `Bearer ${login.body.accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      email: "testadmin@gmail.com",
      firstName: "Admin",
      role: "ADMIN",
    });
    expect(res.body).not.toHaveProperty("passwordHash");
  });

  it("requires an access token", async () => {
    const res = await request(app).get("/api/profile");

    expect(res.statusCode).toBe(401);
  });
});
