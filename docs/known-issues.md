# Assessment and backlog

State of the repository as inherited, August 2026. Last upstream commit: December 2025.
Sole author to date: Anne Lee (34 of 35 commits).

## Overall verdict

The codebase is in **good shape for a handover**. It is consistently structured, uses
current library versions, has genuinely useful test coverage (63 files, 475 tests, all
passing), and the data pipeline is a single readable script rather than scattered glue.
The problems below are mostly about *operational safety* — the ways a routine data
refresh can quietly ship a broken site — plus one large performance issue. None require
a rewrite.

Verified baseline on a clean checkout:

| Check | Result |
|---|---|
| `npm ci` | ✅ |
| `npm run generate-data` | ✅ exits 0 — but see P0-1 |
| `npx vitest run` | ✅ 63 files, 475 tests pass (20 files fail to collect **before** data generation) |
| `npm run build` | ✅ 21 s, `dist/` = 80 MB |
| `npx tsc --noEmit` | ⚠️ not runnable conclusively without a full Airtable fetch (see P2-1) |

---

## P0 — do these first

### P0-1 · `generate-data` reports success after failing

`fetchTableData` swallows Airtable errors and returns `[]`; the script exits `0`.
Stage 3 then rebuilds the **tracked** `public/experiment-hierarchy.json` from those empty
tables. Reproduced with a key lacking access to one base:

| | before | after |
|---|---|---|
| Experiments | 8 | 0 |
| Individuals | 526 | 0 |
| Macrosamples | 1466 | 0 |

CI would deploy this. The "Download Database Schema" feature would serve an empty file.

*Fix:* collect per-table failures, `process.exit(1)` if any table returns zero records,
and skip the hierarchy rewrite unless every input table loaded. A guard comparing new
counts against the previous `_metadata.json` would also catch silent shrinkage.

### P0-2 · CI deploys without running tests or typecheck

[deploy.yml](../.github/workflows/deploy.yml) goes straight from `npm ci` to
`generate-data` to `build`. A broken branch ships.

*Fix:* add `npx tsc --noEmit` and `npx vitest run` steps before `npm run build`, or a
separate PR workflow. Cheap — the suite runs in about 10 seconds.

### P0-3 · `dist/` is not git-ignored

[.gitignore](../.gitignore) ignores `/build`, a Create React App leftover, but Vite emits
to `/dist`. The old README instructed maintainers to run `npm run build` and then
`git add .`, which would commit 80 MB.

*Fix:* one line in `.gitignore`. (The README instruction has been corrected already.)

---

## P1 — user-visible

### P1-1 · 38 MB JavaScript bundle

Every page load pulls a single ~38 MB chunk (5.2 MB gzipped) before first paint, because
all Airtable records, all genome metadata and all 68 microsample count matrices are
static imports — `useJsonData` uses `import.meta.glob(..., { eager: true })`, so the
whole set is bundled even though a page needs one file.

*Fix, in increasing order of effort:*
1. Route-level `React.lazy` — splits Plotly, Chart.js and D3 off the critical path.
2. Drop `eager: true` in [useJsonData](../src/hooks/useJsonData.ts) so count files load
   on demand.
3. Move the bulk JSON to `public/` and `fetch` it, taking it out of the bundle entirely.

### P1-2 · The `/microsample-compositions/:cryosection` route always 404s

