import { Dispatch, SetStateAction } from 'react'

const MetaboliteColumn = ({ cell, checkedMetaboliteIds, setCheckedMetaboliteIds }: { cell: any, checkedMetaboliteIds: string[], setCheckedMetaboliteIds: Dispatch<SetStateAction<string[]>> }) => {

  if (cell.getValue() === 'Yes') {
    const id = cell.row.original.fields.ID
    return (
      <input
        type='checkbox'
        className='accent-mustard tooltip tooltip-left  !bg-white !text-custom_black'
        data-tip='check samples to view/compare'
        checked={checkedMetaboliteIds.includes(id)}
        onChange={(e) => {
          if (e.target.checked) {
            setCheckedMetaboliteIds([...checkedMetaboliteIds, id])
          } else {
            setCheckedMetaboliteIds(checkedMetaboliteIds.filter((checkedId) => checkedId !== id))
          }
        }}
        data-testid='metabolite-checkbox'
      />
    )
  }
  else {
    return '-'
  }



}


export default MetaboliteColumn