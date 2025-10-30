import { useState } from 'react'
import CrossReferenceIcon from 'assets/images/icons/cross-reference.svg?react'

const CrossReferenceTooltip = ({ value, data, fieldsName }: {
  value: string | number
  data: Record<string, any> | null
  fieldsName: { key: string, value: string }[]
}) => {

  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className='relative'
    >
      {value}
      {value && (
        <CrossReferenceIcon
          className='fill-inherit cursor-pointer hover:fill-mustard peer inline ml-1 mb-3'
          data-cy='cross-reference-tooltip'
          data-testid='cross-reference-icon'
        />
      )}

      {showTooltip && (
        <div className='absolute hidden bg-white text-black shadow-2xl z-10 w-fit px-4 py-2 rounded-md peer-hover:block'>
          {!data && <p className='whitespace-nowrap'>Record not found</p>}
          {data &&
            fieldsName.map((field) => {
              return <p key={field.key} className='whitespace-nowrap'>
                <span className='font-light'>{field.key}:&nbsp;</span>
                {data.filter((exp:any)=> exp.ID === value)[0][field.value]}
              </p>
            })
          }
        </div>
      )}
    </div>
  )
}

export default CrossReferenceTooltip
