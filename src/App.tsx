import './App.css'
import { useLayoutEffect } from 'react'
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

import Methods from 'pages/Methods'

import { SITE_TITLE } from 'config/siteTitle'

function App() {

  const Wrapper = ({ children }: { children: React.ReactElement }) => {
    const location = useLocation()
    useLayoutEffect(() => {
      document.documentElement.scrollTo(0, 0)
    }, [location.pathname])
    return children
  }

  // Every page with a PageHeader names the browser tab from it. This names it for
  // the rest — the home page, and pages still loading or not found — and, as a
  // layout effect, runs before the header's own effect on the same navigation
  const location = useLocation()
  useLayoutEffect(() => {
    document.title = location.pathname === '/' ? `Home | ${SITE_TITLE}` : SITE_TITLE
  }, [location])


  return (
    <Wrapper>
      <div className="text-ink bg-surface font-inter">
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

          <Route path="/methods/:methodName" element={<Methods />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div >
    </Wrapper>
  )
}

export default App
