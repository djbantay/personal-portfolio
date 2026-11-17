import { retroCard, OG_SIZE } from "@/lib/og";
import { PROFILE } from "@/lib/profile";

export const alt = `${PROFILE.name}: CS @ UC Berkeley portfolio`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return retroCard({
    kicker: "portfolio",
    title: PROFILE.name.toUpperCase(),
    subtitle: "Computer Science @ UC Berkeley",
    tags: ["ML", "data engineering", "full-stack"],
    footer: "$ ssh daniel@berkeley.edu",
  });
}
