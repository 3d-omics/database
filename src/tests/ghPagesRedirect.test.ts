import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { describe, expect, it, vi } from 'vitest'

describe('GitHub Pages deep-link redirect', () => {
  it('keeps query filters and the hash for the SPA router', () => {
    const html = readFileSync('public/404.html', 'utf8')
    const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1]
    expect(script).toBeDefined()

    const setItem = vi.fn()
    const replace = vi.fn()
    runInNewContext(script!, {
      sessionStorage: { setItem },
      window: {
        location: {
          pathname: '/database/animal-specimens',
          search: '?trial=C&treatment=TC1',
          hash: '#table-top',
          replace,
        },
      },
    })

    expect(setItem).toHaveBeenCalledWith(
      'redirectPath',
      '/database/animal-specimens?trial=C&treatment=TC1#table-top',
    )
    expect(replace).toHaveBeenCalledWith('/database/')
  })
})
