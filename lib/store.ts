import { Redis } from "@upstash/redis";

/**
 * Tiny storage layer.
 * - Production: Upstash Redis (add it from the Vercel Marketplace; either env-var naming works).
 * - Local dev without env vars: an in-memory fallback so everything still works.
 */
const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

export const redis = url && token ? new Redis({ url, token, automaticDeserialization: false }) : null;
export const storageMode = redis ? "redis" : "memory";

type Mem = { kv: Map<string, number>; z: Map<string, { score: number; member: string }[]>; exp: Map<string, number> };
const g = globalThis as unknown as { __dbMem?: Mem };
const mem: Mem = (g.__dbMem ??= { kv: new Map(), z: new Map(), exp: new Map() });

function memAlive(key: string) {
  const e = mem.exp.get(key);
  if (e && e < Date.now()) { mem.kv.delete(key); mem.exp.delete(key); }
}

export async function incr(key: string, ttlSeconds?: number): Promise<number> {
  if (redis) {
    const v = await redis.incr(key);
    if (ttlSeconds && v === 1) await redis.expire(key, ttlSeconds);
    return v;
  }
  memAlive(key);
  const v = (mem.kv.get(key) ?? 0) + 1;
  mem.kv.set(key, v);
  if (ttlSeconds && v === 1) mem.exp.set(key, Date.now() + ttlSeconds * 1000);
  return v;
}

export async function getNumber(key: string): Promise<number> {
  if (redis) return Number((await redis.get<string>(key)) ?? 0);
  memAlive(key);
  return mem.kv.get(key) ?? 0;
}

/** Sorted-set helpers (score = timestamp) used by the guestbook. Members are JSON strings. */
export async function zadd(key: string, score: number, member: string, keep = 500) {
  if (redis) {
    await redis.zadd(key, { score, member });
    await redis.zremrangebyrank(key, 0, -(keep + 1));
    return;
  }
  const list = mem.z.get(key) ?? [];
  list.push({ score, member });
  list.sort((a, b) => a.score - b.score);
  mem.z.set(key, list.slice(-keep));
}

export async function zlatest(key: string, n: number): Promise<string[]> {
  if (redis) return (await redis.zrange<string[]>(key, 0, n - 1, { rev: true })) ?? [];
  return (mem.z.get(key) ?? []).slice(-n).reverse().map((x) => x.member);
}

export async function zremWhere(key: string, pred: (member: string) => boolean): Promise<number> {
  if (redis) {
    const all = (await redis.zrange<string[]>(key, 0, -1)) ?? [];
    const hits = all.filter(pred);
    if (hits.length) await redis.zrem(key, ...hits);
    return hits.length;
  }
  const list = mem.z.get(key) ?? [];
  const keep = list.filter((x) => !pred(x.member));
  mem.z.set(key, keep);
  return list.length - keep.length;
}

/** Plain string get/set (used to keep Spotify's refresh token current). */
const memStr = new Map<string, string>();
export async function getString(key: string): Promise<string | null> {
  if (redis) return (await redis.get<string>(key)) ?? null;
  return memStr.get(key) ?? null;
}
export async function setString(key: string, value: string): Promise<void> {
  if (redis) { await redis.set(key, value); return; }
  memStr.set(key, value);
}
