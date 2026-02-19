import { describe, it, expect } from "vitest";
import { Hono } from "hono";
import { createHealthHandler } from "./health.js";

describe("createHealthHandler", () => {
  it("returns healthy status with service info", async () => {
    const app = new Hono();
    app.get("/health", createHealthHandler());

    const res = await app.request("/health");
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toMatchObject({
      service: "Repix",
      status: "healthy",
      version: "1.0.0",
    });
    expect(json.timestamp).toBeDefined();
    expect(json.uptime).toBeDefined();
    expect(json.memory).toBeDefined();
  });
});
