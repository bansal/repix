import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import dotenv from "dotenv";

import { loadConfig } from "./config/loader";
import { createImageHandler } from "./handlers/image";
import { createHealthHandler } from "./handlers/health";
import { createPresetHandler } from "./handlers/presets";

async function startServer(): Promise<Hono> {
  // Load environment variables
  dotenv.config();

  // Load configuration
  const config = await loadConfig();

  // Create Hono app
  const app = new Hono();

  // Middleware
  app.use("*", logger());
  app.use("*", cors(config.cors));

  // Error handling middleware
  app.onError((err, c) => {
    console.error("Error:", err);

    if (err.message.includes("Custom transformations not allowed")) {
      return c.json(
        {
          error: err.message,
        },
        403
      );
    }

    if (err.message.includes("Invalid image")) {
      return c.json(
        {
          error: "Invalid image format or corrupted image",
        },
        400
      );
    }

    if (err.message.includes("Image too large")) {
      return c.json(
        {
          error: "Image dimensions exceed maximum allowed size",
        },
        413
      );
    }

    if (
      err.message.includes("Fetch failed") ||
      err.message.includes("ENOTFOUND")
    ) {
      return c.json(
        {
          error: "Could not fetch source image",
        },
        404
      );
    }

    if (err.message.includes("timeout")) {
      return c.json(
        {
          error: "Request timeout while fetching image",
        },
        408
      );
    }

    return c.json(
      {
        error: "Internal server error",
      },
      500
    );
  });

  // Routes
  app.get("/", (c) => {
    return c.json({
      service: "Repix",
      version: "1.0.0",
      documentation: "https://github.com/bansal/repix",
      endpoints: {
        health: "/health",
        presets: "/presets",
        transform: "/images/{preset|params}/{url}",
      },
    });
  });

  // Health check endpoint
  app.get("/health", createHealthHandler());

  // Presets endpoint
  app.get("/presets", createPresetHandler(config));

  // Main image transformation endpoint
  app.get("/images/:transform/*", createImageHandler(config));

  // Start server
  const port = config.port || 3000;

  console.log(`🚀 Repix Image Transformation Service starting on port ${port}`);
  console.log(
    `📁 Available presets: ${Object.keys(config.presets || {}).join(", ")}`
  );
  console.log(
    `🔧 Custom transformations: ${
      config.image?.allowCustomTransforms !== false
        ? "enabled"
        : "disabled (presets only)"
    }`
  );

  serve({
    fetch: app.fetch,
    port,
  });

  return app;
}

// Start the server
startServer().catch(console.error);
