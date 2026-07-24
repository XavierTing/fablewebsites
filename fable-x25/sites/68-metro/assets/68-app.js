/* CALDER METRO — live network simulation.
   Timetable-driven: every train position, tooltip departure and board row is a pure
   function of simulated clock time, so what the board promises is what the map does. */
(function () {
  'use strict';

  var NET = window.CALDER;
  var SVGNS = 'http://www.w3.org/2000/svg';
  var params = new URLSearchParams(location.search);
  var RUSH = params.get('state') === 'rush';
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- simulation constants (sim-seconds) ---------- */
  var TIME_SCALE = 30;          // 1 real second = 30 sim seconds
  var VMAX = 2;                 // px per sim-second
  var ACC = 0.05;               // px per sim-second^2
  var DWELL = 45;               // station dwell: 45 sim-s = 1.5 real-s
  var TERM_LINGER = 40;         // parked at final terminus before vanishing
  var DAY = 86400;

  var simSec = RUSH ? 17 * 3600 + 42 * 60 : 10 * 3600 + 24 * 60;

  /* ---------- kinematics: trapezoidal speed profile ---------- */
  var D_FULL = VMAX * VMAX / ACC; // distance needed to reach + shed VMAX

  function hopTime(d) {
    if (d >= D_FULL) return 2 * VMAX / ACC + (d - D_FULL) / VMAX;
    return 2 * Math.sqrt(d / ACC);
  }
  function hopPos(t, d) {
    if (d >= D_FULL) {
      var t1 = VMAX / ACC, T = 2 * t1 + (d - D_FULL) / VMAX;
      if (t <= t1) return 0.5 * ACC * t * t;
      if (t <= T - t1) return D_FULL / 2 + VMAX * (t - t1);
      var r = T - t; return d - 0.5 * ACC * r * r;
    }
    var tp = Math.sqrt(d / ACC), TT = 2 * tp;
    if (t <= tp) return 0.5 * ACC * t * t;
    var rr = TT - t; return d - 0.5 * ACC * rr * rr;
  }

  /* ---------- per-line geometry + timetable offsets ---------- */
  function segLens(pts) {
    var cum = [0];
    for (var i = 0; i < pts.length - 1; i++)
      cum.push(cum[i] + Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]));
    return cum;
  }
  function locate(pts, cum, x, y) {
    for (var i = 0; i < pts.length - 1; i++) {
      var ax = pts[i][0], ay = pts[i][1], bx = pts[i + 1][0], by = pts[i + 1][1];
      var abx = bx - ax, aby = by - ay, len = Math.hypot(abx, aby);
      var t = ((x - ax) * abx + (y - ay) * aby) / (len * len);
      var cross = abx * (y - ay) - aby * (x - ax);
      if (Math.abs(cross) / len < 0.01 && t >= -1e-9 && t <= 1 + 1e-9) return cum[i] + t * len;
    }
    return 0;
  }

  NET.lines.forEach(function (L, li) {
    L.idx = li;
    L.cum = segLens(L.pts);
    L.len = L.cum[L.cum.length - 1];
    L.sdist = L.stations.map(function (s) { return locate(L.pts, L.cum, s.x, s.y); });
    L.headway = RUSH ? Math.round(L.hw * 0.52) : L.hw;
    // dirs: 0 = as listed, 1 = reversed. sd = distance from dir origin per stop.
    L.dirs = [0, 1].map(function (dir) {
      var order = L.stations.map(function (_, i) { return i; });
      if (dir) order.reverse();
      var sd = order.map(function (i) { return dir ? L.len - L.sdist[i] : L.sdist[i]; });
      var arr = [0], dep = [0];
      for (var i = 1; i < sd.length; i++) {
        arr[i] = dep[i - 1] + hopTime(sd[i] - sd[i - 1]);
        dep[i] = arr[i] + DWELL;
      }
      return {
        dir: dir, order: order, sd: sd, arr: arr, dep: dep,
        run: arr[arr.length - 1] + TERM_LINGER,
        dest: L.stations[order[order.length - 1]].n,
        anchor: L.phase[dir]
      };
    });
  });

  /* position (distance from dir origin) for elapsed e since scheduled departure */
  function trainDist(D, e) {
    var n = D.sd.length;
    if (e <= 0) return D.sd[0];
    if (e >= D.arr[n - 1]) return D.sd[n - 1];
    for (var i = 0; i < n - 1; i++) {
      if (e < D.dep[i]) return D.sd[i];
      if (e < D.arr[i + 1]) return D.sd[i] + hopPos(e - D.dep[i], D.sd[i + 1] - D.sd[i]);
    }
    return D.sd[n - 1];
  }

  /* all trains on a line's direction at time t: [{k, e}] ; visible DWELL before departure */
  function activeTrains(L, D, t) {
    var out = [];
    var kmin = Math.ceil((t - D.run - D.anchor) / L.headway);
    var kmax = Math.floor((t + DWELL - D.anchor) / L.headway);
    for (var k = kmin; k <= kmax; k++) out.push({ k: k, e: t - (D.anchor + k * L.headway) });
    return out;
  }

  /* next departure times (sim-s) from stop index `si` (in dir order), count n */
  function nextDeps(L, D, si, t, n) {
    if (si === D.sd.length - 1) return []; // terminal arrivals: nothing departs

    var off = D.dep[si], res = [];
    var k = Math.ceil((t - off - D.anchor) / L.headway);
    for (var i = 0; i < n; i++) res.push(D.anchor + (k + i) * L.headway + off);
    return res;
  }

  function fmt(t) {
    t = ((t % DAY) + DAY) % DAY;
    var h = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60);
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
  }
  function fmtS(t) {
    var s = Math.floor(t % 60);
    return fmt(t) + ':' + (s < 10 ? '0' : '') + s;
  }

  /* ---------- unique-station registry ---------- */
  var registry = new Map();
  NET.lines.forEach(function (L) {
    L.stations.forEach(function (s, i) {
      if (!registry.has(s.n)) registry.set(s.n, { n: s.n, x: s.x, y: s.y, entries: [], kind: s.kind });
      var r = registry.get(s.n);
      r.entries.push({ L: L, si: i });
      if (s.kind && !r.kind) r.kind = s.kind;
      if (s.label) r.label = s.label;
    });
  });
  Object.keys(NET.interchanges).forEach(function (n) {
    var r = registry.get(n), ic = NET.interchanges[n];
    if (r) { r.x = ic.x; r.y = ic.y; r.ic = ic; }
  });
  Object.keys(NET.duos).forEach(function (n) {
    var r = registry.get(n), d = NET.duos[n];
    if (r) { r.x = d.x; r.y = d.y; r.duo = true; }
  });

  /* ---------- build the map SVG ---------- */
  var svg = document.getElementById('map');
  function el(name, attrs, parent) {
    var e = document.createElementNS(SVGNS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  // water band along the harbor
  el('rect', { x: 70, y: 892, width: 1470, height: 128, fill: '#e7e4d9' }, svg);
  var water = el('text', { x: 118, y: 986, 'class': 'water-label' }, svg);
  water.textContent = 'CALDER WATER';

  var gLines = el('g', {}, svg);
  var gStations = el('g', {}, svg);
  var gTrains = el('g', {}, svg);
  var gLabels = el('g', {}, svg);
  var gCaps = el('g', {}, svg);
  var gHits = el('g', {}, svg);

  NET.lines.forEach(function (L) {
    var d = 'M' + L.pts.map(function (p) { return p[0] + ',' + p[1]; }).join(' L');
    L.pathEl = el('path', {
      d: d, fill: 'none', stroke: L.color, 'stroke-width': 10,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round'
    }, gLines);
  });

  registry.forEach(function (r) {
    if (r.duo) {
      el('rect', {
        x: r.x - 7.5, y: r.y - 15.5, width: 15, height: 31, rx: 7.5,
        fill: '#fff', stroke: '#17171a', 'stroke-width': 2.5
      }, gStations);
    } else if (r.ic) {
      el('circle', {
        cx: r.x, cy: r.y, r: r.ic.r, fill: '#fff', stroke: '#17171a',
        'stroke-width': r.ic.r > 12 ? 3.5 : 3
      }, gStations);
    } else {
      el('circle', { cx: r.x, cy: r.y, r: 5, fill: '#fff', stroke: '#17171a', 'stroke-width': 2.5 }, gStations);
    }
    if (r.label) {
      var lab = el('text', {
        x: r.x + r.label[0], y: r.y + r.label[1],
        'text-anchor': r.label[2],
        'class': 'st-label' + ((r.kind && r.kind.indexOf('t') > -1) || r.ic ? ' b' : '')
      }, gLabels);
      lab.textContent = r.n;
    }
    var hit = el('circle', {
      cx: r.x, cy: r.y, r: 20, 'class': 'st-hit', tabindex: 0, role: 'button',
      'aria-label': r.n + ' station — live departures'
    }, gHits);
    hit.__station = r;
  });

  NET.lines.forEach(function (L) {
    (L.caps || []).forEach(function (c) {
      el('circle', { cx: c[0], cy: c[1], r: 12, fill: L.color }, gCaps);
      var t = el('text', { x: c[0], y: c[1] + 0.5, 'class': 'cap-letter' }, gCaps);
      t.textContent = L.id;
    });
  });

  /* ---------- trains ---------- */
  var trainPool = new Map(); // key -> {g, dot}
  function renderTrains(t) {
    var seen = {};
    NET.lines.forEach(function (L) {
      L.dirs.forEach(function (D) {
        activeTrains(L, D, t).forEach(function (a) {
          var key = L.id + ':' + D.dir + ':' + a.k;
          seen[key] = true;
          var tr = trainPool.get(key);
          if (!tr) {
            var g = el('g', { 'class': 'train' }, gTrains);
            el('circle', { r: 7.5, fill: '#17171a', stroke: '#f4f3ef', 'stroke-width': 2.2 }, g);
            el('circle', { r: 3, fill: L.color }, g);
            tr = { g: g };
            trainPool.set(key, tr);
          }
          var prog = trainDist(D, REDUCED ? snapToStation(D, a.e) : a.e);
          var pathLen = D.dir ? L.len - prog : prog;
          var p = L.pathEl.getPointAtLength(Math.max(0, Math.min(L.len, pathLen)));
          tr.g.setAttribute('transform', 'translate(' + p.x.toFixed(2) + ',' + p.y.toFixed(2) + ')');
        });
      });
    });
    trainPool.forEach(function (tr, key) {
      if (!seen[key]) { tr.g.remove(); trainPool.delete(key); }
    });
  }
  /* reduced motion: park each train at the stop it is at/approaching */
  function snapToStation(D, e) {
    for (var i = 0; i < D.arr.length; i++) if (e < D.dep[i] || i === D.arr.length - 1) return Math.min(e < D.arr[i] ? D.arr[i] : e, D.arr[i]);
    return e;
  }

  /* ---------- legend ---------- */
  var legend = document.getElementById('legend');
  NET.lines.forEach(function (L) {
    var a = document.createElement('a');
    a.href = '#line-' + L.id;
    a.innerHTML = '<span class="disc" style="background:' + L.color + '">' + L.id + '</span>' +
      '<span class="lg-name">' + L.name + '</span>' +
      '<span class="lg-termini">' + L.stations[0].n + ' – ' + L.stations[L.stations.length - 1].n + '</span>';
    legend.appendChild(a);
  });

  /* ---------- tooltip ---------- */
  var tip = document.getElementById('tip');
  var mapInner = document.getElementById('mapInner');
  var openStation = null;

  function tipHTML(r, t) {
    var lines = {};
    r.entries.forEach(function (en) { lines[en.L.id] = true; });
    var html = '<h4>' + r.n + '</h4><p class="tip-sub">' +
      Object.keys(lines).join(' · ') + ' · next departures</p>';
    var rows = 0;
    r.entries.forEach(function (en) {
      en.L.dirs.forEach(function (D) {
        var si = D.order.indexOf(en.si);
        var deps = nextDeps(en.L, D, si, t, 2);
        if (!deps.length) return;
        rows++;
        html += '<div class="tip-row">' +
          '<span class="disc" style="background:' + en.L.color + '">' + en.L.id + '</span>' +
          '<span class="tip-dest">→ ' + D.dest + '</span>' +
          '<span class="tip-times">' + fmt(deps[0]) + ' · ' + fmt(deps[1]) + '</span></div>';
      });
    });
    if (!rows) html += '<p class="tip-none">Terminal stop — no departures.</p>';
    return html;
  }

  function placeTip(r) {
    var pt = svg.createSVGPoint(); pt.x = r.x; pt.y = r.y;
    var m = svg.getScreenCTM();
    if (!m) return;
    var sp = pt.matrixTransform(m);
    var host = mapInner.getBoundingClientRect();
    var x = sp.x - host.left, y = sp.y - host.top;
    var w = tip.offsetWidth || 250, h = tip.offsetHeight || 120;
    var lx = x + 18, ly = y - h / 2;
    if (lx + w > host.width - 8) lx = x - w - 18;
    ly = Math.max(6, Math.min(host.height - h - 6, ly));
    tip.style.left = lx + 'px';
    tip.style.top = ly + 'px';
  }

  function openTip(r) {
    openStation = r;
    tip.innerHTML = tipHTML(r, simSec);
    tip.hidden = false;
    placeTip(r);
  }
  function closeTip() { openStation = null; tip.hidden = true; }

  gHits.addEventListener('pointerenter', function (e) {
    if (e.target.__station) openTip(e.target.__station);
  }, true);
  gHits.addEventListener('pointerleave', function (e) {
    if (e.target.__station && openStation === e.target.__station) closeTip();
  }, true);
  gHits.addEventListener('click', function (e) {
    if (e.target.__station) { openTip(e.target.__station); e.stopPropagation(); }
  });
  gHits.addEventListener('focusin', function (e) {
    if (e.target.__station) openTip(e.target.__station);
  });
  gHits.addEventListener('focusout', function () { closeTip(); });
  document.addEventListener('click', function (e) {
    if (openStation && !gHits.contains(e.target)) closeTip();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeTip(); });
  gHits.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.__station) {
      e.preventDefault();
      if (openStation === e.target.__station) closeTip(); else openTip(e.target.__station);
    }
  });

  /* ---------- split-flap departure board ---------- */
  var CHARSET = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:—·';
  var HALF = 95, STEP = HALF * 2.2, GAP = 26;

  function FlapCell(parent) {
    var d = document.createElement('div');
    d.className = 'cell';
    d.innerHTML = '<span class="h ht s"><i> </i></span><span class="h hb s"><i> </i></span>' +
      '<span class="h ht f"><i> </i></span><span class="h hb f"><i> </i></span>';
    parent.appendChild(d);
    this.el = d;
    this.i = d.querySelectorAll('i');
    this.cur = ' ';
    this.target = ' ';
    this.queue = [];
    this.busyUntil = 0;
  }
  FlapCell.prototype.set = function (ch, delay, now) {
    if (ch === this.target) return;
    this.target = ch;
    if (REDUCED) {
      this.cur = ch;
      this.i[0].textContent = ch; this.i[1].textContent = ch;
      return;
    }
    // plan spin: step through charset, at most 4 intermediate flips.
    // Always cancel any stale plan first — a pending queue toward an old target
    // must never keep draining after a retarget (it would land the wrong char).
    this.queue = [];
    var ci = CHARSET.indexOf(this.cur), ti = CHARSET.indexOf(ch);
    if (ci < 0) ci = 0; if (ti < 0) ti = 0;
    var dist = (ti - ci + CHARSET.length) % CHARSET.length;
    var steps = [];
    if (dist === 0) return; // already showing (or mid-flip landing) the target
    var nSteps = Math.min(dist, 4);
    for (var s = 1; s <= nSteps; s++) {
      var idx = (ci + Math.round(dist * s / nSteps)) % CHARSET.length;
      if (steps.indexOf(CHARSET[idx]) === -1 || s === nSteps) steps.push(CHARSET[idx]);
    }
    steps[steps.length - 1] = ch;
    this.queue = steps;
    if (this.busyUntil < now) this.busyUntil = now + (delay || 0);
  };
  FlapCell.prototype.tick = function (now) {
    if (!this.queue.length || now < this.busyUntil) return;
    if (this.el.classList.contains('go')) {
      // finish previous step
      this.el.classList.remove('go');
      this.i[0].textContent = this.cur; this.i[1].textContent = this.cur;
    }
    var next = this.queue.shift();
    // statics: top shows next (revealed as flap falls), bottom holds current
    this.i[0].textContent = next;
    this.i[1].textContent = this.cur;
    this.i[2].textContent = this.cur;   // flipping top carries old char away
    this.i[3].textContent = next;       // flipping bottom lands the new char
    void this.el.offsetWidth;
    this.el.classList.add('go');
    this.cur = next;
    this.busyUntil = now + STEP + GAP;
  };
  FlapCell.prototype.settle = function (now) {
    if (this.el.classList.contains('go') && now >= this.busyUntil - GAP) {
      this.el.classList.remove('go');
      this.i[0].textContent = this.cur; this.i[1].textContent = this.cur;
    }
  };

  var COLS = [
    { k: 'time', n: 5, label: 'Time' },
    { k: 'line', n: 1, label: 'Ln' },
    { k: 'dest', n: 12, label: 'Destination' },
    { k: 'plat', n: 1, label: 'Pl' },
    { k: 'status', n: 8, label: 'Status' }
  ];
  var boardEl = document.getElementById('board');
  var boardRows = [];
  (function buildBoard() {
    var head = document.createElement('div');
    head.className = 'bhead';
    COLS.forEach(function (c) {
      var s = document.createElement('span');
      s.textContent = c.label;
      s.setAttribute('data-k', c.k);
      s.style.width = 'calc(' + c.n + ' * var(--cw) + ' + (c.n - 1) + ' * var(--cg))';
      head.appendChild(s);
    });
    boardEl.appendChild(head);
    for (var rIdx = 0; rIdx < 6; rIdx++) {
      var row = document.createElement('div');
      row.className = 'brow';
      var cells = {}, flat = [];
      COLS.forEach(function (c) {
        var col = document.createElement('div');
        col.className = 'bcol';
        col.setAttribute('data-k', c.k);
        cells[c.k] = [];
        for (var i = 0; i < c.n; i++) {
          var fc = new FlapCell(col);
          cells[c.k].push(fc); flat.push(fc);
        }
        row.appendChild(col);
      });
      boardEl.appendChild(row);
      boardRows.push({ el: row, cells: cells, flat: flat, sig: '' });
    }
  })();

  function pad(str, n) { return (str + '                    ').slice(0, n); }

  /* board groups at Meridian Exchange: [lineId, dir, platform] */
  function meridianGroups() {
    var groups = [];
    NET.lines.forEach(function (L) {
      L.stations.forEach(function (s, i) {
        if (s.n !== 'Meridian Exchange') return;
        L.dirs.forEach(function (D) {
          var si = D.order.indexOf(i);
          if (si === D.sd.length - 1) return; // terminal arrival direction
          groups.push({ L: L, D: D, si: si, plat: NET.platforms[L.id + D.dir] || '·' });
        });
      });
    });
    return groups;
  }
  var GROUPS = meridianGroups();

  function boardData(t) {
    var deps = [];
    GROUPS.forEach(function (g) {
      nextDeps(g.L, g.D, g.si, t, 3).forEach(function (dt) {
        deps.push({ t: dt, L: g.L, dest: g.D.dest, plat: g.plat });
      });
    });
    deps.sort(function (a, b) { return a.t - b.t; });
    return deps.slice(0, 6).map(function (d) {
      var lead = d.t - t;
      var status = lead <= DWELL ? 'BOARDING' : (lead <= 150 ? 'DUE' : 'ON TIME');
      return { time: fmt(d.t), line: d.L.id, dest: d.dest.toUpperCase(), plat: d.plat, status: status };
    });
  }

  function updateBoard(t, nowMs) {
    var data = boardData(t);
    data.forEach(function (d, r) {
      var row = boardRows[r];
      var sig = d.time + d.line + d.dest + d.plat + d.status;
      if (sig === row.sig) return;
      row.sig = sig;
      var strs = {
        time: pad(d.time, 5), line: d.line,
        dest: pad(d.dest, 12), plat: d.plat, status: pad(d.status, 8)
      };
      var colIdx = 0;
      COLS.forEach(function (c) {
        var str = strs[c.k];
        row.cells[c.k].forEach(function (cell, i) {
          cell.set(str[i] || ' ', (colIdx + i) * 24, nowMs);
          if (c.k === 'line') cell.el.setAttribute('data-ln', d.line);
        });
        colIdx += c.n;
      });
    });
  }

  /* ---------- the lines section ---------- */
  var lineRows = document.getElementById('lineRows');
  NET.lines.forEach(function (L) {
    var row = document.createElement('div');
    row.className = 'line-row reveal';
    row.id = 'line-' + L.id;
    var n = L.stations.length;
    var gap = 92, padL = 30, padR = 120;
    var W = padL + (n - 1) * gap + padR, H = 132, Y = 104;
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg">';
    s += '<line x1="' + padL + '" y1="' + Y + '" x2="' + (padL + (n - 1) * gap) + '" y2="' + Y +
      '" stroke="' + L.color + '" stroke-width="8" stroke-linecap="round"/>';
    L.stations.forEach(function (st, i) {
      var x = padL + i * gap;
      var big = st.kind && (st.kind.indexOf('i') > -1);
      var term = st.kind && st.kind.indexOf('t') > -1;
      s += big
        ? '<circle cx="' + x + '" cy="' + Y + '" r="7.5" fill="#fff" stroke="#17171a" stroke-width="2.6"/>'
        : '<circle cx="' + x + '" cy="' + Y + '" r="4.5" fill="#fff" stroke="#17171a" stroke-width="2.2"/>';
      s += '<text class="strip-label' + (big || term ? ' b' : '') + '" x="' + (x + 4) + '" y="' + (Y - 16) +
        '" transform="rotate(-45 ' + (x + 4) + ' ' + (Y - 16) + ')">' + st.n + '</text>';
    });
    s += '</svg>';
    row.innerHTML =
      '<span class="disc" style="background:' + L.color + '">' + L.id + '</span>' +
      '<div><p class="lr-name">' + L.id + ' · ' + L.name + '</p>' +
      '<p class="lr-termini">' + L.stations[0].n + ' ↔ ' + L.stations[n - 1].n + '</p>' +
      '<p class="lr-meta">' + n + ' stations · every ' + Math.round(L.headway / 60) + ' min</p>' +
      '<p class="lr-blurb">' + L.blurb + '</p></div>' +
      '<div class="strip-scroll">' + s + '</div>';
    lineRows.appendChild(row);
  });

  /* ---------- clocks ---------- */
  var clockA = document.getElementById('clockA');
  var clockB = document.getElementById('clockB');
  var lastClock = '';
  function updateClock() {
    var s = fmtS(simSec);
    if (s !== lastClock) {
      lastClock = s;
      clockA.textContent = s;
      clockB.textContent = s;
    }
  }

  /* ---------- main loop (pauses when tab hidden) ---------- */
  var rafId = null, lastTs = 0, boardTimer = 0, tipTimer = 0;

  function frame(ts) {
    rafId = requestAnimationFrame(frame);
    var dt = Math.min(ts - lastTs || 16, 100);
    lastTs = ts;
    if (!REDUCED) simSec += dt / 1000 * TIME_SCALE;
    renderTrains(simSec);
    updateClock();
    boardTimer += dt;
    if (boardTimer > 400) { boardTimer = 0; updateBoard(simSec, ts); }
    boardRows.forEach(function (r) { r.flat.forEach(function (c) { c.tick(ts); c.settle(ts); }); });
    if (openStation) {
      placeTip(openStation);
      tipTimer += dt;
      if (tipTimer > 500) { tipTimer = 0; tip.innerHTML = tipHTML(openStation, simSec); }
    }
  }

  function start() {
    if (rafId === null) { lastTs = performance.now(); rafId = requestAnimationFrame(frame); }
  }
  function stop() {
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });

  if (REDUCED) {
    // static render: trains parked at stations, board as instant text, clock frozen
    renderTrains(simSec);
    updateClock();
    updateBoard(simSec, performance.now());
  } else {
    start();
  }

  /* ---------- entrance: draw lines in ---------- */
  if (!REDUCED) {
    gTrains.style.opacity = '0';
    gTrains.style.transition = 'opacity .9s ease 1.6s';
    NET.lines.forEach(function (L, i) {
      var p = L.pathEl, len = L.len + 30;
      p.style.strokeDasharray = len + ' ' + len;
      p.style.strokeDashoffset = len;
      p.getBoundingClientRect();
      p.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(.6,.05,.25,1) ' + (0.15 + i * 0.14) + 's';
      p.style.strokeDashoffset = '0';
    });
    [gStations, gLabels, gCaps].forEach(function (g, i) {
      g.style.opacity = '0';
      g.style.transition = 'opacity .8s ease ' + (1.0 + i * 0.25) + 's';
    });
    requestAnimationFrame(function () {
      [gStations, gLabels, gCaps].forEach(function (g) { g.style.opacity = '1'; });
      gTrains.style.opacity = '1';
    });
    setTimeout(function () {
      NET.lines.forEach(function (L) {
        L.pathEl.style.strokeDasharray = '';
        L.pathEl.style.strokeDashoffset = '';
        L.pathEl.style.transition = '';
      });
    }, 2600);
  }

  /* ---------- scroll reveals ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (REDUCED || !('IntersectionObserver' in window)) {
    reveals.forEach(function (r) { r.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (r) { io.observe(r); });
  }

  /* ---------- mobile: pan hint + centre the map on Meridian ---------- */
  var mapScroll = document.getElementById('mapScroll');
  var panHint = document.getElementById('panHint');
  function centreMap() {
    if (mapScroll.scrollWidth > mapScroll.clientWidth + 10) {
      var frac = (760 - 70) / 1470;
      mapScroll.scrollLeft = mapScroll.scrollWidth * frac - mapScroll.clientWidth / 2;
      panHint.classList.add('on');
    } else {
      panHint.classList.remove('on');
    }
  }
  centreMap();
  window.addEventListener('resize', centreMap);
  // arm the dismiss handlers only after the programmatic centring scroll has fired,
  // otherwise the hint dies before anyone sees it
  var hintArmed = false;
  setTimeout(function () { hintArmed = true; }, 900);
  function hideHint() { if (hintArmed) panHint.classList.remove('on'); }
  mapScroll.addEventListener('scroll', hideHint, { passive: true });
  ['pointerdown', 'touchstart'].forEach(function (ev) {
    mapScroll.addEventListener(ev, hideHint, { passive: true });
  });

  /* ---------- ?poke=Station — open a tooltip (screenshots / demos) ---------- */
  var poke = params.get('poke');
  if (poke) {
    setTimeout(function () {
      var name = poke.toLowerCase();
      registry.forEach(function (r) { if (r.n.toLowerCase() === name) openTip(r); });
    }, 1200);
  }

  /* ---------- ?selftest=1 — assert board/tooltip promises match the sim ---------- */
  if (params.get('selftest')) {
    setTimeout(function () {
      var out = [], pass = 0, fail = 0;
      function check(L, D, si, label) {
        var depT = nextDeps(L, D, si, simSec, 1)[0];
        var probe = depT - 1; // one sim-second before departure: train must be AT the stop
        var found = activeTrains(L, D, probe).some(function (a) {
          return Math.abs(trainDist(D, a.e) - D.sd[si]) < 0.6;
        });
        if (found) { pass++; out.push('PASS ' + label + ' — dep ' + fmt(depT) + ': train present at stop'); }
        else { fail++; out.push('FAIL ' + label + ' — dep ' + fmt(depT) + ': NO train at stop'); }
      }
      // tooltip cases across lines/directions
      check(NET.lines[0], NET.lines[0].dirs[0], 3, 'A→Saltmeadow @ Tidegate');
      check(NET.lines[0], NET.lines[0].dirs[1], 5, 'A→Westhaven @ Ropewalk');
      check(NET.lines[4], NET.lines[4].dirs[1], 2, 'K→Applegarth @ Halvorsen');
      check(NET.lines[3], NET.lines[3].dirs[1], 0, 'E→Fairholt @ Meridian (terminus dep)');
      // first three board rows
      boardData(simSec).slice(0, 3).forEach(function (row, i) {
        var g = GROUPS.filter(function (gg) { return gg.L.id === row.line && gg.D.dest.toUpperCase() === row.dest; })[0];
        if (!g) { fail++; out.push('FAIL board row ' + i + ': group not found'); return; }
        var depT = nextDeps(g.L, g.D, g.si, simSec, 1)[0];
        var found = activeTrains(g.L, g.D, depT - 1).some(function (a) {
          return Math.abs(trainDist(g.D, a.e) - g.D.sd[g.si]) < 0.6;
        });
        if (found) { pass++; out.push('PASS board ' + row.line + '→' + row.dest + ' ' + row.time); }
        else { fail++; out.push('FAIL board ' + row.line + '→' + row.dest + ' ' + row.time); }
      });
      var st = document.getElementById('selftest');
      st.hidden = false;
      st.textContent = 'SIM SELFTEST — ' + pass + ' pass / ' + fail + ' fail\n' + out.join('\n');
    }, 1500);
  }
})();
