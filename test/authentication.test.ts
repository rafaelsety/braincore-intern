import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import AuthController from "../src/controller";
import db from "../src/db";
import { Elysia } from "elysia";

// TODO Tulis test untuk endpoint API Anda dan pastikan semuanya berfungsi dengan baik.
describe("Tugas 3 API - Authentication Test", () => {
  let server: any;
  const port = 3000;

  beforeAll(() => {
    const app = new Elysia().use(new AuthController().init());
    server = app.listen({ port: port });
    db.run(
      "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT, password TEXT)"
    );
  });

  afterAll(async () => {
    db.query("DELETE FROM users").run();
    server.stop();
  });

  it("should successfully register a new user with POST /register", async () => {
    const response = await fetch(`http://localhost:${port}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Username",
        email: "username@email.com",
        password: "12345",
      }),
    });

    const responseData = await response.json();

    expect(response.status).toBe(201);
    expect(responseData.message).toBe("User registered successfully.");
    expect(responseData.token).toBeTruthy();
  });

  it("should not allow registration with an existing email", async () => {
    const response = await fetch(`http://localhost:${port}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Username",
        email: "username@email.com",
        password: "12345",
      }),
    });

    const responseData = await response.json();

    expect(response.status).toBe(400);
    expect(responseData.message).toBe("User already exist");
  });

  it("should successfully log in an existing user with POST /login", async () => {
    const response = await fetch(`http://localhost:${port}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "username@email.com",
        password: "12345",
      }),
    });

    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData.message).toBe("Login successful.");
    expect(responseData.token).toBeTruthy();
  });

  it("should reject login with incorrect credentials", async () => {
    const response = await fetch(`http://localhost:${port}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "username@email.com",
        password: "wrongpassword",
      }),
    });

    const responseData = await response.json();

    expect(response.status).toBe(400);
    expect(responseData.message).toBe("Invalid email or password.");
  });
});
