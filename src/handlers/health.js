/**
 * Health check handler
 */
export function createHealthHandler() {
  return async (c) => {
    return c.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: "1.0.0",
    });
  };
}
