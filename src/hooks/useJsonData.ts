import { useMemo } from 'react';

/**
 * Load a single genome metadata, macro counts, or microsample counts file
 */
export function useGenomeJsonFile(
  folder: 'genome_metadata' | 'macro_genome_counts' | 'microsample_counts',
  fileName: string
) {
  return useMemo(() => {
    try {
      // Use dynamic import based on folder
      if (folder === 'genome_metadata') {
        const files = import.meta.glob(
          '/src/assets/data/genome_metadata_json/*.json',
          { eager: true }
        );
        const data = files[`/src/assets/data/genome_metadata_json/${fileName}.json`];
        return data ? (data as any).default : null;
      }

      if (folder === 'macro_genome_counts') {
        const files = import.meta.glob(
          '/src/assets/data/macro_genome_counts_json/*.json',
          { eager: true }
        );
        const data = files[`/src/assets/data/macro_genome_counts_json/${fileName}.json`];
        return data ? (data as any).default : null;
      }

      if (folder === 'microsample_counts') {
        const files = import.meta.glob(
          '/src/assets/data/microsample_counts_json/*.json',
          { eager: true }
        );
        const data = files[`/src/assets/data/microsample_counts_json/${fileName}.json`];
        return data ? (data as any).default : null;
      }

      return null;
    } catch (error) {
      console.error(`Error loading ${folder}/${fileName}:`, error);
      return null;
    }
  }, [folder, fileName]);
}

/**
 * Load ALL microsample counts files (all 83 files)
 */
export function useAllMicrosampleCounts() {
  return useMemo(() => {
    try {
      const dataFiles = import.meta.glob(
        '/src/assets/data/microsample_counts_json/*.json',
        { eager: true }
      );

      // Return all microsample count files as an array
      return Object.entries(dataFiles).map(([path, module]) => {
        const fileName = path.split('/').pop()?.replace('.json', '') || '';
        return {
          fileName,
          data: (module as { default: Record<string, any[]> }).default,
        };
      });
    } catch (error) {
      console.error('Error loading microsample counts:', error);
      return [];
    }
  }, []);
}