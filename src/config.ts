import type { Config, Colors } from "./types";

const defaultConfig: Config = {
  port: 3210,
  // Source URL prefix - used when reconstructing image URLs
  sourcePrefix: "https://",
  // Allowed hostnames when sourcePrefix is not set or 'https://'
  // Comma-separated list, e.g. "cdn.example.com,images.example.com"
  sourceHostname: "",

  // CORS settings
  cors: {
    origin: "*",
    credentials: false,
  },
  // Timeout for fetching source images (in ms)
  fetchTimeout: 10000,

  // Cache control headers; defaults to 1 year
  cacheControl: "public, max-age=31536000, immutable",

  // Whether to allow custom transformations beyond presets
  // If false, only predefined presets can be used
  allowPresets: true,
  allowCustomTransforms: true,

  // Whether to allow serving original images at /original/{path} without processing
  // If false, /original/* requests return 403
  allowOriginalImage: true,

  presets: {
    xs: "w=64,q=85",
    sm: "w=128,q=85",
    md: "w=256,q=85",
    lg: "w=512,q=85",
    xl: "w=1024,q=85",
    full: "q=85",
  },

  // Image processing settings
  image: {
    // Maximum dimensions to prevent abuse
    maxWidth: 2048,
    maxHeight: 2048,
    // Default quality settings
    defaultQuality: 85,
  },

  // logging: OTLP endpoint and sampling (see https://www.evlog.dev)
  logging: {
    otlpEndpoint: "",
    otlpHeaders: {},
    samplingRates: {
      info: 10,
      error: 100,
    },
  },
};

/**
 * Colors supported for background parameter.
 * Maps color names to Sharp-compatible values.
 */
export const COLORS: Colors = {
  white: "#ffffff",
  black: "#000000",
  transparent: { r: 0, g: 0, b: 0, alpha: 0 },
};

export default defaultConfig;
