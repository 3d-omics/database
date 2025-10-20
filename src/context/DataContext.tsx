import { createContext, useState, useContext, useCallback, ReactNode } from 'react'
import axios from 'axios'

type FilterWithType = { id: string; value: string | number, condition?: string }[]

type DataContextType = {
  dataCache: Record<string, unknown[]>
  fetchFirst100Data: (key: string, baseId: string, tableId: string, viewId: string, filterWith?: FilterWithType) => Promise<unknown[]>
  fetchAllData: (key: string, baseId: string, tableId: string, viewId: string, filterWith?: FilterWithType) => Promise<unknown[]>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

type DataProviderProps = {
  children: ReactNode
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [dataCache, setDataCache] = useState<Record<string, unknown[]>>({})

  const fetchFirst100Data = useCallback(async (key: string, baseId: string, tableId: string, viewId: string, filterWith?: FilterWithType) => {
    if (dataCache[key]) return dataCache[key].slice(0, 100) // Return cached data if available

    const airtableUrl = `https://api.airtable.com/v0/${baseId}/${tableId}`
    let first100Records: unknown[] = []

    // ⬇️ INCLUDE the filterWith.value (case-insensitive)
    // const formula = (filterWith && filterWith.length > 0)
    //   ? `SEARCH("${filterWith[0].value}", {${filterWith[0].id}}) > 0`
    //   : undefined

    // // ⬇️ STARTS with the filterWith.value (case-insensitive)
    // const formula = (filterWith && filterWith.length > 0)
    //   ? `LOWER(LEFT({${filterWith[0].id}}, LEN("${filterWith[0].value}"))) = LOWER("${filterWith[0].value}")`
    //   : undefined


    // let formula: string | undefined
    // if (filterWith && filterWith.length > 0) {
    //   if (filterWith[0].condition === "startsWith") {
    //     // STARTS with the filterWith.value (case-insensitive)
    //     formula = `LOWER(LEFT({${filterWith[0].id}}, LEN("${filterWith[0].value}"))) = LOWER("${filterWith[0].value}")`
    //   } else {
    //     // Complete match with filterWith.value (case-insensitive)
    //     formula = `AND({${filterWith[0].id}} != "", LOWER({${filterWith[0].id}}) = LOWER("${filterWith[0].value}"))`
    //   }
    // }
    let formula: string | undefined
    if (filterWith && filterWith.length > 0) {
      const f = filterWith[0]
      const field = f.id
      const rawValue = Array.isArray(f.value) ? f.value[0] : f.value
      const escapedForAirtable = String(rawValue).replace(/"/g, '\\"')
      const lowerValue = escapedForAirtable.toLowerCase()
      if (f.condition === "startsWith") {
        // STARTS with the filterWith.value (case-insensitive)
        formula = `REGEX_MATCH(LOWER(ARRAYJOIN({${field}}, ",")), "(^|,)${lowerValue}")`
      } else {
        // Complete match with filterWith.value (case-insensitive)
        formula = `AND({${filterWith[0].id}} != "", LOWER({${filterWith[0].id}}) = LOWER("${filterWith[0].value}"))`
      }
    }

    try {
      const params: { offset?: string, view: string, maxRecords?: number, filterByFormula?: string } = {
        view: viewId,
        maxRecords: 100,
      }

      if (formula) {
        params.filterByFormula = formula
      }

      const response = await axios.get(airtableUrl, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}` },
        params,
      })

      first100Records = response.data.records

      // Cache the first 100 records if not already in the cache
      setDataCache((prevCache) => ({ ...prevCache, [key]: [...first100Records] }))

      return first100Records
    } catch (error) {
      console.error("Error fetching first 100 records:", error)
      return []
    }
  }, [dataCache])



  const fetchAllData = useCallback(async (key: string, baseId: string, tableId: string, viewId: string, filterWith?: FilterWithType) => {
    if (dataCache[key]) return dataCache[key] // Return cached data if available

    const airtableUrl = `https://api.airtable.com/v0/${baseId}/${tableId}`
    let allData: unknown[] = []
    let offset = null

    let formula: string | undefined
    if (filterWith && filterWith.length > 0) {
      const f = filterWith[0]
      const field = f.id
      const rawValue = Array.isArray(f.value) ? f.value[0] : f.value
      const escapedForAirtable = String(rawValue).replace(/"/g, '\\"')
      const lowerValue = escapedForAirtable.toLowerCase()
      if (f.condition === "startsWith") {
        // STARTS with the filterWith.value (case-insensitive)
        formula = `REGEX_MATCH(LOWER(ARRAYJOIN({${field}}, ",")), "(^|,)${lowerValue}")`
      } else {
        // Complete match with filterWith.value (case-insensitive)
        formula = `AND({${filterWith[0].id}} != "", LOWER({${filterWith[0].id}}) = LOWER("${filterWith[0].value}"))`
      }
    }


    try {
      do {
        const params: { offset?: string, view: string, filterByFormula?: string } = {
          offset,
          view: viewId,
        }
        if (formula) {
          params.filterByFormula = formula
        }

        const response = await axios.get(airtableUrl, {
          headers: { Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}` },
          params,
        })
        allData = [...allData, ...response.data.records]
        offset = response.data.offset
      } while (offset)

      setDataCache((prevCache) => ({ ...prevCache, [key]: allData }))
      return allData
    } catch (error) {
      console.error("Error fetching data:", error)
      return []
    }
  }, [dataCache])

  return (
    <DataContext.Provider value={{ dataCache, fetchFirst100Data, fetchAllData }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = (): DataContextType => {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
