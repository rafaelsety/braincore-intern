import { Elysia } from "elysia";
import UserModel from "./model";

// TODO Buat endpoint API sederhana untuk menambahkan dan mengambil data pengguna (misalnya, nama dan email).
class UserController {
  public init() {
    return (
      new Elysia()
        .get("/", () => "Tugas 2 API")
        // Get all users (Read)
        .get("/users", async () => {
          try {
            const users = await UserModel.getAll();
            return {
              message: "Users retrieved successfully",
              data: users,
            };
          } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
          }
        })
        // Get user by ID (Read)
        .get("users/:id", async (ctx) => {
          try {
            const id = parseInt(ctx.params.id);
            const user = await UserModel.findById(id);
            if (!user) {
              return {
                message: "User not found",
                status: 404,
              };
            }
            return {
              message: "User retrieved successfully",
              data: user,
            };
          } catch (error) {
            console.error("Error fetching user:", error);
            throw error;
          }
        })
        // Create new user (Create)
        .post("/create", async (ctx) => {
          try {
            const { name, email } = ctx.body as { name: string; email: string };
            const newUser = await UserModel.create(name, email);
            return {
              message: "User created successfully",
              data: newUser,
              status: 201,
            };
          } catch (error) {
            console.error("Error creating user:", error);
            throw error;
          }
        })
        // Update user by ID (Update)
        .put("/update/:id", async (ctx) => {
          try {
            const id = parseInt(ctx.params.id);
            const { name, email } = ctx.body as { name: string; email: string };
            await UserModel.update(id, name, email);
            return {
              message: "User updated successfully",
              status: 200,
            };
          } catch (error) {
            console.error("Error updating user:", error);
            throw error;
          }
        })
        // Delete user by ID (Delete)
        .delete("delete/:id", async (ctx) => {
          try {
            const id = parseInt(ctx.params.id);
            await UserModel.delete(id);
            return {
              message: "User deleted successfully",
              status: 200,
            };
          } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
          }
        })
    );
  }
}

export default UserController;
