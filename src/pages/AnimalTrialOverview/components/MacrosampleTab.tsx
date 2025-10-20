import Macrosample from 'pages/Macrosample'
const MacrosampleTab = ({ experimentId }: { experimentId: string }) => {
  return (
    <Macrosample
      displayTableHeader={true}
      displayTableFilters={false}
      displayTableBody={true}
      filterWith={[{ id: 'ExperimentalUnitIndexedLibrary', value: experimentId, condition: 'startsWith' }]}
    />
  )
}

export default MacrosampleTab