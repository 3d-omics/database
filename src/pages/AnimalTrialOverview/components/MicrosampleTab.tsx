import Microsample from 'pages/Microsample'

const MicrosampleTab = ({experimentId}: {experimentId: string}) => {
  return (
    <Microsample
      displayTableHeader={true}
      displayTableFilters={false}
      displayTableBody={true}
      filterWith={[{id: 'Code', value: experimentId, condition: 'startsWith'}]}
    />
  )
}

export default MicrosampleTab

