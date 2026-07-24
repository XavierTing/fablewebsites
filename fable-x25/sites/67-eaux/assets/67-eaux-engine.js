/* ode. — engine: note→color map, the line, the finder scoring, gradient fields.
   Pure data + pure functions. UMD so node can verify it and the browser can use it. */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory();
  else root.ODE = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---- the fixed note→color map. same note, same color, everywhere. ---- */
  var NOTE_COLORS = {
    'bergamot':     '#f2cf3e', // citrine
    'neroli':       '#ffb45c', // blossom amber
    'fig leaf':     '#79b061', // green
    'iris':         '#a893c6', // powdery violet-grey
    'musk':         '#ecd6d3', // pale grey-pink
    'cedar':        '#c8a077', // warm tan
    'black pepper': '#413c39', // charcoal
    'leather':      '#8a4f2c', // saddle
    'saffron':      '#e2662a', // burnt orange
    'vanilla':      '#f4e2bb', // cream
    'almond':       '#e5c290', // pale toast
    'sea salt':     '#c8e0e4', // cold pale aqua
    'driftwood':    '#a5948a', // bleached grey wood
    'ambergris':    '#6e93a6', // marine slate
    'wet soil':     '#5c4634', // umber
    'vetiver':      '#47653f'  // dark rooty green
  };

  /* ---- the line. order here is the deterministic tie-break order. ---- */
  var EAUX = [
    {
      id: 'solaire', name: 'solaire', no: '01', price: 84,
      notes: ['bergamot', 'fig leaf', 'neroli'],
      line: 'a fig tree at 9 a.m.',
      why: 'you open the blinds all the way, immediately, and you have opinions about breakfast. solaire is a fig tree doing its best morning work — bright, green, slightly smug about it.'
    },
    {
      id: 'grey-area', name: 'grey area', no: '02', price: 96,
      notes: ['iris', 'musk', 'cedar'],
      line: 'the well-worded email',
      why: 'you answer “how are you” honestly, which unsettles people. grey area is powder and pencil shavings at a respectful distance — the scent equivalent of a perfectly worded email.'
    },
    {
      id: 'tantrum', name: 'tantrum', no: '03', price: 112,
      notes: ['black pepper', 'leather', 'saffron'],
      line: 'heat without noise',
      why: 'you have never once raised your voice, because you have never once needed to. tantrum is pepper cracked over warm leather, saffron holding the door — heat without any noise.'
    },
    {
      id: 'milk-teeth', name: 'milk teeth', no: '04', price: 88,
      notes: ['vanilla', 'musk', 'almond'],
      line: 'the good blanket',
      why: 'you keep the good blanket on the visible shelf, where guests can earn it. milk teeth is vanilla before it learned to be a dessert — warm, milky, faintly bitter at the edges so it never cloys.'
    },
    {
      id: 'open-water', name: 'open water', no: '05', price: 104,
      notes: ['sea salt', 'driftwood', 'ambergris'],
      line: 'the window seat',
      why: 'you picked the window seat every time, even at the aisle price. open water is a cold coastline with the heating on — salt, sun-bleached wood, something faintly animal underneath.'
    },
    {
      id: 'houseplant', name: 'houseplant', no: '06', price: 92,
      notes: ['fig leaf', 'wet soil', 'vetiver'],
      line: 'the good kind of dark',
      why: 'you talk to the monstera, and the monstera listens. houseplant is green the way rooms are green — leaf, damp earth, the good kind of dark under the shelf.'
    }
  ];

  /* ---- the finder. each answer carries weights toward the six eaux. ---- */
  var QUESTIONS = [
    {
      q: 'how does your morning start?',
      options: [
        { label: 'espresso, standing up', chips: ['black pepper', 'saffron'], w: { 'tantrum': 2, 'grey-area': 1 } },
        { label: 'juice in the sun', chips: ['bergamot', 'neroli'], w: { 'solaire': 2, 'open-water': 1 } },
        { label: 'can’t talk yet', chips: ['vanilla', 'musk'], w: { 'milk-teeth': 2, 'houseplant': 1 } }
      ]
    },
    {
      q: 'pick a sunday.',
      options: [
        { label: 'open every window', chips: ['fig leaf', 'bergamot'], w: { 'solaire': 2, 'houseplant': 1 } },
        { label: 'the sea, even in winter', chips: ['sea salt', 'driftwood'], w: { 'open-water': 2 } },
        { label: 'horizontal until further notice', chips: ['musk', 'vanilla'], w: { 'milk-teeth': 2, 'grey-area': 1 } },
        { label: 'rearrange everything, twice', chips: ['leather', 'vetiver'], w: { 'tantrum': 2, 'houseplant': 1 } }
      ]
    },
    {
      q: 'your texting style?',
      options: [
        { label: 'read. replied. filed.', chips: ['iris', 'cedar'], w: { 'grey-area': 2, 'tantrum': 1 } },
        { label: 'voice notes, seven minutes each', chips: ['neroli', 'almond'], w: { 'solaire': 2, 'milk-teeth': 1 } },
        { label: 'left on read (affectionately)', chips: ['ambergris', 'wet soil'], w: { 'open-water': 2, 'houseplant': 1 } }
      ]
    },
    {
      q: 'pick a place to live.',
      options: [
        { label: 'a lighthouse, obviously', chips: ['sea salt', 'ambergris'], w: { 'open-water': 2, 'tantrum': 1 } },
        { label: 'a greenhouse with a bed in it', chips: ['fig leaf', 'wet soil'], w: { 'houseplant': 2, 'solaire': 1 } },
        { label: 'a hotel room, permanently', chips: ['iris', 'black pepper'], w: { 'grey-area': 2, 'tantrum': 1 } },
        { label: 'your grandmother’s kitchen', chips: ['vanilla', 'almond'], w: { 'milk-teeth': 2 } }
      ]
    }
  ];

  /* ---- scoring: sum weights; highest wins; ties break to the earliest
     eau in EAUX order (the line order). fully deterministic. ---- */
  function score(answers) {
    var totals = {};
    for (var i = 0; i < EAUX.length; i++) totals[EAUX[i].id] = 0;
    for (var q = 0; q < answers.length && q < QUESTIONS.length; q++) {
      var opt = QUESTIONS[q].options[answers[q]];
      if (!opt) continue;
      for (var id in opt.w) totals[id] += opt.w[id];
    }
    var best = EAUX[0].id;
    for (var e = 1; e < EAUX.length; e++) {
      if (totals[EAUX[e].id] > totals[best]) best = EAUX[e].id; // strict >, so earlier order wins ties
    }
    return { id: best, totals: totals };
  }

  function findEau(slug) {
    if (!slug) return null;
    var s = String(slug).toLowerCase().trim().replace(/[\s+_]+/g, '-');
    for (var i = 0; i < EAUX.length; i++) {
      if (EAUX[i].id === s || EAUX[i].name.replace(/\s+/g, '-') === s) return EAUX[i];
    }
    return null;
  }

  /* ---- color helpers ---- */
  function hexToRgb(hex) {
    var n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function mix(hexA, hexB, t) { // t: 0 → A, 1 → B
    var a = hexToRgb(hexA), b = hexToRgb(hexB);
    return [Math.round(a[0] + (b[0] - a[0]) * t),
            Math.round(a[1] + (b[1] - a[1]) * t),
            Math.round(a[2] + (b[2] - a[2]) * t)];
  }
  function rgba(rgb, a) { return 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + a + ')'; }

  /* ---- deterministic per-note hash (cyrb53-style, seed 67) ---- */
  function hash(str) {
    var h1 = 0xdeadbeef ^ 67, h2 = 0x41c6ce57 ^ 67;
    for (var i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  }
  function unit(str) { return (hash(str) % 100000) / 100000; } // deterministic [0,1)

  /* ---- gradient fields: the formula, rendered. keyed by note string only,
     so a shared note drifts identically on every card that contains it. ---- */
  var BG = '#fbfbf9';
  function luma(rgb) { return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255; }
  function fieldsFor(notes) {
    var fields = [];
    for (var i = 0; i < notes.length; i++) {
      var note = notes[i];
      var col = NOTE_COLORS[note];
      var rgb = hexToRgb(col);
      var dark = luma(rgb) < 0.38; // charcoal, umber, vetiver — keep them airy
      // two fields per note: one broad wash, one denser core; spread past the
      // edges so color reaches every border — flat silk, not a sphere.
      for (var k = 0; k < 2; k++) {
        var key = note + ':' + k;
        fields.push({
          note: note,
          rgb: rgb,
          bx: -0.10 + unit(key + ':x') * 1.20,
          by: -0.10 + unit(key + ':y') * 1.20,
          ax: 0.12 + unit(key + ':ax') * 0.16,
          ay: 0.12 + unit(key + ':ay') * 0.16,
          sx: 0.05 + unit(key + ':sx') * 0.08,   // rad/s — slow breathing
          sy: 0.05 + unit(key + ':sy') * 0.08,
          px: unit(key + ':px') * Math.PI * 2,
          py: unit(key + ':py') * Math.PI * 2,
          r:  k === 0 ? 0.85 + unit(key + ':r') * 0.35 : 0.5 + unit(key + ':r') * 0.22,
          a:  (k === 0 ? 0.6 : 0.78) * (dark ? 0.72 : 1)
        });
      }
    }
    return fields;
  }
  function baseFor(notes) { // milky wash: first two notes pulled toward paper
    var c = notes.length > 1 ? mix(NOTE_COLORS[notes[0]], NOTE_COLORS[notes[1]], 0.35)
                             : hexToRgb(NOTE_COLORS[notes[0]]);
    var b = mix('#000000', BG, 1); // paper rgb
    return [Math.round(c[0] + (b[0] - c[0]) * 0.55),
            Math.round(c[1] + (b[1] - c[1]) * 0.55),
            Math.round(c[2] + (b[2] - c[2]) * 0.55)];
  }

  return {
    NOTE_COLORS: NOTE_COLORS, EAUX: EAUX, QUESTIONS: QUESTIONS,
    score: score, findEau: findEau,
    hexToRgb: hexToRgb, mix: mix, rgba: rgba,
    hash: hash, unit: unit, fieldsFor: fieldsFor, baseFor: baseFor, BG: BG
  };
});
