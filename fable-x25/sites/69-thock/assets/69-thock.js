/* THOCK — the SEVENTY-FIVE
   Board renderer + Web Audio switch synthesis. No audio files, no rAF loops —
   all motion is CSS transitions; all sound is synthesized per keystroke.      */
(function () {
  'use strict';

  var doc = document, root = doc.documentElement;
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================ 1 · LAYOUT ============================ */
  /* 75% — 16u wide grid at 0.25u resolution (64 tracks). 1u = 4 tracks.
     R1: Esc F1–F12 Del ·1u gap· knob   |  R2–R6: contiguous + nav column. */
  function A(l, c, w, s) { return { l: l, c: c, w: w || 4, t: 'alpha', s: s }; }
  function M(l, c, w) { return { l: l, c: c, w: w || 4, t: 'mod' }; }
  function X(l, c, w) { return { l: l, c: c, w: w || 4, t: 'acc' }; }

  var ROWS = [
    [X('esc', 'Escape'), M('f1', 'F1'), M('f2', 'F2'), M('f3', 'F3'), M('f4', 'F4'), M('f5', 'F5'), M('f6', 'F6'), M('f7', 'F7'), M('f8', 'F8'), M('f9', 'F9'), M('f10', 'F10'), M('f11', 'F11'), M('f12', 'F12'), M('del', 'Delete'), { gap: 4 }, { knob: 1 }],
    [A('`', 'Backquote', 4, '~'), A('1', 'Digit1', 4, '!'), A('2', 'Digit2', 4, '@'), A('3', 'Digit3', 4, '#'), A('4', 'Digit4', 4, '$'), A('5', 'Digit5', 4, '%'), A('6', 'Digit6', 4, '^'), A('7', 'Digit7', 4, '&'), A('8', 'Digit8', 4, '*'), A('9', 'Digit9', 4, '('), A('0', 'Digit0', 4, ')'), A('-', 'Minus', 4, '_'), A('=', 'Equal', 4, '+'), M('bksp', 'Backspace', 8), M('pgup', 'PageUp')],
    [M('tab', 'Tab', 6), A('Q', 'KeyQ'), A('W', 'KeyW'), A('E', 'KeyE'), A('R', 'KeyR'), A('T', 'KeyT'), A('Y', 'KeyY'), A('U', 'KeyU'), A('I', 'KeyI'), A('O', 'KeyO'), A('P', 'KeyP'), A('[', 'BracketLeft', 4, '{'), A(']', 'BracketRight', 4, '}'), A('\\', 'Backslash', 6, '|'), M('pgdn', 'PageDown')],
    [M('caps', 'CapsLock', 7), A('A', 'KeyA'), A('S', 'KeyS'), A('D', 'KeyD'), A('F', 'KeyF'), A('G', 'KeyG'), A('H', 'KeyH'), A('J', 'KeyJ'), A('K', 'KeyK'), A('L', 'KeyL'), A(';', 'Semicolon', 4, ':'), A("'", 'Quote', 4, '"'), X('enter', 'Enter', 9), M('home', 'Home')],
    [M('shift', 'ShiftLeft', 9), A('Z', 'KeyZ'), A('X', 'KeyX'), A('C', 'KeyC'), A('V', 'KeyV'), A('B', 'KeyB'), A('N', 'KeyN'), A('M', 'KeyM'), A(',', 'Comma', 4, '<'), A('.', 'Period', 4, '>'), A('/', 'Slash', 4, '?'), M('shift', 'ShiftRight', 7), M('↑', 'ArrowUp'), M('end', 'End')],
    [M('ctl', 'ControlLeft', 5), M('opt', 'AltLeft', 5), M('cmd', 'MetaLeft', 5), { l: '', c: 'Space', w: 25, t: 'space' }, M('cmd', 'MetaRight'), M('fn', null), M('ctl', 'ControlRight'), M('←', 'ArrowLeft'), M('↓', 'ArrowDown'), M('→', 'ArrowRight')]
  ];

  var byCode = {}, knobEl = null;
  var matrix = doc.getElementById('matrix');

  (function build() {
    var frag = doc.createDocumentFragment();
    ROWS.forEach(function (row, ri) {
      var col = 1, gridRow = ri === 0 ? 1 : ri + 2; // row 2 of the grid is the F-row spacer
      row.forEach(function (k) {
        if (k.gap) { col += k.gap; return; }
        if (k.knob) {
          knobEl = doc.createElement('button');
          knobEl.type = 'button';
          knobEl.className = 'knob';
          knobEl.setAttribute('aria-pressed', 'false');
          knobEl.setAttribute('aria-label', 'Rotary knob — push to mute the switch sound');
          knobEl.style.gridColumn = col + ' / span 4';
          knobEl.style.gridRow = gridRow;
          frag.appendChild(knobEl);
          col += 4; return;
        }
        var el = doc.createElement('div');
        var cls = 'key ' + k.t;
        if (k.c === 'KeyF' || k.c === 'KeyJ') cls += ' homing';
        if (k.c && k.c.indexOf('Arrow') === 0) cls += ' arrow';
        el.className = cls;
        el.dataset.r = ri + 1;
        if (k.c) { el.dataset.code = k.c; byCode[k.c] = el; }
        el.style.gridColumn = col + ' / span ' + k.w;
        el.style.gridRow = gridRow;
        el.innerHTML = '<span class="cap"><span class="top">' +
          (k.s ? '<i class="sub">' + esc(k.s) + '</i>' : '') +
          '<b class="main">' + esc(k.l) + '</b></span></span>';
        frag.appendChild(el);
        col += k.w;
      });
    });
    matrix.appendChild(frag);
  })();

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  /* ============================ 2 · AUDIO ============================ */
  /* Three switch voices, built from a shared noise buffer + biquad filters
     + gain envelopes. AudioContext is created/resumed only on user gesture. */
  var AC = window.AudioContext || window.webkitAudioContext;
  var ctx = null, master = null, noiseBuf = null, muted = false;

  function ensureCtx() {
    if (!AC) return false;
    if (!ctx) {
      try {
        ctx = new AC();
        var comp = ctx.createDynamicsCompressor();
        comp.threshold.value = -16; comp.knee.value = 10; comp.ratio.value = 5;
        comp.attack.value = 0.002; comp.release.value = 0.09;
        master = ctx.createGain();
        master.gain.value = muted ? 0 : 0.9;
        master.connect(comp); comp.connect(ctx.destination);
        var len = Math.floor(ctx.sampleRate * 0.25);
        noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
        var d = noiseBuf.getChannelData(0);
        for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      } catch (e) { ctx = null; return false; }
    }
    if (ctx.state === 'suspended') ctx.resume();
    return true;
  }

  function burst(t, f, opt) { // filtered noise burst with fast envelope
    var o = opt || {};
    var src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    src.playbackRate.value = o.rate || 1;
    var flt = ctx.createBiquadFilter();
    flt.type = o.type || 'lowpass';
    flt.frequency.value = f;
    flt.Q.value = o.q || 1;
    var g = ctx.createGain();
    var dur = o.dur || 0.08, gain = o.gain || 0.5;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.0016);
    g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    src.connect(flt); flt.connect(g); g.connect(master);
    src.start(t, Math.random() * 0.1); // random buffer offset — no two presses identical
    src.stop(t + dur + 0.03);
  }

  function ping(t, f, opt) { // short pitched resonance
    var o = opt || {};
    var osc = ctx.createOscillator();
    osc.type = o.type || 'sine';
    var dur = o.dur || 0.06, gain = o.gain || 0.15;
    osc.frequency.setValueAtTime(f, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, f * (o.glide || 0.72)), t + dur);
    var g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    osc.connect(g); g.connect(master);
    osc.start(t); osc.stop(t + dur + 0.02);
  }

  /* Per-switch downstroke voices. p = pitch variance, g = level variance. */
  var VOICES = {
    coast: function (t, v, big) { // linear — soft, low, woody
      burst(t, 112 * v.p, { q: 0.7, dur: 0.085, gain: 0.95 * v.g });
      burst(t, 850 * v.p, { type: 'bandpass', q: 0.9, dur: 0.016, gain: 0.09 * v.g });
      ping(t, 96 * v.p, { dur: 0.075, gain: 0.22 * v.g });
      if (big) burst(t + 0.009, 230 * v.p, { type: 'bandpass', q: 1.6, dur: 0.03, gain: 0.16 * v.g });
    },
    ridge: function (t, v, big) { // tactile — mid tick, then body
      burst(t, 1500 * v.p, { type: 'bandpass', q: 2.6, dur: 0.011, gain: 0.34 * v.g });
      burst(t + 0.016, 155 * v.p, { q: 0.8, dur: 0.075, gain: 0.85 * v.g });
      ping(t + 0.016, 128 * v.p, { dur: 0.06, gain: 0.18 * v.g });
      if (big) burst(t + 0.026, 260 * v.p, { type: 'bandpass', q: 1.6, dur: 0.028, gain: 0.15 * v.g });
    },
    ratchet: function (t, v, big) { // clicky — sharp 4 kHz snap + body
      burst(t, 4200 * v.p, { type: 'bandpass', q: 6, dur: 0.008, gain: 0.55 * v.g });
      ping(t, 4300 * v.p, { type: 'triangle', dur: 0.014, gain: 0.1 * v.g, glide: 0.85 });
      burst(t + 0.011, 185 * v.p, { q: 0.9, dur: 0.06, gain: 0.62 * v.g });
      if (big) burst(t + 0.02, 300 * v.p, { type: 'bandpass', q: 1.8, dur: 0.025, gain: 0.14 * v.g });
    }
  };

  function variance() { return { p: 0.94 + Math.random() * 0.12, g: 0.78 + Math.random() * 0.34 }; }

  function playDown(name, big) {
    if (!ensureCtx()) return;
    VOICES[name || state.sw](ctx.currentTime, variance(), big);
  }
  function playUp(name) { // top-out tick on release
    if (!ctx || ctx.state !== 'running') return;
    var v = variance(), t = ctx.currentTime, sw = name || state.sw;
    burst(t, 2300 * v.p, { type: 'bandpass', q: 2, dur: 0.01, gain: 0.07 * v.g });
    if (sw === 'ratchet') burst(t, 3800 * v.p, { type: 'bandpass', q: 5, dur: 0.007, gain: 0.16 * v.g });
  }
  function playDetent() { // knob press
    if (!ensureCtx()) return;
    var t = ctx.currentTime;
    burst(t, 1900, { type: 'bandpass', q: 3, dur: 0.012, gain: 0.22 });
    burst(t + 0.012, 320, { type: 'bandpass', q: 1.5, dur: 0.03, gain: 0.18 });
  }

  /* ============================ 3 · STATE ============================ */
  var CW_NAMES = { milk: 'Milk Study', terminal: 'Terminal', pool: 'Pool', tang: 'Tang' };
  var SW_NAMES = { coast: 'Coast, linear', ridge: 'Ridge, tactile', ratchet: 'Ratchet, clicky' };
  var state = { cw: root.dataset.cw || 'milk', sw: root.dataset.sw || 'coast' };

  var cwName = doc.getElementById('cwName');
  var capCw = doc.getElementById('capCw');
  var capSw = doc.getElementById('capSw');

  function setCw(name) {
    if (!CW_NAMES[name]) return;
    state.cw = name;
    root.dataset.cw = name;
    cwName.textContent = CW_NAMES[name];
    capCw.textContent = CW_NAMES[name];
    doc.querySelectorAll('#cwSel .swb').forEach(function (b) {
      b.setAttribute('aria-checked', b.dataset.cwv === name ? 'true' : 'false');
    });
  }
  function setSw(name) {
    if (!SW_NAMES[name]) return;
    state.sw = name;
    root.dataset.sw = name;
    capSw.textContent = SW_NAMES[name];
    doc.querySelectorAll('#switchSeg .seg-btn').forEach(function (b) {
      b.setAttribute('aria-checked', b.dataset.switch === name ? 'true' : 'false');
    });
    doc.querySelectorAll('.pick').forEach(function (b) {
      var on = b.dataset.pick === name;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.textContent = on ? 'fitted' : 'fit ' + b.dataset.pick;
    });
  }

  doc.getElementById('switchSeg').addEventListener('click', function (e) {
    var b = e.target.closest('.seg-btn');
    if (!b) return;
    setSw(b.dataset.switch);
    playDown(b.dataset.switch);
  });
  doc.getElementById('cwSel').addEventListener('click', function (e) {
    var b = e.target.closest('.swb');
    if (b) { setCw(b.dataset.cwv); playDown(state.sw); }
  });
  doc.querySelectorAll('.cw-card').forEach(function (card) {
    card.addEventListener('click', function () { setCw(card.dataset.cwv); playDown(state.sw); });
  });
  doc.querySelectorAll('.pick').forEach(function (b) {
    b.addEventListener('click', function () { setSw(b.dataset.pick); playDown(b.dataset.pick); });
  });

  /* ============================ 4 · KEY INPUT ============================ */
  function isBig(el) { // wide caps get a stabilizer rattle
    var span = parseInt((el.style.gridColumn.split('span ')[1] || '4'), 10);
    return span >= 8;
  }
  function down(el) { el.classList.add('down'); }
  function up(el) { el.classList.remove('down'); }
  function releaseAll() { matrix.querySelectorAll('.key.down').forEach(up); }

  // pointer input (click / tap on caps) — release is tracked on the document
  // so a press can't get stuck if the pointer is dragged off the cap
  var pointerKey = null;
  matrix.addEventListener('pointerdown', function (e) {
    var key = e.target.closest('.key');
    if (!key) return;
    e.preventDefault(); // no text selection / ghost focus
    pointerKey = key;
    down(key);
    playDown(state.sw, isBig(key));
  });
  doc.addEventListener('pointerup', function () {
    if (pointerKey) { up(pointerKey); playUp(); pointerKey = null; }
  });
  doc.addEventListener('pointercancel', function () {
    if (pointerKey) { up(pointerKey); pointerKey = null; }
  });

  // physical keyboard
  var boardVisible = false;
  new IntersectionObserver(function (entries) {
    boardVisible = entries[0].isIntersecting;
  }, { threshold: 0.25 }).observe(doc.getElementById('kbCase'));

  function editable(el) {
    return el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
  }

  doc.addEventListener('keydown', function (e) {
    var el = byCode[e.code];
    if (el && !e.repeat) { down(el); playDown(state.sw, isBig(el)); }
    // keep Space from scrolling the page while the board is on screen
    if (e.code === 'Space' && boardVisible && !editable(doc.activeElement)) e.preventDefault();
  });
  doc.addEventListener('keyup', function (e) {
    var el = byCode[e.code];
    if (el) { up(el); playUp(); }
    if (e.key === 'Meta') releaseAll(); // macOS swallows keyups while Cmd is held
  });
  window.addEventListener('blur', releaseAll);

  // knob → mute
  knobEl.addEventListener('click', function () {
    ensureCtx();
    muted = !muted;
    knobEl.classList.toggle('muted', muted);
    knobEl.setAttribute('aria-pressed', muted ? 'true' : 'false');
    if (ctx) {
      if (!muted) { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setValueAtTime(0.001, ctx.currentTime); master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 0.05); playDetent(); }
      else { playDetent(); master.gain.setTargetAtTime(0, ctx.currentTime + 0.06, 0.02); }
    }
    knobEl.classList.add('pressed');
    setTimeout(function () { knobEl.classList.remove('pressed'); }, 140);
  });

  /* ============================ 5 · RIFFS ============================ */
  var riffTimers = [];
  function riff(name, btn) {
    if (!ensureCtx()) return;
    riffTimers.forEach(clearTimeout); riffTimers = [];
    doc.querySelectorAll('.hear.playing').forEach(function (b) { b.classList.remove('playing'); });
    if (btn) btn.classList.add('playing');
    var codes = ['KeyT', 'KeyH', 'KeyO', 'KeyC', 'KeyK'];
    var t = ctx.currentTime + 0.04;
    codes.forEach(function (code) {
      var at = t, v = variance();
      VOICES[name](at, v, false);
      var el = byCode[code];
      riffTimers.push(setTimeout(function () {
        down(el);
        riffTimers.push(setTimeout(function () { up(el); playUp(name); }, 85));
      }, Math.max(0, (at - ctx.currentTime) * 1000)));
      t += 0.085 + Math.random() * 0.06;
    });
    riffTimers.push(setTimeout(function () { if (btn) btn.classList.remove('playing'); }, (t - ctx.currentTime) * 1000 + 160));
  }
  doc.querySelectorAll('.hear').forEach(function (b) {
    b.addEventListener('click', function () { riff(b.dataset.riff, b); });
  });

  /* ============================ 6 · TYPING TEST ============================ */
  var TARGET = 'a low wooden thock rolls off the plate as the quick brown fox jumps over the lazy dog';
  var strip = doc.getElementById('strip');
  var line = doc.getElementById('line');
  var input = doc.getElementById('typeInput');
  var wpmEl = doc.getElementById('wpm');
  var accEl = doc.getElementById('accv');
  var note = doc.getElementById('hudNote');
  var test = { start: null, done: false, timer: null, hiddenAt: 0 };

  var chars = TARGET.split('').map(function (ch) {
    var s = doc.createElement('span');
    s.textContent = ch;
    return s;
  });
  var caret = doc.createElement('span');
  caret.className = 'caret';
  chars.forEach(function (s) { line.appendChild(s); });
  line.insertBefore(caret, chars[0]);

  function renderTest() {
    var val = input.value, correct = 0;
    for (var i = 0; i < chars.length; i++) {
      var c = chars[i];
      if (i < val.length) {
        var ok = val[i] === TARGET[i];
        c.className = ok ? 'ok' : 'err';
        if (ok) correct++;
      } else c.className = '';
    }
    line.insertBefore(caret, chars[Math.min(val.length, chars.length - 1)] || null);
    if (val.length >= TARGET.length) line.appendChild(caret);
    if (val.length) {
      accEl.textContent = Math.round(correct / val.length * 100);
    } else { accEl.textContent = '100'; }
    updateWpm(correct);
    if (!test.done && val.length >= TARGET.length) {
      test.done = true;
      strip.classList.add('done');
      note.textContent = correct === TARGET.length ? 'clean run — ' + wpmEl.textContent + ' wpm' : 'done — ' + wpmEl.textContent + ' wpm';
      stopTimer();
    }
    return correct;
  }
  function updateWpm(correct) {
    if (correct === undefined) correct = countCorrect();
    if (!test.start) { wpmEl.textContent = '0'; return; }
    var min = (performance.now() - test.start) / 60000;
    if (min <= 0) return;
    wpmEl.textContent = String(Math.max(0, Math.round((correct / 5) / min)));
  }
  function countCorrect() {
    var val = input.value, n = 0;
    for (var i = 0; i < val.length; i++) if (val[i] === TARGET[i]) n++;
    return n;
  }
  function startTimer() {
    stopTimer();
    test.timer = setInterval(function () { if (!test.done) updateWpm(); }, 600);
  }
  function stopTimer() { if (test.timer) { clearInterval(test.timer); test.timer = null; } }

  input.addEventListener('input', function () {
    if (input.value.length > TARGET.length) input.value = input.value.slice(0, TARGET.length);
    if (!test.start && input.value.length) { test.start = performance.now(); startTimer(); note.textContent = 'go'; }
    renderTest();
  });
  input.addEventListener('focus', function () { strip.classList.add('live'); if (!test.done && !test.start) note.textContent = 'type the line'; });
  input.addEventListener('blur', function () { strip.classList.remove('live'); if (!test.done && test.start) note.textContent = 'click to resume'; });
  strip.addEventListener('click', function () { input.focus({ preventScroll: true }); });
  doc.getElementById('resetBtn').addEventListener('click', function (e) {
    e.stopPropagation();
    input.value = ''; test.start = null; test.done = false;
    strip.classList.remove('done');
    wpmEl.textContent = '0'; note.textContent = 'click the line, then type';
    stopTimer(); renderTest();
    input.focus({ preventScroll: true });
  });

  // pause the WPM clock while the tab is hidden (and never tick in background)
  doc.addEventListener('visibilitychange', function () {
    if (doc.hidden) { test.hiddenAt = performance.now(); stopTimer(); }
    else {
      if (test.start && test.hiddenAt) test.start += performance.now() - test.hiddenAt;
      test.hiddenAt = 0;
      if (test.start && !test.done) startTimer();
    }
  });

  /* ============================ 7 · REVEALS + PARAMS ============================ */
  var reveals = doc.querySelectorAll('[data-reveal]');
  if (RM || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  // sync UI to the pre-applied ?colorway / ?switch (set on <html> in <head>)
  setCw(state.cw);
  setSw(state.sw);

  // ?typed=1 — pre-filled mid-run typing test for og screenshots
  (function () {
    var q = new URLSearchParams(location.search);
    if (q.get('typed') !== '1') return;
    var n = 47, wpm = 92;
    input.value = TARGET.slice(0, n);
    test.start = performance.now() - (n / 5) / wpm * 60000;
    strip.classList.add('live');
    note.textContent = 'go';
    renderTest();
  })();

  /* ============================ 8 · NOTIFY ============================ */
  var form = doc.getElementById('notifyForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // fictional shop — nothing is sent anywhere
    var btn = doc.getElementById('notifyBtn');
    btn.textContent = 'noted ✓';
    btn.classList.add('done');
    doc.getElementById('notifyMail').disabled = true;
  });
})();
