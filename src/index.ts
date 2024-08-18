import { Elysia } from "elysia";
import AuthController from "./controller";

const app = new Elysia().use(new AuthController().init()).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export default app;
