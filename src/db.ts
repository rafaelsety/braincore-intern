import { Database } from "bun:sqlite";

const db = new Database("tugas3-db.sqlite");

db.run(`
  CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
    name TEXT,
    email TEXT,
    password TEXT
  )
`);

console.log("Connecting Database...");

export default db;
