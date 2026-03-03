import { RepixErrors } from "../errors";

export interface FetchImageResult {
  buffer: Buffer;
  contentType: string;
}

/**
 * Fetch image from URL with timeout
 */
export async function fetchImage(
  url: string,
  timeout = 10000
): Promise<FetchImageResult> {
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
      throw RepixErrors.fetchFailed(response.status);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.startsWith("image/")) {
      throw RepixErrors.invalidImage("Response is not an image");
    }

    const buffer = await response.arrayBuffer();

    if (buffer.byteLength === 0) {
      throw RepixErrors.invalidImage("Empty response");
    }

    return {
      buffer: Buffer.from(buffer),
      contentType: contentType.split(";")[0].trim(),
    };
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw RepixErrors.requestTimeout();
    }

    throw error;
  }
}
