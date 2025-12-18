import './App.css'
import { useLayoutEffect, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

import Nav from 'components/Navbar'
import Footer from 'components/Footer'
import NotFound from 'pages/NotFound'
import Home from 'pages/Home'

import AnimalTrial from 'pages/AnimalTrials'
import AnimalSpecimen from 'pages/AnimalSpecimens'
import Macrosample from 'pages/Macrosamples'
import Cryosection from 'pages/Cryosections'
import Microsample from 'pages/Microsamples'

import MacrosampleCompositionList from 'pages/MacrosampleCompositionList'

import MetabolomicsList from 'pages/MetabolomicsList'
import MetabolomicsVolcano from 'pages/MetabolomicsVolcano'
import MetabolomicsHeatmap from 'pages/MetabolomicsHeatmap'

import MAGCatalogueList from 'pages/MAGCatalogueList'
import MAGCatalogue from 'pages/MAGCatalogue'
import Genome from 'pages/Genome'

import MicrosampleComposition from 'pages/MicrosampleComposition'
import MacrosampleComposition from 'pages/MacrosampleComposition'

import AnimalTrialOverview from 'pages/AnimalTrialOverview'
import AnimalSpecimenOverview from 'pages/AnimalSpecimenOverview'
import MacrosampleOverview from 'pages/MacrosampleOverview'
import CryosectionOverview from 'pages/CryosectionOverview'

import DownloadDatabaseSchema from 'pages/DownloadDatabaseSchema'

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
      else if (pathname === "/animal-trials") title = "Animal Trials"
      else if (pathname === "/animal-specimens") title = "Animal Specimens"
      else if (pathname === "/macrosamples") title = "Macrosamples"
      else if (pathname === "/cryosections") title = "Cryosections"
      else if (pathname === "/microsamples") title = "Microsamples"
      else if (pathname === "/metabolomics") title = "Metabolomics"
      else if (pathname === "/macrosample-compositions") title = "Macrosample Community Composition"
      else if (pathname === "/mag-catalogues") title = "MAG Catalogue List"
      else if (pathname === "/database-schema") title = "Download Database Schema"
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
              } else { // Match /metabolomics/volcano/:experimentName
                const volcanoMatch = pathname.match(/^\/metabolomics\/volcano\/([^/]+)$/)
                if (volcanoMatch) {
                  title = `${decodeURIComponent(volcanoMatch[1])} - Volcano Plot`
                } else { // Match /metabolomics/heatmap/:experimentName
                  const heatmapMatch = pathname.match(/^\/metabolomics\/heatmap\/([^/]+)$/)
                  if (heatmapMatch) {
                    title = `${decodeURIComponent(heatmapMatch[1])} - Heatmap`
                  } else { // Match /animal-specimens/:specimenName
                    const specimenMatch = pathname.match(/^\/animal-specimens\/([^/]+)$/)
                    if (specimenMatch) {
                      title = decodeURIComponent(specimenMatch[1])
                    } else { // Match /macrosamples/:macrosampleName
                      const macrosampleMatch = pathname.match(/^\/macrosamples\/([^/]+)$/)
                      if (macrosampleMatch) {
                        title = decodeURIComponent(macrosampleMatch[1])
                      } else { // Match /cryosections/:cryosectionName
                        const cryosectionMatch = pathname.match(/^\/cryosections\/([^/]+)$/)
                        if (cryosectionMatch) {
                          title = decodeURIComponent(cryosectionMatch[1])
                        }
                      }
                    }
                  }
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
          <Route path="/macrosamples" element={<Macrosample />} />
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
          <Route path="/macrosample-compositions/:experimentName" element={<MacrosampleComposition />} />

          <Route path="/metabolomics" element={<MetabolomicsList />} />
          <Route path="/metabolomics/volcano/:experimentName" element={<MetabolomicsVolcano />} />
          <Route path="/metabolomics/heatmap/:experimentName" element={<MetabolomicsHeatmap />} />

          <Route path="/microsample-compositions/:cryosection" element={<MicrosampleComposition />} />

          <Route path="/database-schema" element={<DownloadDatabaseSchema />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div >
    </Wrapper>
  )
}

export default App
