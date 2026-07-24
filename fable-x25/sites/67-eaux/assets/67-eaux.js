/* ode. — app: living gradients, the line, the finder, the bag. */
(function () {
  'use strict';
  var ODE = window.ODE;
  var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var STILL_T = 8.2; // fixed frame for reduced motion / first paint

  function qs(s, el) { return (el || document).querySelector(s); }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  /* ================= living gradient blobs ================= */
  var blobs = [];
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      var b = blobs.find(function (x) { return x.canvas === en.target; });
      if (b) b.visible = en.isIntersecting;
    });
  }, { rootMargin: '80px' });

  function makeBlob(canvas, notes) {
    var b = {
      canvas: canvas,
      ctx: canvas.getContext('2d'),
      buf: document.createElement('canvas'),
      fields: ODE.fieldsFor(notes),
      base: ODE.baseFor(notes),
      seed: ODE.unit(notes.join('|')) * 60,
      visible: true, w: 0, h: 0
    };
    b.bctx = b.buf.getContext('2d');
    blobs.push(b);
    io.observe(canvas);
    resizeBlob(b);
    drawBlob(b, STILL_T);
    return b;
  }
  function killBlob(b) {
    var i = blobs.indexOf(b);
    if (i >= 0) blobs.splice(i, 1);
    io.unobserve(b.canvas);
  }
  function resizeBlob(b) {
    var r = b.canvas.getBoundingClientRect();
    if (r.width < 1) return;
    var w = Math.max(2, Math.round(r.width * DPR));
    var h = Math.max(2, Math.round(r.height * DPR));
    if (w === b.w && h === b.h) return;
    b.w = w; b.h = h;
    b.canvas.width = w; b.canvas.height = h;
    // tiny buffer, upscaled with smoothing + blur = silky mesh
    var bw = Math.max(40, Math.min(160, Math.round(r.width / 10)));
    b.buf.width = bw;
    b.buf.height = Math.max(14, Math.min(180, Math.round(bw * r.height / r.width)));
    b.blur = Math.max(1, (b.w / bw) * 0.5);
  }
  function drawBlob(b, t) {
    var W = b.buf.width, H = b.buf.height, c = b.bctx;
    var tt = t + b.seed;
    c.fillStyle = ODE.rgba(b.base, 1);
    c.fillRect(0, 0, W, H);
    var M = Math.max(W, H);
    for (var i = 0; i < b.fields.length; i++) {
      var f = b.fields[i];
      var x = (f.bx + f.ax * Math.sin(tt * f.sx * 6.28 + f.px)) * W;
      var y = (f.by + f.ay * Math.cos(tt * f.sy * 6.28 + f.py)) * H;
      var g = c.createRadialGradient(x, y, 0, x, y, f.r * M);
      g.addColorStop(0, ODE.rgba(f.rgb, f.a));
      g.addColorStop(0.55, ODE.rgba(f.rgb, f.a * 0.42));
      g.addColorStop(1, ODE.rgba(f.rgb, 0));
      c.fillStyle = g;
      c.fillRect(0, 0, W, H);
    }
    var x2 = b.ctx;
    x2.imageSmoothingEnabled = true;
    x2.imageSmoothingQuality = 'high';
    x2.clearRect(0, 0, b.w, b.h);
    x2.filter = 'blur(' + (b.blur || 1) + 'px)';
    // overdraw past the edges so the blur never shows a transparent rim
    x2.drawImage(b.buf, -b.blur * 2, -b.blur * 2, b.w + b.blur * 4, b.h + b.blur * 4);
    x2.filter = 'none';
  }

  var rafId = null, last = 0, T = STILL_T;
  function frame(now) {
    rafId = requestAnimationFrame(frame);
    var dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    T += dt;
    for (var i = 0; i < blobs.length; i++) if (blobs[i].visible) drawBlob(blobs[i], T);
  }
  function startLoop() {
    if (REDUCE || rafId != null) return;
    last = performance.now();
    rafId = requestAnimationFrame(frame);
  }
  function stopLoop() {
    if (rafId != null) { cancelAnimationFrame(rafId); rafId = null; }
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stopLoop(); else startLoop();
  });
  window.addEventListener('resize', function () {
    blobs.forEach(function (b) { resizeBlob(b); drawBlob(b, REDUCE ? STILL_T : T); });
  });

  /* chip background for a pair of notes (deterministic, css-only) */
  function chipStyle(notes) {
    var c1 = ODE.NOTE_COLORS[notes[0]], c2 = ODE.NOTE_COLORS[notes[1] || notes[0]];
    var base = ODE.rgba(ODE.mix(c1, '#ffffff', 0.55), 1);
    return 'background:' +
      'radial-gradient(circle at 30% 28%, ' + c1 + ' 0%, rgba(255,255,255,0) 72%),' +
      'radial-gradient(circle at 72% 74%, ' + c2 + ' 0%, rgba(255,255,255,0) 76%),' + base + ';';
  }
  function noteChips(notes) {
    return '<div class="chips">' + notes.map(function (n) {
      return '<span class="chip"><i style="background:' + ODE.NOTE_COLORS[n] + '"></i>' + n + '</span>';
    }).join('') + '</div>';
  }

  /* ================= hero cluster ================= */
  var cluster = qs('#cluster');
  ODE.EAUX.forEach(function (eau) {
    var s = el('div', 'cshape');
    var idb = el('div', 'identity');
    var cv = document.createElement('canvas');
    idb.appendChild(cv);
    s.appendChild(idb);
    s.appendChild(el('span', 'cshape-name', eau.name));
    cluster.appendChild(s);
    makeBlob(cv, eau.notes);
  });
  var aside = el('p', 'cluster-aside', 'smells like leaving early.');
  cluster.appendChild(aside);

  /* legend swatches in the line intro */
  document.querySelectorAll('.swatch').forEach(function (sw) {
    sw.style.background = ODE.NOTE_COLORS[sw.getAttribute('data-note')];
  });

  /* ================= the line ================= */
  var rows = qs('#rows');
  ODE.EAUX.forEach(function (eau) {
    var row = el('article', 'row');
    row.innerHTML =
      '<span class="row-num">' + eau.no + '</span>' +
      '<div class="identity" style="border-radius:26px"><canvas></canvas></div>' +
      '<div class="row-info">' +
        '<h3 class="row-name">' + eau.name + '</h3>' +
        '<p class="row-tag">' + eau.line + '</p>' +
        noteChips(eau.notes) +
      '</div>' +
      '<div class="row-price"><b>€ ' + eau.price + '</b><span>50 ml<em class="edp"> · eau de parfum</em></span></div>' +
      '<button class="add" data-eau="' + eau.id + '">add to bag</button>';
    rows.appendChild(row);
    makeBlob(qs('canvas', row), eau.notes);
  });

  /* ================= bag ================= */
  var bagCount = 0;
  var bagBtn = qs('#bagBtn'), bagNum = qs('#bagCount');
  function addToBag(btn) {
    bagCount++;
    bagNum.textContent = bagCount;
    bagBtn.setAttribute('aria-label', 'shopping bag, ' + bagCount + ' items');
    bagBtn.title = 'your bag: ' + bagCount + ' bottle' + (bagCount === 1 ? '' : 's') + ', 0 regrets';
    if (!REDUCE) {
      bagBtn.classList.remove('pop');
      void bagBtn.offsetWidth;
      bagBtn.classList.add('pop');
    }
    if (btn) {
      var old = btn.textContent;
      btn.classList.add('added');
      btn.textContent = 'added ✓';
      btn.disabled = true;
      setTimeout(function () {
        btn.classList.remove('added');
        btn.textContent = old;
        btn.disabled = false;
      }, 950);
    }
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.add');
    if (btn) addToBag(btn);
  });
  bagBtn.addEventListener('click', function () {
    if (!REDUCE) {
      bagBtn.classList.remove('pop');
      void bagBtn.offsetWidth;
      bagBtn.classList.add('pop');
    }
  });

  /* ================= the finder ================= */
  var stage = qs('#finderStage');
  var answers = [];
  var stepEls = [];
  var resultEl = null, resultBlob = null;

  ODE.QUESTIONS.forEach(function (q, qi) {
    var st = el('div', 'fstep');
    st.innerHTML =
      '<p class="f-eyebrow">question <b>0' + (qi + 1) + '</b> — 0' + ODE.QUESTIONS.length + '</p>' +
      '<h3 class="f-q">' + q.q + '</h3>' +
      '<div class="f-opts">' + q.options.map(function (o, oi) {
        return '<button class="f-opt" data-q="' + qi + '" data-o="' + oi + '">' +
          '<span class="f-chip" style="' + chipStyle(o.chips) + '"></span>' +
          '<span>' + o.label + '</span></button>';
      }).join('') + '</div>' +
      '<div class="f-foot">' +
        '<div class="f-dots" aria-hidden="true">' + ODE.QUESTIONS.map(function () { return '<i></i>'; }).join('') + '</div>' +
        '<button class="f-back"' + (qi === 0 ? ' hidden' : '') + '>← back</button>' +
      '</div>';
    stage.appendChild(st);
    stepEls.push(st);
  });

  function updateDots() {
    stepEls.forEach(function (st, si) {
      var dots = st.querySelectorAll('.f-dots i');
      dots.forEach(function (d, di) {
        d.className = di < si ? 'done' : (di === si ? 'cur' : '');
      });
    });
  }
  updateDots();

  function clearResult() {
    if (resultEl) {
      if (resultBlob) { killBlob(resultBlob); resultBlob = null; }
      resultEl.remove();
      resultEl = null;
    }
  }
  function showStep(i) {
    clearResult();
    stepEls.forEach(function (st, si) { st.classList.toggle('on', si === i); });
    updateDots();
  }
  function showResult(eau, instant) {
    stepEls.forEach(function (st) { st.classList.remove('on'); });
    clearResult();
    var r = el('div', 'fstep fresult on');
    r.innerHTML =
      '<div class="identity' + (instant || REDUCE ? '' : ' r-canvas-in') + '"><canvas></canvas></div>' +
      '<div class="r-panel">' +
        '<p class="f-eyebrow">your eau — n° ' + eau.no + ' of 06</p>' +
        '<h3 class="r-name">' + eau.name + '<span class="dot">.</span></h3>' +
        '<p class="r-why">' + eau.why + '</p>' +
        noteChips(eau.notes) +
        '<div class="r-buy">' +
          '<button class="pill pill-ink add" data-eau="' + eau.id + '">add to bag — € ' + eau.price + '</button>' +
          '<span class="r-price"><span>50 ml · eau de parfum</span></span>' +
        '</div>' +
        '<div class="r-buy" style="margin-top:18px"><button class="r-again">start over</button></div>' +
      '</div>';
    stage.appendChild(r);
    resultEl = r;
    resultBlob = makeBlob(qs('canvas', r), eau.notes);
    qs('.r-again', r).addEventListener('click', function () {
      answers = [];
      showStep(0);
    });
  }

  stage.addEventListener('click', function (e) {
    var opt = e.target.closest('.f-opt');
    if (opt) {
      var qi = +opt.getAttribute('data-q');
      answers[qi] = +opt.getAttribute('data-o');
      answers.length = qi + 1;
      if (qi + 1 < ODE.QUESTIONS.length) showStep(qi + 1);
      else {
        var res = ODE.score(answers);
        showResult(ODE.findEau(res.id), false);
      }
      return;
    }
    var back = e.target.closest('.f-back');
    if (back) {
      var cur = stepEls.findIndex(function (st) { return st.classList.contains('on'); });
      if (cur > 0) showStep(cur - 1);
    }
  });

  /* ================= reveal on scroll ================= */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (REDUCE) {
    revealEls.forEach(function (n) { n.classList.add('in'); });
  } else {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); rio.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (n) { rio.observe(n); });
  }

  /* ================= smooth anchors ================= */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var t = document.getElementById(a.getAttribute('href').slice(1));
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth', block: 'start' });
  });

  /* ================= newsletter (dead, politely) ================= */
  var newsForm = qs('#newsForm');
  newsForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var b = qs('#newsBtn');
    b.textContent = 'noted.';
    b.disabled = true;
    qs('input', newsForm).disabled = true;
  });

  /* ================= query params: ?found= / ?step= ================= */
  var params = new URLSearchParams(location.search);
  var found = ODE.findEau(params.get('found'));
  var stepParam = parseInt(params.get('step'), 10);
  if (found) {
    showResult(found, true);
    revealEls.forEach(function (n) { n.classList.add('in'); });
    requestAnimationFrame(function () {
      document.getElementById('finder').scrollIntoView({ behavior: 'auto', block: 'start' });
    });
  } else if (stepParam >= 1 && stepParam <= ODE.QUESTIONS.length) {
    showStep(stepParam - 1);
    revealEls.forEach(function (n) { n.classList.add('in'); });
    requestAnimationFrame(function () {
      document.getElementById('finder').scrollIntoView({ behavior: 'auto', block: 'start' });
    });
  } else {
    showStep(0);
  }

  /* resize blobs once fonts/layout settle, then run */
  window.addEventListener('load', function () {
    blobs.forEach(function (b) { resizeBlob(b); drawBlob(b, REDUCE ? STILL_T : T); });
    startLoop();
  });
  startLoop();
})();
