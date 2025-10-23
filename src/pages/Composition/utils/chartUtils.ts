export const flattenedcolorScheme = (colorScheme:Record<string, any>) => {
  const result: Record<string, string> = {};
  function traverse(obj: Record<string, any>): void {
    for (const key in obj) {
      if (key === 'color') continue;
      if (['species', 'genus', 'family', 'order', 'class'].includes(key)) {
        traverse(obj[key]);
      } else {
        const taxonData = obj[key];
        if (taxonData.color) {
          result[key] = taxonData.color;
        }
        traverse(taxonData);
      }
    }
  }
  traverse(colorScheme);
  return result;
}




export const dynamicXAxisPlugin = {
  id: 'dynamicXAxisPlugin',
  beforeUpdate(chart: any) {
    const xAxis = chart.scales['x'];
    if (!xAxis) return;
    if (xAxis.width === undefined) { // When mounting the component (default value)
      chart.options.scales.x.ticks.minRotation = 90;
      chart.options.scales.x.ticks.font = {
        ...chart.options.scales.x.ticks.font,
        size: 8,
      }
    } else {
      const tickCount = xAxis.ticks.length || chart.data.labels.length;
      const pixelsPerTick = xAxis.width / tickCount;
      const needsRotation = pixelsPerTick < 30;
      const xTickOptions = chart.options.scales.x.ticks;
      if (xTickOptions.minRotation !== (needsRotation ? 90 : 0) || xTickOptions.font?.size !== (needsRotation ? 8 : 12)) {
        xTickOptions.minRotation = needsRotation ? 90 : 0;
        xTickOptions.font = {
          ...xTickOptions.font,
          size: needsRotation ? 8 : 12,
        }
      }
    }

  },
}
