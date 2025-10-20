import { useState } from 'react'
import axios from 'axios';

const useGlobalSearch = ({ keyword, AIRTABLE_BASE_ID, AIRTABLE_TABLE_ID, AIRTABLE_VIEW_ID, fields }: { keyword: string, AIRTABLE_BASE_ID: string, AIRTABLE_TABLE_ID: string, AIRTABLE_VIEW_ID: string, fields: { name: string, type: string, columnName: string }[] }) => {

  const [data, setData] = useState<any[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`

  const buildSearchFormula = (keyword: string, fields: { name: string, type: string }[]) => {
    const lowerKeyword = keyword.toLowerCase();
    const searchConditions = fields.map(field => {
      if (field.type === 'string') {
        return `SEARCH('${lowerKeyword}', LOWER({${field.name}}))`;
      } else if (field.type === 'number') {
        return `SEARCH('${lowerKeyword}', LOWER({${field.name}} & ""))`;
      } else if (field.type === 'array') {
        return `SEARCH('${lowerKeyword}', LOWER(ARRAYJOIN({${field.name}}, ',')))`;
      }
      return '';
    });
    return `OR(${searchConditions.join(', ')})`;
  };
  const formula = buildSearchFormula(keyword, fields)

  const getData = async () => {
    if (keyword === '') {
      setData([])
    } else {
      setLoading(true)
      setError(null)
      let allData: unknown[] = []
      let offset = null

      try {
        do {
          const params = {
            offset,
            view: AIRTABLE_VIEW_ID,
            filterByFormula: formula
          }
          const response: any = await axios.get(url, {
            headers: { Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}` },
            params,
          })
          allData = [...allData, ...response.data.records]
          offset = response.data.offset
        } while (offset)
        setData(allData)
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError(String(error))
        }
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  return {
    data,
    getData,
    loading,
    error,
  }
}

export default useGlobalSearch