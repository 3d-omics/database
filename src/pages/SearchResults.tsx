import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import GlobalSearch from 'components/GlobalSearch'
import { loadSearchIndex, searchEntries, type SearchEntry } from 'components/GlobalSearch/searchIndex'
import PageHeader from 'components/PageHeader'

const PAGE_SIZE = 50

const SearchResults = () => {
  const [params] = useSearchParams()
  const query = params.get('q')?.trim() ?? ''
  const [entries, setEntries] = useState<SearchEntry[] | null>(null)
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [shown, setShown] = useState(PAGE_SIZE)

  useEffect(() => {
    let active = true
    if (query) {
      setError(false)
      setEntries(null)
      loadSearchIndex().then((loaded) => {
        if (active) setEntries(loaded)
      }).catch(() => {
        if (active) setError(true)
      })
    }
    return () => { active = false }
  }, [query, attempt])

  useEffect(() => setShown(PAGE_SIZE), [query])
  const matches = useMemo(() => searchEntries(entries ?? [], query), [entries, query])

  return (
    <div className='min-h-[calc(100dvh-var(--navbar-height)-var(--footer-height))]'>
      <PageHeader
        title='Search results'
        breadcrumbs={[{ label: 'Data Portal Home', link: '/' }, { label: 'Search results' }]}
        aside={<GlobalSearch key={query} initialQuery={query} />}
      >
        <p>Search trials, specimens, samples, MAGs and pages across the data portal.</p>
      </PageHeader>
      <main className='page_padding py-10'>
        {!query && <p className='text-ink_muted'>Enter a term in the search box to find records and pages.</p>}
        {query && !entries && !error && <p role='status' className='text-ink_muted'>Loading search results…</p>}
        {error && <div role='alert' className='text-ink_muted'>
          Search results could not be loaded.
          <button type='button' onClick={() => setAttempt((count) => count + 1)} className='ml-2 font-semibold text-burgundy_ink underline'>Try again</button>
        </div>}
        {entries && query && <>
          <p role='status' className='mb-5 text-sm text-ink_muted'>
            {matches.length.toLocaleString('en-US')} {matches.length === 1 ? 'result' : 'results'} for “{query}”
          </p>
          <ul className='max-w-4xl divide-y divide-line rounded-xl border border-line bg-surface'>
            {matches.slice(0, shown).map((entry) =>
              <li key={`${entry.category}:${entry.url}`}>
                <Link to={entry.url} className='block px-5 py-4 hover:bg-surface_subtle focus-visible:bg-surface_subtle'>
                  <span className='block font-jakarta font-semibold text-burgundy_ink'>{entry.title}</span>
                  <span className='mt-1 block text-sm text-ink_muted'>{entry.category}{entry.subtitle && ` · ${entry.subtitle}`}</span>
                </Link>
              </li>
            )}
          </ul>
          {shown < matches.length &&
            <button type='button' onClick={() => setShown((count) => count + PAGE_SIZE)} className='mt-5 rounded-lg border border-line bg-surface px-4 py-2 text-sm font-semibold text-burgundy_ink hover:bg-surface_subtle'>
              Show more results
            </button>
          }
        </>}
      </main>
    </div>
  )
}

export default SearchResults
