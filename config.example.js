export default {
  // Source URL prefix - used when reconstructing image URLs
  prefix: "https://",

  // Server configuration
  port: 3000,

  // CORS settings
  cors: {
    origin: "*",
    credentials: false,
  },

  // Image processing settings
  image: {
    // Maximum dimensions to prevent abuse
    maxWidth: 4096,
    maxHeight: 4096,

    // Default quality settings
    defaultQuality: 85,

    // Timeout for fetching source images (in ms)
    fetchTimeout: 10000,

    // Cache control headers
    cacheControl: "public, max-age=31536000, immutable",

    // Whether to allow custom transformations beyond presets
    // If false, only predefined presets can be used
    allowCustomTransforms: true,
  },

  // Predefined transformation presets
  presets: {
    // Common thumbnail sizes
    thumbnail: "w=200,h=200,fit=cover,f=webp,q=85",
    "thumbnail-small": "w=100,h=100,fit=cover,f=webp,q=85",
    "thumbnail-large": "w=400,h=400,fit=cover,f=webp,q=85",

    // Banner/header images
    banner: "w=1200,h=300,fit=cover,f=webp,q=85",
    "banner-mobile": "w=800,h=200,fit=cover,f=webp,q=85",

    // Avatar images
    avatar: "w=128,h=128,fit=cover,f=webp,q=90",
    "avatar-small": "w=64,h=64,fit=cover,f=webp,q=90",

    // Social media optimized
    "social-square": "w=1080,h=1080,fit=cover,f=jpeg,q=85",
    "social-landscape": "w=1200,h=630,fit=cover,f=jpeg,q=85",

    // Gallery/lightbox
    gallery: "w=800,h=600,fit=contain,f=webp,q=90",
    lightbox: "w=1920,h=1080,fit=contain,f=webp,q=95",
  },
};
