# Changelog

Notable changes to the **3D'omics Data Portal**, newest first. Every entry links to the
commit that made it.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/): changes are
grouped under **Added**, **Changed**, **Deprecated**, **Removed**, **Fixed** and
**Security**.

Sections are **dated milestones, not version numbers.** This repository is not tagged or
released — pushing to `main` deploys to GitHub Pages immediately, so there is nothing to
number. What *is* versioned is the data: each commit pins a catalogue release in
[catalog.json](catalog.json), and the pinned version is named on every milestone that
moved it. If the project starts tagging releases, these headings become
`## [x.y.z] — date` without any other change to the format.

---

## [Unreleased]

### Added

- Trial F's MAG catalogue (*Adenovirus experiment, chicken*) on the MAG Catalogues
  pages: 260 genomes, their counts across 144 caecal sequencing libraries, the
  catalogue's Zenodo DOI and description, and its summary figures (7,376 MAGs, 89.5%
  average completeness, 4.0% average contamination, 5.2% new species).
  `catalog.json` now pins catalogue `2026.09.21.1` (version DOI
  `10.5281/zenodo.22867325`), which also carries one new cryosection, `G121eI121B`. It
  supersedes `2026.09.21`, published the same day before F's summary figures were in
  Airtable ([`31f8c89`][31f8c89], [`b6dc7ef`][b6dc7ef]).
- The home page's section blocks and the arrows between them rise into view on load, one
  after another down the sample hierarchy from Animal Trials to Microsamples (a `rise-in`
  animation staggered 70 ms apart). Visitors who ask for reduced motion see them at once
  ([`4229c64`][4229c64]).
- A visitor-selectable dark mode, with a three-state system/light/dark toggle in desktop
  and mobile navigation. The default follows the OS setting, each choice persists locally,
  and a no-flash script applies the resolved theme before the application loads. A token
  regression test prevents new raw neutral utilities from bypassing the shared theme
  palette ([`b24a103`][b24a103]).
- Theme plumbing for the forthcoming dark mode: a typed light/dark/system preference,
  a no-flash `data-theme` script, `ThemeProvider`/`useTheme`, semantic colour tokens and
  a daisyUI dark theme. Dark mode remains opt-in through `localStorage.theme` until the
  launch phase ([`99ccee4`][99ccee4]).
- A **Methods** section at the end of the menu, with MAG Catalogue, Macro
  Metagenomics, Micro Metagenomics and Metabolomics pages under `/methods/<name>`. Each
  page opens with its title and introduction on the triangle-patterned `bg-prism` banner
  of the home page, followed by *Laboratory processing* and *Bioinformatic processing*
  sections whose headings carry a mustard-to-burgundy triangle (`clip-triangle`). All
  their text lives in one file, `src/pages/Methods/methodsContent.ts`, and a section left
  empty is shown as "in preparation"; the initial content covers the MAG Catalogue,
  Macro Metagenomics and Micro Metagenomics workflows. Cited works are listed under
  *References* at the bottom of the page, each linked by DOI or, for software without one,
  its release page or repository. In-text citations link to their entry: clicking one
  scrolls to it, moves focus there and highlights it briefly. On mobile, a menu section
  with no same-named link now gets a heading over its links, and the last desktop dropdown
  opens leftwards so it stays on screen
  ([`8ed6df4`][8ed6df4]).
- The home page lists its experiments in a horizontal carousel: a native scroll
  container, so touch swipes and trackpad scrolling need no JavaScript, with snap points
  and wrap-around chevron buttons labelled for screen readers. The order is shuffled on
  every visit, so no experiment is permanently last ([`3d0beea`][3d0beea]).
- A `.no-scrollbar` Tailwind utility, and a `.table_link` class — `.link` without the
  underline ([`3d0beea`][3d0beea], [`43b367e`][43b367e]).

### Changed

