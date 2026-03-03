import { Hono } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { createRequestLogger, initLogger } from "evlog";
import type { AppBindings } from "@/types";
import { resolveError } from "@/errors";

let initialized = false;

/** Add evlog middleware and error handler to a Hono app for testing */
export function withEvlog(app: Hono) {
  if (!initialized) {
    initLogger({ env: { service: "repix-test" }, pretty: false });
    initialized = true;
  }

  const appWithBindings = app as unknown as Hono<AppBindings>;
  appWithBindings.use("*", async (c, next) => {
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
      log.emit({ status: c.res.status, duration: Date.now() - startedAt });
    }
  });
  appWithBindings.onError((err, c) => {
    c.get("log").error(err);
    const { response, status } = resolveError(err);
    return c.json(response, status as ContentfulStatusCode);
  });
  return appWithBindings;
}
