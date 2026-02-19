import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { loadConfig } from "./loader.js";

const originalEnv = { ...process.env };

describe("loadConfig", () => {
  beforeEach(() => {
    // Reset env to clean state
    for (const key of Object.keys(process.env)) {
      if (
        key.startsWith("PREFIX") ||
        key.startsWith("PORT") ||
        key.startsWith("CORS") ||
        key.startsWith("MAX_") ||
        key.startsWith("DEFAULT_") ||
        key.startsWith("FETCH_") ||
        key.startsWith("CACHE_") ||
        key.startsWith("ALLOW_") ||
        key === "PRESETS"
      ) {
        delete process.env[key];
      }
    }
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns default config when no config file or env", async () => {
    const config = await loadConfig();

    expect(config.prefix).toBe("https://");
    expect(config.port).toBe(3210);
    expect(config.cors).toEqual({ origin: "*", credentials: false });
    expect(config.image).toMatchObject({
      maxWidth: 2048,
      maxHeight: 2048,
      defaultQuality: 85,
      fetchTimeout: 10000,
      allowCustomTransforms: true,
      allowDefaultPresets: true,
      allowOriginalImage: true,
    });
    expect(config.presets).toEqual({});
  });

  it("overrides prefix from env", async () => {
    process.env.PREFIX = "https://cdn.example.com/";
    const config = await loadConfig();
    expect(config.prefix).toBe("https://cdn.example.com/");
  });

  it("overrides port from env", async () => {
    process.env.PORT = "8080";
    const config = await loadConfig();
    expect(config.port).toBe(8080);
  });

  it("overrides image limits from env", async () => {
    process.env.MAX_WIDTH = "2048";
    process.env.MAX_HEIGHT = "1024";
    const config = await loadConfig();
    expect(config.image.maxWidth).toBe(2048);
    expect(config.image.maxHeight).toBe(1024);
  });

  it("overrides default quality from env", async () => {
    process.env.DEFAULT_QUALITY = "90";
    const config = await loadConfig();
    expect(config.image.defaultQuality).toBe(90);
  });

  it("overrides fetch timeout from env", async () => {
    process.env.FETCH_TIMEOUT = "5000";
    const config = await loadConfig();
    expect(config.image.fetchTimeout).toBe(5000);
  });

  it("overrides cache control from env", async () => {
    process.env.CACHE_CONTROL = "no-cache";
    const config = await loadConfig();
    expect(config.image.cacheControl).toBe("no-cache");
  });

  it("disables custom transforms when ALLOW_CUSTOM_TRANSFORMS=false", async () => {
    process.env.ALLOW_CUSTOM_TRANSFORMS = "false";
    const config = await loadConfig();
    expect(config.image.allowCustomTransforms).toBe(false);
  });

  it("disables default presets when ALLOW_DEFAULT_PRESETS=false", async () => {
    process.env.ALLOW_DEFAULT_PRESETS = "false";
    const config = await loadConfig();
    expect(config.image.allowDefaultPresets).toBe(false);
  });

  it("disables original image when ALLOW_ORIGINAL_IMAGE=false", async () => {
    process.env.ALLOW_ORIGINAL_IMAGE = "false";
    const config = await loadConfig();
    expect(config.image.allowOriginalImage).toBe(false);
  });

  it("parses presets from PRESETS env (JSON)", async () => {
    process.env.PRESETS = JSON.stringify({
      thumb: "w=100,h=100",
      hero: "w=1200,h=600,f=webp",
    });
    const config = await loadConfig();
    expect(config.presets).toEqual({
      thumb: "w=100,h=100",
      hero: "w=1200,h=600,f=webp",
    });
  });

  it("parses CORS origin from env", async () => {
    process.env.CORS_ORIGIN = "https://app.example.com";
    const config = await loadConfig();
    expect(config.cors.origin).toBe("https://app.example.com");
  });

  it("enables CORS credentials when CORS_CREDENTIALS=true", async () => {
    process.env.CORS_CREDENTIALS = "true";
    const config = await loadConfig();
    expect(config.cors.credentials).toBe(true);
  });
});
