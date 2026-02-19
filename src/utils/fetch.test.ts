import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchImage } from "./fetch.js";

describe("fetchImage", () => {
  const mockImageBuffer = new ArrayBuffer(100);

  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({ "content-type": "image/jpeg" }),
        arrayBuffer: () => Promise.resolve(mockImageBuffer),
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches image and returns buffer with contentType", async () => {
    const result = await fetchImage("https://example.com/image.jpg");

    expect(result.buffer).toBeInstanceOf(Buffer);
    expect(result.buffer.length).toBe(100);
    expect(result.contentType).toBe("image/jpeg");
    expect(fetch).toHaveBeenCalledWith(
      "https://example.com/image.jpg",
      expect.objectContaining({
        signal: expect.any(AbortSignal),
        headers: expect.objectContaining({
          "User-Agent": "Repix/1.0.0",
        }),
      })
    );
  });

  it("trims charset from content-type", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({
          "content-type": "image/png; charset=utf-8",
        }),
        arrayBuffer: () => Promise.resolve(mockImageBuffer),
      })
    );

    const result = await fetchImage("https://example.com/image.png");
    expect(result.contentType).toBe("image/png");
  });

  it("throws when response is not ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
      })
    );

    await expect(fetchImage("https://example.com/missing.jpg")).rejects.toThrow(
      "Fetch failed"
    );
  });

  it("throws when content-type is not image", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({ "content-type": "text/html" }),
        arrayBuffer: () => Promise.resolve(mockImageBuffer),
      })
    );

    await expect(fetchImage("https://example.com/page.html")).rejects.toThrow(
      "Invalid image"
    );
  });

  it("throws when response body is empty", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({ "content-type": "image/jpeg" }),
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      })
    );

    await expect(fetchImage("https://example.com/empty.jpg")).rejects.toThrow(
      "Invalid image"
    );
  });

  it("throws for invalid URL", async () => {
    await expect(fetchImage("not-a-valid-url")).rejects.toThrow();
  });
});
