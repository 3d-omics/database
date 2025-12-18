import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import useValidateParams from './useValidateParams'

// Mock data imports
vi.mock('assets/data/airtable/animaltrialexperiment.json', () => ({
  default: [
    { id: '1', createdTime: '2024-01-01', fields: { ID: 'G', Name: 'Experiment G' } },
    { id: '2', createdTime: '2024-01-02', fields: { ID: 'H', Name: 'Experiment H' } },
    { id: '3', createdTime: '2024-01-03', fields: { ID: 'X', Name: 'Experiment X' } },
  ],
}))

vi.mock('assets/data/airtable/animalspecimen.json', () => ({
  default: [
    { id: '1', createdTime: '2024-01-01', fields: { SpecimenID: 'S001', Animal: 'Pig' } },
    { id: '2', createdTime: '2024-01-02', fields: { SpecimenID: 'S002', Animal: 'Chicken' } },
  ],
}))

vi.mock('assets/data/airtable/cryosectionimage.json', () => ({ default: [] }))
vi.mock('assets/data/airtable/intestinalsectionsample.json', () => ({ default: [] }))
vi.mock('assets/data/airtable/cryosection.json', () => ({ default: [] }))

describe('useValidateParams', () => {
  it('returns correct structure', () => {
    const { result } = renderHook(() =>
      useValidateParams({
        tableType: 'animalTrialExperiment',
        filterId: 'ID',
        filterValue: 'G',
      })
    )

    expect(result.current).toHaveProperty('validating', false)
    expect(result.current).toHaveProperty('notFound')
  })

  it('filters data by exact match (case-insensitive)', () => {
    const { result } = renderHook(() =>
      useValidateParams({
        tableType: 'animalTrialExperiment',
        filterId: 'ID',
        filterValue: 'g',
      })
    )

    expect(result.current.data).toHaveLength(1)
    expect(result.current.data[0].fields.ID).toBe('G')
    expect(result.current.notFound).toBe(false)
  })

  it('returns notFound when no matches', () => {
    const { result } = renderHook(() =>
      useValidateParams({
        tableType: 'animalTrialExperiment',
        filterId: 'ID',
        filterValue: 'NonExistent',
      })
    )

    expect(result.current.data).toHaveLength(0)
    expect(result.current.notFound).toBe(true)
  })

  it('filters metabolomics tableType correctly', () => {
    const { result } = renderHook(() =>
      useValidateParams({
        tableType: 'metabolomics',
        filterId: 'ID',
        filterValue: 'G',
      })
    )

    expect(result.current.data).toHaveLength(1)
    expect(result.current.data[0].fields.ID).toBe('G')
  })

  it('excludes non-metabolomics experiments', () => {
    const { result } = renderHook(() =>
      useValidateParams({
        tableType: 'metabolomics',
        filterId: 'ID',
        filterValue: 'X',
      })
    )

    expect(result.current.data).toHaveLength(0)
    expect(result.current.notFound).toBe(true)
  })

  it('handles different tableTypes', () => {
    const { result } = renderHook(() =>
      useValidateParams({
        tableType: 'animalSpecimen',
        filterId: 'Animal',
        filterValue: 'pig', // lowercase
      })
    )

    expect(result.current.data).toHaveLength(1)
    expect(result.current.data[0].fields.Animal).toBe('Pig')
  })
})