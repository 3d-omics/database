import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { loadSearchIndex, searchEntries, type SearchEntry } from './searchIndex'

const GlobalSearch = ({ initialQuery = '' }: { initialQuery?: string }) => {
  const navigate = useNavigate()
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)
  const [query, setQuery] = useState(initialQuery)
  const [entries, setEntries] = useState<SearchEntry[] | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [open, setOpen] = useState(false)

  const ensureIndex = () => {
    if (entries || status === 'loading') return
    setStatus('loading')
    loadSearchIndex().then((loaded) => {
      setEntries(loaded)
      setStatus('idle')
    }).catch(() => setStatus('error'))
  }

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [])

  const matches = useMemo(() => searchEntries(entries ?? [], query), [entries, query])
  const showSuggestions = open && Boolean(query.trim())

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const term = query.trim()
    if (!term) return
    setOpen(false)
    navigate(`/search?${new URLSearchParams({ q: term })}`)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      inputRef.current?.focus()
      setOpen(false)
      return
    }
    if (event.key === 'ArrowDown' && showSuggestions && matches.length > 0 && event.target instanceof HTMLInputElement) {
      event.preventDefault()
      firstLinkRef.current?.focus()
    }
  }

  return (
    <div ref={rootRef} onKeyDown={onKeyDown} className='relative z-30 w-full max-w-[26rem] text-ink'>
      <form role='search' aria-label='Search the data portal' onSubmit={submit}>
        <div className='relative flex items-center rounded-xl border border-line bg-surface shadow-lg shadow-black/15 focus-within:ring-2 focus-within:ring-light_mustard'>
          <FontAwesomeIcon icon={faMagnifyingGlass} aria-hidden='true' className='absolute left-4 text-burgundy_ink' />
          <input
            ref={inputRef}
            type='search'
            aria-label='Search the data portal'
            aria-controls={showSuggestions ? listId : undefined}
            aria-expanded={showSuggestions}
            autoComplete='off'
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setOpen(true)
              ensureIndex()
            }}
            onFocus={() => {
              setOpen(true)
              ensureIndex()
            }}
            placeholder='Search the data portal'
            className='w-full min-w-0 rounded-xl bg-transparent py-3 pl-11 pr-20 text-sm text-ink placeholder:text-ink_muted outline-none'
          />
          <button type='submit' className='absolute right-1.5 rounded-lg bg-burgundy px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-burgundy_ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light_mustard'>
            Search
          </button>
        </div>
      </form>

      {showSuggestions &&
        <div id={listId} className='absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-xl border border-line bg-surface text-ink shadow-xl shadow-black/20'>
          {status === 'loading' && <p role='status' className='px-4 py-3 text-sm text-ink_muted'>Loading search…</p>}
          {status === 'error' && <p role='alert' className='px-4 py-3 text-sm text-ink_muted'>Search is unavailable. Focus the box to retry.</p>}
          {entries && matches.length === 0 && <p role='status' className='px-4 py-3 text-sm text-ink_muted'>No matches found.</p>}
          {matches.length > 0 &&
            <>
              <ul aria-label='Search suggestions' className='max-h-80 overflow-y-auto py-1'>
                {matches.slice(0, 6).map((entry, index) =>
                  <li key={`${entry.category}:${entry.url}`}>
                    <Link
                      ref={index === 0 ? firstLinkRef : undefined}
                      to={entry.url}
                      onClick={() => setOpen(false)}
                      className='block px-4 py-2 text-sm hover:bg-surface_subtle focus-visible:bg-surface_subtle focus-visible:outline-none'
                    >
                      <span className='block truncate font-semibold text-burgundy_ink'>{entry.title}</span>
                      <span className='block truncate text-xs text-ink_muted'>{entry.category}{entry.subtitle && ` · ${entry.subtitle}`}</span>
                    </Link>
                  </li>
                )}
              </ul>
              <Link
                to={`/search?${new URLSearchParams({ q: query.trim() })}`}
                onClick={() => setOpen(false)}
                className='block border-t border-line px-4 py-2.5 text-sm font-semibold text-burgundy_ink hover:bg-surface_subtle focus-visible:bg-surface_subtle'
              >
                View all {matches.length.toLocaleString('en-US')} results
              </Link>
            </>
          }
        </div>
      }
    </div>
  )
}

export default GlobalSearch
