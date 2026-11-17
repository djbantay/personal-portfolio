import { isAdmin } from "@/lib/admin";
import { SCOPES, spotifyConfigured } from "@/lib/spotify";

export const dynamic = "force-dynamic";

/** Owner-only: /api/spotify/login?key=ADMIN_TOKEN → Spotify consent → /api/spotify/callback */
export async function GET(req: Request) {
  const url = new URL(req.url);
  if (!isAdmin(url.searchParams.get("key"))) return new Response("not found", { status: 404 });
  if (!spotifyConfigured()) return new Response("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first, then redeploy.", { status: 400 });

  const state = crypto.randomUUID();
  const auth = new URL("https://accounts.spotify.com/authorize");
  auth.search = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    scope: SCOPES,
    redirect_uri: `${url.origin}/api/spotify/callback`,
    state,
  }).toString();
  return new Response(null, {
    status: 302,
    headers: {
      Location: auth.toString(),
      "Set-Cookie": `sp_state=${state}; Path=/api/spotify; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    },
  });
}
