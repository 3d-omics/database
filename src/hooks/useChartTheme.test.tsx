import type { PropsWithChildren } from 'react'
import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { chartTheme } from 'config/chartTheme'
import { ThemeContext, type ThemeContextValue } from 'components/ThemeProvider'
import useChartTheme from './useChartTheme'

describe('useChartTheme', () => {
  it('uses the light chart theme outside a provider', () => {
    const { result } = renderHook(() => useChartTheme())

    expect(result.current).toBe(chartTheme.light)
  })

  it('uses the resolved dark theme from ThemeProvider', () => {
    const value: ThemeContextValue = {
      preference: 'dark',
      resolved: 'dark',
      setPreference: vi.fn(),
    }
    const wrapper = ({ children }: PropsWithChildren) => (
      <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    )

    const { result } = renderHook(() => useChartTheme(), { wrapper })

    expect(result.current).toBe(chartTheme.dark)
  })
})
