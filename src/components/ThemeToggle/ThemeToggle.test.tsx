import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import ThemeProvider from 'components/ThemeProvider'
import ThemeToggle from './index'

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('cycles through system, light and dark preferences and persists each choice', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    )

    const toggle = screen.getByRole('button', { name: 'Theme: system' })
    await user.click(toggle)

    expect(screen.getByRole('button', { name: 'Theme: light' })).toBeInTheDocument()
    expect(window.localStorage.getItem('theme')).toBe('light')
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')

    await user.click(screen.getByRole('button', { name: 'Theme: light' }))

    expect(screen.getByRole('button', { name: 'Theme: dark' })).toBeInTheDocument()
    expect(window.localStorage.getItem('theme')).toBe('dark')
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')

    await user.click(screen.getByRole('button', { name: 'Theme: dark' }))

    expect(screen.getByRole('button', { name: 'Theme: system' })).toBeInTheDocument()
    expect(window.localStorage.getItem('theme')).toBe('system')
  })
})
