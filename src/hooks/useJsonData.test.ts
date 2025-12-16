import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGenomeJsonFile, useAllMicrosampleCounts } from './useJsonData';

// Mock import.meta.glob
vi.mock('/src/assets/data/genome_metadata_json/*.json', () => ({}));
vi.mock('/src/assets/data/macro_genome_counts_json/*.json', () => ({}));
vi.mock('/src/assets/data/microsample_counts_json/*.json', () => ({}));

describe('useGenomeJsonFile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null for non-existent file', () => {
    const { result } = renderHook(() =>
      useGenomeJsonFile('genome_metadata', 'non_existent')
    );
    expect(result.current).toBeNull();
  });

  it('maintains referential equality on re-render with same inputs', () => {
    const { result, rerender } = renderHook(
      ({ folder, fileName }) => useGenomeJsonFile(folder, fileName),
      { initialProps: { folder: 'genome_metadata' as const, fileName: 'test' } }
    );

    const firstResult = result.current;
    rerender({ folder: 'genome_metadata' as const, fileName: 'test' });
    
    expect(result.current).toBe(firstResult);
  });
});

describe('useAllMicrosampleCounts', () => {
  it('returns an array', () => {
    const { result } = renderHook(() => useAllMicrosampleCounts());
    expect(Array.isArray(result.current)).toBe(true);
  });

  it('maintains referential equality on re-render', () => {
    const { result, rerender } = renderHook(() => useAllMicrosampleCounts());
    
    const firstResult = result.current;
    rerender();
    
    expect(result.current).toBe(firstResult);
  });
});