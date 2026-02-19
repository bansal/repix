import { describe, it, expect } from "vitest";
import { parseTransformParams } from "./params.js";

describe("parseTransformParams", () => {
  const presets = {
    thumbnail: "w=150,h=150,f=jpeg,q=80",
    banner: "w=800,h=200,f=webp,q=85",
    "repix-thumb": "w=64,h=64,f=webp",
  };

  describe("custom transform parameters", () => {
    it("parses width, height, format, and quality", () => {
      const result = parseTransformParams("w=300,h=200,f=jpeg,q=80", {}, true);
      expect(result).toEqual({
        width: 300,
        height: 200,
        format: "jpeg",
        quality: 80,
      });
    });

    it("parses with param aliases (w, h, q, f, g)", () => {
      const result = parseTransformParams("w=500,h=400,q=90,f=webp,g=center", {}, true);
      expect(result).toEqual({
        width: 500,
        height: 400,
        quality: 90,
        format: "webp",
        gravity: "center",
      });
    });

    it("parses fit options", () => {
      const cover = parseTransformParams("w=400,h=400,fit=cover", {}, true);
      expect(cover.fit).toBe("cover");

      const contain = parseTransformParams("w=400,h=400,fit=contain", {}, true);
      expect(contain.fit).toBe("contain");

      const scaleDown = parseTransformParams("w=400,h=400,fit=scale-down", {}, true);
      expect(scaleDown.fit).toBe("scale-down");
    });

    it("parses flip options", () => {
      expect(parseTransformParams("flip=h", {}, true).flip).toBe("h");
      expect(parseTransformParams("flip=v", {}, true).flip).toBe("v");
      expect(parseTransformParams("flip=hv", {}, true).flip).toBe("hv");
    });

    it("parses rotate", () => {
      const result = parseTransformParams("rotate=90", {}, true);
      expect(result.rotate).toBe(90);
    });

    it("parses blur and sharpen", () => {
      const result = parseTransformParams("blur=5,sharpen=2", {}, true);
      expect(result.blur).toBe(5);
      expect(result.sharpen).toBe(2);
    });

    it("parses background color (hex)", () => {
      const result = parseTransformParams("background=#ff0000", {}, true);
      expect(result.background).toBe("#ff0000");
    });

    it("parses background color (named)", () => {
      const result = parseTransformParams("background=transparent", {}, true);
      expect(result.background).toBe("transparent");
    });

    it("ignores invalid fit values", () => {
      const result = parseTransformParams("fit=invalid", {}, true);
      expect(result.fit).toBeUndefined();
    });

    it("ignores invalid format values", () => {
      const result = parseTransformParams("f=tiff", {}, true);
      expect(result.format).toBeUndefined();
    });

    it("handles empty or malformed pairs", () => {
      const result = parseTransformParams("w=100,,h=200,=", {}, true);
      expect(result).toEqual({ width: 100, height: 200 });
    });
  });

  describe("preset resolution", () => {
    it("resolves preset to params", () => {
      const result = parseTransformParams("thumbnail", presets, true);
      expect(result).toEqual({
        width: 150,
        height: 150,
        format: "jpeg",
        quality: 80,
      });
    });

    it("resolves repix-thumb preset", () => {
      const result = parseTransformParams("repix-thumb", presets, true);
      expect(result).toEqual({
        width: 64,
        height: 64,
        format: "webp",
      });
    });
  });

  describe("allowCustomTransforms", () => {
    it("allows custom transforms when true", () => {
      const result = parseTransformParams("w=100,h=100", presets, true);
      expect(result.width).toBe(100);
      expect(result.height).toBe(100);
    });

    it("throws when custom transforms disabled and not a preset", () => {
      expect(() =>
        parseTransformParams("w=100,h=100", presets, false)
      ).toThrow("Custom transformations not allowed");
    });

    it("allows preset when custom transforms disabled", () => {
      const result = parseTransformParams("thumbnail", presets, false);
      expect(result).toEqual({
        width: 150,
        height: 150,
        format: "jpeg",
        quality: 80,
      });
    });
  });

  describe("format validation", () => {
    it("accepts valid formats", () => {
      const formats = ["jpeg", "jpg", "png", "webp", "avif"];
      for (const fmt of formats) {
        const result = parseTransformParams(`f=${fmt}`, {}, true);
        expect(result.format).toBe(fmt.toLowerCase());
      }
    });

    it("normalizes format to lowercase", () => {
      const result = parseTransformParams("f=WEBP", {}, true);
      expect(result.format).toBe("webp");
    });
  });
});
