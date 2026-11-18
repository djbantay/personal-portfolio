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
  const GL = {A:"010101111101101",B:"110101110101110",C:"011100100100011",D:"110101101101110",E:"111100110100111",F:"111100110100100",G:"011100101101011",H:"101101111101101",I:"111010010010111",K:"101101110101101",L:"100100100100111",N:"110101101101101",P:"110101110100100",R:"110101110101101",T:"111010010010010",X:"101101010101101",O:"111101101101111",S:"011100010001110",Z:"111001010100111",M:"101111111101101",W:"101101111111101",Y:"101101010010010",U:"101101101101111",V:"101101101101010",",":"000000000010100","?":"110001010000010",".":"000000000000010","'":"010010000000000","!":"010010010000010",
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

  /* ---- desk: Daniel at his desk, late night in Berkeley. The hero illustration. ---- */
  const DP = { h:"#15171d", H:"#2e3240", s:"#be9880", S:"#9e7c69", e:"#a8846f", g:"#0b0b0f", G:"#36b571", m:"#7a5446" };
  const HEAD = ["...hhhhh....","..hhhHhhhh..",".hhhhhhhhhh.","hhhhhhhhhhhh","hhhhhhhsssh.","hhhhhssgggg.","hhhehssgGGg.","hhheesssssss",".hhSssssss..","..Sssssmms..","...Sssssss..","....SSss...."];
  const BLINK = HEAD.map((r, i) => i === 6 ? r.replace(/G/g, "g") : r);
  const sprP = (c, rows, x, y, pal) => rows.forEach((r, j) => [...r].forEach((ch, i) => { if (pal[ch]) R(c, x + i, y + j, 1, 1, pal[ch]); }));
  const CODE = ["#FDB515","#6FB7F0","#7BE08A","#C9A2FF","#e9e4d4","#FF8FB8"];
  function desk(c, f, hov) {
    const DW = 112;
    // wall + floor
    R(c, 0, 0, DW, 66, "#0f2340"); for (let x = 0; x < DW; x += 14) R(c, x, 0, 1, 66, "#13294a");
    R(c, 0, 66, DW, 6, "#16243c"); R(c, 0, 66, DW, 1, "#2c4a73");
    // window: night sky, stars, the Campanile
    R(c, 4, 5, 28, 26, "#3a2a1c"); R(c, 5, 6, 26, 24, "#0b1b33"); R(c, 5, 22, 26, 8, "#13294a");
    [[8,9],[14,7],[26,10],[22,14],[10,15]].forEach(([x, y], k) => { if ((f >> 4) % 5 !== k) R(c, x, y, 1, 1, "#e9e4d4"); });
    R(c, 25, 8, 3, 3, "#f6e9b0"); R(c, 26, 8, 2, 1, "#0b1b33");
    R(c, 15, 12, 4, 18, "#06111f"); R(c, 16, 9, 2, 3, "#06111f"); R(c, 16, 7, 1, 2, "#06111f"); R(c, 16, 14, 2, 2, "#FDB515");
    [[6,6],[10,9],[22,5],[26,7]].forEach(([x, w]) => R(c, x, 30 - w, 4, w, "#081628"));
    R(c, 18, 6, 1, 24, "#3a2a1c"); R(c, 5, 18, 26, 1, "#3a2a1c"); R(c, 3, 31, 30, 2, "#4a3624");
    // shelf with tiny hobby trophies: F1 car, volleyball, golf ball, plant, books
    R(c, 58, 12, 44, 2, "#5a3a24"); R(c, 58, 12, 44, 1, "#7a5232");
    R(c, 60, 10, 8, 2, "#d40000"); R(c, 62, 9, 3, 1, "#d40000"); R(c, 60, 11, 2, 1, "#111"); R(c, 66, 11, 2, 1, "#111"); R(c, 59, 9, 1, 2, "#111");
    R(c, 71, 8, 4, 4, "#f2efe6"); R(c, 72, 8, 1, 4, "#FDB515"); R(c, 71, 10, 4, 1, "#3b7dd8");
    R(c, 78, 10, 2, 2, "#ffffff"); R(c, 78, 12, 2, 0, "#fff");
    [[83,"#3b7dd8"],[85,"#FDB515"],[87,"#7a1e2c"],[89,"#e9e4d4"]].forEach(([x, col]) => R(c, x, 6, 2, 6, col));
    R(c, 94, 9, 5, 3, "#8a5a3c"); R(c, 93, 5, 2, 4, "#4f8a52"); R(c, 96, 4, 2, 5, "#7ab07c"); R(c, 98, 6, 2, 3, "#4f8a52");
    // monitor glow washing over the scene
    c.fillStyle = "rgba(90,220,150,.07)"; c.beginPath(); c.moveTo(76, 22); c.lineTo(40, 18); c.lineTo(40, 48); c.lineTo(76, 42); c.fill();
    // chair (racing red, naturally)
    R(c, 28, 26, 7, 25, "#5a1e28"); R(c, 28, 26, 2, 25, "#7a2a36"); R(c, 29, 24, 5, 2, "#5a1e28");
    R(c, 30, 50, 24, 3, "#3a1218"); R(c, 30, 50, 24, 1, "#5a1e28"); R(c, 40, 53, 3, 10, "#2c2c34"); R(c, 33, 63, 17, 1, "#2c2c34");
    [[33],[41],[49]].forEach(([x]) => R(c, x, 64, 2, 2, "#111"));
    // desk
    R(c, 56, 49, 56, 3, "#7a4e2e"); R(c, 56, 49, 56, 1, "#9a6a40"); R(c, 58, 52, 3, 14, "#5e3a20"); R(c, 106, 52, 3, 14, "#5e3a20");
    // monitor with scrolling code
    R(c, 74, 18, 32, 26, "#1b1d25"); R(c, 74, 18, 32, 1, "#2e3240"); R(c, 76, 20, 28, 21, "#06111f");
    const pass = (f % 160) > 136, scroll = Math.floor(f / 5);
    for (let i = 0; i < 9; i++) { const n = scroll + i, h = (n * 2654435761) >>> 0;
      const ind = (h >> 3) % 3 * 2, len = 6 + (h >> 7) % 16; R(c, 78 + ind, 21 + i * 2, Math.min(len, 24 - ind), 1, CODE[(h >> 11) % CODE.length]);
      if ((h >> 15) % 3 === 0) R(c, 78 + ind + len + 2, 21 + i * 2, Math.min(5, 20 - ind - len), 1, "#4a5578"); }
    if ((f >> 3) % 2) R(c, 78, 39, 2, 1, "#e9e4d4");
    if (pass) { R(c, 80, 26, 20, 9, "#0d3a22"); R(c, 80, 26, 20, 1, "#7BE08A"); txt(c, "PASS", 84, 33, "#7BE08A"); }
    R(c, 88, 44, 4, 5, "#1b1d25"); R(c, 83, 48, 14, 1, "#2e3240");
    // keyboard + a key lighting up as he types
    R(c, 60, 47, 14, 2, "#3a3d48"); R(c, 60, 47, 14, 1, "#4a4f6a");
    if (!hov) R(c, 61 + ((f * 7) % 12), 47, 1, 1, "#FDB515");
    // Mind Coffee mug + steam
    R(c, 100, 42, 6, 7, "#f2efe6"); R(c, 100, 42, 6, 1, "#d8d2c4"); R(c, 101, 43, 4, 1, "#6b3e26"); R(c, 106, 44, 2, 1, "#e6e0d2"); R(c, 107, 45, 1, 2, "#e6e0d2"); R(c, 106, 47, 2, 1, "#e6e0d2");
    R(c, 102, 45, 2, 2, "#FDB515");
    for (let k = 0; k < 5; k++) { const t = (f / 3 + k * 3) % 12; R(c, 102 + Math.round(Math.sin(t / 2 + k) * 1.2), 40 - t, 1, 1, `rgba(230,230,240,${(.55 - t / 24).toFixed(2)})`); }
    // Daniel: breathing bob, hoodie, pants, sneakers
    const by = (f >> 4) % 3 === 0 ? 1 : 0;
    R(c, 44, 30 + by, 4, 3, "#9e7c69");                                    // neck
    R(c, 35, 32 + by, 15, 16 - by, "#1b1d25"); R(c, 35, 32 + by, 2, 16 - by, "#262a35");   // torso
    R(c, 36, 30 + by, 7, 4, "#15171d");                                    // hood bunched behind neck
    R(c, 49, 34 + by, 1, 12, "#24493a");                                   // monitor light on the hoodie
    R(c, 47, 35 + by, 1, 4, "#787a80"); R(c, 48, 35 + by, 1, 3, "#787a80"); // drawstrings
    R(c, 38, 47, 20, 4, "#2b2b3a"); R(c, 38, 47, 20, 1, "#3a3a4c");        // thighs under the desk
    R(c, 54, 50, 4, 14, "#2b2b3a"); R(c, 54, 63, 7, 3, "#f2efe6"); R(c, 54, 65, 7, 1, "#bdb7a6"); // shin + sneaker
    sprP(c, (f % 70) < 2 ? BLINK : HEAD, 38, 19 + by, DP);
    if (hov) {
      // wave at the viewer
      const w = (f >> 1) % 2;
      R(c, 46, 33 + by, 4, 3, "#1b1d25"); R(c, 50, 25 + by, 3, 10, "#1b1d25"); R(c, 52, 25 + by, 1, 10, "#24493a");
      R(c, 50 + w, 20 + by, 3, 5, "#be9880"); R(c, 50 + w, 19 + by, 1, 2, "#be9880"); R(c, 52 + w, 19 + by, 1, 1, "#be9880"); R(c, 53 + w, 21 + by, 1, 2, "#be9880");
      R(c, 54, 6, 38, 10, "#f2efe6"); R(c, 54, 6, 38, 1, "#ffffff"); R(c, 55, 16, 3, 1, "#f2efe6"); R(c, 55, 17, 1, 1, "#f2efe6");
      txt(c, "HI THERE!", 57, 13, "#003262");
    } else {
      // typing: forearm to the keyboard, hand tapping
      const t = (f >> 1) % 2;
      R(c, 45, 34 + by, 4, 7, "#1b1d25"); R(c, 47, 40, 4, 4, "#1b1d25"); R(c, 50, 43, 9, 3, "#1b1d25"); R(c, 50, 43, 9, 1, "#262a35");
      R(c, 59, 44 + t, 3, 2, "#be9880"); R(c, 61, 45 - t, 2, 1, "#9e7c69");
    }
  }
  desk.size = [112, 72];

  /* ---- bear: an original pixel bear (gold headphones, navy hoodie) coding at the desk.
     Hero of recruiter mode; walker + sleeper variants guide the page and close it out. ---- */
  const BP = { k:"#24140a", B:"#8a5a34", L:"#b07c4e", D:"#66401f", i:"#c98a64", M:"#e6c7a0", m:"#c9a47a", n:"#1a0f08", e:"#0b0b0f", w:"#ffffff", p:"#e08f80", h:"#1b1d25", g:"#FDB515", o:"#1b2a45", O:"#24365a", d:"#9aa3b2", G:"#2f6a55" };
  function gridSprite(W, H, draw, noOutline = "hg") {
    const g = Array.from({ length: H }, () => Array(W).fill(""));
    const set = (x, y, ch) => { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < W && y < H) g[y][x] = ch; };
    const api = { g, set,
      disc: (cx, cy, r, ch) => { for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x*x + y*y <= r*r + r*.6) set(cx + x, cy + y, ch); },
      ell: (cx, cy, rx, ry, ch) => { for (let y = -ry; y <= ry; y++) for (let x = -rx; x <= rx; x++) if ((x*x)/(rx*rx) + (y*y)/(ry*ry) <= 1.05) set(cx + x, cy + y, ch); },
      rect: (x, y, w, h, ch) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) set(x + i, y + j, ch); },
      shade: (cx, cy, lo = -6, hi = 6) => { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (g[y][x] === "B") { const d = (x - cx) + (y - cy); if (d < lo) g[y][x] = "L"; else if (d > hi) g[y][x] = "D"; } } };
    draw(api);
    const out = g.map(r => r.slice());
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (g[y][x] && !noOutline.includes(g[y][x]) && [[1,0],[-1,0],[0,1],[0,-1]].some(([a, b]) => !(g[y + b] || [])[x + a])) out[y][x] = "k";
    const cv = document.createElement("canvas"); cv.width = W; cv.height = H; const c = cv.getContext("2d");
    out.forEach((r, y) => r.forEach((ch, x) => { if (ch && BP[ch]) R(c, x, y, 1, 1, BP[ch]); }));
    return cv;
  }
  const BEAR_SEATED = gridSprite(36, 34, ({ set, disc, ell, rect, shade }) => {
    rect(6, 19, 19, 15, "o"); ell(15, 19, 9, 3, "o"); rect(7, 17, 8, 3, "O"); rect(18, 23, 13, 4, "o");
    disc(9, 3, 3, "B"); disc(21, 3, 3, "B"); disc(9, 3, 1, "i"); disc(21, 3, 1, "i");
    disc(15, 10, 8, "B"); shade(15, 10);
    ell(18, 13, 4, 3, "M"); rect(16, 15, 5, 1, "m"); rect(19, 11, 2, 2, "n"); set(18, 15, "n"); set(19, 15, "n");
    rect(12, 8, 2, 2, "e"); set(12, 8, "w"); rect(19, 7, 2, 2, "e"); set(19, 7, "w");
    set(10, 12, "p"); set(11, 12, "p"); set(22, 12, "p");
    for (let a = 200; a <= 340; a += 4) { const r = Math.PI * a / 180; set(15 + Math.cos(r) * 9, 10 + Math.sin(r) * 9, "h"); }
    rect(5, 8, 3, 6, "h"); rect(6, 9, 1, 4, "g");
    set(13, 20, "d"); set(13, 21, "d"); set(16, 20, "d"); set(16, 21, "d"); set(16, 22, "d");
    for (let y = 18; y < 33; y++) set(24, y, "G");
    rect(31, 23, 4, 4, "B"); set(34, 23, "L");
  });
  const walkerFrame = (step) => gridSprite(22, 16, ({ set, disc, ell, rect, shade }) => {
    ell(9, 9, 7, 4, "o"); rect(4, 6, 6, 2, "O");
    disc(15, 2, 1, "B"); disc(20, 2, 1, "B"); disc(17, 7, 5, "B"); set(15, 2, "i"); set(20, 2, "i"); shade(17, 7, -3, 3);
    ell(20, 8, 2, 1, "M"); set(21, 7, "n"); set(18, 6, "e"); set(18, 5, "w");
    for (let x = 13; x <= 20; x++) set(x, 2, "h"); rect(12, 5, 2, 4, "h"); set(12, 6, "g");
    set(1, 8, "B");
    const a = step ? 0 : 1;
    rect(4 + a, 12, 2, 3, "D"); rect(8 - a, 12, 2, 3, "D"); rect(12 + a, 12, 2, 3, "D"); rect(15 - a, 12, 2, 3, "D");
  });
  const BEAR_WALK = [walkerFrame(0), walkerFrame(1)];
  const BEAR_SIT = gridSprite(18, 16, ({ set, disc, ell, rect, shade }) => {
    ell(9, 11, 6, 4, "o"); rect(6, 7, 6, 3, "O");
    disc(9, 5, 4, "B"); disc(6, 1, 1, "B"); disc(12, 1, 1, "B"); set(6, 1, "i"); set(12, 1, "i"); shade(9, 5, -3, 3);
    ell(11, 7, 2, 1, "M"); set(12, 6, "n"); set(8, 4, "e"); set(11, 4, "e");
    for (let x = 6; x <= 12; x++) set(x, 0, "h"); rect(4, 3, 2, 3, "h"); set(4, 4, "g");
    rect(10, 13, 3, 2, "B"); rect(3, 12, 3, 3, "B");
  });
  const BEAR_SLEEP = gridSprite(30, 16, ({ set, disc, ell, rect, shade }) => {
    rect(2, 9, 26, 5, "o"); rect(2, 9, 26, 1, "O");
    disc(15, 7, 6, "B"); disc(10, 2, 2, "B"); disc(20, 2, 2, "B"); set(10, 2, "i"); set(20, 2, "i"); shade(15, 7, -4, 4);
    ell(15, 10, 3, 2, "M"); rect(14, 9, 2, 1, "n");
    rect(11, 6, 2, 1, "n"); rect(17, 6, 2, 1, "n"); set(10, 8, "p"); set(20, 8, "p");
    for (let x = 9; x <= 21; x++) set(x, 0, "h"); rect(7, 4, 2, 4, "h"); set(7, 5, "g");
    rect(3, 11, 4, 3, "B"); rect(23, 11, 4, 3, "B");
  });

  function bearRoom(c, f) {
    R(c, 0, 0, 112, 66, "#0f2340"); for (let x = 0; x < 112; x += 14) R(c, x, 0, 1, 66, "#13294a");
    R(c, 0, 66, 112, 6, "#16243c"); R(c, 0, 66, 112, 1, "#2c4a73");
    R(c, 4, 5, 28, 26, "#3a2a1c"); R(c, 5, 6, 26, 24, "#0b1b33"); R(c, 5, 22, 26, 8, "#13294a");
    [[8,9],[14,7],[26,10],[22,14],[10,15]].forEach(([x, y], k) => { if ((f >> 4) % 5 !== k) R(c, x, y, 1, 1, "#e9e4d4"); });
    R(c, 25, 8, 3, 3, "#f6e9b0"); R(c, 26, 8, 2, 1, "#0b1b33");
    R(c, 15, 12, 4, 18, "#06111f"); R(c, 16, 9, 2, 3, "#06111f"); R(c, 16, 7, 1, 2, "#06111f"); R(c, 16, 14, 2, 2, "#FDB515");
    [[6,6],[10,9],[22,5],[26,7]].forEach(([x, w]) => R(c, x, 30 - w, 4, w, "#081628"));
    R(c, 18, 6, 1, 24, "#3a2a1c"); R(c, 5, 18, 26, 1, "#3a2a1c"); R(c, 3, 31, 30, 2, "#4a3624");
    R(c, 58, 12, 44, 2, "#5a3a24"); R(c, 58, 12, 44, 1, "#7a5232");
    R(c, 60, 10, 8, 2, "#d40000"); R(c, 62, 9, 3, 1, "#d40000"); R(c, 60, 11, 2, 1, "#111"); R(c, 66, 11, 2, 1, "#111");
    R(c, 71, 8, 4, 4, "#f2efe6"); R(c, 72, 8, 1, 4, "#FDB515"); R(c, 71, 10, 4, 1, "#3b7dd8"); R(c, 78, 10, 2, 2, "#ffffff");
    [[83,"#3b7dd8"],[85,"#FDB515"],[87,"#7a1e2c"],[89,"#e9e4d4"]].forEach(([x, col]) => R(c, x, 6, 2, 6, col));
    R(c, 94, 9, 5, 3, "#8a5a3c"); R(c, 93, 5, 2, 4, "#4f8a52"); R(c, 96, 4, 2, 5, "#7ab07c"); R(c, 98, 6, 2, 3, "#4f8a52");
    R(c, 26, 24, 7, 27, "#5a1e28"); R(c, 26, 24, 2, 27, "#7a2a36"); R(c, 28, 50, 26, 3, "#3a1218"); R(c, 28, 50, 26, 1, "#5a1e28");
    R(c, 40, 53, 3, 10, "#2c2c34"); R(c, 33, 63, 17, 1, "#2c2c34"); [33, 41, 49].forEach(x => R(c, x, 64, 2, 2, "#111"));
    R(c, 56, 49, 56, 3, "#7a4e2e"); R(c, 56, 49, 56, 1, "#9a6a40"); R(c, 58, 52, 3, 14, "#5e3a20"); R(c, 106, 52, 3, 14, "#5e3a20");
  }
  function bearMonitor(c, f, off) {
    R(c, 74, 18, 32, 26, "#1b1d25"); R(c, 74, 18, 32, 1, "#2e3240"); R(c, 76, 20, 28, 21, "#06111f");
    if (off) { R(c, 80 + (f >> 2) % 14, 28 + ((f >> 3) % 5), 10, 1, "#2c4a73"); }
    else { const sc = Math.floor(f / 5);
      for (let i = 0; i < 9; i++) { const h = ((sc + i) * 2654435761) >>> 0, ind = (h >> 3) % 3 * 2, len = 6 + (h >> 7) % 16;
        R(c, 78 + ind, 21 + i * 2, Math.min(len, 24 - ind), 1, CODE[(h >> 11) % CODE.length]); }
      if ((f >> 3) % 2) R(c, 78, 39, 2, 1, "#e9e4d4");
      if ((f % 160) > 136) { R(c, 80, 26, 20, 9, "#0d3a22"); R(c, 80, 26, 20, 1, "#7BE08A"); txt(c, "PASS", 84, 33, "#7BE08A"); } }
    R(c, 88, 44, 4, 5, "#1b1d25"); R(c, 83, 48, 14, 1, "#2e3240");
  }
  function bearMug(c, f) {
    R(c, 100, 42, 6, 7, "#f2efe6"); R(c, 101, 43, 4, 1, "#6b3e26"); R(c, 106, 44, 2, 1, "#e6e0d2"); R(c, 107, 45, 1, 2, "#e6e0d2"); R(c, 106, 47, 2, 1, "#e6e0d2"); R(c, 102, 45, 2, 2, "#FDB515");
    for (let k = 0; k < 5; k++) { const t = (f / 3 + k * 3) % 12; R(c, 102 + Math.round(Math.sin(t / 2 + k) * 1.2), 40 - t, 1, 1, `rgba(230,230,240,${(.55 - t / 24).toFixed(2)})`); }
  }
  function bear(c, f, hov) {
    bearRoom(c, f);
    c.fillStyle = "rgba(90,220,150,.07)"; c.beginPath(); c.moveTo(76, 22); c.lineTo(42, 14); c.lineTo(42, 50); c.lineTo(76, 42); c.fill();
    bearMonitor(c, f, false);
    R(c, 62, 47, 12, 2, "#3a3d48"); R(c, 62, 47, 12, 1, "#4a4f6a"); if (!hov) R(c, 63 + ((f * 7) % 10), 47, 1, 1, "#FDB515");
    bearMug(c, f);
    const by = (f >> 4) % 3 === 0 ? 1 : 0;
    R(c, 36, 47, 22, 4, "#1b2a45"); R(c, 54, 50, 4, 13, "#1b2a45"); R(c, 53, 62, 7, 3, "#66401f"); R(c, 53, 62, 7, 1, "#8a5a34");
    c.drawImage(BEAR_SEATED, 28, 15 + by);
    if ((f % 70) < 2) { R(c, 40, 23 + by, 2, 2, "#8a5a34"); R(c, 47, 22 + by, 2, 2, "#8a5a34"); R(c, 40, 24 + by, 2, 1, "#24140a"); R(c, 47, 23 + by, 2, 1, "#24140a"); }
    if (hov) { const w = (f >> 1) % 2;
      R(c, 46, 37 + by, 18, 6, "#0f2340"); R(c, 58, 47, 6, 2, "#3a3d48");
      R(c, 51, 32 + by, 5, 8, "#24140a"); R(c, 53, 24 + by, 5, 12, "#24140a"); R(c, 52, 33 + by, 3, 6, "#24365a"); R(c, 54, 25 + by, 3, 10, "#24365a"); R(c, 56, 25 + by, 1, 10, "#2f6a55");
      R(c, 54 + w, 19 + by, 5, 6, "#24140a"); R(c, 55 + w, 20 + by, 3, 4, "#8a5a34"); R(c, 55 + w, 20 + by, 3, 1, "#b07c4e"); R(c, 56 + w, 22 + by, 1, 1, "#c98a64");
      R(c, 58, 4, 42, 11, "#f2efe6"); R(c, 58, 4, 42, 1, "#ffffff"); R(c, 59, 15, 3, 2, "#f2efe6"); R(c, 59, 17, 1, 1, "#f2efe6");
      txt(c, "HI THERE!", 61, 12, "#003262"); }
    else { const t = (f >> 1) % 2; R(c, 59, 38 + t + by, 4, 3, "#8a5a34"); R(c, 59, 38 + t + by, 4, 1, "#b07c4e"); }
  }
  bear.size = [112, 72];
  function bearSleep(c, f, awake) {
    R(c, 0, 0, 48, 28, "rgba(0,0,0,0)"); c.clearRect(0, 0, 48, 28);
    R(c, 0, 22, 48, 3, "#7a4e2e"); R(c, 0, 22, 48, 1, "#9a6a40");
    R(c, 30, 6, 16, 14, "#1b1d25"); R(c, 31, 7, 14, 11, "#06111f"); R(c, 36, 20, 4, 2, "#1b1d25");
    if (awake) txt(c, "HI", 34, 15, "#7BE08A"); else R(c, 32 + (f >> 2) % 10, 10 + ((f >> 3) % 5), 4, 1, "#2c4a73");
    c.drawImage(BEAR_SLEEP, 1, awake ? 5 : 7);
    if (awake) { R(c, 12, 10, 2, 2, "#0b0b0f"); R(c, 18, 10, 2, 2, "#0b0b0f"); R(c, 12, 10, 1, 1, "#fff"); R(c, 18, 10, 1, 1, "#fff"); txt(c, "!", 24, 6, "#FDB515"); }
    else { const z = (f >> 3) % 4; for (let i = 0; i < z; i++) txt(c, "Z", 22 + i * 3, 6 - i * 2, "#FDB515"); }
  }
  window.BEAR = { walk: BEAR_WALK, sit: BEAR_SIT, seated: BEAR_SEATED, sleep: bearSleep };

  window.HOBBY_SCENES = { climb, gym, golf, volley, fashion, cafe, car, desk, bear, W, H };
})();
