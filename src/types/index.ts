export interface CorsConfig {
  origin: string;
  credentials: boolean;
}

export interface ImageConfig {
  maxWidth: number;
  maxHeight: number;
  defaultQuality: number;
  fetchTimeout: number;
  cacheControl: string;
  allowCustomTransforms?: boolean;
}

export interface Config {
  prefix: string;
  port: number;
  cors: CorsConfig;
  image: ImageConfig;
  presets: Record<string, string>;
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
