export type SearchEntry = {
  category: string
  title: string
  url: string
  subtitle: string
  keywords: string
}

let cachedEntries: SearchEntry[] | null = null
let pendingRequest: Promise<SearchEntry[]> | null = null

// The index is a separate static asset, so visitors only download it when they search.
export function loadSearchIndex(): Promise<SearchEntry[]> {
  if (cachedEntries) return Promise.resolve(cachedEntries)
  if (!pendingRequest) {
    pendingRequest = fetch(`${import.meta.env.BASE_URL}search-index.json`, { cache: 'no-cache' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Search index could not be loaded')
        const data = await response.json()
        if (!Array.isArray(data.entries)) throw new Error('Invalid search index')
        cachedEntries = data.entries as SearchEntry[]
        return cachedEntries
      })
      .catch((error) => {
        pendingRequest = null
        throw error
      })
  }
  return pendingRequest
}

const normalize = (text: string) => text.toLowerCase().normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()

export function searchEntries(entries: SearchEntry[], query: string): SearchEntry[] {
  const needle = normalize(query)
  if (!needle) return []
  const words = needle.split(' ')

  return entries.map((entry, order) => {
    const title = normalize(entry.title)
    const keywords = normalize(entry.keywords)
    const subtitle = normalize(entry.subtitle)
    const combined = `${title} ${keywords} ${subtitle}`
    if (!words.every((word) => combined.includes(word))) return null

    const score = title === needle ? 0
      : title.startsWith(needle) ? 1
        : keywords.split(' ').includes(needle) ? 2
          : title.includes(needle) ? 3
            : words.every((word) => title.includes(word)) ? 4
              : 5
    return { entry, score, order }
  }).filter((hit): hit is { entry: SearchEntry, score: number, order: number } => hit !== null)
    .sort((a, b) => a.score - b.score || a.order - b.order)
    .map(({ entry }) => entry)
}
