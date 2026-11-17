import { PROFILE } from "@/lib/profile";

export const revalidate = 600; // cache GitHub responses for 10 minutes

type Commit = { sha: string; message: string; repo: string; date: string; url: string };

const headers: HeadersInit = {
  Accept: "application/vnd.github+json",
  "User-Agent": "daniel-os-portfolio",
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

/** Latest public commits authored by the GitHub user in PROFILE.handle. */
export async function GET() {
  const user = process.env.GITHUB_USERNAME ?? PROFILE.handle;
  try {
    const res = await fetch(
      `https://api.github.com/search/commits?q=author:${encodeURIComponent(user)}&sort=author-date&order=desc&per_page=15`,
      { headers, next: { revalidate: 600 } },
    );
    if (!res.ok) throw new Error(`github ${res.status}`);
    const data = await res.json();
    const commits: Commit[] = (data.items ?? []).map((it: any) => ({
      sha: String(it.sha).slice(0, 7),
      message: String(it.commit?.message ?? "").split("\n")[0].slice(0, 90),
      repo: it.repository?.full_name ?? "",
      date: it.commit?.author?.date ?? "",
      url: it.html_url ?? "",
    }));
    return Response.json({ user, commits });
  } catch (e) {
    return Response.json({ user, commits: [], error: "github unavailable" }, { status: 502 });
  }
}
