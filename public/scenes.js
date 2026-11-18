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
  const GL = {A:"010101111101101",B:"110101110101110",C:"011100100100011",D:"110101101101110",E:"111100110100111",F:"111100110100100",G:"011100101101011",H:"101101111101101",I:"111010010010111",K:"101101110101101",L:"100100100100111",N:"110101101101101",P:"110101110100100",R:"110101110101101",T:"111010010010010",X:"101101010101101","!":"010010010000010",
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
    else if (p < 132) { y = 1 + (p - 120) * 2; x = 26; } else { y = 25; x = 26; }
    if (p >= 132 && p < 140) R(c, x - 2, y + 11, 14, 1, "rgba(242,239,230,.5)");
    spr(c, CLIMBER, x, y, fl);
    if (p < 120 && (p % 14 < 4 || hov)) for (let i = 0; i < (hov ? 6 : 3); i++) R(c, x + (fl ? 1 : 7) + Math.sin(f + i*2) * 2, y - 1 - i*.7, 1, 1, "rgba(255,255,255,.75)");
    if (p >= 132 && p < 165) txt(c, "again", 24, 8, "#FDB515");
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
    const speed = hov ? 2 : 1, cyc = 36, t = (f * speed) % cyc, k = t < cyc/2 ? t/(cyc/2) : 1 - (t - cyc/2)/(cyc/2);
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
    [["#9fd0ff",10],["#bfe0ff",8]].reduce((y, [col, h]) => { R(c, 0, y, W, h, col); return y + h; }, 0);
    R(c, 50, 4, 5, 5, "#fff6c8"); R(c, 51, 3, 3, 1, "#fff6c8"); R(c, 51, 9, 3, 1, "#fff6c8");
    for (let x = 0; x < W; x++) { const h = Math.round(9 + Math.sin(x/9) * 3 + Math.sin(x/4) * 1); R(c, x, 26 - h, 1, h, "#5c8a4a"); R(c, x, 26 - h, 1, 1, "#78a862"); }
    for (let x = 0; x < W; x++) { const h = Math.round(5 + Math.sin((x+20)/7) * 2); R(c, x, 28 - h, 1, h, "#3f6e38"); }
    [[6,18],[14,16],[58,17]].forEach(([x, y]) => { R(c, x - 2, y - 4, 5, 4, "#2c5a2c"); R(c, x - 1, y - 5, 3, 1, "#2c5a2c"); R(c, x - 2, y - 4, 1, 1, "#4a8a44"); R(c, x, y, 1, 3, "#5a3a24"); });
    R(c, 0, 28, W, 12, "#4f9a44"); for (let x = 0; x < W; x += 6) R(c, x, 28, 3, 12, "#58a64c");
    R(c, 38, 30, 22, 4, "#6cc25c"); R(c, 40, 29, 18, 1, "#6cc25c");
    R(c, 52, 31, 2, 1, "#14240f"); R(c, 52, 18, 1, 13, "#e9e4d4");
    const wave = Math.floor(f / 6) % 2; R(c, 53, 18, 5, 2, "#C4132A"); R(c, 53 + 5, 18 + wave, 1, 1, "#C4132A"); R(c, 53, 20, 4, 1, "#8a0e1e");
    // golfer + swing
    const L = 110, p = (f * (hov ? 2 : 1)) % L, swung = p > 14;
    spr(c, STAND, 8, 23, false, { j: "#f2efe6", k: "#1d3a63" });
    if (p < 10) { R(c, 13, 20, 1, 1, "#9aa3b2"); R(c, 14, 19, 1, 1, "#9aa3b2"); R(c, 15, 18, 1, 1, "#c0c6d0"); }
    else if (!swung) { R(c, 14, 31, 1, 4, "#9aa3b2"); R(c, 15, 35, 2, 1, "#c0c6d0"); }
    else { R(c, 6, 21, 1, 1, "#9aa3b2"); R(c, 5, 20, 1, 1, "#9aa3b2"); R(c, 4, 19, 1, 1, "#c0c6d0"); }
    let bx, by;
    if (!swung) { bx = 17; by = 35; }
    else if (p < 60) { const t = (p - 14) / 46; bx = 17 + t * 30; by = 35 - Math.sin(t * Math.PI) * 26 - t * 4; }
    else if (p < 80) { const t = (p - 60) / 20; bx = 47 + t * 5; by = 31; }
    else { bx = -9; by = 0; }
    if (bx > 0) { R(c, bx, by + 1, 2, 1, "rgba(0,0,0,.25)"); R(c, bx, by, 2, 1, "#ffffff"); }
    if (p >= 80 && p < 108) txt(c, "birdie", 28, 10, "#C4132A");
  }

  /* ---- volleyball: approach, jump, spike over the net ---- */
  function volley(c, f, hov) {
    R(c, 0, 0, W, 28, "#1b2f52"); for (let x = 0; x < W; x += 16) { R(c, x + 4, 3, 8, 4, "#fff4c0"); R(c, x + 4, 7, 8, 1, "#c9b97a"); }
    R(c, 0, 18, W, 10, "#22395f"); R(c, 0, 18, W, 1, "#2f4a74");
    R(c, 0, 28, W, 12, "#c48a4e"); for (let x = 0; x < W; x += 7) R(c, x, 28, 1, 12, "#a8743e"); R(c, 0, 28, W, 1, "#dca46a"); R(c, 0, 34, W, 1, "#FDB515");
    R(c, 40, 12, 1, 22, "#9aa3b2"); R(c, 40, 12, 1, 1, "#e9e4d4");
    for (let y = 13; y < 21; y += 2) R(c, 41, y, 16, 1, "rgba(233,228,212,.45)");
    for (let x = 41; x < 57; x += 2) R(c, x, 13, 1, 8, "rgba(233,228,212,.35)"); R(c, 41, 12, 16, 1, "#e9e4d4");
    const L = 80, p = (f * (hov ? 2 : 1)) % L;
    let px = 16, py = 21, jump = false;
    if (p > 20 && p < 46) { const t = (p - 20) / 26; py = 21 - Math.sin(t * Math.PI) * 9; px = 18 + t * 8; jump = t > .25 && t < .8; }
    else if (p >= 46) px = 26 - (p - 46) * .3;
    R(c, px + 1, 35, 7, 1, "rgba(0,0,0,.25)");
    spr(c, jump ? REACH : STAND, px, py, false, { j: "#3b7dd8" });
    let bx, by;
    if (p <= 34) { const t = p / 34; bx = 4 + t * 26; by = 26 - Math.sin(t * Math.PI) * 24 + t * -2; }
    else { const t = (p - 34) / 14; bx = 31 + t * 22; by = 9 + t * 25; if (t > 1) { bx = 53 + (p - 48) * .4; by = 34 - Math.abs(Math.sin((p - 48) / 4)) * 3; } }
    R(c, bx, by, 3, 3, "#f2efe6"); R(c, bx + 1, by, 1, 3, "#FDB515"); R(c, bx, by + 1, 3, 1, "#3b7dd8");
    if (p >= 34 && p < 40) for (let i = 0; i < 3; i++) R(c, bx - 2 - i*2, by - 2 - i, 2, 1, "rgba(255,255,255,.6)");
    if (p > 48 && p < 72) txt(c, "kill", 46, 9, "#FDB515");
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
  /* dream car: Daniel's own pixel car (public/me/car.png, 106x36) on a 2x-scaled sunset */
  const CAR = new Image(); CAR.src = "/me/car.png";
  let carPos = 0;
  function car(c, f, hov) {
    const sp = hov ? 3 : 1; carPos += sp;
    c.save(); c.setTransform(2, 0, 0, 2, 0, 0);
    [["#1a1440",8],["#3a1f5c",6],["#7a3a6a",5],["#d9714e",4],["#f0a040",2],["#FDB515",5]].reduce((y, [col, h]) => { R(c, 0, y, W, h, col); return y + h; }, 0);
    for (let dy = -5; dy <= 5; dy++) { const w = Math.round(Math.sqrt(25 - dy*dy)); R(c, 50 - w, 20 + dy, w*2, 1, "#ffd36a"); }
    for (let x = 0; x < W; x++) { const h1 = Math.round(6 + Math.sin((x + carPos*.15)/7) * 3 + Math.sin((x + carPos*.15)/3)); R(c, x, 30 - h1, 1, h1, "#2a1f4a");
      const h2 = Math.round(3 + Math.sin((x + carPos*.5)/5) * 2); R(c, x, 30 - h2, 1, h2, "#1a1838"); }
    if (f % 40 < 20) R(c, 6, 3, 1, 1, "#fff"); R(c, 22, 5, 1, 1, "#cfd8ff");
    R(c, 0, 30, W, 10, "#22253a"); R(c, 0, 30, W, 1, "#4a4f6a");
    for (let i = 0; i < 6; i++) R(c, ((i*14 - carPos*2) % 84 + 84) % 84 - 10, 36, 6, 1, "#FDB515");
    c.restore();
    const bob = (!hov && Math.floor(carPos / 6) % 2) ? 1 : 0, x = 11, y = 25 + bob;
    for (let i = 0; i < 4; i++) R(c, ((60 - carPos*6 + i*37) % 128 + 128) % 128, 30 + i*7, 8 + sp*4, 1, "rgba(255,255,255,.3)");
    R(c, x + 6, 60, 96, 2, "rgba(0,0,0,.4)");
    if (CAR.complete && CAR.naturalWidth) c.drawImage(CAR, x, y);
    if (hov) for (let i = 0; i < 5; i++) R(c, x - 2 - i*2, y + 30 + ((f + i) % 2), 2, 1, ["#fff2a8","#FDB515","#ff8a3d","#ff4a3d","#a8344a"][i]);
  }
  car.size = [128, 80];

  window.HOBBY_SCENES = { climb, gym, golf, volley, fashion, cafe, car, W, H };
})();
