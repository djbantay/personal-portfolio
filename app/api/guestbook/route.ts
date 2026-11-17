import { zadd, zlatest, zremWhere } from "@/lib/store";
import { rateLimit, clientId, tooMany } from "@/lib/ratelimit";
import { clean, looksLikeLink } from "@/lib/text";
import { isAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";
const KEY = "guestbook";

type Entry = { id: string; name: string; message: string; at: string };

export async function GET() {
  const raw = await zlatest(KEY, 25);
  const entries: Entry[] = raw.flatMap((m) => { try { return [JSON.parse(m)]; } catch { return []; } });
  return Response.json({ entries });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (body.website) return Response.json({ ok: true }); // honeypot: bots fill hidden fields
  const name = clean(body.name, 24);
  const message = clean(body.message, 140);
  if (!name || !message) return Response.json({ error: "name and message are required" }, { status: 400 });
  if (looksLikeLink(message) || looksLikeLink(name)) return Response.json({ error: "links aren't allowed in the guestbook" }, { status: 400 });

  const rl = await rateLimit("guestbook", clientId(req), 3, 600);
  if (!rl.ok) return tooMany(rl.retryAfter, "signatures");

  const entry: Entry = { id: crypto.randomUUID().slice(0, 8), name, message, at: new Date().toISOString() };
  await zadd(KEY, Date.now(), JSON.stringify(entry));
  return Response.json({ ok: true, entry });
}

/** Moderation: DELETE /api/guestbook?id=abcd1234 with header `Authorization: Bearer $ADMIN_TOKEN`. */
export async function DELETE(req: Request) {
  if (!isAdmin(req.headers.get("authorization")?.replace(/^Bearer\s+/i, ""))) return Response.json({ error: "unauthorized" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  const removed = await zremWhere(KEY, (m) => { try { return JSON.parse(m).id === id; } catch { return false; } });
  return Response.json({ removed });
}
