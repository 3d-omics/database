import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import DownloadDatabaseSchema from './DownloadDatabaseSchema'

describe('Data model downloads', () => {
  const renderPage = () => render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <DownloadDatabaseSchema />
    </MemoryRouter>
  )

  it('describes separate schemas for the catalogue and its export', () => {
    renderPage()
    expect(screen.getByRole('heading', { level: 1, name: 'Data model and downloads' })).toBeInTheDocument()
    expect(screen.getByText(/Both are separate from the records they describe/)).toBeInTheDocument()
  })

  it('offers the SQL schema, JSON Schema and normalized export at the site base path', () => {
    renderPage()
    expect(screen.getByRole('link', { name: 'Download sql schema' })).toHaveAttribute('href', '/database/catalogue-v3.sql')
    expect(screen.getByRole('link', { name: 'Download json schema' })).toHaveAttribute('href', '/database/catalogue-v3.schema.json')
    expect(screen.getByRole('link', { name: 'Download normalized catalogue' })).toHaveAttribute('href', '/database/catalogue-v3.json.gz')
    expect(screen.getByRole('link', { name: 'Download macrosample identifiers' })).toHaveAttribute('href', '/database/macrosample-identifiers.json')
    expect(screen.getByRole('link', { name: 'Download microsample identifiers' })).toHaveAttribute('href', '/database/microsample-identifiers.json')
    expect(screen.queryByRole('link', { name: 'Download hierarchy export' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'schema-3 SQL' })).not.toBeInTheDocument()
  })
})
