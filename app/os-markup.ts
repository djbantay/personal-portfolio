// Static markup for the DB-1 desktop. Behaviour lives in /public/os.js.
export const OS_MARKUP = `
<div id="intro" aria-label="DB-1 computer intro">
  <button id="skipIntro">skip intro →</button>
  <div id="introZoom"><div id="stage">
    <div id="diskHint">drag a disk<br>into the drive ↘</div>
    <div class="disk" data-open="projects" tabindex="0" role="button" aria-label="Insert PROJECTS disk" style="top:120px;--dc:#123a66;transform:rotate(-6deg)"><div class="body"></div><div class="sh"></div><div class="lb">PROJECTS<small>.DSK · 3 items</small></div></div>
    <div class="disk" data-open="resume" tabindex="0" role="button" aria-label="Insert RESUME disk" style="top:285px;left:58px;--dc:#8a5a0c;--lc:#003262;transform:rotate(4deg)"><div class="body"></div><div class="sh"></div><div class="lb">RESUME<small>.DSK · 1 page</small></div></div>
    <div class="disk" data-open="bear" tabindex="0" role="button" aria-label="Insert BEAR disk" style="top:450px;left:40px;--dc:#1a1d24;transform:rotate(-3deg)"><div class="body"></div><div class="sh"></div><div class="lb">BEAR<small>.DSK · ???</small></div></div>
    <div id="pc">
      <canvas id="pcMain"></canvas>
      <div id="kb"></div>
      <canvas id="mouse"></canvas>
      <div class="iso isoL" id="introScreen" role="button" aria-label="Turn on computer"><div id="ibash"><div id="icur"></div></div></div>
      <div class="iso isoL pix" id="pled"></div>
      <div class="iso isoL" id="pcLabel">DB-1</div>
      <div class="iso isoR" id="slot" aria-label="floppy drive"></div>
      <div class="iso isoR pix" id="dled"></div>
      <button class="iso isoR" id="powerBtn" aria-label="Power"></button>
      <div class="zz"><span>z</span><span>Z</span><span>z</span></div>
      <svg id="nap" aria-hidden="true"></svg>
    </div>
  </div></div>
  <div id="ihint">click the screen · press <b>POWER</b> · drag a disk into the drive · or type <b>./power_on.sh</b></div>
</div>

<div id="monitor"><span id="busy" aria-hidden="true"></span><div id="screen">
  <canvas id="rain" aria-hidden="true"></canvas>

  <div id="boot" role="status" aria-live="polite"></div>

  <main id="desktop">
    <div id="hero">
      <div class="bin" id="heroBits">01000100 01000010</div>
      <h1 class="glow">DANIEL<br>BANTAY</h1>
      <p>Computer Science <span>@</span> UC Berkeley</p>
    </div>
    <nav id="icons" aria-label="Desktop"></nav>
  </main>

  <div id="bubble"></div>
  <svg id="bear" viewBox="0 0 200 120" aria-label="Bear: click, drag, or call him by clicking the desktop" role="button" tabindex="0"></svg>

  <div id="startmenu" role="menu">
    <div class="side">DANIEL_OS</div>
  </div>

  <footer id="taskbar">
    <button id="start" aria-haspopup="true">▣ START</button>
    <div id="tasks"></div>
    <div id="tray"><button id="pwr" title="Restart (back to the computer)" aria-label="Restart">⏻</button><button id="snd" aria-pressed="false" title="Sound (enables Campanile chimes)">♪ off</button><span class="bits" id="trayBits">0000</span><a id="np" target="_blank" rel="noopener" hidden></a><span id="hits" title="visitor counter" aria-label="visitor counter"></span><span id="clock">--:--</span></div>
  </footer>

  <div id="overlay" aria-live="assertive"></div>
  <svg id="saverBear" class="walking" viewBox="0 0 200 120" aria-hidden="true"></svg>
  <div id="saverHint">move the mouse or press any key to wake</div>
</div></div>
`;
