
/* =====================================================================
   EDIT YOUR CONTENT HERE — everything on the site is generated from DATA
   (Projects / experience are placeholders until the résumé is added.)
   ===================================================================== */
const DATA = JSON.parse(document.getElementById("profile").textContent);

/* ---------- network helper (talks to the Next.js API routes) ---------- */
async function api(path, body){
  try{
    const r = await fetch(path, body===undefined ? {} : {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body)});
    const j = await r.json().catch(()=>({}));
    if(!r.ok) return {error: j.error || `request failed (${r.status})`};
    return j;
  }catch(e){ return {error:"network error. are you offline?"}; }
}
const ago = iso => { const s=(Date.now()-new Date(iso))/1000; if(!isFinite(s)) return ""; if(s<60) return "just now"; if(s<3600) return Math.floor(s/60)+"m ago"; if(s<86400) return Math.floor(s/3600)+"h ago"; return Math.floor(s/86400)+"d ago"; };

/* ---------- helpers ---------- */
const $ = s => document.querySelector(s);
const el = (tag, attrs={}, html="") => { const e=document.createElement(tag); for(const k in attrs) e.setAttribute(k,attrs[k]); e.innerHTML=html; return e; };
const esc = s => String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const toBin = s => [...s].map(c=>c.charCodeAt(0).toString(2).padStart(8,"0")).join(" ");
const toHex = n => "0x"+n.toString(16).toUpperCase().padStart(4,"0");
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const mobile = () => innerWidth <= 720;

/* ---------- sound (Web Audio, off by default) ---------- */
const Sound = {
  on:false, ctx:null,
  init(){ try{ if(!this.ctx) this.ctx=new (window.AudioContext||window.webkitAudioContext)(); if(this.ctx.state==="suspended") this.ctx.resume(); }catch(e){} },
  tone(f,d=.12,type="square",vol=.05,when=0){ if(!this.on) return; this.init(); if(!this.ctx) return;
    const t=this.ctx.currentTime+when, o=this.ctx.createOscillator(), g=this.ctx.createGain();
    o.type=type; o.frequency.value=f; g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(.0001,t+d);
    o.connect(g).connect(this.ctx.destination); o.start(t); o.stop(t+d+.05); },
  seq(notes,step=.1,type="square"){ notes.forEach((f,i)=>f&&this.tone(f,step*.95,type,.05,i*step)); },
  bell(f,when=0){ this.tone(f,2.6,"sine",.14,when); this.tone(f*2.01,1.4,"sine",.04,when); this.tone(f*2.76,.9,"sine",.025,when); }
};
const is8 = () => document.body.classList.contains("eightbit");
function setSound(v){ Sound.on=v; const b=$("#snd"); if(b){ b.textContent=v?"♪ on":"♪ off"; b.classList.toggle("on",v); b.setAttribute("aria-pressed",v); } try{ localStorage.setItem("snd",v?"1":"0"); }catch(e){} }

/* ---------- pixel icons (original 12x12 art) ---------- */
const P = (rows, colors) => {
  let r = ""; rows.forEach((row,y)=>[...row].forEach((ch,x)=>{ if(colors[ch]) r+=`<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${colors[ch]}"/>`; }));
  return `<svg viewBox="0 0 ${rows[0].length} ${rows.length}" shape-rendering="crispEdges">${r}</svg>`;
};
const C = {g:"#FDB515",m:"#C4820E",b:"#3B7EA1",n:"#003262",w:"#E9E4D4",k:"#001428"};
const ICONS = {
  about: P(["..gggggggg..",".g........g.","g..gg..gg..g","g..........g","g..wwwwww..g","g..........g","g..wwww....g","g..........g","g..wwwww...g",".g........g.","..gggggggg..","............"],C),
  folder:P(["............","gggg........","gmmmgggggggg","gmmmmmmmmmmg","gggggggggggg","gmmmmmmmmmmg","gmmmmmmmmmmg","gmmmmmmmmmmg","gmmmmmmmmmmg","gmmmmmmmmmmg","gggggggggggg","............"],C),
  exp:   P(["....gggg....","....g..g....","gggggggggggg","gbbbbbbbbbbg","gbbbbbbbbbbg","gggggwwggggg","gbbbbwwbbbbg","gbbbbbbbbbbg","gbbbbbbbbbbg","gbbbbbbbbbbg","gggggggggggg","............"],C),
  skills:P(["gggggggggggg","gnnnnnnnnnng","gnggnnnnnnng","gnnnnnnnnnng","gngggggnnnng","gnnnnnnnnnng","gngggggggnng","gnnnnnnnnnng","gnggggnnnnng","gnnnnnnnnnng","gggggggggggg","....gggg...."],C),
  term:  P(["gggggggggggg","gkkkkkkkkkkg","gkgkkkkkkkkg","gkkgkkkkkkkg","gkkkgkkkkkkg","gkkgkkkkkkkg","gkgkkwwwwkkg","gkkkkkkkkkkg","gkkkkkkkkkkg","gggggggggggg","...gggggg...","..gggggggg.."],C),
  mail:  P(["............","gggggggggggg","ggwwwwwwwwgg","gwgwwwwwwgwg","gwwgwwwwgwwg","gwwwggggwwwg","gwwwwwwwwwwg","gwwwwwwwwwwg","gwwwwwwwwwwg","gggggggggggg","............","............"],C),
  lock:  P(["....gggg....","...g....g...","..g......g..","..g......g..","gggggggggggg","gmmmmmmmmmmg","gmmmmkkmmmmg","gmmmmkkmmmmg","gmmmmmkmmmmg","gmmmmmmmmmmg","gggggggggggg","............"],C),
  star:  P(["............",".....gg.....",".....gg.....","....gmmg....","gggggmmggggg",".gmmmmmmmmg.","..gmmmmmmg..","..gmmmmmmg..",".gmmmggmmmg.",".gmgg..ggmg.",".gg......gg.","............"],C),
  book:  P(["............",".gggggggggg.",".gbbbbbbbbg.",".gbwwwwwwbg.",".gbbbbbbbbg.",".gbwwwwwbbg.",".gbbbbbbbbg.",".gbwwwwwwbg.",".gbbbbbbbbg.",".gggggggggg.",".mmmmmmmmmm.","............"],C),
  doc:   P(["gggggggg....","gwwwwwwgg...","gwwwwwwgwg..","gwwwwwwggggg","gwnnnnnwwwwg","gwwwwwwwwwwg","gwnnnnnnnnwg","gwwwwwwwwwwg","gwnnnnnnwwwg","gwwwwwwwwwwg","gggggggggggg","............"],C),
};

/* ---------- background: the dot-matrix bear (public/dotbear.js) ----------
   Replaces the old falling binary. Same API the rest of the OS already uses: setColors, toggle, boost. */
const rain = (() => {
  let impl=null, pend={boost:1,colors:null,on:true};
  const make=()=>{ if(impl) return; if(!window.DotBear){ setTimeout(make,100); return; }
    impl=window.DotBear($("#rain"), { anchorX: mobile() ? .5 : .56, anchorY: .56, height: .82, alpha: .12 });
    impl.boost(pend.boost); if(pend.colors) impl.setColors(pend.colors); if(!pend.on) impl.toggle(); };
  make();
  return { el:$("#rain"),
    setColors(c){ pend.colors=c; impl&&impl.setColors(c); },
    toggle(){ pend.on=!pend.on; impl&&impl.toggle(); return pend.on; },
    boost(v){ pend.boost=v; impl&&impl.boost(v); } };
})();

/* ---------- boot sequence ---------- */
const BOOT = [
  ["<span class='g'>DANIEL_OS BIOS v1.0</span>  (c) Bantay Systems",0],
  ["CPU: DB-1 8-bit @ 4.77 MHz",120],
  ["Memory test: <span class='b'>640K</span> ................ <span class='ok'>OK</span>",220],
  ["Detecting drives ......... /dev/projects /dev/experience",180],
  ["Loading kernel modules: [crypto] [netsec] [glitch.sys]",200],
  ["Verifying signature ...... <span class='ok'>SHA-256 MATCH</span>",240],
  ["Establishing secure channel (TLS 1.3) ... <span class='ok'>OK</span>",200],
  ["",80],
  ["<span class='g'>"+toBin("GO BEARS")+"</span>",200],
  ["",60],
  ["login: <span class='g'>guest</span>",300],
  ["password: ********   <span class='ok'>ACCESS GRANTED</span>",300],
];
async function boot(){
  if(!$("#boot")) $("#screen").insertAdjacentHTML("beforeend",'<div id="boot" role="status" aria-live="polite"></div>');
  const b=$("#boot"); let skip=false;
  const finish=()=>{ if(skip) return; skip=true; b.style.transition="opacity .4s"; b.style.opacity=0; setTimeout(()=>{b.remove(); document.body.classList.add("booted"); showDesktop();},400); };
  b.addEventListener("click",finish); addEventListener("keydown",finish,{once:true});
  try{ if(sessionStorage.getItem("booted")) return finish(); sessionStorage.setItem("booted","1"); }catch(e){}
  for(const [line,delay] of BOOT){ if(skip) return; await sleep(delay); b.insertAdjacentHTML("beforeend",`<div>${line||"&nbsp;"}</div>`); }
  if(skip) return;
  b.insertAdjacentHTML("beforeend",`<div class="press">&gt; press any key or click to continue_</div>`);
  setTimeout(finish,2600);
}

/* ---------- window manager ---------- */
/* each window type gets its own accent so overlapping windows are easy to tell apart */
const ACCENTS={hobbies:"#FDB515",about:"#FDB515",projects:"#FDB515",experience:"#FDB515",skills:"#FDB515",terminal:"#E9E4D4",contact:"#FDB515",resume:"#E9E4D4",guestbook:"#FDB515",secret:"#FDB515"};

/* clean mode: no scanlines, rain or flicker (auto-on for prefers-reduced-motion) */
function setClean(v){ document.body.classList.toggle("clean",v); const b=$("#fx"); if(b){ b.textContent=v?"fx off":"fx on"; b.setAttribute("aria-pressed",String(!v)); } try{ localStorage.setItem("clean",v?"1":"0"); }catch(e){} }
(()=>{ let v=null; try{ const s=localStorage.getItem("clean"); if(s!==null) v=s==="1"; }catch(e){} if(v===null) v=matchMedia("(prefers-reduced-motion: reduce)").matches; setClean(v); })();

let Z=100; const wins={};
const APPS = {
  about:      {title:"about.txt",       icon:"about",  w:540,h:560, render:renderAbout},
  projects:   {title:"C:\\projects\\",  icon:"folder", w:640,h:460, render:renderProjects},
  experience: {title:"experience.log",  icon:"exp",    w:640,h:520, render:renderExperience},
  skills:     {title:"skills.exe",      icon:"skills", w:520,h:460, render:renderSkills},
  terminal:   {title:"terminal — guest@daniel-os", icon:"term", w:640,h:420, render:renderTerminal},
  contact:    {title:"contact.lnk",     icon:"mail",   w:440,h:360, render:renderContact},
  resume:     {title:"resume.pdf",      icon:"doc",    w:420,h:260, render:renderResume},
  hobbies:    {title:"hobbies/",        icon:"star",   w:640,h:640, render:renderHobbies},
  guestbook:  {title:"guestbook.txt",   icon:"book",   w:480,h:440, render:renderGuestbook},
  secret:     {title:"vault.enc",       icon:"lock",   w:440,h:330, render:renderVault},
};
const ICON_ORDER = ["about","hobbies","projects","experience","skills","terminal","contact","resume","guestbook","secret"];
const LABELS = {hobbies:"hobbies",guestbook:"guestbook",about:"about.txt",projects:"projects",experience:"experience",skills:"skills.exe",terminal:"terminal",contact:"contact",resume:"resume.pdf",secret:"vault.enc"};

