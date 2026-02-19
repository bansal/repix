import { describe, it, expect } from "vitest";
import { Hono } from "hono";
import { createPresetHandler } from "./presets.js";
import type { Config } from "../types/index.js";

const defaultConfig: Config = {
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
  presets: {
    thumbnail: "w=150,h=150,f=jpeg",
    banner: "w=800,h=200,f=webp",
  },
};

describe("createPresetHandler", () => {
  it("returns presets when allowDefaultPresets is true", async () => {
    const app = new Hono();
    app.get("/presets", createPresetHandler(defaultConfig));

    const res = await app.request("/presets");
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toMatchObject({
      service: "Repix",
      presets: defaultConfig.presets,
      count: 2,
      allowCustomTransforms: true,
    });
  });

  it("returns empty presets when allowDefaultPresets is false", async () => {
    const config: Config = {
      ...defaultConfig,
      image: {
        ...defaultConfig.image,
        allowDefaultPresets: false,
      },
    };
    const app = new Hono();
    app.get("/presets", createPresetHandler(config));

    const res = await app.request("/presets");
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.presets).toEqual({});
    expect(json.count).toBe(0);
  });

  it("indicates allowCustomTransforms: false when disabled", async () => {
    const config: Config = {
      ...defaultConfig,
      image: {
        ...defaultConfig.image,
        allowCustomTransforms: false,
      },
    };
    const app = new Hono();
    app.get("/presets", createPresetHandler(config));

    const res = await app.request("/presets");
    const json = await res.json();
    expect(json.allowCustomTransforms).toBe(false);
  });
});
