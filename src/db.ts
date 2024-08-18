import { Database } from "bun:sqlite";

// TODO Integrasikan database dengan API Anda.

const db = new Database("tugas2-db.sqlite");

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT
  )
`);

console.log("Connecting Database...");

export default db;
