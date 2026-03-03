import type { RequestLogger } from "evlog";

export type AppBindings = {
  Variables: {
    log: RequestLogger;
  };
};

export interface CorsConfig {
  origin: string;
  credentials: boolean;
}

export interface ImageConfig {
  maxWidth: number;
  maxHeight: number;
  defaultQuality: number;
}

/** Sampling rates per log level (0-100%). See https://www.evlog.dev/getting-started/installation#sampling */
export interface LoggingSamplingRates {
  info?: number;
  error?: number;
}

export interface LoggingConfig {
  /** OTLP endpoint for log draining (e.g. http://localhost:4318). See https://www.evlog.dev/adapters/otlp */
  otlpEndpoint?: string;
  /** OTLP request headers (e.g. Authorization for PostHog). See https://www.evlog.dev/adapters/otlp */
  otlpHeaders?: Record<string, string>;
  /** Head sampling rates per level (0-100). Errors default to 100 if unspecified. */
  samplingRates?: LoggingSamplingRates;
}

export interface Config {
  sourcePrefix: string;
  sourceHostname: string;
  port: number;
  cors: CorsConfig;
  presets: Record<string, string>;
  fetchTimeout: number;
  cacheControl: string;
  allowCustomTransforms?: boolean;
  allowPresets?: boolean;
  allowOriginalImage?: boolean;
  image: ImageConfig;
  logging?: LoggingConfig;
}

export interface TransformParams {
  width?: number;
  height?: number;
  quality?: number;
  format?: string;
  fit?: string;
  position?: string;
  gravity?: string;
  background?: string;
  rotate?: number;
  flip?: string;
  blur?: number;
  sharpen?: number;
  brightness?: number;
  saturation?: number;
  anim?: boolean;
}

export interface TransformResult {
  buffer: Buffer;
  format: string;
  info: {
    width: number;
    height: number;
    channels: number;
    size: number;
  };
}

export type Colors = Record<
  string,
  string | { r: number; g: number; b: number; alpha: number }
>;
