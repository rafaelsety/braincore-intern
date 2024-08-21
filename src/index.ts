import { Elysia } from "elysia";
import AuthController from "./controller";

const app = new Elysia().use(new AuthController().init());

// TODO Implementasikan HTTPS dan keamanan dasar.
const server = Bun.serve({
  fetch: app.handle,
  port: 443, // Use the standard HTTPS port
  hostname: "localhost",
  tls: {
    cert: Bun.file(process.env.SSL_CERT_PATH as string),
    key: Bun.file(process.env.SSL_KEY_PATH as string),
  },
});

console.log(
  `🦊 Elysia is running securely at https://${server.hostname}:${server.port}`
);

export default server;
