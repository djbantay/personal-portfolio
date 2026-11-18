import type { Metadata } from "next";
import Script from "next/script";
import { PROFILE } from "@/lib/profile";
import RecruiterFx from "./fx";
import "./recruiter.css";

// Recruiter mode: everything a recruiter needs above the fold, still playful.
// All content comes from lib/profile.ts so it never drifts from the desktop.

export const metadata: Metadata = {
  title: `${PROFILE.name} — recruiter mode`,
  description: `${PROFILE.name}, ${PROFILE.title}. Selected work, experience, and skills in one fast, interactive page.`,
  openGraph: { title: `${PROFILE.name} — recruiter mode`, description: `${PROFILE.title}. ${PROFILE.recruiter.openTo}.`, type: "profile" },
};

const host = (u: string) => u.replace(/^https?:\/\//, "").replace(/\/$/, "");

export default function RecruiterPage() {
  const P = PROFILE, L = P.links;
  const allTech = (t: string[]) => t.join("|");
  return (
    <div className="rx">
      <style>{`html,body{height:auto;overflow:auto;background:#001428}`}</style>

      <header className="rx-bar">
        <a href="/#desktop" className="rx-brand" aria-label="Back to DANIEL_OS">DANIEL_OS<span>//</span></a>
        <nav aria-label="Sections">
          <a href="#work"><i>01</i>work</a><a href="#experience"><i>02</i>experience</a>
          <a href="#skills"><i>03</i>skills</a><a href="#off-clock"><i>04</i>off the clock</a>
        </nav>
        <a href="/#desktop" className="rx-toggle" role="switch" aria-checked="true" title="Turn recruiter mode off and boot the full desktop">
          <span className="rx-knob" aria-hidden="true" /> recruiter mode
        </a>
      </header>

      <main className="rx-page">
        {/* ---------- hero ---------- */}
        <section className="rx-hero" id="top">
          <div className="rx-hero-l">
            <p className="rx-prompt"><span>guest@db-1</span>:~$ <b data-type="whoami --short">whoami --short</b><i className="rx-caret" /></p>
            <h1 data-scramble>{P.name}.</h1>
            <p className="rx-tag">I turn messy data and fuzzy problems into things people can actually use.</p>
            <p className="rx-open"><b>Open to:</b> {P.recruiter.openTo}</p>
            <ul className="rx-aff">
              {P.affiliations.map((a) => (
                <li key={a.at}>
                  {a.prev && <span className="rx-prev">prev</span>}
                  {a.href ? <a href={a.href} target="_blank" rel="noopener">@{a.at.toUpperCase()}</a> : <b>@{a.at.toUpperCase()}</b>}
                  <span className="rx-role">{a.role}</span>
                </li>
              ))}
            </ul>
            <div className="rx-links">
              <a href={L.resume} target="_blank" rel="noopener" className="rx-btn rx-primary">résumé ↗</a>
              <a href={L.linkedin} target="_blank" rel="noopener" className="rx-btn">linkedin ↗</a>
              <a href={L.github} target="_blank" rel="noopener" className="rx-btn">github ↗</a>
              <a href={`mailto:${L.email}`} className="rx-btn">email ↗</a>
              <button type="button" className="rx-btn rx-copy" data-copy={L.email}>copy email</button>
            </div>
          </div>

          <figure className="rx-desk" data-tilt>
            <canvas className="scene" data-scene="desk" width={112} height={72} role="img"
              aria-label="Pixel art of Daniel typing at his desk at night, a Mind Coffee mug steaming and the Campanile in the window" />
            <figcaption>
              <span className="rx-live"><i />online</span>
              <span data-clock>--:--</span><span>in {P.location}</span>
              <span className="rx-hint">hover to say hi</span>
            </figcaption>
          </figure>
        </section>

        {/* ---------- numbers ---------- */}
        <section className="rx-stats" aria-label="Highlights">
          {P.stats.map((s) => (
            <div key={s.label} className="rx-stat" data-reveal>
              <p className="rx-num"><span data-count={s.n}>{s.n}</span>{s.suffix}</p>
              <p className="rx-lbl">{s.label}</p>
            </div>
          ))}
        </section>

        {/* ---------- work ---------- */}
        <section id="work" className="rx-sec">
          <h2><i>01</i> selected work <span>hover a skill below to see where it was used</span></h2>
          <div className="rx-cards">
            {P.projects.map((p, i) => (
              <article key={p.slug} className="rx-card" data-reveal data-tilt data-tech={allTech(p.tech)}>
                <div className="rx-card-top"><span>FILE_0{i + 1}</span>{p.award && <span className="rx-award">{p.award}</span>}</div>
                <h3 data-scramble>{p.name}</h3>
                <p>{p.blurb}</p>
                <details>
                  <summary>show how it works</summary>
                  <ul>{p.details.map((d) => <li key={d}>{d}</li>)}</ul>
                </details>
                <p className="rx-chips">{p.tech.map((t) => <span key={t}>{t}</span>)}</p>
                <a className="rx-more" href={`/projects/${p.slug}`}>read the case study →</a>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- experience ---------- */}
        <section id="experience" className="rx-sec">
          <h2><i>02</i> experience</h2>
          <ol className="rx-time">
            {P.experience.map((j) => (
              <li key={j.org} data-reveal>
                <div className="rx-when">{j.when}<span>{j.where}</span></div>
                <div className="rx-job">
                  <h3>{j.role} <span>@{j.org}</span></h3>
                  <ul>{j.bullets.slice(0, 2).map((b) => <li key={b}>{b}</li>)}</ul>
                  {j.bullets.length > 2 && (
                    <details><summary>+{j.bullets.length - 2} more</summary><ul>{j.bullets.slice(2).map((b) => <li key={b}>{b}</li>)}</ul></details>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------- skills ---------- */}
        <section id="skills" className="rx-sec">
          <h2><i>03</i> loaded modules</h2>
          <div className="rx-skills">
            {Object.entries(P.skills).map(([g, items]) => (
              <div key={g} data-reveal>
                <h3>{g}</h3>
                <p className="rx-chips">{items.map((s) => <button type="button" key={s} data-skill={s}>{s}</button>)}</p>
              </div>
            ))}
          </div>
          <p className="rx-usedin" aria-live="polite" data-usedin>hover or tab through a module to see which projects used it.</p>
          <p className="rx-edu"><b>Education</b> · <a href={P.affiliations[0]?.href || "#"} target="_blank" rel="noopener">{P.education.school}</a> · {P.education.degree}</p>
        </section>

        {/* ---------- off the clock ---------- */}
        <section id="off-clock" className="rx-sec">
          <h2><i>04</i> off the clock</h2>
          <div className="rx-scenes">
            {P.personal.hobbies.filter((h) => h.scene).map((h) => (
              <figure key={h.name} className="rx-scene">
                <canvas className="scene" data-scene={h.scene} width={64} height={40} aria-hidden="true" />
                <figcaption><b>{h.name}</b>{h.detail && <span>{h.detail}</span>}</figcaption>
              </figure>
            ))}
          </div>
          <p className="rx-zh">你好！ {P.personal.learningWhy}</p>
        </section>

        <footer className="rx-foot">
          <p>end of transmission. <span>thanks for stopping by.</span></p>
          <a href="/#desktop" className="rx-btn rx-primary">boot the full DANIEL_OS →</a>
          <a href="#top" className="rx-btn">↑ back to top</a>
        </footer>
      </main>

      <Script src="/scenes.js" strategy="afterInteractive" />
      <Script src="/cursor.js" strategy="afterInteractive" />
      <RecruiterFx />
    </div>
  );
}
