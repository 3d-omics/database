export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'theme'

// Flip this, and the matching fallback in index.html, to 'system' in Phase 6.
export const DEFAULT_THEME_PREFERENCE: ThemePreference = 'light'
