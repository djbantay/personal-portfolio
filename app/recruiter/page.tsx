import type { Metadata } from "next";
import Script from "next/script";
import { PROFILE } from "@/lib/profile";
import { projectMedia, type Media } from "@/lib/media";
import RecruiterFx from "./fx";
import "./recruiter.css";

// One page, two views (like elaineyu.design):
//   explore   - the playful dark-pixel layout: desk bear, cards, hobby scenes
//   recruiter - same nav, bear and colors, content as tidy rows
// The toggle flips data-mode on .rx and keeps ?recruiter=true in the URL, so the
// recruiter view is a link you can paste into applications.

export const metadata: Metadata = {
  title: `${PROFILE.name} — portfolio`,
  description: `${PROFILE.name}, ${PROFILE.title}. Selected work, experience, and skills.`,
  openGraph: { title: `${PROFILE.name} — portfolio`, description: `${PROFILE.title}. ${PROFILE.recruiter.openTo}.`, type: "profile" },
};

const SIGN_OFF = "你好，我在学中文。";

function Thumb({ slug, name, media, small }: { slug: string; name: string; media?: Media; small?: boolean }) {
  const cls = `rx-thumb${small ? " rx-thumb-sm" : ""}`;
  if (media?.type === "video")
    return <div className={cls}><video src={media.src} poster={media.poster} muted loop playsInline preload="metadata" data-hoverplay aria-label={`${name} demo`} /></div>;
  if (media?.type === "image")
    // eslint-disable-next-line @next/next/no-img-element
    return <div className={cls}><img src={media.src} alt={`${name} screenshot`} loading="lazy" /></div>;
  if (slug === "daniel-os")
    return <div className={cls}><canvas className="scene" data-scene="bear" width={112} height={72} aria-label="The DANIEL_OS bear coding at its desk" /></div>;
  return (
    <div className={`${cls} rx-nosignal`} aria-label={`${name}: demo coming soon`}>
      <i /><i /><i /><i /><i /><i /><i />
      {!small && <span>NO SIGNAL<small>demo uploading…</small></span>}
    </div>
  );
}

