import type { Handler } from "hono";
import type { Config } from "../types/index.js";

/**
 * Presets handler - returns available presets
 */
export function createPresetHandler(config: Config): Handler {
  return async (c) => {
    const presets = config.presets || {};
    const allowCustomTransforms = config.image?.allowCustomTransforms !== false;

    return c.json({
      service: "Repix",
      presets: presets,
      count: Object.keys(presets).length,
      allowCustomTransforms: allowCustomTransforms,
    });
  };
}
