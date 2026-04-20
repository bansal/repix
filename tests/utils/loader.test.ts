import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { loadConfig } from "@/utils/loader";

const originalEnv = { ...process.env };

vi.mock("dotenv", () => ({
  default: { config: vi.fn() },
}));

describe("loadConfig", () => {
  beforeEach(() => {
    // Reset env to clean state
    for (const key of Object.keys(process.env)) {
      if (
        key.startsWith("PREFIX") ||
        key.startsWith("SOURCE_") ||
        key === "PORT" ||
        key.startsWith("CORS") ||
        key.startsWith("MAX_") ||
        key.startsWith("IMAGE_") ||
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

    expect(config.sourcePrefix).toBe("https://");
    expect(config.port).toBe(3210);
    expect(config.cors).toEqual({ origin: "*", credentials: false });
    expect(config.fetchTimeout).toBe(10000);
    expect(config.allowCustomTransforms).toBe(true);
    expect(config.allowPresets).toBe(true);
    expect(config.allowOriginalImage).toBe(true);
    expect(config.image).toMatchObject({
      maxWidth: 2048,
      maxHeight: 2048,
      defaultQuality: 85,
    });
    expect(Object.keys(config.presets).length).toBeGreaterThan(0);
    expect(config.presets).toHaveProperty("placeholder", "w=64,q=50,blur=15");
  });

  it("overrides prefix from env", async () => {
    process.env.SOURCE_PREFIX = "https://cdn.example.com/";
    const config = await loadConfig();
    expect(config.sourcePrefix).toBe("https://cdn.example.com/");
  });

  it("overrides sourceHostname from env", async () => {
    process.env.SOURCE_HOSTNAME = "cdn.example.com,images.example.com";
    const config = await loadConfig();
    expect(config.sourceHostname).toBe("cdn.example.com,images.example.com");
  });

  it("overrides port from env", async () => {
    process.env.PORT = "8080";
    const config = await loadConfig();
    expect(config.port).toBe(8080);
  });

  it("overrides image limits from env", async () => {
    process.env.IMAGE_MAX_WIDTH = "2048";
    process.env.IMAGE_MAX_HEIGHT = "1024";
    const config = await loadConfig();
    expect(config.image.maxWidth).toBe(2048);
    expect(config.image.maxHeight).toBe(1024);
  });

  it("overrides default quality from env", async () => {
    process.env.IMAGE_DEFAULT_QUALITY = "90";
    const config = await loadConfig();
    expect(config.image.defaultQuality).toBe(90);
  });

  it("overrides fetch timeout from env", async () => {
    process.env.FETCH_TIMEOUT = "5000";
    const config = await loadConfig();
    expect(config.fetchTimeout).toBe(5000);
  });

  it("overrides cache control from env", async () => {
    process.env.CACHE_CONTROL = "no-cache";
    const config = await loadConfig();
    expect(config.cacheControl).toBe("no-cache");
  });

  it("disables custom transforms when ALLOW_CUSTOM_TRANSFORMS=false", async () => {
    process.env.ALLOW_CUSTOM_TRANSFORMS = "false";
    const config = await loadConfig();
    expect(config.allowCustomTransforms).toBe(false);
  });

  it("disables presets when ALLOW_PRESETS=false", async () => {
    process.env.ALLOW_PRESETS = "false";
    const config = await loadConfig();
    expect(config.allowPresets).toBe(false);
  });

  it("disables original image when ALLOW_ORIGINAL_IMAGE=false", async () => {
    process.env.ALLOW_ORIGINAL_IMAGE = "false";
    const config = await loadConfig();
    expect(config.allowOriginalImage).toBe(false);
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
