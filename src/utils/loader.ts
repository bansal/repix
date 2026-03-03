import dotenv from "dotenv";
import type { Config, LoggingSamplingRates } from "../types";
import defaultConfig from "../config";

function parseOtlpHeaders(): Record<string, string> | undefined {
  const raw = process.env.LOG_OTLP_HEADERS;
  if (!raw?.trim()) return undefined;
  const headers: Record<string, string> = {};
  const decoded = decodeURIComponent(raw);
  for (const pair of decoded.split(",")) {
    const eqIndex = pair.indexOf("=");
    if (eqIndex > 0) {
      const key = pair.slice(0, eqIndex).trim();
      const value = pair.slice(eqIndex + 1).trim();
      if (key && value) headers[key] = value;
    }
  }
  return Object.keys(headers).length ? headers : undefined;
}

function parseSamplingRates(): LoggingSamplingRates | undefined {
  const info = process.env.LOG_SAMPLING_INFO;
  const error = process.env.LOG_SAMPLING_ERROR;
  if (!info && !error) return undefined;
  const rates: LoggingSamplingRates = {};
  if (info !== undefined) rates.info = parseInt(info, 10);
  if (error !== undefined) rates.error = parseInt(error, 10);
  return Object.keys(rates).length ? rates : undefined;
}

/**
 * Load configuration from config.js and override with environment variables
 */
export async function loadConfig(): Promise<Config> {
  dotenv.config();

  const config: Config = {
    sourcePrefix: process.env.SOURCE_PREFIX || defaultConfig.sourcePrefix,
    sourceHostname: process.env.SOURCE_HOSTNAME || defaultConfig.sourceHostname,
    presets: defaultConfig.presets,
    port: process.env.PORT
      ? parseInt(process.env.PORT, 10)
      : defaultConfig.port,
    cors: {
      origin: process.env.CORS_ORIGIN || defaultConfig.cors.origin,
      credentials: process.env.CORS_CREDENTIALS
        ? process.env.CORS_CREDENTIALS === "true"
        : defaultConfig.cors.credentials,
    },
    fetchTimeout: process.env.FETCH_TIMEOUT
      ? parseInt(process.env.FETCH_TIMEOUT, 10)
      : defaultConfig.fetchTimeout,
    cacheControl: process.env.CACHE_CONTROL || defaultConfig.cacheControl,
    allowCustomTransforms: process.env.ALLOW_CUSTOM_TRANSFORMS
      ? process.env.ALLOW_CUSTOM_TRANSFORMS === "true"
      : defaultConfig.allowCustomTransforms,
    allowPresets: process.env.ALLOW_PRESETS
      ? process.env.ALLOW_PRESETS === "true"
      : defaultConfig.allowPresets,
    allowOriginalImage: process.env.ALLOW_ORIGINAL_IMAGE
      ? process.env.ALLOW_ORIGINAL_IMAGE === "true"
      : defaultConfig.allowOriginalImage,
    image: {
      maxWidth:
        process.env.IMAGE_MAX_WIDTH || process.env.MAX_WIDTH
          ? parseInt(
              process.env.IMAGE_MAX_WIDTH || process.env.MAX_WIDTH || "",
              10,
            )
          : defaultConfig.image.maxWidth,
      maxHeight:
        process.env.IMAGE_MAX_HEIGHT || process.env.MAX_HEIGHT
          ? parseInt(
              process.env.IMAGE_MAX_HEIGHT || process.env.MAX_HEIGHT || "",
              10,
            )
          : defaultConfig.image.maxHeight,
      defaultQuality:
        process.env.IMAGE_DEFAULT_QUALITY || process.env.DEFAULT_QUALITY
          ? parseInt(
              process.env.IMAGE_DEFAULT_QUALITY ||
                process.env.DEFAULT_QUALITY ||
                "",
              10,
            )
          : defaultConfig.image.defaultQuality,
    },
  };

  if (process.env.PRESETS) {
    try {
      config.presets = JSON.parse(process.env.PRESETS);
    } catch (error) {
      console.warn(
        "Warning: Could not parse PRESETS environment variable:",
        (error as Error).message,
      );
    }
  }

  // logging: OTLP endpoint, headers, and sampling
  const otlpEndpoint =
    process.env.LOG_OTLP_ENDPOINT ||
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT ||
    defaultConfig.logging?.otlpEndpoint;
  const otlpHeaders = parseOtlpHeaders() ?? defaultConfig.logging?.otlpHeaders;
  const samplingRates =
    parseSamplingRates() ?? defaultConfig.logging?.samplingRates;
  if (otlpEndpoint || otlpHeaders || samplingRates) {
    config.logging = {
      ...defaultConfig.logging,
      ...(otlpEndpoint && { otlpEndpoint }),
      ...(otlpHeaders && Object.keys(otlpHeaders).length > 0 && {
        otlpHeaders,
      }),
      ...(samplingRates && { samplingRates }),
    };
  }

  return config;
}
