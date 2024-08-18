import { Elysia } from "elysia";

const app = new Elysia()

  // TODO Buat aplikasi Elysia dasar dengan satu route yang mengembalikan "Hello World"

  .get("/", () => "Hello World", {
    // TODO Tambahkan middleware yang mencatat waktu request.
    beforeHandle() {
      const time = new Date();
      const id_time = new Date(time.getTime() + 7 * 60 * 60 * 1000); // (GMT+7)
      console.log(`Time Request: ${id_time.toISOString()}`);
    },
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
