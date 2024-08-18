import { Elysia } from "elysia";
import UserController from "./controller";

const app = new Elysia().use(new UserController().init()).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
