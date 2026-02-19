/**
 * Cloudflare Containers Worker - Proxies requests to Repix container (Sharp/image processing)
 * Deploy: npx wrangler deploy
 * Requires: Cloudflare Containers (beta, June 2025+)
 */
import { Container, getRandom } from "@cloudflare/containers";

export class RepixContainer extends Container {
  defaultPort = 3210;
  sleepAfter = "5m";
  pingEndpoint = "/health";
}

export default {
  async fetch(request: Request, env: { REPIX: DurableObjectNamespace }) {
    const container = await getRandom(env.REPIX, 3);
    return container.fetch(request);
  },
};
