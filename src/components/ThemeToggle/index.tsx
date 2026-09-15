import { faCircleHalfStroke, faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import useTheme from 'hooks/useTheme'
import type { ThemePreference } from 'config/theme'

const nextPreference: Record<ThemePreference, ThemePreference> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
}

const icons = {
  system: faCircleHalfStroke,
  light: faSun,
  dark: faMoon,
}

type ThemeToggleProps = {
  className?: string
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { preference, setPreference } = useTheme()

  return (
    <button
      type='button'
      className={`btn btn-ghost btn-sm rounded-full text-ink hover:bg-surface_muted hover:text-burgundy_ink ${className}`}
      aria-label={`Theme: ${preference}`}
      title={`Theme: ${preference}`}
      onClick={() => setPreference(nextPreference[preference])}
      data-testid='theme-toggle'
    >
      <FontAwesomeIcon icon={icons[preference]} />
    </button>
  )
}
