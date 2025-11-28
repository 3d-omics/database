import './App.css'
import { useLayoutEffect, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import AnimalTrial from 'pages/AnimalTrials'
import Nav from 'components/Navbar'
import AnimalSpecimen from 'pages/AnimalSpecimens'
// import Macrosample from 'pages/old_Macrosample'
import IntestinalSectionSample from 'pages/Macrosamples'
import Cryosection from 'pages/Cryosections'
import Microsample from 'pages/Microsamples'
import Home from 'pages/Home'
import NotFound from 'pages/NotFound'
import Footer from 'components/Footer'
import Metabolomics from 'pages/Metabolomics'
import MAGCatalogue from 'pages/MAGCatalogue'
import Genome from 'pages/Genome'
import MAGCatalogueList from 'pages/MAGCatalogueList'
import MicrosampleCompositionList from 'pages/MicrosampleCompositionList'
import MicrosampleComposition from 'pages/MicrosampleComposition'
import MacrosampleTaxonomyChart from 'pages/MacrosampleComposition'
import MacrosampleCompositionList from 'pages/MacrosampleCompositionList'
import AnimalSpecimenOverview from 'pages/AnimalSpecimenOverview'
import AnimalTrialOverview from 'pages/AnimalTrialOverview'
import MacrosampleOverview from 'pages/MacrosampleOverview'
import CryosectionOverview from 'pages/CryosectionOverview'

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
      else if (pathname === "/animal-trials") title = "Animal Trial"
      else if (pathname === "/animal-specimens") title = "Animal Specimen"
      else if (pathname === "/macrosamples") title = "Macrosample"
      else if (pathname === "/cryosections") title = "Cryosection"
      else if (pathname === "/microsamples") title = "Microsample"

      else if (pathname === "/metabolomics") title = "Metabolomics"
      else if (pathname === "/microsample-compositions") title = "Microsample Community Composition"
      else if (pathname === "/macrosample-compositions") title = "Macrosample Community Composition"
      else if (pathname === "/mag-catalogues") title = "MAG Catalogue List"

      else {
        const experimentMatch = pathname.match(/^\/animal-trials\/([^/]+)$/)
        if (experimentMatch) { // Match /animal-trials/:experimentName/
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
              const macroCompMatch = pathname.match(/^\/macrosample-compositions\/([^/]+)$/)
              if (macroCompMatch) {
                title = decodeURIComponent(macroCompMatch[1])
              } else { // Match /microsample-composition/:cryosection
                const microCompMatch = pathname.match(/^\/microsample-compositions\/([^/]+)$/)
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

          <Route path="/animal-trials" element={<AnimalTrial />} />
          <Route path="/animal-specimens" element={<AnimalSpecimen />} />
          <Route path="/macrosamples" element={<IntestinalSectionSample />} />
          <Route path="/cryosections" element={<Cryosection />} />
          <Route path="/microsamples" element={<Microsample />} />

          <Route path="/animal-trials/:experimentName" element={<AnimalTrialOverview />} />
          <Route path="/animal-specimens/:specimenName" element={<AnimalSpecimenOverview />} />
          <Route path="/macrosamples/:macrosampleName" element={<MacrosampleOverview />} />
          <Route path="/cryosections/:cryosectionName" element={<CryosectionOverview />} />

          <Route path="/mag-catalogues" element={<MAGCatalogueList />} />
          <Route path="/mag-catalogues/:experimentName" element={<MAGCatalogue />} />
          <Route path="/mag-catalogues/:experimentName/:genomeName" element={<Genome />} />

          <Route path="/macrosample-compositions" element={<MacrosampleCompositionList />} />
          <Route path="/macrosample-compositions/:experimentName" element={<MacrosampleTaxonomyChart />} />

          <Route path="/metabolomics" element={<Metabolomics />} />

          <Route path="/microsample-compositions" element={<MicrosampleCompositionList />} />
          <Route path="/microsample-compositions/:cryosection" element={<MicrosampleComposition />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div >
    </Wrapper>
  )
}

export default App
