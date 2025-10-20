// import { useMemo } from 'react'
import useGetFirst100Data from 'hooks/useGetFirst100Data'
import { airtableConfig } from 'config/airtable'
// import { ColumnDef, useReactTable, getCoreRowModel, getFilteredRowModel, getSortedRowModel } from '@tanstack/react-table'
import { Link } from 'react-router-dom'
// import TableBody from 'components/Table/components/TableBody'
import Loading from 'components/Loading'
import ErrorBanner from 'components/ErrorBanner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'


// type TData = {
//   id: string
//   createdTime: string
//   fields: {
//     ID: string
//     Name: string
//     Type: string
//     StartDate?: string
//     EndDate?: string
//   }
// }


const GenomeCatalogueList = () => {

  const { animalTrialExperimentBaseId, animalTrialExperimentTableId, animalTrialExperimentViewId } = airtableConfig

  const { first100Data, first100Loading, first100Error } = useGetFirst100Data({
    AIRTABLE_BASE_ID: animalTrialExperimentBaseId,
    AIRTABLE_TABLE_ID: animalTrialExperimentTableId,
    AIRTABLE_VIEW_ID: animalTrialExperimentViewId,
  })

  // console.log(first100Data)


  // const columns = useMemo<ColumnDef<TData>[]>(() => [
  //   {
  //     id: 'MAGCatalogue',
  //     header: '',
  //     enableColumnFilter: false,
  //     enableSorting: false,
  //     cell: (props: any) => {
  //       return (
  //         <Link
  //           to={`/genome-catalogues/${encodeURIComponent(props.row.original.fields.Name)}`}
  //           className='link'
  //         >
  //           MAG Catalogue for <b>{props.row.original.fields.Name}</b>
  //         </Link>
  //       )
  //     }
  //   },
  // ], [first100Data])

  // const table = useReactTable({
  //   data: first100Data,
  //   columns,
  //   getCoreRowModel: getCoreRowModel(),
  //   getFilteredRowModel: getFilteredRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  // })


  return (
    <div className='page_padding pt-7 min-h-[calc(100dvh-(var(--navbar-height)+var(--footer-height)))]'>

      <header className='main_header mb-4'>List of Genome Catalogues</header>

      {first100Loading && <Loading />}
      {first100Error && <ErrorBanner>{first100Error}</ErrorBanner>}
      {!first100Loading && first100Data &&
        // <TableBody
        //   table={table}
        //   checkedItems={[]}
        //   setCheckedItems={() => { }}
        //   checkedMetaboliteIds={[]}
        //   setCheckedMetaboliteIds={() => { }}
        //   displayTableFilters={false}
        // />

        // <ul className='mx-8'>
        //   {first100Data.map((experiment) => (
        //     <li key={experiment.id} className='py-2.5'>
        //       <Link
        //         to={`/genome-catalogues/${encodeURIComponent(experiment.fields.Name)}`}
        //         className='hover:text-mustard hover:underline'
        //       >
        //         MAG Catalogue for <b>{experiment.fields.Name}</b>
        //       </Link>
        //     </li>
        //   ))}
        // </ul>

        <ul className='space-y-4'>
          {first100Data.map((experiment) => (
            <li key={experiment.id}>
              <Link
                to={`/genome-catalogues/${encodeURIComponent(experiment.fields.Name)}`}
                className='group flex items-center justify-between gap-4 px-4 py-3 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition bg-white hover:bg-gray-50'
              >
                <span className='text-lg font-medium group-hover:text-mustard group-hover:underline'>
                  {experiment.fields.Name}
                </span>
                <FontAwesomeIcon icon={faArrowRight} className='w-5 h-5 group-hover:text-mustard group-hover:translate-x-1 transition-transform' />
              </Link>
            </li>
          ))}
        </ul>
      }

    </div>
  )
}

export default GenomeCatalogueList