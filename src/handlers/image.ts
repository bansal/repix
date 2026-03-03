import type { Handler } from "hono";
import { joinURL } from "ufo";
import type { AppBindings, Config } from "../types";
import { RepixErrors } from "../errors";
import { parseTransformParams } from "../utils/params";
import { fetchImage } from "../utils/fetch";
import { transformImage } from "../utils/transform";

export function imageHandler(config: Config): Handler<AppBindings> {
  return async (c) => {
    const log = c.get("log");
    try {
      const { transform } = c.req.param();

      // Extract path manually from URL since Hono wildcard doesn't work as expected
      const url = new URL(c.req.url);
      const pathParts = url.pathname.split("/");
      // Remove empty and transform parts to get the image path
      const imagePath = pathParts.slice(2).join("/"); // Skip '' and transform

      if (!transform || !imagePath) {
        throw RepixErrors.missingParams();
      }

      const path = imagePath;
      log.set({ transform, path });

      // Validate hostname when sourcePrefix is not set or 'https://'
      const useHostnameRestriction =
        (!config.sourcePrefix || config.sourcePrefix === "https://") &&
        config.sourceHostname?.trim();
      if (useHostnameRestriction) {
        const allowedHostnames = config.sourceHostname
          .split(",")
          .map((h) => h.trim().toLowerCase())
          .filter(Boolean);
        const pathHostname = path.split("/")[0]?.toLowerCase();
        if (!pathHostname || !allowedHostnames.includes(pathHostname)) {
          throw RepixErrors.hostnameNotAllowed();
        }
      }

      // /original/{path} - serve image directly without Sharp processing
      if (transform === "original") {
        if (config.allowOriginalImage === false) {
          throw RepixErrors.originalDisabled();
        }

        const sourceUrl = joinURL(config.sourcePrefix, path);
        const { buffer, contentType } = await fetchImage(
          sourceUrl,
          config.fetchTimeout,
        );

        return new Response(new Uint8Array(buffer), {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": config.cacheControl,
            "X-Powered-By": "Repix",
          },
        });
      }

      // Parse transformation parameters
      const params = parseTransformParams(
        transform,
        config.presets,
        config.allowCustomTransforms !== false, // Default to true if not specified
      );

      // Validate dimensions against limits
      if (params.width && params.width > config.image.maxWidth) {
        throw RepixErrors.widthExceeded(config.image.maxWidth);
      }

      if (params.height && params.height > config.image.maxHeight) {
        throw RepixErrors.heightExceeded(config.image.maxHeight);
      }

      // Construct source image URL
      const sourceUrl = joinURL(config.sourcePrefix, path);

      // Fetch source image
      const { buffer: imageBuffer } = await fetchImage(
        sourceUrl,
        config.fetchTimeout,
      );

      // Transform image
      const transformStart = performance.now();
      const { buffer, format, info } = await transformImage(
        imageBuffer,
        params,
        config.image.defaultQuality,
      );
      const durationMs = Math.round(performance.now() - transformStart);
      log.set({
        durationMs,
        bytesTransferred: buffer.length,
      });

      // Return binary response with headers
      return new Response(new Uint8Array(buffer), {
        headers: {
          "Content-Type": `image/${format}`,
          "Cache-Control": config.cacheControl,
          "X-Image-Width": info.width.toString(),
          "X-Image-Height": info.height.toString(),
          "X-Image-Format": format,
          "X-Image-Size": buffer.length.toString(),
          "X-Powered-By": "Repix",
        },
      });
    } catch (error) {
      log.error(error as Error);
      throw error; // Will be caught by the error handler
    }
  };
}
