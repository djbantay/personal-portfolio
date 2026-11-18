import type { Metadata } from "next";
import { PROFILE } from "@/lib/profile";
import "./recruiter.css";

// Recruiter mode: the whole portfolio on one fast, plain, printable page.
// Everything comes from lib/profile.ts, so it never drifts from the desktop version.

export const metadata: Metadata = {
  title: `${PROFILE.name} — Résumé at a glance`,
  description: `${PROFILE.name}, ${PROFILE.title}. Experience, projects, and skills on one page.`,
  openGraph: {
    title: `${PROFILE.name} — Résumé at a glance`,
    description: `${PROFILE.title}. ${PROFILE.recruiter.openTo}.`,
    type: "profile",
  },
};

const host = (u: string) => u.replace(/^https?:\/\//, "").replace(/\/$/, "");

export default function RecruiterPage() {
  const P = PROFILE;
  const L = P.links;
  return (
    <div className="rc">
      {/* this page scrolls and prints like a normal document */}
      <style>{`html,body{height:auto;overflow:auto;background:#f7f4ec}`}</style>

      <nav className="rc-top" aria-label="Page">
        <a href="/#desktop" className="rc-boot">◂ Boot the full DANIEL_OS experience</a>
        <span className="rc-actions">
          <a href={L.resume} target="_blank" rel="noopener">Résumé PDF</a>
          <a href={`mailto:${L.email}`} className="rc-cta">Email me</a>
        </span>
      </nav>

      <main className="rc-page">
        <header className="rc-head">
          <div className="rc-id">
            {P.avatar && <img src={P.avatar} alt="" width={64} height={64} className="rc-avatar" />}
            <div>
              <h1>{P.name}</h1>
              <p className="rc-title">{P.title} · {P.location}</p>
              <p className="rc-open"><b>Open to:</b> {P.recruiter.openTo}</p>
            </div>
          </div>
          <ul className="rc-links">
            <li><span>Email</span><a href={`mailto:${L.email}`}>{L.email}</a></li>
            <li><span>LinkedIn</span><a href={L.linkedin} target="_blank" rel="noopener">{host(L.linkedin)}</a></li>
            <li><span>GitHub</span><a href={L.github} target="_blank" rel="noopener">{host(L.github)}</a></li>
          </ul>
        </header>

        <section className="rc-tldr" aria-labelledby="tldr">
          <h2 id="tldr">In 30 seconds</h2>
          <ul>{P.recruiter.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
        </section>

        <div className="rc-cols">
          <div className="rc-main">
            <section aria-labelledby="exp">
              <h2 id="exp">Experience</h2>
              {P.experience.map((j) => (
                <article key={j.org} className="rc-item">
                  <div className="rc-row">
                    <h3>{j.role} · <span>{j.org}</span></h3>
                    <span className="rc-when">{j.when}</span>
                  </div>
                  <p className="rc-where">{j.where}</p>
                  <ul>{j.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
                </article>
              ))}
            </section>

            <section aria-labelledby="proj">
              <h2 id="proj">Projects</h2>
              {P.projects.map((p) => (
                <article key={p.slug} className="rc-item">
                  <div className="rc-row">
                    <h3><a href={`/projects/${p.slug}`}>{p.name}</a></h3>
                    {p.award && <span className="rc-award">{p.award}</span>}
                  </div>
                  <p className="rc-blurb">{p.blurb}</p>
                  <ul>{p.details.map((d) => <li key={d}>{d}</li>)}</ul>
                  <p className="rc-tech">{p.tech.map((t) => <span key={t}>{t}</span>)}</p>
                  <p className="rc-more">
                    <a href={`/projects/${p.slug}`}>Full write-up →</a>
                    {p.repo && <a href={p.repo} target="_blank" rel="noopener">Code ↗</a>}
                    {p.demo && <a href={p.demo} target="_blank" rel="noopener">Demo ↗</a>}
                  </p>
                </article>
              ))}
            </section>
          </div>

          <aside className="rc-side">
            <section aria-labelledby="skills">
              <h2 id="skills">Skills</h2>
              {Object.entries(P.skills).map(([group, items]) => (
                <div key={group} className="rc-skill">
                  <h3>{group}</h3>
                  <p className="rc-tech">{items.map((s) => <span key={s}>{s}</span>)}</p>
                </div>
              ))}
            </section>
            <section aria-labelledby="edu">
              <h2 id="edu">Education</h2>
              <p><b>{P.education.school}</b></p>
              <p>{P.education.degree}{P.education.when ? ` · ${P.education.when}` : ""}</p>
              {P.education.courses.length > 0 && <p className="rc-where">{P.education.courses.join(" · ")}</p>}
            </section>
            <section aria-labelledby="else" className="rc-human">
              <h2 id="else">Outside work</h2>
              <p>{P.personal.hobbies.map((h) => h.name).join(" · ")}</p>
              <p className="rc-where">Learning {P.personal.learning}. Favorite F1 team: {P.personal.f1Team}.</p>
            </section>
          </aside>
        </div>

        <footer className="rc-foot">
          <p>Have 5 more minutes? <a href="/#desktop">Boot DANIEL_OS</a>: a retro desktop with a real terminal, live git log, and a guestbook you sign over ssh.</p>
        </footer>
      </main>
    </div>
  );
}
