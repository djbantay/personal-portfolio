import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROFILE } from "@/lib/profile";
import { Links } from "@/components/mdx";
import "../projects.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return PROFILE.projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = PROFILE.projects.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: `${p.name} — ${PROFILE.name}`,
    description: p.blurb,
    openGraph: { title: `${p.name} — ${PROFILE.name}`, description: p.blurb, type: "article" },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = PROFILE.projects.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = PROFILE.projects[i];
  const { default: Writeup } = await import(`@/content/projects/${slug}.mdx`);
  const prev = PROFILE.projects[(i - 1 + PROFILE.projects.length) % PROFILE.projects.length];
  const next = PROFILE.projects[(i + 1) % PROFILE.projects.length];

  return (
    <div className="doc-page">
      <nav className="doc-nav">
        <a href="/#desktop">← back to DANIEL_OS</a>
        <span>C:\projects\{p.slug}.md</span>
      </nav>
      <article className="doc-win">
        <div className="doc-bar"><span>{p.slug}.md</span><i>_ □ ×</i></div>
        <div className="doc-body">
          <div className="doc-kicker">project {String(i + 1).padStart(2, "0")} · 0x{(0x1000 + i * 0x100).toString(16).toUpperCase()}</div>
          <h1>{p.name}</h1>
          {p.award && <div className="doc-award">* {p.award}</div>}
          <p className="doc-lede">{p.blurb}</p>
          <p>{p.tech.map((t) => <span className="tag" key={t}>{t}</span>)}</p>
          <Writeup />
          <Links repo={p.repo} demo={p.demo} />
        </div>
      </article>
      <nav className="doc-pager">
        <a href={`/projects/${prev.slug}`}>← {prev.name}</a>
        <a href={`/projects/${next.slug}`}>{next.name} →</a>
      </nav>
    </div>
  );
}
