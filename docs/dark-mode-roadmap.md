# Dark mode — implementation roadmap

Plan for adding a light/dark theme to the Data Portal, written to be picked up cold in a
new session. Assessed and verified against `main` at `86888a0` on 2026-09-15.

**Starting a session on this:** read [AGENTS.md](../AGENTS.md) first (data generation,
commit rules, the pre-commit gate), then this file. Do one phase per branch, run the
checks in §6 before merging, and tick the phase off below. A prompt that works:

> Read AGENTS.md and docs/dark-mode-roadmap.md, then implement Phase 1 on a new branch.

## Progress

- [x] **Phase 0** — Stop OS dark mode leaking into form controls (bug fix, ship alone)
- [x] **Phase 1** — Theme plumbing: tokens, daisyUI dark theme, provider, no-flash script
- [x] **Phase 2** — Shared layout and components
- [x] **Phase 3** — Pages
- [x] **Phase 4** — Charts (Plotly, Chart.js, D3)
- [x] **Phase 5** — Logo, textures and contrast audit
- [ ] **Phase 6** — Toggle, default to system, docs, launch

Estimated total: about 3½ days of work.

---

## 1. Goal and ground rules

- Visitors choose **light**, **dark** or **system** (follow the OS); the choice is
  remembered per browser. At launch the default is **system**.
- **Light mode must look the same as today.** Every token's light value is the colour the
  site uses now. The one intended light-mode change is chart axis text unified to `#555`
  in Phase 4.
- **Dark mode stays hidden until Phase 6.** Until then the default preference is `light`
  and dark is reachable only by setting `localStorage.theme = 'dark'`. Pushing to `main`
  deploys immediately, so this is what makes it safe to merge Phases 1–5 one at a time.
- **Data colours do not change between themes.** Taxonomy colours
  ([taxonomy-color-scheme.ts](../src/config/taxonomy-color-scheme.ts), 115 colours), phylum
  colours, the heatmap colour scale, the MAG completeness/contamination swatches, the
  mustard bar markers and the burgundy markers drawn over cryosection photos all stay as
  they are. Volcano up/down colours get lighter dark-mode variants because they are also
  used as text (Phase 4).

## 2. What the plan rests on (verified 2026-09-15)

- **Stack:** Tailwind 3.4.17 + daisyUI 4.12.24. There is no `daisyui` block in
  [tailwind.config.js](../tailwind.config.js), so both stock daisyUI themes are compiled and
  `dark` is applied automatically under `prefers-color-scheme: dark`.
