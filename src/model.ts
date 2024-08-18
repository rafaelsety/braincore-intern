import db from "./db";

class UserModel {
  static getAll() {
    const query = db.query("SELECT * FROM users");

    return query.all();
  }

  static findById(id: number) {
    const query = db.query("SELECT * FROM users WHERE id = ?");

    return query.get(id);
  }

  static findEmail(email: string) {
    const query = db.query("SELECT * FROM users WHERE email = ?");

    return query.get(email);
  }

  static findName(name: string) {
    const query = db.query("SELECT * FROM users WHERE name = ?");

    return query.get(name);
  }

  static create(name: string, email: string, password: string) {
    const query = db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"
    );

    return query.run(name, email, password);
  }
}

export default UserModel;
