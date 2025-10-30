import './App.css'
import { useLayoutEffect, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import AnimalTrialExperiment from 'pages/AnimalTrialExperiment'
import Nav from 'components/Navbar'
import AnimalSpecimen from 'pages/AnimalSpecimen'
import Macrosample from 'pages/Macrosample'
import IntestinalSectionSample from 'pages/IntestinalSectionSample'
import Cryosection from 'pages/Cryosection'
import Microsample from 'pages/Microsample'
import Home from 'pages/Home'
import NotFound from 'pages/NotFound'
import Footer from 'components/Footer'
import Metabolomics from 'pages/Metabolomics'
import GenomeCatalogue from 'pages/GenomeCatalogue'
import AnimalTrialOverview from 'pages/AnimalTrialOverview'
import Genome from 'pages/Genome'
import GenomeCatalogueList from 'pages/GenomeCatalogueList'
import MicrosampleCompositionList from 'pages/MicrosampleCompositionList'
import MicrosampleComposition from 'pages/MicrosampleComposition'
import MacrosampleTaxonomyChart from 'pages/MacrosampleComposition'
import MacrosampleCompositionList from 'pages/MacrosampleCompositionList'

function App() {

  const Wrapper = ({ children }: { children: React.ReactElement }) => {
    const location = useLocation()
    useLayoutEffect(() => {
      document.documentElement.scrollTo(0, 0)
    }, [location.pathname])
    return children
  }


  const location = useLocation()
  useEffect(() => {
    const BASE_TITLE = "3d'omics Data Portal"
    const getTitle = (pathname: string) => {
      let title = ""
      if (pathname === "/") title = "Home"
      else if (pathname === "/animal-trial-experiment") title = "Animal Trial/Experiment"
      else if (pathname === "/animal-specimen") title = "Animal Specimen"
      else if (pathname === "/macrosample") title = "Macrosample"
      else if (pathname === "/intestinal-section-sample") title = "Intestinal Section Sample"
      else if (pathname === "/cryosection") title = "Cryosection"
      else if (pathname === "/microsample") title = "Microsample"

      else if (pathname === "/metabolomics") title = "Metabolomics"
      else if (pathname === "/microsample-composition") title = "Genome Composition"
      else if (pathname === "/macrosample-composition") title = "Genome Composition"
      else if (pathname === "/genome-catalogues") title = "Genome Catalogue List"

      else {
        const experimentMatch = pathname.match(/^\/animal-trial-experiment\/([^/]+)$/)
        if (experimentMatch) { // Match /animal-trial-experiment/:experimentName/
          title = decodeURIComponent(experimentMatch[1])
        } else { // Match /genome-catalogues/:experimentName/:genomeName
          const genomeMatch = pathname.match(/^\/genome-catalogues\/([^/]+)\/([^/]+)$/)
          if (genomeMatch) {
            title = `${decodeURIComponent(genomeMatch[2])} | ${decodeURIComponent(genomeMatch[1])}`
          } else { // Match /genome-catalogues/:experimentName
            const catalogueMatch = pathname.match(/^\/genome-catalogues\/([^/]+)$/)
            if (catalogueMatch) {
              title = decodeURIComponent(catalogueMatch[1])
            }
          }
        }
      }
      return title ? `${title} | ${BASE_TITLE}` : BASE_TITLE
    }
    document.title = getTitle(location.pathname)
  }, [location])


  return (
    <Wrapper>
      <div className="text-custom_black font-inter">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/animal-trial-experiment" element={<AnimalTrialExperiment />} />
          <Route path="/animal-specimen" element={<AnimalSpecimen />} />
          <Route path="/macrosample" element={<Macrosample />} />
          <Route path="/intestinal-section-sample" element={<IntestinalSectionSample />} />
          <Route path="/cryosection" element={<Cryosection />} />
          <Route path="/microsample" element={<Microsample />} />

          <Route path="/animal-trial-experiment/:experimentName" element={<AnimalTrialOverview />} />

          <Route path="/genome-catalogues" element={<GenomeCatalogueList />} />
          <Route path="/genome-catalogues/:experimentName" element={<GenomeCatalogue />} />
          <Route path="/genome-catalogues/:experimentName/:genomeName" element={<Genome />} />

          <Route path="/macrosample-composition" element={<MacrosampleCompositionList />} />
          <Route path="/macrosample-composition/:experimentName" element={<MacrosampleTaxonomyChart />} />

          <Route path="/metabolomics" element={<Metabolomics />} />

          <Route path="/microsample-composition" element={<MicrosampleCompositionList />} />
          <Route path="/microsample-composition/:cryosection" element={<MicrosampleComposition />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div >
    </Wrapper>
  )
}

export default App
