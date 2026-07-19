# 59-qimen — 奇門遁甲 · THE STRATEGIST'S BOARD — iteration passes

Site: a live Qi Men Dun Jia plate. A 3×3 nine-palace board in Luo Shu order (south-up),
each palace loaded with four symbol layers — Eight Gates 八門, Nine Stars 九星,
Eight Deities 八神, and heaven/earth stems 天地盤 (三奇 + 六儀) — computed for a chosen
moment (時家奇門 转盘法), then read for the auspicious direction/timing to act.

Fonts: Noto Serif SC (Hanzi display + glyphs), Cormorant Garamond (English display / italic
body), IBM Plex Mono (labels, kickers, meta). Palette: lacquer ground, warm-paper palace
cells, brass / jade / cinnabar accents.

Screenshots taken with `assets-pipeline/shot.mjs` (puppeteer, headless), served over local
HTTP on :8934. Full board captured via `?datetime=2026-07-20T14:30`.

---

## Pass 1 — first full render (1440×900 + 390×844)
Shots: `59-p1-desktop.png`, `59-p1-mobile.png`

Findings:
- Board itself reads strong: all nine palaces populate, four symbol layers land in their
  corners (deity ↖, direction ↑, star ↗, gate center, heaven-stem ↙, earth-stem �’), the
  值符 / 值使 duty badges pin to the correct palaces, auspicious cells get the jade inset.
- **Bug — direction label mismatch in the reading verdict.** The `dir-en` slot printed the
  *palace* romanisation ("北 **Kǎn**") instead of the compass word. 北 = North, but Kǎn is the
  trigram/palace name — a confusing EN/中 pairing for a bilingual reading. Same palace-pinyin
  leaked into the prose sentence.
- Mobile stacked and scaled correctly; no overflow.

Fix: introduced `dirWord = DIR_FULL[P.dir] || P.py` and routed it through **all** reading
copy — the verdict `dir-en`, the body sentence, and the "face the …" support line — so the
compass word (North / Southeast / …) is used consistently, with the palace name kept only in
the 坎宮 compass chip where it belongs.

## Pass 2 — after the dirWord fix (re-shoot)
Shots: `59-p2-desktop.png`, `59-p2-mobile.png`, `59-p2-mobile-read.png`, `59-p2-reading.png`

Findings:
- Verdict now reads **"北 North · N · 坎宮"** — EN/中 agree. The body prose ("the board opens
  toward the **north** — the 坎 palace, where the 生門 Shēng gate stands open for growth…"),
  the three-auspicious-gates row (開 / 休 / 生), and the WHEN-TO-ACT line all use the corrected
  wording. All four `dirWord` call-sites consistent (verified in source).
- Typographic hierarchy inside each palace holds up: gate glyph is clearly dominant (700 wt,
  ~42px), star/deity/direction are quiet 500-wt labels, stems sit small at the base with 天/地
  tags — no layer competes with the gate.
- Caption + moment strip correct: 小暑 · 陰遁 8局 · 上元 · 值符 天柱 · 值使 驚門, day 乙未 / hour 癸未.
  Astronomy sanity-checks (20 Jul is 小暑 period, post-summer-solstice → Yīn Dùn).
- (Builder stalled here mid-reshoot; QA agent resumed.)

## Pass 3 — closure verification (QA)
Shots: `59-p3-desktop.png`, `59-p3-mobile.png`, `59-p3-mobile-reading.png`,
`59-p3-desktop-nine.png`, `59-p3-desktop-gates.png` — all via `?datetime=2026-07-20T14:30`.

Findings / checks:
- **Zero page errors.** A puppeteer diagnostic capturing `console`/`pageerror` separately from
  the navigation returned `PAGE_ERRORS []`, `CONSOLE_ERRORS []` at 1440 and 390. The only line
  the shot tool prints is a `networkidle2` NAV timeout — its cause is Noto Serif SC splitting
  into ~dozens of unicode-range subset files that never let the network fully idle (all 5
  requested weights 400/500/600/700/900 are genuinely used in the type system, so they can't be
  trimmed, and the CJK glyph set is dynamic so `&text=` subsetting isn't possible). Not a page
  defect — the render completes and every glyph paints.
- **All four symbol layers legible per palace** at both widths, gate-dominant hierarchy intact.
- **Auspicious-direction reading renders** on desktop and mobile: verdict, tag
  (AUSPICIOUS GATE · 生門 SHĒNG (LIFE) · 乙丙奇), prose, three-gates row, WHEN-TO-ACT, moment strip.
- **Mobile scales & scrolls**: board fits 390px cleanly, panels stack, reading reachable and
  fully composed; no horizontal overflow.
- Lower sections verified: Nine-Palaces magic square (4-9-2 / 3-5-7 / 8-1-6, jade center),
  Eight-Gates reference grid, Method columns, footer — all render with correct typography.
- Hard requirements re-checked: `<title>` + meta description + inline-SVG favicon present;
  `XAVIER FABLE ×65` back-link → `/` (fixed top-left + footer); `prefers-reduced-motion` guarded
  in both CSS (`@media`) and JS (`noAnim` gate on cursor rAF, lamp/rose spin, cell entrance);
  rAF cursor loop cancels on `visibilitychange`.

No further defects found → closed.

## Board-structure confirmation
- **Luo Shu positions** (Later-Heaven bagua, south-up): 1坎N · 2坤SW · 3震E · 4巽SE · 5中 ·
  6乾NW · 7兌W · 8艮NE · 9離S — rows/cols/diagonals sum 15. 天禽 lodges in center (寄坤). ✓
- **8 Gates 八門**: 休 生 傷 杜 景 死 驚 開 — rotate on the 8-palace ring from the 值使 home. ✓
- **9 Stars 九星**: 天蓬 天芮 天沖 天輔 天禽 天心 天柱 天任 天英 (禽 fixed center, other 8 rotate). ✓
- **8 Deities 八神**: 值符 螣蛇 太陰 六合 白虎 玄武 九地 九天 — wheel from 值符 palace, forward in
  Yáng / backward in Yīn. ✓
- Heaven/Earth stems: 三奇 乙丙丁 + 六儀 戊己庚辛壬癸, one turning (天盤) / one fixed (地盤). ✓
- Builder previously swept all 8064 moments of a year with zero bad boards; QA spot-check
  (20 Jul 2026 14:30 → 小暑 · 陰遁 8局 · 上元) matches.
</content>
</invoke>
