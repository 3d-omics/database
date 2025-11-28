import Cryosection from 'pages/Cryosections'

const CryosectionTab = ({ id }: { id: string }) => {
  return (
    <Cryosection
      displayTableHeader={true}
      displayTableFilters={false}
      displayTableBody={true}
      filterWith={[{ id: 'ID', value: id, condition: 'startsWith' }]}
    />
  )
}

export default CryosectionTab