/**
 * Parse transformation parameters from URL
 */
export function parseTransformParams(
  transform,
  presets = {},
  allowCustomTransforms = true
) {
  // Check if it's a preset
  if (presets[transform]) {
    return parseParamString(presets[transform]);
  }

  // If custom transforms are not allowed and it's not a preset, throw error
  if (!allowCustomTransforms) {
    throw new Error(
      `Custom transformations not allowed. Available presets: ${Object.keys(
        presets
      ).join(", ")}`
    );
  }

  // Parse as parameter string
  return parseParamString(transform);
}

/**
 * Parse parameter string into object
 */
function parseParamString(paramString) {
  const params = {};

  // Split by comma and parse each parameter
  const pairs = paramString.split(",");

  for (const pair of pairs) {
    const [key, value] = pair.split("=");

    if (!key || value === undefined) {
      continue;
    }

    const normalizedKey = normalizeParamKey(key.trim());
    const normalizedValue = normalizeParamValue(value.trim(), normalizedKey);

    if (normalizedKey && normalizedValue !== null) {
      params[normalizedKey] = normalizedValue;
    }
  }

  return params;
}

/**
 * Normalize parameter keys (handle aliases)
 */
function normalizeParamKey(key) {
  const aliases = {
    w: "width",
    h: "height",
    q: "quality",
    f: "format",
    g: "gravity",
  };

  return aliases[key] || key;
}

/**
 * Normalize parameter values based on key
 */
function normalizeParamValue(value, key) {
  // Numeric parameters
  if (
    [
      "width",
      "height",
      "quality",
      "blur",
      "sharpen",
      "rotate",
      "brightness",
      "contrast",
      "gamma",
      "saturation",
    ].includes(key)
  ) {
    const num = parseInt(value, 10);
    return isNaN(num) ? null : num;
  }

  // Boolean parameters
  if (["anim"].includes(key)) {
    return value === "true" || value === "1";
  }

  // String parameters with validation
  if (key === "fit") {
    const validFits = ["cover", "contain", "scale-down", "crop", "pad"];
    return validFits.includes(value) ? value : null;
  }

  if (key === "format") {
    const validFormats = ["jpeg", "jpg", "png", "webp", "avif"];
    return validFormats.includes(value.toLowerCase())
      ? value.toLowerCase()
      : null;
  }

  if (key === "gravity") {
    const validGravity = [
      "auto",
      "center",
      "north",
      "northeast",
      "east",
      "southeast",
      "south",
      "southwest",
      "west",
      "northwest",
    ];
    return validGravity.includes(value) ? value : null;
  }

  if (key === "flip") {
    const validFlips = ["h", "v", "hv"];
    return validFlips.includes(value) ? value : null;
  }

  // Color values (background)
  if (key === "background") {
    // Accept hex colors, named colors, or rgb/rgba values
    if (/^#[0-9a-f]{6}$/i.test(value) || /^#[0-9a-f]{3}$/i.test(value)) {
      return value;
    }

    const namedColors = [
      "white",
      "black",
      "red",
      "green",
      "blue",
      "yellow",
      "cyan",
      "magenta",
      "transparent",
    ];
    if (namedColors.includes(value.toLowerCase())) {
      return value.toLowerCase();
    }

    // RGB/RGBA values would need more complex parsing
    return value;
  }

  // Default: return as string
  return value;
}
