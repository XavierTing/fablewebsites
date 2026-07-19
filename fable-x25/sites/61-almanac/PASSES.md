# 擇日 · THE ALMANAC — Iteration Log

**Site 61** of the Divination Wing. A living Chinese almanac (黃曆 / 老通勝): a torn-page tear-off sheet for any day, plus a 擇日 event-finder and a month-at-a-glance calendar.

Fonts: **Noto Serif SC** (dense hanzi almanac text) · **Spectral** (serif English display + italics) · **IBM Plex Mono** (dates / UI labels).

---

## Verification of the real logic (stated per brief)

All calendrical values are computed, not hard-coded. The core routines were unit-tested in Node before the site was built:

- **Day pillar (干支日) — exact.** `dayIndex = (JDN + 49) mod 60`, offset calibrated against known dates.
  - **CHECK: 2000-01-01 → 戊午** (index 54). ✓ Passed.
  - CHECK: 1984-02-01 → 乙丑. ✓ Passed.
  - The demo day **2026-07-20 → 乙未**. ✓
- **Lunar conversion (農曆).** Bundled month-length table 1900–2049 (anchored at solar 1900-01-31). Verified against **eleven** known Lunar New Years (1984, 2000, 2001, 2020–2027) — every one resolves to lunar month 1, day 1. ✓ The demo day **2026-07-20 → 六月初七** (matching the brief's example exactly, since 2026's New Year is Feb 17).
- **建除十二神 (day officer).** `officer = (dayBranch − monthBranch) mod 12`, with 建 on the branch matching the solar month (節-based month branch). 2026-07-20 (乙未 day in 未 month) → **建 Establish**. ✓
- **二十八宿 (28 mansions).** Continuous wheel `(JDN + 11) mod 28`, sequence beginning 角. The anchor was cross-checked against an authoritative almanac (2026-07-20 = **張月鹿**, a 吉 mansion) AND against the 七曜 rule that each mansion's luminary tracks the modern weekday: 張 = 月 (Moon) = Monday. ✓ 2026-07-26 (Sunday) → 房日兔, a 日 (Sun) mansion. ✓ Self-consistent for every date.
- **納音五行.** 60-jiǎzǐ nayin table (30 pairs). 乙未 → 沙中金 (Metal in the Sand). ✓
- **沖 / 煞方.** Clash ganzhi = day index − 6. 乙未 → 沖牛（己丑）; 亥卯未 group → 煞西. Both match the authoritative source. ✓ (辛丑 → 沖羊（乙未）, 煞東 for 巳酉丑 group. ✓)
- **吉時 (十二時辰).** 黃道黑道 hour-gods; 青龍 start-hour keyed off the day branch (子午起申, 丑未起戌…). 未 day → 吉時 寅卯巳申戌亥. ✓
- **宜 / 忌 — honest note.** Derived from the 建除 officer through a curated rules table drawn from the 通書 tradition. This is a **faithful reconstruction** of how an almanac reasons — not a transcription of one specific temple edition. The dates, pillars, mansions and lunar reckoning are exact; the 宜忌 are principled, not scriptural. Stated plainly in the "推算 · How It Is Computed" section on the page.

Screenshot protocol: served over local HTTP on **port 8936**; `?date=2026-07-20` forces the demo day. Zero console errors at 1440×900 and 390×844.

---

## Pass 1 — build & first critique

Built the full page: intro, date toolbar (prev/next/today/date-picker), the tear-off almanac sheet (brass ring binding + perforated tear edge), 擇日 event-finder, month view, "how it's computed" honesty block, footer. Screenshotted desktop (1440×900), a tall full-sheet capture, and mobile (390×844).

**Found:**
- The **沖 clash ganzhi was wrong** — rendered 辛丑 for 乙未 day; the correct convention (and the authoritative almanac) is 己丑. The clash ganzhi sits at sexagenary index −6, not +6.
- Everything else read well: 六月初七, 丙午年生肖馬, 乙未 day pillar (red-highlighted), 沙中金, 張月鹿吉, 建 officer, the 宜(red)/忌(ink) seal columns, the 12-時辰 lucky-hours grid, and the one-line guidance all rendered correctly. Zero console errors.

**Changed:** fixed `clashStem` to use `mod(dp.idx − 6, 10)`. Re-verified against two independent dates.

---

## Pass 2 — refinement & the 破日 stress test

Screenshotted a **破日 (day of ruin)** — 2026-07-26 — to stress the worst-tier state, plus the refreshed month view and the mobile lower sections.

**Found:**
- The 破日 renders exactly right: cinnabar-tinted officer band, 宜 list collapses to demolition/healing only (求醫·療病·拆卸·壞垣·破土), 忌 list swells to every auspicious act. 辛丑 day, 壁上土, 房日兔 (a 日-mansion, correctly landing on Sunday), 沖羊（乙未）, 煞東 — all cross-consistent. 
- The month-cell tinting was a touch faint; favourable/ruin days needed to read at a glance.
- The finder cards and calendar cells were click-only (no keyboard path); one card could say "in 0 days".

**Changed:**
- Strengthened the jade/cinnabar gradient on month cells; made the selected cell's number cinnabar and the 破日 officer label cinnabar.
- Added `role="button"`, `tabindex="0"`, aria-labels and Enter/Space handlers to every finder card and calendar cell (keyboard-navigable). Left-arrow / right-arrow already step the day.
- "in 0 days" → "today".

---

## Pass 3 — final verification

Re-screenshotted at the exact mandated widths (1440×900, 390×844) and a tall mobile capture spanning the finder + month view.

**Found:**
- One run reported a `NAV: Navigation timeout` — this was **server backpressure** on the single-threaded python http.server after many rapid sequential requests, not a page console error (the same page served cleanly on adjacent runs). Restarted the server; the desktop capture then returned **NO_CONSOLE_ERRORS**.
- Composition holds at both widths: the sheet, event finder (2-column cards on mobile), and month view all stack cleanly. The event-finder returns 8 genuinely auspicious wedding days (all 成/滿/定/收 officers). The month view correctly respects the mid-month 節 boundary (July 1–6 are 午-month, so 破日 falls on 子 days; July 7+ are 未-month, so 破日 shifts to 丑 days).

**Result:** zero console errors at both widths; reduced-motion guards in place (`.reveal` forced visible, sheet page-turn transition and all hover transforms disabled under `prefers-reduced-motion`); rAF-free (no animation loop to pause). Ship.