function openWin(id, opts={}){
  if(wins[id]){ focusWin(id); if(wins[id].dataset.min==="1") restore(id); return wins[id]; }
  const app = opts.app || APPS[id]; if(!app) return;
  const n = Object.keys(wins).length;
  const W = Math.min(app.w, innerWidth-60), H = Math.min(app.h, innerHeight-140);
  const left = opts.x ?? Math.max(20, (innerWidth-W)/2 - 120 + n*28), top = opts.y ?? Math.max(20, 60 + n*24);
  const acc = app.acc || ACCENTS[id] || (String(id).startsWith("proj")?ACCENTS.projects:"#FDB515");
  const w = el("section",{class:"win",role:"dialog","aria-label":app.title,style:`left:${left}px;top:${top}px;width:${W}px;height:${H}px;--acc:${acc}`});
  w.innerHTML = `<div class="bar"><span class="t">${esc(app.title)}</span><button aria-label="Minimize" data-a="min">_</button><button aria-label="Maximize" data-a="max">□</button><button aria-label="Close" data-a="close">×</button></div><div class="body"></div>`;
  $("#screen").appendChild(w); wins[id]=w;
  app.render(w.querySelector(".body"), opts);
  w.addEventListener("pointerdown",()=>focusWin(id));
  w.querySelector(".bar").addEventListener("click",e=>{ const a=e.target.dataset.a; if(a==="close") closeWin(id); if(a==="max") w.classList.toggle("max"); if(a==="min") minimize(id); });
  w.querySelector(".bar").addEventListener("dblclick",e=>{ if(!e.target.dataset.a) w.classList.toggle("max"); });
  drag(w);
  focusWin(id); renderTasks(); busy(260); if(is8()) Sound.seq([659,988],.05);
  return w;
}
function focusWin(id){ if(Z>600){ Z=100; Object.values(wins).sort((a,b)=>a.style.zIndex-b.style.zIndex).forEach(w=>w.style.zIndex=++Z); } Object.entries(wins).forEach(([k,w])=>w.classList.toggle("inactive",k!==id)); wins[id].style.zIndex=++Z; renderTasks(id); }
function closeWin(id){ const w=wins[id]; if(!w) return; if(is8()) Sound.seq([988,494],.05); w.classList.add("closing"); delete wins[id]; setTimeout(()=>w.remove(),150); renderTasks(); }
function minimize(id){ wins[id].style.display="none"; wins[id].dataset.min="1"; renderTasks(); }
function restore(id){ wins[id].style.display=""; wins[id].dataset.min="0"; focusWin(id); }
const fx = () => !document.body.classList.contains("clean") && !matchMedia("(prefers-reduced-motion: reduce)").matches;
/* window drag: lifts, and tilts toward the direction you fling it (like the floppies on the intro) */
function drag(w){
  const bar=w.querySelector(".bar"); let sx,sy,ox,oy,on=false,lastX=0,tilt=0,raf=0;
  const settle=()=>{ w.classList.remove("dragging"); w.style.rotate=""; };
  bar.addEventListener("pointerdown",e=>{ if(e.target.dataset.a||w.classList.contains("max")||mobile()) return; on=true; sx=lastX=e.clientX; sy=e.clientY; ox=w.offsetLeft; oy=w.offsetTop; tilt=0; bar.setPointerCapture(e.pointerId); if(fx()) w.classList.add("dragging"); });
  bar.addEventListener("pointermove",e=>{ if(!on) return;
    w.style.left=Math.max(-w.offsetWidth+80,Math.min(innerWidth-80,ox+e.clientX-sx))+"px"; w.style.top=Math.max(0,Math.min(innerHeight-90,oy+e.clientY-sy))+"px";
    if(fx()){ tilt=Math.max(-5,Math.min(5,tilt*.7+(e.clientX-lastX)*.35)); lastX=e.clientX; w.style.rotate=tilt.toFixed(2)+"deg";
      cancelAnimationFrame(raf); raf=requestAnimationFrame(()=>setTimeout(()=>{ if(on){ tilt*=.5; w.style.rotate=tilt.toFixed(2)+"deg"; } },60)); } });
  bar.addEventListener("pointerup",()=>{ on=false; settle(); });
  bar.addEventListener("pointercancel",()=>{ on=false; settle(); });
}
/* desktop icons: hover lift, drag anywhere (positions remembered per visitor) */
const ICON_POS_KEY="iconPos";
function loadIconPos(){ try{ return JSON.parse(localStorage.getItem(ICON_POS_KEY)||"{}"); }catch(e){ return {}; } }
function saveIconPos(p){ try{ localStorage.setItem(ICON_POS_KEY,JSON.stringify(p)); }catch(e){} }
function makeIconDraggable(b,id){
  const pos=loadIconPos(); if(pos[id]) b.style.translate=`${pos[id][0]}px ${pos[id][1]}px`;
  let st=null;
  b.addEventListener("pointerdown",e=>{ if(mobile()||e.button!==0) return; const t=(b.style.translate||"0px 0px").split(" ").map(parseFloat);
    st={sx:e.clientX,sy:e.clientY,bx:t[0]||0,by:t[1]||0,moved:false,lastX:e.clientX,tilt:0}; try{ b.setPointerCapture(e.pointerId); }catch(_){} });
  b.addEventListener("pointermove",e=>{ if(!st) return; const dx=e.clientX-st.sx, dy=e.clientY-st.sy;
    if(!st.moved && Math.hypot(dx,dy)>6){ st.moved=true; b.classList.add("lift"); }
    if(!st.moved) return;
    const r=$("#screen").getBoundingClientRect(), home=b.getBoundingClientRect();
    let nx=st.bx+dx, ny=st.by+dy;
    // keep the icon on the desktop
    const cur=(b.style.translate||"0px 0px").split(" ").map(parseFloat), cx=home.left-(cur[0]||0), cy=home.top-(cur[1]||0);
    nx=Math.max(r.left-cx+4, Math.min(r.right-cx-home.width-4, nx)); ny=Math.max(r.top-cy+4, Math.min(r.bottom-50-cy-home.height, ny));
    b.style.translate=`${nx}px ${ny}px`;
    st.tilt=Math.max(-14,Math.min(14,st.tilt*.6+(e.clientX-st.lastX)*.9)); st.lastX=e.clientX; b.style.rotate=fx()?st.tilt.toFixed(1)+"deg":""; });
  const end=()=>{ if(!st) return; const moved=st.moved; st=null; b.classList.remove("lift"); b.style.rotate="";
    if(moved){ b.dataset.dragged="1"; setTimeout(()=>delete b.dataset.dragged,0);
      const p=loadIconPos(); p[id]=(b.style.translate||"0px 0px").split(" ").map(parseFloat); saveIconPos(p);
      if(fx()) b.animate([{transform:"scale(1.12)"},{transform:"scale(.94)"},{transform:"scale(1.03)"},{transform:"scale(1)"}],{duration:380,easing:"ease-out"}); } };
  b.addEventListener("pointerup",end); b.addEventListener("pointercancel",end);
  b.addEventListener("click",e=>{ if(b.dataset.dragged){ e.stopImmediatePropagation(); e.preventDefault(); } },true);
}
/* project cards: 3D tilt toward the cursor */
document.addEventListener("pointermove",e=>{ const c=e.target.closest&&e.target.closest(".card"); 
  document.querySelectorAll(".card.tilt").forEach(x=>{ if(x!==c){ x.classList.remove("tilt"); x.style.transform=""; } });
  if(c&&!fx()){ c.classList.remove("tilt"); c.style.transform=""; }
  if(!c||!fx()) return; const r=c.getBoundingClientRect(), px=(e.clientX-r.left)/r.width-.5, py=(e.clientY-r.top)/r.height-.5;
  c.classList.add("tilt"); c.style.transform=`perspective(700px) rotateX(${(-py*10).toFixed(2)}deg) rotateY(${(px*12).toFixed(2)}deg) translateY(-4px)`; },{passive:true});
function renderTasks(active){
  const t=$("#tasks"); t.innerHTML="";
  Object.entries(wins).forEach(([id,w])=>{
    const b=el("button",{class:"task"+(w.dataset.min!=="1"&&!w.classList.contains("inactive")?" on":"")}, esc(w.getAttribute("aria-label")));
    b.onclick=()=>{ if(w.dataset.min==="1") restore(id); else if(!w.classList.contains("inactive")) minimize(id); else focusWin(id); };
    t.appendChild(b);
  });
}

