import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import server from "../src/index";
import db from "../src/db";

// TODO Tulis test untuk endpoint API Anda dan pastikan semuanya berfungsi dengan baik.
describe("Tugas 3 API - General Tests", () => {
  let app: any;
  const port = 443;

  beforeAll(async () => {
    // Setting the environment variable to ignore self-signed certificate warnings
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    app = Bun.serve({
      fetch: server.fetch,
      port,
      hostname: "localhost",
      tls: {
        cert: Bun.file(process.env.SSL_CERT_PATH as string),
        key: Bun.file(process.env.SSL_KEY_PATH as string),
      },
    });

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
    app.stop();
  });

  it("should successfully retrieve a list of users from GET /users", async () => {
    const response = await fetch(`https://localhost:${port}/users`);
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
    const response = await fetch(`https://localhost:${port}/`);
    const responseText = await response.text();

    expect(response.status).toBe(200);
    expect(responseText).toBe("Tugas 3 API");
  });

  it("should return 404 for a non-existent route", async () => {
    const response = await fetch(`https://localhost:${port}/non-existent`);
    expect(response.status).toBe(404);
  });
});
