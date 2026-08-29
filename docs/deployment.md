# Deployment

## How it works

[.github/workflows/deploy.yml](../.github/workflows/deploy.yml) runs on every push to
`main` (and on manual `workflow_dispatch`):

1. `actions/checkout@v4`
2. `actions/setup-node@v4` — Node 20, npm cache
3. `actions/setup-python@v5` — Python 3.12, for the renderer
4. `npm ci`
5. Read `builder` and `data_version` out of [catalog.json](../catalog.json)
6. Download `builder_wheel`, check it against `builder_sha256`, `pip install --no-deps --no-index`
7. `npm run fetch-catalog` — download the pinned release, verify its SHA-256
8. `3domics-db-build render .catalog/3domics.sqlite --into .`
9. `npm run build`
10. `actions/upload-pages-artifact@v3` on `dist/`, then `actions/deploy-pages@v4`

**No Airtable credentials are involved** — those live in `database-build`, and step 7
reads an open-access Zenodo record over anonymous HTTPS.

Step 6 used to clone `3d-omics/database-build` directly, which cannot work: the repository
is **private**, and the workflow's `GITHUB_TOKEN` is scoped to this repository alone. It
succeeded on a maintainer's laptop only because the local git credential helper supplied a
personal token.

It now installs a **checksummed wheel** instead, pinned in `catalog.json` exactly the way
the catalogue is — a URL plus a SHA-256. The builder is pure stdlib with no dependencies,
so `pip` never contacts an index and resolves nothing; the wheel is 48 KB and installs
offline.

The builder has its own Zenodo record, deposited as **software** rather than as a fourth
asset on the catalogue's dataset record: they are different things, the site pins them
independently, and a published Zenodo record is immutable, so adding a file to the
catalogue's record would mean a new version DOI and a repin of the data.

| | |
|---|---|
| Builder concept DOI | [10.5281/zenodo.22159536](https://doi.org/10.5281/zenodo.22159536) |
| Installed here | 0.1.0 — [10.5281/zenodo.22159537](https://doi.org/10.5281/zenodo.22159537) |

To move to a new builder, release it from `database-build`
(`scripts/release_builder_wheel.py`, see its `RELEASING.md`), then set `builder`,
`builder_wheel` and `builder_sha256` here. Take the checksum from the record's `.sha256`
asset: a wheel is **not** byte-reproducible — zip entry timestamps differ between builds —
so a local rebuild of the same tag hashes differently from the deposited file.

Because the data is pinned rather than fetched, **an empty commit no longer changes what
deploys** — rebuilding any commit reproduces that commit's site. To publish new data,
bump `catalog.json`:

```bash
# after a new data release exists in 3d-omics/database-build
$EDITOR catalog.json     # data_version, sha256, source
git commit -am "Pin catalogue 2026.09.15" && git push
```

## What CI does not do

The workflow runs **no tests and no typecheck**. A branch with failing tests or type
errors deploys to production just as readily as a green one. Until that changes, running
`npx vitest run` and `npx tsc --noEmit` locally is the only gate — see
[AGENTS.md §7](../AGENTS.md).

It no longer needs to detect a bad data fetch, though. `fetch-catalog` fails the job on
a checksum mismatch or a missing release, and the row-floor and previous-release checks
that used to be absent now run in `database-build` before a release exists at all. See
[data-pipeline.md](data-pipeline.md#failure-modes-to-watch-for).

## The `/database/` base path

The site is served from a sub-path, which is threaded through four places. All four must
agree:

| Place | Value |
|---|---|
| [vite.config.js](../vite.config.js) | `base: '/database/'` |
| [src/main.tsx](../src/main.tsx) | `<BrowserRouter basename='/database/'>` |
| [public/404.html](../public/404.html) | `window.location.replace('/database/')` |
| [DownloadDatabaseSchema.tsx](../src/pages/DownloadDatabaseSchema.tsx) | `link.href = '/database/experiment-hierarchy.json'` |

## Deep links on GitHub Pages

GitHub Pages serves static files and knows nothing about client-side routes, so a
direct hit on `/database/animal-trials` would 404. The workaround:

1. Pages serves [public/404.html](../public/404.html) for the unknown path.
2. That page stores the requested pathname in `sessionStorage.redirectPath` and
   redirects to `/database/`.
3. `RedirectHandler` in [src/main.tsx](../src/main.tsx) reads the value on mount, strips
   the `/database/` prefix, and calls `navigate(path, { replace: true })`. It renders a
   spinner instead of the app while doing so, to avoid a flash of the home page.

If deep links start showing the home page or flashing, this is the mechanism to inspect.

## Local verification of a production build

```bash
npm run build && npm run preview
```

`preview` honours the `/database/` base, so the local URL includes it. Note that
`npm run dev` also serves under `/database/`.

## Build output

`dist/` is roughly 80 MB: a single ~17 MB JS chunk (3.8 MB gzipped), 33 MB of XLSX
workbooks, 9 MB of cryosection JPEGs, and the hierarchy JSON. This is within
GitHub Pages' 1 GB site limit but is a poor experience for visitors — see
[known-issues.md](known-issues.md).

`dist/` is git-ignored, alongside the CRA leftover `/build`.
