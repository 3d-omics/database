import './App.css'
import { useLayoutEffect, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import AnimalTrial from 'pages/AnimalTrial'
import Nav from 'components/Navbar'
import AnimalSpecimen from 'pages/AnimalSpecimen'
// import Macrosample from 'pages/old_Macrosample'
import IntestinalSectionSample from 'pages/Macrosample'
import Cryosection from 'pages/Cryosection'
import Microsample from 'pages/Microsample'
import Home from 'pages/Home'
import NotFound from 'pages/NotFound'
import Footer from 'components/Footer'
import Metabolomics from 'pages/Metabolomics'
import MAGCatalogue from 'pages/MAGCatalogue'
import AnimalTrialOverview from 'pages/AnimalTrialOverview'
import Genome from 'pages/Genome'
import MAGCatalogueList from 'pages/MAGCatalogueList'
import MicrosampleCompositionList from 'pages/MicrosampleCompositionList'
import MicrosampleComposition from 'pages/MicrosampleComposition'
import MacrosampleTaxonomyChart from 'pages/MacrosampleComposition'
import MacrosampleCompositionList from 'pages/MacrosampleCompositionList'
import AnimalSpecimenOverview from 'pages/AnimalSpecimenOverview'

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
    const BASE_TITLE = "3D'omics Data Portal"
    const getTitle = (pathname: string) => {
      let title = ""
      if (pathname === "/") title = "Home"
      else if (pathname === "/animal-trial") title = "Animal Trial"
      else if (pathname === "/animal-specimen") title = "Animal Specimen"
      else if (pathname === "/macrosample") title = "Macrosample"
      else if (pathname === "/cryosection") title = "Cryosection"
      else if (pathname === "/microsample") title = "Microsample"

      else if (pathname === "/metabolomics") title = "Metabolomics"
      else if (pathname === "/microsample-composition") title = "Microsample Community Composition"
      else if (pathname === "/macrosample-composition") title = "Macrosample Community Composition"
      else if (pathname === "/mag-catalogues") title = "MAG Catalogue List"

      else {
        const experimentMatch = pathname.match(/^\/animal-trial\/([^/]+)$/)
        if (experimentMatch) { // Match /animal-trial/:experimentName/
          title = decodeURIComponent(experimentMatch[1])
        } else { // Match /mag-catalogues/:experimentName/:genomeName
          const genomeMatch = pathname.match(/^\/mag-catalogues\/([^/]+)\/([^/]+)$/)
          if (genomeMatch) {
            title = `${decodeURIComponent(genomeMatch[2])} | ${decodeURIComponent(genomeMatch[1])}`
          } else { // Match /mag-catalogues/:experimentName
            const catalogueMatch = pathname.match(/^\/mag-catalogues\/([^/]+)$/)
            if (catalogueMatch) {
              title = decodeURIComponent(catalogueMatch[1])
            } else { // Match /macrosample-composition/:experimentName
              const macroCompMatch = pathname.match(/^\/macrosample-composition\/([^/]+)$/)
              if (macroCompMatch) {
                title = decodeURIComponent(macroCompMatch[1])
              } else { // Match /microsample-composition/:cryosection
                const microCompMatch = pathname.match(/^\/microsample-composition\/([^/]+)$/)
                if (microCompMatch) {
                  title = decodeURIComponent(microCompMatch[1])
                }
              }
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
      <div className="text-custom_black bg-white font-inter">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/animal-trial" element={<AnimalTrial />} />
          <Route path="/animal-specimen" element={<AnimalSpecimen />} />
          <Route path="/macrosample" element={<IntestinalSectionSample />} />
          <Route path="/cryosection" element={<Cryosection />} />
          <Route path="/microsample" element={<Microsample />} />

          <Route path="/animal-trial/:experimentName" element={<AnimalTrialOverview />} />
          <Route path="/animal-specimen/:specimenName" element={<AnimalSpecimenOverview />} />

          <Route path="/mag-catalogues" element={<MAGCatalogueList />} />
          <Route path="/mag-catalogues/:experimentName" element={<MAGCatalogue />} />
          <Route path="/mag-catalogues/:experimentName/:genomeName" element={<Genome />} />

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
