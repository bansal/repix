import type { Handler } from "hono";

/**
 * Health check handler
 */
export function createHealthHandler(): Handler {
  return async (c) => {
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
