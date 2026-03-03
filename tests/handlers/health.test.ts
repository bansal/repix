import { describe, it, expect } from "vitest";
import { Hono } from "hono";
import { healthHandler } from "@/handlers/health";
import { withEvlog } from "../helpers";

describe("healthHandler", () => {
  it("returns healthy status with service info", async () => {
    const app = withEvlog(new Hono());
    app.get("/health", healthHandler());

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
