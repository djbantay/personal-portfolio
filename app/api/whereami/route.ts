export const dynamic = "force-dynamic";

/**
 * The visitor's approximate location from Vercel's built-in geo headers.
 * Used only for the `ssh` "Last login from …" line. Nothing is stored or logged.
 * Locally (no Vercel headers) this returns {} and the terminal falls back gracefully.
 */
export async function GET(req: Request) {
  const h = req.headers;
  const dec = (v: string | null) => { if (!v) return undefined; try { return decodeURIComponent(v); } catch { return v; } };
  const city = dec(h.get("x-vercel-ip-city"));
  const region = dec(h.get("x-vercel-ip-country-region"));
  const country = dec(h.get("x-vercel-ip-country"));
  return Response.json(city || country ? { city, region, country } : {}, { headers: { "Cache-Control": "private, no-store" } });
}
