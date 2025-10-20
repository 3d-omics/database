// import { schemeCategory10, schemeSet3, schemePaired, schemeSet1, schemeDark2 } from 'd3-scale-chromatic';

// // taxonomy-color-scheme-H.ts

// // This file contains a color scheme for taxonomy levels based on the provided data.
// // The color palette is generated using d3-scale-chromatic for categorical color assignment.


// type TaxonomyLevel = 'domain' | 'phylum' | 'class' | 'order' | 'family' | 'genus' | 'species';

// export interface TaxonomyColorScheme {
//   [level: string]: { [name: string]: string };
// }

// // Helper to assign colors from a palette, cycling if needed
// function assignColors(names: string[], palette: string[]): { [name: string]: string } {
//   const colorMap: { [name: string]: string } = {};
//   names.forEach((name, i) => {
//     colorMap[name] = palette[i % palette.length];
//   });
//   return colorMap;
// }

// // Taxonomy data (truncated for brevity, use the full list in production)
// const taxonomyRows = [
//   // domain, phylum, class, order, family, genus, species
//   ['d__Archaea', 'p__Thermoplasmatota', 'c__Thermoplasmata', 'o__Methanomassiliicoccales', 'f__Methanomassiliicoccaceae', 'g__Methanomassiliicoccus_A', 's__Methanomassiliicoccus_A sp944319735'],
//   ['d__Bacteria', 'p__Bacillota_A', 'c__Clostridia', 'o__Christensenellales', 'f__CAG-314', 'g__Heteroclostridium', 's__Heteroclostridium caecigallinarum'],
//   // ... (add all rows from your data here)
// ];

// // Extract unique names for each level
// function getUniqueByLevel(levelIdx: number): string[] {
//   const set = new Set<string>();
//   taxonomyRows.forEach(row => set.add(row[levelIdx]));
//   return Array.from(set);
// }

// // Assign palettes to each level
// const palettes: { [L in TaxonomyLevel]: string[] } = {
//   domain: schemeCategory10,
//   phylum: schemeSet3,
//   class: schemePaired,
//   order: schemeSet1,
//   family: schemeDark2,
//   genus: schemeSet3,
//   species: schemePaired,
// };

// const levelIndices: { [L in TaxonomyLevel]: number } = {
//   domain: 0,
//   phylum: 1,
//   class: 2,
//   order: 3,
//   family: 4,
//   genus: 5,
//   species: 6,
// };

// const taxonomyColorScheme: TaxonomyColorScheme = {} as any;

// (Object.keys(levelIndices) as TaxonomyLevel[]).forEach(level => {
//   const names = getUniqueByLevel(levelIndices[level]);
//   taxonomyColorScheme[level] = assignColors(names, palettes[level]);
// });

// export default taxonomyColorScheme;