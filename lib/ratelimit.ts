import { Ratelimit } from "@upstash/ratelimit";
import { redis, incr } from "./store";

const limiters = new Map<string, Ratelimit>();

/** Sliding-window rate limit per client. Falls back to a fixed in-memory window locally. */
export async function rateLimit(name: string, id: string, max: number, windowSeconds: number) {
  if (redis) {
    let rl = limiters.get(name);
    if (!rl) {
      rl = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(max, `${windowSeconds} s`), prefix: `rl:${name}` });
      limiters.set(name, rl);
    }
    const r = await rl.limit(id);
    return { ok: r.success, retryAfter: Math.max(0, Math.ceil((r.reset - Date.now()) / 1000)) };
  }
  const bucket = Math.floor(Date.now() / (windowSeconds * 1000));
  const n = await incr(`rl:${name}:${id}:${bucket}`, windowSeconds);
  return { ok: n <= max, retryAfter: windowSeconds };
}

export function clientId(req: Request) {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
}

export function tooMany(retryAfter: number, what = "requests") {
  return Response.json(
    { error: `rate limited: too many ${what}. try again in ~${Math.max(1, Math.ceil(retryAfter / 60))} min.` },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}
