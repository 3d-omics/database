# Architecture

## Rendering model

A client-rendered React SPA. There is no server, no API and no database at runtime.

```
Airtable (3 bases)  ─┐
CSV files (committed)├─►  npm run generate-data  ─►  JSON in src/assets/data/**  ─┐
                     │                                                            ├─► npm run build ─► dist/ ─► GitHub Pages
XLSX files (committed)─────────────────────────────────────────────────────────────┘
                                                     (XLSX + experiment-hierarchy.json
                                                      are fetched by the browser at runtime;
                                                      everything else is inlined in the JS bundle)
```

Two things are *not* inlined and are fetched over HTTP by the running page:

- the six metabolomics `.xlsx` workbooks, via `fetch()` in
  [useMetaboliteExcelFileData](../src/hooks/useMetaboliteExcelFileData.ts), parsed
  client-side with SheetJS;
- `public/experiment-hierarchy.json`, offered as a download by the
  [Download Database Schema](../src/pages/DownloadDatabaseSchema.tsx) page.

Everything else — Airtable records, genome metadata, count matrices — is a static
`import` and therefore lands in the JS bundle. See
[known-issues.md](known-issues.md) for the size consequences.

## Entry points

- [src/main.tsx](../src/main.tsx) — mounts `BrowserRouter` with `basename='/database/'`
  and wraps the app in `RedirectHandler`, which consumes the `redirectPath` written by
  [public/404.html](../public/404.html). See [deployment.md](deployment.md).
- [src/App.tsx](../src/App.tsx) — the route table, plus a `getTitle` function that derives
  `document.title` from the pathname through a chain of regex matches. Every new route
  needs a branch there too.

## Routes

| Path | Component | Data it reads |
|---|---|---|
| `/` | `pages/Home` | `_metadata.json`, `animaltrialexperiment.json` |
| `/animal-trials` | `pages/AnimalTrials` | `animaltrialexperiment.json` |
| `/animal-trials/:experimentName` | `pages/AnimalTrialOverview` | `animaltrialexperiment.json` + all four tab components |
| `/animal-specimens` | `pages/AnimalSpecimens` | `animalspecimen.json`, `animaltrialexperiment.json` |
| `/animal-specimens/:specimenName` | `pages/AnimalSpecimenOverview` | `animalspecimen.json` |
| `/macrosamples` | `pages/Macrosamples` | `intestinalsectionsample.json`, `animalspecimen.json`, metabolomics XLSX |
| `/macrosamples/:macrosampleName` | `pages/MacrosampleOverview` | `intestinalsectionsample.json` |
| `/cryosections` | `pages/Cryosections` | `cryosection.json`, `cryosectionimage.json` |
| `/cryosections/:cryosectionName` | `pages/CryosectionOverview` | `cryosection.json`, `cryosectionimage.json` |
| `/microsamples` | `pages/Microsamples` | `microsample.json`, `cryosection.json` |
| `/mag-catalogues` | `pages/MAGCatalogueList` | `animaltrialexperiment.json`, `experimentswithgenomeinfo.json` |
| `/mag-catalogues/:experimentName` | `pages/MAGCatalogue` | same + `genome_metadata_json/` |
| `/mag-catalogues/:experimentName/:genomeName` | `pages/Genome` | `macrosample.json`, `microsampleswithcoordination.json`, all count JSON |
| `/macrosample-compositions` | `pages/MacrosampleCompositionList` | `animaltrialexperiment.json` |
| `/macrosample-compositions/:experimentName` | `pages/MacrosampleComposition` | `genome_metadata_json/`, `macro_genome_counts_json/` |
| `/metabolomics` | `pages/MetabolomicsList` | `experimentswithgenomeinfo.json` |
| `/metabolomics/volcano/:experimentName` | `pages/MetabolomicsVolcano` | metabolomics XLSX |
| `/metabolomics/heatmap/:experimentName` | `pages/MetabolomicsHeatmap` | metabolomics XLSX |
| `/microsample-compositions/:cryosection` | `pages/MicrosampleComposition` | **dead route** — see [known-issues.md](known-issues.md) |
| `/database-schema` | `pages/DownloadDatabaseSchema` | `public/experiment-hierarchy.json` |
| `*` | `pages/NotFound` | — |

