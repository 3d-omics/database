import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import ThemeProvider from './index'
import useTheme from 'hooks/useTheme'

type MediaQueryController = {
  query: MediaQueryList
  change: (matches: boolean) => void
}

function createMediaQuery(matches: boolean): MediaQueryController {
  const listeners = new Set<(event: MediaQueryListEvent) => void>()
  const query = {
    matches,
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addEventListener: vi.fn((type: string, listener: EventListenerOrEventListenerObject) => {
      if (type === 'change' && typeof listener === 'function') {
        listeners.add(listener as (event: MediaQueryListEvent) => void)
      }
    }),
    removeEventListener: vi.fn((type: string, listener: EventListenerOrEventListenerObject) => {
      if (type === 'change' && typeof listener === 'function') {
        listeners.delete(listener as (event: MediaQueryListEvent) => void)
      }
    }),
    dispatchEvent: vi.fn(),
  } as unknown as MediaQueryList

  return {
    query,
    change: (nextMatches) => {
      Object.defineProperty(query, 'matches', { configurable: true, value: nextMatches })
      listeners.forEach((listener) => listener({ matches: nextMatches } as MediaQueryListEvent))
    },
  }
}

function ThemeState() {
  const { preference, resolved } = useTheme()
  return <output>{`${preference}/${resolved}`}</output>
}

describe('ThemeProvider', () => {
  const originalMatchMedia = window.matchMedia
  const originalStorage = window.localStorage

  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  afterEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: originalMatchMedia,
    })
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: originalStorage,
    })
    document.documentElement.removeAttribute('data-theme')
  })

  it('resolves the default preference from the system setting', () => {
    render(<ThemeProvider><ThemeState /></ThemeProvider>)

    expect(screen.getByText('system/light')).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
  })

  it('uses a stored dark preference', () => {
    window.localStorage.setItem('theme', 'dark')

    render(<ThemeProvider><ThemeState /></ThemeProvider>)

    expect(screen.getByText('dark/dark')).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
  })

  it('follows system preference changes', () => {
    const mediaQuery = createMediaQuery(true)
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn(() => mediaQuery.query),
    })
    window.localStorage.setItem('theme', 'system')

    render(<ThemeProvider><ThemeState /></ThemeProvider>)

    expect(screen.getByText('system/dark')).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')

    act(() => mediaQuery.change(false))

    expect(screen.getByText('system/light')).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
  })

  it('falls back to the default for an invalid stored preference', () => {
    window.localStorage.setItem('theme', 'sepia')

    render(<ThemeProvider><ThemeState /></ThemeProvider>)

    expect(screen.getByText('system/light')).toBeInTheDocument()
  })

  it('falls back to the default when storage is unavailable', () => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get: () => { throw new Error('Storage unavailable') },
    })

    render(<ThemeProvider><ThemeState /></ThemeProvider>)

    expect(screen.getByText('system/light')).toBeInTheDocument()
  })
})
