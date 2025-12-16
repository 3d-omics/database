import { describe, it, expect } from 'vitest';
import { formatIdForDisplay, deleteFilter } from './filterUtils';

describe('formatIdForDisplay', () => {
  it('returns ID as-is', () => {
    expect(formatIdForDisplay('ID')).toBe('ID');
  });

  it('removes _flat suffix', () => {
    expect(formatIdForDisplay('LMBatch_flat')).toBe('LMBatch');
    expect(formatIdForDisplay('sample_flat')).toBe('sample');
  });

  it('formats Individual as Experimental Unit Series', () => {
    expect(formatIdForDisplay('Individual')).toBe('Experimental Unit Series');
  });

  it('formats Metabolite as Metabolite Data', () => {
    expect(formatIdForDisplay('Metabolite')).toBe('Metabolite Data');
  });

  it('adds space before capital letters', () => {
    expect(formatIdForDisplay('AnimalSpecies')).toBe('Animal Species');
  });
});

describe('deleteFilter', () => {
  it('removes filter at specified index', () => {
    const filters = [
      { id: 'species', value: 'Pig' },
      { id: 'status', value: 'Active' },
      { id: 'type', value: 'Test' },
    ];

    const result = deleteFilter(1, filters);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ id: 'species', value: 'Pig' });
    expect(result[1]).toEqual({ id: 'type', value: 'Test' });
  });

  it('does not mutate original array', () => {
    const filters = [
      { id: 'species', value: 'Pig' },
      { id: 'status', value: 'Active' },
    ];

    deleteFilter(0, filters);

    expect(filters).toHaveLength(2);
  });

  it('handles empty array', () => {
    const result = deleteFilter(0, []);
    expect(result).toEqual([]);
  });
});