"use strict";
/* 求籤 · FORTUNE STICKS — ritual controller */
(function(){
const DATA = window.KAUCIM || [];
const LV = {
  "上上":{cls:"great", en:"GREAT FORTUNE"},
  "上吉":{cls:"good",  en:"GOOD FORTUNE"},
  "中":  {cls:"mid",   en:"MIDDLING"},
  "下":  {cls:"poor",  en:"ADVERSE"}
};
const CAT = [["y","運程","FORTUNE"],["c","財","WEALTH"],["l","姻緣","LOVE"],["h","健康","HEALTH"],["e","事業","CAREER"]];

/* ── params & environment ── */
const params = new URLSearchParams(location.search);
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const forcedStick = params.get("stick");
const forcedReveal = params.get("revealed") === "1";
const forcedShaking = params.get("shaking") === "1";
const seedParam = params.get("seed");
const noAnim = forcedStick !== null || forcedReveal || forcedShaking;
if (noAnim) document.documentElement.classList.add("no-anim");

/* seeded RNG (mulberry32) */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
let seed = seedParam !== null ? (parseInt(seedParam,10)||1) : (Math.floor(Math.random()*1e9)+1);
let rand = mulberry32(seed);

/* Chinese numerals 1..99 */
const DIG = ["零","一","二","三","四","五","六","七","八","九"];
function cnNum(n){
  if (n<=10) return n===10?"十":DIG[n];
  if (n<20) return "十"+DIG[n-10];
  const t=Math.floor(n/10), o=n%10;
  return DIG[t]+"十"+(o?DIG[o]:"");
}

/* ── elements ── */
const body = document.body;
const altar = document.getElementById("altar");
const sticksEl = document.getElementById("sticks");
const cylWrap = document.getElementById("cylWrap");
const fallen = document.getElementById("fallen");
const fallenNo = document.getElementById("fallenNo");
const fallenLabel = document.getElementById("fallenLabel");
const shakeBtn = document.getElementById("shakeBtn");
const meterFill = document.getElementById("meterFill");
const hint = document.getElementById("hint");
const jiao = document.getElementById("jiao");
const reveal = document.getElementById("reveal");

/* ── build the bundle of sticks ── */
const N_STICKS = 24;
const stickEls = [];
let chosenEl = null;
(function buildSticks(){
  const r = mulberry32(4242);
  const wrapW = 120; // logical spread width in px
  for (let i=0;i<N_STICKS;i++){
    const s = document.createElement("div");
    s.className = "stick";
    const t = i/(N_STICKS-1);              // 0..1 across
    const x = (t-0.5)*wrapW + (r()*2-1)*4; // horizontal placement
    const depth = Math.abs(t-0.5)*2;       // 0 center .. 1 edges
    const h = 150 - depth*46 + (r()*2-1)*10; // taller in middle
    const rot = (t-0.5)*10 + (r()*2-1)*4;
    s.style.left = "calc(50% + "+x.toFixed(1)+"px)";
    s.style.height = h.toFixed(0)+"px";
    s.style.marginLeft = "-4.5px";
    s.style.zIndex = String(20 - Math.round(depth*10) + (i%2));
    s.dataset.x = x.toFixed(1);
    s.dataset.rot = rot.toFixed(2);
    s.dataset.h = h.toFixed(0);
    s.style.transform = "translateY(0) rotate("+rot.toFixed(2)+"deg)";
    // subtle tonal variety
    const tone = 0.9 + r()*0.2;
    s.style.filter = "brightness("+tone.toFixed(2)+")";
    sticksEl.appendChild(s);
    stickEls.push(s);
  }
})();

/* ── state ── */
let state = "idle";          // idle | shaking | fallen | cast | revealed
let energy = 0;              // 0..1 shake energy
let lift = 0;                // 0..1 chosen stick emergence
let holding = false;
let raf = null, running = false;
let picked = null;           // chosen DATA entry
let lastMove = 0, lastX = 0, lastY = 0;

function pickEntry(){
  if (forcedStick !== null){
    const n = parseInt(forcedStick,10);
    const f = DATA.find(d=>d.n===n);
    if (f) return f;
  }
  return DATA[Math.floor(rand()*DATA.length)];
}

/* choose which physical stick is "the one" — a taller central-ish stick */
function designateChosen(){
  if (chosenEl) chosenEl.classList.remove("chosen");
  // prefer one of the middle sticks for a natural rise
  const mid = Math.floor(N_STICKS/2);
  const off = Math.floor(rand()*5)-2;
  chosenEl = stickEls[Math.max(2,Math.min(N_STICKS-3, mid+off))];
}

/* ── the animation loop ── */
const DECAY = 0.012;
function loop(){
  raf = null;
  if (state === "shaking"){
    energy = Math.max(0, energy - DECAY);
    if (holding) energy = Math.min(1, energy + 0.02); // base agitation while held
    meterFill.style.width = (energy*100).toFixed(0)+"%";
    const amp = energy;
    // jitter every stick
    for (const s of stickEls){
      if (s === chosenEl && lift>0.02) continue;
      const jx = (Math.random()*2-1)*6*amp;
      const jy = (Math.random()*2-1)*7*amp;
      const jr = parseFloat(s.dataset.rot) + (Math.random()*2-1)*7*amp;
      s.style.transform = "translate("+jx.toFixed(1)+"px,"+jy.toFixed(1)+"px) rotate("+jr.toFixed(1)+"deg)";
    }
    // chosen stick works its way up as energy sustains
    if (energy > 0.42){ lift = Math.min(1, lift + 0.011 * (energy)); }
    else if (energy < 0.2){ lift = Math.max(0, lift - 0.006); }
    if (chosenEl){
      const h = parseFloat(chosenEl.dataset.h);
      const rise = lift * (h*0.62 + 30);
      const wob = (Math.random()*2-1)*4*amp;
      chosenEl.style.transform = "translate("+wob.toFixed(1)+"px,"+(-rise).toFixed(1)+"px) rotate("+chosenEl.dataset.rot+"deg)";
      chosenEl.style.zIndex = "60";
    }
    if (lift >= 1){ triggerFall(); return; }
  }
  if ((state === "shaking") && !document.hidden){ running = true; raf = requestAnimationFrame(loop); }
  else running = false;
}
function kick(){ if (!running && !document.hidden){ running = true; raf = requestAnimationFrame(loop); } }

/* ── input: hold + move to shake ── */
function startHold(e){
  if (state !== "idle" && state !== "shaking") return;
  holding = true;
  shakeBtn.classList.add("held");
  if (state === "idle"){
    state = "shaking";
    designateChosen();
    setHint("keep shaking · 搖 · 搖 · 搖");
    tryMotionPermission();
  }
  energy = Math.min(1, energy + 0.14);
  kick();
  if (e && e.cancelable) e.preventDefault();
}
function endHold(){ holding = false; shakeBtn.classList.remove("held"); }
function moveShake(e){
  if (!holding) return;
  const now = performance.now();
  const x = e.clientX!=null?e.clientX:(e.touches&&e.touches[0]?e.touches[0].clientX:lastX);
  const y = e.clientY!=null?e.clientY:(e.touches&&e.touches[0]?e.touches[0].clientY:lastY);
  const dt = Math.max(8, now-lastMove);
  const v = Math.hypot(x-lastX, y-lastY)/dt;
  lastX = x; lastY = y; lastMove = now;
  energy = Math.min(1, energy + Math.min(0.22, v*0.06));
  kick();
}

/* DeviceMotion (mobile physical shake) — button fallback always works */
let motionOn = false;
function onMotion(ev){
  const a = ev.accelerationIncludingGravity || ev.acceleration;
  if (!a) return;
  const mag = Math.abs(a.x||0)+Math.abs(a.y||0)+Math.abs(a.z||0);
  if (mag > 22){
    if (state === "idle"){ state="shaking"; designateChosen(); setHint("keep shaking · 搖 · 搖 · 搖"); }
    energy = Math.min(1, energy + Math.min(0.3,(mag-18)*0.02));
    kick();
  }
}
function tryMotionPermission(){
  if (motionOn) return;
  try{
    if (typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function"){
      DeviceMotionEvent.requestPermission().then(function(r){
        if (r === "granted"){ window.addEventListener("devicemotion", onMotion); motionOn=true; }
      }).catch(function(){});
    } else if (typeof DeviceMotionEvent !== "undefined"){
      window.addEventListener("devicemotion", onMotion); motionOn=true;
    }
  }catch(_){}
}

/* ── the fall ── */
function triggerFall(){
  state = "fallen";
  picked = pickEntry();
  running = false; if (raf) cancelAnimationFrame(raf);
  meterFill.style.width = "0%";
  fallenNo.textContent = cnNum(picked.n);
  fallenLabel.textContent = "第 "+picked.n+" 籤";
  const doReveal = ()=>{ castBlocks(()=>showFortune(picked, true)); };
  if (reduced){ chosenEl.style.opacity="0"; fallen.classList.add("show"); doReveal(); return; }
  // tumble the chosen stick out over the rim and down to rest
  const start = chosenEl.getBoundingClientRect();
  const target = fallen.getBoundingClientRect();
  const flyer = chosenEl.cloneNode(true);
  flyer.style.position="fixed"; flyer.style.left=start.left+"px"; flyer.style.top=start.top+"px";
  flyer.style.width=start.width+"px"; flyer.style.height=start.height+"px"; flyer.style.margin="0";
  flyer.style.zIndex="90"; flyer.style.transformOrigin="50% 50%";
  document.body.appendChild(flyer);
  chosenEl.style.opacity="0";
  const dx = (target.left+target.width/2) - (start.left+start.width/2);
  const dy = (target.top) - (start.top);
  flyer.animate([
    {transform:"translate(0,0) rotate("+chosenEl.dataset.rot+"deg)", offset:0},
    {transform:"translate("+(dx*0.4)+"px,"+(-40)+"px) rotate(-40deg)", offset:.4},
    {transform:"translate("+(dx*0.85)+"px,"+(dy*0.7)+"px) rotate(-88deg)", offset:.72},
    {transform:"translate("+dx+"px,"+(dy+8)+"px) rotate(-93deg)", offset:.9},
    {transform:"translate("+dx+"px,"+dy+"px) rotate(-90deg)", offset:1}
  ], {duration:1050, easing:"cubic-bezier(.4,0,.25,1)", fill:"forwards"}).onfinish = ()=>{
    flyer.remove();
    fallen.classList.add("show");
    clack();
    setTimeout(doReveal, 620);
  };
}

/* ── jiaobei ── */
function castBlocks(cb){
  body.classList.add("cast");
  if (noAnim || reduced){ cb && cb(); return; }
  const blocks = jiao.querySelectorAll(".block");
  blocks.forEach((b,i)=>{
    b.animate([
      {transform:"translateY(0) rotate(0)"},
      {transform:"translateY(-46px) rotate("+(i?200:-160)+"deg)", offset:.5},
      {transform:"translateY(0) rotate("+(i?360:-360)+"deg)"}
    ],{duration:760, delay:i*70, easing:"cubic-bezier(.3,.7,.3,1)"});
  });
  clack(1);
  setTimeout(()=>cb&&cb(), 900);
}

/* ── reveal the fortune ── */
function showFortune(entry, animate){
  const lv = LV[entry.lv] || LV["中"];
  document.getElementById("pStickCn").textContent = "第"+cnNum(entry.n)+"籤";
  document.getElementById("pStickEn").textContent = "STICK NO. "+entry.n;
  const lvEl = document.getElementById("pLevel");
  lvEl.className = "level "+lv.cls;
  lvEl.innerHTML = '<span class="cn">'+entry.lv+'</span>'+lv.en;
  // vertical hanzi columns (right-to-left is native to vertical-rl; keep source order)
  document.getElementById("pPoemCn").innerHTML = entry.cn.map(c=>'<div class="pcol">'+c+'</div>').join("");
  document.getElementById("pPoemPy").innerHTML = entry.py.map(p=>'<div>'+p+'</div>').join("");
  document.getElementById("pPoemEn").innerHTML = entry.en.map(l=>'<span class="ln">'+l+'</span>').join("");
  document.getElementById("pInterp").innerHTML = CAT.map(([k,cn,en])=>
    '<div class="icard"><div class="cn">'+cn+'</div><div class="en">'+en+'</div><div class="rule"></div><div class="txt">'+entry.i[k]+'</div></div>'
  ).join("");

  body.classList.add("drawn");
  state = "revealed";
  if (animate){
    requestAnimationFrame(()=>{
      body.classList.add("reveal-in");
      reveal.scrollIntoView({behavior:"smooth", block:"start"});
    });
  } else {
    body.classList.add("reveal-in");
  }
}

/* ── reset / ask again ── */
function reset(){
  seed = Math.floor(Math.random()*1e9)+1; rand = mulberry32(seed);
  state="idle"; energy=0; lift=0; holding=false; picked=null;
  body.classList.remove("drawn","reveal-in","cast");
  fallen.classList.remove("show");
  meterFill.style.width="0%";
  setHint("<em>press and hold — then shake to agitate the sticks</em>");
  // restore sticks
  for (const s of stickEls){
    s.style.opacity="1";
    s.style.transform = "translateY(0) rotate("+s.dataset.rot+"deg)";
    s.style.zIndex = s.style.zIndex; // unchanged base
  }
  if (chosenEl) chosenEl.style.zIndex = "";
  altar.scrollIntoView({behavior:"smooth", block:"start"});
}

/* ── tiny wood/brass clack (WebAudio, best-effort, gesture-gated) ── */
let actx = null;
function clack(kind){
  if (noAnim || reduced) return;
  try{
    if (!actx) actx = new (window.AudioContext||window.webkitAudioContext)();
    if (actx.state === "suspended") actx.resume();
    const t = actx.currentTime;
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(kind?520:300, t);
    o.frequency.exponentialRampToValueAtTime(kind?180:120, t+0.06);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.12, t+0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t+0.14);
    o.connect(g); g.connect(actx.destination);
    o.start(t); o.stop(t+0.16);
  }catch(_){}
}

function setHint(html){ hint.innerHTML = html; }

/* ── build the canon rack ── */
(function buildRack(){
  const rack = document.getElementById("rack");
  const frag = document.createDocumentFragment();
  DATA.forEach(d=>{
    const lv = LV[d.lv] || LV["中"];
    const b = document.createElement("button");
    b.className = "rstick "+lv.cls;
    b.setAttribute("aria-label","Stick number "+d.n+", "+lv.en+" — draw to read");
    b.innerHTML = '<span class="rno">'+d.n+'</span><span class="rlv">'+d.lv+'</span>';
    b.addEventListener("click", ()=>{ drawSpecific(d); });
    frag.appendChild(b);
  });
  rack.appendChild(frag);
})();

function drawSpecific(entry){
  picked = entry;
  showFortune(entry, true);
}

/* ── wire controls ── */
shakeBtn.addEventListener("pointerdown", startHold);
window.addEventListener("pointerup", endHold);
window.addEventListener("pointercancel", endHold);
window.addEventListener("pointermove", moveShake, {passive:true});
document.getElementById("againBtn").addEventListener("click", reset);
document.addEventListener("visibilitychange", ()=>{ if (document.hidden && raf){ cancelAnimationFrame(raf); running=false; } else if (state==="shaking") kick(); });
altar.classList.add("ready");

/* ── cursor ember ── */
(function ember(){
  if (!matchMedia("(pointer:fine)").matches || noAnim) return;
  const dot = document.getElementById("ember");
  body.classList.add("cursor-live");
  let tx=innerWidth/2, ty=innerHeight/2, x=tx, y=ty, r=null, run=false;
  function step(){
    x+=(tx-x)*0.3; y+=(ty-y)*0.3;
    dot.style.transform="translate("+(x)+"px,"+(y)+"px)";
    if (Math.abs(tx-x)>.3||Math.abs(ty-y)>.3){ r=requestAnimationFrame(step); } else run=false;
  }
  function go(){ if(!run&&!document.hidden){run=true;r=requestAnimationFrame(step);} }
  addEventListener("mousemove", e=>{
    tx=e.clientX; ty=e.clientY; dot.classList.add("on");
    dot.classList.toggle("hot", !!e.target.closest("button,a"));
    go();
  },{passive:true});
  addEventListener("mouseleave", ()=>dot.classList.remove("on"));
})();

/* ── forced states for screenshots / reduced-motion ── */
function applyForced(){
  if (forcedShaking){
    // frozen mid-shake snapshot
    state="shaking"; designateChosen(); energy=0.85; lift=0.55;
    meterFill.style.width="85%";
    setHint("keep shaking · 搖 · 搖 · 搖");
    const r = mulberry32(99);
    for (const s of stickEls){
      if (s===chosenEl) continue;
      const jx=(r()*2-1)*6, jy=(r()*2-1)*7, jr=parseFloat(s.dataset.rot)+(r()*2-1)*7;
      s.style.transform="translate("+jx.toFixed(1)+"px,"+jy.toFixed(1)+"px) rotate("+jr.toFixed(1)+"deg)";
    }
    if (chosenEl){
      const h=parseFloat(chosenEl.dataset.h);
      chosenEl.style.transform="translate(2px,"+(-(lift*(h*0.62+30))).toFixed(1)+"px) rotate("+chosenEl.dataset.rot+"deg)";
      chosenEl.style.zIndex="60";
    }
    state="shaking"; // leave frozen (no rAF kicked)
    return;
  }
  if (forcedStick !== null || forcedReveal){
    const e = pickEntry();
    picked = e;
    fallenNo.textContent = cnNum(e.n);
    fallenLabel.textContent = "第 "+e.n+" 籤";
    body.classList.add("cast");
    showFortune(e, false);
    requestAnimationFrame(()=>reveal.scrollIntoView({behavior:"auto", block:"start"}));
    return;
  }
  if (reduced){
    // calm: show a drawn stick, no jitter
    const e = pickEntry(); picked = e;
    designateChosen(); if (chosenEl) chosenEl.style.opacity="0";
    fallenNo.textContent = cnNum(e.n); fallenLabel.textContent = "第 "+e.n+" 籤";
    fallen.classList.add("show");
    body.classList.add("cast");
    showFortune(e, false);
    setHint("<em>a stick has fallen — press ask again for another</em>");
  }
}
applyForced();

/* scroll helper for screenshots: ?scroll=<section-id> */
(function(){
  const to = params.get("scroll");
  if (to){ const el = document.getElementById(to); if (el) requestAnimationFrame(()=>el.scrollIntoView({behavior:"auto",block:"start"})); }
})();
})();
