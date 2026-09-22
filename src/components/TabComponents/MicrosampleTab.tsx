import Microsample from 'pages/Microsamples'

// A page that introduces microsamples in its own header leaves out the table's description
const MicrosampleTab = ({ id, displayTableDescription = true }: { id: string, displayTableDescription?: boolean }) => {
  return (
    <Microsample
      displayPageHeader={false}
      displayTableHeader={true}
      displayTableDescription={displayTableDescription}
      displayTableFilters={false}
      displayTableBody={true}
      filterWith={[{ id: 'Code', value: id, condition: 'startsWith' }]}
    />
  )
}

export default MicrosampleTab

