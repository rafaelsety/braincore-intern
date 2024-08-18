import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import app from "../src/index";
import db from "../src/db";

// TODO Tulis test untuk endpoint API Anda dan pastikan semuanya berfungsi dengan baik.
describe("Tugas 3 API - General Tests", () => {
  let server: any;
  const port = 3000;

  beforeAll(async () => {
    server = app.listen({ port });

    db.run(
      "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT, password TEXT)"
    );
    db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)").run(
      "Username",
      "username@email.com",
      "12345"
    );
  });

  afterAll(async () => {
    db.query("DELETE FROM users").run();
    server.stop();
  });

  it("should successfully retrieve a list of users from GET /users", async () => {
    const response = await fetch(`http://localhost:${port}/users`);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData).toEqual({
      message: "Users retrieved successfully",
      data: [
        {
          id: 1,
          name: "Username",
          email: "username@email.com",
          password: "12345",
        },
      ],
    });
  });

  it("should return a welcome message from GET /", async () => {
    const response = await fetch(`http://localhost:${port}/`);
    const responseText = await response.text();

    expect(response.status).toBe(200);
    expect(responseText).toBe("Tugas 3 API");
  });

  it("should return 404 for a non-existent route", async () => {
    const response = await fetch(`http://localhost:${port}/non-existent`);
    expect(response.status).toBe(404);
  });
});
