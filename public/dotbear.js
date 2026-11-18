/* DANIEL_OS dot-matrix bear: the site's background signature (inspired by the giant
   dotted lettering on matthewhamilton.dev). The bear's own pixels become LED dots:
   - a faint dot grid over the whole screen, like an unlit LED panel
   - the bear's face in gold dots, sized by how bright each pixel is
   - a scanline that sweeps down every few seconds, random twinkle, and dots that
     light up around the cursor
   Needs scenes.js (window.BEAR.seated) loaded first. Calm in clean mode / reduced motion. */
(() => {
  function sampleBear() {
    const src = window.BEAR && window.BEAR.seated; if (!src) return null;
    const x0 = 3, y0 = 0, W = 25, H = 19;               // the head: ears, eyes, muzzle
    const d = src.getContext("2d").getImageData(x0, y0, W, H).data, px = [];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4, a = d[i + 3]; if (a < 10) continue;
      const lum = (0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2]) / 255;
      if (lum < 0.13) continue;                            // outline + eyes stay dark: that's what makes it read as a face
      px.push({ x, y, lum });
    }
    return { W, H, px };
  }

  window.DotBear = function (cv, opts = {}) {
    const cx = cv.getContext("2d");
    let o = { anchorX: 0.72, anchorY: 0.52, height: 0.82, color: [253, 181, 21], alpha: 0.16, grid: true, ...opts };
    let bear = null, w = 0, h = 0, dpr = 1, on = true, boost = 1, mx = -1e4, my = -1e4, t0 = performance.now();
    const calm = () => document.body.classList.contains("clean") || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const size = () => { dpr = Math.min(2, devicePixelRatio || 1); w = cv.clientWidth; h = cv.clientHeight; cv.width = w * dpr; cv.height = h * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    addEventListener("resize", size); size();
    addEventListener("pointermove", (e) => { const r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; }, { passive: true });
    const rgba = (a) => `rgba(${o.color[0]},${o.color[1]},${o.color[2]},${Math.max(0, Math.min(1, a)).toFixed(3)})`;
    const seeds = new Float32Array(2048).map(() => Math.random() * 1000);

    function frame(now) {
      if (!bear) bear = sampleBear();
      cx.clearRect(0, 0, w, h);
      if (!on || !bear) { requestAnimationFrame(frame); return; }
      const still = calm(), t = (now - t0) / 1000 * (still ? 0 : 1) * boost;
      const g = Math.max(10, Math.min(h * o.height / bear.H, w * 0.9 / bear.W));   // dot pitch
      const bx = w * o.anchorX - (bear.W * g) / 2, by = h * o.anchorY - (bear.H * g) / 2;
      // unlit LED panel
      if (o.grid) { cx.fillStyle = rgba(o.alpha * 0.22 * boost); const p = g / 2;
        for (let y = (by % p) - p; y < h; y += p) for (let x = (bx % p) - p; x < w; x += p) cx.fillRect(x, y, 1.2, 1.2); }
      const sweep = ((t * 0.18) % 1.6) - 0.3;              // scanline position in bear-heights
      bear.px.forEach((q, i) => {
        const x = bx + q.x * g + g / 2, y = by + q.y * g + g / 2;
        let a = o.alpha * (0.55 + q.lum) * boost;
        const sy = q.y / bear.H - sweep; if (Math.abs(sy) < 0.06) a *= 2.4 - Math.abs(sy) * 20;   // scan
        if (!still) a *= 0.85 + 0.15 * Math.sin(t * 2.2 + seeds[i % 2048]);                         // twinkle
        const dx = x - mx, dy = y - my, d2 = dx * dx + dy * dy, R = g * 4;
        let r = g * (0.16 + 0.24 * q.lum);
        if (d2 < R * R) { const k = 1 - Math.sqrt(d2) / R; a += k * 0.5; r *= 1 + k * 0.6; }        // cursor glow
        cx.fillStyle = rgba(a); cx.beginPath(); cx.arc(x, y, r, 0, Math.PI * 2); cx.fill();
      });
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    return {
      el: cv,
      setColors(c) { if (c && c.head) { const m = c.head.match(/#(..)(..)(..)/); if (m) o.color = [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)]; } },
      set(opts2) { o = { ...o, ...opts2 }; },
      toggle() { on = !on; return on; },
      boost(v) { boost = v; },
    };
  };
})();
