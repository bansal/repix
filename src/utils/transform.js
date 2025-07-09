import sharp from "sharp";

/**
 * Transform image using Sharp
 */
export async function transformImage(buffer, params, defaultQuality = 85) {
  try {
    let image = sharp(buffer);

    // Get original image metadata
    const metadata = await image.metadata();

    // Validate image
    if (!metadata.width || !metadata.height) {
      throw new Error("Invalid image: Could not read image metadata");
    }

    // Apply transformations in the correct order

    // 1. Rotation (before resize)
    if (params.rotate) {
      image = image.rotate(params.rotate);
    }

    // 2. Flip (before resize)
    if (params.flip) {
      if (params.flip === "h" || params.flip === "hv") {
        image = image.flop();
      }
      if (params.flip === "v" || params.flip === "hv") {
        image = image.flip();
      }
    }

    // 3. Resize
    if (params.width || params.height) {
      const resizeOptions = {
        width: params.width,
        height: params.height,
        fit: mapFitMode(params.fit || "cover"),
        position: mapGravity(params.gravity || "center"),
        withoutEnlargement: params.fit === "scale-down",
      };

      // Handle background color for pad mode
      if (params.fit === "pad" && params.background) {
        resizeOptions.background = parseColor(params.background);
      }

      image = image.resize(resizeOptions);
    }

    // 4. Image adjustments
    if (params.blur && params.blur > 0) {
      image = image.blur(Math.min(params.blur, 250));
    }

    if (params.sharpen && params.sharpen > 0) {
      image = image.sharpen(Math.min(params.sharpen, 10));
    }

    if (params.brightness && params.brightness !== 1) {
      image = image.modulate({ brightness: params.brightness });
    }

    if (params.saturation && params.saturation !== 1) {
      image = image.modulate({ saturation: params.saturation });
    }

    // 5. Format and quality
    const format = params.format || getOptimalFormat(metadata.format);
    const quality = params.quality || defaultQuality;

    switch (format) {
      case "jpeg":
      case "jpg":
        image = image.jpeg({
          quality: Math.max(1, Math.min(100, quality)),
          progressive: true,
          mozjpeg: true,
        });
        break;

      case "png":
        // PNG quality affects compression level (1-9, where 9 is best compression)
        const compressionLevel = Math.round((100 - quality) / 11) + 1;
        image = image.png({
          compressionLevel: Math.max(1, Math.min(9, compressionLevel)),
          progressive: true,
        });
        break;

      case "webp":
        image = image.webp({
          quality: Math.max(1, Math.min(100, quality)),
          effort: 4,
        });
        break;

      case "avif":
        image = image.avif({
          quality: Math.max(1, Math.min(100, quality)),
          effort: 4,
        });
        break;

      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    // Generate final image
    const outputBuffer = await image.toBuffer({ resolveWithObject: true });

    return {
      buffer: outputBuffer.data,
      format: format === "jpg" ? "jpeg" : format,
      info: outputBuffer.info,
    };
  } catch (error) {
    if (
      error.message.includes("Input file contains unsupported image format")
    ) {
      throw new Error("Invalid image format");
    }

    if (error.message.includes("Image too large")) {
      throw new Error("Image too large");
    }

    throw error;
  }
}

/**
 * Map fit mode to Sharp's fit options
 */
function mapFitMode(fit) {
  const fitMap = {
    cover: "cover",
    contain: "contain",
    "scale-down": "inside",
    crop: "cover",
    pad: "contain",
  };

  return fitMap[fit] || "cover";
}

/**
 * Map gravity to Sharp's position options
 */
function mapGravity(gravity) {
  const gravityMap = {
    auto: "attention",
    center: "center",
    centre: "center",
    north: "top",
    northeast: "right top",
    east: "right",
    southeast: "right bottom",
    south: "bottom",
    southwest: "left bottom",
    west: "left",
    northwest: "left top",
  };

  return gravityMap[gravity] || "center";
}

/**
 * Parse color string to Sharp-compatible format
 */
function parseColor(color) {
  // Handle hex colors
  if (/^#[0-9a-f]{3,6}$/i.test(color)) {
    return color;
  }

  // Handle named colors
  const namedColors = {
    white: "#ffffff",
    black: "#000000",
    red: "#ff0000",
    green: "#008000",
    blue: "#0000ff",
    yellow: "#ffff00",
    cyan: "#00ffff",
    magenta: "#ff00ff",
    transparent: { r: 0, g: 0, b: 0, alpha: 0 },
  };

  if (namedColors[color.toLowerCase()]) {
    return namedColors[color.toLowerCase()];
  }

  // Default to white if we can't parse
  return "#ffffff";
}

/**
 * Get optimal format based on source format and capabilities
 */
function getOptimalFormat(sourceFormat) {
  // Preserve source format by default, but optimize for web
  switch (sourceFormat) {
    case "jpeg":
    case "jpg":
      return "jpeg";
    case "png":
      return "png";
    case "gif":
      return "png"; // Convert GIF to PNG to avoid animation issues
    case "webp":
      return "webp";
    case "avif":
      return "avif";
    default:
      return "jpeg"; // Default fallback
  }
}
