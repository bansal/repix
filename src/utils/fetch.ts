/**
 * Fetch image from URL with timeout
 */
export async function fetchImage(
  url: string,
  timeout = 10000
): Promise<Buffer> {
  try {
    // Validate URL
    new URL(url); // Will throw if invalid

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Repix/1.0.0",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(
        `Fetch failed: ${response.status} ${response.statusText}`
      );
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.startsWith("image/")) {
      throw new Error("Invalid image: Response is not an image");
    }

    const buffer = await response.arrayBuffer();

    if (buffer.byteLength === 0) {
      throw new Error("Invalid image: Empty response");
    }

    return Buffer.from(buffer);
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Request timeout");
    }

    throw error;
  }
}
