import { Elysia } from "elysia";
import { registerRoutes } from "./routes";

const app = new Elysia();

registerRoutes(app);

app.listen(Number(process.env.PORT) || 8080);

console.log(
  `🦊 Email Service is running at ${app.server?.hostname}:${app.server?.port}`
);
