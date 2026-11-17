import fs from "node:fs";
import path from "node:path";

const exists = (src?: string) => !!src && fs.existsSync(path.join(process.cwd(), "public", src));

/** <Screenshot src="/projects/x/shot.png" alt="..." caption="..."/> — shows a placeholder until the image exists. */
export function Screenshot({ src, alt, caption }: { src?: string; alt: string; caption?: string }) {
  return (
    <figure className="shot">
      <div className="shot-bar"><span>{alt}</span><i>_ □ ×</i></div>
      {exists(src) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} />
      ) : (
        <div className="shot-empty">screenshot coming soon<br /><small>add it at public{src ?? "/projects/…"}</small></div>
      )}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

/** <Video src="/projects/x/demo.mp4" /> — a short screen recording, if present. */
export function Video({ src, caption }: { src: string; caption?: string }) {
  if (!exists(src)) return <Screenshot src={src} alt="demo video" caption={caption} />;
  return (
    <figure className="shot">
      <video src={src} controls playsInline muted loop />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

/** <Links repo="https://github.com/..." demo="https://..." /> */
export function Links({ repo, demo }: { repo?: string; demo?: string }) {
  return (
    <p className="links">
      {repo ? <a className="btn" href={repo} target="_blank" rel="noopener">source ↗</a> : <span className="btn off">source: coming soon</span>}
      {demo ? <a className="btn" href={demo} target="_blank" rel="noopener">live demo ↗</a> : <span className="btn off">demo: coming soon</span>}
    </p>
  );
}

/** <Stats items={[["37", "pytest tests"], ...]} /> */
export function Stats({ items }: { items: [string, string][] }) {
  return (
    <div className="stats">
      {items.map(([v, l]) => (
        <div key={l}><b>{v}</b><span>{l}</span></div>
      ))}
    </div>
  );
}

export function Note({ children }: { children: React.ReactNode }) {
  return <aside className="note">{children}</aside>;
}
