import { colorScheme } from 'config/colorScheme/taxonomy-color-scheme';


const extractPhylumColorMap = (colorScheme: any): Record<string, string> => {
  const map: Record<string, string> = {};
  for (const [phylum, data] of Object.entries(colorScheme)) {
    map[phylum] = (data as { color: string }).color;
  }
  return map;
}

const defaultPhylumColor = "#999999";

export const phylumColors = extractPhylumColorMap(colorScheme);

export const getPhylumColor = (phylum: string) => {
  return phylumColors[phylum] ?? defaultPhylumColor;
}
