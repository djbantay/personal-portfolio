/* DANIEL_OS cursor: a targeting reticle.
   - gold core that tracks the pointer exactly
   - four corner brackets that trail behind, slowly rotating while you browse
   - over anything clickable the brackets lock onto it (green) with a tiny status tag
   - click fires a ping ring and a burst of 0s and 1s
   - rest for a moment and a hex coordinate readout appears
   Off on touch devices; calm (no trail, no particles) in clean mode / reduced motion. */
(() => {
  if (!matchMedia("(pointer: fine)").matches) return;
  const reduce = () => document.body.classList.contains("clean") || matchMedia("(prefers-reduced-motion: reduce)").matches;

  const css = `
  html.cc, html.cc *{cursor:none!important}
  html.cc input, html.cc textarea, html.cc [contenteditable="true"]{cursor:text!important}
  #cc-dot,#cc-ring,#cc-tag,.cc-fx{position:fixed;left:0;top:0;pointer-events:none;z-index:2147483000}
  #cc-dot{width:6px;height:6px;margin:-3px 0 0 -3px;background:#FDB515;box-shadow:0 0 0 1px #001428,0 0 8px rgba(253,181,21,.8);transition:transform .12s,background .15s}
  #cc-ring{width:26px;height:26px;transition:opacity .2s}
  #cc-ring i{position:absolute;width:7px;height:7px;border:2px solid #FDB515;filter:drop-shadow(0 0 1px #001428) drop-shadow(0 0 4px rgba(253,181,21,.45));transition:border-color .15s}
  #cc-ring i:nth-child(1){left:0;top:0;border-right:0;border-bottom:0}
  #cc-ring i:nth-child(2){right:0;top:0;border-left:0;border-bottom:0}
  #cc-ring i:nth-child(3){left:0;bottom:0;border-right:0;border-top:0}
  #cc-ring i:nth-child(4){right:0;bottom:0;border-left:0;border-top:0}
  html.cc-lock #cc-ring i{border-color:#7BE08A;filter:drop-shadow(0 0 1px #001428) drop-shadow(0 0 5px rgba(123,224,138,.6))}
  html.cc-lock #cc-dot{background:#7BE08A;transform:scale(.6)}
  html.cc-down #cc-dot{transform:scale(1.6)}
  html.cc-text #cc-dot,html.cc-text #cc-ring,html.cc-text #cc-tag,html.cc-out #cc-dot,html.cc-out #cc-ring,html.cc-out #cc-tag{opacity:0}
  #cc-tag{font:11px/1 'IBM Plex Mono',ui-monospace,monospace;color:#001428;background:#FDB515;padding:2px 5px;white-space:nowrap;opacity:0;transition:opacity .15s;letter-spacing:.04em}
  html.cc-lock #cc-tag{background:#7BE08A}
  #cc-tag.on{opacity:1}
  .cc-fx.ping{width:10px;height:10px;margin:-5px 0 0 -5px;border:2px solid #FDB515;border-radius:50%;animation:ccPing .5s ease-out forwards}
  .cc-fx.bit{font:600 11px/1 'IBM Plex Mono',ui-monospace,monospace;color:#7BE08A;text-shadow:0 0 4px rgba(123,224,138,.7);animation:ccBit .7s ease-out forwards}
  @keyframes ccPing{to{transform:scale(4.2);opacity:0}}
  @keyframes ccBit{to{transform:translate(var(--dx),var(--dy));opacity:0}}
  @media print{#cc-dot,#cc-ring,#cc-tag{display:none}}`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  const dot = Object.assign(document.createElement("div"), { id: "cc-dot" });
  const ring = Object.assign(document.createElement("div"), { id: "cc-ring", innerHTML: "<i></i><i></i><i></i><i></i>" });
  const tag = Object.assign(document.createElement("div"), { id: "cc-tag" });
  document.body.append(ring, dot, tag);
  const root = document.documentElement; root.classList.add("cc", "cc-out");

  const CLICKABLE = 'a,button,[role="button"],summary,select,label,.icon,.disk,.card,.hcard,.polaroid,.win .bar,#powerBtn,#introScreen';
  const DRAGGABLE = '.disk,.icon,.win .bar';
  const TEXTY = 'input,textarea,[contenteditable="true"],#term .in';

  let mx = -100, my = -100, lastMove = 0, target = null, tagText = "", tagTimer = 0;
  const R = { x: -100, y: -100, w: 26, h: 26, a: 0 };   // rendered ring
  const T = { x: -100, y: -100, w: 26, h: 26 };          // ring goal

  function labelFor(el) {
    if (el.matches(DRAGGABLE)) return el.matches(".win .bar") ? "MOVE" : "OPEN / DRAG";
    if (el.matches('a[href^="mailto:"]')) return "SEND";
    if (el.matches("a[target=_blank]")) return "EXT LINK";
    if (el.matches("a")) return "LINK";
    return "EXEC";
  }
  function setTag(text) {
    if (text === tagText) return; tagText = text; clearInterval(tagTimer);
    if (!text) { tag.classList.remove("on"); return; }
    tag.classList.add("on");
    if (reduce()) { tag.textContent = text; return; }
    let n = 0; tag.textContent = "";            // typewriter in
    tagTimer = setInterval(() => { tag.textContent = text.slice(0, ++n) + (n < text.length ? "_" : ""); if (n >= text.length) clearInterval(tagTimer); }, 28);
  }

  addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse") return;
    mx = e.clientX; my = e.clientY; lastMove = performance.now();
    root.classList.remove("cc-out");
    const el = e.target instanceof Element ? e.target : null;
    root.classList.toggle("cc-text", !!(el && el.closest(TEXTY)));
    const hit = el && el.closest(CLICKABLE);
    if (hit !== target) { target = hit; root.classList.toggle("cc-lock", !!hit); setTag(hit ? labelFor(hit) : ""); }
  }, { passive: true });
  document.addEventListener("pointerleave", () => root.classList.add("cc-out"));
  addEventListener("blur", () => root.classList.add("cc-out"));

  addEventListener("pointerdown", e => {
    if (e.pointerType !== "mouse") return;
    root.classList.add("cc-down");
    if (reduce() || root.classList.contains("cc-text")) return;
    const ping = document.createElement("div"); ping.className = "cc-fx ping";
    ping.style.translate = `${mx}px ${my}px`;
    document.body.appendChild(ping); setTimeout(() => ping.remove(), 520);
    for (let i = 0; i < 6; i++) {
      const b = document.createElement("div"); b.className = "cc-fx bit"; b.textContent = Math.random() < .5 ? "0" : "1";
      const a = (i / 6) * Math.PI * 2 + Math.random() * .6, d = 18 + Math.random() * 16;
      b.style.translate = `${mx - 3}px ${my - 6}px`;
      b.style.setProperty("--dx", `${Math.cos(a) * d}px`); b.style.setProperty("--dy", `${Math.sin(a) * d}px`);
      document.body.appendChild(b); setTimeout(() => b.remove(), 720);
    }
  });
  addEventListener("pointerup", () => root.classList.remove("cc-down"));

  const hex = n => "0x" + Math.max(0, Math.round(n)).toString(16).toUpperCase().padStart(3, "0");
  function frame(now) {
    const calm = reduce();
    if (target && target.isConnected) {
      const b = target.getBoundingClientRect();
      if (b.width <= 220 && b.height <= 180) {           // lock onto small targets
        const pad = 4; T.x = b.left + b.width / 2; T.y = b.top + b.height / 2; T.w = b.width + pad * 2; T.h = b.height + pad * 2;
      } else { T.x = mx; T.y = my; T.w = 18; T.h = 18; }  // big targets: tighten around the pointer
    } else { T.x = mx; T.y = my; T.w = root.classList.contains("cc-down") ? 18 : 26; T.h = T.w; }
    const k = calm ? 1 : 0.22;
    R.x += (T.x - R.x) * k; R.y += (T.y - R.y) * k; R.w += (T.w - R.w) * (calm ? 1 : .25); R.h += (T.h - R.h) * (calm ? 1 : .25);
    const locked = !!target;
    R.a = locked || calm ? R.a * 0.8 : (R.a + 0.9) % 360;   // idle spin, square up when locked
    dot.style.transform = `translate(${mx}px,${my}px)` + (root.classList.contains("cc-down") ? " scale(1.6)" : locked ? " scale(.6)" : "");
    ring.style.width = R.w + "px"; ring.style.height = R.h + "px";
    ring.style.transform = `translate(${R.x - R.w / 2}px,${R.y - R.h / 2}px) rotate(${locked ? 0 : R.a}deg)`;
    // tag: status while locked, hex coordinates after resting a moment
    if (!locked) {
      const resting = now - lastMove > 700 && mx > 0;
      if (resting && !tagText.startsWith("0x")) setTag(`${hex(mx)},${hex(my)}`);
      else if (!resting && tagText.startsWith("0x")) setTag("");
    }
    const tx = locked && target ? Math.min(innerWidth - 120, R.x + R.w / 2 + 6) : mx + 16;
    const ty = locked && target ? Math.max(4, R.y - R.h / 2 - 16) : my + 14;
    tag.style.transform = `translate(${tx}px,${ty}px)`;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
