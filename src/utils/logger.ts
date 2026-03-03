import { createRequestLogger, initLogger } from "evlog";
import { createOTLPDrain } from "evlog/otlp";
import type { Context, Next } from "hono";
import type { Config } from "../types";

/** Initialize evlog with OTLP drain and sampling from config. */
export function initLogging(config: Config): void {
  const drain =
    config.logging?.otlpEndpoint &&
    createOTLPDrain({
      endpoint: config.logging.otlpEndpoint,
      serviceName: "repix",
      timeout: 15_000,
      ...(config.logging?.otlpHeaders &&
        Object.keys(config.logging.otlpHeaders).length > 0 && {
          headers: config.logging.otlpHeaders,
        }),
    });

  initLogger({
    env: { service: "repix" },
    pretty: process.env.NODE_ENV !== "production",
    ...(drain && { drain }),
    ...(config.logging?.samplingRates && {
      sampling: { rates: config.logging.samplingRates },
    }),
  });
}

/** Hono middleware for request logging. */
export async function logger(c: Context, next: Next) {
  const startedAt = Date.now();
  const log = createRequestLogger({
    method: c.req.method,
    path: c.req.path,
    requestId: c.req.header("x-request-id"),
  });
  c.set("log", log);
  try {
    await next();
  } catch (error) {
    log.error(error as Error);
    throw error;
  } finally {
    const skipLog = ["/", "/health", "/favicon.ico"].includes(c.req.path);
    if (!skipLog) {
      log.emit({
        status: c.res.status,
        duration: Date.now() - startedAt,
      });
    }
  }
}
