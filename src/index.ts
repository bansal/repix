import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import type { ContentfulStatusCode } from "hono/utils/http-status";

import type { AppBindings } from "./types";
import { resolveError } from "./errors";
import { loadConfig } from "./utils/loader";
import { initLogging, logger } from "./utils/logger";
import { imageHandler } from "./handlers/image";
import { healthHandler } from "./handlers/health";
import { rootHandler } from "./handlers/root";

async function startServer(): Promise<Hono<AppBindings>> {
  const config = await loadConfig();

  initLogging(config);

  const app = new Hono<AppBindings>();

  app.use("*", logger);
  app.use("*", cors(config.cors));
  app.onError((err, c) => {
    c.get("log").error(err);
    const { response, status } = resolveError(err);
    return c.json(response, status as ContentfulStatusCode);
  });

  // Routes
  app.get("/", rootHandler());

  // Health check endpoint
  app.get("/health", healthHandler());

  // Favicon - return 204 to avoid browser requests hitting the image transform route
  app.get("/favicon.ico", (c) => c.body(null, 204));

  // Main image transformation endpoint
  app.get("/:transform/*", imageHandler(config));

  // Start server
  const port = config.port ?? 3210;

  console.log(`Repix starting on port ${port} http://localhost:${port}`);

  serve({
    fetch: app.fetch,
    port,
    hostname: process.env.HOST ?? "0.0.0.0", // required for Railway/Render – must accept external connections
  });

  return app;
}

// Start the server
startServer().catch(console.error);