/* ---------- window contents ---------- */
function renderAbout(b){
  b.innerHTML = `
  ${DATA.avatar?`<img class="avatar" src="${esc(DATA.avatar)}" alt="Daniel's pixel portrait" width="120" height="120" style="float:right;border:2px solid var(--gold);margin:0 0 6px 12px">`:""}
  <pre class="ascii glow">
 ____    ____
|  _ \\  | __ )   ${esc(DATA.name.toUpperCase())}
| | | | |  _ \\   ${esc(DATA.title)}
| |_| | | |_) |  ${esc(DATA.location)}
|____/  |____/   status: <span style="color:#7be08a">online</span></pre>
  ${(DATA.affiliations||[]).length?`<p class="aff">${DATA.affiliations.map(a=>`${a.prev?'<span class="dim">prev </span>':''}${a.href?`<a href="${esc(a.href)}" target="_blank" rel="noopener">@${esc(a.at.toUpperCase())}</a>`:`<b>@${esc(a.at.toUpperCase())}</b>`} <span class="dim">${esc(a.role)}</span>`).join(" &nbsp;·&nbsp; ")}</p>`:""}
  <p style="margin-top:14px">${esc(DATA.bio)}</p>
  <p class="sub" style="margin-top:16px">education</p>
  <p><b style="color:var(--gold)">${esc(DATA.education.school)}</b><br>${esc(DATA.education.degree)}${DATA.education.when?" · "+esc(DATA.education.when):""}</p>
  <p style="margin-top:6px">${(DATA.education.courses||[]).map(c=>`<span class="tag">${esc(c)}</span>`).join("")}</p>
  ${DATA.personal ? `<p class="sub" style="margin-top:18px">off the clock</p>
  <p>${esc(DATA.personal.intro)}</p>
  <p style="margin-top:8px">${DATA.personal.hobbies.map(h=>`<span class="tag">${esc(h.name)}</span>`).join("")}</p>
  <p style="margin-top:8px;font-size:13px"><span style="color:var(--gold)">fun fact:</span> ${esc(DATA.personal.funFacts[0])}</p>` : ""}
  <p style="margin-top:14px"><button class="btn" data-open="projects">view projects →</button>${DATA.personal?`<button class="btn" data-open="hobbies">hobbies →</button>`:""}<button class="btn" data-open="terminal">open terminal</button></p>`;
  wireOpeners(b);
}
/* project media: real clip/screenshot if one was dropped in public/projects/<slug>/, the coding bear for this site, else a test card */
function mediaHTML(p, big){
  const m=p.media;
  if(m&&m.type==="video") return `<div class="pthumb${big?" big":""}"><video src="${esc(m.src)}" ${m.poster?`poster="${esc(m.poster)}"`:""} muted loop playsinline preload="metadata" ${big?"autoplay":"data-hoverplay"}></video></div>`;
  if(m&&m.type==="image") return `<div class="pthumb${big?" big":""}"><img src="${esc(m.src)}" alt="${esc(p.name)} screenshot" loading="lazy"></div>`;
  if(p.slug==="daniel-os") return `<div class="pthumb${big?" big":""}"><canvas class="scene" data-scene="bear" width="112" height="72" aria-hidden="true"></canvas></div>`;
  return `<div class="pthumb nosig${big?" big":""}"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><span>NO SIGNAL${big?"<small>demo uploading…</small>":""}</span></div>`;
}
function wireMedia(b){
  b.querySelectorAll("video[data-hoverplay]").forEach(v=>{ const h=v.closest(".card")||v; h.addEventListener("pointerenter",()=>{ if(fx()) v.play().catch(()=>{}); }); h.addEventListener("pointerleave",()=>v.pause()); });
  if(b.querySelector("canvas.scene")) runScenes(b);
}
function renderProjects(b){
  b.innerHTML = `<div class="h">projects/</div><div class="sub">${DATA.projects.length} items · double-click or tap to open</div><div class="grid"></div>`;
  const g=b.querySelector(".grid");
  DATA.projects.forEach((p,i)=>{
    const c=el("button",{class:"card"},`<div class="hex">${toHex(0x1000+i*0x100)}</div><div class="n">${esc(p.name)}</div>${p.award?`<div style="color:#7be08a;font-size:11px">* ${esc(p.award)}</div>`:""}<div class="d">${esc(p.blurb)}</div>${p.tech.slice(0,4).map(t=>`<span class="tag">${esc(t)}</span>`).join("")}`);
    c.insertAdjacentHTML("afterbegin", mediaHTML(p,false));
    c.onclick=()=>openProject(i); g.appendChild(c);
  });
  wireMedia(b);
}
function openProject(i){
  const p=DATA.projects[i]; if(!p) return false;
  openWin("proj"+i,{app:{title:p.name.toLowerCase().replace(/\s+/g,"_")+".md",w:540,h:620,render(b){
    b.innerHTML=`${mediaHTML(p,true)}<div class="sub">project ${String(i+1).padStart(2,"0")} · ${toHex(0x1000+i*0x100)}</div><div class="h" style="margin:4px 0 4px">${esc(p.name)}</div>${p.award?`<div style="color:#7be08a;font-size:12px;margin-bottom:8px">* ${esc(p.award)}</div>`:""}
    <p>${esc(p.blurb)}</p><ul style="margin:12px 0 12px 18px">${p.details.map(d=>`<li>${esc(d)}</li>`).join("")}</ul>
    <p>${p.tech.map(t=>`<span class="tag">${esc(t)}</span>`).join("")}</p>
    <p style="margin-top:12px"><a class="btn" href="/projects/${esc(p.slug)}">read write-up →</a><a class="btn" href="${esc(p.repo||DATA.links.github)}" target="_blank" rel="noopener">${p.repo?"source":"github"} ↗</a>${p.demo?`<a class="btn" href="${esc(p.demo)}" target="_blank" rel="noopener">live demo ↗</a>`:""}</p>`; wireMedia(b); }}});
  return true;
}
function renderExperience(b){
  b.innerHTML = `<div class="h">experience.log</div><div class="sub">tail -f career</div><div class="tl">${DATA.experience.map(x=>`
    <div class="item"><div class="role">${esc(x.role)}</div><div class="meta">${esc(x.org)} · ${esc(x.when)} · ${esc(x.where)}</div><ul>${x.bullets.map(t=>`<li>${esc(t)}</li>`).join("")}</ul></div>`).join("")}</div>`;
}
function renderSkills(b){
  const cats=Object.entries(DATA.skills);
  b.innerHTML = `<div class="h">skills.exe</div><div class="sub" style="margin-bottom:10px">running diagnostics… <span class="scan" style="color:#7be08a"></span></div>` +
    cats.map(([c,list],i)=>`<div class="skc" style="opacity:0;transition:opacity .3s ${i*0.18}s"><div class="sub" style="color:var(--gold);margin-top:12px">${toHex(0x10*(i+1))} · ${esc(c)}</div><div>${list.map(t=>`<span class="tag">${esc(t)}</span>`).join("")}</div></div>`).join("");
  setTimeout(()=>{ b.querySelectorAll(".skc").forEach(x=>x.style.opacity=1); },60);
  setTimeout(()=>{ const s=b.querySelector(".scan"); if(s) s.textContent=`${cats.reduce((n,[,l])=>n+l.length,0)} modules loaded [OK]`; },60+cats.length*180);
}
function renderContact(b){
  const L=DATA.links;
  b.innerHTML = `<div class="h">contact.lnk</div><div class="sub" style="margin-bottom:12px">open a secure channel</div>
    <p>@ email: <a href="mailto:${esc(L.email)}">${esc(L.email)}</a> <button class="btn" style="font-size:16px;padding:0 8px" id="cp">copy</button></p>
    <p>in linkedin: <a href="${esc(L.linkedin)}" target="_blank" rel="noopener">${esc(L.linkedin.replace(/^https?:\/\/(www\.)?/,""))}</a></p>
    <p>⌥ github: <a href="${esc(L.github)}" target="_blank" rel="noopener">${esc(L.github.replace(/^https?:\/\//,""))}</a></p>
    <p>▤ résumé: <a href="${esc(L.resume)}" target="_blank" rel="noopener">${esc(L.resume)}</a></p>
    <p class="m" style="margin-top:14px;color:var(--dim);font-size:12px">pgp fingerprint: ${toBin("DB").replace(/ /g,"")}…</p>`;
  b.querySelector("#cp").onclick=async e=>{ try{ await navigator.clipboard.writeText(L.email); e.target.textContent="copied!"; }catch(_){ e.target.textContent="select it ↑"; } };
}
function renderResume(b){
  b.innerHTML = `<div class="h">resume.pdf</div><p style="margin:10px 0">One page: experience, projects, and skills.</p>
    <a class="btn" href="${esc(DATA.links.resume)}" target="_blank" rel="noopener">open résumé ↗</a>`;
}
function renderVault(b){
  b.innerHTML = `<div class="h">vault.enc</div><div class="sub">AES-256 · locked</div>
  <p style="margin:12px 0">Enter the passphrase. <span style="color:var(--dim)">(hint: what do Cal fans yell? two words.)</span></p>
  <form><input aria-label="passphrase" style="width:100%;background:#000c18;border:2px solid var(--rock);color:var(--gold);font-family:var(--pixel);font-size:22px;padding:4px 8px" autocomplete="off"></form>
  <div id="vout" style="margin-top:12px;font-family:var(--pixel);font-size:20px"></div>`;
  const f=b.querySelector("form"), o=b.querySelector("#vout");
  f.onsubmit=e=>{ e.preventDefault(); const v=f.querySelector("input").value.trim().toLowerCase().replace(/[^a-z]/g,"");
    if(v==="gobears"){ o.innerHTML=`<span style="color:#7be08a">DECRYPTED [OK]</span><br>You found the vault. Thanks for exploring — let's talk: <a href="mailto:${esc(DATA.links.email)}">${esc(DATA.links.email)}</a>`; }
    else { o.innerHTML=`<span style="color:#ff7a6b">ACCESS DENIED</span> — sha256 mismatch`; f.querySelector("input").value=""; } };
}
function renderHobbies(b){
  const P=DATA.personal;
  b.innerHTML=`<div class="h">hobbies/</div><div class="sub">off the clock · ${P.hobbies.length} entries</div>
  <div class="grid hgrid">${P.hobbies.map((h,i)=>`<div class="card hcard">${h.scene?`<canvas class="scene" data-scene="${esc(h.scene)}" width="64" height="40" aria-hidden="true"></canvas>`:""}<div class="hex">${toHex(0x2000+i*0x10)}</div><div class="n">${esc(h.name)}</div>${h.detail?`<div class="d" style="color:var(--ink)">${esc(h.detail)}</div>`:""}<div class="d" style="color:var(--dim)"># ${esc(h.quip)}</div></div>`).join("")}</div>
  <p class="sub" style="margin-top:18px">cafe.log</p>
  <div class="cafelog">${P.cafes.map((c,i)=>`<div><span class="rank">#${i+1}</span><b>${esc(c.name)}</b> <span style="color:var(--dim)">· ${esc(c.city)} · ${esc(c.note)}</span></div>`).join("")}
  <div style="color:var(--dim);font-size:12px;margin-top:6px">dessert: ${esc(P.dessertSpot)} · know a better cafe? type <span style="color:var(--gold)">mail</span> in the terminal</div></div>
  <p class="sub" style="margin-top:18px">learning ${esc(P.learning.toLowerCase())}</p>
  <p><span class="zh">你好，我在学中文。</span><br><span style="color:var(--dim);font-size:12px">nǐ hǎo, wǒ zài xué zhōngwén · hello, I'm learning Chinese</span></p>
  <p style="margin-top:6px">${esc(P.learningWhy)}</p>
  ${P.photos&&P.photos.length?`<p class="sub" style="margin-top:18px">photo strip</p>
  <div class="pstrip">${P.photos.map((ph,i)=>`<figure class="polaroid" style="--r:${i%2?2.5:-3}deg"><img src="${esc(ph.src)}" alt="${esc(ph.caption)}" loading="lazy"><figcaption>${esc(ph.caption)}</figcaption></figure>`).join("")}</div>`:""}`;
  runScenes(b);
}
function runScenes(b){
  const S=window.HOBBY_SCENES; if(!S) return;
  const items=[...b.querySelectorAll("canvas.scene")].map(cv=>{ const card=cv.closest(".hcard, .card, .pthumb")||cv, fn=S[cv.dataset.scene]; if(fn&&fn.size){ cv.width=fn.size[0]; cv.height=fn.size[1]; } const it={c:cv.getContext("2d"),fn,hov:false,w:cv.width,h:cv.height};
    card.addEventListener("pointerenter",()=>it.hov=true); card.addEventListener("pointerleave",()=>it.hov=false); return it; }).filter(i=>i.fn);
  let f=40; const draw=()=>items.forEach(i=>{ i.c.clearRect(0,0,i.w,i.h); i.fn(i.c,f,i.hov); });
  draw();
  /* fixed 12fps step on requestAnimationFrame: steady timing, pauses with the tab */
  let last=performance.now(), acc=0;
  const tick=now=>{ if(!b.isConnected) return; acc+=Math.min(250,now-last); last=now;
    if(fx()){ let n=0; while(acc>=83&&n<3){ f++; acc-=83; n++; } if(n) draw(); } else acc=0;
    requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}
function renderGuestbook(b){
  b.innerHTML=`<div class="h">guestbook.txt</div><div class="sub">people who ssh'd in and said hi</div><div class="gbl" style="margin-top:10px;color:var(--dim)">loading…</div>
  <p style="margin-top:14px;color:var(--dim);font-size:12px">want to sign? open the terminal → <span style="color:var(--gold)">ssh daniel@berkeley.edu</span> → <span style="color:var(--gold)">sign your message</span></p>`;
  api("/api/guestbook").then(j=>{ const l=b.querySelector(".gbl");
    if(j.error){ l.textContent="guestbook is offline right now."; return; }
    l.innerHTML = j.entries.length ? j.entries.map(e=>`<div class="gb"><span class="who">${esc(e.name)}</span><span class="when">${esc(ago(e.at))}</span><div>${esc(e.message)}</div></div>`).join("") : "no signatures yet. be the first!";
    l.style.color=""; });
}
function wireOpeners(b){ b.querySelectorAll("[data-open]").forEach(x=>x.onclick=()=>openWin(x.dataset.open)); }

/* ---------- terminal ---------- */
function renderTerminal(b){
  b.classList.add("term");
  b.innerHTML=`<div class="out"></div><div class="line"><span class="p pr">guest@daniel-os:~$</span><input aria-label="terminal input" autocomplete="off" autocapitalize="off" spellcheck="false"></div>`;
  const out=b.querySelector(".out"), inp=b.querySelector("input"), prEl=b.querySelector(".pr"); const hist=[]; let hi=0;
  let user="guest", host="daniel-os", remote=false, mode=null, visitor="", mail=null, whereP=null, from="your-browser"; const askHist=[];
  const prompt=()=>`${esc(user)}@${esc(host)}:~$`; const setPrompt=t=>prEl.innerHTML=t??prompt();
  const print=(html,cls="")=>{ out.appendChild(el("div",cls?{class:cls}:{},html)); b.scrollTop=b.scrollHeight; };
  b.addEventListener("click",()=>inp.focus());
  print(`DANIEL_OS terminal [v1.0] — type <span class="p">help</span> to see commands. (some are hidden.)`,"m");
  print(`<span class="c">tip:</span> try <span class="p">whoami</span>, <span class="p">projects</span>, or <span class="p">hack</span>`,"m");
  const files = {"hobbies.txt":()=>DATA.personal.hobbies.map(h=>`${h.name.padEnd(20)} ${h.detail?h.detail+"  ":""}# ${h.quip}`).join("\n"), "about.txt":()=>DATA.bio, "contact.txt":()=>`email: ${DATA.links.email}\nlinkedin: ${DATA.links.linkedin}\ngithub: ${DATA.links.github}`, ".secret":()=>"01100111 01101111 01100010 01100101 01100001 01110010 01110011  (decode me)"};
  const CMDS = {
    help:()=>print(
`<span class="p">navigation</span>
  about · projects · project N · experience
  neofetch · hobbies · cafe · funfact
  skills · contact · resume · open NAME
  tldr        recruiter mode: everything on one page
<span class="p">system</span>
  ls · cat FILE · cd DIR · whoami · clear
  history · date · echo TEXT · ping
  reboot · shutdown · clean · tidy
<span class="p">online</span>
  ask QUESTION   ask an AI about Daniel
  mail           send Daniel a message
  guestbook      read the guestbook
  git log        latest commits on GitHub
  visitors       the hit counter
  np             what Daniel's listening to
<span class="p">fun</span>
  hack · matrix · binary TEXT · sudo
<span class="m">↑/↓ history · TAB autocomplete · ctrl+L clear</span>`),
    neofetch:()=>{
      const P=DATA.personal, art=[
" ____    ____  ",
"|  _ \\  | __ ) ",
"| | | | |  _ \\ ",
"| |_| | | |_) |",
"|____/  |____/ ",
"               ",
"   DANIEL_OS   "];
      const who=remote?visitor.toLowerCase().replace(/\s+/g,"-"):"guest";
      const rows=[
        [`<span class="p">daniel</span>@<span class="p">berkeley</span>`,""],["-----------------",""],
        ["OS","DANIEL_OS v1.0 (hacker edition)"],["Host","UC Berkeley, Computer Science"],["Shell","bash, ssh-friendly"],
        ["Uptime","since the last cafe run"],["Stack",Object.values(DATA.skills)[0].join(", ")],
        ["Hobbies",P.hobbies.slice(0,4).map(h=>h.name).join(", ")],["Also",P.hobbies.slice(4).map(h=>h.name).join(", ")],
        ["Learning",`${P.learning} (tones: WIP)`],["Cafe",P.cafes[0].name],["Dessert",P.dessertSpot],["Dream car",P.dreamCar],["F1 team",P.f1Team],["Twin","yes. he's the other one"],["User",who]];
      const right=rows.map(([k,v])=>v===""?k:`<span class="p">${esc(k)}</span>: ${esc(v)}`).join("\n");
      const blocks=["#001428","#003262","#3B7EA1","#FDB515","#C4820E","#E9E4D4","#7be08a","#ff7a6b"].map(c=>`<span style="background:${c}">   </span>`).join("");
      print(`<div style="display:flex;gap:18px;flex-wrap:wrap;align-items:flex-start"><pre style="margin:0;color:var(--gold);font:inherit">${esc(art.join("\n"))}</pre><div style="white-space:pre-wrap">${right}\n\n${blocks}</div></div>`); },
    hobbies:()=>{ print(`<span class="p">~/hobbies.txt</span>`); DATA.personal.hobbies.forEach(h=>print(`  ${esc(h.name.padEnd(20))}${h.detail?esc(h.detail)+"  ":""}<span class="m"># ${esc(h.quip)}</span>`)); print(`<span class="m">opening the hobbies window…</span>`); openWin("hobbies"); },
    cafe:()=>{ print(`<span class="p">~/cafe.log</span>`); DATA.personal.cafes.forEach((c,i)=>print(`  #${i+1}  ${esc(c.name)}  <span class="m">${esc(c.city)} · ${esc(c.note)}</span>`)); print(`  <span class="m">dessert: ${esc(DATA.personal.dessertSpot)} · got a rec? type</span> <span class="p">mail</span>`); },
    funfact:()=>{ const f=DATA.personal.funFacts; print(`<span class="p">fun fact:</span> ${esc(f[Math.random()*f.length|0])}`); },
    np:async()=>{ const j=await api("/api/now-playing");
      if(j.error||!j.configured) return print("♪ the jukebox is unplugged right now.","m");
      if(!j.track) return print("♪ nothing on the turntable right now.","m");
      const t=j.track, link=t.url?`<a href="${esc(t.url)}" target="_blank" rel="noopener">${esc(t.title)}</a>`:esc(t.title);
      print(t.playing ? `<span class="ok">♪ now playing:</span> ${link} <span class="m">by</span> ${esc(t.artist)}` : `<span class="m">♪ last played${t.playedAt?" "+esc(ago(t.playedAt)):""}:</span> ${link} <span class="m">by</span> ${esc(t.artist)}`); },
    visitors:()=>api("/api/hits").then(j=>print(j.error?"counter offline.":`you are one of <span class="p">${String(j.count).padStart(6,"0")}</span> visitors. thanks for stopping by!`)),
    guestbook:async()=>{ const j=await api("/api/guestbook"); if(j.error) return print(j.error,"e");
      if(!j.entries.length) print("the guestbook is empty. be the first!","m");
      j.entries.slice(0,10).forEach(e=>print(`<span class="p">${esc(e.name)}</span> <span class="m">(${esc(ago(e.at))})</span>: ${esc(e.message)}`));
      if(!remote) print(`<span class="m">to sign: <span class="p">ssh daniel@berkeley.edu</span>, then <span class="p">sign your message</span></span>`); },
    sign:async a=>{ if(!remote) return print(`sign: permission denied. guests can only sign from a remote session.\nhint: <span class="p">ssh daniel@berkeley.edu</span>`,"e");
      const msg=a.join(" ").trim(); if(!msg) return print("usage: sign your message here (max 140 chars)","e");
      inp.disabled=true; print("writing to guestbook …","m"); const j=await api("/api/guestbook",{name:visitor,message:msg}); inp.disabled=false; inp.focus();
      if(j.error) return print(j.error,"e"); print(`signed. thanks, ${esc(visitor)}! type <span class="p">guestbook</span> to see it.`,"ok"); },
    ask:async a=>{ const q=a.join(" ").trim();
      if(!q) return print(`usage: ask &lt;question&gt;\n  e.g. <span class="p">ask what did Daniel build at the hackathon?</span>\n       <span class="p">ask what languages does he use?</span>`,"m");
      inp.disabled=true; const line=el("div",{class:"spin"},"thinking |"); out.appendChild(line); b.scrollTop=b.scrollHeight;
      let f=0; const spin=setInterval(()=>line.textContent="thinking "+"|/-\\"[f++%4],90);
      const j=await api("/api/ask",{question:q,history:askHist}); clearInterval(spin);
      if(j.error){ line.className="e"; line.textContent=j.error; inp.disabled=false; inp.focus(); return; }
      line.className="c"; line.textContent=""; const txt=j.answer;
      for(let i=0;i<txt.length;i+=2){ line.textContent=txt.slice(0,i+2); b.scrollTop=b.scrollHeight; await sleep(8); }
      askHist.push({q,a:txt}); if(askHist.length>3) askHist.shift(); inp.disabled=false; inp.focus(); },
    mail:()=>{ mail={step:0,data:{},body:[]}; mode="mail";
      print(`<span class="p">mail</span> to ${esc(DATA.links.email)}. press ctrl+c to cancel.`); setPrompt(`<span class="c">your name:</span>`); },
    weather:()=>print(`Berkeley, CA\nfoggy, 58°F. bring a hoodie.`),
    git:a=>{ const sub=a.join(" ");
      if(/^log/.test(sub) && !/--career/.test(sub)){ return (async()=>{
          print(`fetching github.com/${esc(DATA.handle)} …`,"m"); inp.disabled=true;
          const j=await api("/api/commits"); inp.disabled=false; inp.focus();
          if(j.commits && j.commits.length){
            j.commits.forEach((c,i)=>print(`<span class="p">${esc(c.sha)}</span> ${i===0?'<span class="ok">(HEAD -> main)</span> ':''}${esc(c.message)} <span class="m">· ${esc(c.repo.split("/").pop())} · ${esc(ago(c.date))}</span>`));
            print(`<span class="m">tip: <span class="p">git log --career</span> shows the résumé version.</span>`);
          } else { print("couldn't reach GitHub, showing the career log instead:","m"); CMDS.git(["log","--career"]); }
        })(); }
      if(/^log/.test(sub)){ const h=t=>{ let x=0x811c9dc5; for(const c of t){ x^=c.charCodeAt(0); x=Math.imul(x,16777619)>>>0; } return x.toString(16).padStart(8,"0").slice(0,7); };
        const commits=[["(HEAD -> main, origin/main)","chore: hide easter eggs in portfolio"]]
          .concat(DATA.experience.map(x=>["",`feat(${x.org.toLowerCase().replace(/[^a-z0-9]+/g,"-")}): ${x.role} (${x.when})`]))
          .concat(DATA.projects.map(p=>[p.award?"(tag: "+p.award.split("·")[0].trim().toLowerCase()+")":"",`feat(projects): ship ${p.name}`]))
          .concat([["","init: start CS @ UC Berkeley"]]);
        commits.forEach(([dec,msg])=>print(`<span class="p">${h(msg)}</span> ${dec?`<span class="ok">${esc(dec)}</span> `:""}${esc(msg)}`)); }
      else if(sub==="status") print("On branch main\nYour branch is up to date with 'origin/career'.\n\nnothing to commit, working tree clean");
      else if(/^(push|commit)/.test(sub)) print("error: permission denied. only Daniel can push to main. (nice try)","e");
      else print("usage: git log | git status","e"); },
    ssh:async a=>{ const t=a[0]||"";
      if(!t) return print("usage: ssh user@host","e");
      if(remote) return print("already connected. type exit to log out first.","e");
      if(!/^daniel@(berkeley\.edu|daniel-os)$/i.test(t)){ await sleep(500); print(`ssh: connect to host ${esc(t.split("@").pop())} port 22: Connection refused`,"e"); return print("hint: ssh daniel@berkeley.edu","m"); }
      whereP=api("/api/whereami"); inp.disabled=true; const fp=Array.from({length:43},()=>"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[Math.random()*64|0]).join("");
      print("Connecting to berkeley.edu port 22 ...","m"); await sleep(600);
      print(`The authenticity of host 'berkeley.edu' can't be established.\nED25519 key fingerprint is SHA256:${fp}.\nAre you sure you want to continue connecting (yes/no)? yes`); await sleep(800);
      print("Warning: Permanently added 'berkeley.edu' (ED25519) to the list of known hosts.","m"); await sleep(500);
      print(`Authenticating with public key "guest@daniel-os" ... <span class="ok">ok</span>`); await sleep(500);
      print("One more thing. What's your name?","c"); mode="ssh-name"; setPrompt(`<span class="c">name:</span>`);
      inp.disabled=false; inp.focus(); },
    whoami:()=>{ if(remote) return print(`<span class="p">${esc(visitor)}</span>, logged in to daniel@berkeley.edu from ${esc(from)}`);
      const f=[["name",DATA.name],["role",DATA.title.replace("Computer Science","CS")],["clearance","root (allegedly)"],["location",DATA.location],["status","<span class=\"ok\">online</span>"],["contact",DATA.links.email]];
      print(`<div class="idcard">${DATA.avatar?`<img class="avatar" src="${esc(DATA.avatar)}" alt="Daniel's pixel portrait" width="144" height="144" style="border:2px solid #7be08a">`:""}<div class="fields"><span class="p">ID CARD // DANIEL_OS</span>\n${f.map(([k,v])=>`<span class="m">${k.padEnd(11)}</span>${k==="status"?v:esc(v)}`).join("\n")}</div></div>`); },
    about:()=>{ CMDS.whoami(); openWin("about"); },
    projects:()=>{ DATA.projects.forEach((p,i)=>print(`  [${i+1}] <span class="p">${esc(p.name)}</span> — ${esc(p.blurb)}  <span class="m">(${p.tech.map(esc).join(", ")})</span>`)); print(`type <span class="p">project 1</span> to open one.`,"m"); openWin("projects"); },
    project:a=>{ const i=parseInt(a[0])-1; if(!openProject(i)) print(`usage: project 1-${DATA.projects.length}`,"e"); else print(`opening ${esc(DATA.projects[i].name)}…`,"ok"); },
    experience:()=>{ DATA.experience.forEach(x=>print(`  <span class="p">${esc(x.role)}</span> @ ${esc(x.org)} <span class="m">(${esc(x.when)})</span>`)); openWin("experience"); },
    skills:()=>{ Object.entries(DATA.skills).forEach(([c,l])=>print(`  <span class="p">${esc(c)}</span>\n    ${l.map(esc).join(" · ")}`)); openWin("skills"); },
    contact:()=>{ const L=DATA.links; print(`  email    <a href="mailto:${esc(L.email)}">${esc(L.email)}</a>\n  linkedin <a href="${esc(L.linkedin)}" target="_blank" rel="noopener">${esc(L.linkedin)}</a>\n  github   <a href="${esc(L.github)}" target="_blank" rel="noopener">${esc(L.github)}</a>`); },
    resume:()=>{ openWin("resume"); print("opening resume.pdf…","ok"); },
    tldr:()=>{ print("switching to recruiter mode…","ok"); setTimeout(()=>location.href="/recruiter?recruiter=true",350); },
    recruiter:()=>CMDS.tldr(),
    open:a=>{ const k=(a[0]||"").replace(/\..*$/,"").replace(/\/$/,""); const m={vault:"secret"}[k]||k; if(APPS[m]) { openWin(m); print(`opening ${m}…`,"ok"); } else print(`open: no such app '${esc(a[0]||"")}'. try: ${Object.keys(APPS).join(", ")}`,"e"); },
    ls:()=>print(`<span class="c">projects/  experience/</span>  about.txt  hobbies.txt  contact.txt  resume.pdf  vault.enc`),
    cat:a=>{ const f=a[0]; if(files[f]) print(esc(files[f]())); else if(f==="resume.pdf") CMDS.resume(); else if(f==="vault.enc") print("binary file — try: open vault","e"); else print(`cat: ${esc(f||"")}: no such file`,"e"); },
    cd:a=>{ const d=(a[0]||"").replace(/\/$/,""); if(d==="projects") CMDS.projects(); else if(d==="experience") CMDS.experience(); else print(`cd: ${esc(a[0]||"~")}: permission denied (nice try)`,"e"); },
    clear:()=>out.innerHTML="",
    history:()=>print(hist.map((h,i)=>`  ${i+1}  ${esc(h)}`).join("\n")),
    date:()=>print(new Date().toString()),
    echo:a=>print(esc(a.join(" "))),
    binary:a=>print(toBin(a.join(" ")||"hello")),
    matrix:()=>print(rain.toggle()?"bear: on":"bear: off","ok"),
    sudo:()=>print(`[sudo] password for guest: \n<span class="e">guest is not in the sudoers file. This incident will be reported.</span>`),
    rm:()=>print("rm: refusing to remove '/' — this portfolio is load-bearing.","e"),
    hack:()=>hack(print),
    exit:()=>{ if(remote){ remote=false; user="guest"; host="daniel-os"; setPrompt(); print(`logout\nConnection to berkeley.edu closed.`,"m"); } else closeWin("terminal"); },
    ping:()=>print("PONG — 0.42 ms (latency to Berkeley: ok)","ok"),
  };
  CMDS.ll=CMDS.ls; CMDS.dir=CMDS.ls; CMDS.cls=CMDS.clear; CMDS["?"]=CMDS.help; CMDS["fun-facts"]=CMDS.funfact; CMDS.funfacts=CMDS.funfact; CMDS.music=CMDS.np; CMDS.spotify=CMDS.np;
  CMDS.reboot=()=>{ print("Broadcast message: the system is going down for reboot NOW!","e"); setTimeout(reboot,700); };
  CMDS.restart=CMDS.reboot;
  CMDS.shutdown=()=>{ print("Broadcast message: the system is going down for power-off NOW!","e"); setTimeout(shutdown,700); };
  CMDS.poweroff=CMDS.shutdown; CMDS.halt=CMDS.shutdown; CMDS.logout=CMDS.exit;
  CMDS.tidy=()=>{ try{ localStorage.removeItem(ICON_POS_KEY); }catch(e){} document.querySelectorAll("#icons .icon").forEach(i=>{ i.style.translate=""; }); print("desktop icons tidied.","ok"); };
  CMDS.clean=()=>{ const v=!document.body.classList.contains("clean"); setClean(v); print(v?"clean mode on: effects off, easier reading.":"clean mode off: effects back on.","ok"); };
  CMDS.screensaver=()=>{ print("starting screensaver…","m"); setTimeout(startSaver,300); };
  CMDS.chime=()=>{ if(!Sound.on) return print("sound is off. it switches on in 8-bit mode (try the Konami code).","m"); campanile(new Date().getHours()%12||12); print("the Campanile chimes.","ok"); };
  inp.addEventListener("keydown",async e=>{
    if(is8() && e.key.length===1) Sound.tone(1400,.02,"square",.02);
    if(e.key==="c" && e.ctrlKey && mode){ e.preventDefault(); print("^C","m"); mode=null; mail=null; setPrompt(); return; }
    if(e.key==="Enter" && mode==="mail"){ e.preventDefault(); const raw=inp.value; inp.value="";
      const steps=[["name","your name:"],["email","your email:"],["subject","subject:"]];
      if(mail.step<3){ const [k]=steps[mail.step]; print(`<span class="c">${steps[mail.step][1]}</span> ${esc(raw)}`); mail.data[k]=raw.trim();
        if(k==="email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail.data.email)){ print("that email doesn't look right, try again.","e"); return; }
        mail.step++;
        if(mail.step<3) setPrompt(`<span class="c">${steps[mail.step][1]}</span>`);
        else { print(`message: end with a single <span class="p">.</span> on its own line`,"m"); setPrompt(`<span class="c">&gt;</span>`); }
        return; }
      if(raw.trim()==="."){ const data={...mail.data,message:mail.body.join("\n")}; mode=null; mail=null; setPrompt();
        if(!data.message.trim()) return print("empty message, not sent.","e");
        inp.disabled=true; print("sending …","m");
        api("/api/mail",data).then(j=>{ inp.disabled=false; inp.focus(); j.error? print(j.error,"e") : print("message sent. Daniel will get back to you soon.","ok"); });
        return; }
      mail.body.push(raw); print(`<span class="c">&gt;</span> ${esc(raw)}`); return; }
    if(e.key==="Enter" && mode==="ssh-name"){ const raw=inp.value.trim(); inp.value=""; mode=null;
      { const w = whereP ? await whereP : {}; from = placeName(w) || "your-browser"; }
      visitor=(raw.replace(/[^\p{L}\p{N} .'-]/gu,"").slice(0,24).trim())||"friend";
      print(`<span class="c">name:</span> ${esc(visitor)}`);
      remote=true; user=visitor.toLowerCase().replace(/\s+/g,"-"); host="berkeley"; setPrompt();
      print(`\n<span class="p">Welcome to daniel@berkeley.edu, ${esc(visitor)}!</span>\nLast login: ${new Date().toDateString()} from ${esc(from)}\n\n * You're in Daniel's remote shell. Most visitors never type ssh on a portfolio.\n * Every normal command still works here. Try <span class="p">git log</span>.\n * Sign the guestbook: <span class="p">sign your message</span>\n * Want to talk? Type <span class="p">contact</span>.\n\nType <span class="p">exit</span> to log out.`);
      if(is8()) Sound.seq([523,659,784],.08); return; }
    if(e.key==="Enter"){ busy(180); const raw=inp.value.trim(); inp.value=""; print(`<span class="p">${prompt()}</span> ${esc(raw)}`);
      if(!raw) return; hist.push(raw); hi=hist.length; const [c,...a]=raw.split(/\s+/); const f=CMDS[c.toLowerCase()];
      f? f(a) : print(`command not found: ${esc(c)} — type <span class="p">help</span>`,"e"); }
    else if(e.key==="ArrowUp"){ if(hi>0){hi--; inp.value=hist[hi];} e.preventDefault(); }
    else if(e.key==="ArrowDown"){ if(hi<hist.length){hi++; inp.value=hist[hi]||"";} e.preventDefault(); }
    else if(e.key==="Tab"){ e.preventDefault(); const v=inp.value; const m=Object.keys(CMDS).filter(k=>k.startsWith(v)); if(m.length===1) inp.value=m[0]+" "; else if(m.length>1) print(m.join("  "),"m"); }
    else if(e.key==="l"&&e.ctrlKey){ e.preventDefault(); out.innerHTML=""; }
  });
  setTimeout(()=>inp.focus(),50);
}
async function hack(print){
  const steps=["[*] scanning 10.0.0.0/24 ...","[*] found host: recruiter-laptop.local","[*] port 443 open (https)","[*] bypassing firewall ...","[*] injecting payload: portfolio.exe","[*] decrypting ... "+Array.from({length:4},()=>toHex(Math.random()*65535|0)).join(" ")];
  rain.boost(4);
  for(const s of steps){ print(s,"c"); await sleep(380); }
  let bar=""; const line=el("div",{class:"ok"}); print(""); const outs=document.querySelectorAll(".term .out"); outs[outs.length-1].appendChild(line);
  for(let i=0;i<=20;i++){ bar="█".repeat(i)+"░".repeat(20-i); line.textContent=`[${bar}] ${i*5}%`; await sleep(60); }
  rain.boost(1);
  print(`<span class="ok">ACCESS GRANTED.</span> Just kidding — this is a portfolio, not an exploit.\nBut if you liked that, type <span class="p">contact</span>.`);
  const ov=$("#overlay"); ov.innerHTML=`${DATA.avatar?`<img class="avatar" src="${esc(DATA.avatar)}" alt="" width="260" height="260" style="border:3px solid #7be08a;box-shadow:0 0 40px rgba(123,224,138,.4)">`:""}<div class="big glow">ACCESS GRANTED</div><div style="color:#7be08a">operator identified: daniel</div><div style="color:var(--dim);font-size:18px">${toBin("HIRE DANIEL")}</div>`; ov.style.display="flex"; setTimeout(()=>ov.style.display="none",2800);
}

/* ---------- desktop / taskbar ---------- */
function showDesktop(){
  $("#desktop").style.display="block"; $("#taskbar").style.display="flex";
  if(desktopReady){
    if(!mobile()) setTimeout(()=>openWin("terminal",{x:Math.max(140,innerWidth*.5-420),y:Math.max(40,innerHeight*.38)}),300);
      if(pendingOpen){ const o=pendingOpen; pendingOpen=null; setTimeout(()=>openFromDisk(o),700); }
    return;
  }
  const ic=$("#icons");
  ICON_ORDER.forEach(id=>{ const b=el("button",{class:"icon","aria-label":"Open "+LABELS[id]},`${ICONS[APPS[id].icon]}<span>${LABELS[id]}</span>`); b.onclick=()=>openWin(id); makeIconDraggable(b,id); ic.appendChild(b); });
  const sm=$("#startmenu");
  if(DATA.avatar){ const side=sm.querySelector(".side"); side.classList.add("me");
    side.innerHTML=`<img class="avatar" src="${esc(DATA.avatar)}" alt="" width="56" height="56" style="border:2px solid var(--navy)"><div class="who">${esc(DATA.handle==="djbantay"?"daniel":DATA.handle)}<small>CS @ Berkeley</small></div>`; }
  ICON_ORDER.forEach(id=>{ const b=el("button",{role:"menuitem"},"› "+LABELS[id]); b.onclick=()=>{openWin(id); sm.style.display="none";}; sm.appendChild(b); });
  const rb=el("button",{role:"menuitem"},"› restart"); rb.onclick=()=>{ sm.style.display="none"; reboot(); }; sm.appendChild(rb);
  const sd=el("button",{role:"menuitem"},"› shut down"); sd.onclick=()=>{ sm.style.display="none"; shutdown(); }; sm.appendChild(sd);
  $("#start").onclick=e=>{ e.stopPropagation(); sm.style.display = sm.style.display==="block"?"none":"block"; };
  document.addEventListener("click",e=>{ if(!sm.contains(e.target)) sm.style.display="none"; });
  if(!mobile()) setTimeout(()=>openWin("terminal",{x:Math.max(140,innerWidth*.5-420),y:Math.max(40,innerHeight*.38)}),300);
  loadHits(); loadNowPlaying();
  desktopReady=true; if(pendingOpen){ const o=pendingOpen; pendingOpen=null; setTimeout(()=>openFromDisk(o),700); }
}
let replayBoot=false;
function reboot(){
  try{ sessionStorage.removeItem("booted"); }catch(e){} document.body.classList.remove("booted");
  if(is8()) toggle8bit();
  replayBoot=true;
  if(Intro.available()) return Intro.powerOff({reboot:true});
  // phones (no computer intro): close everything and replay the boot screen
  Object.keys(wins).forEach(id=>closeWin(id)); replayBoot=false; boot();
}
function shutdown(){ if(Intro.available()) return Intro.powerOff();
  const ov=$("#overlay"); ov.innerHTML=`<div class="big glow">It's now safe to turn off<br>your computer.</div><div style="color:var(--dim)">click to reboot</div>`; ov.style.display="flex";
  ov.onclick=()=>{ ov.style.display="none"; ov.onclick=null; };
}
setInterval(()=>{ const d=new Date(); $("#clock").textContent=d.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}); $("#trayBits").textContent=(d.getSeconds()).toString(2).padStart(6,"0"); },1000);
// hero binary shimmer
setInterval(()=>{ const s=toBin("DB").split(""); for(let k=0;k<3;k++){ const i=Math.random()*s.length|0; if(s[i]!==" ") s[i]=Math.random()<.5?"0":"1"; } $("#heroBits").textContent=s.join(""); },700);

/* ---------- click name 5x → binary scramble ---------- */
let nameClicks=0, nameT, scrambling=false;
$("#hero h1").addEventListener("click",()=>{ nameClicks++; clearTimeout(nameT); nameT=setTimeout(()=>nameClicks=0,1500); if(nameClicks>=5){ nameClicks=0; scrambleName(); } });
async function scrambleName(){
  if(scrambling) return; scrambling=true; const h=$("#hero h1"), L=["DANIEL","BANTAY"], bit=()=>Math.random()<.5?"0":"1";
  for(let i=0;i<14;i++){ h.innerHTML=L.map(l=>[...l].map(bit).join("")).join("<br>"); if(is8()||Sound.on) Sound.tone(600+Math.random()*600,.03,"square",.02); await sleep(55); }
  h.style.fontSize="clamp(13px,1.55vw,24px)"; h.style.lineHeight="1.35"; h.innerHTML=L.map(toBin).join("<br>"); await sleep(1500);
  h.style.fontSize=""; h.style.lineHeight="";
  for(let k=0;k<=6;k++) for(let r=0;r<4;r++){ h.innerHTML=L.map(l=>l.slice(0,k)+[...l.slice(k)].map(bit).join("")).join("<br>"); await sleep(35); }
  h.innerHTML="DANIEL<br>BANTAY"; if(Sound.on) Sound.seq([784,1047],.08); scrambling=false;
}

/* ---------- Konami code → 8-bit mode ---------- */
const KON=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"]; let kp=0;
addEventListener("keydown",e=>{
  const k=e.key.length===1?e.key.toLowerCase():e.key;
  if(k===KON[kp]) kp++; else kp = (k==="ArrowUp") ? (kp===2?2:1) : 0;
  if(kp===KON.length){ kp=0; toggle8bit(); }
});
function toggle8bit(){
  const on=document.body.classList.toggle("eightbit");
  if(on){ setSound(true); rain.setColors({head:"#FFEC27"}); Sound.seq([523,659,784,1047,0,784,1047],.08); }
  else { rain.setColors({head:"#FDB515"}); Sound.seq([1047,784,659,523],.08); }
  const ov=$("#overlay"); ov.innerHTML=`<div class="big glow">8-BIT MODE: ${on?"ON":"OFF"}</div><div style="color:var(--dim)">${on?"enter the code again to exit":"back to normal"}</div>`; ov.style.display="flex";
  clearTimeout(toggle8bit.t); toggle8bit.t=setTimeout(()=>ov.style.display="none",1500);
}

/* ---------- idle screensaver (DVD-style DANIEL_OS logo) ---------- */
let lastAct=Date.now(), saverOn=false, sb={x:80,y:80,vx:2.4,vy:1.9,c:0};
const SAVER_COLORS=["#FDB515","#3B7EA1","#E9E4D4","#7be08a","#ff7a6b","#FF77A8"];
const sBear=$("#saverBear"); sBear.textContent="DANIEL_OS";
function startSaver(){ const ir=$("#intro"); if(ir && document.body.contains(ir) && ir.style.display!=="none") return; if(saverOn||!$("#desktop")||$("#desktop").style.display!=="block") return; saverOn=true; document.body.classList.add("saver"); rain.boost(2.2);
  const scr=$("#screen"); sb.x=Math.random()*(scr.clientWidth-160); sb.y=Math.random()*(scr.clientHeight-100); sBear.style.color=SAVER_COLORS[0]; requestAnimationFrame(saverTick); }
function stopSaver(){ if(!saverOn) return; saverOn=false; document.body.classList.remove("saver"); rain.boost(1); }
let sFrame=0;
function saverTick(){
  if(!saverOn) return; const scr=$("#screen"), W=scr.clientWidth-sBear.offsetWidth, H=scr.clientHeight-sBear.offsetHeight; let hx=false, hy=false;
  sb.x+=sb.vx; sb.y+=sb.vy;
  if(sb.x<=0||sb.x>=W){ sb.vx*=-1; sb.x=Math.max(0,Math.min(W,sb.x)); hx=true; }
  if(sb.y<=0||sb.y>=H){ sb.vy*=-1; sb.y=Math.max(0,Math.min(H,sb.y)); hy=true; }
  if(hx||hy){ sb.c=(sb.c+1)%SAVER_COLORS.length; sBear.style.color=SAVER_COLORS[sb.c]; Sound.tone(hx&&hy?1047:392,.06,"square",.03); }
  if(hx&&hy){ const ov=$("#saverHint"); ov.textContent="* CORNER HIT *"; setTimeout(()=>ov.textContent="move the mouse or press any key to wake",2000); }
  sBear.style.left=sb.x+"px"; sBear.style.top=sb.y+"px"; requestAnimationFrame(saverTick);
}
["mousemove","pointerdown","keydown","wheel","touchstart"].forEach(ev=>addEventListener(ev,()=>{ lastAct=Date.now(); stopSaver(); },{passive:true}));
setInterval(()=>{ if(!saverOn && Date.now()-lastAct>60000) startSaver(); },1000);

/* ---------- sound toggle + Campanile chimes ---------- */
$("#pwr").onclick=()=>reboot();
$("#fx").onclick=()=>setClean(!document.body.classList.contains("clean"));
function campanile(hour){
  if(!Sound.on) return; const ph=[659.25,523.25,587.33,392.0]; ph.forEach((f,i)=>Sound.bell(f,i*.75));
  const ck=$("#clock"), start=3.6;
  for(let i=0;i<hour;i++){ Sound.bell(196,start+i*1.4); setTimeout(()=>{ ck.classList.add("ding"); setTimeout(()=>ck.classList.remove("ding"),500); },(start+i*1.4)*1000); }
}
let lastChime=-1;
setInterval(()=>{ const d=new Date(); if(d.getMinutes()===0 && d.getHours()!==lastChime){ lastChime=d.getHours(); campanile(d.getHours()%12||12); } },1000);

/* ================= approximate location (ssh "Last login from …") ================= */
function placeName(w){
  if(!w || !w.city) return w && w.country ? regionName(w.country) : "";
  if(w.country==="US") return w.region ? `${w.city}, ${w.region}` : w.city;
  return `${w.city}, ${regionName(w.country)}`;
}
function regionName(code){ try{ return new Intl.DisplayNames(["en"],{type:"region"}).of(code) || code; }catch(e){ return code; } }

/* ================= Spotify now playing (taskbar) ================= */
async function loadNowPlaying(){
  const a=$("#np"); if(!a) return;
  const j=await api("/api/now-playing");
  if(j.error || !j.configured || !j.track){ a.hidden=true; return; }
  const t=j.track, txt=`${t.title} — ${t.artist}`;
  a.hidden=false; a.classList.toggle("playing",!!t.playing);
  a.href=t.url||"#"; a.title=(t.playing?"Daniel is listening to: ":"Daniel last played: ")+txt;
  a.innerHTML=`<span class="eq"><i></i><i></i><i></i></span>${t.playing?"":'<span class="lbl">last:</span>'}<span class="scroll"><span>${esc(txt)}</span></span>`;
  const sc=a.querySelector(".scroll"); if(sc.scrollWidth>sc.clientWidth+2){ sc.classList.add("go"); sc.firstChild.insertAdjacentHTML("afterend",`<span>${esc(txt)}</span>`); }
}
setInterval(()=>{ if(desktopReady && !document.hidden) loadNowPlaying(); },45000);
document.addEventListener("visibilitychange",()=>{ if(desktopReady && !document.hidden) loadNowPlaying(); });

/* ================= 90s hit counter ================= */
async function loadHits(){
  let counted=false; try{ counted=!!sessionStorage.getItem("counted"); }catch(e){}
  const j = counted ? await api("/api/hits") : await api("/api/hits",{});
  if(j.error) return; try{ sessionStorage.setItem("counted","1"); }catch(e){}
  const el2=$("#hits"); if(!el2) return;
  el2.innerHTML="<b>visitors</b>"+String(j.count).padStart(6,"0").split("").map(d=>`<i>${d}</i>`).join("");
}

/* ================= busy light ================= */
function busy(ms=150){ const b=$("#busy"); if(!b) return; b.classList.add("on"); clearTimeout(busy.t); busy.t=setTimeout(()=>b.classList.remove("on"),ms); }

/* ================= INTRO: DB-1 computer ================= */
let pendingOpen=null, desktopReady=false;
function openFromDisk(o){
  openWin(o);
}
function sfx(fn){ const w=Sound.on; Sound.on=true; try{ fn(); }finally{ Sound.on=w; } }

/* ================= DB-1 isometric pixel-art computer (drawn in code) ================= */
const PC=(()=>{
  const S=6, W=144, H=128, OX=80, OY=58;
  const P=(x,y,z)=>[OX+(x-y), OY+(x+y)/2-z];
  const px=(x,y,z)=>{ const [a,b]=P(x,y,z); return [a*S,b*S]; };
  const hex=h=>{ const n=parseInt(h.slice(1),16); return [n>>16&255,n>>8&255,n&255,255]; };
  function Img(){
    const d=new Uint8ClampedArray(W*H*4);
    const set=(x,y,c)=>{ if(x<0||y<0||x>=W||y>=H) return; d.set(c,(y*W+x)*4); };
    const inside=(qx,qy,pts)=>{ let c=false; for(let i=0,j=pts.length-1;i<pts.length;j=i++){ const [xi,yi]=pts[i],[xj,yj]=pts[j]; if((yi>qy)!==(yj>qy) && qx<(xj-xi)*(qy-yi)/(yj-yi)+xi) c=!c; } return c; };
    function poly(pts,col,pat){ const c=hex(col), c2=pat&&hex(pat[0]); const xs=pts.map(q=>q[0]), ys=pts.map(q=>q[1]);
      for(let y=Math.floor(Math.min(...ys));y<=Math.ceil(Math.max(...ys));y++) for(let x=Math.floor(Math.min(...xs));x<=Math.ceil(Math.max(...xs));x++)
        if(inside(x+.5,y+.5,pts)) set(x,y,(pat&&pat[1](x,y))?c2:c); }
    function line(a,b,col){ const c=hex(col); let [x0,y0]=a.map(Math.round), [x1,y1]=b.map(Math.round);
      const dx=Math.abs(x1-x0), dy=-Math.abs(y1-y0), sx=x0<x1?1:-1, sy=y0<y1?1:-1; let e=dx+dy;
      for(;;){ set(x0,y0,c); if(x0===x1&&y0===y1) break; const e2=2*e; if(e2>=dy){e+=dy;x0+=sx;} if(e2<=dx){e+=dx;y0+=sy;} } }
    function curve(p0,p1,p2,p3,col){ let prev=p0; for(let t=.025;t<=1.0001;t+=.025){ const u=1-t;
      const q=[0,1].map(i=>u*u*u*p0[i]+3*u*u*t*p1[i]+3*u*t*t*p2[i]+t*t*t*p3[i]); line(prev,q,col); prev=q; } }
    function outline(col){ const c=hex(col), a=new Uint8Array(W*H); for(let i=0;i<W*H;i++) a[i]=d[i*4+3];
      const on=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&a[y*W+x];
      for(let y=0;y<H;y++) for(let x=0;x<W;x++) if(!a[y*W+x] && (on(x-1,y)||on(x+1,y)||on(x,y-1)||on(x,y+1))) set(x,y,c); }
    function paint(cv){ cv.width=W; cv.height=H; cv.getContext("2d").putImageData(new ImageData(d,W,H),0,0); }
    return {poly,line,curve,outline,paint};
  }
  const C={top:"#f7f6f2",top2:"#dbe3f7",left:"#dbd7cf",left2:"#cfcac1",right:"#aca69d",right2:"#9f998f",dark:"#6b665f",hl:"#ffffff",
           ink:"#16161a",bez:"#2b303b",scr:"#0a1a33",kb:"#b9b3a9",key:"#ffffff",cable:"#efefef"};
  const dith=m=>(x,y)=>(((Math.imul(x,73856093)^Math.imul(y,19349663))>>>0)%m===0);
  function box(g,x0,x1,y0,y1,z0,z1,o={}){
    g.poly([P(x1,y0,z1),P(x1,y1,z1),P(x1,y1,z0),P(x1,y0,z0)],o.right||C.right,[C.right2,dith(11)]);
    g.poly([P(x0,y1,z1),P(x1,y1,z1),P(x1,y1,z0),P(x0,y1,z0)],o.left||C.left,[C.left2,dith(13)]);
    g.poly([P(x0,y0,z1),P(x1,y0,z1),P(x1,y1,z1),P(x0,y1,z1)],o.top||C.top,o.flat?null:[C.top2,dith(17)]);
    g.line(P(x0,y1,z1),P(x1,y1,z1),C.hl); g.line(P(x1,y0,z1),P(x1,y1,z1),C.hl); g.line(P(x1,y1,z1),P(x1,y1,z0),"#eeebe5");
  }
  const rL=(g,Y,xa,xb,za,zb,c)=>g.poly([P(xa,Y,zb),P(xb,Y,zb),P(xb,Y,za),P(xa,Y,za)],c);
  const rR=(g,X,ya,yb,za,zb,c)=>g.poly([P(X,ya,zb),P(X,yb,zb),P(X,yb,za),P(X,ya,za)],c);
  const rT=(g,Z,xa,xb,ya,yb,c)=>g.poly([P(xa,ya,Z),P(xb,ya,Z),P(xb,yb,Z),P(xa,yb,Z)],c);

  function drawMain(cv){
    const g=Img();
    const k0=P(4,52,1), k3=P(0,26,8); g.curve(k0,[k0[0]-26,k0[1]-4],[k3[0]-24,k3[1]+10],k3,C.cable);      // keyboard cable
    const m0=P(58,58,1), b0=P(52,22,4); g.curve(m0,[m0[0]+12,m0[1]-12],[b0[0]+20,b0[1]+10],b0,C.cable);   // mouse cable
    box(g,0,52,0,44,0,10);                                                     // system unit
    for(let x=5;x<=20;x+=3) rL(g,44,x,x+1,2,8,C.dark);                          // front vents
    rL(g,44,28,48,2.5,7.5,"#f1ede5");                                           // label plate
    rR(g,52,8,30,5,7,C.ink);                                                    // floppy slot
    rR(g,52,33,35,5.5,7,C.dark);                                                // drive LED housing
    rR(g,52,36.5,42.5,1.5,4.5,C.dark); rR(g,52,37,42,2,4,"#ece8e0");           // power button
    box(g,18,34,14,30,10,13);                                                   // neck
    box(g,2,52,6,40,13,55);                                                     // monitor
    rL(g,40,6,48,17,52,C.bez);                                                  // bezel recess
    rL(g,40,8,46,19,50,C.scr);                                                  // glass
    [[8,"#003262"],[10,"#FDB515"],[12,"#003262"],[14,"#FDB515"]].forEach(([x,c])=>rL(g,40,x,x+1.5,13.5,16,c));  // Berkeley stripes
    rL(g,40,44,47,14,15.5,C.dark);                                              // power LED housing
    for(let y=12;y<=32;y+=4) rR(g,52,y,y+1,28,47,C.dark);                       // side vents
    for(let x=14;x<=42;x+=4) rT(g,55,x,x+2,9,10.2,"#c9c4bb");                   // top vents
    box(g,0,44,52,66,0,3,{top:C.kb,flat:true});                                           // keyboard
    for(let r=0;r<3;r++) for(let c=0;c<14;c++){ const x=1+c*3, y=53.5+r*3.2; rT(g,3,x,x+2,y,y+2,C.key); }
    rT(g,3,10,32,63,65,C.key);                                                  // space bar
    g.outline(C.ink); g.paint(cv);
  }
  function drawMouse(cv){ const g=Img(); box(g,54,62,58,68,0,3); rT(g,3,57.7,58.3,58,62,C.dark); rT(g,3,54,62,61.7,62.3,C.dark); g.outline(C.ink); g.paint(cv); }
  function place(el,origin,wUnits,hUnits){ const [x,y]=px(...origin); el.style.left=x+"px"; el.style.top=y+"px"; el.style.width=wUnits*S+"px"; el.style.height=hUnits*S+"px"; }
  function build(){
    drawMain($("#pcMain")); drawMouse($("#mouse"));
    place($("#introScreen"),[8,40,50],38,31);
    place($("#pled"),[44,40,15.5],3,1.5);
    place($("#pcLabel"),[28,44,7.5],20,5);
    place($("#slot"),[52,30,7],22,2);
    place($("#dled"),[52,35,7],2,1.5);
    place($("#powerBtn"),[52,42.5,4.5],6,3);
  }
  /* keys: light up the key you type */
  const KM={}; "qwertyuiop[]".split("").forEach((c,i)=>KM[c]=[0,i+1]); "1234567890-=".split("").forEach((c,i)=>KM[c]=[0,i+1]);
  KM.tab=[0,0]; KM.backspace=[0,13]; "asdfghjkl;'".split("").forEach((c,i)=>KM[c]=[1,i+1]); KM.control=KM.capslock=[1,0]; KM.enter=[1,13];
  "zxcvbnm,./".split("").forEach((c,i)=>KM[c]=[2,i+2]); KM.shift=[2,0];
  function flashKey(key){
    const f=el("div",{class:"iso isoT keyflash"});
    if(key===" "){ place(f,[10,63,3],22,2); }
    else { const h=[...key].reduce((n,ch)=>n+ch.charCodeAt(0),0), [r,c]=KM[key]||[h%3,h%14]; place(f,[1+c*3,53.5+r*3.2,3],2,2); }
    $("#kb").appendChild(f); setTimeout(()=>f.remove(),300);
  }
  return {build,flashKey,S};
})();
PC.build();

const Intro=(()=>{
  const root=$("#intro"), zoom=$("#introZoom"), stage=$("#stage"), scr=$("#introScreen"), out=$("#ibash"), cur=$("#icur"),
        pled=$("#pled"), dled=$("#dled"), slot=$("#slot"), kb=$("#kb"), mouse=$("#mouse");
  let active=false, ready=false, skipScript=false, buf="", powering=false, k=1;
  const PROMPT=`<span class="p">daniel@db-1</span>:<span class="c">~</span>$ `;
  const available=()=>true;

  const press=key=>PC.flashKey(key);

  function fit(){ k=Math.min(innerWidth/1060,(innerHeight-60)/900); stage.style.transform=`translate(-50%,-50%) scale(${k})`; }
  addEventListener("resize",()=>{ if(active) fit(); });

  /* bash on the little screen */
  function line(html,cls){ out.insertBefore(el("div",cls?{class:cls}:{},html),cur); while(out.children.length>15) out.removeChild(out.firstChild); }
  function drawCur(){ cur.innerHTML=PROMPT+esc(buf)+`<span class="caret"></span>`; }
  function blink(led,ms=90){ led.classList.add("busy"); clearTimeout(led.t); led.t=setTimeout(()=>led.classList.remove("busy"),ms); }
  async function typeCmd(cmd){ cur.innerHTML=PROMPT; for(const ch of cmd){ if(skipScript) break; cur.innerHTML+=esc(ch); press(ch); blink(dled,60); await sleep(70+Math.random()*60); }
    line(PROMPT+esc(cmd)); cur.innerHTML=""; await sleep(skipScript?0:180); }
  async function script(){
    ready=false; skipScript=false; out.querySelectorAll("div:not(#icur)").forEach(d=>d.remove());
    line(`Last login: ${new Date().toString().slice(0,24)} on ttys001`,"m");
    const steps=[["whoami",[["daniel bantay · cs @ uc berkeley",""]]],
                 ["ls ~/disks",[["<span class='c'>PROJECTS.DSK</span>  <span class='c'>RESUME.DSK</span>  <span class='c'>ABOUT.DSK</span>",""]]],
                 ["cat README",[["insert a disk, press POWER, or run <span class='p'>./power_on.sh</span>","ok"]]]];
    for(const [c,outs] of steps){ await sleep(skipScript?0:450); await typeCmd(c); outs.forEach(([h,cl])=>line(h,cl)); }
    ready=true; buf=""; drawCur();
  }
  function run(cmd){
    line(PROMPT+esc(cmd)); const c=cmd.trim(); if(!c) return;
    const [n,...a]=c.split(/\s+/);
    if(/^(\.\/power_on\.sh|power_on\.sh|power|start|boot|startx|login|sudo)$/i.test(n)) return powerOn();
    if(n==="ls") return line("<span class='c'>PROJECTS.DSK</span>  <span class='c'>RESUME.DSK</span>  <span class='c'>ABOUT.DSK</span>  power_on.sh");
    if(n==="whoami") return line("daniel bantay · cs @ uc berkeley");
    if(n==="clear"){ out.querySelectorAll("div:not(#icur)").forEach(d=>d.remove()); return; }
    if(n==="help") return line("commands: ./power_on.sh · ls · whoami · clear · mount DISK");
    if(n==="mount"||n==="open"){ const d=(a[0]||"").toLowerCase().replace(/\.dsk$/,""); const disk=stage.querySelector(`.disk[data-open="${d}"]`); if(disk) return insert(disk); return line(`mount: ${esc(a[0]||"")}: no such disk`,"e"); }
    if(n==="cat"&&/readme/i.test(a[0]||"")) return line("insert a disk, press POWER, or run <span class='p'>./power_on.sh</span>","ok");
    line(`bash: ${esc(n)}: command not found. try <span class="p">./power_on.sh</span>`,"e");
  }

  /* keyboard while intro is up (captures before the site's handlers) */
  addEventListener("keydown",e=>{
    if(!active) return; e.stopImmediatePropagation();
    if(e.metaKey||e.ctrlKey) return;
    const key=e.key===" "?" ":e.key.length===1?e.key.toLowerCase():e.key.toLowerCase();
    press(key); if(e.key.length===1) blink(dled,50);
    if(Sound.on) Sound.tone(1600+Math.random()*300,.015,"square",.02);
    if(powering) return;
    if(!ready){ skipScript=true; return; }
    if(e.key==="Enter"){ e.preventDefault(); const c=buf; buf=""; run(c); if(!powering) drawCur(); }
    else if(e.key==="Backspace"){ e.preventDefault(); buf=buf.slice(0,-1); drawCur(); }
    else if(e.key.length===1 && buf.length<48){ e.preventDefault(); buf+=e.key; drawCur(); }
  },true);

  /* mouse follows the cursor a little */
  let mdx=0, mdy=0;
  root.addEventListener("pointermove",e=>{ mdx=Math.round((e.clientX/innerWidth-.5)*2)*PC.S; mdy=Math.round((e.clientY/innerHeight-.5)*2)*PC.S/2; mouse.style.transform=`translate(${mdx}px,${mdy}px)`; });
  root.addEventListener("pointerdown",()=>{ mouse.style.transform=`translate(${mdx}px,${mdy+PC.S}px)`; setTimeout(()=>mouse.style.transform=`translate(${mdx}px,${mdy}px)`,120); });

  /* floppy disks: drag into the slot (or click / Enter) */
  const disks=[...stage.querySelectorAll(".disk")];
  disks.forEach(d=>d.dataset.rest=d.style.transform);
  const overSlot=(x,y)=>{ const r=slot.getBoundingClientRect(), m=70*k; return x>r.left-m&&x<r.right+m&&y>r.top-m*1.4&&y<r.bottom+m; };
  let drag=null;
  disks.forEach(d=>{
    d.addEventListener("pointerdown",e=>{ if(powering) return; e.preventDefault(); e.stopPropagation(); try{ d.setPointerCapture(e.pointerId); }catch(_){} drag={d,sx:e.clientX,sy:e.clientY,moved:false}; d.classList.add("lift"); });
    d.addEventListener("pointermove",e=>{ if(!drag||drag.d!==d) return; const dx=(e.clientX-drag.sx)/k, dy=(e.clientY-drag.sy)/k;
      if(Math.hypot(dx,dy)>5) drag.moved=true; d.style.transform=`translate(${dx}px,${dy}px) rotate(${Math.max(-12,Math.min(12,dx/25))}deg) scale(1.05)`;
      slot.classList.toggle("hot",overSlot(e.clientX,e.clientY)); });
    d.addEventListener("pointerup",e=>{ if(!drag||drag.d!==d) return; const moved=drag.moved; drag=null; d.classList.remove("lift"); slot.classList.remove("hot");
      if(!moved || overSlot(e.clientX,e.clientY)) insert(d); else d.style.transform=d.dataset.rest; });
    d.addEventListener("keydown",e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); insert(d); } });
  });
  async function insert(d){
    if(powering) return; powering=true;
    const r=d.getBoundingClientRect(), sr=slot.getBoundingClientRect();
    const cur0=new DOMMatrix(getComputedStyle(d).transform);
    const dx=(sr.left+sr.width/2-(r.left+r.width/2))/k + cur0.m41, dy=(sr.top-(r.top+r.height))/k + cur0.m42 + 20;
    d.style.transition="transform .35s ease-out"; d.style.transform=`translate(${dx}px,${dy}px) rotate(0deg)`;
    await sleep(380);
    d.style.transition="transform .3s ease-in,opacity .3s"; d.style.transform=`translate(${dx}px,${dy+70}px) scaleY(.12)`; d.style.opacity="0";
    sfx(()=>{ [0,.09,.18,.32,.41,.55].forEach((t,i)=>Sound.tone(i%2?160:220,.035,"square",.05,t)); Sound.tone(70,.5,"sawtooth",.02,.1); });
    for(let i=0;i<10;i++){ blink(dled,70); await sleep(90); }
    const name=d.dataset.open.toUpperCase();
    line(PROMPT+"mount /dev/fd0"); line(`mounted <span class="c">${name}.DSK</span> at /Volumes/${name} <span class="ok">[OK]</span>`);
    pendingOpen=d.dataset.open; powering=false; powerOn();
  }

  /* power on → zoom into the screen */
  async function powerOn(){
    if(powering) return; powering=true; ready=false;
    $("#powerBtn").classList.add("down"); setTimeout(()=>$("#powerBtn").classList.remove("down"),150);
    sfx(()=>{ Sound.tone(90,.18,"square",.08); Sound.tone(55,1.2,"sawtooth",.025,.05); Sound.tone(7800,.9,"sine",.006,.1); });
    pled.classList.add("on"); line(PROMPT+"./power_on.sh"); line("starting DANIEL_OS …","ok"); cur.innerHTML="";
    scr.classList.remove("flash"); void scr.offsetWidth; scr.classList.add("flash");
    await sleep(650);
    const r=scr.getBoundingClientRect(), s=Math.max(innerWidth/r.width,innerHeight/r.height)*1.06;
    const tx=innerWidth/2-(r.left+r.width/2)*s, ty=innerHeight/2-(r.top+r.height/2)*s;
    zoom.classList.add("zooming"); zoom.style.transform=`translate(${tx}px,${ty}px) scale(${s})`;
    await sleep(1150); root.style.opacity="0"; await sleep(400);
    root.style.display="none"; active=false; powering=false; zoom.classList.remove("zooming"); zoom.style.transform="";
    try{ sessionStorage.setItem("introSeen","1"); }catch(e){}
    if(!desktopReady || replayBoot){ replayBoot=false; boot(); } else if(pendingOpen){ const o=pendingOpen; pendingOpen=null; setTimeout(()=>openFromDisk(o),300); }
  }

  /* shut down → zoom back out */
  async function powerOff(opts={}){
    Object.keys(wins).forEach(id=>closeWin(id));
    root.style.display="block"; root.style.opacity="1"; active=true; fit();
    out.querySelectorAll("div:not(#icur)").forEach(d=>d.remove());
    if(opts.reboot){ line("Broadcast message from daniel@db-1:","m"); line("The system is going down for reboot NOW!","e"); line("[  OK  ] Stopped daniel-os.service","ok"); line("[  OK  ] Unmounted /Volumes/*","ok"); line("press <span class='p'>POWER</span> or run <span class='p'>./power_on.sh</span> to start again","m"); }
    else { line("Broadcast message from daniel@db-1:","m"); line("The system is going down for power-off NOW!","e"); line("logout","m"); line("Connection closed. Thanks for visiting.","ok"); }
    cur.innerHTML="";
    zoom.classList.remove("zooming"); zoom.style.transform="";
    const r=scr.getBoundingClientRect(), s=Math.max(innerWidth/r.width,innerHeight/r.height)*1.06;
    zoom.style.transform=`translate(${innerWidth/2-(r.left+r.width/2)*s}px,${innerHeight/2-(r.top+r.height/2)*s}px) scale(${s})`;
    void zoom.offsetWidth; zoom.classList.add("zooming"); zoom.style.transform="";
    await sleep(1300); zoom.classList.remove("zooming");
    pled.classList.remove("on");
    disks.forEach(d=>{ d.style.transition="none"; d.style.opacity="1"; d.style.transform=d.dataset.rest; void d.offsetWidth; d.style.transition=""; });
    await sleep(500); line("");
    ready=true; buf=""; drawCur();
  }

  function start(){
    if(innerWidth<=720) $("#ihint").innerHTML="tap the screen to turn it on · or drag a disk into the drive";
    active=true; fit(); script();
  }
  scr.addEventListener("click",()=>{ if(!powering) powerOn(); });
  $("#powerBtn").addEventListener("click",e=>{ e.stopPropagation(); if(!powering) powerOn(); });
  $("#skipIntro").addEventListener("click",()=>{ if(powering) return; powering=false; root.style.display="none"; active=false; if(!desktopReady||replayBoot){ replayBoot=false; boot(); } });
  return { start, powerOff, available:()=>document.body.contains(root) };
})();

if(location.hash==="#desktop"){ const ir=$("#intro"); if(ir){ ir.style.display="none"; } history.replaceState(null,"",location.pathname); boot(); }
else Intro.start();
