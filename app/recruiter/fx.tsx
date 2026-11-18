"use client";
import { useEffect } from "react";

type Scene = ((c: CanvasRenderingContext2D, f: number, hov: boolean) => void) & { size?: [number, number] };

// All the interactive bits for recruiter mode, wired to data-attributes in page.tsx.
export default function RecruiterFx() {
  useEffect(() => {
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const off: (() => void)[] = [];
    const on = (el: EventTarget, ev: string, fn: EventListener, opt?: AddEventListenerOptions) => { el.addEventListener(ev, fn, opt); off.push(() => el.removeEventListener(ev, fn)); };

    // live clock in Daniel's time zone
    const clock = document.querySelector<HTMLElement>("[data-clock]");
    const tick = () => { if (clock) clock.textContent = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Los_Angeles" }) + " PT"; };
    tick(); const clockT = setInterval(tick, 15000); off.push(() => clearInterval(clockT));

    // "decrypt" text: scramble through glyphs, then resolve left to right
    const GLYPHS = "01#$%&*+=<>/\\[]{}ABCDEF";
    const scramble = (el: HTMLElement) => {
      if (calm || el.dataset.busy) return;
      const text = el.dataset.text || (el.dataset.text = el.textContent || "");
      el.dataset.busy = "1"; let frame = 0;
      const id = setInterval(() => {
        frame++;
        el.textContent = [...text].map((ch, i) => (ch === " " || i < frame / 2) ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]).join("");
        if (frame / 2 >= text.length) { clearInterval(id); el.textContent = text; delete el.dataset.busy; }
      }, 28);
    };
    document.querySelectorAll<HTMLElement>("[data-scramble]").forEach((el) => {
      const host = el.closest<HTMLElement>(".rx-card") || el;
      on(host, "pointerenter", () => scramble(el));
    });
    const h1 = document.querySelector<HTMLElement>(".rx-hero h1"); if (h1) setTimeout(() => scramble(h1), 250);

    // reveal on scroll + count-up numbers
    const countUp = (el: HTMLElement) => {
      const n = parseFloat(el.dataset.count || "0"), dec = String(n).includes(".") ? 1 : 0;
      if (calm) { el.textContent = n.toFixed(dec); return; }
      const t0 = performance.now(), dur = 1100;
      const step = (t: number) => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        el.textContent = (n * e).toFixed(dec); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((ents) => ents.forEach((e) => {
      if (!e.isIntersecting) return; const el = e.target as HTMLElement; el.classList.add("in");
      el.querySelectorAll<HTMLElement>("[data-count]").forEach(countUp); io.unobserve(el);
    }), { threshold: 0.15 });
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    off.push(() => io.disconnect());

    // tilt + holographic sheen toward the pointer
    if (!calm) document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
      const max = el.classList.contains("rx-desk") ? 6 : 5;
      on(el, "pointermove", (ev) => { const e = ev as PointerEvent, r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.transform = `perspective(800px) rotateY(${(x - .5) * max}deg) rotateX(${(.5 - y) * max}deg) translateY(-2px)`;
        el.style.setProperty("--mx", `${x * 100}%`); el.style.setProperty("--my", `${y * 100}%`); });
      on(el, "pointerleave", () => { el.style.transform = ""; });
    });

    // copy email
    document.querySelectorAll<HTMLButtonElement>("[data-copy]").forEach((b) => on(b, "click", async () => {
      try { await navigator.clipboard.writeText(b.dataset.copy || ""); b.textContent = "copied ✓"; }
      catch { b.textContent = b.dataset.copy || ""; }
      setTimeout(() => (b.textContent = "copy email"), 1600);
    }));

    // hover/focus a skill: light up the projects that used it
    const cards = [...document.querySelectorAll<HTMLElement>(".rx-card")];
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    const usedIn = document.querySelector<HTMLElement>("[data-usedin]"), usedDefault = usedIn?.textContent || "";
    const light = (skill: string | null) => {
      document.body.classList.toggle("rx-filtering", !!skill);
      const hits: string[] = [];
      cards.forEach((c) => { const hit = !!skill && (c.dataset.tech || "").split("|").some((t) => norm(t).includes(norm(skill!)) || norm(skill!).includes(norm(t)));
        c.classList.toggle("hit", hit); if (hit) hits.push(c.querySelector("h3")?.getAttribute("data-text") || c.querySelector("h3")?.textContent || ""); });
      if (usedIn) usedIn.innerHTML = !skill ? usedDefault : hits.length
        ? `<b>${skill}</b> → used in ${hits.map((h) => `<span>${h}</span>`).join(", ")} <i>(click to jump)</i>`
        : `<b>${skill}</b> → used in client work and coursework`;
    };
    document.querySelectorAll<HTMLElement>("[data-skill]").forEach((b) => {
      const s = b.dataset.skill || "";
      const used = cards.some((c) => (c.dataset.tech || "").split("|").some((t) => norm(t).includes(norm(s)) || norm(s).includes(norm(t))));
      if (used) b.classList.add("used");
      on(b, "pointerenter", () => light(s)); on(b, "focus", () => light(s));
      on(b, "pointerleave", () => light(null)); on(b, "blur", () => light(null));
      on(b, "click", () => { if (used) document.getElementById("work")?.scrollIntoView({ behavior: calm ? "auto" : "smooth" }); });
    });

    // hobby scenes (shared with the desktop's hobbies window)
    let alive = true; off.push(() => { alive = false; });
    const startScenes = () => {
      const S = (window as unknown as { HOBBY_SCENES?: Record<string, Scene> & { W: number; H: number } }).HOBBY_SCENES;
      if (!S) { if (alive) setTimeout(startScenes, 150); return; }
      const items = [...document.querySelectorAll<HTMLCanvasElement>("canvas.scene")].map((cv) => {
        const fn = S[cv.dataset.scene || ""] as Scene | undefined; const fig = cv.closest("figure")!;
        if (fn?.size) { cv.width = fn.size[0]; cv.height = fn.size[1]; }
        const it = { c: cv.getContext("2d")!, fn, hov: false, w: cv.width, h: cv.height };
        fig.addEventListener("pointerenter", () => (it.hov = true)); fig.addEventListener("pointerleave", () => (it.hov = false));
        return it;
      }).filter((i) => i.fn);
      let f = 40, last = performance.now(), acc = 0;
      const draw = () => items.forEach((i) => { i.c.clearRect(0, 0, i.w, i.h); i.fn!(i.c, f, i.hov); });
      draw();
      if (calm) return;
      const loop = (now: number) => { if (!alive) return; acc += Math.min(250, now - last); last = now;
        let n = 0; while (acc >= 83 && n < 3) { f++; acc -= 83; n++; } if (n) draw(); requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    };
    startScenes();

    return () => off.forEach((fn) => fn());
  }, []);
  return null;
}
