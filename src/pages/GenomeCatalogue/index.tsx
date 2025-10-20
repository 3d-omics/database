import { useEffect, useState } from 'react'
import useFetchExcelFileData from 'hooks/useFetchExcelFileData'
import Table from './components/Table'
import ErrorBanner from 'components/ErrorBanner'
import PhyloCircosPlot from './components/PhyloCircosPlot'
import { useParams } from 'react-router-dom'
import BreadCrumbs from 'components/BreadCrumbs'
import { airtableConfig } from 'config/airtable'
import Loading from 'components/Loading'
import NotFound from 'pages/NotFound'
import useGetFirst100Data from 'hooks/useGetFirst100Data'

function GenomeCatalogue() {

  const { experimentName = '' } = useParams()
  const experimentId = experimentName.charAt(0)

  const csvFiles = import.meta.glob('../../assets/data/genome_metadata/*.csv', {
    eager: true,
    query: '?url',
    import: 'default'
  });
  const csvUrl = csvFiles[`../../assets/data/genome_metadata/experiment_${experimentId}_metadata.csv`];
  const { fetchExcel, fetchExcelError } = useFetchExcelFileData({ excelFile: csvUrl })

  const [metaData, setMetaData] = useState<Record<string, (string | number)[]>>({
    genome: [],
    phylum: [],
    completeness: [],
    contamination: [],
    length: [],
    N50: [],
    domain: [],
    class: [],
    order: [],
    family: [],
    genus: [],
    species: [],
  })

  //////////////////////////////////////////////////////////////////////

  const dataForPhylo = {
    name: '',
    children: Array.from(
      metaData.phylum.reduce((acc, phylum, idx) => {
        const genome = metaData.genome[idx]
        const class_ = metaData.class[idx]
        const order = metaData.order[idx]
        const family = metaData.family[idx]
        const genus = metaData.genus[idx]

        if (phylum && class_ && order && family && genus && genome) {
          const phylumKey = String(phylum)
          const classKey = String(class_)
          const orderKey = String(order)
          const familyKey = String(family)
          const genusKey = String(genus)

          if (!acc.has(phylumKey)) acc.set(phylumKey, new Map())
          const classMap = acc.get(phylumKey)!
          if (!classMap.has(classKey)) classMap.set(classKey, new Map())
          const orderMap = classMap.get(classKey)!
          if (!orderMap.has(orderKey)) orderMap.set(orderKey, new Map())
          const familyMap = orderMap.get(orderKey)!
          if (!familyMap.has(familyKey)) familyMap.set(familyKey, new Map())
          const genusMap = familyMap.get(familyKey)!
          if (!genusMap.has(genusKey)) genusMap.set(genusKey, [])
          genusMap.get(genusKey)!.push({ name: String(genome) })
        }
        return acc
      }, new Map<
        string, // phylum
        Map<
          string, // class
          Map<
            string, // order
            Map<
              string, // family
              Map<
                string, // genus
                { name: string }[] // genomes
              >
            >
          >
        >
      >()),
      ([phylum, classMap]) => ({
        name: phylum,
        children: Array.from(classMap, ([className, orderMap]) => ({
          name: className,
          children: Array.from(orderMap, ([orderName, familyMap]) => ({
            name: orderName,
            children: Array.from(familyMap, ([familyName, genusMap]) => ({
              name: familyName,
              children: Array.from(genusMap, ([genusName, genomes]) => ({
                name: genusName,
                children: genomes
              }))
            }))
          }))
        }))
      })
    ),
  }

  // console.log(dataForPhylo)

  //////////////////////////////////////////////////////////////////////

  const dataForCircos = {
    ...Object.fromEntries(
      metaData.genome.map((genome, idx) => {
        if (!genome) return null
        return [
          String(genome),
          {
            phylum: String(metaData.phylum[idx]),
            completeness: Number(metaData.completeness[idx]) || 0,
            contamination: Number(metaData.contamination[idx]) || 0,
            length: Number(metaData.length[idx]) || 0,
            N50: Number(metaData.N50[idx]) || 0,
          }
        ] as [string, { phylum: string; completeness: number; contamination: number; length: number; N50: number }]
      }).filter((x): x is [string, { phylum: string; completeness: number; contamination: number; length: number; N50: number }] => x !== null)
    )
  }

  // console.log(dataForCircos)

  //////////////////////////////////////////////////////////////////////

  useEffect(() => {
    Promise.all([fetchExcel()]).then(([meta]) => {
      if (meta) {
        const combined: any[] = meta.genome.map((_: unknown, i: number) => ({
          genome: meta.genome[i],
          phylum: meta.phylum[i].slice(3), // Remove 'p__' prefix
          completeness: meta.completeness[i],
          contamination: meta.contamination[i],
          length: meta.length[i],
          // N50: meta.N50[i],
          domain: meta.domain[i].slice(3),
          class: meta.class[i].slice(3),
          order: meta.order[i].slice(3),
          family: meta.family[i].slice(3),
          genus: meta.genus[i].slice(3),
          species: meta.species[i].slice(3),
        }))
        //　⬇️ If you want to sort the phylum by amount of items
        // const phylumOrder = ['Verrucomicrobiota', 'Bacteroidota', 'Pseudomonadota', 'Actinomycetota', 'Bacillota', 'Bacillota_A']
        // const sorted = combined.sort((a, b) => {
        //   const aIdx = phylumOrder.indexOf(a.phylum)
        //   const bIdx = phylumOrder.indexOf(b.phylum)
        //   if (aIdx === -1 && bIdx === -1) return 0
        //   if (aIdx === -1) return 1
        //   if (bIdx === -1) return -1
        //   return bIdx - aIdx
        // })
        const sorted = combined.sort((a, b) => b.phylum.localeCompare(a.phylum))
        setMetaData({
          genome: [...sorted.map(item => item.genome)],
          phylum: [...sorted.map(item => item.phylum)],
          completeness: [...sorted.map(item => item.completeness)],
          contamination: [...sorted.map(item => item.contamination)],
          length: [...sorted.map(item => item.length)],
          N50: [...sorted.map(item => item.N50)],
          domain: [...sorted.map(item => item.domain)],
          class: [...sorted.map(item => item.class)],
          order: [...sorted.map(item => item.order)],
          family: [...sorted.map(item => item.family)],
          genus: [...sorted.map(item => item.genus)],
          species: [...sorted.map(item => item.species)],
        })
      }
    })
  }, [])



  // For page 404 if the user mistypes the Animal Trial/Experiment name that does not exist
  const { animalTrialExperimentBaseId, animalTrialExperimentTableId, animalTrialExperimentViewId } = airtableConfig
  const { allData: data, allLoading: loading, allError: error, hasFetchedAllData } = useGetFirst100Data({
    AIRTABLE_BASE_ID: animalTrialExperimentBaseId,
    AIRTABLE_TABLE_ID: animalTrialExperimentTableId,
    AIRTABLE_VIEW_ID: animalTrialExperimentViewId,
    filterWith: [{ id: 'Name', value: experimentName }]
  })
  if (loading) {
    return <div className='h-[calc(100dvh-var(--navbar-height))]' data-testid='loading-dots-wrapper'><Loading /></div>
  }
  if (hasFetchedAllData && !loading && Array.isArray(data) && data.length === 0 && error == null) {
    return <NotFound />
  }





  return (
    <div className='min-h-screen'>

      <section className='page_padding pt-7'>

        <BreadCrumbs
          items={[
            { label: 'Home', link: '/' },
            { label: 'Genome Catalogues', link: '/genome-catalogues' },
            { label: experimentName },
          ]}
        />

        <header className='main_header mb-3'>{experimentName}&nbsp;MAG Catalogue</header>

        {fetchExcelError
          ? <div className='mt-4'><ErrorBanner>{fetchExcelError}</ErrorBanner></div>
          : <PhyloCircosPlot phyloData={dataForPhylo} circosData={dataForCircos} />
        }
      </section>

      {!fetchExcelError &&
        <Table
          allError={fetchExcelError}
          metaData={Object.fromEntries(
            Object.entries(metaData)
              .map(([key, arr]) => [key, arr.slice().reverse()])

          )}
          experimentName={experimentName}
        />
      }
    </div>
  )
}

export default GenomeCatalogue

