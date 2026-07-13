/* ============================================================================
   EPHEMERIS — computational core
   ----------------------------------------------------------------------------
   Heliocentric positions of the major planets from Keplerian orbital elements.

   SOURCE TABLE: E. M. Standish (JPL Solar System Dynamics),
   "Keplerian Elements for Approximate Positions of the Major Planets",
   Table 1 — mean elements at epoch J2000 (JD 2451545.0) and centennial
   rates, referred to the mean ecliptic and equinox of J2000. The fit is
   formally 1800–2050; this instrument runs 1600–2400, where errors grow
   to arcminute order for the giants — honest enough for an orrery.

   Per planet: a (semi-major axis, au), e (eccentricity), I (inclination, °),
   L (mean longitude, °), w (longitude of perihelion ϖ, °), O (longitude of
   the ascending node Ω, °). Each as [value at J2000, rate per Julian century].

   PIPELINE (per planet, per date):
     T  = (JD − 2451545.0) / 36525                 Julian centuries from J2000
     M  = L − ϖ                                     mean anomaly
     solve Kepler's equation  M = E − e·sin E       (Newton–Raphson)
     x′ = a(cos E − e),  y′ = a·√(1−e²)·sin E       in the orbital plane
     rotate through ω = ϖ − Ω, then I, then Ω       onto the J2000 ecliptic
     λ  = atan2(y, x)                               heliocentric ecliptic longitude
   ========================================================================== */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory();
  else root.EPHEMERIS = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var DEG = Math.PI / 180;
  var J2000 = 2451545.0;
  var SYNODIC_MONTH = 29.530588853;      // mean synodic month, days
  var NEW_MOON_REF = 2451550.26;         // new moon of 2000 Jan 6, 18:14 UTC

  // Standish Table 1 — [J2000 value, rate per century]
  var PLANETS = [
    { name: 'Mercury', a: [0.38709927, 0.00000037], e: [0.20563593, 0.00001906], I: [7.00497902, -0.00594749], L: [252.25032350, 149472.67411175], w: [77.45779628, 0.16047689], O: [48.33076593, -0.12534081] },
    { name: 'Venus',   a: [0.72333566, 0.00000390], e: [0.00677672, -0.00004107], I: [3.39467605, -0.00078890], L: [181.97909950, 58517.81538729], w: [131.60246718, 0.00268329], O: [76.67984255, -0.27769418] },
    { name: 'Earth',   a: [1.00000261, 0.00000562], e: [0.01671123, -0.00004392], I: [-0.00001531, -0.01294668], L: [100.46457166, 35999.37244981], w: [102.93768193, 0.32327364], O: [0.0, 0.0] },
    { name: 'Mars',    a: [1.52371034, 0.00001847], e: [0.09339410, 0.00007882], I: [1.84969142, -0.00813131], L: [-4.55343205, 19140.30268499], w: [-23.94362959, 0.44441088], O: [49.55953891, -0.29257343] },
    { name: 'Jupiter', a: [5.20288700, -0.00011607], e: [0.04838624, -0.00013253], I: [1.30439695, -0.00183714], L: [34.39644051, 3034.74612775], w: [14.72847983, 0.21252668], O: [100.47390909, 0.20469106] },
    { name: 'Saturn',  a: [9.53667594, -0.00125060], e: [0.05386179, -0.00050991], I: [2.48599187, 0.00193609], L: [49.95424423, 1222.49362201], w: [92.59887831, -0.41897216], O: [113.66242448, -0.28867794] },
    { name: 'Uranus',  a: [19.18916464, -0.00196176], e: [0.04725744, -0.00004397], I: [0.77263783, -0.00242939], L: [313.23810451, 428.48202785], w: [170.95427630, 0.40805281], O: [74.01692503, 0.04240589] },
    { name: 'Neptune', a: [30.06992276, 0.00026291], e: [0.00859048, 0.00005105], I: [1.77004347, 0.00035372], L: [-55.12002969, 218.45945325], w: [44.96476227, -0.32241464], O: [131.78422574, -0.00508664] }
  ];

  function norm360(x) { x = x % 360; return x < 0 ? x + 360 : x; }

  /* Kepler's equation M = E − e·sin E, solved by Newton–Raphson (radians). */
  function solveKepler(M, e) {
    var E = M + e * Math.sin(M); // good seed for e < 0.25
    for (var i = 0; i < 24; i++) {
      var d = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
      E -= d;
      if (Math.abs(d) < 1e-12) break;
    }
    return E;
  }

  /* Heliocentric state of planet index p at Julian date jd. */
  function heliocentric(p, jd) {
    var el = PLANETS[p];
    var T = (jd - J2000) / 36525;
    var a = el.a[0] + el.a[1] * T;
    var e = el.e[0] + el.e[1] * T;
    var I = (el.I[0] + el.I[1] * T) * DEG;
    var L = el.L[0] + el.L[1] * T;
    var w = el.w[0] + el.w[1] * T;   // ϖ, longitude of perihelion
    var O = el.O[0] + el.O[1] * T;   // Ω, longitude of ascending node

    var M = norm360(L - w) * DEG;             // mean anomaly
    var E = solveKepler(M, e);                // eccentric anomaly
    var xp = a * (Math.cos(E) - e);           // orbital-plane coords
    var yp = a * Math.sqrt(1 - e * e) * Math.sin(E);
    var r = Math.sqrt(xp * xp + yp * yp);
    var nu = Math.atan2(yp, xp);              // true anomaly

    var om = (w - O) * DEG;                   // argument of perihelion ω
    var Om = O * DEG;
    var cw = Math.cos(om), sw = Math.sin(om);
    var cO = Math.cos(Om), sO = Math.sin(Om);
    var cI = Math.cos(I), sI = Math.sin(I);

    var x = (cw * cO - sw * sO * cI) * xp + (-sw * cO - cw * sO * cI) * yp;
    var y = (cw * sO + sw * cO * cI) * xp + (-sw * sO + cw * cO * cI) * yp;
    var z = (sw * sI) * xp + (cw * sI) * yp;

    return {
      name: el.name, x: x, y: y, z: z, r: r, a: a, e: e,
      lon: norm360(Math.atan2(y, x) / DEG),          // heliocentric ecliptic longitude
      lat: Math.asin(z / r) / DEG,
      nu: norm360(nu / DEG), E: norm360(E / DEG), M: norm360(M / DEG)
    };
  }

  function allPlanets(jd) {
    var out = [];
    for (var p = 0; p < PLANETS.length; p++) out.push(heliocentric(p, jd));
    return out;
  }

  /* Geocentric ecliptic longitude/latitude of planet index p (Earth = 2 is invalid). */
  function geocentric(p, jd, earth) {
    var pl = heliocentric(p, jd);
    var ea = earth || heliocentric(2, jd);
    var gx = pl.x - ea.x, gy = pl.y - ea.y, gz = pl.z - ea.z;
    var d = Math.sqrt(gx * gx + gy * gy + gz * gz);
    return { lon: norm360(Math.atan2(gy, gx) / DEG), lat: Math.asin(gz / d) / DEG, dist: d, x: gx, y: gy, z: gz };
  }

  /* Geocentric longitude of the Sun = heliocentric longitude of Earth + 180°. */
  function sunGeo(jd, earth) {
    var ea = earth || heliocentric(2, jd);
    return { lon: norm360(ea.lon + 180), dist: ea.r };
  }

  /* Angular separation (degrees) between two planets as seen from Earth. */
  function separation(p1, p2, jd) {
    var ea = heliocentric(2, jd);
    var a = geocentric(p1, jd, ea), b = geocentric(p2, jd, ea);
    var dot = (a.x * b.x + a.y * b.y + a.z * b.z) / (a.dist * b.dist);
    return Math.acos(Math.min(1, Math.max(-1, dot))) / DEG;
  }

  /* Mean lunar phase from the synodic month: elongation D (0 new, 180 full). */
  function moonPhase(jd) {
    var age = jd - NEW_MOON_REF;
    age = age - Math.floor(age / SYNODIC_MONTH) * SYNODIC_MONTH;
    var D = age / SYNODIC_MONTH * 360;
    var illum = (1 - Math.cos(D * DEG)) / 2;
    var names = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
    var idx = Math.floor(((D + 22.5) % 360) / 45);
    return { age: age, D: D, illum: illum, name: names[idx], waxing: D < 180 };
  }

  var SIGNS = [
    ['Aries', '♈'], ['Taurus', '♉'], ['Gemini', '♊'], ['Cancer', '♋'],
    ['Leo', '♌'], ['Virgo', '♍'], ['Libra', '♎'], ['Scorpio', '♏'],
    ['Sagittarius', '♐'], ['Capricorn', '♑'], ['Aquarius', '♒'], ['Pisces', '♓']
  ];

  function zodiac(lon) {
    lon = norm360(lon);
    var s = Math.floor(lon / 30);
    var within = lon - s * 30;
    var d = Math.floor(within);
    var m = Math.floor((within - d) * 60);
    return { sign: SIGNS[s][0], glyph: SIGNS[s][1], deg: d, min: m,
             str: String(d).padStart(2, '0') + '°' + String(m).padStart(2, '0') + '′' };
  }

  /* ---- calendar <-> Julian date (proleptic Gregorian via Date.UTC) ---- */
  function dateToJD(y, mo, d, h) {
    var dt = new Date(0);
    dt.setUTCFullYear(y, mo - 1, d);
    dt.setUTCHours(h === undefined ? 12 : h, 0, 0, 0);
    return dt.getTime() / 86400000 + 2440587.5;
  }
  function jdToDate(jd) {
    var dt = new Date((jd - 2440587.5) * 86400000);
    return { y: dt.getUTCFullYear(), mo: dt.getUTCMonth() + 1, d: dt.getUTCDate(), h: dt.getUTCHours() };
  }

  /* ---- Great-conjunction scanner: local minima of Jupiter–Saturn separation
     as seen from Earth, refined by golden-section search. ---- */
  function findConjunctions(fromJD, toJD, maxSep, maxCount) {
    maxSep = maxSep || 2.5; maxCount = maxCount || 4;
    var out = [], step = 16;
    var f = function (jd) { return separation(4, 5, jd); };
    var prev2 = f(fromJD), prev1 = f(fromJD + step);
    for (var jd = fromJD + 2 * step; jd <= toJD; jd += step) {
      var cur = f(jd);
      if (prev1 < prev2 && prev1 <= cur && prev1 < maxSep + 1.5) {
        // refine around jd - step
        var lo = jd - 2 * step, hi = jd, gr = (Math.sqrt(5) - 1) / 2;
        var c = hi - gr * (hi - lo), d = lo + gr * (hi - lo);
        var fc = f(c), fd = f(d);
        for (var i = 0; i < 48; i++) {
          if (fc < fd) { hi = d; d = c; fd = fc; c = hi - gr * (hi - lo); fc = f(c); }
          else { lo = c; c = d; fc = fd; d = lo + gr * (hi - lo); fd = f(d); }
        }
        var best = (lo + hi) / 2, sep = f(best);
        if (sep < maxSep) {
          out.push({ jd: best, sep: sep, lon: geocentric(4, best).lon });
          if (out.length >= maxCount) return out;
        }
      }
      prev2 = prev1; prev1 = cur;
    }
    return out;
  }

  return {
    J2000: J2000, PLANETS: PLANETS, SIGNS: SIGNS,
    norm360: norm360, solveKepler: solveKepler,
    heliocentric: heliocentric, allPlanets: allPlanets,
    geocentric: geocentric, sunGeo: sunGeo, separation: separation,
    moonPhase: moonPhase, zodiac: zodiac,
    dateToJD: dateToJD, jdToDate: jdToDate,
    findConjunctions: findConjunctions
  };
});
