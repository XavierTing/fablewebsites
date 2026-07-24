/* L'ORGUE — accord engine + page logic.
   Pure engine (materials, hashing, naming, description, dry-down math) is
   exported for node verification; DOM code runs only in the browser. */
(function (root) {
  'use strict';

  /* ---------------------------------------------------------------- data */
  var FAM = {
    agrumes: { label: 'Agrumes', col: '#b8860f' },
    epice:   { label: 'Épices',  col: '#a54a1f' },
    floral:  { label: 'Fleurs',  col: '#a05a68' },
    vert:    { label: 'Verts',   col: '#67743a' },
    resine:  { label: 'Résines', col: '#7c5a24' },
    boise:   { label: 'Bois',    col: '#6d4c2c' },
    mousse:  { label: 'Mousses', col: '#4f5c38' },
    ambre:   { label: 'Ambres',  col: '#8a5a1e' },
    musc:    { label: 'Muscs',   col: '#a8905f' },
    cuir:    { label: 'Cuirs',   col: '#503527' }
  };

  /* tier: tete | coeur | fond.  ten = hour the note has fully left the skin. */
  var MATERIALS = [
    { id: 'bergamote',   name: 'Bergamote',      lat: 'Citrus bergamia · Calabre',      tier: 'tete',  fam: 'agrumes', ten: 1.6,
      frags: ['bitter-bright Calabrian bergamot, all zest and morning light', 'a green-gold flash of bergamot, sharp as cut glass'] },
    { id: 'petitgrain',  name: 'Petitgrain',     lat: 'Citrus aurantium fol. · Paraguay', tier: 'tete', fam: 'agrumes', ten: 1.9,
      frags: ['petitgrain’s crushed-leaf snap, orchard twigs after rain', 'a bitter leafy brightness, the orange tree speaking through its branches'] },
    { id: 'neroli',      name: 'Néroli',         lat: 'Citrus aurantium flos · Tunisie', tier: 'tete',  fam: 'floral',  ten: 2.3,
      frags: ['néroli, white and weightless, orange blossom held up to the sun', 'a clean white hum of néroli, soap-bright and faintly honeyed'] },
    { id: 'poivre-rose', name: 'Poivre rose',    lat: 'Schinus molle · Réunion',        tier: 'tete',  fam: 'epice',   ten: 1.5,
      frags: ['pink peppercorn crackling rose-red at the surface', 'a dry rosy spark of pink pepper, more light than heat'] },
    { id: 'cardamome',   name: 'Cardamome',      lat: 'Elettaria cardamomum · Guatemala', tier: 'tete', fam: 'epice',  ten: 2.1,
      frags: ['cold cardamom, camphor-green and silvered', 'cardamom’s icy spice, a draught through a kitchen door'] },
    { id: 'safran',      name: 'Safran',         lat: 'Crocus sativus · Khorassan',     tier: 'tete',  fam: 'epice',   ten: 2.6,
      frags: ['saffron threads — leather, honey and iodine in a single filament', 'a burnished saffron glow, strange as an apothecary jar'] },
    { id: 'galbanum',    name: 'Galbanum',       lat: 'Ferula galbaniflua · Iran',      tier: 'tete',  fam: 'vert',    ten: 1.8,
      frags: ['galbanum, green to the point of bitterness — snapped stems, cold sap', 'a sharp verdant hiss of galbanum, the garden before dawn'] },

    { id: 'rose-de-mai', name: 'Rose de mai',    lat: 'Rosa centifolia · Grasse',       tier: 'coeur', fam: 'floral',  ten: 6.5,
      frags: ['rose de mai in full flush, jammy and dew-heavy', 'a hundred-petalled rose, velvet folded on velvet'] },
    { id: 'jasmin',      name: 'Jasmin sambac',  lat: 'Jasminum sambac · Tamil Nadu',   tier: 'coeur', fam: 'floral',  ten: 7.0,
      frags: ['jasmine sambac, narcotic and night-blooming', 'white jasmine warmed on the skin until it turns animal'] },
    { id: 'ylang',       name: 'Ylang-ylang',    lat: 'Cananga odorata · Nosy Be',      tier: 'coeur', fam: 'floral',  ten: 6.0,
      frags: ['ylang-ylang, custard-yellow and solar, nearly banana-sweet', 'a creamy tropical sway of ylang, petals gone molten'] },
    { id: 'osmanthus',   name: 'Osmanthus',      lat: 'Osmanthus fragrans · Guilin',    tier: 'coeur', fam: 'floral',  ten: 5.5,
      frags: ['osmanthus, dried apricots and fine suede', 'an autumn-tea softness of osmanthus, fruit and leather at once'] },
    { id: 'iris',        name: 'Iris pallida',   lat: 'Iris pallida · Toscane',         tier: 'coeur', fam: 'floral',  ten: 8.0,
      frags: ['orris butter, cool and rooty, powdered silver', 'iris the colour of rain — suede, cold earth, a drawn breath'] },
    { id: 'labdanum',    name: 'Labdanum',       lat: 'Cistus ladaniferus · Andalousie', tier: 'coeur', fam: 'resine', ten: 9.0,
      frags: ['labdanum’s dark resin — sun-cooked rockrose and old honey', 'a balsamic amber shadow of labdanum, warm as a borrowed coat'] },
    { id: 'oliban',      name: 'Oliban',         lat: 'Boswellia sacra · Dhofar',       tier: 'coeur', fam: 'resine',  ten: 7.5,
      frags: ['frankincense lifting in a thin ecclesiastic ribbon', 'olibanum, peppery-cold smoke over hot stone'] },

    { id: 'vetiver',     name: 'Vétiver',        lat: 'Vetiveria zizanoides · Haïti',   tier: 'fond',  fam: 'boise',   ten: 12.5,
      frags: ['vetiver, earthy and grapefruit-bitter, roots pulled wet from the bank', 'a smoky vetiver dryness that lasts into the next day'] },
    { id: 'santal',      name: 'Santal',         lat: 'Santalum album · Mysore',        tier: 'fond',  fam: 'boise',   ten: 12.5,
      frags: ['milky, meditative sandalwood, sanded smooth', 'a soft sawdust warmth of santal humming under everything'] },
    { id: 'cedre',       name: 'Cèdre',          lat: 'Cedrus atlantica · Atlas',       tier: 'fond',  fam: 'boise',   ten: 11.0,
      frags: ['cedar’s pencil-shaving austerity, dry and upright', 'clean architectural cedar, beams in an empty attic'] },
    { id: 'patchouli',   name: 'Patchouli',      lat: 'Pogostemon cablin · Sulawesi',   tier: 'fond',  fam: 'boise',   ten: 12.5,
      frags: ['patchouli turned in the cellar — damp earth, cocoa, camphor', 'dark patchouli, soil deciding to become chocolate'] },
    { id: 'mousse',      name: 'Mousse de chêne', lat: 'Evernia prunastri · Balkans',   tier: 'fond',  fam: 'mousse',  ten: 11.5,
      frags: ['oakmoss, ink-green and forest-damp — the old chypre signature', 'a bitter velvet of oakmoss, the underside of the forest'] },
    { id: 'ambre-gris',  name: 'Ambre gris',     lat: 'Ambra grisea · trouvé en mer',   tier: 'fond',  fam: 'ambre',   ten: 12.5,
      frags: ['ambergris — salt skin and warm driftwood, the ocean gone golden', 'a mineral, animal shimmer of ambergris that widens every note it touches'] },
    { id: 'tonka',       name: 'Fève tonka',     lat: 'Dipteryx odorata · Orénoque',    tier: 'fond',  fam: 'ambre',   ten: 11.5,
      frags: ['tonka bean, almond and cut hay, tobacco-sweet', 'a coumarin warmth of tonka, sun through barn slats'] },
    { id: 'vanille',     name: 'Vanille',        lat: 'Vanilla planifolia · Bourbon',   tier: 'fond',  fam: 'ambre',   ten: 12.5,
      frags: ['dark Bourbon vanilla, boozy, more leather than sugar', 'a smoked vanilla depth — the pod, not the pastry'] },
    { id: 'musc',        name: 'Musc blanc',     lat: 'muscone · l’atelier',            tier: 'fond',  fam: 'musc',    ten: 12.5,
      frags: ['white musk, clean as pressed linen, close as skin', 'a quiet musk halo that keeps the accord breathing for hours'] },
    { id: 'cuir',        name: 'Cuir',           lat: 'bouleau & styrax · tannerie',    tier: 'fond',  fam: 'cuir',    ten: 12.5,
      frags: ['cuir de Russie — birch tar, saddle leather, smoke in the seams', 'black leather, gloves left too near the fire'] }
  ];

  var BYID = {};
  MATERIALS.forEach(function (m) { BYID[m.id] = m; });

  var TIERS = {
    tete:  { label: 'Tête',  sub: 'l’envol · 0 – 2 h',   amp: 1.0 },
    coeur: { label: 'Cœur',  sub: 'la chair · 1 – 7 h',  amp: 0.92 },
    fond:  { label: 'Fond',  sub: 'le socle · 2 – 12 h+', amp: 0.88 }
  };

  var PRESETS = {
    ambre:  ['bergamote', 'safran', 'rose-de-mai', 'labdanum', 'ambre-gris', 'vanille'],
    chypre: ['bergamote', 'galbanum', 'rose-de-mai', 'iris', 'mousse', 'patchouli'],
    cuir:   ['poivre-rose', 'safran', 'osmanthus', 'oliban', 'cuir', 'santal']
  };

  /* ------------------------------------------------------------- naming */
  function cyrb53(str, seed) {
    var h1 = 0xdeadbeef ^ (seed || 0), h2 = 0x41c6ce57 ^ (seed || 0), i, ch;
    for (i = 0; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507); h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507); h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  }

  var FAM_PRIORITY = ['ambre', 'cuir', 'mousse', 'resine', 'boise', 'floral', 'epice', 'musc', 'vert', 'agrumes'];

  var NOUNS = {
    agrumes: ['Zeste', 'Solstice', 'Verger'],
    epice:   ['Braise', 'Comptoir', 'Caravane'],
    floral:  ['Corolle', 'Jardin', 'Aveu'],
    vert:    ['Sève', 'Orée', 'Herbier'],
    resine:  ['Encens', 'Baume', 'Oratoire'],
    boise:   ['Racine', 'Futaie', 'Charpente'],
    mousse:  ['Sous-Bois', 'Lisière', 'Velours'],
    ambre:   ['Ambre', 'Cire', 'Ors'],
    musc:    ['Peau', 'Voile', 'Aura'],
    cuir:    ['Cuir', 'Gant', 'Tannin']
  };
  var COMPS = ['de Minuit', 'd’Hiver', 'des Brumes', 'du Rivage', 'de l’Aube', 'd’Ombre',
               'du Sacre', 'de Cire', 'des Ruines', 'de Sel', 'du Levant', 'des Orages'];

  function seedOf(ids) { return cyrb53(ids.slice().sort().join('+'), 66); }

  function domFamily(ids) {
    var count = {}, i, f;
    for (i = 0; i < ids.length; i++) {
      f = BYID[ids[i]].fam;
      count[f] = (count[f] || 0) + 1;
    }
    var best = null, bestN = -1;
    for (i = 0; i < FAM_PRIORITY.length; i++) {
      f = FAM_PRIORITY[i];
      if ((count[f] || 0) > bestN) { best = f; bestN = count[f] || 0; }
    }
    return best;
  }

  function accordName(ids) {
    if (!ids.length) return null;
    var h = seedOf(ids);
    var fam = domFamily(ids);
    var nouns = NOUNS[fam];
    var noun = nouns[h % nouns.length];
    var comp = COMPS[Math.floor(h / 7) % COMPS.length];
    if (comp.indexOf(noun) !== -1) comp = COMPS[(Math.floor(h / 7) + 1) % COMPS.length];
    return noun + ' ' + comp;
  }

  function accordRef(ids) {
    if (!ids.length) return 'OR-0000';
    return 'OR-' + ('0000' + (seedOf(ids) % 65536).toString(16).toUpperCase()).slice(-4);
  }

  /* -------------------------------------------------------- description */
  var CONN = {
    tete:  [', struck against ', ', crossed with ', ' over '],
    coeur: [', folded into ', ', wound through ', ' set against '],
    fond:  [', warmed by ', ' on a bed of ', ', grounded by ']
  };
  var SILLAGE = {
    agrumes: 'sparkling', vert: 'green, brisk', epice: 'warm, spiced', floral: 'luminous',
    resine: 'smoky, golden', boise: 'dry, shaded', mousse: 'forest-dark',
    ambre: 'enveloping, golden', musc: 'skin-close', cuir: 'dark, assured'
  };
  var ENDINGS = [
    'it stays on cloth for days',
    'it hums at the collar past midnight',
    'it draws the room a half-step closer',
    'it leaves the impression of a candle, recently put out',
    'it follows you out and waits on the stairs',
    'it is remembered by everyone but the wearer'
  ];

  function fragFor(m, h, idx) { return m.frags[(h >>> (idx % 28)) & 1]; }

  function joinFrags(mats, tier, h) {
    var conn = CONN[tier][h % CONN[tier].length];
    var parts = mats.map(function (m, i) { return fragFor(m, h, i + tier.length); });
    return parts.join(conn);
  }

  function accordDescription(ids) {
    if (!ids.length) return '';
    var h = seedOf(ids);
    var byTier = { tete: [], coeur: [], fond: [] };
    ids.forEach(function (id) { byTier[BYID[id].tier].push(BYID[id]); });
    var s = [];
    if (byTier.tete.length)  s.push('It opens on ' + joinFrags(byTier.tete, 'tete', h) + '.');
    else if (ids.length)     s.push('It forgoes an overture, opening in the flesh of the accord.');
    if (byTier.coeur.length) s.push('The heart is ' + joinFrags(byTier.coeur, 'coeur', h) + '.');
    if (byTier.fond.length)  s.push('The dry-down settles into ' + joinFrags(byTier.fond, 'fond', h) + '.');
    return s.join(' ');
  }

  function accordSillage(ids) {
    if (!ids.length) return '';
    var h = seedOf(ids);
    var w = SILLAGE[domFamily(ids)];
    var art = /^[aeiou]/i.test(w) ? 'An ' : 'A ';
    return art + w + ' sillage — ' + ENDINGS[Math.floor(h / 13) % ENDINGS.length] + '.';
  }

  /* ---------------------------------------------------- dry-down timing */
  function span(m) {
    if (m.tier === 'tete')  return { s: 0,   peak: 0.2, fade: m.ten * 0.45, e: m.ten };
    if (m.tier === 'coeur') return { s: 0.4, peak: 1.2, fade: m.ten * 0.60, e: m.ten };
    return { s: 1.2, peak: 3.0, fade: 11.0, e: Math.min(m.ten, 12.6) };
  }

  function intensity(m, t) {
    var sp = span(m), amp = TIERS[m.tier].amp;
    if (t < sp.s || t > sp.e) return 0;
    if (t < sp.peak) return amp * (t - sp.s) / (sp.peak - sp.s);
    if (t < sp.fade) return amp;
    return amp * Math.max(0, 1 - (t - sp.fade) / (sp.e - sp.fade));
  }

  var ENGINE = {
    FAM: FAM, MATERIALS: MATERIALS, BYID: BYID, TIERS: TIERS, PRESETS: PRESETS,
    seedOf: seedOf, domFamily: domFamily, accordName: accordName, accordRef: accordRef,
    accordDescription: accordDescription, accordSillage: accordSillage,
    span: span, intensity: intensity
  };

  if (typeof module !== 'undefined' && module.exports) { module.exports = ENGINE; return; }
  root.ORGUE = ENGINE;
  if (typeof document === 'undefined') return;

  /* ================================================================ DOM */
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---- colour helpers -------------------------------------------------- */
  function mix(hex, hex2, t) {
    var a = parseInt(hex.slice(1), 16), b = parseInt(hex2.slice(1), 16);
    var r = Math.round(((a >> 16) & 255) * (1 - t) + ((b >> 16) & 255) * t);
    var g = Math.round(((a >> 8) & 255) * (1 - t) + ((b >> 8) & 255) * t);
    var bl = Math.round((a & 255) * (1 - t) + (b & 255) * t);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1);
  }

  /* ---- organ shelf ----------------------------------------------------- */
  var BOTTLE_PATHS = [
    /* v0 round pot   */ { cork: 'M15 2h10v6H15z', neck: 'M14 8h12v7H14z', body: 'M20 15c9.5 0 14 7 14 16.5v12C34 52.5 29 56 20 56S6 52.5 6 43.5v-12C6 22 10.5 15 20 15z' },
    /* v1 square      */ { cork: 'M15 3h10v5H15z', neck: 'M14 8h12v6H14z', body: 'M11 14h18a3 3 0 0 1 3 3v35a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V17a3 3 0 0 1 3-3z' },
    /* v2 tall slim   */ { cork: 'M16 1h8v5h-8z',  neck: 'M15 6h10v8H15z', body: 'M13 14h14a3 3 0 0 1 3 3v34a5 5 0 0 1-5 5H15a5 5 0 0 1-5-5V17a3 3 0 0 1 3-3z' },
    /* v3 conical     */ { cork: 'M15 2h10v5H15z', neck: 'M14 7h12v8H14z', body: 'M14 15h12l6.5 34a5 5 0 0 1-5 7h-15a5 5 0 0 1-5-7z' }
  ];

  function bottleSVG(m, i) {
    var v = BOTTLE_PATHS[(i + (m.tier === 'coeur' ? 1 : m.tier === 'fond' ? 2 : 0)) % 4];
    var col = FAM[m.fam].col;
    var gid = 'g-' + m.id;
    var abbr = m.name.replace(/[^A-Za-zÀ-ÿ ]/g, '').split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2);
    return '<svg viewBox="0 0 40 58" width="44" height="62" aria-hidden="true">' +
      '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="' + mix(col, '#f3ead9', 0.42) + '"/>' +
      '<stop offset=".45" stop-color="' + col + '"/>' +
      '<stop offset="1" stop-color="' + mix(col, '#1b140c', 0.38) + '"/></linearGradient></defs>' +
      '<path d="' + v.cork + '" fill="#a98545"/>' +
      '<path d="' + v.neck + '" fill="' + mix(col, '#f3ead9', 0.25) + '" stroke="#221c14" stroke-opacity=".55" stroke-width=".8"/>' +
      '<path d="' + v.body + '" fill="url(#' + gid + ')" stroke="#221c14" stroke-opacity=".55" stroke-width=".9"/>' +
      '<rect x="10.5" y="30" width="19" height="13" rx="1" fill="#f3ead9" stroke="#221c14" stroke-opacity=".4" stroke-width=".7"/>' +
      '<text x="20" y="39.5" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="8.4" fill="#221c14">' + abbr + '</text>' +
      '</svg>';
  }

  var sel = [];                                   /* ids, insertion order   */
  var CAP = 2;
  var hintTimer = null;

  function tierCount(t) { return sel.filter(function (id) { return BYID[id].tier === t; }).length; }

  function buildOrgan() {
    var cab = $('#cabinet');
    var order = ['tete', 'coeur', 'fond'];
    order.forEach(function (t) {
      var row = document.createElement('div');
      row.className = 'tier tier-' + t;
      row.innerHTML = '<div class="tier-head mono"><span class="tier-name">' + TIERS[t].label +
        '</span><span class="tier-sub">' + TIERS[t].sub + '</span><span class="tier-count" id="cnt-' + t + '">0 ∕ 2</span></div>' +
        '<div class="shelf" role="group" aria-label="Registre ' + TIERS[t].label + '"></div>';
      var shelf = $('.shelf', row);
      MATERIALS.filter(function (m) { return m.tier === t; }).forEach(function (m, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'flacon';
        b.dataset.id = m.id;
        b.setAttribute('aria-pressed', 'false');
        b.title = m.name + ' — ' + m.lat;
        b.innerHTML = bottleSVG(m, i) +
          '<span class="fl-name">' + m.name + '</span><span class="fl-fam mono">' + FAM[m.fam].label + '</span>' +
          '<span class="fl-seal" aria-hidden="true"></span>';
        b.addEventListener('click', function () { toggle(m.id); });
        shelf.appendChild(b);
      });
      cab.appendChild(row);
    });
  }

  function hint(msg) {
    var el = $('#organ-hint');
    el.textContent = msg;
    el.classList.add('on');
    clearTimeout(hintTimer);
    hintTimer = setTimeout(function () { el.classList.remove('on'); }, 3200);
  }

  function toggle(id) {
    var i = sel.indexOf(id), m = BYID[id];
    if (i !== -1) { sel.splice(i, 1); }
    else {
      if (tierCount(m.tier) >= CAP) {
        hint('Le registre « ' + TIERS[m.tier].label + ' » est plein — retirez d’abord une essence.');
        var row = $('.tier-' + m.tier);
        row.classList.remove('shake'); void row.offsetWidth; row.classList.add('shake');
        return;
      }
      sel.push(id);
    }
    render();
  }

  function setSelection(ids) {
    sel = [];
    var counts = { tete: 0, coeur: 0, fond: 0 };
    ids.forEach(function (id) {
      var m = BYID[id];
      if (m && counts[m.tier] < CAP && sel.indexOf(id) === -1) { counts[m.tier]++; sel.push(id); }
    });
    render();
  }

  /* ---- accord card ------------------------------------------------------ */
  function famLine(ids) {
    var seen = [], out = [];
    ids.forEach(function (id) {
      var f = BYID[id].fam;
      if (seen.indexOf(f) === -1) { seen.push(f); out.push(FAM[f].label); }
    });
    return out.join(' · ');
  }

  function pyramidSVG(byTier) {
    /* truncated pyramid — wide enough at the crown for two note names */
    var cx = 138;
    function names(list) { return list.length ? list.map(function (m) { return m.name; }) : ['—']; }
    function band(list, y0, lh) {
      var n = names(list);
      var y = y0 - ((n.length - 1) * lh) / 2 + 4;
      return n.map(function (t, i) {
        return '<text x="' + cx + '" y="' + (y + i * lh) + '" text-anchor="middle" class="py-note' +
          (t === '—' ? ' py-empty' : '') + '">' + t + '</text>';
      }).join('');
    }
    return '<svg viewBox="0 0 320 232" class="pyramid" role="img" aria-label="Pyramide olfactive">' +
      '<path d="M83 14 H193 L262 218 H14 Z" fill="rgba(138,90,30,.05)" stroke="#221c14" stroke-opacity=".55" stroke-width="1"/>' +
      '<line x1="59.3" y1="84" x2="216.7" y2="84" stroke="#221c14" stroke-opacity=".45" stroke-width=".8" stroke-dasharray="1 3"/>' +
      '<line x1="36.3" y1="152" x2="239.7" y2="152" stroke="#221c14" stroke-opacity=".45" stroke-width=".8" stroke-dasharray="1 3"/>' +
      band(byTier.tete, 49, 15) + band(byTier.coeur, 118, 15) + band(byTier.fond, 185, 15) +
      '<g class="py-lab">' +
      '<text x="272" y="52">TÊTE</text><text x="272" y="121">CŒUR</text><text x="272" y="188">FOND</text>' +
      '<line x1="266" y1="48" x2="266" y2="56" stroke="#a98545" stroke-width="1"/>' +
      '<line x1="266" y1="117" x2="266" y2="125" stroke="#a98545" stroke-width="1"/>' +
      '<line x1="266" y1="184" x2="266" y2="192" stroke="#a98545" stroke-width="1"/>' +
      '</g></svg>';
  }

  var tlMats = [];      /* materials shown on timeline, tier order */

  function timelineHTML(byTier) {
    tlMats = byTier.tete.concat(byTier.coeur, byTier.fond);
    var ticks = '';
    for (var hh = 0; hh <= 12; hh += 2) {
      ticks += '<span class="tl-tick" style="left:' + (hh / 12 * 100) + '%">' + hh + (hh === 0 || hh === 12 ? ' h' : '') + '</span>';
    }
    var rows = tlMats.map(function (m, i) {
      var sp = span(m), col = FAM[m.fam].col;
      var s = sp.s / 12 * 100, e = Math.min(sp.e, 12) / 12 * 100;
      var peak = Math.min(99, (sp.peak - sp.s) / (Math.min(sp.e, 12) - sp.s) * 100);
      var fade = Math.max(peak + 1, Math.min(100, (sp.fade - sp.s) / (Math.min(sp.e, 12) - sp.s) * 100));
      var open = m.ten > 12.4 ? ' tl-open' : '';
      return '<div class="tl-row">' +
        '<span class="tl-name mono">' + m.name + '</span>' +
        '<span class="tl-track"><span class="tl-bar' + open + '" style="left:' + s + '%;width:' + (e - s) +
        '%;--c:' + col + ';--peak:' + peak + '%;--fade:' + fade + '%;transition-delay:' + (i * 70) + 'ms"></span></span>' +
        '</div>';
    }).join('');
    return '<div class="tl-head mono"><span>Le fondu — 12 heures sur peau</span><span id="tl-clock">h+0,0</span></div>' +
      '<div id="tl-grid">' + rows +
      '<div class="tl-axis">' + ticks + '</div>' +
      '<div class="tl-lane" aria-hidden="true"><div class="tl-playhead" id="tl-playhead"></div></div></div>' +
      '<p class="tl-cap mono" id="tl-cap"></p>';
  }

  function dominanceAt(t) {
    var scored = tlMats.map(function (m) { return { m: m, v: intensity(m, t) }; })
      .filter(function (x) { return x.v > 0.04; })
      .sort(function (a, b) { return b.v - a.v; });
    if (!scored.length) return 'la peau se souvient';
    var line = scored[0].m.name + ' mène';
    if (scored[1]) line += ' · ' + scored[1].m.name + ' en soutien';
    return line;
  }

  var phT = 0, phLast = null, phRunning = false, tlVisible = false;
  var PH_LOOP = 17000;

  function playhead(ts) {
    if (!phRunning) return;
    if (phLast === null) phLast = ts;
    phT = (phT + (ts - phLast) / PH_LOOP * 12) % 12.6;
    phLast = ts;
    positionPlayhead(phT);
    requestAnimationFrame(playhead);
  }

  function positionPlayhead(t) {
    var ph = $('#tl-playhead'), cap = $('#tl-cap'), clock = $('#tl-clock');
    if (!ph) return;
    var tt = Math.min(t, 12);
    ph.style.left = (tt / 12 * 100) + '%';
    if (clock) clock.textContent = 'h+' + tt.toFixed(1).replace('.', ',');
    if (cap) cap.textContent = dominanceAt(tt);
  }

  function syncPlayhead() {
    var should = tlVisible && !document.hidden && !RM && tlMats.length > 0;
    if (should && !phRunning) { phRunning = true; phLast = null; requestAnimationFrame(playhead); }
    else if (!should) { phRunning = false; }
  }

  function render() {
    /* buttons */
    $$('.flacon').forEach(function (b) {
      var on = sel.indexOf(b.dataset.id) !== -1;
      b.classList.toggle('sel', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    ['tete', 'coeur', 'fond'].forEach(function (t) {
      var c = $('#cnt-' + t);
      c.textContent = tierCount(t) + ' ∕ 2';
      c.classList.toggle('full', tierCount(t) >= CAP);
    });

    var card = $('#accord-card');
    var empty = $('#card-empty');
    var body = $('#card-body');
    if (!sel.length) {
      empty.hidden = false; body.hidden = true;
      card.classList.remove('complete');
      tlMats = []; syncPlayhead();
      return;
    }
    empty.hidden = true; body.hidden = false;

    var byTier = { tete: [], coeur: [], fond: [] };
    sel.forEach(function (id) { byTier[BYID[id].tier].push(BYID[id]); });

    $('#acc-ref').textContent = 'Accord nº ' + accordRef(sel);
    $('#acc-name').textContent = accordName(sel);
    $('#acc-fams').textContent = famLine(sel) + ' — ' + sel.length + (sel.length > 1 ? ' essences' : ' essence');
    $('#acc-desc').textContent = accordDescription(sel);
    $('#acc-sillage').textContent = accordSillage(sel);
    $('#acc-pyramid').innerHTML = pyramidSVG(byTier);
    $('#acc-timeline').innerHTML = timelineHTML(byTier);

    var full = sel.length === 6;
    card.classList.toggle('complete', full);
    $('#acc-order').disabled = !full;
    $('#order-note').textContent = full
      ? 'Accord complet — prêt pour la commande.'
      : 'Complétez les six essences pour commander (' + sel.length + ' ∕ 6).';
    var done = $('#order-done');
    done.hidden = true;
    $('#acc-order').hidden = false;

    /* animate bars in */
    var bars = $$('.tl-bar');
    if (RM) { bars.forEach(function (b) { b.classList.add('grow'); }); }
    else {
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        bars.forEach(function (b) { b.classList.add('grow'); });
      }); });
    }
    phT = 0; phLast = null;
    if (RM) positionPlayhead(2.0);
    syncPlayhead();
  }

  /* ---- vapor canvas ----------------------------------------------------- */
  function initVapor() {
    var cv = $('#vapor');
    if (!cv || RM) return;
    var ctx = cv.getContext('2d');
    var W = 0, H = 0, DPR = 1, parts = [], running = false, visible = false;

    function size() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * DPR; cv.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    function spawn(init) {
      return {
        x: W * (0.3 + Math.random() * 0.4),
        y: init ? H * Math.random() : H * (0.75 + Math.random() * 0.3),
        r: 40 + Math.random() * 70,
        vy: 0.10 + Math.random() * 0.16,
        drift: Math.random() * Math.PI * 2,
        ds: 0.0016 + Math.random() * 0.0022,
        a: 0.018 + Math.random() * 0.03
      };
    }
    function step() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.y -= p.vy; p.drift += p.ds; p.x += Math.sin(p.drift) * 0.28;
        if (p.y < -p.r) parts[i] = p = spawn(false);
        var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        var fade = Math.min(1, Math.max(0, p.y / (H * 0.25)));
        g.addColorStop(0, 'rgba(138,90,30,' + (p.a * fade) + ')');
        g.addColorStop(1, 'rgba(138,90,30,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      requestAnimationFrame(step);
    }
    function sync() {
      var should = visible && !document.hidden;
      if (should && !running) { running = true; requestAnimationFrame(step); }
      else if (!should) running = false;
    }
    size();
    parts = []; for (var i = 0; i < 22; i++) parts.push(spawn(true));
    window.addEventListener('resize', function () { size(); });
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; sync(); }).observe(cv);
    document.addEventListener('visibilitychange', sync);
  }

  /* ---- reveal on scroll ------------------------------------------------- */
  function initReveal() {
    var els = $$('.rv');
    if (RM || !('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---- extrait cards ---------------------------------------------------- */
  function initExtraits() {
    $$('.card').forEach(function (card) {
      var fig = $('.card-fig', card);
      if (fig) {
        fig.addEventListener('click', function () { card.classList.toggle('flip'); });
        fig.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.classList.toggle('flip'); }
        });
      }
      var btn = $('.card-add', card);
      if (btn) btn.addEventListener('click', function (e) {
        e.stopPropagation();
        btn.classList.add('added');
        btn.textContent = 'Au coffret ✓';
      });
    });
  }

  /* ---- boot ------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    buildOrgan();
    initVapor();
    initReveal();
    initExtraits();

    $$('.preset').forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.dataset.preset;
        if (k === 'clear') setSelection([]);
        else if (PRESETS[k]) setSelection(PRESETS[k]);
      });
    });

    $('#acc-order').addEventListener('click', function () {
      $('#acc-order').hidden = true;
      var d = $('#order-done');
      d.textContent = 'Reçu à l’atelier — réponse sous 48 h. Réf. ' + accordRef(sel) + '.';
      d.hidden = false;
    });

    new IntersectionObserver(function (en) { tlVisible = en[0].isIntersecting; syncPlayhead(); })
      .observe($('#accord-card'));
    document.addEventListener('visibilitychange', syncPlayhead);

    /* query params: ?accord=ambre|chypre|cuir  ·  ?pick=id,id  ·  ?scroll=id */
    var q = new URLSearchParams(location.search);
    var target = null;
    if (q.get('accord') && PRESETS[q.get('accord')]) { setSelection(PRESETS[q.get('accord')]); target = '#accord-card'; }
    else if (q.get('pick')) { setSelection(q.get('pick').split(',')); target = '#accord-card'; }
    else render();
    if (q.get('scroll')) target = '#' + q.get('scroll');
    if (target) {
      window.addEventListener('load', function () {
        requestAnimationFrame(function () {
          var el = $(target);
          if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
        });
      });
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
