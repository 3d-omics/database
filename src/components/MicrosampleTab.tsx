import Microsample from 'pages/Microsample'

const MicrosampleTab = ({ id }: { id: string }) => {
  return (
    <Microsample
      displayTableHeader={true}
      displayTableFilters={false}
      displayTableBody={true}
      filterWith={[{ id: 'Code', value: id, condition: 'startsWith' }]}
    // filterWith={[{id: 'Code', value: experimentId, condition: 'startsWith'}]}
    />
  )
}

export default MicrosampleTab

