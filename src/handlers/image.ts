import type { Handler } from "hono";
import type { Config } from "../types/index.js";
import { parseTransformParams } from "../utils/params.js";
import { fetchImage } from "../utils/fetch.js";
import { transformImage } from "../utils/transform.js";

/**
 * Main image transformation handler
 */
export function createImageHandler(config: Config): Handler {
  return async (c) => {
    try {
      const { transform } = c.req.param();

      // Extract path manually from URL since Hono wildcard doesn't work as expected
      const url = new URL(c.req.url);
      const pathParts = url.pathname.split("/");
      // Remove empty and transform parts to get the image path
      const imagePath = pathParts.slice(2).join("/"); // Skip '' and transform

      if (!transform || !imagePath) {
        return c.json(
          { error: "Missing transform parameters or image path" },
          400
        );
      }

      const path = imagePath;

      // /original/{path} - serve image directly without Sharp processing
      if (transform === "original") {
        if (config.image.allowOriginalImage === false) {
          return c.json(
            { error: "Original image serving is disabled" },
            403
          );
        }

        const sourceUrl = `${config.prefix}${path}`;
        const { buffer, contentType } = await fetchImage(
          sourceUrl,
          config.image.fetchTimeout
        );

        return new Response(new Uint8Array(buffer), {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": config.image.cacheControl,
            "X-Powered-By": "Repix",
          },
        });
      }

      // Parse transformation parameters
      const params = parseTransformParams(
        transform,
        config.presets,
        config.image.allowCustomTransforms !== false // Default to true if not specified
      );

      // Validate dimensions against limits
      if (params.width && params.width > config.image.maxWidth) {
        return c.json(
          { error: `Width exceeds maximum of ${config.image.maxWidth}px` },
          400
        );
      }

      if (params.height && params.height > config.image.maxHeight) {
        return c.json(
          { error: `Height exceeds maximum of ${config.image.maxHeight}px` },
          400
        );
      }

      // Construct source image URL
      const sourceUrl = `${config.prefix}${path}`;

      // Fetch source image
      const { buffer: imageBuffer } = await fetchImage(
        sourceUrl,
        config.image.fetchTimeout
      );

      // Transform image
      const { buffer, format, info } = await transformImage(
        imageBuffer,
        params,
        config.image.defaultQuality
      );

      // Return binary response with headers
      return new Response(new Uint8Array(buffer), {
        headers: {
          "Content-Type": `image/${format}`,
          "Cache-Control": config.image.cacheControl,
          "X-Image-Width": info.width.toString(),
          "X-Image-Height": info.height.toString(),
          "X-Image-Format": format,
          "X-Image-Size": buffer.length.toString(),
          "X-Powered-By": "Repix",
        },
      });
    } catch (error) {
      console.error("Image processing error:", error);
      throw error; // Will be caught by the error handler
    }
  };
}
