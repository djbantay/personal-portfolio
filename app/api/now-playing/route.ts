import { nowPlaying, spotifyConfigured } from "@/lib/spotify";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!spotifyConfigured()) return Response.json({ configured: false });
  try {
    const track = await nowPlaying();
    return Response.json(
      { configured: true, track },
      { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" } }, // shared 30s cache: one Spotify call per 30s at most
    );
  } catch (e) {
    console.error("now-playing failed", e);
    return Response.json({ configured: true, track: null });
  }
}
