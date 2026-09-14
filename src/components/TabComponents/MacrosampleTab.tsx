import Macrosample from 'pages/Macrosamples'
const MacrosampleTab = ({ id }: { id: string }) => {
  return (
    <Macrosample
      displayPageHeader={false}
      displayTableHeader={true}
      displayTableFilters={false}
      displayTableBody={true}
      filterWith={[{ id: 'ID', value: id, condition: 'startsWith' }]}
    />
  )
}

export default MacrosampleTab