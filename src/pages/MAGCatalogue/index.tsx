import { useMemo } from 'react'
import Table from './components/Table'
import PhyloCircosPlot from './components/PhyloCircosPlot'
import { useParams } from 'react-router-dom'
import BreadCrumbs from 'components/BreadCrumbs'
import useValidateParams from 'hooks/useValidateParams'
import ParamsValidator from 'components/ParamsValidator'
import { useGenomeJsonFile } from 'hooks/useJsonData'
import ErrorBanner from 'components/ErrorBanner'
import animalTrialExperimentData from 'assets/data/airtable/animaltrialexperiment.json'
import experimentsWithGenomeInfo from 'assets/data/airtable/experimentswithgenomeinfo.json'
import { Link } from 'react-router-dom'

const MAGCatalogue = () => {
  const { experimentName = '' } = useParams()
  const experimentId = experimentName.charAt(0)

  const { validating, notFound } = useValidateParams({
    tableType: 'animalTrialExperiment',
    filterId: 'Name',
    filterValue: experimentName
  })

  const trialDoiAndLink = useMemo(() => {
    const info = experimentsWithGenomeInfo.find(
      (record) => record.fields.ID === experimentId
    )
    return {
      doi: info?.fields.doi || null,
      link: info?.fields.link || null
    }
  }, [experimentId])

  // Filter data to find the specific experiment
  const data = useMemo(() => {
    return (animalTrialExperimentData).filter((record) => {
      const name = record.fields.Name
      return name && String(name).toLowerCase() === experimentName.toLowerCase()
    })
  }, [experimentName])

  const experiment = data[0].fields

  // Load genome metadata using the helper hook
  const rawMetaData = useGenomeJsonFile(
    'genome_metadata',
    `experiment_${experimentId}_metadata`
  )

  // Process and sort metadata
  const metaData = useMemo(() => {
    if (!rawMetaData) {
      return {
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
      }
    }

    // Combine all data into rows
    const combined: any[] = rawMetaData.genome.map((_: unknown, i: number) => ({
      genome: rawMetaData.genome[i],
      phylum: String(rawMetaData.phylum[i]).slice(3), // Remove 'p__' prefix
      completeness: rawMetaData.completeness[i],
      contamination: rawMetaData.contamination[i],
      length: rawMetaData.length[i],
      N50: rawMetaData.N50?.[i],
      domain: String(rawMetaData.domain[i]).slice(3),
      class: String(rawMetaData.class[i]).slice(3),
      order: String(rawMetaData.order[i]).slice(3),
      family: String(rawMetaData.family[i]).slice(3),
      genus: String(rawMetaData.genus[i]).slice(3),
      species: String(rawMetaData.species[i]).slice(3),
    }))

    // Sort by phylum
    const sorted = combined.sort((a, b) => b.phylum.localeCompare(a.phylum))

    // Convert back to column format
    return {
      genome: sorted.map(item => item.genome),
      phylum: sorted.map(item => item.phylum),
      completeness: sorted.map(item => item.completeness),
      contamination: sorted.map(item => item.contamination),
      length: sorted.map(item => item.length),
      N50: sorted.map(item => item.N50),
      domain: sorted.map(item => item.domain),
      class: sorted.map(item => item.class),
      order: sorted.map(item => item.order),
      family: sorted.map(item => item.family),
      genus: sorted.map(item => item.genus),
      species: sorted.map(item => item.species),
    }
  }, [rawMetaData])

  // Build hierarchical data for phylogenetic tree
  const dataForPhylo = useMemo(() => {
    return {
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
  }, [metaData])

  // Build data for Circos plot
  const dataForCircos = useMemo(() => {
    return Object.fromEntries(
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
        ] as [string, {
          phylum: string
          completeness: number
          contamination: number
          length: number
          N50: number
        }]
      }).filter((x): x is [string, {
        phylum: string
        completeness: number
        contamination: number
        length: number
        N50: number
      }] => x !== null)
    )
  }, [metaData])

  // Reverse metadata for table display
  const reversedMetaData = useMemo(() => {
    return Object.fromEntries(
      Object.entries(metaData).map(([key, arr]) => [key, arr.slice().reverse()])
    )
  }, [metaData])

  const hasError = !rawMetaData

  return (
    <ParamsValidator validating={validating} notFound={notFound}>
      <div className='min-h-screen'>
        <section className='page_padding pt-7'>
          <BreadCrumbs
            items={[
              { label: 'Data Portal Home', link: '/' },
              { label: 'MAG Catalogues', link: '/mag-catalogues' },
              { label: experimentName },
            ]}
          />

          <header className='main_header mb-3'>{experimentName}&nbsp;MAG Catalogue</header>

          <div className='flex gap-4 text-sm text-gray-500 mb-3 font-thin [&>span]:flex [&>span]:gap-1'>
            <span>
              Number of MAGs:&nbsp;
              <b>{experiment['MAG catalogue - Number of MAGs']}</b>
            </span>
            <span>
              Average completeness:&nbsp;
              <b>{experiment['MAG catalogue - Average completeness (%)']}%</b>
            </span>
            <span>
              Average contamination:&nbsp;
              <b>{experiment['MAG catalogue - Average contamination (%)']}%</b>
            </span>
            <span>
              New species:&nbsp;
              <b>{experiment['MAG catalogue - New species (%)']}%</b>
            </span>
          </div>

          {(trialDoiAndLink.link || trialDoiAndLink.doi) &&
            <div className='flex gap-4 text-sm text-gray-500 mb-3 font-thin [&>span]:flex [&>span]:gap-1'>
              {trialDoiAndLink.link &&
                <span>
                  Link:&nbsp;
                  <Link to={trialDoiAndLink.link} target="_blank" rel="noopener noreferrer" className="link">
                    <b>{trialDoiAndLink.link}</b>
                  </Link>
                </span>
              }
              {trialDoiAndLink.doi &&
                <span>
                  DOI:&nbsp;
                  <b>{trialDoiAndLink.doi}</b>
                </span>
              }
            </div>
          }

          <div className='mb-8'>
            {experiment['MAG catalogue description']?.split('\n').map((line: string, index: number) => (
              <span key={index} className='text-sm text-gray-500'>{line}<br /></span>
            ))}
          </div>

          {hasError ? (
            <ErrorBanner>Failed to load genome metadata</ErrorBanner>
          ) : (
            <PhyloCircosPlot phyloData={dataForPhylo} circosData={dataForCircos} />
          )}
        </section>

        {!hasError && (
          <Table
            metaData={reversedMetaData}
            experimentName={experimentName}
          />
        )}
      </div>
    </ParamsValidator>
  )
}

export default MAGCatalogue