[App.tsx](../src/App.tsx#L142) renders `<MicrosampleComposition />` with no props; the
component takes `cryosection` as a **prop** with default `''` and never calls
`useParams`. Validation finds no match, so `ParamsValidator` renders `NotFound`. Nothing
links to the route, so it has presumably never been noticed.

*Fix:* read the param inside the component (`const { cryosection } = useParams()`,
falling back to the prop so the `CryosectionOverview` tab keeps working), or delete the
route. Also add its branch to `getTitle` in `App.tsx` if it is kept.

### P1-3 · Metabolomics workbooks are read by sheet index

[useMetaboliteExcelFileData](../src/hooks/useMetaboliteExcelFileData.ts) hard-codes sheet
indices 1, 3 and 4. Anyone re-exporting a workbook with sheets in a different order
breaks the volcano and heatmap pages with a runtime error, not a build failure.

*Fix:* look sheets up by name, with a clear error listing the sheet names found.

---

## P2 — maintainability

### P2-1 · Typechecking is not enforced and not reproducible without data

`npm run build` uses esbuild, which transpiles without typechecking; there is no
`typecheck` script and no CI step. Worse, `tsc` results depend on generated JSON: with
data absent you get ~40 "cannot find module" errors, and with *empty* generated arrays
you get 76 `Property … does not exist on type 'never'` errors, because TypeScript infers
`never[]` from `[]`. All 76 are artefacts of the empty fixtures, not real defects.

*Fix:* declare explicit interfaces for the Airtable JSON imports (or a
`src/@types/airtable-data.d.ts` module declaration) so types no longer depend on fetched
content, then add `"typecheck": "tsc --noEmit"` to `package.json` and to CI.

### P2-2 · No linter despite the config

`package.json` declares an `eslintConfig` block extending `react-app` and lists
`eslint-config-react-app` as a dev dependency, but there is no `lint` script, no
`.eslintrc`, and no flat config. ESLint is present in `node_modules` only transitively.

*Fix:* either add a real ESLint 9 flat config plus `"lint": "eslint src"`, or remove the
vestigial `eslintConfig` block so it stops implying coverage that does not exist.

### P2-3 · Two component pairs share names

`components/TabComponents/MacrosampleTab.tsx` and
`pages/Genome/components/MacrosampleTab.tsx` are unrelated components with the same
name; likewise for `MicrosampleTab`. Easy to edit the wrong one.

*Fix:* rename the Genome-local ones (e.g. `GenomeMacrosampleTab`).

### P2-4 · Repetitive title logic

`getTitle` in [App.tsx](../src/App.tsx) is an eleven-deep nested `if/else` of path
regexes, and it is missing a case for `/microsample-compositions`.

*Fix:* a flat array of `[pattern, formatter]` pairs, or set the title per page.

### P2-5 · Hard-coded per-experiment data in `src/config/`

[macrosampleWithMetaboliteData.ts](../src/config/macrosampleWithMetaboliteData.ts) is a
723-line literal array of macrosample IDs, and
[metaboliteOptions.ts](../src/config/metaboliteOptions.ts) hard-codes treatment labels
per experiment letter. Both must be hand-edited when data changes and will silently drift
out of sync with Airtable.

*Fix:* derive the ID list during `generate-data` from the workbooks or Airtable; move
treatment labels into an Airtable table or a committed CSV.

### P2-6 · Repository weight

`.git` is 112 MB, the working tree 47 MB, largely because 33 MB of XLSX workbooks and
9 MB of JPEGs are versioned — and a workbook rewrite adds a whole new copy each time.

*Fix (only if it becomes painful):* Git LFS for `*.xlsx` and the cryosection images.
History rewriting is disruptive; consider it a deliberate one-off, not routine work.

### P2-7 · Small cleanups

- `src/components/LoadingRemainingData.tsx` is imported nowhere.
- `.env.test.locald` in `.gitignore` is a typo for `.env.test.local`; `.env` is listed twice.
- No `.env.example` to tell a new maintainer which variable is needed.
- `src/.DS_Store` and `./.DS_Store` exist on disk (untracked, and ignored — harmless).
- `README.md` previously claimed 83 microsample count files; there are 68.

---

## Suggested order of work

1. P0-1, P0-2, P0-3 — one short PR each; together they make data refreshes safe.
2. P1-2 and P1-3 — small, self-contained correctness fixes with tests.
3. P1-1 route-level code splitting — the single biggest user-facing improvement.
4. P2-1 and P2-2 — establish the quality gate before larger refactors.
5. The rest opportunistically.
