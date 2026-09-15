import {
  createContext,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  DEFAULT_THEME_PREFERENCE,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemePreference,
} from 'config/theme'

export type ThemeContextValue = {
  preference: ThemePreference
  resolved: ResolvedTheme
  setPreference: (preference: ThemePreference) => void
}

const defaultThemeContext: ThemeContextValue = {
  preference: 'light',
  resolved: 'light',
  setPreference: () => {},
}

export const ThemeContext = createContext<ThemeContextValue>(defaultThemeContext)

function isThemePreference(value: string | null): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system'
}

function readPreference(): ThemePreference {
  if (typeof window === 'undefined') return DEFAULT_THEME_PREFERENCE

  try {
    const preference = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isThemePreference(preference) ? preference : DEFAULT_THEME_PREFERENCE
  } catch {
    return DEFAULT_THEME_PREFERENCE
  }
}

function resolveSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light'

  try {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(readPreference)
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(resolveSystemTheme)
  const resolved = preference === 'system' ? systemTheme : preference

  const setPreference = useCallback((nextPreference: ThemePreference) => {
    setPreferenceState(nextPreference)
    if (nextPreference === 'system') setSystemTheme(resolveSystemTheme())

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextPreference)
    } catch {
      // Storage can be unavailable in private browsing contexts.
    }
  }, [])

  useEffect(() => {
    if (preference !== 'system' || typeof window === 'undefined') return

    let mediaQuery: MediaQueryList | undefined
    try {
      mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)')
    } catch {
      return
    }
    if (!mediaQuery) return

    const handleChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? 'dark' : 'light')
    }

    setSystemTheme(mediaQuery.matches ? 'dark' : 'light')
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [preference])

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = resolved
  }, [resolved])

  const value = useMemo(
    () => ({ preference, resolved, setPreference }),
    [preference, resolved, setPreference],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
