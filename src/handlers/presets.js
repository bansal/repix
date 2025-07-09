/**
 * Presets handler - returns available presets
 */
export function createPresetHandler(config) {
  return async (c) => {
    const presets = config.presets || {};
    const allowCustomTransforms = config.image?.allowCustomTransforms !== false;

    return c.json({
      presets: presets,
      count: Object.keys(presets).length,
      allowCustomTransforms: allowCustomTransforms,
      message: allowCustomTransforms
        ? "Custom transformations are allowed"
        : "Only predefined presets are allowed",
    });
  };
}
