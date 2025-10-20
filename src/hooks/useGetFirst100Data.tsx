import { useState, useEffect, useCallback } from 'react'
import { useData } from 'context/DataContext'

const useGetFirst100Data = ({ AIRTABLE_BASE_ID, AIRTABLE_TABLE_ID, AIRTABLE_VIEW_ID, filterWith = [] }: {
  AIRTABLE_BASE_ID: string,
  AIRTABLE_TABLE_ID: string,
  AIRTABLE_VIEW_ID: string,
  filterWith?: { id: string; value: string | number, condition?: string }[]
}) => {


  const [first100Data, setFirst100Data] = useState<any[]>([])
  const [first100Loading, setFirst100Loading] = useState(false)
  const [first100Error, setFirst100Error] = useState<string | null>(null)
  const [allData, setAllData] = useState<any[]>([])
  const [allLoading, setAllLoading] = useState(false)
  const [allError, setAllError] = useState<string | null>(null)
  const [hasFetchedAllData, setHasFetchedAllData] = useState(false)

  const { fetchFirst100Data, fetchAllData } = useData()

  // const key = `${AIRTABLE_BASE_ID}-${AIRTABLE_TABLE_ID}-${AIRTABLE_VIEW_ID}`
  const key =
    (filterWith && filterWith.length > 0)
      ? `${AIRTABLE_BASE_ID}-${AIRTABLE_TABLE_ID}-${AIRTABLE_VIEW_ID}-${JSON.stringify(filterWith)}`
      : `${AIRTABLE_BASE_ID}-${AIRTABLE_TABLE_ID}-${AIRTABLE_VIEW_ID}`

  const getData = useCallback(async () => {
    setFirst100Loading(true)
    setAllLoading(true)
    // setFirst100Error(null)
    // setAllError(null)

    // Fetch first 100 records
    try {
      const first100Records = await fetchFirst100Data(key, AIRTABLE_BASE_ID, AIRTABLE_TABLE_ID, AIRTABLE_VIEW_ID, filterWith)
      if (typeof first100Records === 'string') throw new Error(first100Records)
      setFirst100Data(first100Records)
    } catch (error) {
      if (error instanceof Error) {
        setFirst100Error(error.message)
      } else {
        setFirst100Error(String(error))
      }
    } finally {
      setFirst100Loading(false)
    }

    // Fetch all records
    try {
      const fetchedData = await fetchAllData(key, AIRTABLE_BASE_ID, AIRTABLE_TABLE_ID, AIRTABLE_VIEW_ID, filterWith)
      if (typeof fetchedData === 'string') throw new Error(fetchedData)
      setAllData(fetchedData)
    } catch (error) {
      if (error instanceof Error) {
        setAllError(error.message)
      } else {
        setAllError(String(error))
      }
    } finally {
      setAllLoading(false)
      setHasFetchedAllData(true)
    }
  }, [key, AIRTABLE_BASE_ID, AIRTABLE_TABLE_ID, AIRTABLE_VIEW_ID]) // putting fetchFirst100Data and fetchAllData in the dependency array causes unwanted action


  useEffect(() => {
    getData()
  }, [getData])

  return {
    first100Data,
    first100Loading,
    first100Error,
    allData,
    allLoading,
    allError,
    hasFetchedAllData,
  }
}

export default useGetFirst100Data


