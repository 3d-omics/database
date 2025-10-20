import { useState } from 'react'
import axios from 'axios'
import CrossReferenceIcon from 'assets/images/icons/cross-reference.svg?react'

const CrossReferenceTooltip = <TData extends { fields: any },>({ AIRTABLE_BASE_ID, AIRTABLE_TABLE_ID, RECORD_ID, value, fieldsName }: { AIRTABLE_BASE_ID: string, AIRTABLE_TABLE_ID: string, RECORD_ID: string, value: string | number, fieldsName: { key: string, value: string }[] }) => {

  const [data, setData] = useState<TData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}/${RECORD_ID}`

  const handleMouseEnter = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(airtableUrl, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}` },
      })
      setData(response.data)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message); // Access the message safely
      } else {
        setError(String(error)); // Fallback for non-Error types
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      onMouseEnter={() => handleMouseEnter()}
      onMouseLeave={() => setData(null)}
      className='relative'
    >
      {value}
      {value &&
        <CrossReferenceIcon
          className='fill-inherit cursor-pointer hover:fill-mustard peer inline ml-1 mb-3'
          data-cy='cross-reference-tooltip'
          data-testid='cross-reference-icon'
        />
      }

      <div className='absolute hidden bg-white text-black shadow-2xl z-10 w-fit px-4 py-2 rounded-md peer-hover:block'>
        {error && <p className='whitespace-nowrap'>{error}</p>}
        {loading && <span className='loading loading-dots loading-xs' data-testid='loading'/>}
        {data !== null &&
          fieldsName.map((field) => (
            <p key={field.key} className='whitespace-nowrap'>
              <span className='font-light'>{field.key}:&nbsp;</span>
              {data?.fields[field.value]}
            </p>
          ))
        }
      </div>

    </div>
  )
}

export default CrossReferenceTooltip