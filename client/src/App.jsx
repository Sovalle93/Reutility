import { Routes, Route } from 'react-router-dom'
import { Layout } from './shared/layouts/Layout'
import { HomePage } from './modules/plazas/pages/HomePage'
import { PlazasPage } from './modules/plazas/pages/PlazasPage'
import { PlazaDetailPage } from './modules/plazas/pages/PlazaDetailPage'
import { RankingPage } from './modules/plazas/pages/RankingPage'
import { AlertasPage } from './modules/plazas/pages/AlertasPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/plazas" element={<PlazasPage />} />
        <Route path="/plazas/:id" element={<PlazaDetailPage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/alertas" element={<AlertasPage />} />
      </Routes>
    </Layout>
  )
}

export default App