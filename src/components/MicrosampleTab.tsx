import Microsample from 'pages/Microsamples'

const MicrosampleTab = ({ id }: { id: string }) => {
  return (
    <Microsample
      displayTableHeader={true}
      displayTableFilters={false}
      displayTableBody={true}
      filterWith={[{ id: 'Code', value: id, condition: 'startsWith' }]}
    />
  )
}

export default MicrosampleTab