- The taxonomy colours are muted (OKLCH chroma about 0.10, from 0.2–0.3), and the
  phyla that dominate the trials no longer share a red-to-yellow run: Bacillota_A,
  44–95% of every chicken and turkey sample, is a steel blue instead of orange-red;
  Bacteroidota, which dominates the swine trials, a sage green instead of neon
  yellow-green; Bacillota an ochre; Pseudomonadota a clay; Spirochaetota a lavender. Classes
  are still offsets of their phylum and orders lighter and darker steps of their class.
  The most abundant order keeps its class's colour, so switching taxonomic level keeps
  the bars' overall look, and the other steps are placed so that orders stacked next to
  each other in the trial data are clearly different, including under simulated red–green
  colour blindness. The composition legend sets phylum names in the text colour rather
  than the phylum's, which the paler and deeper shades made hard to read. This also fixes
  Lachnospirales and Monoglobales sharing one colour.
- The footer's coordinator, contact and privacy policy links lose their underline and
  still turn mustard on hover, and the *Coordinator:* and *Contact:* labels are set in
  bold ([`dc1c51c`][dc1c51c]).
- The MAG Catalogues list lays each catalogue out like the home page's 3dtk block instead
  of as a rounded, shadowed card: square blocks on the textured section-block background,
  set apart from each other by a margin of the page background. Each opens with a tag
  naming the host read from the trial's name, then a heading such as *Trial C —
  Proof-of-principle swine trial*, the name after the trial letter set light and muted,
  followed by the four summary figures as small uppercase labels over large burgundy
  figures. The DOI sits to the right in a copyable box, above a *Browse catalogue* button
  and a *Download* button to the genome repository (previously the bare URL); below `lg`
  they drop beneath the figures. The figures are
  formatted by a helper shared with the catalogue page, `getSummaryStats`, so the list
  now also gives the MAG count a thousands separator, rounds the new-species share to at
  most two decimals, and shows a missing figure as a dash ([`ec21142`][ec21142]).
- The macrosample Metagenomics list lays each trial out the same way as the MAG
  Catalogues list: host tag and *Trial C — …* heading, with a *Browse composition*
  button to the right in place of the whole-card link and arrow. Its figures no longer
  repeat the MAG catalogue's. They describe the trial's composition instead, computed by
  `getCompositionStats` from the counts and genome metadata the chart is drawn from: the
  number of MAGs detected in at least one sample, the number of phyla they belong to,
  the number of samples with any mapped reads, and those samples' average Shannon
  diversity in effective number of MAGs (the mean of each sample's Hill number of order
  1, from abundances relative to the sample's total, as in the chart). A trial without
  composition data shows dashes. Both lists now draw their blocks with a shared
  `TrialBlock` component, which takes its figures as a prop, sets an optional unit
  after a figure, and takes the MAG list's DOI box and *Download* button as optional
  slots ([`ec21142`][ec21142]).
- A MAG catalogue page's summary figures (number of MAGs, average completeness, average
  contamination, new species) move out of the header into a full-width strip flush against
  it: four blocks on the home page's textured section-block background, divided by thin
  dark grey rules (two by two below the `lg` breakpoint), each a small label centred above
  the figure set large in the burgundy accent. The completeness and contamination colour
  swatches are dropped, the MAG count gains a thousands separator, and the new-species
  share is rounded to two decimals. The catalogue's link and DOI move to the right of the
  title, stacked and centred on it in the breadcrumb trail's translucent box, through a new
  optional `aside` slot on `PageHeader`; below `lg` the box drops beneath the title. Each
  label is led by the trail's light mustard triangle (now exported from `BreadCrumbs` as
  `TrailMark`), both values are links without underlines that turn light mustard on
  hover, and the DOI now resolves through `https://doi.org/` ([`a520f1a`][a520f1a]).
- The Metabolomics Methods page now documents sample extraction, LC–MS analysis,
  peak picking and alignment, drift correction, quality control and metabolite
  annotation, with the source document's references resolved into linked citations.
- The shared footer now records that 3D'omics ran from 2021 to 2025, while
  retaining its Horizon 2020 funding acknowledgement.
