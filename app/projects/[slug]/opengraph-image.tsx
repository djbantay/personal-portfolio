import { retroCard, OG_SIZE } from "@/lib/og";
import { PROFILE } from "@/lib/profile";

export const alt = "Project write-up";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return PROFILE.projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = PROFILE.projects.find((x) => x.slug === slug) ?? PROFILE.projects[0];
  return retroCard({
    kicker: `projects/${p.slug}.md`,
    title: p.name,
    subtitle: p.award ? `>> ${p.award}` : PROFILE.name,
    tags: p.tech,
    footer: `$ cat ${p.slug}.md`,
  });
}
