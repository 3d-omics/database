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

  it('separates the schema files from populated data', () => {
    renderPage()
    expect(screen.getByRole('heading', { level: 1, name: 'Data model and downloads' })).toBeInTheDocument()
    expect(screen.getByText(/This is data, not a schema/)).toBeInTheDocument()
  })

  it('offers the SQL schema, JSON Schema and normalized export at the site base path', () => {
    renderPage()
    expect(screen.getByRole('link', { name: 'Download sql schema' })).toHaveAttribute('href', '/database/catalogue-v2.sql')
    expect(screen.getByRole('link', { name: 'Download json schema' })).toHaveAttribute('href', '/database/catalogue-v2.schema.json')
    expect(screen.getByRole('link', { name: 'Download normalized catalogue' })).toHaveAttribute('href', '/database/catalogue-v2.json.gz')
    expect(screen.getByRole('link', { name: 'Download hierarchy export' })).toHaveAttribute('href', '/database/experiment-hierarchy.json')
    expect(screen.getByRole('link', { name: 'schema-3 SQL' })).toHaveAttribute('href', '/database/catalogue-v3.sql')
    expect(screen.getByRole('link', { name: 'schema-3 JSON Schema' })).toHaveAttribute('href', '/database/catalogue-v3.schema.json')
  })
})
