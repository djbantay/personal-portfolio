"use client";
import { useEffect } from "react";

type Scene = ((c: CanvasRenderingContext2D, f: number, hov: boolean) => void) & { size?: [number, number] };
type BearKit = { walk: HTMLCanvasElement[]; sit: HTMLCanvasElement; sleep: (c: CanvasRenderingContext2D, f: number, awake: boolean) => void };
type DotBearApi = { set: (o: Record<string, unknown>) => void };
type W = Window & { HOBBY_SCENES?: Record<string, Scene> & { W: number; H: number }; BEAR?: BearKit; DotBear?: (cv: HTMLCanvasElement, o: Record<string, unknown>) => DotBearApi };

// Everything interactive on the portfolio page, wired to data-attributes in page.tsx.
export default function RecruiterFx() {
  useEffect(() => {
    const calm = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
    const off: (() => void)[] = [];
    const on = (el: EventTarget, ev: string, fn: EventListener, opt?: AddEventListenerOptions) => { el.addEventListener(ev, fn, opt); off.push(() => el.removeEventListener(ev, fn)); };
    const root = document.querySelector<HTMLElement>(".rx")!;
    let alive = true; off.push(() => { alive = false; });

    // ---------- view toggle: explore <-> recruiter rows, mirrored in ?recruiter=true ----------
    const toggle = document.querySelector<HTMLButtonElement>("[data-mode-toggle]");
    const setMode = (mode: "explore" | "recruiter", push: boolean) => {
      root.dataset.mode = mode; toggle?.setAttribute("aria-checked", String(mode === "recruiter"));
      if (push) { const u = new URL(location.href); if (mode === "recruiter") u.searchParams.set("recruiter", "true"); else u.searchParams.delete("recruiter"); history.replaceState(null, "", u); }
      document.title = mode === "recruiter" ? "Daniel Bantay — recruiter mode" : "Daniel Bantay — portfolio";
      if (mode === "explore") requestAnimationFrame(() => document.querySelectorAll("[data-reveal]").forEach((e) => io.observe(e)));
      bg?.set(bgPos(mode));
    };
    let bg: DotBearApi | undefined;
    const bgPos = (mode = root.dataset.mode) => innerWidth < 860 ? { anchorX: .5, anchorY: .6, height: .6, alpha: .12 }
      : mode === "recruiter" ? { anchorX: .76, anchorY: .54, height: .74, alpha: .12 } : { anchorX: .5, anchorY: .56, height: .86, alpha: .07 };
    const keys: Record<string, string | (() => void)> = {
      r: (document.querySelector<HTMLAnchorElement>(".rx-r-links a[href$='.pdf']")?.href) || "",
      e: (document.querySelector<HTMLAnchorElement>(".rx-r-links a[href^='mailto:']")?.href) || "",
      g: (document.querySelector<HTMLAnchorElement>(".rx-r-links a[href*='github']")?.href) || "",
      l: (document.querySelector<HTMLAnchorElement>(".rx-r-links a[href*='linkedin']")?.href) || "",
      x: () => setMode("explore", true),
    };
    on(document, "keydown", (ev) => {
      const e = ev as KeyboardEvent; if (root.dataset.mode !== "recruiter" || e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as Element).closest("input, textarea, [contenteditable]")) return;
      const k = keys[e.key.toLowerCase()]; if (!k) return; e.preventDefault();
      if (typeof k === "function") { k(); window.scrollTo({ top: 0 }); } else if (k.startsWith("mailto:")) location.href = k; else window.open(k, "_blank", "noopener");
    });
    if (toggle) on(toggle, "click", () => { setMode(root.dataset.mode === "recruiter" ? "explore" : "recruiter", true); window.scrollTo({ top: 0, behavior: calm() ? "auto" : "smooth" }); });

    // ---------- live clocks ----------
    const clocks = document.querySelectorAll<HTMLElement>("[data-clock]");
    const tick = () => { const t = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Los_Angeles" }) + " PT"; clocks.forEach((c) => (c.textContent = t)); };
    tick(); const clockT = setInterval(tick, 15000); off.push(() => clearInterval(clockT));

    // ---------- [♪] now playing ----------
    const npBtn = document.querySelector<HTMLButtonElement>("[data-np]"), npPop = document.querySelector<HTMLElement>("[data-np-pop]");
    if (npBtn && npPop) {
      const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
      on(npBtn, "click", async () => {
        const open = npPop.hidden; npPop.hidden = !open; npBtn.setAttribute("aria-expanded", String(open)); if (!open) return;
        npPop.innerHTML = "<span class='rx-dim'>tuning in…</span>";
        try {
          const j = await fetch("/api/now-playing").then((r) => r.json());
          if (!j.configured) npPop.innerHTML = "<span class='rx-dim'>♪ the jukebox is unplugged right now.</span>";
          else if (!j.track) npPop.innerHTML = "<span class='rx-dim'>♪ nothing on the turntable right now.</span>";
          else { const t = j.track, title = t.url ? `<a href="${esc(t.url)}" target="_blank" rel="noopener">${esc(t.title)}</a>` : esc(t.title);
            npPop.innerHTML = `<span class="rx-np-k">${t.playing ? "now playing" : "last played"}</span>${title}<span class="rx-dim">${esc(t.artist)}</span>`; }
        } catch { npPop.innerHTML = "<span class='rx-dim'>♪ couldn't reach the jukebox.</span>"; }
      });
      on(document, "click", (e) => { if (!npPop.hidden && !(e.target as Element).closest(".rx-np-wrap")) { npPop.hidden = true; npBtn.setAttribute("aria-expanded", "false"); } });
    }

    // ---------- "decrypt" text ----------
    const GLYPHS = "01#$%&*+=<>/\\[]{}ABCDEF";
    const scramble = (el: HTMLElement) => {
      if (calm() || el.dataset.busy) return;
      const text = el.dataset.text || (el.dataset.text = el.textContent || ""); el.dataset.busy = "1"; let frame = 0;
      const id = setInterval(() => { frame++;
        el.textContent = [...text].map((ch, i) => (ch === " " || i < frame / 2) ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]).join("");
        if (frame / 2 >= text.length) { clearInterval(id); el.textContent = text; delete el.dataset.busy; } }, 28);
    };
    document.querySelectorAll<HTMLElement>("[data-scramble]").forEach((el) => on(el.closest<HTMLElement>(".rx-card") || el, "pointerenter", () => scramble(el)));
    const h1 = document.querySelector<HTMLElement>(".rx-hero h1"); if (h1 && root.dataset.mode === "explore") setTimeout(() => scramble(h1), 250);

    // ---------- reveal + count-up ----------
    const countUp = (el: HTMLElement) => {
      const n = parseFloat(el.dataset.count || "0"), dec = String(n).includes(".") ? 1 : 0;
      if (calm()) { el.textContent = n.toFixed(dec); return; }
      const t0 = performance.now(); const step = (t: number) => { const k = Math.min(1, (t - t0) / 1100); el.textContent = (n * (1 - Math.pow(1 - k, 3))).toFixed(dec); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((ents) => ents.forEach((e) => { if (!e.isIntersecting) return; const el = e.target as HTMLElement;
      el.classList.add("in"); el.querySelectorAll<HTMLElement>("[data-count]").forEach(countUp); io.unobserve(el); }), { threshold: 0.15 });
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el)); off.push(() => io.disconnect());

    // ---------- tilt ----------
    if (!calm()) document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
      const max = el.classList.contains("rx-desk") ? 6 : 4;
      on(el, "pointermove", (ev) => { const e = ev as PointerEvent, r = el.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.transform = `perspective(900px) rotateY(${(x - .5) * max}deg) rotateX(${(.5 - y) * max}deg) translateY(-2px)`; });
      on(el, "pointerleave", () => { el.style.transform = ""; });
    });

    // ---------- copy email ----------
    document.querySelectorAll<HTMLButtonElement>("[data-copy]").forEach((b) => on(b, "click", async () => {
      const label = b.textContent; try { await navigator.clipboard.writeText(b.dataset.copy || ""); b.textContent = label === label?.toUpperCase() ? "COPIED ✓" : "copied ✓"; } catch { b.textContent = b.dataset.copy || ""; }
      setTimeout(() => (b.textContent = label), 1600);
    }));

    // ---------- skills light up projects ----------
    const cards = [...document.querySelectorAll<HTMLElement>(".rx-card")];
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    const uses = (c: HTMLElement, s: string) => (c.dataset.tech || "").split("|").some((t) => norm(t).includes(norm(s)) || norm(s).includes(norm(t)));
    const usedIn = document.querySelector<HTMLElement>("[data-usedin]"), usedDefault = usedIn?.textContent || "";
    const light = (skill: string | null) => {
      root.classList.toggle("rx-filtering", !!skill); const hits: string[] = [];
      cards.forEach((c) => { const hit = !!skill && uses(c, skill); c.classList.toggle("hit", hit); if (hit) hits.push(c.querySelector("h3")?.getAttribute("data-text") || c.querySelector("h3")?.textContent || ""); });
      if (usedIn) usedIn.innerHTML = !skill ? usedDefault : hits.length ? `<b>${skill}</b> → used in ${hits.map((h) => `<span>${h}</span>`).join(", ")} <i>(click to jump)</i>` : `<b>${skill}</b> → used in client work and coursework`;
    };
    document.querySelectorAll<HTMLElement>("[data-skill]").forEach((b) => {
      const s = b.dataset.skill || "", used = cards.some((c) => uses(c, s)); if (used) b.classList.add("used");
      on(b, "pointerenter", () => light(s)); on(b, "focus", () => light(s)); on(b, "pointerleave", () => light(null)); on(b, "blur", () => light(null));
      on(b, "click", () => { if (used) document.getElementById("work")?.scrollIntoView({ behavior: calm() ? "auto" : "smooth" }); });
    });

    // ---------- demo clips play on hover ----------
    document.querySelectorAll<HTMLVideoElement>("video[data-hoverplay]").forEach((v) => {
      const host = v.closest<HTMLElement>(".rx-card, li") || v;
      on(host, "pointerenter", () => { if (!calm()) v.play().catch(() => {}); });
      on(host, "pointerleave", () => { v.pause(); });
    });

    // ---------- canvases: scenes, walking guides, sleeper ----------
    const boot = () => {
      const w = window as W, S = w.HOBBY_SCENES, B = w.BEAR;
      if (!S || !B || !w.DotBear) { if (alive) setTimeout(boot, 120); return; }
      const bgCanvas = document.querySelector<HTMLCanvasElement>("canvas[data-dotbear]");
      if (bgCanvas) bg = w.DotBear(bgCanvas, bgPos());
      on(window, "resize", () => bg?.set(bgPos()));

      const scenes = [...document.querySelectorAll<HTMLCanvasElement>("canvas.scene")].map((cv) => {
        const fn = S[cv.dataset.scene || ""] as Scene | undefined; const host = cv.closest("figure, .rx-card, li") || cv;
        if (fn?.size) { cv.width = fn.size[0]; cv.height = fn.size[1]; }
        const it = { cv, c: cv.getContext("2d")!, fn, hov: false };
        host.addEventListener("pointerenter", () => (it.hov = true)); host.addEventListener("pointerleave", () => (it.hov = false));
        return it; }).filter((i) => i.fn);

      // guide bears: walk in along each heading's divider when it scrolls into view, then sit
      type Guide = { cv: HTMLCanvasElement; c: CanvasRenderingContext2D; h2: HTMLElement; state: "wait" | "walk" | "sit"; x: number; tx: number; t0: number; v: number };
      const guides: Guide[] = [...document.querySelectorAll<HTMLCanvasElement>("canvas.rx-guide")].map((cv) => ({ cv, c: cv.getContext("2d")!, h2: cv.parentElement as HTMLElement, state: "wait", x: 0, tx: 0, t0: 0, v: 4 }));
      const target = (g: Guide) => { const label = g.h2.firstChild as Node | null; const r = document.createRange();
        r.setStart(g.h2, 0); r.setEndBefore(g.cv); const w2 = r.getBoundingClientRect().width; void label; return Math.round(w2 + 10); };
      const gio = new IntersectionObserver((ents) => ents.forEach((e) => { if (!e.isIntersecting) return;
        const g = guides.find((x) => x.h2 === e.target); if (!g || g.state !== "wait") return;
        g.tx = target(g); if (calm() || g.cv.classList.contains("rx-guide-static")) { g.state = "sit"; g.x = g.tx; }
        else { g.state = "walk"; g.x = g.h2.clientWidth - 44; g.v = Math.max(4, (g.x - g.tx) / 22); g.t0 = performance.now(); } gio.unobserve(e.target); }), { threshold: 0.6 });
      guides.forEach((g) => { if (g.cv.classList.contains("rx-guide-static")) { g.state = "sit"; g.x = 0; } else gio.observe(g.h2); });
      off.push(() => gio.disconnect());

      const sleeperBtn = document.querySelector<HTMLButtonElement>("[data-sleeper]"), sleeper = sleeperBtn?.querySelector("canvas");
      const sc = sleeper?.getContext("2d"); let awakeUntil = 0;
      if (sleeperBtn) on(sleeperBtn, "click", () => { awakeUntil = performance.now() + 900; setTimeout(() => window.scrollTo({ top: 0, behavior: calm() ? "auto" : "smooth" }), 650); });

      let f = 40;
      const draw = (now: number) => {
        scenes.forEach((i) => { if (!i.cv.offsetParent) return; i.c.clearRect(0, 0, i.cv.width, i.cv.height); i.fn!(i.c, f, i.hov); });
        guides.forEach((g) => {
          if (g.state === "wait" || !g.cv.offsetParent) return;
          if (g.state === "walk") { g.x -= g.v; if (g.x <= g.tx) { g.x = g.tx; g.state = "sit"; } }
          g.cv.style.transform = `translateX(${g.x}px)`;
          g.c.clearRect(0, 0, 22, 16);
          if (g.state === "walk") { g.c.save(); g.c.scale(-1, 1); g.c.drawImage(B.walk[(f >> 1) % 2], -22, 0); g.c.restore(); }
          else g.c.drawImage(B.sit, 2, 0);
        });
        if (sc) { sc.clearRect(0, 0, 48, 28); B.sleep(sc, f, now < awakeUntil); }
      };
      draw(performance.now());
      let last = performance.now(), acc = 0;
      const loop = (now: number) => { if (!alive) return; acc += Math.min(250, now - last); last = now;
        if (!calm() && !document.body.classList.contains("clean")) { let n = 0; while (acc >= 83 && n < 3) { f++; acc -= 83; n++; } if (n) draw(now); } else if (acc >= 250) { acc = 0; draw(now); }
        requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    };
    boot();

    return () => off.forEach((fn) => fn());
  }, []);
  return null;
}
