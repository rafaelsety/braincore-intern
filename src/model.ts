import db from "./db";

// TODO Implementasikan operasi CRUD pada endpoint yang telah dibuat.

class UserModel {
  static getAll() {
    const query = db.query("SELECT * FROM users");

    return query.all();
  }

  static findById(id: number) {
    const query = db.query("SELECT * FROM users WHERE id = ?");

    return query.get(id);
  }

  static create(name: string, email: string) {
    const query = db.query("INSERT INTO users (name, email) VALUES (?, ?)");

    return query.run(name, email);
  }

  static update(id: number, name: string, email: string) {
    const query = db.query("UPDATE users SET name = ?, email = ? WHERE id = ?");

    return query.run(name, email, id);
  }

  static async delete(id: number) {
    const query = db.query("DELETE FROM users WHERE id = ?");

    return query.run(id);
  }
}

export default UserModel;
