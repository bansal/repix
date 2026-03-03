import { describe, it, expect } from "vitest";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { healthHandler } from "@/handlers/health";
import { rootHandler } from "@/handlers/root";
import type { Config } from "@/types";
import { withEvlog } from "./helpers";

const testConfig: Config = {
  sourcePrefix: "https://",
  sourceHostname: "",
  port: 3210,
  cors: { origin: "*", credentials: false },
  fetchTimeout: 10000,
  cacheControl: "public, max-age=31536000, immutable",
  allowCustomTransforms: true,
  allowPresets: true,
  allowOriginalImage: true,
  image: {
    maxWidth: 2048,
    maxHeight: 2048,
    defaultQuality: 85,
  },
  presets: { thumb: "w=100,h=100" },
};

describe("App endpoints", () => {
  const app = withEvlog(new Hono());
  app.use("*", cors(testConfig.cors));
  app.get("/", rootHandler());
  app.get("/health", healthHandler());

  it("root returns service info", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toMatchObject({
      service: "Repix",
      version: "1.0.0",
      documentation: "https://github.com/bansal/repix",
    });
  });

  it("health returns healthy status", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe("healthy");
  });
});