- **Existing bug:** [App.tsx:61](../src/App.tsx#L61) pins the page to `bg-white`, so for
  OS-dark visitors only the daisyUI controls go dark. Measured with Playwright on
  `/animal-specimens`: the filter inputs and selects render near-black on the white table
  and the column headers turn light grey at 60 % opacity on white. Phase 0 fixes this.
- **Colour usage:** 186 Tailwind colour classes across 33 files. The neutrals among them
  collapse onto nine tokens (§4).
- **Already dark-proof:** the page banners ([PageHeader](../src/components/PageHeader/index.tsx),
  Home hero) and the [Footer](../src/components/Footer/index.tsx) use the `bg-prism`
  burgundy-to-mustard gradient with light text. They need no change.
- **Charts set their own colours** and ignore CSS: four Plotly charts, two Chart.js charts
  (sharing [useTaxonomyChart](../src/hooks/useTaxonomyChart.ts)) and two D3 layers.
- **Contrast** against the proposed dark surface `#16181b`: burgundy `#741B47` is about
  1.7:1 and `light_burgundy` about 2.4:1, both below the 4.5:1 minimum for text. Mustard is
  6.2:1, which is fine.
- **Logo:** [3domics-logo.png](../src/assets/images/3domics-logo.png) is a transparent PNG
  with a dark burgundy cube, which will look dim on a dark navbar.
- **Rule order in daisyUI's output:** `[data-theme=light]` is emitted *after* the
  `@media (prefers-color-scheme: dark) { :root {…} }` block (byte offsets 7724 and 5573 in
  the built CSS). Both selectors have equal specificity, so an explicit `data-theme` on
  `<html>` beats the OS preference. The plan depends on this.
- **Tests:** jsdom has no `window.matchMedia` (the Methods page already guards it with
  `?.` at [Methods/index.tsx:77](../src/pages/Methods/index.tsx#L77)). There are 66 test
  files; AGENTS.md still says 63.

## 3. Design decisions

1. **One attribute drives everything.** `data-theme="light"` or `"dark"` on `<html>`, set
   before first paint by an inline script in `index.html` and kept in sync by a
   `ThemeProvider`. daisyUI reads it natively. Tailwind's `dark:` variant is configured to
   read it too, for the few places that need one.
2. **Semantic colour tokens** as CSS variables, not daisyUI's `base-100/200/300`. daisyUI
   has three surface steps but the site uses five (white, neutral-50, neutral-100,
   neutral-200 and grey borders). Squeezing them onto three would change light mode.
3. **daisyUI's stock `light` theme stays untouched**, so today's controls look exactly the
   same. A customised `dark` theme sets its base colours to match the dark tokens.
4. **`custom_black` stays a fixed `#555`.** It remains for text on light brand fills (the
   mustard record badges and filter chips, the rose error banner), which stay light in
   dark mode. Body text moves to the new `ink` token.
5. **Charts read colours from a TypeScript map** through `useChartTheme()`, not from
   `getComputedStyle`. That keeps them simple, and testable in jsdom.
6. **Preference model:** `'light' | 'dark' | 'system'`, stored under the `localStorage`
   key `theme`. It resolves to `'light' | 'dark'`.

## 4. Tokens

Tailwind colours are defined as `rgb(var(--token) / <alpha-value>)` so opacity modifiers
such as `bg-surface/80` keep working. CSS variables hold space-separated RGB channels.

| Tailwind name | CSS variable | Replaces | Light | Dark |
|---|---|---|---|---|
| `surface` | `--surface` | `bg-white` (incl. `/80`, `/30`) | `255 255 255` `#ffffff` | `22 24 27` `#16181b` |
| `surface_subtle` | `--surface-subtle` | `bg-neutral-50`, `bg-gray-50`, `hover:bg-gray-50` | `250 250 250` `#fafafa` | `28 31 35` `#1c1f23` |
| `surface_muted` | `--surface-muted` | `bg-neutral-100`, `bg-gray-100` | `245 245 245` `#f5f5f5` | `35 39 44` `#23272c` |
| `surface_strong` | `--surface-strong` | `bg-neutral-200`, `bg-gray-200` | `229 229 229` `#e5e5e5` | `44 49 55` `#2c3137` |
| `line` | `--line` | `border-gray-200`, `border-neutral-200` | `229 231 235` `#e5e7eb` | `58 64 71` `#3a4047` |
| `line_strong` | `--line-strong` | `border-gray-300` | `209 213 219` `#d1d5db` | `75 82 90` `#4b525a` |
| `ink` | `--ink` | `text-custom_black` on page surfaces, `text-gray-800`, `text-black` | `85 85 85` `#555555` | `212 212 212` `#d4d4d4` |
| `ink_muted` | `--ink-muted` | `text-neutral-500`, `text-gray-500`, `text-gray-600` | `115 115 115` `#737373` | `156 163 175` `#9ca3af` |
| `burgundy_ink` | `--burgundy-ink` | `text-burgundy` as text | `116 27 71` `#741b47` | `224 122 174` `#e07aae` |

Dark contrast on `surface`: `ink` 12:1, `ink_muted` 7.0:1, `burgundy_ink` 6.4:1, mustard
6.2:1. `ink` on the dark `surface_strong` zebra rows is 8.8:1. The dark values are
starting points; tune them in Phase 5.

`gray-*` and `neutral-*` merge into one token per step. The differences (such as
`#e5e7eb` against `#e5e5e5`) are not visible.

Leave these as they are: `text-white` / `text-neutral-50` (always on burgundy, prism or
coloured fills), `bg-black/30` (mobile menu scrim), `bg-burgundy`, `bg-light_burgundy`,
`bg-light_mustard`, `bg-rose-200`, and every mustard class.

To regenerate the inventory of raw neutrals still left in the code:

```bash
find src -name '*.tsx' ! -name '*.test.*' ! -path 'src/assets/*' -print0 \
  | xargs -0 grep -EnH '(bg|text|border|divide|ring)-(white|black|gray|neutral|slate|zinc|stone)(-[0-9]{2,3})?(/[0-9]+)?\b|bg-\[#'
```

---

## 5. Phases

### Phase 0 — Stop OS dark mode leaking into form controls (~15 min, ship alone)

1. In [tailwind.config.js](../tailwind.config.js), add `daisyui: { themes: ['light'] },`
   next to `plugins`.
2. CHANGELOG → **Fixed**.

**Done when:** after `npm run build`, `grep -c 'prefers-color-scheme: dark' dist/assets/*.css`
prints `0`, and the dark screenshot of `/animal-specimens` (§6) matches the light one.

Phase 1 brings a dark theme back. That is safe because from then on `data-theme` is always
set explicitly (§2, rule order).

### Phase 1 — Theme plumbing (~½ day, no visible change)

1. **`src/config/theme.ts`**

   ```ts
   export type ThemePreference = 'light' | 'dark' | 'system'
   export type ResolvedTheme = 'light' | 'dark'
   export const THEME_STORAGE_KEY = 'theme'
   // Flip to 'system' in Phase 6 — and the fallback in the script in index.html
   export const DEFAULT_THEME_PREFERENCE: ThemePreference = 'light'
   ```

2. **`index.html`**: an inline script in `<head>`, before the module script, so the page
   never flashes the wrong theme:

   ```html
   <script>
     // Keep in step with src/config/theme.ts
     (function () {
       var pref
       try { pref = localStorage.getItem('theme') } catch (e) {}
       if (pref !== 'light' && pref !== 'dark' && pref !== 'system') pref = 'light'
       var dark = pref === 'dark' || (pref === 'system' && !!window.matchMedia
         && window.matchMedia('(prefers-color-scheme: dark)').matches)
       document.documentElement.dataset.theme = dark ? 'dark' : 'light'
     })()
   </script>
   ```

3. **`src/components/ThemeProvider/index.tsx`** and **`src/hooks/useTheme.ts`**
   - Context value: `{ preference, resolved, setPreference }`. The context **default** is
     `{ preference: 'light', resolved: 'light', setPreference: () => {} }`, so components
     rendered without the provider (every existing test) keep working.
   - Read and write `localStorage` inside `try/catch`. Guard `window.matchMedia?.(…)`.
   - When `preference === 'system'`, subscribe to the media query's `change` event.
   - A layout effect writes `document.documentElement.dataset.theme = resolved`.
   - Wrap `<App />` in [main.tsx](../src/main.tsx).

4. **`src/index.css`**: the token variables, after the `@tailwind` directives:

   ```css
   @layer base {
     :root, [data-theme="light"] {
       --surface: 255 255 255;
       --surface-subtle: 250 250 250;
       /* …the rest of the light column in §4 */
     }
     [data-theme="dark"] {
       --surface: 22 24 27;
       /* …the rest of the dark column in §4 */
     }
   }
   ```

5. **`tailwind.config.js`**

   ```js
   const themes = require('daisyui/src/theming/themes')
   const token = (name) => `rgb(var(--${name}) / <alpha-value>)`

   module.exports = {
     darkMode: ['selector', '[data-theme="dark"]'],
     // theme.extend.colors: add surface: token('surface'), surface_subtle: token('surface-subtle'),
     //   …one entry per row of §4. Keep the existing brand colours unchanged.
     daisyui: {
       themes: [
         'light',
         { dark: { ...themes.dark, 'base-100': '#16181b', 'base-200': '#1c1f23',
                   'base-300': '#2c3137', 'base-content': '#d4d4d4' } },
       ],
       darkTheme: 'dark',
     },
   }
   ```

6. **Tests**, colocated as `ThemeProvider.test.tsx`: default resolves light; a stored
   `'dark'` sets `data-theme="dark"`; `'system'` follows a mocked `matchMedia` and reacts to
   its `change` event; an invalid stored value falls back to the default; a throwing
   `localStorage` falls back to the default.

**Done when:** light screenshots match the baseline (§6). With `localStorage.theme = 'dark'`
the daisyUI controls go dark while the rest stays light, which is expected at this stage.
tsc, vitest and build all pass.

### Phase 2 — Shared layout and components (~½ day)

Apply the §4 mapping to:

| File | Change |
|---|---|
| [App.tsx:61](../src/App.tsx#L61) | wrapper `text-custom_black bg-white` → `text-ink bg-surface` |
| [index.css](../src/index.css) | `.pagination_btn` hover → `enabled:hover:bg-surface_muted`; `.page_description` → `text-ink` |
| [Navbar/index.tsx](../src/components/Navbar/index.tsx) | `:23` `bg-neutral-50` → `bg-surface_subtle`; `:57` dropdown `bg-white` → `bg-surface` |
| [Navbar/MobileMenu.tsx](../src/components/Navbar/MobileMenu.tsx) | panels `bg-neutral-50` → `bg-surface_subtle`; `text-neutral-500` → `text-ink_muted`; hamburger bars `bg-neutral-500` → `bg-ink_muted`. Keep the scrim and `hover:bg-burgundy hover:text-white` |
| [BreadCrumbs:34](../src/components/BreadCrumbs/index.tsx#L34) | current crumb `text-burgundy` → `text-burgundy_ink` |
| [Tabs](../src/components/Tabs/index.tsx) | `border-gray-200` → `border-line`; `:19` `!text-burgundy` → `!text-burgundy_ink` |
| [Table/TableBody](../src/components/Table/components/TableBody/index.tsx) | `:18` sticky `<thead>` `bg-white` → `bg-surface`; `:75` rows `bg-neutral-50` / `odd:[&>tr]:bg-neutral-200` → `surface_subtle` / `surface_strong`. The burgundy row hover stays |
| [Table/TableHeader](../src/components/Table/components/TableHeader/index.tsx) | `:19` `bg-white` → `bg-surface`; `:23` mustard record badge: add `text-custom_black` |
| [Table/TableFilters](../src/components/Table/components/TableFilters/index.tsx) | `:30` `bg-white` → `bg-surface`; `:37`, `:59` mustard chips: add `text-custom_black` |
| DownloadTSVButton, [TableView](../src/components/TableView/index.tsx), [TaxonomyChartLegend](../src/components/TaxonomyChartLegend/index.tsx) | one or two neutrals each |
| [CrossReferenceTooltip:27](../src/components/CrossReferenceTooltip/index.tsx#L27) | `bg-white text-black` → `bg-surface text-ink` |
| [ErrorBanner](../src/components/ErrorBanner/index.tsx) | keep the rose fill and add `text-custom_black`; SVG `#555` → `currentColor` |
| Footer, PageHeader | no change; check only |

**Done when:** dark screenshots of the list and detail pages show a coherent dark shell
(navbar, breadcrumbs, table, filters, pagination, tabs) and the light screenshots are
unchanged.

### Phase 3 — Pages (~½ day)

The rest of the inventory, with the number of raw neutrals in each file:

- [Home.tsx](../src/pages/Home.tsx) (8), plus `bg-[#444444]` at `:214` (the animal icon
  tiles; see how the silhouette is drawn before choosing `bg-ink`) and the
  `bg-texture` strip
- Metabolomics: [AnalysisSetting](../src/pages/MetabolomicsVolcano/components/AnalysisSetting/index.tsx) (5),
  [SignificantMetabolitesTable](../src/pages/MetabolomicsVolcano/components/SignificantMetabolitesTable/index.tsx) (4,
  plus `text-burgundy hover:text-burgundy/70` at `:74` → `burgundy_ink`),
  [CompareSamplesButton](../src/pages/MetabolomicsHeatmap/components/CompareSamplesButton/index.tsx) (4),
  `MetabolitePlots/Heatmap.tsx` (4), `MetabolitePlots/Bar.tsx` (4),
  [MetabolomicsVolcano/index.tsx](../src/pages/MetabolomicsVolcano/index.tsx) (1)
- Composition charts: [MicrosampleComposition/…/TaxonomyChart.tsx](../src/pages/MicrosampleComposition/components/TaxonomyChart.tsx) (7;
  loading overlay `bg-white/80` → `bg-surface/80`, `text-gray-600` → `text-ink_muted`),
  [MacrosampleComposition/…/TaxonomyChart.tsx](../src/pages/MacrosampleComposition/components/TaxonomyChart.tsx) (6; `bg-white/30`)
- [Methods/index.tsx](../src/pages/Methods/index.tsx) (3, plus the `:22` section heading
  `text-burgundy` / `border-neutral-200`), [NotFound.tsx:8](../src/pages/NotFound.tsx#L8)
  (`text-burgundy`)
- List pages: MAGCatalogueList (3), MetabolomicsList (3), MacrosampleCompositionList (2),
  Macrosamples (2), DownloadDatabaseSchema (1); also [main.tsx](../src/main.tsx) (1)
- Skip `LoadingRemainingData.tsx`: it is dead code (AGENTS §6.6).

**Done when:** no page in the dark screenshot run keeps a white or light-grey panel, apart
from the intended light fills (mustard badges, error banner).

### Phase 4 — Charts (~1 day)

1. **`src/config/chartTheme.ts`**

   ```ts
   export const chartTheme = {
     light: { text: '#555555', axis: '#555555', grid: 'rgba(0,0,0,0.1)', surface: '#ffffff',
              volcanoUp: '#B30059', volcanoDown: '#0057D9' },
     dark:  { text: '#d4d4d4', axis: '#9ca3af', grid: 'rgba(255,255,255,0.12)', surface: '#16181b',
              volcanoUp: '#F06292', volcanoDown: '#64A0FF' },
   } as const
   ```

   `src/hooks/useChartTheme.ts` returns `chartTheme[useTheme().resolved]`. The dark volcano
   colours are 5.8:1 and 6.8:1 on `surface`.

2. **Plotly.** Add this to every layout:
   `paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: { color: c.text }`,
   plus `gridcolor: c.grid, zerolinecolor: c.axis, linecolor: c.axis` on both axes.
   Transparent backgrounds let the page surface show through.
   - [VolcanoPlot](../src/pages/MetabolomicsVolcano/components/VolcanoPlot/index.tsx): layout at
     `:238`; the `'black'` reference line at `:262` → `c.axis`; the up/down colours at
     `:40–41` → `c.volcanoUp` / `c.volcanoDown` (the legend swatches at `:333–341` follow).
     Keep `hoverlabel.bgcolor` on the original dark red and blue so the white hover text
     stays readable.
   - `MetabolitePlots/Heatmap.tsx` layout at `:78`: the colour bar title and ticks inherit
     the font colour. Keep the colour scale.
   - `MetabolitePlots/Bar.tsx` layout at `:63`. Keep the mustard markers.
   - [ImagePlot.tsx:51](../src/pages/MicrosampleComposition/components/ImagePlot.tsx#L51): the
     layout is inside a `useMemo`, so add the theme colours to its dependencies.

3. **Chart.js.** Call `useChartTheme()` inside
   [useTaxonomyChart](../src/hooks/useTaxonomyChart.ts). Set `ticks.color`, `grid.color`
   and `title.color` on both scales; change the dataset `borderColor` at `:36` to `c.grid`;
   add the colours to the `useMemo` dependencies at `:105`. Both composition pages pick
   this up. Update `useTaxonomyChart.test.ts`.

4. **D3.**
   - [PhyloTreeLayer](../src/pages/MAGCatalogue/components/PhyloCircosPlot/PhyloTreeLayer/index.tsx):
     link stroke `'#555'` at `:84` and `:159` → `c.axis`; `'#00000040'` at `:112` →
     `c.grid`; label halo stroke `'white'` at `:128` → `c.surface`; set the label fill to
     `c.text`; add the colours to the effect dependencies at `:213`.
   - [CircosLayer](../src/pages/MAGCatalogue/components/PhyloCircosPlot/CircosLayer/index.tsx):
     separator stroke `'white'` at `:120` → `c.surface`; add the colours to the dependencies
     at `:167`. The tooltip stays `rgba(0,0,0,0.8)`.
   - Check that both effects clear the SVG before drawing. Otherwise a theme change draws a
     second copy on top.

**Done when:** switching theme redraws every chart with readable axes and labels, and
there are tests for `useChartTheme` plus the updated `useTaxonomyChart` tests.

### Phase 5 — Logo, textures and contrast audit (~½ day)

- **Logo** ([Navbar:33](../src/components/Navbar/index.tsx#L33), MobileMenu `:52`): the
  existing transparent logo is approved for the dark navbar; keep the single image.
- **Textures**: `.bg-texture` and `.bg-diagonal` in [App.css](../src/App.css) retain the
  existing light-mode overlays and lower their dark-mode opacity to keep the Home carousel
  and tiles readable.
- **Contrast pass**: the dark values in §4 meet their stated body, muted-text,
  `burgundy_ink`, mustard-navigation and zebra-row targets. daisyUI supplies visible
  focus outlines and its dark `color-scheme`, so native controls and scrollbars follow the
  active theme. No palette changes are needed.

### Phase 6 — Toggle, default to system, docs, launch (~½ day)

1. Add a toggle button to the Navbar (desktop) and MobileMenu that cycles
   system → light → dark. Use the FontAwesome free-solid icons already installed
   (`faCircleHalfStroke`, `faSun`, `faMoon`), with an `aria-label` naming the current mode.
2. Flip `DEFAULT_THEME_PREFERENCE` to `'system'` in `theme.ts` **and** the `'light'`
   fallback in the `index.html` script.
3. Tests: the toggle cycles and persists; `Navbar.test.tsx` and `MobileMenu.test.tsx`
   still pass.
4. Optional regression guard: `src/tests/themeTokens.test.ts` scans `src/**/*.tsx` for raw
   `bg-white`, `bg-/text-/border-(gray|neutral)-N` classes (with an allowlist) and fails
   when new ones appear.
5. Docs: in AGENTS.md §4, add the convention (use tokens; `custom_black` only on light
   fills; charts through `useChartTheme`); mention ThemeProvider in
   [architecture.md](architecture.md); add a CHANGELOG entry under **Added**.
6. Final screenshot run in both themes, plus OS dark with no stored preference.

---

## 6. Verification

Run these before every merge (AGENTS §7):

```bash
npx tsc --noEmit          # 4 known errors (AGENTS §6.7); no new ones
npx vitest run            # all green (66 test files at the time of writing)
npm run build             # needs the generated data (AGENTS §2)
```

**Screenshots.** Playwright is not a dependency of this repo. Install it without touching
`package.json`:

```bash
npm i --no-save playwright && npx playwright install chromium
npm run build && npx vite preview --port 4179 --strictPort   # leave running
NODE_PATH="$PWD/node_modules" node /path/to/theme-shots.cjs /path/to/outdir
```

Keep the script outside the repo (for example in the session scratchpad):

```js
// theme-shots.cjs — every page in light and dark, full-page PNGs
const { chromium } = require('playwright')

const OUT = process.argv[2] || '.'
const BASE = 'http://localhost:4179/database'
const LIST_PAGES = ['/animal-trials', '/animal-specimens', '/macrosamples', '/cryosections',
  '/microsamples', '/mag-catalogues', '/macrosample-compositions', '/metabolomics']
const OTHER_PAGES = ['/', '/database-schema', '/methods/mag-catalogue',
  '/methods/metabolomics', '/no-such-page']

;(async () => {
  const browser = await chromium.launch()
  for (const theme of ['light', 'dark']) {
    const ctx = await browser.newContext({ colorScheme: theme, viewport: { width: 1280, height: 900 } })
    // Until Phase 6 dark mode is opt-in: force it the way the toggle will
    await ctx.addInitScript((t) => { try { localStorage.setItem('theme', t) } catch {} }, theme)
    const page = await ctx.newPage()
    const shoot = async (path) => {
      await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 120000 })
      await page.waitForTimeout(1000)
      const name = path.replace(/\W+/g, '_').replace(/^_|_$/g, '') || 'home'
      await page.screenshot({ path: `${OUT}/${name}-${theme}.png`, fullPage: true })
    }
    for (const path of OTHER_PAGES) await shoot(path)
    for (const path of LIST_PAGES) {
      await shoot(path)
      // Follow the first link into a detail page of the same section
      const href = await page.locator(`a[href^="/database${path}/"]`).first()
        .getAttribute('href', { timeout: 3000 }).catch(() => null)
      if (href) await shoot(href.replace(/^\/database/, ''))
    }
    await ctx.close()
  }
  await browser.close()
})().catch((e) => { console.error(e); process.exit(1) })
```

**Light-mode baseline.** Before starting Phase 1, run the script on `main` into a
`baseline/` folder. After each phase, compare the new `*-light.png` files against it: by
eye, or with ImageMagick's `compare -metric AE` if it is installed. Before Phase 1 exists,
the forced `localStorage` value does nothing and the dark run shows the Phase 0 state.

During development you can switch themes from the browser console with
`localStorage.theme = 'dark'; location.reload()`.

## 7. Gotchas

- **jsdom has no `matchMedia`** and `localStorage` can throw: guard both, or tests and
  private windows break.
- **Keep the context default at light.** The existing tests render components without the
  provider.
- **Light fills keep dark text.** Text inherits `ink`, which turns light in dark mode, so
  anything sitting on `bg-light_mustard` or `bg-rose-200` needs an explicit
  `text-custom_black`.
- **Charts only change when they re-render.** Every `useMemo` or `useEffect` that builds
  chart options or draws SVG needs the theme colours in its dependencies.
- **Keep the script in `index.html` and `theme.ts` in step.** They share the storage key
  and the default preference.
- **Mustard text on white is about 2.9:1 today.** That is a pre-existing light-mode issue
  and out of scope here; on the dark surface it is 6.2:1.
- **`main` deploys on push.** Keep the default at `light` until Phase 6.
- **Commit rules:** no `Co-Authored-By` trailers; each CHANGELOG entry links its commit
  hash (AGENTS §7).

## 8. Open decisions (need the project's call)

1. **Logo on dark — decided.** The existing transparent PNG remains on the dark navbar;
   no alternate asset or light plate is needed.
2. **Toggle style.** A three-state cycling button (system / light / dark) is recommended;
   a two-state switch is simpler but loses "follow my OS".
3. **Default at launch.** Following the OS is recommended; light-by-default with opt-in
   dark is the cautious alternative.
4. **Dark palette.** The §4 values are proposals chosen for contrast; adjust them to taste
   in Phase 5.
