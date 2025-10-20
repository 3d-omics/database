export const phylumColors: Record<string, string> = {
  Actinomycetota: "#C7243A",
  Bacillota: "#EDAD0B",
  Bacillota_A: "#1B8FAF",
  Bacillota_B: "#28C76F",
  Bacillota_C: "#FF6B00",
  Bacillota_G: "#007BFF",
  Bacteroidota: "#8000FF",
  Cyanobacteriota: "#CBE240",
  Desulfobacterota: "#A0522D",
  Pseudomonadota: "#CC00FF",
  Verrucomicrobiota: "#FF00E6",
  Thermoplasmatota: "#FF5FBF",
};

export const defaultPhylumColor = "#999999";

export const getPhylumColor = (phylum: string): string =>
  phylumColors[phylum] || defaultPhylumColor;
