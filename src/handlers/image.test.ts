import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Hono } from "hono";
import { createImageHandler } from "./image.js";
import type { Config } from "../types/index.js";

vi.mock("../utils/fetch.js", () => ({
  fetchImage: vi.fn(),
}));

vi.mock("../utils/transform.js", () => ({
  transformImage: vi.fn(),
}));

import { fetchImage } from "../utils/fetch.js";
import { transformImage } from "../utils/transform.js";

const mockFetchImage = vi.mocked(fetchImage);
const mockTransformImage = vi.mocked(transformImage);

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
  },
};

function createApp(config: Config = defaultConfig) {
  const app = new Hono();
  app.get("/:transform/*", createImageHandler(config));
  return app;
}

describe("createImageHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockFetchImage.mockResolvedValue({
      buffer: Buffer.from("fake-image-data"),
      contentType: "image/jpeg",
    });
    mockTransformImage.mockResolvedValue({
      buffer: Buffer.from("transformed-image"),
      format: "jpeg",
      info: { width: 300, height: 200, channels: 3, size: 1234 },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("validation", () => {
    it("returns 400 when image path is missing (single segment)", async () => {
      const app = createApp();
      const res = await app.request("http://localhost/w=300");
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toContain("Missing");
    });
  });

  describe("original image serving", () => {
    it("serves original image when allowOriginalImage is true", async () => {
      const app = createApp();
      const res = await app.request(
        "http://localhost/original/images.unsplash.com/photo.jpg"
      );

      expect(res.status).toBe(200);
      expect(mockFetchImage).toHaveBeenCalledWith(
        "https://images.unsplash.com/photo.jpg",
        10000
      );
      expect(mockTransformImage).not.toHaveBeenCalled();
      expect(res.headers.get("Content-Type")).toBe("image/jpeg");
    });

    it("returns 403 when allowOriginalImage is false", async () => {
      const config: Config = {
        ...defaultConfig,
        image: { ...defaultConfig.image, allowOriginalImage: false },
      };
      const app = createApp(config);
      const res = await app.request(
        "http://localhost/original/images.unsplash.com/photo.jpg"
      );

      expect(res.status).toBe(403);
      const json = await res.json();
      expect(json.error).toContain("disabled");
    });
  });

  describe("transform with custom params", () => {
    it("transforms image and returns with correct headers", async () => {
      const app = createApp();
      const res = await app.request(
        "http://localhost/w=300,h=200,f=jpeg/images.unsplash.com/photo.jpg"
      );

      expect(res.status).toBe(200);
      expect(mockFetchImage).toHaveBeenCalledWith(
        "https://images.unsplash.com/photo.jpg",
        10000
      );
      expect(mockTransformImage).toHaveBeenCalled();
      expect(res.headers.get("Content-Type")).toBe("image/jpeg");
      expect(res.headers.get("X-Image-Width")).toBe("300");
      expect(res.headers.get("X-Image-Height")).toBe("200");
      expect(res.headers.get("X-Image-Format")).toBe("jpeg");
    });

    it("returns 400 when width exceeds maxWidth", async () => {
      const app = createApp();
      const res = await app.request(
        "http://localhost/w=3000,h=200,f=jpeg/images.unsplash.com/photo.jpg"
      );

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toContain("Width exceeds maximum");
      expect(mockTransformImage).not.toHaveBeenCalled();
    });

    it("returns 400 when height exceeds maxHeight", async () => {
      const app = createApp();
      const res = await app.request(
        "http://localhost/w=300,h=3000,f=jpeg/images.unsplash.com/photo.jpg"
      );

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toContain("Height exceeds maximum");
    });
  });

  describe("preset transforms", () => {
    it("transforms using preset params", async () => {
      const app = createApp();
      const res = await app.request(
        "http://localhost/thumbnail/images.unsplash.com/photo.jpg"
      );

      expect(res.status).toBe(200);
      expect(mockTransformImage).toHaveBeenCalledWith(
        expect.any(Buffer),
        expect.objectContaining({ width: 150, height: 150, format: "jpeg" }),
        85
      );
    });
  });

  describe("allowCustomTransforms", () => {
    it("returns 403 when custom transform requested but disabled", async () => {
      const config: Config = {
        ...defaultConfig,
        image: { ...defaultConfig.image, allowCustomTransforms: false },
      };
      const app = createApp(config);
      app.onError((err, c) => {
        if (err.message.includes("Custom transformations not allowed")) {
          return c.json({ error: err.message }, 403);
        }
        throw err;
      });

      const res = await app.request(
        "http://localhost/w=300,h=200,f=jpeg/images.unsplash.com/photo.jpg"
      );

      expect(res.status).toBe(403);
    });

    it("allows preset when custom transforms disabled", async () => {
      const config: Config = {
        ...defaultConfig,
        image: { ...defaultConfig.image, allowCustomTransforms: false },
      };
      const app = createApp(config);
      app.onError((err, c) => {
        if (err.message.includes("Custom transformations not allowed")) {
          return c.json({ error: err.message }, 403);
        }
        throw err;
      });

      const res = await app.request(
        "http://localhost/thumbnail/images.unsplash.com/photo.jpg"
      );

      expect(res.status).toBe(200);
    });
  });
});
