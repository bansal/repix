import { existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { defu } from "defu";
import type { Config } from "../types/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "../..");

/**
 * Load configuration from config.js and override with environment variables
 */
export async function loadConfig(): Promise<Config> {
  let config: Partial<Config> = {};

  // Try to load config.js
  const configPath = join(projectRoot, "config.js");

  if (existsSync(configPath)) {
    try {
      const configModule = await import(`file://${configPath}`);
      config = configModule.default || {};
    } catch (error) {
      console.warn(
        "Warning: Could not load config.js:",
        (error as Error).message
      );
    }
  }

  // Override with environment variables
  const envOverrides: Partial<Config> = {
    prefix: process.env.PREFIX,
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : undefined,
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      credentials: process.env.CORS_CREDENTIALS === "true",
    },
    image: {
      maxWidth: process.env.MAX_WIDTH
        ? parseInt(process.env.MAX_WIDTH, 10)
        : 4096,
      maxHeight: process.env.MAX_HEIGHT
        ? parseInt(process.env.MAX_HEIGHT, 10)
        : 4096,
      defaultQuality: process.env.DEFAULT_QUALITY
        ? parseInt(process.env.DEFAULT_QUALITY, 10)
        : 85,
      fetchTimeout: process.env.FETCH_TIMEOUT
        ? parseInt(process.env.FETCH_TIMEOUT, 10)
        : 10000,
      cacheControl:
        process.env.CACHE_CONTROL || "public, max-age=31536000, immutable",
      allowCustomTransforms: process.env.ALLOW_CUSTOM_TRANSFORMS !== "false",
    },
  };

  // Parse presets from environment if provided
  if (process.env.PRESETS) {
    try {
      envOverrides.presets = JSON.parse(process.env.PRESETS);
    } catch (error) {
      console.warn(
        "Warning: Could not parse PRESETS environment variable:",
        (error as Error).message
      );
    }
  }

  // Merge configurations (env overrides config file)
  const mergedConfig = defu(envOverrides, config);

  // Set defaults for required fields
  const defaultConfig: Config = {
    prefix: "https://",
    port: 3000,
    cors: {
      origin: "*",
      credentials: false,
    },
    image: {
      maxWidth: 4096,
      maxHeight: 4096,
      defaultQuality: 85,
      fetchTimeout: 10000,
      cacheControl: "public, max-age=31536000, immutable",
      allowCustomTransforms: true,
    },
    presets: {},
  };

  return defu(mergedConfig, defaultConfig) as Config;
}
