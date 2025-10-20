import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SocialIcons from '.'
import TestRouter from 'tests/setup/test-utils'

const renderSocialIcons = () => {
  render(
    <TestRouter>
      <SocialIcons />
    </TestRouter>
  )
}

describe('components > SocialIcons', () => {

  it('renders 4 social media links', () => {
    renderSocialIcons()
    const list = screen.getByTestId('social-icons')
    expect(list).toBeInTheDocument()
    expect(screen.getAllByRole('link')).toHaveLength(4)
  })

  it('renders links with correct href values', () => {
    renderSocialIcons()
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', 'https://bsky.app/profile/3domics.bsky.social')
    expect(links[1]).toHaveAttribute('href', 'https://github.com/3d-omics')
    expect(links[2]).toHaveAttribute('href', 'https://www.youtube.com/channel/UCELmDxgD1-AV0ObFl9UZNyQ')
    expect(links[3]).toHaveAttribute('href', 'https://www.linkedin.com/company/79361799/admin/dashboard/')
  })

})