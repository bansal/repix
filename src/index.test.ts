import { describe, it, expect } from "vitest";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { createHealthHandler } from "./handlers/health.js";
import { createPresetHandler } from "./handlers/presets.js";
import type { Config } from "./types/index.js";

const testConfig: Config = {
  prefix: "https://",
  port: 3210,
  cors: { origin: "*", credentials: false },
  image: {
    maxWidth: 2048,
    maxHeight: 2048,
    defaultQuality: 85,
    fetchTimeout: 10000,
    cacheControl: "public, max-age=31536000, immutable",
    allowCustomTransforms: true,
    allowDefaultPresets: true,
    allowOriginalImage: true,
  },
  presets: { thumb: "w=100,h=100" },
};

describe("App endpoints", () => {
  const app = new Hono();
  app.use("*", cors(testConfig.cors));
  app.get("/", (c) =>
    c.json({
      service: "Repix",
      version: "1.0.0",
      documentation: "https://github.com/bansal/repix",
      endpoints: {
        health: "/health",
        presets: "/presets",
        transform: "/{preset|params}/{url}",
        original: "/original/{url}",
      },
    }),
  );
  app.get("/health", createHealthHandler());
  app.get("/presets", createPresetHandler(testConfig));

  it("root returns service info and endpoints", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toMatchObject({
      service: "Repix",
      version: "1.0.0",
      endpoints: {
        health: "/health",
        presets: "/presets",
      },
    });
  });

  it("health returns healthy status", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe("healthy");
  });

  it("presets returns available presets", async () => {
    const res = await app.request("/presets");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.presets).toHaveProperty("thumb");
    expect(json.count).toBeGreaterThan(0);
  });
});
