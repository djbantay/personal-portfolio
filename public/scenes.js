/* DANIEL_OS hobby scenes: tiny pixel-art dioramas drawn on 64x40 canvases.
   Each scene is fn(ctx, frame, hovered). One light source (top-left),
   three tones per material, Berkeley blue + gold tying it all together. */
(() => {
  const W = 64, H = 40;
  const R = (c, x, y, w, h, col) => { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), w, h); };
  const BASE = { s:"#e8b48a", S:"#c98d63", h:"#2a1a12", b:"#3b7dd8", B:"#2a5aa0", k:"#2b2b3a", K:"#1c1c28", w:"#f2efe6", j:"#3b7dd8" };
  function spr(c, rows, x, y, flip, pal) {
    const P = pal ? Object.assign({}, BASE, pal) : BASE;
    rows.forEach((r, j) => { const s = flip ? [...r].reverse().join("") : r;
      [...s].forEach((ch, i) => { if (P[ch]) R(c, x + i, y + j, 1, 1, P[ch]); }); });
  }
  /* 3x5 pixel font so labels stay crisp at 64px */
  const GL = {A:"010101111101101",B:"110101110101110",C:"011100100100011",D:"110101101101110",E:"111100110100111",F:"111100110100100",G:"011100101101011",H:"101101111101101",I:"111010010010111",K:"101101110101101",L:"100100100100111",N:"110101101101101",P:"110101110100100",R:"110101110101101",T:"111010010010010",X:"101101010101101",O:"111101101101111",S:"011100010001110","!":"010010010000010",
    0:"111101101101111",1:"010110010010111",2:"110001010100111",3:"110001010001110",4:"101101111001001",5:"111100110001110",6:"011100111101111",7:"111001010010010",8:"111101111101111",9:"111101111001110"};
  const txt = (c, s, x, y, col) => { y -= 5; [...String(s).toUpperCase()].forEach((ch, n) => { const g = GL[ch]; if (!g) return;
    for (let i = 0; i < 15; i++) if (g[i] === "1") { const px = x + n*4 + i % 3, py = y + (i / 3 | 0); R(c, px + 1, py + 1, 1, 1, "rgba(0,0,0,.55)"); R(c, px, py, 1, 1, col); } }); };

  const CLIMBER = [".......s..","...hh..s..","..hhhh.b..","..hssS.b..","..bbbbbb..",".sbbbBB...",".s.bbBB...","...kkKK...","...kk.KK..","..kk...K..",".kk....KK.",".ww.....ww"];
  const STAND = ["..hhh...",".hhhhh..",".hsssS..","..sss...",".jjjjjj.","sjjjjjjs","sjjjjjjs","s.jjjj.s","..kkkk..","..kk.kk.","..kk.kk.","..kk.kk.",".ww..ww."];
  const REACH = ["......s.","..hhh.s.",".hhhhhj.",".hsssSj.","..sssjj.",".jjjjjj.","sjjjjjj.","s.jjjj..","..kkkk..","..kk.kk.",".kk...kk",".kk...kk","ww....ww"];

  /* ---- bouldering: climb the gold route, fall on the pad, go again ---- */
  const HOLDS = [[30,30,"g"],[24,25,"g"],[32,20,"g"],[26,15,"g"],[31,9,"g"],[28,4,"g"],[12,27,"r"],[48,13,"b"],[10,11,"n"],[52,28,"r"],[16,18,"b"]];
  const HC = { g:["#FDB515","#ffe08a","#a8770a"], r:["#b8463c","#d86a60","#7a2a24"], b:["#3a6aa8","#6a98d0","#24467a"], n:["#4f8a52","#7ab07c","#2f5a32"] };
  function climb(c, f, hov) {
    for (let y = 0; y < 36; y++) for (let x = 0; x < W; x++) R(c, x, y, 1, 1, ((x*3 + y*5) % 7 === 0) ? "#4e3c2e" : "#5a4636");
    for (let y = 5; y < 25; y++) { const w = Math.min(y - 5, 25 - y); R(c, 46, y, w, 1, "#6a5442"); R(c, 46, y, 1, 1, "#7d6550"); }
    HOLDS.forEach(([x, y, t]) => { const h = HC[t]; R(c, x, y, 3, 2, h[0]); R(c, x, y, 1, 1, h[1]); R(c, x + 1, y + 2, 2, 1, h[2]); });
    R(c, 0, 36, W, 4, "#2b4f86"); R(c, 0, 36, W, 1, "#4a7bc0"); R(c, 0, 39, W, 1, "#1d3a63");
    const L = 170, p = f % L; let x, y, fl = 0;
    if (p < 120) { y = 24 - p / 120 * 23; x = 26 + Math.sin(p / 18) * 3; fl = Math.floor(p / 14) % 2; }
    else if (p < 130) { const t = (p - 120) / 10; y = 1 + 24 * t * t; x = 26; } else { y = p < 134 ? 26 : 25; x = 26; }
    if (p >= 130 && p < 138) { const k = p - 130; R(c, x - 1 - k, 35, 3, 1, "rgba(242,239,230,.55)"); R(c, x + 8 + k, 35, 3, 1, "rgba(242,239,230,.55)"); }
    spr(c, CLIMBER, x, y, fl);
    if (p < 120 && (p % 14 < 4 || hov)) for (let i = 0; i < (hov ? 6 : 3); i++) R(c, x + (fl ? 1 : 7) + Math.sin(f + i*2) * 2, y - 1 - i*.7, 1, 1, "rgba(255,255,255,.75)");
    if (p >= 136 && p < 165) txt(c, "again", 22, 9, "#FDB515");
  }

  /* ---- the gym: bench press with a rep counter ---- */
  function gym(c, f, hov) {
    R(c, 0, 0, W, 30, "#16243c"); R(c, 0, 4, W, 14, "#1f3354"); R(c, 0, 4, W, 1, "#2f4a74");
    for (let x = 2; x < W; x += 9) R(c, x, 5, 1, 12, "#2a4166");
    R(c, 0, 30, W, 10, "#20202a"); for (let x = 0; x < W; x += 8) R(c, x, 30, 1, 10, "#18181f"); R(c, 0, 30, W, 1, "#34343f");
    // rack uprights + hooks
    [14, 44].forEach(x => { R(c, x, 6, 2, 25, "#4a4f6a"); R(c, x, 6, 1, 25, "#6a7090"); R(c, x - 1, 30, 4, 1, "#33364a"); R(c, x + 2, 11, 2, 1, "#8a8fa6"); });
    // bench
    R(c, 18, 25, 26, 2, "#3a1218"); R(c, 18, 25, 26, 1, "#5a1e28"); R(c, 22, 27, 2, 4, "#555a6e"); R(c, 38, 27, 2, 4, "#555a6e");
    const speed = hov ? 2 : 1, cyc = 36, t = (f * speed) % cyc, k = (1 - Math.cos(t / cyc * Math.PI * 2)) / 2;
    const barY = Math.round(11 + k * 8); // 11 = locked out, 19 = chest
    // lifter lying on the bench, head at left
    R(c, 18, 21, 4, 4, "#e8b48a"); R(c, 18, 21, 4, 1, "#2a1a12"); R(c, 18, 22, 1, 2, "#2a1a12"); R(c, 21, 23, 1, 1, "#c98d63");
    R(c, 22, 22, 12, 3, "#3b7dd8"); R(c, 22, 22, 12, 1, "#5a95e6"); R(c, 22, 24, 12, 1, "#2a5aa0");
    R(c, 34, 22, 6, 3, "#2b2b3a"); R(c, 39, 25, 2, 6, "#2b2b3a"); R(c, 39, 30, 3, 1, "#f2efe6");
    R(c, 25, barY + 1, 2, 21 - barY, "#e8b48a"); R(c, 26, barY + 1, 1, 21 - barY, "#c98d63");
    // bar + gold plates
    R(c, 8, barY, 48, 1, "#c0c6d0");
    [[9,"#FDB515"],[12,"#FDB515"],[50,"#FDB515"],[53,"#FDB515"]].forEach(([x, col]) => { R(c, x, barY - 4, 2, 9, col); R(c, x, barY - 4, 1, 9, "#ffe08a"); R(c, x + 1, barY + 3, 1, 2, "#a8770a"); });
    R(c, 14, barY - 1, 1, 3, "#33364a"); R(c, 49, barY - 1, 1, 3, "#33364a");
    const reps = Math.floor(f * speed / cyc) % 10 + 1;
    txt(c, "x" + reps, 52, 38, "#FDB515");
    if (hov && t > cyc/2 - 4 && t < cyc/2 + 4) txt(c, "PR!", 26, 8, "#FDB515");
  }

  /* ---- golf: Franklin Canyon, tee shot to the green ---- */
  function golf(c, f, hov) {
    R(c, 0, 0, W, 30, "#bfe0ff");
    [["#9fd0ff",10],["#bfe0ff",8]].reduce((y, [col, h]) => { R(c, 0, y, W, h, col); return y + h; }, 0);
    R(c, 50, 4, 5, 5, "#fff6c8"); R(c, 51, 3, 3, 1, "#fff6c8"); R(c, 51, 9, 3, 1, "#fff6c8");
    for (let x = 0; x < W; x++) { const h = Math.round(9 + Math.sin(x/9) * 3 + Math.sin(x/4) * 1); R(c, x, 26 - h, 1, h, "#5c8a4a"); R(c, x, 26 - h, 1, 1, "#78a862"); }
    for (let x = 0; x < W; x++) { const h = Math.round(5 + Math.sin((x+20)/7) * 2); R(c, x, 28 - h, 1, h, "#3f6e38"); }
    [[6,18],[14,16],[58,17]].forEach(([x, y]) => { R(c, x - 2, y - 4, 5, 4, "#2c5a2c"); R(c, x - 1, y - 5, 3, 1, "#2c5a2c"); R(c, x - 2, y - 4, 1, 1, "#4a8a44"); R(c, x, y, 1, 3, "#5a3a24"); });
    R(c, 0, 28, W, 12, "#4f9a44"); for (let x = 0; x < W; x += 6) R(c, x, 28, 3, 12, "#58a64c");
    R(c, 38, 30, 22, 4, "#6cc25c"); R(c, 40, 29, 18, 1, "#6cc25c");
    R(c, 52, 31, 2, 1, "#14240f"); R(c, 52, 18, 1, 13, "#e9e4d4");
    const wave = Math.floor(f / 6) % 2; R(c, 53, 18, 5, 2, "#C4132A"); R(c, 53 + 5, 18 + wave, 1, 1, "#C4132A"); R(c, 53, 20, 4, 1, "#8a0e1e");
    // golfer: address -> backswing -> strike -> follow-through, ball into the cup
    const L = 120, p = (f * (hov ? 2 : 1)) % L, ease = t => t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t);
    spr(c, STAND, 8, 23, false, { j: "#f2efe6", k: "#1d3a63" });
    let th = 0;
    if (p < 20) th = 0; else if (p < 34) th = 2.5 * ease((p - 20) / 14);
    else if (p < 38) th = 2.5 - 2.7 * ((p - 34) / 4); else if (p < 46) th = -0.2 - 2.2 * ease((p - 38) / 8);
    else if (p < 108) th = -2.4; else th = -2.4 * (1 - ease((p - 108) / 12));
    const hx = 12, hy = 30;
    for (let r = 1; r <= 7; r++) R(c, hx - Math.sin(th) * r, hy + Math.cos(th) * r, 1, 1, r === 7 ? "#e9e4d4" : "#9aa3b2");
    R(c, 17, 36, 1, 1, "#e9e4d4"); // tee
    let bx = 17, by = 35, show = true;
    if (p >= 37 && p < 72) { const t = (p - 37) / 35; bx = 17 + 31 * t; by = 35 + (31 - 35) * t - Math.sin(Math.PI * t) * 24; R(c, bx, 35 - 4 * t, 2, 1, "rgba(0,0,0,.2)"); }
    else if (p >= 72 && p < 90) { bx = 48 + 4 * ease((p - 72) / 18); by = 30; }
    else if (p >= 90) show = false;
    if (show) R(c, bx, by, 2, 1, "#ffffff");
    if (p >= 90 && p < 116) txt(c, "birdie", 20, 9, "#C4132A");
  }

  /* ---- volleyball: approach, jump, spike over the net ---- */
  function volley(c, f, hov) {
    R(c, 0, 0, W, 28, "#1b2f52"); for (let x = 0; x < W; x += 16) { R(c, x + 4, 3, 8, 4, "#fff4c0"); R(c, x + 4, 7, 8, 1, "#c9b97a"); }
    R(c, 0, 18, W, 10, "#22395f"); R(c, 0, 18, W, 1, "#2f4a74");
    R(c, 0, 28, W, 12, "#c48a4e"); for (let x = 0; x < W; x += 7) R(c, x, 28, 1, 12, "#a8743e"); R(c, 0, 28, W, 1, "#dca46a"); R(c, 0, 34, W, 1, "#FDB515");
    R(c, 40, 12, 1, 22, "#9aa3b2"); R(c, 40, 12, 1, 1, "#e9e4d4");
    for (let y = 13; y < 21; y += 2) R(c, 41, y, 16, 1, "rgba(233,228,212,.45)");
    for (let x = 41; x < 57; x += 2) R(c, x, 13, 1, 8, "rgba(233,228,212,.35)"); R(c, 41, 12, 16, 1, "#e9e4d4");
    const L = 96, p = (f * (hov ? 2 : 1)) % L;
    let px = 14, py = 21, reach = false;
    if (p < 22) px = 14 + Math.max(0, p - 10) / 12 * 8;
    else if (p < 40) { const t = (p - 22) / 18; py = 21 - Math.sin(Math.PI * t) * 10; px = 22 + 4 * t; reach = p >= 25 && p < 36; }
    else px = 26 - Math.min(1, (p - 40) / 50) * 12;
    R(c, Math.round(px) + 1, 35, 7, 1, "rgba(0,0,0,.25)");
    spr(c, reach ? REACH : STAND, px, py, false, { j: "#3b7dd8" });
    let bx, by, show = true;
    if (p < 30) { const t = p / 30; bx = 4 + 25 * t; by = 24 + (8 - 24) * t - Math.sin(Math.PI * t) * 10; }
    else if (p < 42) { const t = (p - 30) / 12; bx = 29 + 24 * t; by = 8 + 26 * t; }
    else if (p < 62) { const t = (p - 42) / 20; bx = 53 + t * 8; by = 34 - Math.abs(Math.sin(t * Math.PI * 2)) * 5 * (1 - t); }
    else show = false;
    if (show) { R(c, bx, by, 3, 3, "#f2efe6"); R(c, bx + 1, by, 1, 3, "#FDB515"); R(c, bx, by + 1, 3, 1, "#3b7dd8"); }
    if (p >= 30 && p < 36) for (let i = 1; i <= 3; i++) R(c, bx - i * 2, by - i, 2, 1, `rgba(255,255,255,${.7 - i * .18})`);
    if (p >= 44 && p < 72) txt(c, "kill", 44, 9, "#FDB515");
  }

  /* ---- fashion: fit check in the mirror, rack swaying ---- */
  const FITS = [["#24324f","#1b1b26"],["#7a1e2c","#2b2b3a"],["#c8b48a","#3a3328"],["#2a2a2a","#4a5d78"],["#e9e4d4","#1d3a63"]];
  function fashion(c, f, hov) {
    R(c, 0, 0, W, 32, "#2a2235"); for (let y = 0; y < 32; y += 4) R(c, 0, y, W, 1, "#30283d");
    R(c, 0, 32, W, 8, "#3d3346"); R(c, 0, 32, W, 1, "#54475f");
    // rack
    R(c, 3, 6, 30, 1, "#c0c6d0"); R(c, 3, 6, 1, 26, "#9aa3b2"); R(c, 32, 6, 1, 26, "#9aa3b2");
    ["#7a1e2c","#24324f","#c8b48a","#3a3a3a","#4a5d78"].forEach((col, i) => {
      const sw = Math.round(Math.sin(f / 10 + i) * (hov ? 1.5 : .6)); const x = 6 + i * 5 + sw;
      R(c, x + 1, 7, 1, 2, "#9aa3b2"); R(c, x - 1, 9, 5, 1, "#9aa3b2"); R(c, x - 1, 10, 5, 10 + (i % 2) * 3, col); R(c, x - 1, 10, 1, 10 + (i % 2) * 3, "rgba(255,255,255,.18)");
    });
    // mirror with gold frame
    R(c, 40, 3, 20, 30, "#FDB515"); R(c, 41, 4, 18, 28, "#a8770a"); R(c, 42, 5, 16, 26, "#6c7fa0"); R(c, 42, 5, 16, 1, "#8a9cc0");
    R(c, 44, 7, 1, 6, "rgba(255,255,255,.4)"); R(c, 45, 6, 1, 3, "rgba(255,255,255,.4)");
    const fit = FITS[Math.floor(f / (hov ? 12 : 30)) % FITS.length];
    spr(c, STAND, 46, 15, true, { j: fit[0], k: fit[1] });
    spr(c, STAND, 34, 19, false, { j: fit[0], k: fit[1] });
    // shopping bag
    R(c, 22, 30, 7, 6, "#e9e4d4"); R(c, 22, 30, 7, 1, "#ffffff"); R(c, 28, 30, 1, 6, "#bdb7a6"); R(c, 24, 28, 1, 2, "#2a2235"); R(c, 26, 28, 1, 2, "#2a2235"); R(c, 24, 28, 3, 1, "#2a2235");
    if (Math.floor(f / 30) % 2) { const sx = 56 + (f % 3 === 0 ? 1 : 0); R(c, sx, 8, 1, 3, "#fff"); R(c, sx - 1, 9, 3, 1, "#fff"); }
    txt(c, "fit check", 2, 6, "#C9A2FF");
  }

  /* ---- cafes: a latte at Mind Coffee, Campanile in the window ---- */
  function cafe(c, f, hov) {
    R(c, 0, 0, W, H, "#2a1c14"); R(c, 3, 1, 58, 25, "#5a3a24"); R(c, 5, 3, 54, 21, "#13294a"); R(c, 5, 16, 54, 8, "#1d3a63");
    [[9,5],[20,8],[38,4],[54,7]].forEach(([x, y], i) => { if ((f >> 4) % 4 !== i) R(c, x, y, 1, 1, "#e9e4d4"); });
    [[6,8],[13,10],[20,7],[27,9],[49,8],[55,6]].forEach(([x, w]) => { R(c, x, 24 - w, 6, w, "#0f1e36"); if (((x + f) >> 5) % 3) R(c, x + 2, 24 - w + 2, 1, 1, "#FDB515"); });
    R(c, 41, 6, 4, 18, "#0b1b33"); R(c, 42, 3, 2, 3, "#0b1b33"); R(c, 42, 1, 1, 2, "#0b1b33"); R(c, 42, 8, 2, 2, "#FDB515");
    R(c, 32, 3, 1, 21, "#5a3a24"); R(c, 5, 13, 54, 1, "#5a3a24"); R(c, 3, 26, 58, 2, "#3d2718");
    R(c, 0, 29, W, 11, "#7a4e2e"); R(c, 0, 29, W, 1, "#9a6a40"); [33, 37].forEach(y => R(c, 0, y, W, 1, "#5e3a20"));
    R(c, 19, 35, 26, 2, "#d8d2c4"); R(c, 21, 37, 22, 1, "#a9a294");
    R(c, 23, 22, 18, 1, "#d8d2c4"); R(c, 24, 23, 16, 2, "#6b3e26"); R(c, 25, 23, 14, 1, "#a8703f");
    [[30,23],[33,23],[31,24],[32,24]].forEach(([x, y]) => R(c, x, y, 1, 1, "#f0dcc0"));
    for (let y = 25; y < 35; y++) { const ins = y > 33 ? y - 33 : 0; R(c, 23 + ins, y, 18 - ins*2, 1, "#f2efe6"); R(c, 37 - ins, y, 4 - ins, 1, "#cfc8b8"); R(c, 24 + ins, y, 1, 1, "#ffffff"); }
    R(c, 41, 26, 3, 1, "#e6e0d2"); R(c, 43, 27, 1, 5, "#e6e0d2"); R(c, 41, 32, 3, 1, "#e6e0d2");
    const n = hov ? 5 : 3; for (let w = 0; w < n; w++) for (let k = 0; k < 7; k++) { const t = (f / 4 + k*2 + w*5) % 16; R(c, 26 + w*3 + Math.round(Math.sin(t/3 + w) * 1.5), 20 - t, 1, 1, `rgba(230,230,240,${(.6 - t/30).toFixed(2)})`); }
  }

  /* ---- dream car: burgundy performance coupe at sunset ---- */
  /* F1: an open-wheel car in racing red (Daniel's a Ferrari fan) with a Berkeley gold stripe, lapping past the grandstand.
     Built from spans with an automatic outline; wheels spin, DRS opens on hover. */
  const F1PAL = { o:"#0b0b0f", L:"#ff4a3a", b:"#d40000", d:"#8a0000", g:"#FDB515", G:"#ffe08a", k:"#1a1a20", K:"#2c2c34", w:"#f2efe6", v:"#2a3550", h:"#e9e4d4" };
  const FW = 58, FH = 13, F1WHEELS = [[11, 8, 5], [45, 9, 4]];
  function buildF1(drs) {
    const grid = Array.from({ length: FH }, () => Array(FW).fill(""));
    const span = (y, a, b, ch) => { for (let x = Math.max(0, a); x <= Math.min(FW - 1, b); x++) grid[y][x] = ch; };
    const spans = (list, ch) => list.forEach(([y, a, b]) => span(y, a, b, ch));
    // rear wing: endplate, main plane, DRS flap (lifts when open), pylon
    spans([[0,0,2],[1,0,2],[2,0,2],[3,0,2],[4,0,2],[5,0,2],[6,1,2]], "K");
    spans([[1,3,9],[2,3,9]], "k"); span(drs ? 0 : 3, 3, 9, drs ? "g" : "k");
    spans([[4,6,7],[5,6,7]], "K");
    // engine cover rising to the airbox / roll hoop
    spans([[2,23,26],[3,20,27],[4,15,28],[5,10,30],[6,6,34]], "b");
    // sidepod + nose sloping down to the front wing
    spans([[7,5,40],[8,5,46],[9,6,51],[10,8,54]], "b");
    // floor / plank and front wing with endplate
    span(11, 8, 44, "k"); spans([[10,47,57],[11,46,57]], "k"); spans([[7,56,57],[8,56,57],[9,56,57]], "K");
    // shading
    for (let y = 0; y < FH; y++) for (let x = 0; x < FW; x++) if (grid[y][x] === "b") {
      if (y <= 3 || (y === 4 && x < 24) || (y === 5 && x < 18) || (y === 6 && x > 30) || (y === 7 && x > 36)) grid[y][x] = "L";
      else if (y >= 9) grid[y][x] = "d"; }
    // gold livery stripe + nose tip, number on the engine cover
    span(8, 10, 44, "g"); span(8, 26, 27, "G"); span(9, 50, 51, "g"); span(10, 52, 54, "g");
    span(4, 18, 19, "g"); span(5, 18, 19, "g");
    // cockpit: driver helmet with visor, halo over the top
    spans([[4,30,32],[5,30,32]], "g"); grid[4][32] = "v"; grid[5][32] = "v"; grid[4][30] = "G";
    span(3, 29, 34, "K"); grid[4][34] = "K"; grid[5][35] = "K";
    // sidepod inlet
    spans([[7,37,38],[8,38,39]], "k");
    const out = grid.map(r => r.slice());
    for (let y = 0; y < FH; y++) for (let x = 0; x < FW; x++) if (grid[y][x] && !"kK".includes(grid[y][x]))
      if ([[1,0],[-1,0],[0,1],[0,-1]].some(([dx, dy]) => !(grid[y + dy] || [])[x + dx])) out[y][x] = "o";
    const cv = document.createElement("canvas"); cv.width = FW; cv.height = FH; const c = cv.getContext("2d");
    out.forEach((r, y) => r.forEach((ch, x) => { if (ch) R(c, x, y, 1, 1, F1PAL[ch]); }));
    return cv;
  }
  const F1 = buildF1(false), F1DRS = buildF1(true);
  function f1wheel(c, cx, cy, r, ang) {
    const r2 = r * r + 1;
    for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) { const d = x*x + y*y;
      if (d <= r2) R(c, cx + x, cy + y, 1, 1, d <= (r - 2) * (r - 2) + 1 ? "#2c2c34" : d <= (r - 1) * (r - 1) ? "#16161a" : "#0b0b0f"); }
    // sidewall stripe that rotates, so the spin reads at speed
    for (let k = 0; k < 3; k++) { const a = ang + k * Math.PI * 2 / 3;
      R(c, cx + Math.round(Math.cos(a) * (r - 1)), cy + Math.round(Math.sin(a) * (r - 1)), 1, 1, "#FDB515"); }
    R(c, cx - 1, cy - r + 1, 2, 1, "#3a3a44"); R(c, cx, cy, 1, 1, "#9aa3b2");
  }
  let lap = 0;
  function car(c, f, hov) {
    const sp = hov ? 3 : 1.5; lap += sp;
    // sky + grandstand with a flickering crowd
    R(c, 0, 0, W, 8, "#7fb6e8"); R(c, 0, 0, W, 3, "#6aa6dc");
    R(c, 0, 8, W, 10, "#2c3550"); R(c, 0, 8, W, 1, "#4a5578"); R(c, 0, 7, W, 1, "#c0c6d0");
    const CROWD = ["#e0453a","#FDB515","#f2efe6","#3b7dd8","#7BE08A","#C9A2FF"];
    for (let y = 10; y < 17; y += 2) for (let x = 0; x < W; x += 2) {
      const sx = ((x + Math.floor(lap * .2)) % W + W) % W, n = (sx * 7 + y * 13) % 6;
      if ((sx * 3 + y) % 5) R(c, x, y - ((f + sx * 5 + y) % 23 === 0 ? 1 : 0), 1, 1, CROWD[n]); }
    // barrier with gold boards, kerb, light asphalt so the carbon parts read
    R(c, 0, 18, W, 2, "#1d3a63"); for (let x = -((lap * .2) % 16); x < W; x += 16) R(c, x + 6, 18, 4, 2, "#FDB515");
    for (let x = -((lap * 2) % 8); x < W; x += 8) { R(c, x, 20, 4, 2, "#e0453a"); R(c, x + 4, 20, 4, 2, "#f2efe6"); }
    R(c, 0, 22, W, 18, "#5a5e6a"); R(c, 0, 22, W, 1, "#6c707c");
    for (let i = 0; i < 5; i++) R(c, ((i * 17 - lap * 3) % 85 + 85) % 85 - 10, 38, 8, 1, "#f2efe6");
    // speed lines + car
    for (let i = 0; i < 4; i++) R(c, ((50 - lap * 4 + i * 19) % 72 + 72) % 72 - 8, 25 + i * 3, 4 + (hov ? 6 : 2), 1, "rgba(255,255,255,.3)");
    const x = 3, y = 22;
    R(c, x + 4, 35, FW - 8, 1, "rgba(0,0,0,.45)");
    c.drawImage(hov ? F1DRS : F1, x, y);
    F1WHEELS.forEach(([wx, wy, r]) => f1wheel(c, x + wx, y + wy, r, lap * .5));
    if (hov) { for (let i = 0; i < 4; i++) if ((f + i) % 2) R(c, x + 12 + ((f * 7 + i * 9) % 30), y + 12 + (i % 2), 1, 1, i % 2 ? "#FDB515" : "#ff8a3d");
      txt(c, "drs", 2, 6, "#1d3a63"); }
    else if ((Math.floor(lap / 90)) % 2 === 0 && (lap % 90) < 30) txt(c, "box box", 2, 6, "#1d3a63");
  }

  window.HOBBY_SCENES = { climb, gym, golf, volley, fashion, cafe, car, W, H };
})();
