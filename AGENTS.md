# AGENTS.md

Operating guide for anyone — human or AI agent — working on the **3D'omics Data Portal**.
Read this before touching the repo. Deeper detail lives in [docs/](docs/).

---

## 1. What this repository is

A **static, single-page React site** that publishes the data catalogue of the
[3D'omics](https://3domics.eu) EU project: animal trials, specimens, intestinal
macrosamples, cryosections, laser-microdissected microsamples, metagenome-assembled
genome (MAG) catalogues, community composition charts and metabolomics analyses.

Key property: **there is no backend and no runtime API.** Everything the site shows is
baked into the bundle at build time from two sources — a **pinned catalogue release**
(`3domics-<YYYY.MM.DD>.sqlite`, built by
[3d-omics/database-build](https://github.com/3d-omics/database-build)) and committed
Excel workbooks. The site is deployed to GitHub Pages under the path `/database/`.

**This repo holds no Airtable credentials and does not talk to Airtable.**
[catalog.json](catalog.json) pins which catalogue release a commit builds against, so
rebuilding an old commit reproduces that commit's site rather than today's records.

- Repo: `3d-omics/database` · Deployed under `…/database/`
- Stack: Vite 6 · React 18 · TypeScript 5 · Tailwind 3 + daisyUI · React Router 6
- Tables: TanStack Table v8 · Charts: Chart.js, Plotly, D3 · Excel: SheetJS (`xlsx`)
- Tests: Vitest + React Testing Library — **63 test files, 475 tests, all passing**

---

## 2. The golden rule: render the data before anything else

Everything the app imports from `src/assets/data/` and `public/experiment-hierarchy.json`
is **git-ignored and absent from a fresh clone**, yet 27 source files import it
statically. Without it, `npm run dev`, `npm run build`, `npm run test` and `tsc` all fail
with `Cannot find module 'assets/data/airtable/…'`.

```bash
npm ci
pip install "git+https://github.com/3d-omics/database-build.git@$(node -p "require('./catalog.json').builder")"
npm run generate-data        # downloads the pinned catalogue, verifies it, renders it
```

`generate-data` is now two steps: `fetch-catalog` downloads the Zenodo deposit named in
`catalog.json` into `.catalog/` and checks its SHA-256, then `3domics-db-build render`
writes the JSON tree. No token, and no partial-success path — a checksum mismatch or a
missing release exits non-zero.

Set `CATALOG_FILE=/path/to/local.sqlite` to render a catalogue you built yourself. The
pin is not enforced in that mode and the script says so; do not commit anything produced
that way.

**The builder and the catalogue must be in step.** `render` reads the catalogue through
the *installed builder's* bundled mapping. A builder that expects a column the pinned
catalogue lacks will fail, which is why `catalog.json` pins both versions.

---

## 3. Commands

| Task | Command | Notes |
|---|---|---|
| Install | `npm ci` | |
| Render all data | `npm run generate-data` | Needs the builder on `PATH`. Run after a `catalog.json` bump. |
| Download the catalogue only | `npm run fetch-catalog` | Verifies SHA-256 against the pin. |
| Dev server | `npm run dev` | http://localhost:5173 |
| Tests | `npm run test` | Watch mode. Use `npx vitest run` for a single pass. |
| Single test file | `npx vitest run src/pages/Home.test.tsx` | |
| Production build | `npm run build` | Output → `dist/` (~80 MB, see §6.2) |
| Preview build | `npm run preview` | |
| Typecheck | `npx tsc --noEmit` | **Not wired into any npm script or CI.** Run it manually. |
| Lint | *(none)* | `eslint-config-react-app` is declared but there is no lint script or config file. |

`npm run build` uses Vite/esbuild, which **transpiles without typechecking**. A build
passing tells you nothing about type errors. Always run `npx tsc --noEmit` yourself.

---

## 4. Repository map

```
src/
  App.tsx                  Route table + document.title logic
  main.tsx                 BrowserRouter (basename '/database/') + GH Pages redirect handler
  pages/                   One folder or file per route (see docs/architecture.md)
  components/              Shared UI: Table, TableView, Tabs, Navbar, Footer, BreadCrumbs, …
  hooks/                   useValidateParams, useJsonData, useTaxonomyData, useTaxonomyChart,
                           useMetaboliteExcelFileData
  config/                  Taxonomy colours, metabolite labels
  scripts/fetch-catalog.ts Downloads the pinned catalogue and verifies its checksum
  utils/chartUtils.ts      Chart.js helpers
  assets/data/             Rendered CSV/JSON (git-ignored) + metabolomics XLSX (committed)
  assets/images/           Logos, animal silhouettes, 90 cryosection photos (9 MB)
public/
  experiment-hierarchy.json  Rendered from the catalogue; git-ignored
  404.html                   SPA deep-link redirect shim for GitHub Pages
catalog.json                 THE PIN: data_version, schema_version, sha256, source (Zenodo), DOIs, builder
.catalog/                    Downloaded catalogue (git-ignored)
.github/workflows/deploy.yml Fetch + render + build + deploy on push to main
```

**Conventions in use — follow them:**

- A page is either `pages/Name.tsx` (simple) or `pages/Name/index.tsx` with sibling
  `components/` and `utils/` folders (complex). Both patterns are current; pick by size.
- Tests are **colocated** and named `<Thing>.test.tsx` next to the thing they test.
- Imports use path aliases, never deep relative paths: `components/…`, `pages/…`,
  `hooks/…`, `config/…`, `utils/…`, `assets/…`. Aliases are declared **twice** — in
  [vite.config.js](vite.config.js) `resolve.alias` and in [tsconfig.json](tsconfig.json)
  via `baseUrl: "src"`. Adding a new alias means editing both.
- Styling is Tailwind utility classes plus a handful of `@layer components` shortcuts
  (`page_padding`, `main_header`, `page_description`, `link`, `pagination_btn`) defined in
  [src/index.css](src/index.css). Brand colours (`burgundy`, `mustard`, `custom_black`) are
  in [tailwind.config.js](tailwind.config.js). Use the shortcuts rather than re-deriving them.
- Tabular pages funnel through `components/TableView` → `components/Table`, which supplies
  sorting, filtering, pagination and TSV download for free. Define `ColumnDef[]` in a
  `useMemo` and hand it over; do not hand-roll a `<table>`.

---

## 5. How to make the common changes

**Add a column to an existing table page** — add a `ColumnDef` entry in that page's
`useMemo`. Use `meta.filterVariant: 'select'` with `meta.uniqueValues` for enum columns;
`enableColumnFilter: false` / `enableSorting: false` to opt out.

**Add a new page** — create `pages/YourPage/index.tsx`, register the route in
[src/App.tsx](src/App.tsx), add the title branch in the same file's `getTitle` chain, add
a menu entry in [src/components/Navbar/MenuItems.ts](src/components/Navbar/MenuItems.ts),
and write `pages/YourPage/YourPage.test.tsx`.

**Add a table, or a column the site needs** — none of this lives here any more. Edit the
column lists in `database-build`'s `scripts/build_mapping.py`, regenerate the mapping,
cut a data release, then bump `catalog.json`. Adding a column is a deliberate act: the
catalogue carries 73 of Airtable's 496 columns.

**Add a new experiment's genome data** — attach the CSVs to the Airtable Experiment or
Cryosection record and cut a data release; the CSV folders here are rendered output, not
inputs. Metabolomics is still a hand-committed XLSX in `src/assets/data/metabolomics/`,
because the catalogue passes those workbooks through rather than parsing them. XLSX files must
additionally be wired into the static import map in
[src/hooks/useMetaboliteExcelFileData.ts](src/hooks/useMetaboliteExcelFileData.ts) —
they are not auto-discovered. Details in [docs/data-pipeline.md](docs/data-pipeline.md).

---

## 6. Gotchas — all verified in this repo, not hypothetical

### 6.1 The silent-empty-data failure — fixed by the catalogue, worth knowing

**Historical, and the reason this repo no longer fetches Airtable.** The old
`generate-data` caught Airtable errors, logged them, returned an empty array and exited
`0`. A partial failure produced empty tables *and* rewrote the then-tracked
`public/experiment-hierarchy.json` from real content down to an empty shell. CI deployed
that without complaint.

Observed with a key that lacked access to one base:

| | expected | after partial-failure run |
|---|---|---|
| Experiments | 8 | **0** |
| Individuals | 526 | **0** |
| Macrosamples | 1466 | **0** |

Five of the nine record dumps were sitting at zero records when the migration landed.
Three things now make that unreachable: the builder enforces per-table row floors and
`--compare-to` against the previous release, `fetch-catalog` verifies a SHA-256, and
`render` writes from a fixed artefact rather than a live API.

The visible effect of the fix: `npx tsc --noEmit` went from **77 errors to 4**, because
the empty arrays had been typed as `never[]` and were masking every field access on them.

### 6.2 `dist/` — fixed

[.gitignore](.gitignore) ignored `/build` (a leftover from Create React App) but not
`/dist`, where Vite actually writes, so a `git add .` after a local build staged **80 MB**
of output. `/dist` is now ignored alongside `/build`.

### 6.3 The bundle is enormous

Because all data is statically imported, the production bundle is a **single 38 MB JS
chunk (5.2 MB gzipped)**, plus 33 MB of XLSX and 9 MB of JPEG. Every visitor downloads
the whole catalogue before the first paint. Any change that adds a static
`import … from 'assets/data/…'` makes this worse. Prefer `fetch` from `public/` for new
bulk data.

### 6.4 The `/microsample-compositions/:cryosection` route is dead

[src/App.tsx](src/App.tsx#L142) renders `<MicrosampleComposition />` with no props, but
the component reads `cryosection` from **props**, not `useParams`, defaulting to `''`.
Validation then finds no match and the page renders `NotFound`. The working path is the
tab embedded in [CryosectionOverview](src/pages/CryosectionOverview.tsx#L95). Fix by
calling `useParams` in the component, or delete the route.

### 6.5 Two different `MacrosampleTab` / `MicrosampleTab` components exist

`src/components/TabComponents/*` are thin wrappers that re-render whole list pages
filtered by ID. `src/pages/Genome/components/*` are unrelated components with the same
names. Check the import path before editing.

### 6.6 Dead code

`src/components/LoadingRemainingData.tsx` is imported nowhere.

### 6.7 Four known type errors, all latent app bugs the real data exposed

They were invisible while the dumps were empty. None breaks the build — Vite transpiles
without typechecking — but each is a genuine defect:

| Location | Error |
|---|---|
| [MacrosampleOverview.tsx:88](src/pages/MacrosampleOverview.tsx#L88) | reads `fields.Weight`, which does not exist on the macrosample table — renders blank. Same class as `Group` in `Macrosamples/index.tsx`. |
| [MacrosampleOverview.tsx:92](src/pages/MacrosampleOverview.tsx#L92) | `fields['ENA link']` is `string \| undefined`, passed to `<Link to>` unguarded. |
| [MAGCatalogue/index.tsx:301](src/pages/MAGCatalogue/index.tsx#L301) | reads `'MAG catalogue description'`. **This one is a mapping gap, not an app bug** — the field exists in Airtable (`tblIv5AygbJtitB14`) but the catalogue does not carry it, so the description renders blank. Fix in `database-build`. |
| [MicrosampleComposition/index.tsx:38](src/pages/MicrosampleComposition/index.tsx#L38) | `MicrosampleRecord` declares `size: number`; the data has `number[]`. |

---

## 7. Before you commit

```bash
npx tsc --noEmit          # 4 known errors (§6.7); no new ones
npx vitest run            # 63 files / 475 tests must pass
npm run build             # must succeed
git status                # both dist/ and the rendered data are git-ignored
```

- CI (`.github/workflows/deploy.yml`) **does not run tests or typecheck** — it fetches
  the pinned catalogue, renders it, and builds. A red test suite still deploys. You are
  the gate.
- Pushing to `main` deploys to production immediately. Work on a branch.
- Never hand-edit anything under `src/assets/data/` except `metabolomics/`, nor
  `public/experiment-hierarchy.json` — everything else there is rendered output.
- Commit messages: this repo has no `Co-Authored-By` trailers. Keep it that way.

---

## 8. Further reading

- [docs/architecture.md](docs/architecture.md) — routes, page-to-data map, shared components
- [docs/data-pipeline.md](docs/data-pipeline.md) — the catalogue pin, rendering, the hierarchy file, ID conventions
- [docs/deployment.md](docs/deployment.md) — GitHub Pages, base path, the 404 redirect trick
- [docs/known-issues.md](docs/known-issues.md) — assessed findings and a prioritised backlog
