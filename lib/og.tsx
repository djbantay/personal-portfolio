import fs from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

// same pixel bear as the site (24×13), "g" = gold, "k" = eye
const BEAR = [
  "..................gg....",
  "......gggggggg...gggg...",
  "....gggggggggggggggggg..",
  "...gggggggggggggggggkggg",
  "..gggggggggggggggggggggg",
  "..ggggggggggggggggggg...",
  "..gggggggggggggggggg....",
  "..ggggggggggggggggg.....",
  "...gggggggggggggggg.....",
  "...ggg..ggg...ggg..gg...",
  "...ggg..gg....ggg..gg...",
  "...gg...gg....gg...gg...",
  "..ggg..ggg...ggg..ggg...",
];

const toBin = (s: string) => [...s].map((c) => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");

/** Retro link-preview card used for the home page and every project page. */
export async function retroCard(opts: { kicker: string; title: string; subtitle: string; footer: string; tags?: string[] }) {
  const font = await fs.readFile(path.join(process.cwd(), "assets/VT323.woff"));
  const cell = 14;
  const titleSize = opts.title.length > 16 ? 96 : 128;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#001428", fontFamily: "VT323", color: "#E9E4D4" }}>
        {/* scanlines */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
          {Array.from({ length: 105 }).map((_, i) => (
            <div key={i} style={{ height: 6, width: "100%", borderTop: "1px solid rgba(255,255,255,0.035)" }} />
          ))}
        </div>
        {/* frame */}
        <div style={{ position: "absolute", left: 28, top: 28, right: 28, bottom: 28, border: "4px solid #FDB515", display: "flex" }} />
        <div style={{ position: "absolute", left: 28, top: 28, right: 28, height: 44, background: "#FDB515", color: "#001428", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", fontSize: 34 }}>
          <span>DANIEL_OS — {opts.kicker}</span>
          <span>[_] [X]</span>
        </div>
        {/* text */}
        <div style={{ position: "absolute", left: 70, top: 110, width: 760, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, color: "#3B7EA1", letterSpacing: 2 }}>{toBin(opts.title.slice(0, 4).toUpperCase())}</div>
          <div style={{ fontSize: titleSize, lineHeight: 0.9, color: "#FDB515", marginTop: 8 }}>{opts.title}</div>
          <div style={{ fontSize: 46, marginTop: 18, lineHeight: 1.05 }}>{opts.subtitle}</div>
          {opts.tags?.length ? (
            <div style={{ display: "flex", flexWrap: "wrap", marginTop: 22 }}>
              {opts.tags.slice(0, 6).map((t) => (
                <div key={t} style={{ border: "2px solid #3B7EA1", color: "#a9d3ea", fontSize: 28, padding: "0 12px", marginRight: 10, marginBottom: 10 }}>{t}</div>
              ))}
            </div>
          ) : null}
        </div>
        <div style={{ position: "absolute", left: 70, bottom: 60, fontSize: 36, color: "#FDB515", display: "flex" }}>
          {opts.footer}
          <span style={{ background: "#FDB515", width: 18, height: 34, marginLeft: 8 }} />
        </div>
        {/* pixel bear */}
        <div style={{ position: "absolute", right: 70, bottom: 74, width: 24 * cell, height: 13 * cell, display: "flex" }}>
          {BEAR.flatMap((row, y) =>
            [...row].map((ch, x) =>
              ch === "." ? null : (
                <div key={`${x}-${y}`} style={{ position: "absolute", left: x * cell, top: y * cell, width: cell + 1, height: cell + 1, background: ch === "k" ? "#001428" : "#FDB515" }} />
              ),
            ),
          )}
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: [{ name: "VT323", data: font, style: "normal", weight: 400 }] },
  );
}
