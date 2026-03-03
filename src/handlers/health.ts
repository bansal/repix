import type { Handler } from "hono";
import type { AppBindings } from "../types";

export function healthHandler(): Handler<AppBindings> {
  return async (c) => {
    c.get("log").set({ route: "health" });
    return c.json({
      service: "Repix",
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: "1.0.0",
    });
  };
}
