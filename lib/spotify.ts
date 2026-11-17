import { getString, setString } from "./store";

/**
 * Spotify "now playing" for the site owner.
 * Setup: create an app at developer.spotify.com, set SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET,
 * then visit /api/spotify/login?key=ADMIN_TOKEN once. The refresh token is saved in Redis
 * (and kept current automatically), so there's nothing to copy by hand.
 */
const ID = process.env.SPOTIFY_CLIENT_ID;
const SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_KEY = "spotify:refresh";
export const SCOPES = "user-read-currently-playing user-read-recently-played";

export const spotifyConfigured = () => !!(ID && SECRET);
const basic = () => "Basic " + Buffer.from(`${ID}:${SECRET}`).toString("base64");

let cached: { token: string; exp: number } | null = null;

export async function exchangeCode(code: string, redirectUri: string) {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { Authorization: basic(), "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirectUri }),
  });
  const j = await res.json();
  if (!res.ok || !j.refresh_token) throw new Error(j.error_description || j.error || `spotify ${res.status}`);
  await setString(REFRESH_KEY, j.refresh_token);
  cached = { token: j.access_token, exp: Date.now() + (j.expires_in - 60) * 1000 };
  return j.refresh_token as string;
}

async function accessToken(): Promise<string | null> {
  if (cached && cached.exp > Date.now()) return cached.token;
  const refresh = (await getString(REFRESH_KEY)) ?? process.env.SPOTIFY_REFRESH_TOKEN;
  if (!refresh) return null;
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { Authorization: basic(), "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refresh }),
    cache: "no-store",
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("spotify refresh failed: reconnect at /api/spotify/login?key=…", j);
    return null;
  }
  if (j.refresh_token && j.refresh_token !== refresh) await setString(REFRESH_KEY, j.refresh_token); // Spotify may rotate it
  cached = { token: j.access_token, exp: Date.now() + (j.expires_in - 60) * 1000 };
  return cached.token;
}

export type Track = { playing: boolean; title: string; artist: string; url: string; playedAt?: string };

const pick = (t: any): Omit<Track, "playing"> => ({
  title: t?.name ?? "",
  artist: (t?.artists ?? []).map((a: any) => a.name).join(", "),
  url: t?.external_urls?.spotify ?? "",
});

export async function nowPlaying(): Promise<Track | null> {
  const token = await accessToken();
  if (!token) return null;
  const auth = { Authorization: `Bearer ${token}` };

  const cur = await fetch("https://api.spotify.com/v1/me/player/currently-playing", { headers: auth, cache: "no-store" });
  if (cur.status === 200) {
    const j = await cur.json();
    if (j?.item && j.currently_playing_type === "track") return { playing: !!j.is_playing, ...pick(j.item) };
  }
  // nothing playing (204), a podcast, or an ad: show the last track instead
  const rec = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", { headers: auth, cache: "no-store" });
  if (rec.ok) {
    const j = await rec.json();
    const last = j?.items?.[0];
    if (last?.track) return { playing: false, ...pick(last.track), playedAt: last.played_at };
  }
  return null;
}
