import fs from "node:fs";
import path from "node:path";
import { PROFILE } from "./profile";

// Project media: drop a file into public/projects/<slug>/ and it shows up everywhere
// (recruiter mode cards + rows, the desktop's project windows). First match wins.
//   thumb.mp4 / thumb.webm  -> short looping clip, plays on hover
//   thumb.gif / .webp / .png / .jpg -> still (or animated gif)
// Checked at build time, so redeploy after adding files.
export type Media = { type: "video" | "image"; src: string; poster?: string };

const VIDEO = ["mp4", "webm"];
const IMAGE = ["gif", "webp", "png", "jpg", "jpeg"];

export function projectMedia(slug: string): Media | undefined {
  const dir = path.join(process.cwd(), "public", "projects", slug);
  const has = (f: string) => fs.existsSync(path.join(dir, f));
  const poster = IMAGE.map((e) => `poster.${e}`).find(has);
  for (const e of VIDEO) if (has(`thumb.${e}`))
    return { type: "video", src: `/projects/${slug}/thumb.${e}`, poster: poster ? `/projects/${slug}/${poster}` : undefined };
  for (const e of IMAGE) if (has(`thumb.${e}`)) return { type: "image", src: `/projects/${slug}/thumb.${e}` };
  return undefined;
}

/** PROFILE with each project's media attached, for client-side code. */
export function profileWithMedia() {
  return { ...PROFILE, projects: PROFILE.projects.map((p) => ({ ...p, media: projectMedia(p.slug) })) };
}
