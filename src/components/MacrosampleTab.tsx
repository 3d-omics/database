import Macrosample from 'pages/Macrosample'
const MacrosampleTab = ({ id }: { id: string }) => {
  return (
    <Macrosample
      displayTableHeader={true}
      displayTableFilters={false}
      displayTableBody={true}
      filterWith={[{ id: 'ID', value: id, condition: 'startsWith' }]}
    />
  )
}

export default MacrosampleTab