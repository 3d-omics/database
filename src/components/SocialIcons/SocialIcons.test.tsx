import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import SocialIcons from './index'

describe('SocialIcons', () => {
  const renderSocialIcons = (ulClassName?: string) => {
    return render(
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <SocialIcons ulClassName={ulClassName} />
      </BrowserRouter>
    )
  }

  it('renders all social icon links', () => {
    renderSocialIcons()
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(4)
  })

  it('renders Bluesky link', () => {
    renderSocialIcons()
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', 'https://bsky.app/profile/3domics.bsky.social')
  })

  it('renders GitHub link', () => {
    renderSocialIcons()
    const links = screen.getAllByRole('link')
    expect(links[1]).toHaveAttribute('href', 'https://github.com/3d-omics')
  })

  it('renders YouTube link', () => {
    renderSocialIcons()
    const links = screen.getAllByRole('link')
    expect(links[2]).toHaveAttribute('href', 'https://www.youtube.com/channel/UCELmDxgD1-AV0ObFl9UZNyQ')
  })

  it('renders LinkedIn link', () => {
    renderSocialIcons()
    const links = screen.getAllByRole('link')
    expect(links[3]).toHaveAttribute('href', 'https://www.linkedin.com/company/79361799/admin/dashboard/')
  })

  it('applies custom className', () => {
    renderSocialIcons('custom-class gap-4')
    const ul = screen.getByTestId('social-icons')
    expect(ul).toHaveClass('custom-class', 'gap-4')
  })

  it('has default classes', () => {
    renderSocialIcons()
    const ul = screen.getByTestId('social-icons')
    expect(ul).toHaveClass('flex', 'mx-auto', 'w-fit')
  })
})