- The home page's "Download Database Schema" button is replaced by a full-width block
  introducing 3dtk, the 3D'omics ToolKit, set directly above the footer: a short overview,
  the `pip install 3dtk` command, and links to its
  [GitHub repository](https://github.com/3d-omics/3dtk) and
  [documentation](https://3dtk.readthedocs.io/). The `/database-schema` page itself stays
  reachable at its URL ([`ff34c8f`][ff34c8f]).
- The record counts on the home page's section blocks ("8 records", "1,466 records", …)
  are now burgundy-tinted tags in the style of the navbar's "Data portal" tag, set between
  each block's title and description, with the count in bold and thousands grouped. The
  arrows connecting the blocks take the same burgundy ([`4229c64`][4229c64]).
- The navbar's "Data Portal Home" entry is now a "Data portal" tag: a small rounded box
  beside the 3D'omics logo rather than a menu entry, tinted burgundy on the home page. It
  replaces the home icon the bar fell back to between the `lg` and `xl` breakpoints, and in
  the mobile drawer it sits beside the logo in place of the home link at the top of the list
  ([`c0b8eab`][c0b8eab]).
- The page header's breadcrumbs now sit inside the `bg-prism` banner, which follows the
  navbar directly, on a translucent strip that keeps them legible over the mustard end.
  The navbar is now a frosted sticky bar with full-height entries: the entry of the open
  page — or of any page below it — is lit and underlined in the mustard-to-burgundy
  gradient, and hovered entries light up the same way. Dropdowns are frosted panels that
  also open on keyboard focus, and their links carry the site's triangle mark. The mobile
  drawer is frosted as well, slides in, and marks the open page the same way
  ([`c548b8e`][c548b8e]).
- Dark-mode texture overlays now use lower-opacity variants on dark surfaces, keeping the
  Home carousel and navigation tiles legible. The existing transparent logo is approved
  for the dark navbar, and the contrast audit confirmed the token palette, daisyUI focus
  rings and native dark controls need no further changes ([`0379fd0`][0379fd0]).
- Plotly, Chart.js and D3 charts now follow the resolved theme through a shared chart
  palette: transparent Plotly canvases inherit the page surface, axes, grids and labels
  remain legible, and the volcano plot uses accessible dark-theme label colours. Existing
  taxonomy, phylum, heatmap and mustard data encodings remain unchanged ([`22b2349`][22b2349]).
- Page-specific surfaces now respond to the selected theme: the home carousel and
  navigation tiles, catalogue/list cards, volcano controls and table, taxonomy loading
  states, Heatmap plot skeletons, Methods, the schema download, 404 and redirect loader
  all use semantic colour tokens. Intended light fills — notably mustard badges — retain
  fixed dark text ([`66f4f55`][66f4f55]).
- The shared portal shell and reusable components now use semantic theme tokens: page
  surfaces and text, navigation, breadcrumbs, tabs, tables, pagination, tooltips and
  empty states all respond to the selected theme. Mustard record/filter badges and the
  rose error banner retain their fixed dark text on their intentionally light fills
  ([`091cad7`][091cad7]).
- Every page except the home page opens the way the Methods pages do: the breadcrumb
  trail, then the title and introduction on the triangle-patterned `bg-prism` banner,
  drawn by one shared `PageHeader` component. The list pages gain a breadcrumb trail;
  on detail pages (trials, specimens, samples, MAG catalogues, genomes, metabolomics
  plots) the key facts — IDs, dates, accessions, MAG statistics — and the description
  move onto the banner, above the tabs, and a trial's *View MAG Catalogue* link joins
  its facts. Tables embedded as tabs keep their own title. Each page now has one `<h1>`:
  table titles are `<h2>`, as are the experiment names on the MAG Catalogues and
  Metagenomics lists, which were each an `<h1>` ([`8ed6df4`][8ed6df4]).
- Each section has one name, the one the menu gives it, wherever it appears: page
  title, breadcrumbs, browser tab and tab strips. *List of MAG Catalogues* (tab: *MAG
  Catalogue List*) is now *MAG Catalogues*; *Macrosample Community Composition* is now
  *Metagenomics*, as the menu and home page already called it, and the cryosection tab
  *Microsamples Community Composition* follows suit; breadcrumbs no longer say *Animal
  Trial* or *Animal Specimen*; genome pages' tabs are plural, *Macrosamples* and
  *Microsamples*. Breadcrumbs follow the menu's hierarchy, so *Metagenomics* and
  *Metabolomics* sit under *Macrosamples*, and a metabolomics plot's trail runs through
  its experiment to *Volcano Plot* or *Heatmap*, which is now the page title. The
  browser tab is named by the page header — its title, then the level above it in the
  trail, as in *Volcano Plot - G - Salmonella experiment (chicken)* — in place of the
  list of routes `App.tsx` kept by hand ([`8ed6df4`][8ed6df4]).
- Breadcrumbs follow the site's look. The grey chevrons between levels are small
  mustard-to-burgundy triangles, the same `clip-triangle` mark as the Methods section
  headings; links turn mustard on hover, and only the last item — the current page — is
  set in burgundy, so an unlinked level such as *Methods* no longer reads as current.
  They are now a labelled `<nav>` around an ordered list with `aria-current` on the
  current page, wrap onto a second line rather than overflowing, and the mobile home icon
  keeps "Data Portal Home" as its accessible name ([`8ed6df4`][8ed6df4]).
- Links inside data tables no longer carry an underline. Nearly every cell in an ID or
  accession column is a link, and underlining all of them ruled the table without telling
  a reader anything the column had not already. Links in prose are unchanged
  ([`43b367e`][43b367e]).

### Fixed

- OS dark-mode preferences no longer make daisyUI form controls dark while the page
  surface remains light ([`09d837e`][09d837e]).
- The deploy's catalogue download names itself with a User-Agent. Zenodo began answering
  Node's default, `node`, with 403 Forbidden, which failed the fetch step before
  anything was built ([`58e9a45`][58e9a45]).

---

## 2026-08-29 — Citable, checksummed build inputs

Catalogue `2026.08.29` · schema 2. Developed on `wire-catalogue` and merged as
[`f901710`][f901710]. The site stops holding Airtable credentials and starts building
from two pinned, checksummed Zenodo deposits: the data catalogue, and the builder that
renders it. Rebuilding an old commit now rebuilds against the artefacts *that commit*
pinned, rather than against today's Airtable.

### Added

- `catalog.json` pins both halves of a build — which catalogue release to render, and
  which builder renders it — each as a URL plus a SHA-256 ([`0189948`][0189948],
  [`729310b`][729310b]).
- `src/scripts/fetch-catalog.ts`: downloads the pinned catalogue over anonymous HTTPS
  into `.catalog/` and verifies its SHA-256, exiting non-zero on a mismatch or a missing
  release ([`0189948`][0189948]).
- `CATALOG_FILE=/path/to/local.sqlite` renders a catalogue you built yourself; the pin is
  not enforced in that mode and the script says so ([`0189948`][0189948]).
- Zenodo DOIs recorded for both artefacts: the catalogue under CC-BY-4.0 — concept
  `10.5281/zenodo.22159111`, version `…22159112` ([`eb72fe9`][eb72fe9]) — and the builder
  as software, concept `10.5281/zenodo.22159536`, v0.1.0 `…22159537`
  ([`523393f`][523393f]).
- A CI step that installs the pinned builder wheel offline
  (`pip install --no-deps --no-index`), failing loudly with a pointer to
  `docs/deployment.md` when no wheel is pinned ([`729310b`][729310b]).
- Written documentation: [docs/architecture.md](docs/architecture.md),
  [docs/data-pipeline.md](docs/data-pipeline.md),
  [docs/deployment.md](docs/deployment.md) and
  [docs/known-issues.md](docs/known-issues.md) ([`0189948`][0189948]).

### Changed

- `npm run generate-data` is two steps — `fetch-catalog`, then `3domics-db-build render`
  — with no partial-success path ([`0189948`][0189948]).
- The catalogue is served from a Zenodo record under CC-BY-4.0 instead of a GitHub
  release asset, so it is fetchable anonymously and citable in its own right
  ([`eb72fe9`][eb72fe9]).
- `schema_version` corrected to `2`, which is what the published catalogue declares in
  `catalog_meta`; schema 2 adds `experiments.mag_description`, the field the MAG
  catalogue page reads as "MAG catalogue description" ([`eb72fe9`][eb72fe9]).
- The builder is installed from a 48 KB checksummed wheel — pure stdlib, so pip contacts
  no index — rather than cloned from the private `3d-omics/database-build`
  ([`729310b`][729310b]).
- Checksums are now the ones published in each record's `.sha256` asset, not hashes
  computed from a local build; a wheel is not byte-reproducible, since zip entry
  timestamps differ between builds ([`eb72fe9`][eb72fe9], [`523393f`][523393f]).

### Removed

- `src/config/airtable.ts` and `src/scripts/generate-data.ts`. The repository holds no
  Airtable credentials and does not talk to Airtable ([`0189948`][0189948]).
- All rendered data left the repository — the count CSVs, their `_json` conversions and
  `public/experiment-hierarchy.json` — after drifting stale against Airtable
  ([`0189948`][0189948]).

### Fixed

- The deploy could never install the builder. CI's `GITHUB_TOKEN` is scoped to this
  repository alone, so cloning the private builder repo only ever worked on a
  maintainer's laptop, where a credential helper supplied a personal token
  ([`729310b`][729310b]).
- `/dist` is git-ignored; Vite emits it and `.gitignore` had missed it
  ([`0189948`][0189948]).

---

## 2025-12-01 – 2025-12-22 — Metabolomics, community composition and the test suite

### Added

- The volcano-plot metabolomics page, built out in a parallel `Metabolomics_new/` tree —
  analysis settings, a significant-metabolites table and the plot itself, each with tests
  ([`9ef3be5`][9ef3be5]).
- A dedicated heatmap route beside the metabolomics list and volcano pages
  ([`1cfd5f1`][1cfd5f1]), then sample-comparison and metabolite bar/heatmap plots under it
  ([`e423070`][e423070]).
- A database-schema download page ([`c6f670c`][c6f670c]).
- TSV download from table headers, with per-page column configuration
  ([`ff2ed9b`][ff2ed9b]).
- `mergeMetaboliteData`, joining metabolite records into the macrosample table
  ([`ff2ed9b`][ff2ed9b]).
- Seven cryosection images, with the experiment hierarchy regenerated to reference them
  ([`d7d4392`][d7d4392]).
- Unit and integration tests across the metabolomics, microsample-composition and
  taxonomy-chart components ([`1f67411`][1f67411]).

### Changed

- Metabolomics restructured from a single page into three routes — list, heatmap and
  volcano — with `Metabolomics/` becoming `MetabolomicsVolcano/` ([`1cfd5f1`][1cfd5f1]),
  and `Metabolomics_new/` folded into the real routes once complete
  ([`e423070`][e423070]).
- The microsample community-composition page reduced to composition alone, its taxonomy
  chart and image plot moved out into components ([`0abd7cd`][0abd7cd]).
- `Macrosamples.tsx` became a `Macrosamples/` folder with its merge logic and tests
  alongside ([`ff2ed9b`][ff2ed9b]).
- Metabolite chart options moved from the volcano page to `src/config/metaboliteOptions.ts`
  ([`ff2ed9b`][ff2ed9b]).
- Tests reorganised to sit next to the code they cover, and `vitest.setup.ts` lifted out
  of `tests/setup/` ([`748e8f3`][748e8f3], [`1f67411`][1f67411]).
- Navbar and mobile menu reworked; the data-generation script substantially rewritten and
  `experiment_hierarchy.json` renamed to `experiment-hierarchy.json`
  ([`c6f670c`][c6f670c]).
- Home, cryosection and microsample page copy revised ([`3c30598`][3c30598]).

### Removed

- The old `Metabolomics/` folder and the composition code duplicated inside
  `MicrosampleCompositionList` ([`e423070`][e423070], [`0abd7cd`][0abd7cd]).
- Test files left stranded by the restructure, plus `reportWebVitals` and the unused
  `test-utils` helper ([`748e8f3`][748e8f3], [`1f67411`][1f67411]).
- The superseded `public/experiment_hierarchy.json` — 48k lines
  ([`aa4d6a2`][aa4d6a2]) — and the committed `3domics_data_schema.json`, another 71k
  ([`fe8b35e`][fe8b35e]).

---

## 2025-11-24 – 2025-11-28 — MAG catalogue, overview pages and genome metadata

### Added

- Per-record overview pages for cryosections and macrosamples
  ([`a0f59c2`][a0f59c2]).
- Genome metadata on the home and genome pages, and a revised phylum colour scheme for
  the circos plot ([`4d37bc5`][4d37bc5]).
- Tests for macrosample and microsample composition, and for `chartUtils`
  ([`0f1d025`][0f1d025]).

### Changed

- "Genome catalogue" renamed to **MAG catalogue** throughout — pages, list and tests
  ([`50d3245`][50d3245]).
- Sample pages pluralised to match their routes: `AnimalTrial`, `AnimalSpecimen`,
  `Cryosection`, `Macrosample` and `Microsample` became their plural forms
  ([`a0f59c2`][a0f59c2]).
- The genome tabs moved up out of `components/`, and both composition lists reworked
  ([`50d3245`][50d3245]).
- Macrosample and MAG catalogue tables reworked with new columns and data
  ([`0f1d025`][0f1d025]).

### Removed

- `IntestinalSectionSample`, superseded by the macrosample pages ([`0f1d025`][0f1d025]).

---

## 2025-11-03 – 2025-11-04 — Deep links on GitHub Pages

### Added

- `public/404.html`, which stores the requested path in `sessionStorage` and bounces to
  the app root — GitHub Pages serves no server-side SPA fallback
  ([`a75ecf3`][a75ecf3]).

### Fixed

- The redirect handler in `main.tsx` now restores the stored path on load, so a deep link
  lands on the page it named instead of the home page ([`37bfe42`][37bfe42]).
- No flash of the home page during that redirect ([`80bc447`][80bc447]).
- `404.html` trimmed back after the handler moved into the app ([`5e7b756`][5e7b756]).
- Broken link URLs, and the unit tests that had gone stale with them
  ([`cf74c3d`][cf74c3d]).

---

## 2025-10-30 – 2025-10-31 — Static site generation

### Added

- `src/scripts/generate-data.ts`, which renders the Airtable export into the JSON tree
  the pages import at build time ([`65005f6`][65005f6]).
- The GitHub Pages deploy workflow and a `.gitignore` covering the generated data
  ([`65005f6`][65005f6]).
- A taxonomy chart component and a microsample composition page
  ([`65005f6`][65005f6]).

### Changed

- Data fetching moved out of the browser: pages read generated JSON instead of calling an
  API at runtime, and ~4.5k lines of committed CSVs and unused images were dropped
  ([`65005f6`][65005f6]).
- Deployment settings and paths adjusted until the Pages build succeeded
  ([`9e79498`][9e79498], [`4b200d9`][4b200d9], [`14d6ed3`][14d6ed3],
  [`02a1cdb`][02a1cdb]).
- App styling tweak ([`5d82eb8`][5d82eb8]).

### Fixed

- `BrowserRouter` given the `/database/` basename it needs under GitHub Pages
  ([`ce143ce`][ce143ce]).
- The Vite base path, and a stray step in the data script ([`6d66c26`][6d66c26]).
- The metadata import path on the home page ([`3e21477`][3e21477]).

---

## 2025-10-20 – 2025-10-23 — Vite, TypeScript and Tailwind

### Added

- Tailwind and daisyUI, a root `index.html`, `vite.config.js` and a Vitest setup
  ([`8e33c89`][8e33c89]).
- Macrosample composition pages and a taxonomy chart ([`3fd9396`][3fd9396]).

### Changed

- The project migrated off Create React App to Vite, with the test runner moving from
  Jest to Vitest and `tsconfig.json` rewritten for it ([`8e33c89`][8e33c89]).
- Genome and genome-catalogue pages reworked, and the home page revised
  ([`3fd9396`][3fd9396]).
- README rewritten for the new stack ([`caa4d58`][caa4d58], [`5d73cde`][5d73cde]).

### Removed

- The CRA scaffolding: `public/index.html`, `setupTests.ts` and the CRA-specific config
  ([`8e33c89`][8e33c89]).

---

## 2024-07-01 — Initial project

### Added

- Project initialised with Create React App and TypeScript ([`18c4bc9`][18c4bc9]).

<!-- Commit links -->

[Unreleased]: https://github.com/3d-omics/database/compare/f901710...main
[ec21142]: https://github.com/3d-omics/database/commit/ec21142d82bde966a7253a9a05d003b367d25e4c
[dc1c51c]: https://github.com/3d-omics/database/commit/dc1c51ccd4d3b2910380b8227ecff8e7622b4dcc
[a520f1a]: https://github.com/3d-omics/database/commit/a520f1a2a1f9763b767b05648eeaecbfa4d4b938
[b6dc7ef]: https://github.com/3d-omics/database/commit/b6dc7efb7f841afa9a2f99fa6e8eb381eab47e0d
[31f8c89]: https://github.com/3d-omics/database/commit/31f8c8906337fd2b1ada3cf70a8956f4a6ab3dcc
[ff34c8f]: https://github.com/3d-omics/database/commit/ff34c8fdac4e30464816e1407037c2ddbbc477ca
[4229c64]: https://github.com/3d-omics/database/commit/4229c64ab78000f2262a30fdc3f536c54db888f5
[c0b8eab]: https://github.com/3d-omics/database/commit/c0b8eab81184c056de1808302e5bacc204d0e1f3
[c548b8e]: https://github.com/3d-omics/database/commit/c548b8e49f5028141d11b93536b368bb10901dce
[b24a103]: https://github.com/3d-omics/database/commit/b24a1030e5cc93ba5c57156d999ccacaee517dbd
[0379fd0]: https://github.com/3d-omics/database/commit/0379fd0dc793587dc90afccc023e479855ca46c7
[22b2349]: https://github.com/3d-omics/database/commit/22b2349d1119b56c2deb24f5bbb0d129cf815a85
[66f4f55]: https://github.com/3d-omics/database/commit/66f4f55154a154cb6edfde6e1e23bb74b1666966
[091cad7]: https://github.com/3d-omics/database/commit/091cad77630c07f90ddc4166a2a2dcf74b372a64
[99ccee4]: https://github.com/3d-omics/database/commit/99ccee40dfc38a438dcf0a4b772fcdcc4671c405
[09d837e]: https://github.com/3d-omics/database/commit/09d837eb8c5999afeca376bec4f528705e193d55
[58e9a45]: https://github.com/3d-omics/database/commit/58e9a45b57c73763bde8f0b3ec35d91953f9e6bb
[8ed6df4]: https://github.com/3d-omics/database/commit/8ed6df42abefde8dbad5f71e0f7989812799c01a
[3d0beea]: https://github.com/3d-omics/database/commit/3d0beea613d28edfa2ca961a78377cb30af0f690
[43b367e]: https://github.com/3d-omics/database/commit/43b367e43047dacca461e7cbf2281c1b4de2b90d
[f901710]: https://github.com/3d-omics/database/commit/f9017109658bfb4feb663a4be12e317bef230d8b
[0189948]: https://github.com/3d-omics/database/commit/01899488ab6c1ae0397290a507f30dc5651854f8
[729310b]: https://github.com/3d-omics/database/commit/729310b2768c70a5375003f6649de641ca41b9ee
[eb72fe9]: https://github.com/3d-omics/database/commit/eb72fe94fc23f8d098557ddb011c3860ba36c1c5
[523393f]: https://github.com/3d-omics/database/commit/523393f31b1c829c64a31b95ab66a5d64edcbc0c
[9ef3be5]: https://github.com/3d-omics/database/commit/9ef3be5df86fa3eefc2b5a83d77517db6ba1976f
[1cfd5f1]: https://github.com/3d-omics/database/commit/1cfd5f179f76187c8e26b51849ab0765bc394dd3
[e423070]: https://github.com/3d-omics/database/commit/e423070a7c39a1453f4ef6b2b9059aaa3f6f3ad8
[c6f670c]: https://github.com/3d-omics/database/commit/c6f670c8d34a98b7a8bc759d5ce69b2b2935417c
[ff2ed9b]: https://github.com/3d-omics/database/commit/ff2ed9bd4bce959a0ab8e5ea062e402230f7e2b3
[d7d4392]: https://github.com/3d-omics/database/commit/d7d43920958ccfcd81ffbd668e966381ed254ffb
[1f67411]: https://github.com/3d-omics/database/commit/1f674112ce224912c27c166e1701751d3164f2f7
[0abd7cd]: https://github.com/3d-omics/database/commit/0abd7cd340338a1a339b4a096e54b9dbe289f80a
[748e8f3]: https://github.com/3d-omics/database/commit/748e8f31dbbc203ebf9b2901bd7260833d046321
[3c30598]: https://github.com/3d-omics/database/commit/3c30598009cb174634460476b2b661433bda199d
[aa4d6a2]: https://github.com/3d-omics/database/commit/aa4d6a279ed66a75d196a3eacd44ec93a9f7cec5
[fe8b35e]: https://github.com/3d-omics/database/commit/fe8b35efd23283e473fa12b9c90c5e8b92e025e4
[a0f59c2]: https://github.com/3d-omics/database/commit/a0f59c2a2fbbc9c1c63b681bbd705ba0a6b2c29e
[4d37bc5]: https://github.com/3d-omics/database/commit/4d37bc55d8741c6271c6efbc82150ed5dca26b22
[0f1d025]: https://github.com/3d-omics/database/commit/0f1d0250b7d2a0f2267498d8994c8a206c1dfc7b
[50d3245]: https://github.com/3d-omics/database/commit/50d3245cc8624b049283c532772f5d910873e12c
[a75ecf3]: https://github.com/3d-omics/database/commit/a75ecf368dacf263381c7e7943f1b30ecdffc9c4
[37bfe42]: https://github.com/3d-omics/database/commit/37bfe42cd6356055f049f0d47c4b13a870b9fa55
[80bc447]: https://github.com/3d-omics/database/commit/80bc44729ed83c7bb2cac3d6e2d777d928fb91ac
[5e7b756]: https://github.com/3d-omics/database/commit/5e7b756d4ead9d23b67ad0b8e5c963026b9e83b3
[cf74c3d]: https://github.com/3d-omics/database/commit/cf74c3dc31f531dc3490b776af6123b3222c0ba1
[65005f6]: https://github.com/3d-omics/database/commit/65005f6078cb29acf4e49059d42357de11e3c76c
[9e79498]: https://github.com/3d-omics/database/commit/9e794981d0a9d118cd9b962521e08a8434ced6da
[4b200d9]: https://github.com/3d-omics/database/commit/4b200d93aa1cb1bdf5a9c5b0dbe47dc518f7fc08
[14d6ed3]: https://github.com/3d-omics/database/commit/14d6ed35065606eec2218a59bc4560deefe92394
[02a1cdb]: https://github.com/3d-omics/database/commit/02a1cdb4875ef6461499e3390d7719bd444fbf38
[5d82eb8]: https://github.com/3d-omics/database/commit/5d82eb8541289b0cf2097d706940c0fafd29374a
[ce143ce]: https://github.com/3d-omics/database/commit/ce143cee0b964f0aae22fb18762c2831b83d4348
[6d66c26]: https://github.com/3d-omics/database/commit/6d66c26e95913291bd7543d85f8ad706a680b2ba
[3e21477]: https://github.com/3d-omics/database/commit/3e2147765077b05b2010c02f8c0f426f27478f9b
[8e33c89]: https://github.com/3d-omics/database/commit/8e33c89e83f51d5a8f337b2e8ecda23cd1887e97
[3fd9396]: https://github.com/3d-omics/database/commit/3fd939644f5db4f66b7f86d7b4918b3e09d226cb
[caa4d58]: https://github.com/3d-omics/database/commit/caa4d587c7233abcf0da66552b8b3694d6fc4ad3
[5d73cde]: https://github.com/3d-omics/database/commit/5d73cde21f3f8f53452ab9a83b1bd4f085ea0bac
[18c4bc9]: https://github.com/3d-omics/database/commit/18c4bc9c9f0c51a1698ec788d52ebe2f73cb59e0
