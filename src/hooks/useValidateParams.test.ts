import { renderHook } from '@testing-library/react'
import { vi } from 'vitest'
import useValidateParams from './useValidateParams'

// Mock static JSON data
vi.mock('assets/data/airtable/animaltrialexperiment.json', () => ({
  default: [
    {
      id: 'rec1',
      createdTime: '2023-01-01T00:00:00.000Z',
      fields: {
        ID: 'A',
        Name: 'Experiment A',
        Type: 'In vivo',
      },
    },
    {
      id: 'rec2',
      createdTime: '2023-01-02T00:00:00.000Z',
      fields: {
        ID: 'B',
        Name: 'Experiment B',
        Type: 'In vitro',
      },
    },
  ],
}))

vi.mock('assets/data/airtable/cryosectionimage.json', () => ({
  default: [
    {
      id: 'rec3',
      createdTime: '2023-01-03T00:00:00.000Z',
      fields: {
        ID: 'G121eI104C',
        Name: 'Cryosection G',
      },
    },
    {
      id: 'rec4',
      createdTime: '2023-01-04T00:00:00.000Z',
      fields: {
        ID: 'H122eI105D',
        Name: 'Cryosection H',
      },
    },
  ],
}))

describe('useValidateParams', () => {
  it('finds matching record in animalTrialExperiment', () => {
    const { result } = renderHook(() =>
      useValidateParams({
        tableType: 'animalTrialExperiment',
        filterId: 'Name',
        filterValue: 'Experiment A',
      })
    )

    expect(result.current.notFound).toBe(false)
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data[0].fields.Name).toBe('Experiment A')
  })

  it('finds matching record in cryosectionImage', () => {
    const { result } = renderHook(() =>
      useValidateParams({
        tableType: 'cryosectionImage',
        filterId: 'ID',
        filterValue: 'G121eI104C',
      })
    )

    expect(result.current.notFound).toBe(false)
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data[0].fields.ID).toBe('G121eI104C')
  })

  it('returns notFound when no match exists', () => {
    const { result } = renderHook(() =>
      useValidateParams({
        tableType: 'animalTrialExperiment',
        filterId: 'Name',
        filterValue: 'Nonexistent',
      })
    )

    expect(result.current.notFound).toBe(true)
    expect(result.current.data).toHaveLength(0)
  })

  it('performs case-insensitive matching', () => {
    const { result } = renderHook(() =>
      useValidateParams({
        tableType: 'animalTrialExperiment',
        filterId: 'Name',
        filterValue: 'experiment a', // lowercase
      })
    )

    expect(result.current.notFound).toBe(false)
    expect(result.current.data[0].fields.Name).toBe('Experiment A')
  })

  it('handles undefined field values', () => {
    const { result } = renderHook(() =>
      useValidateParams({
        tableType: 'animalTrialExperiment',
        filterId: 'NonexistentField',
        filterValue: 'anything',
      })
    )

    expect(result.current.notFound).toBe(true)
    expect(result.current.data).toHaveLength(0)
  })

  it('always returns validating as false', () => {
    const { result } = renderHook(() =>
      useValidateParams({
        tableType: 'animalTrialExperiment',
        filterId: 'Name',
        filterValue: 'Experiment A',
      })
    )

    expect(result.current.validating).toBe(false)
  })

  it('always returns error as null', () => {
    const { result } = renderHook(() =>
      useValidateParams({
        tableType: 'animalTrialExperiment',
        filterId: 'Name',
        filterValue: 'Experiment A',
      })
    )

    expect(result.current.error).toBeNull()
  })

  it('filters by different field IDs', () => {
    const { result: resultByName } = renderHook(() =>
      useValidateParams({
        tableType: 'animalTrialExperiment',
        filterId: 'Name',
        filterValue: 'Experiment A',
      })
    )
    expect(resultByName.current.notFound).toBe(false)

    const { result: resultById } = renderHook(() =>
      useValidateParams({
        tableType: 'animalTrialExperiment',
        filterId: 'ID',
        filterValue: 'A',
      })
    )
    expect(resultById.current.notFound).toBe(false)
  })

  it('updates when parameters change', () => {
    const { result, rerender } = renderHook(
      ({ filterValue }) =>
        useValidateParams({
          tableType: 'animalTrialExperiment',
          filterId: 'Name',
          filterValue,
        }),
      { initialProps: { filterValue: 'Experiment A' } }
    )

    expect(result.current.notFound).toBe(false)

    // Change filter value
    rerender({ filterValue: 'Nonexistent' })
    expect(result.current.notFound).toBe(true)
  })
})