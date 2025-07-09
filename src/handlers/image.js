import { parseTransformParams } from "../utils/params.js";
import { fetchImage } from "../utils/fetch.js";
import { transformImage } from "../utils/transform.js";

/**
 * Main image transformation handler
 */
export function createImageHandler(config) {
  return async (c) => {
    try {
      const { transform } = c.req.param();

      // Extract path manually from URL since Hono wildcard doesn't work as expected
      const url = new URL(c.req.url);
      const pathParts = url.pathname.split("/");
      // Remove empty, 'images', and transform parts to get the image path
      const imagePath = pathParts.slice(3).join("/"); // Skip '', 'images', and transform

      if (!transform || !imagePath) {
        return c.json(
          { error: "Missing transform parameters or image path" },
          400
        );
      }

      const path = imagePath;

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
      const imageBuffer = await fetchImage(
        sourceUrl,
        config.image.fetchTimeout
      );

      // Transform image
      const { buffer, format, info } = await transformImage(
        imageBuffer,
        params,
        config.image.defaultQuality
      );

      // Set response headers
      c.header("Content-Type", `image/${format}`);
      c.header("Cache-Control", config.image.cacheControl);
      c.header("X-Image-Width", info.width.toString());
      c.header("X-Image-Height", info.height.toString());
      c.header("X-Image-Format", format);
      c.header("X-Image-Size", buffer.length.toString());

      return c.body(buffer);
    } catch (error) {
      console.error("Image processing error:", error);
      throw error; // Will be caught by the error handler
    }
  };
}
