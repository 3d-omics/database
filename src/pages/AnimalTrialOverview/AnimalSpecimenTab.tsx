import AnimalSpecimen from 'pages/AnimalSpecimen'

const AnimalSpecimenTab = ({experimentId}: {experimentId: string}) => {
  return (
    <AnimalSpecimen
      displayTableHeader={true}
      displayTableFilters={false}
      filterWith={[{id: 'Experiment_flat', value: experimentId}]}
      displayTableBody={true}
    />
  )
}

export default AnimalSpecimenTab