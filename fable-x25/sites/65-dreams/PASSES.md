# 周公解梦 · THE DREAM KEY — iteration passes

Site 65 of the XAVIER FABLE ×65 showcase. A searchable dream-symbol dictionary in the
folk tradition of 周公解梦 (attributed to the Duke of Zhou): 160 hand-composed entries across
11 categories, each with the classical 中文 interpretation, an English rendering, and a
gentler modern "another way to see it" note. Nocturnal indigo hero fading to a warm-paper
almanac. Served over local HTTP on port 8940; screenshots via the shared shot.mjs / scrollshot.mjs.

Fonts: **Noto Serif SC** (the 中文 interpretations + display) · **Cormorant Garamond** (English
serif, italic renderings) · **IBM Plex Mono** (labels, search, omen tags).

URL params implemented: `?q=掉牙` and `?symbol=teeth` open a specific reading; `?cat=animals`
filters the dictionary to a category. Search matches Chinese and English keywords.

---

## Pass 1 — first full build, screenshotted at 1440×900 (hero, ?q=掉牙 reading, ?cat=animals) and 390×844 (mobile)

**Found**
- Hero, reading modal (掉牙), and mobile all read beautifully — night sky, gold-gradient 周公解梦
  title, moon + drifting clouds + butterfly, cinnabar omen seals, canvas star-motes. Zero console
  errors at both widths on the plain page.
- **Bug:** `?cat=animals` highlighted the category chip and set state, but did not re-render the
  grid or the count — the list still showed all 160 entries ("160 DREAMS") instead of the 29 animals.
- The night→paper transition band read slightly cold/grey rather than warm.
- On mobile the drifting butterfly rested over the "THE DREAM KEY" title at settle time (overlap).
- Screenshot harness threw `networkidle2` nav timeouts on the query-param URLs — traced to the
  single-threaded `python -m http.server`, not a page error (the shots still rendered).

**Changed**
- Fixed `handleParams()` to call `renderGrid()` (and take the non-scroll branch) when `?cat=` is set.
- Warmed the `#night::after` fade to warm-paper stops so the hero dissolves into the almanac.
- Hid the butterfly and tucked the moon into the corner below 640px so nothing overlaps the title.
- Restarted the server as a `ThreadingHTTPServer` so networkidle settles reliably.

## Pass 2 — re-shot hero, ?cat=animals, mid-grid scroll, keep-a-dream, tradition, ?q=蛇 (threaded server)

**Found**
- `?cat=animals` now correctly reads "29 DREAMS · 动物 ANIMALS" with animal cards; the category
  filter, count, and chip state are all in sync. All standard shots: NO_CONSOLE_ERRORS.
- Dictionary grid is strong — omen seals (吉 cinnabar / 平 brass / 凶 ink), ★ on the famous entries,
  clamped 2-line classical previews, warm card stock.
- Reading modals (蛇 snake auspicious; coffin later) render the classical line, English rendering,
  and modern note cleanly; the 官/财 pun even renders bilingually inside the coffin reading.
- The ruled "keep a dream" journal: the horizontal rules were painted on the frame, so they sat
  offset from the textarea's text baseline by the frame padding (~22px) — lines didn't meet the ink.
- Faint peek-through of card omen seals under the transparent lower edge of the sticky toolbar.

**Changed**
- Moved the rule lines onto the `<textarea>` itself with `background-attachment:local` and a
  line-height-matched repeating gradient, so ruling scrolls with — and sits under — the writing.
- Strengthened the sticky toolbar's solid backing (paper to 82%) so cards no longer ghost through.

## Pass 3 — verification: ?symbol=teeth, ?q=棺材 coffin, mobile hero, keep-a-dream re-shot

**Found**
- `?symbol=teeth` resolves to 掉牙 and opens the full reading (both param forms confirmed working).
- `?q=棺材` opens the auspicious coffin reading with the 官/财 wordplay intact — faithful and delightful.
- Mobile hero is clean: butterfly hidden, moon corner-tucked, title unobstructed, chips wrap.
- Ruled journal now aligns — text rests on the lines, red margin meets the first character.
- NO_CONSOLE_ERRORS on every standard shot at 1440×900 and 390×844.

**Changed**
- No further code changes required; generated `assets/og.jpg` + `assets/thumb.jpg` for the gallery.

---

### Quality checklist
- Zero console errors at 1440×900 and 390×844 (the networkidle timeouts seen were a harness/font
  artifact on the single-threaded dev server, resolved by the threaded server; not page errors).
- `prefers-reduced-motion` guarded: canvas draws one static frame, CSS animations disabled, reveals shown.
- Canvas rAF caps devicePixelRatio at 2 and cancels on `visibilitychange` (tab hidden).
- Styled `::selection`, `::-webkit-scrollbar`, `:focus-visible`; back-link reads "XAVIER FABLE ×65".
- Fluid `clamp()` type, letterspaced mono caps, tight display leading; real bilingual copy throughout.
- 160 dream entries incl. all the famous ones: 掉牙, 飞, 蛇, 水, 坠落, 被追, 死, 结婚, 孕, 血, 火, 龙, 棺材, 粪.
