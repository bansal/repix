import type { Handler } from "hono";
import type { AppBindings } from "../types";

export function rootHandler(): Handler<AppBindings> {
  return async (c) => {
    c.get("log").set({ route: "root" });
    return c.json({
      service: "Repix",
      version: "1.0.0",
      documentation: "https://github.com/bansal/repix",
    });
  };
}
