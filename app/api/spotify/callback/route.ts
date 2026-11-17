import { exchangeCode } from "@/lib/spotify";
import { storageMode } from "@/lib/store";

export const dynamic = "force-dynamic";

const page = (title: string, body: string, status = 200) =>
  new Response(
    `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<body style="background:#001428;color:#E9E4D4;font:16px/1.6 ui-monospace,monospace;padding:40px;max-width:640px;margin:auto">
<h1 style="color:#FDB515;font-weight:400">${title}</h1>${body}<p><a style="color:#FDB515" href="/#desktop">← back to DANIEL_OS</a></p></body>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8", "Set-Cookie": "sp_state=; Path=/api/spotify; Max-Age=0" } },
  );

export async function GET(req: Request) {
  const url = new URL(req.url);
  const state = url.searchParams.get("state");
  const cookieState = req.headers.get("cookie")?.match(/(?:^|;\s*)sp_state=([^;]+)/)?.[1];
  if (!state || state !== cookieState) return page("Spotify: link expired", "<p>Start again from <code>/api/spotify/login?key=…</code></p>", 400);
  if (url.searchParams.get("error")) return page("Spotify: not connected", `<p>Spotify said: ${url.searchParams.get("error")}</p>`, 400);

  try {
    const refresh = await exchangeCode(url.searchParams.get("code") ?? "", `${url.origin}/api/spotify/callback`);
    if (storageMode === "redis") return page("Spotify connected ✓", "<p>Saved. The ♪ widget in the taskbar will pick it up within a minute.</p>");
    // no Redis (local dev): show the token once so it can go into .env.local
    return page("Spotify connected ✓", `<p>No Redis configured, so add this to <code>.env.local</code> as <code>SPOTIFY_REFRESH_TOKEN</code>:</p><pre style="white-space:pre-wrap;word-break:break-all;background:#000;padding:12px">${refresh}</pre>`);
  } catch (e) {
    return page("Spotify: something went wrong", `<p>${(e as Error).message}</p><p>Check that the redirect URI in your Spotify app is exactly <code>${url.origin}/api/spotify/callback</code>.</p>`, 500);
  }
}
