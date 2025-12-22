interface AirtableRecord {
  id: string
  createdTime: string
  fields: {
    ID: string
    [key: string]: any
  }
}

export const mergeExcelWithAirtableData = (
  excelRowData: any[][] | null,
  airtableData: AirtableRecord[]
): AirtableRecord[] => {
  if (!excelRowData || excelRowData.length === 0) {
    return airtableData
  }

  // Get headers from first row
  const headers = excelRowData[0]
  
  // Columns we want to merge
  const columnsToMerge = ['Treatment', 'Group', 'DPI']
  
  // Find the SAMPLE_ID column index
  const sampleIdIndex = headers.indexOf('SAMPLE_ID')
  
  if (sampleIdIndex === -1) {
    console.warn('SAMPLE_ID column not found in Excel data')
    return airtableData
  }
  
  const excelDataMap: Record<string, Record<string, any>> = {}
  
  // Process each row (skip header row)
  for (let i = 1; i < excelRowData.length; i++) {
    const row = excelRowData[i]
    const sampleId = row[sampleIdIndex]
    
    if (!sampleId) continue
    
    // Extract only the columns we want to merge
    const rowData: Record<string, any> = {}
    columnsToMerge.forEach(columnName => {
      const columnIndex = headers.indexOf(columnName)
      if (columnIndex !== -1 && row[columnIndex] !== undefined && row[columnIndex] !== null && row[columnIndex] !== '') {
        rowData[columnName] = row[columnIndex]
      }
    });
    
    // Only add to map if we found at least one column to merge
    if (Object.keys(rowData).length > 0) {
      excelDataMap[sampleId] = rowData
    }
  }
  
  // Merge Excel data into Airtable data
  const mergedData = airtableData.map(record => {
    const sampleId = record.fields?.ID
    
    if (sampleId && excelDataMap[sampleId]) {
      return {
        ...record,
        fields: {
          ...record.fields,
          ...excelDataMap[sampleId]
        }
      };
    }
    
    return record
  })
  
  return mergedData
};