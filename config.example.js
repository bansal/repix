export default {
  // Source URL prefix - used when reconstructing image URLs
  prefix: "https://",

  // CORS settings
  cors: {
    origin: "*",
    credentials: false,
  },

  // Image processing settings
  image: {
    // Maximum dimensions to prevent abuse
    maxWidth: 2048,
    maxHeight: 2048,

    // Default quality settings
    defaultQuality: 85,

    // Timeout for fetching source images (in ms)
    fetchTimeout: 10000,

    // Cache control headers; defaults to 1 year
    cacheControl: "public, max-age=31536000, immutable",

    // Whether to allow custom transformations beyond presets
    // If false, only predefined presets can be used
    allowCustomTransforms: true,
    allowDefaultPresets: true,

    // Whether to allow serving original images at /original/{path} without processing
    // If false, /original/* requests return 403
    allowOriginalImage: true,
  },

  // Predefined transformation presets
  presets: {
    xs: "w=64,q=85",
    sm: "w=128,q=85",
    md: "w=256,q=85",
    lg: "w=512,q=85",
    xl: "w=1024,q=85",
    full: "q=85",
  },
};