The `MicrosampleComposition` component *is* used, but as an embedded tab inside
`CryosectionOverview`, not through its own route.

## The two page shapes

Simple list pages are a single file (`pages/AnimalTrials.tsx`). Pages with their own
charts or sub-tables are a folder with `index.tsx`, `components/` and sometimes `utils/`
(`pages/MAGCatalogue/`, `pages/Genome/`, `pages/MetabolomicsVolcano/`). Both are current
convention; choose by complexity.

## Shared components

| Component | Role |
|---|---|
| `components/TableView` | Page-level wrapper: heading + `Table` |
| `components/Table` | TanStack Table v8 host — sorting, global + column filters, pagination (100/page), TSV export. Sub-parts live in `Table/components/` |
| `components/Tabs` | Tab strip used by all the `*Overview` pages |
| `components/TabComponents/*` | Thin wrappers that embed a filtered list page as a tab (e.g. all macrosamples whose ID starts with a specimen ID) |
| `components/ParamsValidator` | Renders `Loading`, `NotFound`, or children, driven by `useValidateParams` |
| `components/BreadCrumbs`, `Navbar`, `Footer`, `SocialIcons` | Chrome |
| `components/ErrorBanner` | Inline error surface for failed data loads |
| `components/TaxonomyChartLegend` | Shared legend for both composition charts |

## Hooks

| Hook | Purpose |
|---|---|
| `useValidateParams` | Looks a URL parameter up in the relevant Airtable JSON and reports `notFound`. This is how deep links are validated without a server. |
| `useJsonData` | `useGenomeJsonFile(folder, name)` and `useAllMicrosampleCounts()` — resolve generated JSON via `import.meta.glob(..., { eager: true })`. Eager globbing is why all 76 microsample count files enter the bundle. |
| `useTaxonomyData` | Normalises a counts matrix to relative abundance per sample and aligns genome order with the metadata file. |
| `useTaxonomyChart` | Builds the Chart.js dataset/options for stacked composition charts. |
| `useMetaboliteExcelFileData` | Fetches and parses a metabolomics workbook. **Reads sheets by numeric index** — 1 = Sample Metadata, 3 = Reordered Abundances, 4 = Normalized Abundances. Reordering sheets in the source workbook silently breaks the page. |

## Configuration

- [catalog.json](../catalog.json) — the data pin: which catalogue release the site
  builds against (`data_version`, `schema_version`, `sha256`, `source`) and which
  `database-build` tag renders it (`builder`). The base/table/view IDs that used to live
  in `src/config/airtable.ts` moved to the builder along with the credentials.
- [src/config/taxonomy-color-scheme.ts](../src/config/taxonomy-color-scheme.ts) — nested
  domain→phylum→class→order colour tree, flattened by `utils/chartUtils.ts`.
- [src/config/metaboliteOptions.ts](../src/config/metaboliteOptions.ts) — per-experiment
  human-readable labels for treatment and timepoint codes. Hard-coded per experiment
  letter; a new metabolomics experiment needs a new `case`.
- [src/config/macrosampleWithMetaboliteData.ts](../src/config/macrosampleWithMetaboliteData.ts)
  — a hard-coded list of ~700 macrosample IDs known to have metabolite data, used to
  decide which rows link out to metabolomics views.

## Styling

Tailwind 3 with daisyUI and `tailwind-hamburgers`. Component shortcuts and the two
Google Font imports are in [src/index.css](../src/index.css); brand colours, clip-path
utilities and custom font sizes in [tailwind.config.js](../tailwind.config.js);
Plotly/Circos overrides and the CSS custom properties `--navbar-height` /
`--footer-height` in [src/App.css](../src/App.css).

## Testing

Vitest with the jsdom environment, configured inside
[vite.config.js](../vite.config.js) rather than a separate `vitest.config`.
[src/tests/vitest.setup.ts](../src/tests/vitest.setup.ts) stubs `URL.createObjectURL`,
`Blob`, `HTMLCanvasElement.getContext` and `ResizeObserver` — without these, Plotly and
Chart.js components cannot mount and the TSV download tests cannot run.

Tests exercise component logic against mocked data, not real record contents, so they
stay green when Airtable changes. They are **not** a check on data correctness.
