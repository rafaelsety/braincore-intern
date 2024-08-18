import { Elysia, t } from "elysia";
import jwt from "@elysiajs/jwt";
import UserModel from "./model";

// TODO Tambahkan fitur login dengan token JWT pada aplikasi Anda.
class AuthController {
  public init() {
    return new Elysia()
      .get("/", () => "Tugas 3 API")
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
      .use(
        jwt({
          name: "jwt",
          secret: Bun.env.JWT_SECRET_KEY!,
        })
      )
      .post(
        "/register",
        async ({ jwt, body, set }) => {
          try {
            const password = await Bun.password.hash(body.password, {
              algorithm: "bcrypt",
              cost: 4,
            });

            const findUser = UserModel.findEmail(body.email) as User;

            if (findUser && findUser.email === body.email) {
              set.status = 400;
              return {
                message: "User already exist",
              };
            }

            const create = UserModel.create(
              body.name,
              body.email,
              password
            ) as unknown as User;

            set.status = 201;
            return {
              message: "User registered successfully.",
              token: await jwt.sign({ id: create.id }),
            };
          } catch (error) {
            console.error("Error fetching user:", error);
            throw error;
          }
        },
        {
          body: t.Object({
            name: t.String({
              required: true,
            }),
            email: t.String({
              required: true,
              format: "email",
            }),
            password: t.String({
              required: true,
            }),
          }),
        }
      )
      .post(
        "/login",
        async ({ jwt, body, set }) => {
          try {
            const findUser = UserModel.findEmail(body.email) as User;

            if (!findUser) {
              set.status = 400;
              return {
                message: "Invalid email or password.",
              };
            }

            const checkPassword = await Bun.password.verify(
              body.password,
              findUser.password,
              "bcrypt"
            );

            if (!checkPassword) {
              set.status = 400;
              return {
                success: false,
                message: "Invalid email or password.",
              };
            }

            set.status = 200;
            return {
              message: "Login successful.",
              token: await jwt.sign({ id: findUser.id }),
            };
          } catch (error) {
            console.error("Error fetching user:", error);
            throw error;
          }
        },
        {
          body: t.Object({
            email: t.String({
              required: true,
              format: "email",
            }),
            password: t.String({
              required: true,
            }),
          }),
        }
      );
  }
}

export default AuthController;
