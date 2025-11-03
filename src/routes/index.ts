import type { Elysia } from "elysia";

// Import individual route groups
import { emailRoutes } from "./emailRoutes";

export function registerRoutes(app: Elysia) {
  // You can optionally namespace groups if you prefer:
  app.group("/email", emailRoutes);

  // If you add more:
  // app.group("/analysis", analysisRoutes);

  return app;
}