export default function RecruiterPage() {
  const P = PROFILE, L = P.links;
  const projects = P.projects.map((p) => ({ ...p, media: projectMedia(p.slug) }));
  const tech = (t: string[]) => t.join("|");
  const guide = <canvas className="rx-guide" width={22} height={16} aria-hidden="true" />;

  return (
    <div className="rx" data-mode="explore">
      {/* pick the view before first paint so recruiter links never flash the explore layout */}
      <script dangerouslySetInnerHTML={{ __html: `try{if(/[?&]recruiter=(1|true)/.test(location.search))document.currentScript.parentElement.dataset.mode="recruiter"}catch(e){}` }} />
      <style>{`html,body{height:auto;overflow:auto;background:#001428}`}</style>
      {/* the dot-matrix bear: a quiet signature behind everything */}
      <div className="rx-dots rx-dots-a" aria-hidden="true" />
      <div className="rx-dots rx-dots-b" aria-hidden="true" />

      <header className="rx-bar">
        <a href="/#desktop" className="rx-brand" aria-label="Back to DANIEL_OS">DANIEL_OS<span>//</span></a>
        <nav aria-label="Sections">
          <a href="#work"><i>01</i>work</a><a href="#experience"><i>02</i>experience</a>
          <a href="#skills"><i>03</i>skills</a><a href="#off-clock"><i>04</i>off the clock</a>
        </nav>
        <span className="rx-clock"><i className="rx-dot" /><span data-clock>--:--</span></span>
        <div className="rx-np-wrap">
          <button type="button" className="rx-np" data-np aria-expanded="false" aria-label="What I'm listening to">[♪]</button>
          <div className="rx-np-pop" role="status" data-np-pop hidden />
        </div>
        <button type="button" className="rx-toggle" role="switch" aria-checked="false" data-mode-toggle>
          <span className="rx-knob" aria-hidden="true" /> recruiter mode
        </button>
      </header>

      <main className="rx-page">
        {/* =================== EXPLORE VIEW =================== */}
        <div className="rx-explore">
          <section className="rx-hero" id="top">
            <div className="rx-hero-l">
              <p className="rx-prompt"><span>guest@db-1</span>:~$ whoami --short<i className="rx-caret" /></p>
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
                <button type="button" className="rx-btn" data-copy={L.email}>copy email</button>
              </div>
            </div>
            <figure className="rx-desk" data-tilt>
              <canvas className="scene" data-scene="bear" width={112} height={72} role="img"
                aria-label="Pixel art of a bear in a hoodie and headphones coding at a desk at night, Mind Coffee steaming, the Campanile in the window" />
              <figcaption><span className="rx-live"><i />online</span><span data-clock>--:--</span><span>in {P.location}</span><span className="rx-hint">hover to say hi</span></figcaption>
            </figure>
          </section>

          <section className="rx-hl" aria-label="Highlights">
            {P.stats.map((s) => (
              <p key={s.label} data-reveal><b><span data-count={s.n}>{s.n}</span>{s.suffix}</b> {s.label}</p>
            ))}
          </section>

          <section id="work" className="rx-sec">
            <h2><i>01</i> selected work {guide}</h2>
            <div className="rx-cards">
              {projects.map((p, i) => (
                <article key={p.slug} className="rx-card" data-reveal data-tilt data-tech={tech(p.tech)}>
                  <a href={`/projects/${p.slug}`} className="rx-card-media" tabIndex={-1} aria-hidden="true"><Thumb slug={p.slug} name={p.name} media={p.media} /></a>
                  <div className="rx-card-top"><span>FILE_0{i + 1}</span>{p.award && <span className="rx-award">{p.award}</span>}</div>
                  <h3 data-scramble>{p.name}</h3>
                  <p>{p.blurb}</p>
                  <details>
                    <summary>show how it works</summary>
                    <ul>{p.details.map((d) => <li key={d}>{d}</li>)}</ul>
                  </details>
                  <p className="rx-chips">{p.tech.map((t) => <span key={t}>{t}</span>)}</p>
                  <p className="rx-more">
                    <a href={`/projects/${p.slug}`}>{p.slug === "daniel-os" ? "how I built it →" : "read the case study →"}</a>
                    {p.repo && <a href={p.repo} target="_blank" rel="noopener">code ↗</a>}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section id="experience" className="rx-sec">
            <h2><i>02</i> experience {guide}</h2>
            <ol className="rx-time">
              {P.experience.map((j) => (
                <li key={j.org} data-reveal>
                  <div className="rx-when">{j.when}<span>{j.where}</span></div>
                  <div className="rx-job">
                    <h3>{j.role} <span>@{j.org}</span></h3>
                    <ul>{j.bullets.slice(0, 2).map((b) => <li key={b}>{b}</li>)}</ul>
                    {j.bullets.length > 2 && <details><summary>+{j.bullets.length - 2} more</summary><ul>{j.bullets.slice(2).map((b) => <li key={b}>{b}</li>)}</ul></details>}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section id="skills" className="rx-sec">
            <h2><i>03</i> skills {guide}</h2>
            <div className="rx-skills">
              {Object.entries(P.skills).map(([g, items]) => (
                <div key={g} data-reveal>
                  <h3>{g}</h3>
                  <p className="rx-chips">{items.map((s) => <button type="button" key={s} data-skill={s}>{s}</button>)}</p>
                </div>
              ))}
            </div>
            <p className="rx-usedin" aria-live="polite" data-usedin>hover or tab through a skill to see which projects used it.</p>
          </section>

          <section id="off-clock" className="rx-sec">
            <h2><i>04</i> off the clock {guide}</h2>
            <div className="rx-scenes">
              {P.personal.hobbies.filter((h) => h.scene).map((h) => (
                <figure key={h.name} className="rx-scene">
                  <canvas className="scene" data-scene={h.scene} width={64} height={40} aria-hidden="true" />
                  <figcaption><b>{h.name}</b>{h.detail && <span>{h.detail}</span>}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        </div>

        {/* =================== RECRUITER VIEW =================== */}
        <div className="rx-rows">
          <div className="rx-r-head">
            <div className="rx-r-links">
              <a href={L.resume} target="_blank" rel="noopener">RÉSUMÉ ↗</a>
              <a href={L.linkedin} target="_blank" rel="noopener">LINKEDIN ↗</a>
              <a href={`mailto:${L.email}`}>EMAIL ↗</a>
              <a href={L.github} target="_blank" rel="noopener">GITHUB ↗</a>
              <button type="button" data-copy={L.email}>COPY EMAIL</button>
            </div>
            <div className="rx-r-id">
              <canvas className="rx-guide rx-guide-static" width={22} height={16} aria-hidden="true" />
              <div>
                <h1>{P.name}</h1>
                <p>{P.title}. {P.recruiter.openTo}. {P.affiliations.filter((a) => a.prev).map((a) => `Prev ${a.role} @ ${a.at}`).join(". ")}.</p>
                <p className="rx-r-meta"><i className="rx-dot" /> online · <span data-clock>--:--</span> · {P.location}</p>
              </div>
            </div>
          </div>

          <h2 className="rx-r-label">experience</h2>
          <ul className="rx-r-list">
            {P.experience.map((j) => (
              <li key={j.org}>
                <div><b>{j.org}</b><span>{j.role} · {j.where}</span></div>
                <span className="rx-r-right">{j.when}</span>
              </li>
            ))}
          </ul>

          <h2 className="rx-r-label">selected work</h2>
          <ul className="rx-r-list rx-r-work">
            {projects.map((p) => (
              <li key={p.slug}>
                <a href={`/projects/${p.slug}`} className="rx-r-thumb" tabIndex={-1} aria-hidden="true"><Thumb slug={p.slug} name={p.name} media={p.media} small /></a>
                <div><a href={`/projects/${p.slug}`} className="rx-r-title">{p.name}</a><span>{p.tech.slice(0, 4).join(" · ")}{p.award ? ` · ${p.award}` : ""}</span></div>
                <a href={`/projects/${p.slug}`} className="rx-r-right rx-r-cta">{p.slug === "daniel-os" ? "process ↗" : "case study ↗"}</a>
              </li>
            ))}
          </ul>

          <h2 className="rx-r-label">skills</h2>
          <p className="rx-r-line">{Object.values(P.skills).flat().slice(0, 18).join(" · ")}</p>

          <h2 className="rx-r-label">education</h2>
          <ul className="rx-r-list">
            <li><div><b>{P.education.school}</b><span>{P.education.degree}</span></div><a className="rx-r-right" href={P.affiliations[0]?.href} target="_blank" rel="noopener">EECS ↗</a></li>
          </ul>

          <h2 className="rx-r-label">off the clock</h2>
          <p className="rx-r-line rx-dim">{P.personal.hobbies.map((h) => h.name).join(" · ")} · learning {P.personal.learning}</p>
        </div>

        {/* =================== SHARED FOOTER =================== */}
        <footer className="rx-foot">
          <button type="button" className="rx-sleeper" data-sleeper aria-label="Wake the bear and go back to the top">
            <canvas width={48} height={28} aria-hidden="true" />
          </button>
          <div className="rx-foot-txt">
            <p className="rx-eot">end of transmission.</p>
            <p className="rx-signoff"><span lang="zh">{SIGN_OFF}</span> hello, I&apos;m learning Chinese.</p>
            <p className="rx-small">© {new Date().getFullYear()} {P.name} · built with Next.js and too much Mind Coffee</p>
          </div>
          <a href="/#desktop" className="rx-btn rx-primary">boot the full DANIEL_OS →</a>
        </footer>
      </main>

      <Script src="/scenes.js" strategy="afterInteractive" />
      <Script src="/cursor.js" strategy="afterInteractive" />
      <RecruiterFx />
    </div>
  );
}
